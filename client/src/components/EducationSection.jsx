import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaUniversity } from 'react-icons/fa';

const EducationSection = ({ educations }) => {
  return (
    <section id="education" className="py-24 bg-gray-50 dark:bg-darkBg/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            Education
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
            My academic credentials and software engineering training details.
          </motion.p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {educations.map((edu, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={edu._id || index}
              className="p-6 sm:p-8 bg-white dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-darkBorder/40 shadow-sm flex gap-5 hover:shadow-md transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="text-3xl text-primary-500 bg-primary-100 dark:bg-primary-950/40 p-4 rounded-xl shrink-0 h-fit">
                <FaGraduationCap />
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-650 dark:text-primary-400">
                  <FaCalendarAlt /> {edu.startYear} – {edu.endYear}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-snug">
                  {edu.degree}
                </h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-655 dark:text-gray-400">
                  <FaUniversity className="text-gray-400" /> {edu.institution}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-450 mt-3 pt-3 border-t border-gray-100 dark:border-darkBorder/30 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {educations.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No education records available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
