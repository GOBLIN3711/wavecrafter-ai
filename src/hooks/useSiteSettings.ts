'use client';

import { useState, useEffect, useCallback } from 'react';

interface SiteSettings {
  [key: string]: string;
}

let cachedSettings: SiteSettings | null = null;
let settingsListeners: Array<() => void> = [];
let fetchPromise: Promise<SiteSettings> | null = null;

function subscribeSettings(listener: () => void) {
  settingsListeners.push(listener);
  return () => {
    settingsListeners = settingsListeners.filter(l => l !== listener);
  };
}

function notifyListeners() {
  settingsListeners.forEach(l => l());
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  fetchPromise = null;
  notifyListeners();
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    // Initialize from cache if available (SSR-safe)
    if (typeof window !== 'undefined' && cachedSettings) {
      return cachedSettings;
    }
    return {};
  });
  const [isLoading, setIsLoading] = useState(() => {
    return typeof window === 'undefined' || !cachedSettings;
  });

  useEffect(() => {
    if (cachedSettings) {
      // Already initialized from cache
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch('/api/settings')
        .then(res => res.json())
        .then((data: SiteSettings) => {
          cachedSettings = data;
          return data;
        })
        .catch(() => ({}))
        .finally(() => {
          fetchPromise = null;
        });
    }

    fetchPromise.then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
  }, []);

  // Listen for cache invalidations from other components (e.g., admin panel)
  useEffect(() => {
    const unsub = subscribeSettings(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then((data: SiteSettings) => {
          cachedSettings = data;
          setSettings(data);
        })
        .catch(() => {});
    });
    return unsub;
  }, []);

  return { settings, isLoading };
}
