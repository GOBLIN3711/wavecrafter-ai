'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  Music,
  Lock,
  Loader2,
  FileAudio,
  X,
  RefreshCw,
  Mail,
  Save,
  Settings,
  Eye,
  EyeOff,
  LogOut,
  Globe,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { invalidateSettingsCache } from '@/hooks/useSiteSettings';

// ─── Types ───────────────────────────────────────────────
interface TrackData {
  id: string;
  title: string;
  titleRu: string;
  description: string | null;
  genre: string | null;
  duration: number | null;
  fileName: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessageData {
  id: string;
  name: string;
  email: string;
  company: string | null;
  venueType: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Password helpers ────────────────────────────────────
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

const DEFAULT_HASH = simpleHash('wavecrafter2025');
const STORAGE_KEY = 'wc_admin_auth';

let authListeners: Array<() => void> = [];

function subscribeAuth(listener: () => void) {
  authListeners.push(listener);
  return () => {
    authListeners = authListeners.filter(l => l !== listener);
  };
}

function getAuthSnapshot(): string {
  if (typeof window === 'undefined') return 'checking';
  return localStorage.getItem(STORAGE_KEY) || '';
}

function getServerAuthSnapshot(): string {
  return '';
}

function setAuthInStorage(value: string) {
  localStorage.setItem(STORAGE_KEY, value);
  authListeners.forEach(l => l());
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEY);
  authListeners.forEach(l => l());
}

// ─── Settings field definitions ──────────────────────────
interface SettingField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const RU_FIELDS: SettingField[] = [
  { key: 'hero_headline_ru', label: 'Главный заголовок', placeholder: 'Создаём уникальный звук для вашего заведения', multiline: true },
  { key: 'hero_subheadline_ru', label: 'Подзаголовок', placeholder: 'Авторская музыка, созданная эксклюзивно для вашего бренда...', multiline: true },
  { key: 'hero_cta_ru', label: 'Кнопка призыва к действию', placeholder: 'Связаться с нами' },
  { key: 'about_title_ru', label: 'Заголовок "О нас"', placeholder: 'О WaveCrafter AI' },
  { key: 'about_description_ru', label: 'Описание компании', placeholder: 'WaveCrafter AI — музыкальная продакшн-компания...', multiline: true },
  { key: 'about_tagline_ru', label: 'Теглайн компании', placeholder: 'Музыка, созданная специально для вашего заведения...', multiline: true },
  { key: 'services_title_ru', label: 'Заголовок "Услуги"', placeholder: 'Как мы работаем' },
  { key: 'services_subtitle_ru', label: 'Подзаголовок услуг', placeholder: 'Наш проверенный шестиступенчатый процесс...', multiline: true },
  { key: 'why_title_ru', label: 'Заголовок "Почему мы"', placeholder: 'Почему авторская музыка?' },
  { key: 'why_subtitle_ru', label: 'Подзаголовок', placeholder: 'Научные и бизнес-аргументы...', multiline: true },
  { key: 'pricing_title_ru', label: 'Заголовок "Цены"', placeholder: 'Цены' },
  { key: 'pricing_text_ru', label: 'Текст цены', placeholder: 'Каждый проект уникален...', multiline: true },
  { key: 'contact_title_ru', label: 'Заголовок "Контакты"', placeholder: 'Связаться с нами' },
  { key: 'contact_description_ru', label: 'Описание контактов', placeholder: 'Готовы преобразить атмосферу вашего заведения?...', multiline: true },
  { key: 'footer_tagline_ru', label: 'Теглайн футера', placeholder: 'WaveCrafter AI — Создаём уникальный звук для вашего бизнеса по всему миру' },
];

const EN_FIELDS: SettingField[] = [
  { key: 'hero_headline_en', label: 'Main headline', placeholder: 'We Create Unique Sound for Your Venue', multiline: true },
  { key: 'hero_subheadline_en', label: 'Subheadline', placeholder: 'Bespoke music compositions crafted exclusively for your brand...', multiline: true },
  { key: 'hero_cta_en', label: 'CTA button text', placeholder: 'Get in Touch' },
  { key: 'about_title_en', label: 'About title', placeholder: 'About WaveCrafter AI' },
  { key: 'about_description_en', label: 'About description', placeholder: 'WaveCrafter AI is a music production company...', multiline: true },
  { key: 'about_tagline_en', label: 'Company tagline', placeholder: 'Music crafted specifically for your venue...', multiline: true },
  { key: 'services_title_en', label: 'Services title', placeholder: 'How We Work' },
  { key: 'services_subtitle_en', label: 'Services subtitle', placeholder: 'Our proven six-step process...', multiline: true },
  { key: 'why_title_en', label: 'Why custom title', placeholder: 'Why Custom Music?' },
  { key: 'why_subtitle_en', label: 'Why custom subtitle', placeholder: 'The science and business case...', multiline: true },
  { key: 'pricing_title_en', label: 'Pricing title', placeholder: 'Pricing' },
  { key: 'pricing_text_en', label: 'Pricing text', placeholder: 'Each project is unique...', multiline: true },
  { key: 'contact_title_en', label: 'Contact title', placeholder: 'Get in Touch' },
  { key: 'contact_description_en', label: 'Contact description', placeholder: "Ready to transform your venue's atmosphere?...", multiline: true },
  { key: 'footer_tagline_en', label: 'Footer tagline', placeholder: 'WaveCrafter AI — Crafting sonic identities worldwide' },
];

const GENERAL_FIELDS: SettingField[] = [
  { key: 'site_email', label: 'Email для связи', placeholder: 'grossboss@inbox.ru' },
  { key: 'site_copyright_ru', label: 'Копирайт (русский)', placeholder: '© 2025 WaveCrafter AI. Все права защищены.' },
  { key: 'site_copyright_en', label: 'Copyright (English)', placeholder: '© 2025 WaveCrafter AI. All rights reserved.' },
];

// ─── Main AdminPanel ─────────────────────────────────────
export function AdminPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [settingsHash, setSettingsHash] = useState('');

