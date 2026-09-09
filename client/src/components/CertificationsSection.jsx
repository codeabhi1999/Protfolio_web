import React from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaAward } from 'react-icons/fa';

const CertificationsSection = ({ certifications }) => {
  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest mb-3"
          >
            Verified Credentials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Certifications & Training
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Industry recognized assessments, developer certificates, and continuous technical learning.
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={cert._id || index}
              className="p-7 rounded-3xl glass-card flex items-start gap-5 group hover:border-emerald-500/50"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-glow-emerald">
                <FaCertificate />
              </div>

              {/* Details */}
              <div className="flex-grow space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {cert.name}
                </h3>
                
                <div className="text-sm font-semibold text-gray-300">
                  {cert.issuingOrganization}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-400 pt-1">
                  {cert.date && <span>Issued: {cert.date}</span>}
                  {cert.credentialId && (
                    <span className="text-gray-500">ID: {cert.credentialId}</span>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="pt-3">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyberCyan hover:text-white transition-colors"
                    >
                      Verify Credential <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {certifications.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 font-mono">
              No certifications recorded yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
