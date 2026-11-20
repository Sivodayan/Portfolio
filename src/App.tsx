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
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('sivodayan-theme') as 'dark' | 'light' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    // ESC key closes loading screen early
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoading) {
        setIsLoading(false);
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
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* React Bits Pro: Custom Cursor */}
      <CustomCursor />

      {/* React Bits Pro: AsciiStream Full-Screen Background */}
      <div className="ascii-stream-fullscreen" aria-hidden="true">
        <AsciiStream
          colors={["#44f0ff", "#ff087b"]}
          text={"dev sivodayan @cse"}
          pulse={1.2}
          flare={1.2}
          glow={1.4}
          intensity={1.25}
          burst={1.0}
          speed={2.2}
          backgroundColor="#07080b"
          className="w-full h-full"
        />
      </div>

      <div className="page-container">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main>
          <Hero onShowToast={showToast} />
          <Projects />
          <SkillsShowcase />
          <Experience />
          <Contact onShowToast={showToast} />
        </main>

        <Footer />
      </div>

      {/* Toast feedback */}
      <div className={`minimal-toast ${toastMsg ? 'visible' : ''}`}>
        {toastMsg}
      </div>
    </>
  );
};

export default App;
