export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Header
    nav: {
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      contact: 'Contact',
    },
    // Hero
    hero: {
      headline: 'We Create Unique Sound for Your Venue',
      subheadline: 'Bespoke music compositions crafted exclusively for your brand — not playlists, not stock tracks. Original sonic identities powered by AI and human artistry.',
      cta: 'Get in Touch',
    },
    // About
    about: {
      sectionTitle: 'About WaveCrafter AI',
      description:
        'WaveCrafter AI is a music production company powered by artificial intelligence, dedicated to creating bespoke sonic identities for restaurants, bars, hotels, and events worldwide. We believe that music is as essential to a venue\'s atmosphere as its interior design — and it should be just as carefully considered.',
      tagline: 'Music crafted specifically for your venue or event, powered by AI and human artistry.',
      yuriTitle: 'Yuri',
      yuriRole: 'Co-Founder & Music Director',
      valentinaTitle: 'Valentina',
      valentinaRole: 'Co-Founder & Creative Director',
    },
    // Services
    services: {
      sectionTitle: 'How We Work',
      sectionSubtitle: 'Our proven six-step process transforms your brand into a living, breathing soundscape.',
      step1Title: 'Discovery & Brand Analysis',
      step1Desc: 'We dive deep into your brand DNA — your values, audience, and the emotions you want to evoke.',
      step2Title: 'Sonic Identity Development',
      step2Desc: 'We define your unique sound profile, from tempo and key to instrumentation and mood.',
      step3Title: 'Original Composition',
      step3Desc: 'Our composers create original music that exists nowhere else — exclusively yours.',
      step4Title: 'Day-Part Programming',
      step4Desc: 'Different energy for different times of day: morning calm, lunchtime buzz, evening sophistication.',
      step5Title: 'Zone-Specific Sound Design',
      step5Desc: 'Tailored audio experiences for each area of your venue — bar, lounge, dining, terrace.',
      step6Title: 'Ongoing Optimization',
      step6Desc: 'Regular updates, seasonal adjustments, and data-driven refinements to keep your sound fresh.',
    },
    // Music Player
    player: {
      sectionTitle: 'AI Music Portfolio',
      sectionSubtitle: 'Listen to sample compositions from our sonic library. Each track is a unique piece crafted for specific venue atmospheres.',
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
      previous: 'Previous',
      volume: 'Volume',
    },
    tracks: [
      { title: 'Golden Hour Lounge', genre: 'Ambient / Chill' },
      { title: 'Midnight Jazz Ambient', genre: 'Jazz / Lo-fi' },
      { title: 'Terrace Sunset Vibes', genre: 'Tropical / Warm' },
      { title: 'Elegant Dinner Suite', genre: 'Classical / Modern' },
      { title: 'Late Night Bar Groove', genre: 'Electronic / Deep' },
    ],
    // Why Custom
    whyCustom: {
      sectionTitle: 'Why Custom Music?',
      sectionSubtitle: 'The science and business case for bespoke sonic identity.',
      stat1Value: '9%',
      stat1Label: 'increase in sales with brand-fit music',
      stat2Value: '42%',
      stat2Label: 'longer guest dwell time',
      stat3Title: 'Exclusive Ownership',
      stat3Desc: 'Original compositions you own and that exist nowhere else.',
      stat4Title: 'AI + Human Crafted',
      stat4Desc: 'Cutting-edge technology meets artistic sensibility.',
    },
    // Pricing
    pricing: {
      sectionTitle: 'Pricing',
      priceOnRequest: 'Price on Request',
      description: 'Each project is unique. We tailor our services to your specific needs, venue size, and brand vision.',
      contactForQuote: 'Contact us for a personalized quote',
    },
    // Global
    global: {
      sectionTitle: 'Worldwide Reach',
      description: 'From Moscow to Dubai, from London to Tokyo — we create sonic identities for venues across the globe. Our remote-first workflow means we can work with you anywhere.',
      worldwide: 'We Work Worldwide',
    },
    // Contact
    contact: {
      sectionTitle: 'Get in Touch',
      description: 'Ready to transform your venue\'s atmosphere? Tell us about your project and we\'ll get back to you within 24 hours.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      companyLabel: 'Venue / Company Name',
      companyPlaceholder: 'Your venue or company name',
      venueTypeLabel: 'Type of Venue',
      venueTypePlaceholder: 'Select venue type',
      venueTypes: [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'bar', label: 'Bar' },
        { value: 'hotel', label: 'Hotel' },
        { value: 'event', label: 'Event' },
        { value: 'other', label: 'Other' },
      ],
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us about your project, your venue, and the atmosphere you envision...',
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully! We\'ll be in touch soon.',
      error: 'Something went wrong. Please try again.',
      validationName: 'Name is required',
      validationEmail: 'Please enter a valid email',
      validationMessage: 'Message is required',
      emailDisplay: 'Email us directly',
    },
    // Footer
    footer: {
      tagline: 'WaveCrafter AI — Crafting sonic identities worldwide',
      copyright: '© 2025 WaveCrafter AI. All rights reserved.',
    },
  },
  ru: {
    // Header
    nav: {
      about: 'О нас',
      services: 'Услуги',
      portfolio: 'Портфолио',
      pricing: 'Цены',
      contact: 'Контакты',
    },
    // Hero
    hero: {
      headline: 'Создаём уникальный звук для вашего заведения',
      subheadline: 'Авторская музыка, созданная эксклюзивно для вашего бренда — не плейлисты, не стандартные треки. Уникальные саунд-идеальности, созданные с помощью ИИ и человеческого мастерства.',
      cta: 'Связаться с нами',
    },
    // About
    about: {
      sectionTitle: 'О WaveCrafter AI',
      description:
        'WaveCrafter AI — музыкальная продакшн-компания, работающая на базе искусственного интеллекта, посвящённая созданию уникальных звуковых образов для ресторанов, баров, отелей и мероприятий по всему миру. Мы верим, что музыка так же важна для атмосферы заведения, как его интерьер — и она заслуживает такого же внимательного подхода.',
      tagline: 'Музыка, созданная специально для вашего заведения или мероприятия, на стыке ИИ и человеческого искусства.',
      yuriTitle: 'Юрий',
      yuriRole: 'Сооснователь и музыкальный директор',
      valentinaTitle: 'Валентина',
      valentinaRole: 'Сооснователь и креативный директор',
    },
    // Services
    services: {
      sectionTitle: 'Как мы работаем',
      sectionSubtitle: 'Наш проверенный шестиступенчатый процесс превращает ваш бренд в живое, дышащее звуковое пространство.',
      step1Title: 'Исследование и анализ бренда',
      step1Desc: 'Мы глубоко погружаемся в ДНК вашего бренда — ваши ценности, аудиторию и эмоции, которые вы хотите вызвать.',
      step2Title: 'Разработка звуковой идентичности',
      step2Desc: 'Определяем ваш уникальный звуковой профиль — от темпа и тональности до инструментов и настроения.',
      step3Title: 'Авторская композиция',
      step3Desc: 'Наши композиторы создают оригинальную музыку, которая не существует нигде больше — исключительно для вас.',
      step4Title: 'Программирование по времени суток',
      step4Desc: 'Разная энергетика для разного времени дня: утреннее спокойствие, дневной драйв, вечерняя утончённость.',
      step5Title: 'Звуковой дизайн по зонам',
      step5Desc: 'Адаптированные звуковые впечатления для каждой зоны вашего заведения — бар, лаунж, зал, терраса.',
      step6Title: 'Постоянная оптимизация',
      step6Desc: 'Регулярные обновления, сезонные корректировки и улучшения на основе данных для свежести звучания.',
    },
    // Music Player
    player: {
      sectionTitle: 'Звуковое портфолио',
      sectionSubtitle: 'Послушайте образцы композиций из нашей библиотеки. Каждый трек — уникальное произведение для определённой атмосферы.',
      play: 'Играть',
      pause: 'Пауза',
      next: 'Далее',
      previous: 'Назад',
      volume: 'Громкость',
    },
    tracks: [
      { title: 'Golden Hour Lounge', genre: 'Эмбиент / Чилл' },
      { title: 'Midnight Jazz Ambient', genre: 'Джаз / Lo-fi' },
      { title: 'Terrace Sunset Vibes', genre: 'Тропический / Тёплый' },
      { title: 'Elegant Dinner Suite', genre: 'Классический / Современный' },
      { title: 'Late Night Bar Groove', genre: 'Электронный / Глубокий' },
    ],
    // Why Custom
    whyCustom: {
      sectionTitle: 'Почему авторская музыка?',
      sectionSubtitle: 'Научные и бизнес-аргументы в пользу уникального звукового образа.',
      stat1Value: '9%',
      stat1Label: 'увеличение продаж при правильно подобранной музыке',
      stat2Value: '42%',
      stat2Label: 'дольше гости задерживаются в заведении',
      stat3Title: 'Эксклюзивное владение',
      stat3Desc: 'Оригинальные композиции, которые принадлежат вам и не существуют больше нигде.',
      stat4Title: 'ИИ + ручная работа',
      stat4Desc: 'Передовые технологии в сочетании с художественным чутьём.',
    },
    // Pricing
    pricing: {
      sectionTitle: 'Цены',
      priceOnRequest: 'Цена по запросу',
      description: 'Каждый проект уникален. Мы адаптируем наши услуги под ваши потребности, размер заведения и видение бренда.',
      contactForQuote: 'Свяжитесь с нами для персонального расчёта',
    },
    // Global
    global: {
      sectionTitle: 'Работаем по всему миру',
      description: 'От Москвы до Дубая, от Лондона до Токио — мы создаём звуковые образы для заведений по всему миру. Наш удалённый формат работы позволяет сотрудничать с вами из любой точки.',
      worldwide: 'Работаем по всему миру',
    },
    // Contact
    contact: {
      sectionTitle: 'Связаться с нами',
      description: 'Готовы преобразить атмосферу вашего заведения? Расскажите о проекте, и мы ответим в течение 24 часов.',
      nameLabel: 'Имя',
      namePlaceholder: 'Ваше имя',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      companyLabel: 'Название заведения / компании',
      companyPlaceholder: 'Название вашего заведения или компании',
      venueTypeLabel: 'Тип заведения',
      venueTypePlaceholder: 'Выберите тип заведения',
      venueTypes: [
        { value: 'restaurant', label: 'Ресторан' },
        { value: 'bar', label: 'Бар' },
        { value: 'hotel', label: 'Отель' },
        { value: 'event', label: 'Мероприятие' },
        { value: 'other', label: 'Другое' },
      ],
      messageLabel: 'Сообщение',
      messagePlaceholder: 'Расскажите о вашем проекте, заведении и атмосфере, которую вы хотите создать...',
      submit: 'Отправить сообщение',
      sending: 'Отправка...',
      success: 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.',
      error: 'Что-то пошло не так. Пожалуйста, попробуйте ещё раз.',
      validationName: 'Имя обязательно',
      validationEmail: 'Введите корректный email',
      validationMessage: 'Сообщение обязательно',
      emailDisplay: 'Напишите нам напрямую',
    },
    // Footer
    footer: {
      tagline: 'WaveCrafter AI — Создаём уникальный звук для вашего бизнеса по всему миру',
      copyright: '© 2025 WaveCrafter AI. Все права защищены.',
    },
  },
} as const;

export type TranslationKey = typeof translations.en;
