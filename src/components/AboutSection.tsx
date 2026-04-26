'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Music, Sparkles } from 'lucide-react';

export function AboutSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const sectionTitle = settings['about_title_' + language] || t.about.sectionTitle;
  const description = settings['about_description_' + language] || t.about.description;
  const tagline = settings['about_tagline_' + language] || t.about.tagline;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8">
              {description}
            </p>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">
                {tagline}
              </span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Founders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <ScrollAnimation delay={0.3} direction="left">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 border-2 border-amber-500/30 group-hover:border-amber-400/50 transition-colors">
                  <AvatarFallback className="bg-amber-500/10 text-amber-400 text-2xl font-bold">
                    Y
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {t.about.yuriTitle}
                </h3>
                <p className="text-sm text-amber-400/80 font-medium mb-2">
                  {t.about.yuriRole}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Music className="h-3 w-3" />
                  <span>Music Director</span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4} direction="right">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 border-2 border-amber-500/30 group-hover:border-amber-400/50 transition-colors">
                  <AvatarFallback className="bg-amber-500/10 text-amber-400 text-2xl font-bold">
                    V
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {t.about.valentinaTitle}
                </h3>
                <p className="text-sm text-amber-400/80 font-medium mb-2">
                  {t.about.valentinaRole}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Music className="h-3 w-3" />
                  <span>Creative Director</span>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
