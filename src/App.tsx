import React, { useState, useEffect } from 'react';
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sivodayan-theme', next);
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
      {/* Circuit Flash Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* React Bits Pro: Custom Cursor */}
      <CustomCursor theme={theme} />

      {/* React Bits Pro: AsciiStream Full-Screen Background (Optimized for 60/120fps) */}
      <div className="ascii-stream-fullscreen" aria-hidden="true">
        <AsciiStream
          colors={theme === 'light' ? ["#0284c7", "#0d9488"] : ["#44f0ff", "#ff087b"]}
          text={"dev sivodayan @cse"}
          pulse={0.9}
          flare={0.6}
          glow={0.8}
          intensity={theme === 'light' ? 0.75 : 1.05}
          grain={0}
          quality={0.45}
          burst={0.4}
          speed={1.5}
          backgroundColor={theme === 'light' ? "#f8fafc" : "#07080b"}
          className="w-full h-full"
        />
      </div>

      {/* Sticky Fixed Glass Header */}
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

      {/* Toast feedback */}
      <div className={`minimal-toast ${toastMsg ? 'visible' : ''}`}>
        {toastMsg}
      </div>
    </>
  );
};

export default App;
