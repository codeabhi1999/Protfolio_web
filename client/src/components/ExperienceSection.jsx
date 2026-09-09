import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaBuilding } from 'react-icons/fa';

const ExperienceSection = ({ experiences }) => {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyberEmerald/10 border border-cyberEmerald/20 text-xs font-mono font-semibold text-cyberEmerald uppercase tracking-widest mb-3"
          >
            Career Timeline
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Professional Work Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Hands-on engineering contributions, healthcare IT deployments, and production software delivery.
          </motion.p>
        </div>

        {/* Timeline Conduit Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Glowing Conduit Beam */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 conduit-line transform -translate-x-1/2 pointer-events-none rounded-full" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp._id || index}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Glowing Milestone Node Point */}
                  <div className="absolute left-6 md:left-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-cyberCyan border-4 border-[#07090e] flex items-center justify-center text-white text-xs transform -translate-x-1/2 z-20 shadow-glow-primary">
                    <FaBriefcase size={12} />
                  </div>

                  {/* Spacer for Alternate Layout */}
                  <div className="hidden md:block w-1/2"></div>

                  {/* Experience Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="w-full md:w-[46%] ml-14 md:ml-0 p-7 sm:p-8 rounded-3xl glass-card relative overflow-hidden group hover:border-primary-500/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      {/* Period Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300">
                        <FaCalendarAlt size={10} /> {exp.startDate} – {exp.endDate}
                      </span>

                      {/* Location Badge */}
                      {exp.location && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-400">
                          <FaMapMarkerAlt size={10} className="text-cyberCyan" /> {exp.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-2 group-hover:text-cyberCyan transition-colors">
                      {exp.position}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mt-1">
                      <FaBuilding className="text-primary-400" />
                      <span>{exp.company}</span>
                    </div>

                    {/* Responsibilities list */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="mt-5 space-y-2.5 pt-4 border-t border-white/10">
                        {exp.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                            <FaCheckCircle className="text-emerald-400 mt-1 shrink-0 text-xs" />
                            <span className="leading-relaxed">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies Used */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-white/10">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono font-medium bg-white/5 text-gray-300 px-2.5 py-1 rounded-md border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}

            {experiences.length === 0 && (
              <div className="py-16 text-center text-gray-400 font-mono">
                No work experience information recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
