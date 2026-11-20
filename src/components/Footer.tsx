import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div>© {new Date().getFullYear()} Sujeevakumar Sivodayan</div>
      <div>University of Moratuwa</div>
    </footer>
  );
};

export default Footer;
