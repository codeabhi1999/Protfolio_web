import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaEnvelope, FaChevronDown } from 'react-icons/fa';

const Hero = ({ profile }) => {
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const resumeDownloadUrl = profile?.resumeUrl
    ? (profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `${serverUrl}${profile.resumeUrl}`)
    : '#';

  // Floating technology badges
  const floatingBadges = [
    { name: '.NET Core', position: 'top-1/4 left-[10%]' },
    { name: 'C#', position: 'bottom-1/3 left-[15%]' },
    { name: 'React.js', position: 'top-1/3 right-[10%]' },
    { name: 'Node.js', position: 'bottom-1/4 right-[15%]' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24"
    >
      {/* Floating Badges */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        {floatingBadges.map((badge, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: idx * 0.2 },
              y: { repeat: Infinity, duration: 4, delay: idx * 0.5, ease: "easeInOut" }
            }}
            className={`absolute px-4 py-2 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl ${badge.position}`}
          >
            {badge.name}
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 z-10 text-center flex flex-col items-center">
        {/* Intro Tag */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-300 font-medium text-xs sm:text-sm tracking-wide uppercase">
              Available For Opportunities
            </span>
          </div>
        </motion.div>

        {/* Name and Professional Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tight leading-[1.1]"
        >
          Hi, I'm <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-blue-400 to-indigo-400">
            {profile?.name || 'Abhijeet Chavan'}
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-400 mt-6 max-w-3xl leading-snug"
        >
          {profile?.role || 'Jr. .NET Developer & Full Stack Developer'}
        </motion.h2>

        {/* Bio description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-gray-500 mt-6 max-w-2xl leading-relaxed"
        >
          I design and build high-performance, secure, and user-focused web solutions using the Microsoft .NET enterprise ecosystem and the modern MERN stack.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center items-center gap-4 mt-12"
        >
          <button
            onClick={() => handleScrollTo('projects')}
            className="group relative px-8 py-4 bg-white text-black font-bold text-sm rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">View My Work</span>
          </button>
          
          <a
            href={resumeDownloadUrl}
            download="Abhijeet_Chavan_Resume.pdf"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl backdrop-blur-md transition-all flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            <FaDownload /> Download Resume
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-white transition-colors"
          onClick={() => handleScrollTo('about')}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <FaChevronDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
