import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CARD_VARIANTS = [
  { rotateY: -13, rotateX: 4, scaleX: 0.86, transformOrigin: 'left center' },
  { rotateX: 16, scaleY: 0.8, transformOrigin: 'center bottom' },
  { rotateY: 13, rotateZ: 1.8, scale: 0.9, transformOrigin: 'right center' },
  { skewX: -7, rotateZ: -1.4, scaleX: 0.88, transformOrigin: 'center bottom' },
];

const PageTransition = ({ children }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const cleanups = [];
    const animations = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animations.get(entry.target)?.();
          animations.delete(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
    );

    const register = (element, animation) => {
      if (!element) return;
      animations.set(element, animation);
      observer.observe(element);
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { rotateY: -4, scaleX: 0.965, transformOrigin: 'left center', transformPerspective: 1400 },
        { rotateY: 0, scaleX: 1, duration: 0.62, ease: 'power3.out', clearProps: 'transform' }
      );

      const hero = root.querySelector('[data-motion-section="hero"]');
      if (hero) {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const video = hero.querySelector('video');
        const heading = hero.querySelector('h1');
        const copy = hero.querySelector('p');
        const booking = hero.querySelector('[data-motion-booking]');
        const trustItems = hero.querySelectorAll('[data-motion-trust] > *');

        if (video) timeline.fromTo(video, { scale: 1.15, rotateZ: -0.7 }, { scale: 1.05, rotateZ: 0, duration: 1.25 }, 0);
        if (heading) timeline.fromTo(heading, { rotateX: -58, scaleY: 0.72, transformOrigin: 'center top', transformPerspective: 900 }, { rotateX: 0, scaleY: 1, duration: 0.78, ease: 'back.out(1.35)' }, 0.08);
        if (copy) timeline.fromTo(copy, { skewX: -7, scaleX: 0.88, transformOrigin: 'left center' }, { skewX: 0, scaleX: 1, duration: 0.58 }, 0.28);
        if (booking) timeline.fromTo(booking, { rotateY: -9, rotateX: 7, scaleX: 0.88, transformOrigin: 'left center', transformPerspective: 1100 }, { rotateY: 0, rotateX: 0, scaleX: 1, duration: 0.76, ease: 'back.out(1.3)' }, 0.36);
        if (trustItems.length) timeline.fromTo(trustItems, { rotateZ: (index) => index % 2 ? 12 : -12, scale: 0.76 }, { rotateZ: 0, scale: 1, duration: 0.46, stagger: 0.06, ease: 'back.out(1.8)' }, 0.58);
      }

      root.querySelectorAll('section:not([data-motion-section="hero"])').forEach((section, sectionIndex) => {
        register(section, () => {
          const signature = section.dataset.motionSection || `section-${sectionIndex}`;
          const heading = section.querySelector('h2, h1, h3');

          if (heading) {
            const headingVariants = [
              { rotateX: -64, scaleY: 0.7, transformOrigin: 'center top' },
              { rotateY: -22, scaleX: 0.78, transformOrigin: 'left center' },
              { skewX: -10, scaleX: 0.82, transformOrigin: 'left center' },
              { rotateZ: -4, scale: 0.84, transformOrigin: 'left bottom' },
            ];
            gsap.fromTo(
              heading,
              { ...headingVariants[sectionIndex % headingVariants.length], transformPerspective: 900 },
              { rotateX: 0, rotateY: 0, rotateZ: 0, skewX: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.66, ease: 'back.out(1.45)' }
            );
          }

          if (signature === 'stats') {
            gsap.fromTo(
              section.querySelectorAll('[data-motion-stat]'),
              { rotateX: -92, scaleY: 0.62, transformOrigin: 'center bottom', transformPerspective: 800 },
              { rotateX: 0, scaleY: 1, duration: 0.62, stagger: 0.07, ease: 'back.out(1.7)' }
            );
          }

          if (signature === 'cta') {
            gsap.fromTo(
              section,
              { scaleX: 0.74, skewX: -7, transformOrigin: 'left center' },
              { scaleX: 1, skewX: 0, duration: 0.72, ease: 'back.out(1.25)', clearProps: 'transform' }
            );
          }
        });
      });

      const explicitCards = Array.from(root.querySelectorAll('[data-motion-card]'));
      const automaticCards = Array.from(root.querySelectorAll('div.rounded-2xl, div.rounded-3xl, div.rounded-lg'))
        .filter((element) => (
          element.clientWidth >= 180
          && element.clientHeight >= 80
          && !element.closest('[data-motion-card]')
          && !element.closest('[data-motion-section="hero"]')
          && !element.classList.contains('animate-pulse')
        ));

      automaticCards.forEach((card) => {
        card.dataset.gsapCard = 'auto';
      });

      const motionCards = [...explicitCards, ...automaticCards];

      motionCards.forEach((card, index) => {
        const cardType = card.dataset.motionCard;

        register(card, () => {
          let variant = CARD_VARIANTS[index % CARD_VARIANTS.length];

          if (cardType === 'route') {
            variant = {
              rotateY: index % 2 ? 15 : -15,
              rotateZ: index % 2 ? 1.4 : -1.4,
              scaleX: 0.82,
              transformOrigin: index % 2 ? 'right center' : 'left center',
            };
          } else if (cardType === 'fleet') {
            variant = { rotateX: 19, scaleY: 0.76, transformOrigin: 'center bottom' };
          } else if (cardType === 'testimonial') {
            variant = {
              rotateZ: index % 2 ? 5 : -5,
              rotateX: -10,
              scale: 0.82,
              transformOrigin: 'center bottom',
            };
          }

          gsap.fromTo(
            card,
            { ...variant, transformPerspective: 1000, willChange: 'transform' },
            {
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              skewX: 0,
              scale: 1,
              scaleX: 1,
              scaleY: 1,
              duration: 0.68,
              ease: 'back.out(1.4)',
              onComplete: () => gsap.set(card, { clearProps: 'willChange' }),
            }
          );

          if (cardType === 'route') {
            gsap.fromTo(card.querySelectorAll('img'), { rotateZ: index % 2 ? 14 : -14, scale: 0.72 }, { rotateZ: 0, scale: 1, duration: 0.72, stagger: 0.06, ease: 'back.out(1.8)' });
          }

          if (cardType === 'fleet') {
            const image = card.querySelector('img');
            if (image) gsap.fromTo(image, { rotateZ: index % 2 ? 10 : -10, scale: 0.74 }, { rotateZ: 0, scale: 1, duration: 0.82, ease: 'elastic.out(1, 0.58)' });
          }

          if (cardType === 'testimonial') {
            gsap.fromTo(card.querySelectorAll('svg'), { rotateZ: -110, scale: 0.45 }, { rotateZ: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' });
          }
        });

        const onEnter = () => {
          if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
          gsap.to(card, {
            rotateY: index % 2 ? 3.5 : -3.5,
            rotateX: -2,
            scale: 1.012,
            transformPerspective: 1000,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };
        const onLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.42, ease: 'back.out(1.5)', overwrite: 'auto' });

        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointerleave', onLeave);
          delete card.dataset.gsapCard;
        });
      });
    }, root);

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full h-full motion-page">
      {children}
    </div>
  );
};

export default PageTransition;
