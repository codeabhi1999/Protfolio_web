import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-darkBg text-gray-900 dark:text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl text-primary-500 flex justify-center"
        >
          <FaExclamationTriangle className="animate-bounce" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-550 to-indigo-500">404</h1>
          <h2 className="text-xl sm:text-2xl font-bold">Looks like you've taken a wrong turn.</h2>
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed"
        >
          The page you are trying to reach does not exist or has been relocated.
        </motion.p>

        {/* Navigation Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            <FaHome /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
