// Barbershop SEZER 13 - Configuration
// Bilingual content: Russian (primary) / English (secondary)

export interface SiteConfig {
  language: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface HeroConfig {
  brandLeft: string;
  brandRight: string;
  tagline: string;
  badge: string;
  since: string;
  email: string;
  heroImage: string;
  heroImageAlt: string;
  scrollText: string;
  copyrightText: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutConfig {
  label: string;
  headline: string;
  description: string;
  bottomText: string;
  galleryImages: GalleryImage[];
  stats: StatItem[];
}

export interface Exhibition {
  id: number;
  title: string;
  image: string;
  date: string;
}

export interface ExhibitionsConfig {
  label: string;
  headline: string;
  ctaText: string;
  exhibitions: Exhibition[];
}

export interface Collection {
  id: number;
  title: string;
  year: string;
  description: string;
  image: string;
}

export interface CollectionsConfig {
  label: string;
  headline: string;
  ctaText: string;
  collections: Collection[];
}

export interface TestimonialsConfig {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

export interface InfoCard {
  icon: string;
  title: string;
  content: string;
}

export interface VisitConfig {
  label: string;
  headline: string;
  description: string;
  ctaText: string;
  infoCards: InfoCard[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  marqueeText: string;
  brandName: string;
  brandDescription: string;
  socialLinks: SocialLink[];
  quickLinks: FooterLink[];
  quickLinksTitle: string;
  contactTitle: string;
  contactItems: string[];
  bottomLinks: FooterLink[];
}

// Site Configuration
export const siteConfig: SiteConfig = {
  language: "ru",
  title: "Barbershop SEZER 13 | Премиум барбершоп в Ташкенте",
  description: "Barbershop SEZER 13 — стиль, который говорит за тебя. Мужские стрижки, бритье, уход за бородой. Открыты ежедневно до 2:00. Ташкент, Узбекистан.",
};

// Hero Section Configuration
export const heroConfig: HeroConfig = {
  brandLeft: "SEZER",
  brandRight: "13",
  tagline: "стиль, который говорит за тебя",
  badge: "Ташкент · Узбекистан",
  since: "С 2018",
  email: "+998 94 685 53 95",
  heroImage: "/images/hero-barber.png",
  heroImageAlt: "Professional barber at SEZER 13",
  scrollText: "Прокрутите вниз",
  copyrightText: "© 2024 SEZER 13",
  navLinks: [
    { label: "О нас", href: "#about" },
    { label: "Услуги", href: "#services" },
    { label: "Галерея", href: "#gallery" },
    { label: "Контакты", href: "#contact" },
  ],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};

// About Section Configuration
export const aboutConfig: AboutConfig = {
  label: "Почему мы? / Why Us?",
  headline: "Barbershop SEZER 13 — это больше, чем просто стрижка",
  description: "Мужская стрижка — это не просто волосы. Это уверенность, характер и внимание к деталям. В SEZER 13 мы знаем, как подчеркнуть твой стиль. Наша команда профессиональных барберов использует только современные инструменты и премиальную косметику для достижения идеального результата.",
  bottomText: "Мы работаем до 2 часов ночи, чтобы ты мог позаботиться о своем стиле в любое удобное время. Приходи и убедись сам — твой новый образ ждет тебя.",
  galleryImages: [
    { src: "/images/about-1.jpg", alt: "Barbershop interior", label: "Интерьер / Interior" },
    { src: "/images/about-2.jpg", alt: "Precision haircut", label: "Мастерство / Craft" },
    { src: "/images/about-3.jpg", alt: "Premium tools", label: "Инструменты / Tools" },
    { src: "/images/about-4.jpg", alt: "Waiting area", label: "Комфорт / Comfort" },
    { src: "/images/about-5.jpg", alt: "Hot towel shave", label: "Бритье / Shave" },
    { src: "/images/about-6.jpg", alt: "Fade haircut", label: "Стиль / Style" },
  ],
  stats: [
    { value: "4.6", label: "Рейтинг Google" },
    { value: "6+", label: "Лет опыта" },
    { value: "5000+", label: "Довольных клиентов" },
    { value: "02:00", label: "Работаем до" },
  ],
};

// Services Section Configuration (Using Exhibitions section)
export const exhibitionsConfig: ExhibitionsConfig = {
  label: "Наши Услуги / Our Services",
  headline: "Полный спектр мужского груминга",
  ctaText: "Записаться",
  exhibitions: [
    {
      id: 1,
      title: "Мужские стрижки / Men's Haircuts",
      image: "/images/service-1.jpg",
      date: "от 80 000 сум",
    },
    {
      id: 2,
      title: "Оформление бороды / Beard Styling",
      image: "/images/service-2.jpg",
      date: "от 50 000 сум",
    },
    {
      id: 3,
      title: "Королевское бритьё / Royal Shave",
      image: "/images/service-3.jpg",
      date: "от 70 000 сум",
    },
    {
      id: 4,
      title: "Укладка и уход / Styling",
      image: "/images/service-4.jpg",
      date: "от 40 000 сум",
    },
  ],
};

// Portfolio/Gallery Section Configuration (Using Collections section)
export const collectionsConfig: CollectionsConfig = {
  label: "Наши Работы / Our Work",
  headline: "Портфолио стрижек",
  ctaText: "Подробнее",
  collections: [
    {
      id: 1,
      title: "Textured Crop Fade",
      year: "2024",
      description: "Современная текстурированная стрижка с плавным переходом fade. Идеально для тех, кто ценит стиль и практичность.",
      image: "/images/portfolio-1.jpg",
    },
    {
      id: 2,
      title: "Classic Slick Back",
      year: "2024",
      description: "Классический slick back undercut — вневременной образ для уверенных в себе мужчин.",
      image: "/images/portfolio-2.jpg",
    },
    {
      id: 3,
      title: "Buzz Cut Skin Fade",
      year: "2024",
      description: "Мilitary style с идеально ровными линиями и skin fade переходом. Минимализм в лучшем виде.",
      image: "/images/portfolio-3.jpg",
    },
    {
      id: 4,
      title: "Modern Pompadour",
      year: "2024",
      description: "Современная интерпретация культовой прически с объемом и характером.",
      image: "/images/portfolio-4.jpg",
    },
  ],
};

// Testimonials Section Configuration
export const testimonialsConfig: TestimonialsConfig = {
  quote: "Отличный сервис и профессиональные мастера! В SEZER 13 всегда знают, что мне нужно. Стрижка всегда на высшем уровне, а атмосфера располагает к отдыху. Рекомендую всем, кто ценит качество.",
  authorName: "Алексей Морозов",
  authorTitle: "Постоянный клиент / Regular Client",
  authorImage: "/images/testimonial-1.jpg",
};

// Contact/Visit Section Configuration
export const visitConfig: VisitConfig = {
  label: "Контакты / Contact",
  headline: "Приходи к нам<br />в гости",
  description: "Мы находимся в самом центре Ташкента. Удобное расположение, стильный интерьер и комфортная атмосфера ждут тебя. Запишись онлайн или позвони нам — мы всегда рады новым клиентам.",
  ctaText: "Записаться онлайн",
  infoCards: [
    {
      icon: "MapPin",
      title: "Адрес / Address",
      content: "Sebzor St 1<br />Tashkent, Uzbekistan",
    },
    {
      icon: "Clock",
      title: "Часы работы / Hours",
      content: "Ежедневно / Daily<br />10:00 — 02:00",
    },
    {
      icon: "Phone",
      title: "Телефон / Phone",
      content: "+998 94 685 53 95",
    },
    {
      icon: "Star",
      title: "Рейтинг / Rating",
      content: "4.6 ★★★★★<br />Google Reviews",
    },
  ],
};

// Footer Configuration
export const footerConfig: FooterConfig = {
  marqueeText: "SEZER 13 · СТИЛЬ, КОТОРЫЙ ГОВОРИТ ЗА ТЕБЯ · STYLE THAT SPEAKS FOR YOU · ",
  brandName: "SEZER 13",
  brandDescription: "Премиум барбершоп в Ташкенте. Мужские стрижки, бритье, уход за бородой. Открыты ежедневно до 2:00.",
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
  quickLinks: [
    { label: "О нас", href: "#about" },
    { label: "Услуги", href: "#services" },
    { label: "Галерея", href: "#gallery" },
    { label: "Контакты", href: "#contact" },
  ],
  quickLinksTitle: "Навигация",
  contactTitle: "Контакты",
  contactItems: [
    "+998 94 685 53 95",
    "Sebzor St 1, Tashkent",
    "Ежедневно 10:00 — 02:00",
  ],
  bottomLinks: [
    { label: "Политика конфиденциальности", href: "#" },
    { label: "Условия использования", href: "#" },
  ],
};
