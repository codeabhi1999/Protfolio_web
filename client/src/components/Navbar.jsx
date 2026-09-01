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
        className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 pointer-events-auto rounded-2xl px-6 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] py-3'
            : 'bg-transparent py-4 border border-transparent'
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => isMainPage && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400"
        >
          AC<span className="text-white font-medium">.dev</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6 font-medium">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm tracking-wide transition-colors duration-250 cursor-pointer px-2 py-1 ${
                    isMainPage && activeSection === link.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isMainPage && activeSection === link.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center pl-6 border-l border-white/10">
            {/* Admin Dashboard Entry */}
            <Link
              to="/admin/dashboard"
              className="group flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <FaUserShield size={16} className="text-gray-400 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white p-2 cursor-pointer bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10"
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
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
