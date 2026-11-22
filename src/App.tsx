import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import AsciiStream from './components/AsciiStream';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import SkillsShowcase from './components/SkillsShowcase';
import Experience from './components/Experience';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import BackToTop from './components/BackToTop';


export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isIntroDone, setIsIntroDone] = useState<boolean>(false);
  const [isAsciiLoaded, setIsAsciiLoaded] = useState<boolean>(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setIsIntroDone(true);
    }, 180);
    setTimeout(() => {
      setIsAsciiLoaded(true);
    }, 10);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme') as 'dark' | 'light' | null;
    const saved = localStorage.getItem('sivodayan-theme') as 'dark' | 'light' | null;
    const initial = themeParam || saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    if (params.get('noloading') === '1') {
      setIsLoading(false);
      setIsIntroDone(true);
      setIsAsciiLoaded(true);
    }

    // Allow closing early via ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoading) {
        handleLoadingComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  // Smooth scroll instance lifecycle (Lenis)
  useEffect(() => {
    // Respect OS-level reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: true,
      infinite: false,
    });

    (window as any).lenis = lenis;

    // Handle internal anchor links with header compensation
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement as HTMLElement, {
          offset: -68,
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  // Lock scrolling while splash loader is active
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;
    if (isLoading) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isLoading]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const isToLight = next === 'light';

    // Calculate radial geometry from button center to farthest viewport corner
    const button = (e?.currentTarget as HTMLElement) || (document.querySelector('.theme-toggle-btn') as HTMLElement | null);
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : (e?.clientX || window.innerWidth - 60);
    const y = rect ? rect.top + rect.height / 2 : (e?.clientY || 30);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const doc = typeof document !== 'undefined' ? (document as any) : null;

    // View Transitions API (Chromium 111+, Safari 18+)
    if (doc && typeof doc.startViewTransition === 'function') {
      document.documentElement.dataset.themeTransition = isToLight ? 'to-light' : 'to-dark';

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setTheme(next);
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('sivodayan-theme', next);
        });
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 720,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {});

      transition.finished.finally(() => {
        delete document.documentElement.dataset.themeTransition;
      });

      
      return;
    }

    // Fallback radial clip-path transition for unsupported browsers
    const ripple = document.createElement('div');
    ripple.className = 'theme-fallback-ripple';
    ripple.style.position = 'fixed';
    ripple.style.inset = '0';
    ripple.style.zIndex = '999999';
    ripple.style.pointerEvents = 'none';
    ripple.style.backgroundColor = isToLight ? '#f8fafc' : '#07080b';
    document.body.appendChild(ripple);

    const anim = ripple.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
      ],
      {
        duration: 720,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    );

    setTimeout(() => {
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sivodayan-theme', next);
    }, 320);

    anim.onfinish = () => ripple.remove();

    
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2200);
  };

  return (
    <>
      <AnimatePresence onExitComplete={() => setIsAsciiLoaded(true)}>
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <CustomCursor theme={theme} />

      {isAsciiLoaded && (
        <div className="ascii-stream-fullscreen" aria-hidden="true">
          <AsciiStream
            colors={theme === 'light' ? ["#d97706", "#e11d48"] : ["#e5a93c", "#ff087b"]}
            text={"dev sivodayan @cse"}
            pulse={0.9}
            flare={theme === 'light' ? 0.35 : 0.45}
            glow={theme === 'light' ? 0.2 : 0.35}
            intensity={theme === 'light' ? 1.1 : 1.15}
            grain={0}
            quality={1.0}
            size={14}
            fontFamily="'JetBrains Mono', monospace"
            burst={0.4}
            speed={1.5}
            interactive={true}
            ignite={1.2}
            backgroundColor={theme === 'light' ? "#f8fafc" : "#07080b"}
            className="w-full h-full"
          />
        </div>
      )}

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="page-container">
        <main>
          <Hero isIntroDone={isIntroDone} theme={theme} />
          <Projects />
          <SkillsShowcase theme={theme} />
          <Experience theme={theme} />
          <Contact onShowToast={showToast} theme={theme} />
        </main>
      </div>

      <BackToTop />

      <div className={`minimal-toast ${toastMsg ? 'visible' : ''}`}>
        {toastMsg}
      </div>
    </>
  );
};

export default App;
