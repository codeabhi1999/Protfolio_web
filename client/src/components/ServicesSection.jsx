import React from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import { FaLaptopCode, FaCheck } from 'react-icons/fa';

const ServicesSection = ({ services }) => {
  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName];
    if (IconComponent) {
      return <IconComponent />;
    }
    return <FaLaptopCode />;
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyberCyan/10 border border-cyberCyan/20 text-xs font-mono font-semibold text-cyberCyan uppercase tracking-widest mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Engineering Solutions & Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Full life-cycle software development offerings tailored for performance, security, and scalability.
          </motion.p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={service._id || index}
              className="p-8 rounded-3xl glass-card flex flex-col justify-between group hover:border-cyberCyan/50 relative overflow-hidden"
            >
              <div className="relative z-10">
                {/* Icon Container with Glow */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-cyberCyan flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-cyberCyan/40 group-hover:bg-cyberCyan/10 transition-all duration-300 shadow-glow-cyan mb-6">
                  {renderIcon(service.icon)}
                </div>

                <h3 className="text-xl font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center text-xs font-mono text-emerald-400 gap-2">
                <FaCheck size={11} /> Enterprise Ready Architecture
              </div>
            </motion.div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 font-mono">
              No services listed yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
