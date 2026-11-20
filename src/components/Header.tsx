import React, { useEffect, useState } from 'react';

export interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const [timeStr, setTimeStr] = useState<string>('--:--');

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

  return (
    <header className="site-header">
      <div className="w-full max-w-[1180px] mx-auto flex items-center justify-between">
        <a href="#about" className="brand-link">
          <span className="status-dot"></span>
          <span>Sivodayan</span>
        </a>

        <nav className="nav-actions">
          <span className="live-clock-pill">
            <span className="status-dot" style={{ width: 6, height: 6 }}></span>
            <span>Moratuwa</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{timeStr}</span>
          </span>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#contact" className="nav-link">Contact</a>
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
