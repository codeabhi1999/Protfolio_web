import React from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

const ServicesSection = ({ services }) => {
  // Helper to load icons dynamically from string names
  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    if (IconComponent) {
      return <IconComponent />;
    }
    // Fallback icon
    return <FaIcons.FaLaptopCode />;
  };

  return (
    <section id="services" className="py-24 bg-white dark:bg-darkBg relative">
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
            My Services
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
            Professional development offerings and software solutions I provide.
          </motion.p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              key={service._id || index}
              className="p-8 bg-gray-50 dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-darkBorder/40 shadow-sm flex flex-col items-start gap-5 hover:shadow-md group transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="text-3xl text-primary-500 bg-primary-100 dark:bg-primary-950/40 p-4 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                {renderIcon(service.icon)}
              </div>

              {/* Title & description */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No services added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
