import { useEffect, useRef } from 'react';

const CARD_SELECTOR = [
  '[data-motion-card]',
  'article',
  'div[class*="rounded"][class*="border"][class*="shadow"]',
].join(',');

const DIRECTIONS = ['left', 'right', 'up', 'down'];
const MOTION_CLASSES = [
  'card-motion',
  'is-card-motion-active',
  'card-motion--left',
  'card-motion--right',
  'card-motion--up',
  'card-motion--down',
];

const PageTransition = ({ children }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!root || reducedMotion || !('IntersectionObserver' in window)) return undefined;

    const tracked = new Set();
    const timers = new Set();
    let scanFrame;

    const clearMotion = (card) => {
      card.classList.remove(...MOTION_CLASSES);
      card.style.removeProperty('--card-motion-delay');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-card-motion-active');
          observer.unobserve(entry.target);

          const timer = window.setTimeout(() => {
            clearMotion(entry.target);
            timers.delete(timer);
          }, 920);

          timers.add(timer);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
    );

    const prepare = (card, direction, delay) => {
      if (tracked.has(card)) return;

      tracked.add(card);
      card.classList.add('card-motion', `card-motion--${direction}`);
      card.style.setProperty('--card-motion-delay', `${delay * 55}ms`);
      observer.observe(card);
    };

    const scan = () => {
      scanFrame = undefined;

      const candidates = Array.from(root.querySelectorAll(CARD_SELECTOR)).filter((card) => {
        if (card.classList.contains('animate-pulse')) return false;
        const { width, height } = card.getBoundingClientRect();
        return width >= 180 && height >= 72;
      });
      const candidateSet = new Set(candidates);
      const groupCounts = new Map();

      candidates.forEach((card) => {
        if (!card.hasAttribute('data-motion-card')) {
          let ancestor = card.parentElement;
          while (ancestor && ancestor !== root) {
            if (candidateSet.has(ancestor)) return;
            ancestor = ancestor.parentElement;
          }
        }

        const group = card.closest('[data-motion-section]')
          || card.parentElement?.closest('.grid')
          || card.parentElement
          || root;
        const indexInGroup = groupCounts.get(group) || 0;

        groupCounts.set(group, indexInGroup + 1);
        prepare(card, DIRECTIONS[indexInGroup % DIRECTIONS.length], indexInGroup % 4);
      });
    };

    const scheduleScan = () => {
      if (scanFrame !== undefined) return;
      scanFrame = window.requestAnimationFrame(scan);
    };

    scan();

    const mutationObserver = new MutationObserver(scheduleScan);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      if (scanFrame !== undefined) window.cancelAnimationFrame(scanFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
      tracked.forEach(clearMotion);
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full h-full">
      {children}
    </div>
  );
};

export default PageTransition;
