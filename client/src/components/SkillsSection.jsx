import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SiCplusplus, 
  SiDotnet, 
  SiHtml5, 
  SiCss, 
  SiJavascript, 
  SiAngular, 
  SiBootstrap, 
  SiJquery, 
  SiGit, 
  SiGithub, 
  SiReact, 
  SiMongodb, 
  SiNodedotjs, 
  SiTailwindcss 
} from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';
import { DiMsqlServer, DiVisualstudio } from 'react-icons/di';
import { FaCode, FaServer, FaDatabase, FaTools, FaLayerGroup } from 'react-icons/fa';

// Helper to map skill names to specialized icons & colors
const getTechIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('c++')) return { icon: <SiCplusplus />, color: 'text-blue-400' };
  if (n.includes('c#') || n === 'c sharp') return { icon: <TbBrandCSharp />, color: 'text-purple-400' };
  if (n.includes('asp.net') || n.includes('.net') || n.includes('mvc')) return { icon: <SiDotnet />, color: 'text-indigo-400' };
  if (n.includes('html')) return { icon: <SiHtml5 />, color: 'text-orange-400' };
  if (n.includes('css')) return { icon: <SiCss />, color: 'text-blue-400' };
  if (n.includes('javascript') || n === 'js') return { icon: <SiJavascript />, color: 'text-yellow-400' };
  if (n.includes('react')) return { icon: <SiReact />, color: 'text-cyan-400' };
  if (n.includes('angular')) return { icon: <SiAngular />, color: 'text-red-400' };
  if (n.includes('bootstrap')) return { icon: <SiBootstrap />, color: 'text-purple-400' };
  if (n.includes('tailwind')) return { icon: <SiTailwindcss />, color: 'text-cyan-400' };
  if (n.includes('jquery')) return { icon: <SiJquery />, color: 'text-blue-400' };
  if (n.includes('sql') || n.includes('server')) return { icon: <DiMsqlServer />, color: 'text-red-400' };
  if (n.includes('mongo')) return { icon: <SiMongodb />, color: 'text-emerald-400' };
  if (n.includes('node')) return { icon: <SiNodedotjs />, color: 'text-emerald-400' };
  if (n.includes('github')) return { icon: <SiGithub />, color: 'text-white' };
  if (n.includes('git')) return { icon: <SiGit />, color: 'text-orange-400' };
  if (n.includes('visual studio')) return { icon: <DiVisualstudio />, color: 'text-purple-400' };
  return { icon: <FaCode />, color: 'text-primary-400' };
};

const SkillsSection = ({ skills }) => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Backend', 'Frontend', 'Database', 'Tools'];

  const filteredSkills = activeTab === 'All'
    ? skills
    : skills.filter((skill) => (skill.category || '').toLowerCase() === activeTab.toLowerCase());

  const getPercentage = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'expert':
        return 95;
      case 'advanced':
        return 90;
      case 'intermediate':
        return 75;
      default:
        return 65;
    }
  };

  const getLevelBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'advanced' || l === 'expert') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (l === 'intermediate') {
      return 'text-cyberCyan bg-cyberCyan/10 border-cyberCyan/30';
    }
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyberCyan/10 border border-cyberCyan/20 text-xs font-mono font-semibold text-cyberCyan uppercase tracking-widest mb-3"
          >
            Technical Stack
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Specialized Skills Matrix
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            A breakdown of my technical proficiencies across Microsoft .NET backends, relational databases, and modern reactive web interfaces.
          </motion.p>
        </div>

        {/* Category Tabs Switcher */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => {
            const count = cat === 'All'
              ? skills.length
              : skills.filter((s) => (s.category || '').toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeTab === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white bg-darkCard/60 border border-white/5 hover:border-white/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-cyberCyan shadow-glow-primary -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const { icon, color } = getTechIcon(skill.name);
              const pct = getPercentage(skill.level);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  key={skill._id || skill.name}
                  className="p-5 rounded-2xl glass-card flex flex-col justify-between group hover:border-primary-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${color}`}>
                        {icon}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                          {skill.name}
                        </h4>
                        <span className="text-[10px] font-mono uppercase font-semibold text-gray-400">
                          {skill.category || 'Engineering'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getLevelBadge(skill.level)}`}>
                      {skill.level || 'Advanced'}
                    </span>
                  </div>

                  {/* Proficiency Meter */}
                  <div className="mt-5 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1.5">
                      <span>Proficiency</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 via-cyberCyan to-emerald-400"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSkills.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 font-mono">
              No skills found in this category.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
