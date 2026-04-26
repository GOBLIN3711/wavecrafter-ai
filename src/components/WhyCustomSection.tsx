'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { TrendingUp, Clock, Shield, Cpu } from 'lucide-react';

export function WhyCustomSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const sectionTitle = settings['why_title_' + language] || t.whyCustom.sectionTitle;
  const sectionSubtitle = settings['why_subtitle_' + language] || t.whyCustom.sectionSubtitle;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <ScrollAnimation delay={0.1}>
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-amber-500/30 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-4xl font-bold text-amber-400 mb-2">
                  {t.whyCustom.stat1Value}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.whyCustom.stat1Label}
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Stat 2 */}
          <ScrollAnimation delay={0.2}>
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-amber-500/30 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-4xl font-bold text-amber-400 mb-2">
                  {t.whyCustom.stat2Value}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.whyCustom.stat2Label}
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Stat 3 */}
          <ScrollAnimation delay={0.3}>
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-amber-500/30 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-white mb-2">
                  {t.whyCustom.stat3Title}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.whyCustom.stat3Desc}
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Stat 4 */}
          <ScrollAnimation delay={0.4}>
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-amber-500/30 transition-colors h-full">
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-lg font-bold text-white mb-2">
                  {t.whyCustom.stat4Title}
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.whyCustom.stat4Desc}
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
