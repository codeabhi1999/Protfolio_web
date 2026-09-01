import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const ExperienceSection = ({ experiences }) => {
  return (
    <section id="experience" className="py-24 bg-white dark:bg-darkBg relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            Work Experience
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-primary-500 mx-auto mt-4 rounded-full"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 dark:text-gray-400 mt-4 text-sm sm:text-base"
          >
            My professional career path, duties, and project contributions.
          </motion.p>
        </div>

        {/* Timeline Component */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-darkBorder/60 transform -translate-x-1/2 pointer-events-none"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp._id || index}
                  className={`relative flex flex-col md:flex-row items-stretch ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node Point */}
                  <div className="absolute left-4 md:left-1/2 top-6 w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 border-4 border-white dark:border-darkBg flex items-center justify-center text-white text-xs transform -translate-x-1/2 z-10 shadow-md">
                    <FaBriefcase />
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="hidden md:block w-1/2"></div>

                  {/* Experience Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="w-full md:w-[46%] ml-10 md:ml-0 p-6 sm:p-8 bg-gray-50 dark:bg-darkCard rounded-2xl border border-gray-205 border-gray-200 dark:border-darkBorder/40 shadow-sm"
                  >
                    {/* Period Banner */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-primary-600 dark:text-primary-400">
                      <span className="flex items-center gap-1 bg-primary-100 dark:bg-primary-950/40 px-2.5 py-1 rounded-md border border-primary-200/30 dark:border-primary-900/20">
                        <FaCalendarAlt /> {exp.startDate} – {exp.endDate}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <FaMapMarkerAlt /> {exp.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-4">
                      {exp.position}
                    </h3>
                    <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mt-1">
                      {exp.company}
                    </h4>

                    {/* Responsibilities list */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {exp.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-350">
                            <span className="text-primary-500 mt-1 shrink-0"><FaCheckCircle size={13} /></span>
                            <span className="leading-relaxed">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Badges */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-gray-200/50 dark:border-darkBorder/30">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-bold bg-gray-100 dark:bg-darkBg/60 text-gray-550 dark:text-slate-400 px-2.5 py-1 rounded border border-gray-200 dark:border-darkBorder/40"
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
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                No work experience information available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
