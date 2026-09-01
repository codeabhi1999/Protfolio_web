import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SkillsSection = ({ skills }) => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'Other'];

  const filteredSkills = activeTab === 'All'
    ? skills
    : skills.filter(skill => skill.category === activeTab);

  // Level color indicators
  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Intermediate':
        return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
      default:
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <section id="skills" className="py-24 bg-white dark:bg-darkBg relative">
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
            Technical Skills
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
            My specialized technology stack spanning frontend interfaces, backend servers, databases, and integrations.
          </motion.p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-650/20'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 dark:bg-darkCard/40 dark:border-darkBorder/40 dark:text-gray-300 dark:hover:bg-darkCard/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              key={skill._id || index}
              className="p-5 rounded-xl bg-gray-50 border border-gray-200 dark:bg-darkCard dark:border-darkBorder/40 flex flex-col justify-between shadow-sm group hover:shadow-md transition-all duration-300"
            >
              <div>
                <span className="text-xs font-bold text-gray-450 dark:text-slate-500 uppercase tracking-wide">
                  {skill.category}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {skill.name}
                </h4>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
            </motion.div>
          ))}

          {filteredSkills.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No skills added for this category yet.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
