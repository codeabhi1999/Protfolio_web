import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaGraduationCap, FaCode, FaServer } from 'react-icons/fa';

const AboutPreview = ({ profile }) => {
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-darkBg/60 relative">
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
            About Me
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
            Learn more about my professional journey, technology focus, and development values.
          </motion.p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Profile Mockup Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-darkCard p-2 border border-gray-200 dark:border-darkBorder">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-650/40 via-transparent to-transparent z-10 opacity-60 rounded-2xl"></div>
              {/* Profile Image fallback to initial avatar design */}
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-indigo-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <span className="text-8xl font-black text-primary-400/20 select-none">AC</span>
                <span className="absolute bottom-6 font-bold tracking-widest text-lg text-primary-350">ABHIJEET</span>
                <div className="absolute top-4 left-4 p-2 bg-darkBg/60 rounded-lg text-primary-400 border border-darkBorder/40">
                  <FaCode size={18} />
                </div>
                <div className="absolute top-4 right-4 p-2 bg-darkBg/60 rounded-lg text-indigo-400 border border-darkBorder/40">
                  <FaServer size={18} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Biography Text and Summary Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              {profile?.title || 'Full Stack Developer | .NET & MERN Stack Developer'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-355 text-sm sm:text-base leading-relaxed">
              {profile?.bio || 'I am a passionate software developer specializing in .NET and MERN stack technologies. I love building responsive, scalable, and secure web applications.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-darkCard rounded-xl border border-gray-200 dark:border-darkBorder/40 shadow-sm">
                <span className="text-primary-500 bg-primary-100 dark:bg-primary-950/40 p-3 rounded-lg text-xl">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <h5 className="text-xs text-gray-405 dark:text-gray-400 uppercase font-bold tracking-wider">Location</h5>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{profile?.location || 'Nagpur, India'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white dark:bg-darkCard rounded-xl border border-gray-200 dark:border-darkBorder/40 shadow-sm">
                <span className="text-indigo-500 bg-indigo-100 dark:bg-indigo-950/40 p-3 rounded-lg text-xl">
                  <FaGraduationCap />
                </span>
                <div>
                  <h5 className="text-xs text-gray-405 dark:text-gray-400 uppercase font-bold tracking-wider">Education</h5>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">MCA Graduate</p>
                </div>
              </div>
            </div>

            {/* Career Highlights or Stats */}
            <div className="border-t border-gray-200 dark:border-darkBorder/60 pt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="text-3xl font-extrabold text-primary-650 dark:text-primary-400">1+</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-primary-650 dark:text-primary-400">4+</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Completed Projects</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-primary-650 dark:text-primary-400">12+</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Acquired Technologies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
