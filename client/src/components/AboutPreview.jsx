import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaCode, 
  FaServer, 
  FaDatabase, 
  FaGlobeAsia, 
  FaCheckCircle,
  FaQuoteLeft,
  FaAward
} from 'react-icons/fa';

const AboutPreview = ({ profile }) => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-3"
          >
            Engineering Foundation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            About My Work & Values
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Bridging high-performance Microsoft .NET enterprise backends with polished, reactive frontend experiences.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Bento Box 1: Core Narrative & Philosophy (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 p-8 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-600/20 transition-all duration-700" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary-400">
                  <FaQuoteLeft size={20} />
                </div>
                <span className="text-xs font-mono uppercase font-bold text-cyberCyan px-3 py-1 rounded-full bg-cyberCyan/10 border border-cyberCyan/20">
                  Background
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-4 leading-snug">
                Building mission-critical systems where reliability meets performance.
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                {profile?.bio || `Dot Net Developer with 1.8+ years of experience designing, developing, and deploying enterprise web applications using ASP.NET Core, MVC, C#, and Microsoft SQL Server.`}
              </p>

              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Proven track record delivering mission-critical modules including the <span className="text-white font-medium">LISEP ICU Management System</span> and hospital staff ward duty scheduling in HMIS. Experienced working on-site at healthcare institutions and collaborating in agile teams.
              </p>
            </div>

            {/* Core Values Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-gray-300 font-mono">
                <FaCheckCircle className="text-emerald-400 shrink-0" />
                <span>Clean C# Architecture</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-300 font-mono">
                <FaCheckCircle className="text-cyberCyan shrink-0" />
                <span>Optimized SQL Queries</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-300 font-mono">
                <FaCheckCircle className="text-primary-400 shrink-0" />
                <span>Reactive UI & API</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Box 2: Academic Excellence (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 p-8 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FaGraduationCap size={22} />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Master's Degree
                </span>
              </div>

              <div className="inline-flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black font-display text-white">9.0</span>
                <span className="text-sm font-mono text-amber-400 font-bold uppercase tracking-wider">CGPA Distinction</span>
              </div>

              <h4 className="text-lg font-bold font-display text-white mt-2">
                Master of Computer Applications (MCA)
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Prof. Ram Meghe Institute of Technology & Research
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Badnera, Amravati, India · 2020 – 2022</p>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-gray-400 font-mono font-semibold">Undergraduate:</div>
                <div className="text-sm font-semibold text-gray-200 mt-1">Bachelor of Computer Application (BCA)</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">Vidya Bhavan College · 7.2 CGPA</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-amber-300/90 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
              <FaAward size={14} className="shrink-0" />
              <span>Ranked in Top Tier of Graduate Cohort</span>
            </div>
          </motion.div>

          {/* Bento Box 3: Location & Remote Availability (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 p-8 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <FaGlobeAsia size={22} />
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Remote & On-Site
                </span>
              </div>

              <h4 className="text-xl font-bold font-display text-white">
                Location & Timezone
              </h4>
              <p className="text-sm text-gray-300 mt-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-400 shrink-0" />
                {profile?.location || 'Nagpur, Maharashtra, INDIA'}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-1 pl-6">
                Indian Standard Time (IST · UTC+5:30)
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-mono text-gray-400 uppercase font-bold">Collaborative Availability</div>
              <div className="text-sm font-semibold text-white mt-1">Flexible overlap with US, UK & Asian time zones</div>
            </div>
          </motion.div>

          {/* Bento Box 4: Enterprise Tech Stack Highlights (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-8 p-8 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyberCyan/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyberCyan/20 transition-all duration-700" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-cyberCyan/10 border border-cyberCyan/20 text-cyberCyan">
                  <FaServer size={22} />
                </div>
                <span className="text-xs font-mono font-bold text-cyberCyan px-3 py-1 rounded-full bg-cyberCyan/10 border border-cyberCyan/20">
                  Full Stack Delivery
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-white mb-2">
                End-to-End Enterprise Solution Architecture
              </h3>
              <p className="text-sm text-gray-400 max-w-xl">
                Comprehensive experience across the entire development cycle, from database design to API development and user-centric interfaces.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-darkCard/80 border border-white/10 hover:border-primary-500/40 transition-colors">
                  <div className="text-primary-400 font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FaCode /> Backend
                  </div>
                  <div className="text-sm font-bold text-white">ASP.NET Core & Web API</div>
                  <div className="text-xs text-gray-400 mt-1">C#, MVC, Entity Framework, REST Architecture</div>
                </div>

                <div className="p-4 rounded-2xl bg-darkCard/80 border border-white/10 hover:border-cyberCyan/40 transition-colors">
                  <div className="text-cyberCyan font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FaDatabase /> Data Engine
                  </div>
                  <div className="text-sm font-bold text-white">MS SQL Server & Mongo</div>
                  <div className="text-xs text-gray-400 mt-1">Complex Stored Procedures, Views, Schema Tuning</div>
                </div>

                <div className="p-4 rounded-2xl bg-darkCard/80 border border-white/10 hover:border-emerald-500/40 transition-colors">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FaGlobeAsia /> Frontend
                  </div>
                  <div className="text-sm font-bold text-white">React & Tailwind</div>
                  <div className="text-xs text-gray-400 mt-1">Responsive Web Apps, Angular, JavaScript, Bootstrap</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-2">
              <span>Third-party integrations: Razorpay · Shiprocket · Nodemailer</span>
              <span className="text-cyberCyan">100% Production Tested</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
