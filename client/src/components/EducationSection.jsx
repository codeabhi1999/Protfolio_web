import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaUniversity, FaAward } from 'react-icons/fa';

const EducationSection = ({ educations }) => {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyberViolet/10 border border-cyberViolet/20 text-xs font-mono font-semibold text-cyberViolet uppercase tracking-widest mb-3"
          >
            Academic Foundation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Education & Qualifications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Structured computer science education, software engineering principles, and academic achievements.
          </motion.p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {educations.map((edu, index) => {
            const isMCA = edu.degree.toLowerCase().includes('master');

            return (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                key={edu._id || index}
                className="p-8 rounded-3xl glass-card flex flex-col justify-between relative overflow-hidden group hover:border-cyberViolet/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-cyberViolet text-2xl group-hover:scale-110 transition-transform">
                      <FaGraduationCap />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      <FaCalendarAlt size={10} className="text-cyberCyan" /> {edu.startYear} – {edu.endYear}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-cyberViolet transition-colors leading-snug">
                    {edu.degree}
                  </h3>

                  <div className="flex items-start gap-2 text-sm text-gray-300 mt-2 font-medium">
                    <FaUniversity className="text-primary-400 mt-1 shrink-0" />
                    <span>{edu.institution}</span>
                  </div>

                  {edu.description && (
                    <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs sm:text-sm text-gray-300 leading-relaxed font-mono">
                      {edu.description}
                    </div>
                  )}
                </div>

                {isMCA && (
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                      <FaAward /> 9.0 CGPA Distinction
                    </span>
                    <span className="text-gray-400">Postgraduate Honors</span>
                  </div>
                )}
              </motion.div>
            );
          })}

          {educations.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 font-mono">
              No education records available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
