import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setIsIntroDone(true);
    }, 180);
  };

  useEffect(() => {
    const saved = localStorage.getItem('sivodayan-theme') as 'dark' | 'light' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    // ESC key closes loading screen early
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoading) {
        handleLoadingComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark';

    // Locate exact center of the theme toggle button for the circular origin
    const button = (e?.currentTarget as HTMLElement) || (document.querySelector('.theme-toggle-btn') as HTMLElement | null);
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : (e?.clientX || window.innerWidth - 60);
    const y = rect ? rect.top + rect.height / 2 : (e?.clientY || 30);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const doc = typeof document !== 'undefined' ? (document as any) : null;

    // Native Circular View Transition (Chrome, Edge, Safari 18+)
    if (doc && typeof doc.startViewTransition === 'function') {
      const transition = doc.startViewTransition(() => {
        // flushSync forces React to synchronously apply the new theme to the entire DOM
        // so the browser captures the full light/dark theme snapshot instantly
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
            duration: 680,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        // Graceful fallback if pseudo-element animation is rejected
      });

      showToast(`Switched to ${next} mode`);
      return;
    }

    // High-Fidelity Circular Spreading Ripple Fallback (Firefox, older iOS Safari)
    const ripple = document.createElement('div');
    ripple.className = 'theme-fallback-ripple';
    ripple.style.position = 'fixed';
    ripple.style.inset = '0';
    ripple.style.zIndex = '999999';
    ripple.style.pointerEvents = 'none';
    ripple.style.backgroundColor = next === 'light' ? '#f8fafc' : '#07080b';
    document.body.appendChild(ripple);

    const anim = ripple.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
      ],
      {
        duration: 650,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    );

    setTimeout(() => {
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sivodayan-theme', next);
    }, 280);

    anim.onfinish = () => {
      ripple.remove();
    };

    showToast(`Switched to ${next} mode`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2200);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <CustomCursor theme={theme} />

      <div className="ascii-stream-fullscreen" aria-hidden="true">
        <AsciiStream
          colors={theme === 'light' ? ["#0284c7", "#4f46e5"] : ["#44f0ff", "#ff087b"]}
          text={"dev sivodayan @cse"}
          pulse={0.9}
          flare={theme === 'light' ? 0.35 : 0.6}
          glow={theme === 'light' ? 0.45 : 0.8}
          intensity={theme === 'light' ? 0.65 : 1.05}
          grain={0}
          quality={0.45}
          burst={0.4}
          speed={1.5}
          backgroundColor={theme === 'light' ? "#ffffff" : "#07080b"}
          className="w-full h-full"
        />
      </div>

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="page-container">
        <main>
          <Hero onShowToast={showToast} isIntroDone={isIntroDone} />
          <Projects />
          <SkillsShowcase theme={theme} />
          <Experience theme={theme} />
          <Contact onShowToast={showToast} theme={theme} />
        </main>
      </div>

      <BackToTop theme={theme} />

      <div className={`minimal-toast ${toastMsg ? 'visible' : ''}`}>
        {toastMsg}
      </div>
    </>
  );
};

export default App;
