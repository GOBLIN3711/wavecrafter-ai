'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import {
  Search,
  Palette,
  Music2,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export function ServicesSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const sectionTitle = settings['services_title_' + language] || t.services.sectionTitle;
  const sectionSubtitle = settings['services_subtitle_' + language] || t.services.sectionSubtitle;

  const steps = [
    { icon: Search, title: t.services.step1Title, desc: t.services.step1Desc, num: '01' },
    { icon: Palette, title: t.services.step2Title, desc: t.services.step2Desc, num: '02' },
    { icon: Music2, title: t.services.step3Title, desc: t.services.step3Desc, num: '03' },
    { icon: Clock, title: t.services.step4Title, desc: t.services.step4Desc, num: '04' },
    { icon: MapPin, title: t.services.step5Title, desc: t.services.step5Desc, num: '05' },
    { icon: RefreshCw, title: t.services.step6Title, desc: t.services.step6Desc, num: '06' },
  ];

  return (
    <section id="services" className="relative py-24 sm:py-32">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-zinc-400 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <ScrollAnimation key={step.num} delay={0.1 * (i + 1)}>
              <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-amber-500/30 hover:bg-white/[0.04] transition-all group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                      <step.icon className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-amber-500/50 tracking-widest">
                          {step.num}
                        </span>
                        <h3 className="text-base font-semibold text-white truncate">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
