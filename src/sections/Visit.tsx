import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Phone, Star } from 'lucide-react';
import { visitConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  MapPin,
  Clock,
  Phone,
  Star,
};

const Visit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!visitConfig.headline && visitConfig.infoCards.length === 0) return null;

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;

    if (!section || !cards) return;

    const cardElements = cards.querySelectorAll('.info-card');
    cardElements.forEach((card, i) => {
      gsap.set(card, { opacity: 0, y: 40 });
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power3.out',
          });
        },
      });
      triggersRef.current.push(trigger);
    });

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] py-32 px-8 lg:px-16"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <p className="museo-label text-white/50 mb-4">{visitConfig.label}</p>
        <h2
          className="museo-headline text-white text-4xl md:text-5xl lg:text-6xl mb-8"
          dangerouslySetInnerHTML={{ __html: visitConfig.headline }}
        />
        <p className="museo-body text-white/60 text-lg max-w-2xl">
          {visitConfig.description}
        </p>
      </div>

      {/* Info Cards Grid */}
      <div
        ref={cardsRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {visitConfig.infoCards.map((card, i) => {
          const IconComponent = iconMap[card.icon];
          return (
            <div key={i} className="info-card p-8 border border-[#C9A24D]/20 hover:border-[#C9A24D]/50 transition-all duration-300 hover:transform hover:-translate-y-1">
              {IconComponent && <IconComponent className="w-8 h-8 text-[#C9A24D] mb-6" strokeWidth={1.5} />}
              <h3 className="museo-headline text-white text-xl mb-3">{card.title}</h3>
              <div
                className="museo-body text-white/60 text-sm"
                dangerouslySetInnerHTML={{ __html: card.content }}
              />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {visitConfig.ctaText && (
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <a
            href="tel:+998946855395"
            data-cursor="hover"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#C9A24D] text-[#0A0A0A] museo-label hover:bg-[#D4B76A] transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#C9A24D]/20"
          >
            {visitConfig.ctaText}
          </a>
        </div>
      )}

      {/* Google Map */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="w-full h-[400px] border border-[#C9A24D]/20 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.638742436037!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Barbershop SEZER 13 Location"
          />
        </div>
      </div>
    </section>
  );
};

export default Visit;
