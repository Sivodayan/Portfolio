import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

const mobileDrawerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const mobileNavItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    x: -6,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
};

const mobileFooterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.12 },
  },
};

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

  // Ensure contact section scroll displays the full section including CC footer
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#contact') {
        setTimeout(() => {
          const contactEl = document.getElementById('contact');
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 150);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
    if (itemId === 'contact') {
      e.preventDefault();
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
        window.history.pushState(null, '', '#contact');
        setActiveSection('contact');
      }
    }
  };

  // Close mobile menu on ESC key or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target || !document.body.contains(target)) return;
      if (headerRef.current && !headerRef.current.contains(target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
      }, 50);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
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
          <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-white light:text-slate-900 group-hover:text-[#e5a93c] light:group-hover:text-[#b45309] transition-colors">
            Sivodayan
          </span>
        </motion.a>

        <nav className="nav-actions">
          <div
            className="hidden sm:flex items-center gap-1 relative py-1"
            onMouseLeave={() => setHoveredSection(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredSection === item.id;

              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  whileTap={{ scale: 0.94 }}
                  className={`group relative px-3 sm:px-3.5 py-2 text-xs sm:text-[13px] tracking-wide transition-colors duration-200 z-10 select-none ${
                    isActive
                      ? isLight
                        ? 'text-[#b45309] font-semibold'
                        : 'text-[#e5a93c] font-semibold drop-shadow-[0_0_10px_rgba(229,169,60,0.45)]'
                      : isHovered
                      ? isLight
                        ? 'text-slate-900'
                        : 'text-white'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-flare"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className={`absolute inset-x-0.5 bottom-0.5 h-4 rounded-t-md pointer-events-none z-[-1] blur-[5px] ${
                        isLight
                          ? 'bg-gradient-to-t from-amber-500/25 to-transparent'
                          : 'bg-gradient-to-t from-[#e5a93c]/35 to-transparent'
                      }`}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-line"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className={`absolute bottom-0.5 left-1.5 right-1.5 h-[2.5px] rounded-full z-10 ${
                        isLight
                          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-rose-500 shadow-[0_0_10px_rgba(217,119,6,0.75),0_1px_3px_rgba(217,119,6,0.5)]'
                          : 'bg-gradient-to-r from-[#e5a93c] via-[#fde68a] to-[#e5a93c] shadow-[0_0_14px_rgba(229,169,60,0.95),0_1px_4px_rgba(229,169,60,0.7)]'
                      }`}
                    />
                  )}

                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar-hover-line"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className={`absolute bottom-0.5 left-2 right-2 h-[2px] rounded-full z-10 ${
                        isLight
                          ? 'bg-slate-700/80 shadow-[0_0_6px_rgba(51,65,85,0.4)]'
                          : 'bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.65)]'
                      }`}
                    />
                  )}

                  <span className="relative z-10 block transition-transform duration-200 group-hover:-translate-y-[1px]">
                    {item.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-1">
           

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => onToggleTheme(e)}
              className="theme-toggle-btn cursor-pointer overflow-hidden"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen((prev) => !prev);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              className="theme-toggle-btn sm:hidden cursor-pointer overflow-hidden touch-manipulation select-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'open' : 'closed'}
                  initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  {mobileMenuOpen ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6"></line>
                      <line x1="4" y1="12" x2="20" y2="12"></line>
                      <line x1="4" y1="18" x2="20" y2="18"></line>
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
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mobile-nav-drawer"
          >
            <div className="flex flex-col gap-1 p-2.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    variants={mobileNavItemVariants}
                    whileTap={{ scale: 0.98 }}
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, item.id);
                    }}
                    className={`relative px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? isLight
                          ? 'border-l-2 border-amber-600 bg-amber-500/5 text-amber-700 pl-3.5 font-semibold'
                          : 'border-l-2 border-[#e5a93c] bg-white/[0.04] text-[#e5a93c] pl-3.5 font-semibold drop-shadow-[0_0_8px_rgba(229,169,60,0.3)]'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:pl-3.5'
                        : 'text-[#94a3b8] hover:text-white hover:pl-3.5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93c] light:bg-amber-600 shadow-[0_0_8px_#e5a93c]" />
                    )}
                  </motion.a>
                );
              })}

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
