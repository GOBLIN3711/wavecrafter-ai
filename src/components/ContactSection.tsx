'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Loader2, CheckCircle2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  venueType: string;
  message: string;
}

export function ContactSection() {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const { toast } = useToast();

  const sectionTitle = settings['contact_title_' + language] || t.contact.sectionTitle;
  const description = settings['contact_description_' + language] || t.contact.description;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    venueType: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.contact.validationName;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t.contact.validationEmail;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.contact.validationMessage;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setIsSuccess(true);
      setFormData({ name: '', email: '', company: '', venueType: '', message: '' });
      toast({
        title: '✓',
        description: t.contact.success,
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      toast({
        variant: 'destructive',
        description: t.contact.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <section id="contact" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="max-w-lg mx-auto text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t.contact.success.split('.')[0]}
              </h3>
              <p className="text-zinc-400">{t.contact.success.split('.')[1] || t.contact.success}</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {sectionTitle}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mb-4" />
            <p className="text-zinc-400 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <ScrollAnimation delay={0.1} direction="left" className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Mail className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-400">
                      {t.contact.emailDisplay}
                    </p>
                    <a
                      href={`mailto:${settings.site_email || 'grossboss@inbox.ru'}`}
                      className="text-lg font-semibold text-white hover:text-amber-400 transition-colors"
                    >
                      {settings.site_email || 'grossboss@inbox.ru'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Contact Form */}
          <ScrollAnimation delay={0.2} direction="right" className="lg:col-span-3">
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-zinc-300 text-sm">
                      {t.contact.nameLabel} *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300 text-sm">
                      {t.contact.emailLabel} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={t.contact.emailPlaceholder}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-zinc-300 text-sm">
                      {t.contact.companyLabel}
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder={t.contact.companyPlaceholder}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                    />
                  </div>

                  {/* Venue Type */}
                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-sm">
                      {t.contact.venueTypeLabel}
                    </Label>
                    <Select
                      value={formData.venueType}
                      onValueChange={(v) => handleChange('venueType', v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:ring-amber-500/20 h-11">
                        <SelectValue placeholder={t.contact.venueTypePlaceholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        {t.contact.venueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-zinc-300 focus:bg-white/5 focus:text-amber-400">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300 text-sm">
                      {t.contact.messageLabel} *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder={t.contact.messagePlaceholder}
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30 transition-all gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t.contact.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
