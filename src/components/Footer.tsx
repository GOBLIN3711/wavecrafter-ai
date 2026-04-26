'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Music, Mail, Settings } from 'lucide-react';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const [adminOpen, setAdminOpen] = useState(false);

  const tagline = settings['footer_tagline_' + language] || t.footer.tagline;
  const copyright = settings['site_copyright_' + language] || t.footer.copyright;
  const email = settings.site_email || 'grossboss@inbox.ru';

  return (
    <>
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Music className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                WaveCrafter<span className="text-amber-400"> AI</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm text-zinc-500 max-w-md">
              {tagline}
            </p>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>

            {/* Copyright */}
            <p className="text-xs text-zinc-600">
              {copyright}
            </p>
          </div>
        </div>

        {/* Admin Button - subtle, bottom-right */}
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAdminOpen(true)}
            className="h-9 w-9 text-zinc-700 hover:text-amber-400 hover:bg-white/5 rounded-full transition-colors"
            aria-label="Панель управления"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </footer>

      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />
    </>
  );
}
