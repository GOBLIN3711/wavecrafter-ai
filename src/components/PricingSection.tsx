'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { DollarSign, ArrowRight } from 'lucide-react';

export function PricingSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();

  const sectionTitle = settings['pricing_title_' + language] || t.pricing.sectionTitle;
  const description = settings['pricing_text_' + language] || t.pricing.description;

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <Card className="max-w-lg mx-auto border-amber-500/20 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            {/* Top gold accent line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            <CardContent className="p-8 sm:p-10 text-center">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <DollarSign className="h-8 w-8 text-amber-400" />
              </div>

              <p className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t.pricing.priceOnRequest}
              </p>

              <p className="text-zinc-400 mb-8 leading-relaxed">
                {description}
              </p>

              <Button
                onClick={scrollToContact}
                size="lg"
                className="h-12 px-8 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30 transition-all gap-2"
              >
                {t.pricing.contactForQuote}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </section>
  );
}
