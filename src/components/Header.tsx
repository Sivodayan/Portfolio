import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: (e?: React.MouseEvent) => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const [timeStr, setTimeStr] = useState<string>('--:--');
  const [activeSection, setActiveSection] = useState<string>('about');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setTimeStr(new Intl.DateTimeFormat([], opts).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sectionIds = ['about', 'projects', 'skills', 'experience', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection((prev) => (prev !== sectionIds[i] ? sectionIds[i] : prev));
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on ESC key or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (headerRef.current && target && !headerRef.current.contains(target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const isLight = theme === 'light';

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="site-header flex-col"
    >
      <div className="site-header-inner">
        <motion.a
          href="#about"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="brand-link group"
          aria-label="Sujeevakumar Sivodayan"
        >
          <span className="font-anton text-base sm:text-lg tracking-wider text-white [data-theme=light]:text-slate-900 group-hover:text-[#38bdf8] transition-colors drop-shadow-sm">
            Sivodayan
          </span>
        </motion.a>

        <nav className="nav-actions">
          <div
            className="hidden sm:flex items-center gap-1 relative p-0.5 rounded-full"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredSection === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-colors z-10 select-none ${
                    isActive
                      ? isLight
                        ? 'text-sky-600 font-semibold'
                        : 'text-[#38bdf8] font-semibold'
                      : isHovered
                      ? isLight
                        ? 'text-slate-900'
                        : 'text-white'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-[#cbd5e1] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className={`absolute inset-0 rounded-full z-[-1] border shadow-sm ${
                        isLight
                          ? 'bg-sky-500/10 border-sky-500/30 shadow-[0_0_12px_rgba(2,132,199,0.2)]'
                          : 'bg-white/15 border-white/20 shadow-[0_0_14px_rgba(56,189,248,0.25)]'
                      }`}
                    />
                  )}

                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className={`absolute inset-0 rounded-full z-[-1] ${
                        isLight ? 'bg-slate-200/60' : 'bg-white/[0.08]'
                      }`}
                    />
                  )}

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-1">
            <span className="live-clock-pill hidden md:inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[11px] text-slate-400 [data-theme=light]:text-slate-500">Jaffna</span>
              <span className="font-semibold text-white [data-theme=light]:text-slate-800 text-[11px]">{timeStr}</span>
            </span>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => onToggleTheme(e)}
              className="theme-toggle-btn cursor-pointer overflow-hidden"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="sm:hidden flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/15 active:bg-[#38bdf8]/25 [data-theme=light]:bg-black/5 [data-theme=light]:hover:bg-black/10 [data-theme=light]:active:bg-sky-500/20 border border-white/20 [data-theme=light]:border-black/15 text-white [data-theme=light]:text-slate-800 transition-all touch-manipulation cursor-pointer shadow-sm select-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'open' : 'closed'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  {mobileMenuOpen ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="7" x2="20" y2="7"></line>
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                      <line x1="4" y1="17" x2="20" y2="17"></line>
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-nav-drawer"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="flex flex-col gap-1 p-2.5"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? isLight
                          ? 'bg-sky-500/10 text-sky-600 border border-sky-500/30'
                          : 'bg-white/15 text-[#38bdf8] border border-white/20'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-[#cbd5e1] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                    )}
                  </motion.a>
                );
              })}

              {/* Live Jaffna Time status inside mobile drawer */}
              <div className="pt-2 mt-1 border-t border-white/10 [data-theme=light]:border-slate-200 flex items-center justify-between px-2.5 text-[11px] font-mono text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span>Jaffna, Sri Lanka</span>
                </span>
                <span className="font-semibold text-white [data-theme=light]:text-slate-800">{timeStr}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
