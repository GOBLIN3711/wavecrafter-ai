'use client';

import { ScrollAnimation } from '@/components/ScrollAnimations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function GlobalSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.global.sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="max-w-3xl mx-auto text-center">
            {/* Globe SVG */}
            <div className="relative mx-auto mb-12 w-48 h-48 sm:w-64 sm:h-64">
              <Globe className="h-full w-full text-amber-400/20" strokeWidth={0.5} />
              
              {/* Animated dots */}
              {[
                { top: '15%', left: '55%', delay: 0 },   // Europe
                { top: '25%', left: '70%', delay: 0.5 },  // Middle East
                { top: '35%', left: '80%', delay: 1 },    // Asia
                { top: '45%', left: '25%', delay: 1.5 },  // Americas
                { top: '65%', left: '80%', delay: 2 },    // Australia
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute h-2.5 w-2.5 rounded-full bg-amber-400"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    animation: `pulse 2s ease-in-out infinite ${pos.delay}s`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
                </div>
              ))}
            </div>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-6">
              {t.global.description}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2">
              <Globe className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">
                {t.global.worldwide}
              </span>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
