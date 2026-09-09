import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isMainPage = location.pathname === '/';

  // Track page scroll to toggle background opacity and active scroll sections
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (!isMainPage) return;

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMainPage]);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Education', id: 'education' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (isMainPage) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { targetId: id } });
    }
  };

  useEffect(() => {
    if (isMainPage && location.state?.targetId) {
      const el = document.getElementById(location.state.targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState({}, document.title);
        }, 100);
      }
    }
  }, [isMainPage, location.state]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pt-4 px-4 sm:px-6 pointer-events-none">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`max-w-6xl mx-auto flex justify-between items-center transition-all duration-500 pointer-events-auto rounded-full px-5 sm:px-7 ${
          isScrolled
            ? 'bg-darkCard/80 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] py-2.5'
            : 'bg-darkCard/40 backdrop-blur-md py-3.5 border border-white/5'
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => isMainPage && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 via-cyberCyan to-cyberViolet flex items-center justify-center font-black text-xs text-white shadow-glow-primary group-hover:scale-105 transition-transform">
            AC
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-primary-300 transition-colors">
            Abhijeet<span className="text-cyberCyan font-mono text-xs ml-1">.dev</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-1 font-medium bg-black/20 p-1 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = isMainPage && activeSection === link.id;
              return (
                <li key={link.id} className="relative">
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full relative z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-gradient-to-r from-primary-600/60 to-cyberCyan/50 rounded-full -z-10 border border-white/20 shadow-sm"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 pl-2">
            {/* Quick Contact CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Get In Touch
            </button>

            {/* Admin Dashboard Entry */}
            <Link
              to="/admin/dashboard"
              className="group flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-primary-500/40 transition-all cursor-pointer"
              title="Admin Portal"
            >
              <FaUserShield size={14} className="text-gray-400 group-hover:text-primary-300 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            title="Admin Portal"
          >
            <FaUserShield size={14} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white p-2 cursor-pointer bg-white/5 border border-white/10 rounded-full transition-colors hover:bg-white/10"
          >
            {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 z-40 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl lg:hidden pointer-events-auto"
          >
            <div className="flex flex-col p-6 gap-2 text-center font-medium">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`py-3 rounded-xl transition-colors cursor-pointer ${
                    isMainPage && activeSection === link.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-3 mt-4 text-sm font-bold bg-white text-black rounded-xl hover:bg-gray-200 transition-colors shadow-lg cursor-pointer"
              >
                <FaUserShield size={16} /> Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