  const storedAuth = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  const checkPassword = useCallback((pw: string): boolean => {
    // First check default hash
    if (simpleHash(pw) === DEFAULT_HASH) return true;
    // Then check custom stored hash
    if (settingsHash && simpleHash(pw) === settingsHash) return true;
    return false;
  }, [settingsHash]);

  const isAuthenticated = !!storedAuth;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data.admin_password_hash) {
            setSettingsHash(data.admin_password_hash);
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLogin = useCallback(() => {
    if (checkPassword(password)) {
      setAuthInStorage(simpleHash(password));
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('Неверный пароль');
    }
  }, [password, checkPassword]);

  const handleLogout = useCallback(() => {
    clearAuthStorage();
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-sm mx-4 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Lock className="h-7 w-7 text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Панель управления</h1>
            <p className="text-sm text-zinc-400">Введите пароль для входа</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="admin-pw" className="text-zinc-300 text-sm">Пароль</Label>
              <Input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль..."
                className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                autoFocus
              />
              {authError && <p className="text-xs text-red-400 mt-1">{authError}</p>}
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold h-11"
            >
              Войти
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-zinc-500 hover:text-white"
            >
              Назад на сайт
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]">
      {/* Admin Header */}
      <header className="flex-shrink-0 border-b border-white/10 bg-[#0d0d0d] px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Settings className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Панель управления</h1>
              <p className="text-xs text-zinc-500 hidden sm:block">WaveCrafter AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white gap-1.5 h-8 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Закрыть</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-400 gap-1.5 h-8 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="music" className="h-full flex flex-col">
          {/* Tab navigation - horizontal on desktop, compact on mobile */}
          <div className="flex-shrink-0 border-b border-white/5 bg-[#0d0d0d] px-4 sm:px-6 overflow-x-auto">
            <div className="max-w-7xl mx-auto">
              <TabsList className="bg-transparent h-auto p-0 gap-0 w-full sm:w-auto">
                <TabButton icon={Music} label="Музыка" value="music" />
                <TabButton icon={MessageSquare} label="Сообщения" value="messages" />
                <TabButton icon={Globe} label="Тексты сайта" value="texts" />
                <TabButton icon={Settings} label="Настройки" value="settings" />
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="music" className="h-full m-0">
              <MusicTab />
            </TabsContent>
            <TabsContent value="messages" className="h-full m-0">
              <MessagesTab />
            </TabsContent>
            <TabsContent value="texts" className="h-full m-0">
              <TextsTab />
            </TabsContent>
            <TabsContent value="settings" className="h-full m-0">
              <SettingsTab onPasswordChange={() => {}} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Tab button component ────────────────────────────────
function TabButton({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-2 px-3 sm:px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:text-amber-400 text-zinc-500 hover:text-zinc-300 transition-colors text-xs sm:text-sm whitespace-nowrap"
    >
      <Icon className="h-4 w-4" />
      {label}
    </TabsTrigger>
  );
}

// ─── Music Tab ───────────────────────────────────────────
function MusicTab() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formTitleRu, setFormTitleRu] = useState('');
  const [formGenre, setFormGenre] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllTracks = useCallback(async () => {
    setLoading(true);
    try {let audioUrl: string | null = null;
      let fileName: string | null = null;
      if (formFile) {
        const fileBuffer = await formFile.arrayBuffer();
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-filename': formFile.name,
            'content-type': formFile.type || 'application/octet-stream',
          },
          body: fileBuffer,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || 'Upload failed');
        }
        const blobData = await uploadRes.json();
        audioUrl = blobData.url;
        fileName = formFile.name;
      }

      const res = await fetch('/api/tracks');
      if (res.ok) {
        const data = await res.json();
        setTracks(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTracks();
  }, [fetchAllTracks]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4', 'audio/x-m4a', 'audio/webm', 'audio/mp3'];
      const validExt = /\.(mp3|wav|ogg|aac|m4a|webm)$/i.test(file.name);
      if (validTypes.includes(file.type) || validExt) {
        setFormFile(file);
        if (!formTitle) {
          const name = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
          setFormTitle(name);
        }
        if (!formTitleRu) {
          const name = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
          setFormTitleRu(name);
        }
      }
    } else {
      setFormFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const resetForm = () => {
    setFormTitle(''); setFormTitleRu(''); setFormGenre(''); setFormDescription('');
    setFormFile(null); setShowAddForm(false);
  };

  const handleAddTrack = async () => {
    if (!formTitle.trim() || !formTitleRu.trim()) return;
    setUploading(true);
    try {
     let audioUrl: string | null = null;
      let fileName: string | null = null;
      if (formFile) {
       const fileBuffer = await formFile.arrayBuffer();
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-filename': formFile.name,
            'content-type': formFile.type || 'application/octet-stream',
          },
          body: fileBuffer,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || 'Upload failed');
        }
        const blobData = await uploadRes.json();
        audioUrl = blobData.url;
       
        fileName = formFile.name;
      }
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          titleRu: formTitleRu.trim(),
          genre: formGenre.trim() || null,
          description: formDescription.trim() || null,
          fileName,
          audioUrl,
        }),
      });
      if (res.ok) { resetForm(); fetchAllTracks(); }
      else { const err = await res.json(); alert(err.error || 'Ошибка создания трека'); }
    } catch (e) { alert('Ошибка: ' + (e instanceof Error ? e.message : String(e))); }
    finally { setUploading(false); }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm('Удалить этот трек?')) return;
    setActionLoading(id);
    try {
      await fetch(`/api/tracks/${id}`, {
        method: 'DELETE',
      });
      fetchAllTracks();
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleMoveTrack = async (id: string, direction: 'up' | 'down') => {
    setActionLoading(id);
    try {
      const idx = tracks.findIndex((t) => t.id === id);
      if (idx === -1) return;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= tracks.length) return;
      const currentOrder = tracks[idx].order;
      const swapOrder = tracks[swapIdx].order;
      await Promise.all([
        fetch(`/api/tracks/${tracks[idx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: swapOrder }) }),
        fetch(`/api/tracks/${tracks[swapIdx].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: currentOrder }) }),
      ]);
      fetchAllTracks();
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
          Треки ({tracks.length})
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchAllTracks} disabled={loading}
            className="text-zinc-500 hover:text-zinc-300 h-8 text-xs gap-1">
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-black gap-1.5 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Добавить трек
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Add Track Form */}
          {showAddForm && (
            <div className="border border-white/10 bg-white/[0.02] rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Новый трек</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}
                  className="h-7 w-7 text-zinc-500 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-amber-500/50 bg-amber-500/5' :
                formFile ? 'border-green-500/30 bg-green-500/5' :
                'border-white/10 hover:border-white/20'
              }`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
                {formFile ? (
                  <div className="space-y-2">
                    <FileAudio className="h-8 w-8 text-green-400 mx-auto" />
                    <p className="text-sm text-green-400 font-medium">{formFile.name}</p>
                    <p className="text-xs text-zinc-500">{(formFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-zinc-500 mx-auto" />
                    <p className="text-sm text-zinc-400">Перетащите аудиофайл или нажмите для выбора</p>
                    <p className="text-xs text-zinc-600">MP3, WAV, OGG, AAC — макс. 50 МБ</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Название (English) *</Label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Track title" className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Название (Русский) *</Label>
                  <Input value={formTitleRu} onChange={(e) => setFormTitleRu(e.target.value)}
                    placeholder="Название трека" className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Жанр</Label>
                  <Input value={formGenre} onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="Ambient / Chill" className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Описание</Label>
                  <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Необязательно" className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTrack}
                  disabled={!formTitle.trim() || !formTitleRu.trim() || uploading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-medium h-9">
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Загрузка...</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-2" />Добавить</>
                  )}
                </Button>
                <Button variant="ghost" onClick={resetForm} className="text-zinc-400 hover:text-white h-9">
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {/* Track List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Нет треков</p>
              <p className="text-xs text-zinc-600 mt-1">Нажмите «Добавить трек» для начала</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table header - desktop only */}
              <div className="hidden sm:grid sm:grid-cols-[32px_1fr_120px_80px_80px_40px] gap-3 px-3 py-2 text-xs text-zinc-600 uppercase tracking-wider font-medium">
                <span></span>
                <span>Название</span>
                <span>Жанр</span>
                <span>Длительность</span>
                <span>Статус</span>
                <span></span>
              </div>
              {tracks.map((track, idx) => (
                <div key={track.id}
                  className="grid sm:grid-cols-[32px_1fr_120px_80px_80px_40px] gap-2 sm:gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group items-center">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMoveTrack(track.id, 'up')} disabled={idx === 0 || actionLoading === track.id}
                      className="p-0.5 text-zinc-600 hover:text-amber-400 disabled:opacity-20 transition-colors">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleMoveTrack(track.id, 'down')} disabled={idx === tracks.length - 1 || actionLoading === track.id}
                      className="p-0.5 text-zinc-600 hover:text-amber-400 disabled:opacity-20 transition-colors">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{track.title}</p>
                      {track.fileName && (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] px-1.5 flex-shrink-0">
                          Файл
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{track.titleRu}</p>
                  </div>

                  {/* Genre - hidden on mobile */}
                  <p className="text-xs text-zinc-400 hidden sm:block truncate">{track.genre || '—'}</p>

                  {/* Duration */}
                  <p className="text-xs text-zinc-500 hidden sm:block">{formatDuration(track.duration) || '—'}</p>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                      Активен
                    </Badge>
                  </div>

                  {/* Delete */}
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTrack(track.id)}
                    disabled={actionLoading === track.id}
                    className="h-8 w-8 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {actionLoading === track.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Messages Tab ────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить это сообщение?')) return;
    setActionLoading(id);
    try {
      await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      fetchMessages();
      if (expandedId === id) setExpandedId(null);
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
      fetchMessages();
    } catch { /* ignore */ }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const venueTypeLabels: Record<string, string> = {
    restaurant: 'Ресторан',
    bar: 'Бар',
    hotel: 'Отель',
    event: 'Мероприятие',
    other: 'Другое',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            Сообщения ({messages.length})
          </p>
          {unreadCount > 0 && (
            <Badge className="bg-amber-500 text-black border-amber-500 text-[10px] px-2">
              {unreadCount} новых
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={fetchMessages} disabled={loading}
          className="text-zinc-500 hover:text-zinc-300 h-8 text-xs gap-1">
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Нет сообщений</p>
              <p className="text-xs text-zinc-600 mt-1">Сообщения из формы контактов появятся здесь</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id}
                className={`rounded-lg border transition-colors ${
                  !msg.isRead ? 'border-amber-500/20 bg-amber-500/[0.03]' : 'border-white/5 bg-white/[0.02]'
                } hover:bg-white/[0.04]`}>
                <button
                  className="w-full text-left p-3 sm:p-4 flex items-start gap-3"
                  onClick={() => {
                    setExpandedId(expandedId === msg.id ? null : msg.id);
                    if (!msg.isRead) handleMarkRead(msg.id);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-white truncate">{msg.name}</span>
                      <span className="text-xs text-zinc-600 truncate">{msg.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {msg.company && (
                        <span className="text-xs text-zinc-500 truncate">{msg.company}</span>
                      )}
                      {msg.venueType && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/5 text-zinc-400">
                          {venueTypeLabels[msg.venueType] || msg.venueType}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600">{formatDate(msg.createdAt)}</p>
                    {expandedId !== msg.id && (
                      <p className="text-xs text-zinc-500 mt-1 truncate">{msg.message}</p>
                    )}
                  </div>
                </button>

                {expandedId === msg.id && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <Separator className="bg-white/5 mb-3" />
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed mb-3">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${msg.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300">
                        <Mail className="h-3 w-3" />
                        Ответить
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(msg.id)}
                        disabled={actionLoading === msg.id}
                        className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 gap-1 ml-auto">
                        {actionLoading === msg.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        Удалить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Texts Tab ───────────────────────────────────────────
function TextsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState<'ru' | 'en' | 'general'>('ru');
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Array.from(changedKeys).map(key => ({ key, value: settings[key] || '' }));
      if (updates.length === 0) return;
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setChangedKeys(new Set());
        invalidateSettingsCache();
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const updateField = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setChangedKeys(prev => new Set(prev).add(key));
  };

  const hasChanges = changedKeys.size > 0;
  const currentFields = langTab === 'ru' ? RU_FIELDS : langTab === 'en' ? EN_FIELDS : GENERAL_FIELDS;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {(['ru', 'en', 'general'] as const).map(tab => (
            <Button key={tab} variant="ghost" size="sm"
              onClick={() => setLangTab(tab)}
              className={`h-8 text-xs gap-1 ${langTab === tab ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {tab === 'ru' ? '🇷🇺 Русский' : tab === 'en' ? '🇬🇧 English' : '⚙️ Общие'}
            </Button>
          ))}
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || saving}
          className={`h-8 text-xs gap-1.5 ${hasChanges ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          Сохранить
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {hasChanges && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-xs text-amber-400">
                    {changedKeys.size} пол. изменено
                  </span>
                </div>
              )}
              {currentFields.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs text-zinc-400 flex items-center gap-2">
                    {field.label}
                    {settings[field.key] && changedKeys.has(field.key) && (
                      <span className="text-[10px] text-amber-400">✎ изменено</span>
                    )}
                  </Label>
                  {field.multiline ? (
                    <Textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm resize-none focus:border-amber-500/50 focus:ring-amber-500/20"
                    />
                  ) : (
                    <Input
                      value={settings[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9 focus:border-amber-500/50 focus:ring-amber-500/20"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────
function SettingsTab({ onPasswordChange }: { onPasswordChange: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Заполните все поля' });
      return;
    }
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Пароль должен быть не менее 4 символов' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    // Verify current password
    const currentHash = simpleHash(currentPassword);
    let valid = currentHash === DEFAULT_HASH;

    if (!valid) {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.admin_password_hash === currentHash) valid = true;
        }
      } catch { /* ignore */ }
    }

    if (!valid) {
      setMessage({ type: 'error', text: 'Текущий пароль неверен' });
      return;
    }

    setSaving(true);
    try {
      const newHash = simpleHash(newPassword);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ key: 'admin_password_hash', value: newHash }]),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Пароль успешно изменён!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onPasswordChange();
      } else {
        setMessage({ type: 'error', text: 'Ошибка сохранения' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Произошла ошибка' });
    } finally { setSaving(false); }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
          {/* Password Change */}
          <div className="border border-white/10 bg-white/[0.02] rounded-lg p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Lock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Смена пароля</h3>
                <p className="text-xs text-zinc-500">Измените пароль для доступа к панели</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Текущий пароль</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Введите текущий пароль"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9 pr-9"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Новый пароль</Label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9 pr-9"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Подтвердите новый пароль</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 text-sm h-9"
                />
              </div>

              {message && (
                <div className={`text-xs px-3 py-2 rounded ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <Button onClick={handleChangePassword} disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-medium h-9 text-sm">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Сохранение...</> : 'Изменить пароль'}
              </Button>
            </div>
          </div>

          {/* General Info */}
          <div className="border border-white/10 bg-white/[0.02] rounded-lg p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-medium text-white">Информация</h3>
            <div className="space-y-2 text-xs text-zinc-500">
              <p>• Все изменения текстов вступают в силу мгновенно</p>
              <p>• Смените пароль после первого входа для безопасности</p>
              <p>• Email и копирайт редактируются во вкладке «Тексты сайта» → «Общие»</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
