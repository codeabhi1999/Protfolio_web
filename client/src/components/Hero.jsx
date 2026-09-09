import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaDownload, 
  FaArrowRight, 
  FaChevronDown, 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaCopy, 
  FaCheck, 
  FaCode, 
  FaDatabase, 
  FaLayerGroup 
} from 'react-icons/fa';

const ROLES = [
  '.NET Core & C# Specialist',
  'Full-Stack Web Engineer',
  'ASP.NET Web API Architect',
  'SQL Server & Database Developer',
];

const CODE_SNIPPETS = {
  cs: `// AbhijeetService.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly IDeveloperService _devService;

    public PortfolioController(IDeveloperService devService) =>
        _devService = devService;

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfileAsync()
    {
        var engineer = await _devService.GetEngineerProfileAsync();
        // 1.8+ Years Exp · 9.0 MCA CGPA · High Performance
        return Ok(new { 
            Status = "Available", 
            Specialty = ".NET & Full-Stack", 
            Engineer = engineer 
        });
    }
}`,
  json: `{
  "developer": "Abhijeet Chavan",
  "location": "Nagpur, Maharashtra, INDIA",
  "experience": "1.8+ Years",
  "education": "Master of Computer Applications (9.0 CGPA)",
  "coreStack": {
    "backend": [".NET Core", "C#", "ASP.NET Web API", "MVC"],
    "frontend": ["React", "JavaScript", "HTML5", "Tailwind CSS"],
    "database": ["Microsoft SQL Server", "MongoDB"],
    "integrations": ["Razorpay", "Shiprocket", "RESTful APIs"]
  },
  "openForHire": true
}`
};

const Hero = ({ profile }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('cs');
  const [copied, setCopied] = useState(false);

  // Rotate roles automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
  const resumeDownloadUrl = profile?.resumeUrl
    ? (profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `${serverUrl}${profile.resumeUrl}`)
    : '#';

  const metrics = [
    { label: 'Experience', value: '1.8+', unit: 'Years' },
    { label: 'MCA Academic', value: '9.0', unit: 'CGPA' },
    { label: 'Production Apps', value: '4+', unit: 'Shipped' },
    { label: 'Tech Stack', value: '15+', unit: 'Mastered' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-mono text-xs font-semibold tracking-wide uppercase">
                Available for .NET & Full-Stack Opportunities
              </span>
            </motion.div>

            {/* Main Greeting & Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08]"
            >
              Hi, I'm <br />
              <span className="text-shimmer bg-clip-text text-transparent">
                {profile?.name || 'Abhijeet Chavan'}
              </span>
            </motion.h1>

            {/* Dynamic Role Flipper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="h-10 sm:h-12 mt-4 flex items-center"
            >
              <span className="text-gray-400 text-lg sm:text-2xl font-medium mr-2 font-display">Specializing in</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-lg sm:text-2xl font-bold text-cyberCyan"
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Bio Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-gray-300 text-sm sm:text-base lg:text-lg mt-6 max-w-2xl leading-relaxed"
            >
              Engineering enterprise-grade backend architectures with{' '}
              <span className="text-white font-semibold">C#, ASP.NET Core & Web API</span>, integrated with high-performance{' '}
              <span className="text-cyberCyan font-semibold">Microsoft SQL Server</span> and modern, reactive interfaces built with{' '}
              <span className="text-primary-300 font-semibold">React & Tailwind CSS</span>.
            </motion.p>

            {/* Action Buttons & Quick Connect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                onClick={() => handleScrollTo('projects')}
                className="group relative px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary-600 via-indigo-600 to-cyberCyan text-white shadow-glow-primary hover:shadow-glow-cyan transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                Explore Projects
                <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={resumeDownloadUrl}
                download="Abhijeet_Chavan_Resume.pdf"
                className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-darkSurface/90 hover:bg-darkSurface border border-white/15 text-white hover:border-primary-500/50 transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95 shadow-md"
              >
                <FaDownload size={13} className="text-cyberCyan" /> Download CV
              </a>

              {/* Quick Socials */}
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
                <a
                  href={profile?.socialLinks?.github || 'https://github.com/abhijeetchavan'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                  title="GitHub Profile"
                >
                  <FaGithub />
                </a>
                <a
                  href={profile?.socialLinks?.linkedin || 'https://linkedin.com/in/abhijeetchavan'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin />
                </a>
                <button
                  onClick={() => handleScrollTo('contact')}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm cursor-pointer"
                  title="Direct Message"
                >
                  <FaEnvelope />
                </button>
              </div>
            </motion.div>

            {/* Metrics Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 w-full max-w-2xl"
            >
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-darkCard/60 border border-white/10 backdrop-blur-md text-left transition-all hover:border-primary-500/40"
                >
                  <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 mt-0.5 uppercase tracking-wider">
                    {m.label} <span className="text-cyberCyan">· {m.unit}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Developer HUD & Code Window */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Background Glow Behind Window */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary-600/30 via-cyberCyan/20 to-cyberViolet/30 blur-2xl opacity-70 -z-10 animate-pulse-glow" />

            {/* macOS Styled Code HUD */}
            <div className="code-window rounded-2xl overflow-hidden backdrop-blur-2xl">
              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-[#0e1422] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setActiveTab('cs')}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                      activeTab === 'cs'
                        ? 'bg-primary-600/40 text-primary-200 border border-primary-500/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    AbhijeetService.cs
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                      activeTab === 'json'
                        ? 'bg-cyberCyan/30 text-cyan-200 border border-cyberCyan/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    StackMatrix.json
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy Snippet"
                >
                  {copied ? <FaCheck size={12} className="text-emerald-400" /> : <FaCopy size={12} />}
                </button>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-5 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto max-h-[360px] select-text">
                <pre className="whitespace-pre">
                  <code>{CODE_SNIPPETS[activeTab]}</code>
                </pre>
              </div>

              {/* Code Window Footer Telemetry */}
              <div className="px-4 py-2.5 bg-[#0a0e18] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Build: Passed (NET 8.0)</span>
                </span>
                <span className="text-gray-500">UTF-8 · C# / JSON</span>
              </div>
            </div>

            {/* Floating Architecture Chips */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 px-3.5 py-2 rounded-xl bg-darkCard/90 border border-primary-500/40 shadow-glow-primary backdrop-blur-xl items-center gap-2 text-xs font-mono font-bold text-white animate-float-slow">
              <FaCode className="text-primary-400" /> .NET 8 Enterprise
            </div>

            <div className="hidden sm:flex absolute -top-5 -right-5 px-3.5 py-2 rounded-xl bg-darkCard/90 border border-cyberCyan/40 shadow-glow-cyan backdrop-blur-xl items-center gap-2 text-xs font-mono font-bold text-white animate-float-reverse">
              <FaDatabase className="text-cyberCyan" /> SQL Server & API
            </div>
          </motion.div>

        </div>

        {/* Scroll down indicator */}
        <div className="flex justify-center mt-12">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            onClick={() => handleScrollTo('about')}
            className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-cyberCyan transition-colors cursor-pointer"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest">Explore</span>
            <FaChevronDown size={12} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
