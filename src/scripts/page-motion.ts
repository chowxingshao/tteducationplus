import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motionContext,
  motionEnabled,
  refreshOnLoad,
  registerMotion,
  resolveReveal,
  revealStartVars,
} from '../lib/motion/index.ts';

type ResizeObserverLike = {
  disconnect(): void;
  observe(target: Element): void;
};

export function initPageMotion(root: Element): () => void {
  let disposed = false;
  let context = motionContext(root);
  let media = gsap.matchMedia();
  let frame: number | undefined;
  let refreshing = false;
  const refreshCleanup = refreshOnLoad(root);
  const preference = globalThis.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  );

  const queueRefresh = () => {
    if (disposed || refreshing || frame !== undefined || !motionEnabled())
      return;
    const run = () => {
      frame = undefined;
      if (disposed || !motionEnabled()) return;
      refreshing = true;
      ScrollTrigger.refresh();
      queueMicrotask(() => {
        refreshing = false;
      });
    };
    frame = globalThis.requestAnimationFrame
      ? globalThis.requestAnimationFrame(run)
      : (globalThis.setTimeout(run, 0) as unknown as number);
  };

  const addReveals = () => {
    if (!motionEnabled()) return;
    registerMotion();
    context.add(() => {
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>('[data-reveal]'),
      );
      if (!elements.length) return;
      // Hide each element in its own start position, then reveal it as it
      // scrolls into view — so motion happens on scroll, not all at once.
      for (const element of elements)
        gsap.set(element, revealStartVars(resolveReveal(element)));
      ScrollTrigger.batch(elements, {
        start: 'top 86%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.09,
            overwrite: 'auto',
          }),
      });
    });
  };

  const addMediaContext = () => {
    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        addReveals();
        return () => context.revert();
      },
      root,
    );
  };

  addMediaContext();
  const observer: ResizeObserverLike | undefined = globalThis.ResizeObserver
    ? new globalThis.ResizeObserver(() => queueRefresh())
    : undefined;
  observer?.observe(root);

  const onPreferenceChange = (event: MediaQueryListEvent) => {
    if (disposed || !event.matches) return;
    context.revert();
  };
  preference?.addEventListener('change', onPreferenceChange);

  return () => {
    if (disposed) return;
    disposed = true;
    preference?.removeEventListener('change', onPreferenceChange);
    observer?.disconnect();
    refreshCleanup();
    if (frame !== undefined) {
      if (globalThis.cancelAnimationFrame)
        globalThis.cancelAnimationFrame(frame);
      else globalThis.clearTimeout(frame);
    }
    media.revert();
    context.revert();
    media = gsap.matchMedia();
    context = motionContext(root);
  };
}

export function installPageMotionLifecycle(root: Document): () => void {
  let disposePage: () => void = () => undefined;
  let disposed = false;
  const initialize = () => {
    disposePage();
    const page = root.querySelector<HTMLElement>('[data-page-motion]');
    disposePage = page ? initPageMotion(page) : () => undefined;
  };
  const dispose = () => {
    disposePage();
    disposePage = () => undefined;
  };
  root.addEventListener('astro:page-load', initialize);
  root.addEventListener('astro:before-swap', dispose);
  initialize();
  return () => {
    if (disposed) return;
    disposed = true;
    dispose();
    root.removeEventListener('astro:page-load', initialize);
    root.removeEventListener('astro:before-swap', dispose);
  };
}
