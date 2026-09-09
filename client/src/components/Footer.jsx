import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaIcons.FaGithub />, url: profile?.socialLinks?.github || 'https://github.com/abhijeetchavan', label: 'GitHub' },
    { icon: <FaIcons.FaLinkedin />, url: profile?.socialLinks?.linkedin || 'https://linkedin.com/in/abhijeetchavan', label: 'LinkedIn' },
    { icon: <FaIcons.FaInstagram />, url: profile?.socialLinks?.instagram || 'https://instagram.com/abhijeetchavan', label: 'Instagram' },
    { icon: <FaIcons.FaEnvelope />, url: `mailto:${profile?.email || 'chavanabhijeet95@gmail.com'}`, label: 'Email' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070a] border-t border-white/10 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: Branding & Tagline */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-cyberCyan flex items-center justify-center font-black text-xs text-white shadow-glow-primary">
              AC
            </div>
            <h3 className="text-xl font-black font-display tracking-tight text-white">
              Abhijeet<span className="text-cyberCyan">.dev</span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-sm">
            {profile?.role || '.NET & Full-Stack Developer'} · Building resilient enterprise architectures and fluid web interfaces.
          </p>
        </div>

        {/* Center: Social Channels */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-sm text-base"
            >
              {social.icon}
            </a>
          ))}
          <button
            onClick={handleScrollToTop}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyberCyan/50 text-gray-400 hover:text-cyberCyan flex items-center justify-center transition-all hover:scale-105 shadow-sm text-sm cursor-pointer ml-2"
            title="Back to Top"
          >
            <FaArrowUp />
          </button>
        </div>

        {/* Right: Copyright & Stack Info */}
        <div className="text-center md:text-right text-xs font-mono text-gray-500">
          <p className="text-gray-400">
            &copy; {currentYear} Abhijeet Chavan. Built for Performance.
          </p>
          <p className="mt-1">
            Engineered with <span className="text-cyberCyan">React</span>, <span className="text-primary-400">.NET Core</span> & <span className="text-emerald-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
