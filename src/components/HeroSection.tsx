'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function HeroSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const headline = settings['hero_headline_' + language] || t.hero.headline;
  const subheadline = settings['hero_subheadline_' + language] || t.hero.subheadline;
  const cta = settings['hero_cta_' + language] || t.hero.cta;

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d1a] to-[#0a0a0a]" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-amber-500/5 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-amber-600/5 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Background waveform */}
      <div className="absolute inset-0 opacity-20">
        <WaveformVisualizer isPlaying={true} barCount={80} color="#D4AF37" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 mb-8"
          >
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400 tracking-wider uppercase">
              AI-Powered Music Production
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            {headline.split(' ').map((word, i) => {
              const keyWords = language === 'ru'
                ? ['уникальный', 'звук', 'вашего', 'заведения']
                : ['Unique', 'Sound', 'Your', 'Venue'];
              if (keyWords.includes(word.replace(/[.,!?]/g, ''))) {
                return (
                  <span key={i} className="text-amber-400">
                    {word}{' '}
                  </span>
                );
              }
              return (
                <span key={i}>
                  {word}{' '}
                </span>
              );
            })}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-10"
          >
            {subheadline}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={scrollToContact}
              size="lg"
              className="h-12 px-8 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30 transition-all text-sm sm:text-base"
            >
              {cta}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-6 w-6 text-amber-400/50" />
      </motion.div>
    </section>
  );
}
