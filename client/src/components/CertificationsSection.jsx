import React from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaAward } from 'react-icons/fa';

const CertificationsSection = ({ certifications }) => {
  return (
    <section id="certifications" className="py-24 bg-gray-50 dark:bg-darkBg/60 relative">
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
            Certifications
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
            My professional credentials, validated certifications, and training milestones.
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={cert._id || index}
              className="p-6 bg-white dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-darkBorder/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="text-3xl text-primary-500 bg-primary-100 dark:bg-primary-950/40 p-4 rounded-xl shrink-0">
                <FaCertificate />
              </div>

              {/* Details */}
              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {cert.name}
                </h3>
                <div className="text-sm font-semibold text-gray-650 dark:text-gray-400">
                  {cert.issuingOrganization}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-405 dark:text-gray-500">
                  <span>Issued: {cert.date}</span>
                  {cert.credentialId && (
                    <span className="font-mono">ID: {cert.credentialId}</span>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="pt-2">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Verify Credential <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {certifications.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No certifications added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
