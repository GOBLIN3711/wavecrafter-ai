'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const navItems = [
  { key: 'about', href: '#about' },
  { key: 'services', href: '#services' },
  { key: 'portfolio', href: '#portfolio' },
  { key: 'pricing', href: '#pricing' },
  { key: 'contact', href: '#contact' },
] as const;

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
              <Music className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              WaveCrafter<span className="text-amber-400"> AI</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors rounded-md hover:bg-white/5"
              >
                {t.nav[item.key as keyof typeof t.nav]}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-amber-400 transition-all"
            >
              <span className={language === 'en' ? 'text-amber-400' : ''}>EN</span>
              <span className="text-zinc-600">/</span>
              <span className={language === 'ru' ? 'text-amber-400' : ''}>RU</span>
            </button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-zinc-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {t.nav[item.key as keyof typeof t.nav]}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
