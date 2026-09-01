import React from 'react';
import * as FaIcons from 'react-icons/fa';

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaIcons.FaGithub />, url: profile?.socialLinks?.github || '#' },
    { icon: <FaIcons.FaLinkedin />, url: profile?.socialLinks?.linkedin || '#' },
    { icon: <FaIcons.FaInstagram />, url: profile?.socialLinks?.instagram || '#' },
    { icon: <FaIcons.FaEnvelope />, url: `mailto:${profile?.email || 'abhijeetchavan1459@gmail.com'}` },
  ];

  return (
    <footer className="bg-white dark:bg-darkBg border-t border-gray-200 dark:border-darkBorder/40 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold tracking-wider text-gray-800 dark:text-white">
            Abhijeet<span className="text-primary-500 font-medium">Chavan</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-450 mt-1">
            {profile?.role || 'Full Stack Developer | .NET & MERN Stack Developer'}
          </p>
        </div>

        {/* Social Profile Links */}
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 p-2.5 rounded-full bg-gray-155 dark:bg-darkCard hover:bg-gray-200 dark:hover:bg-darkCard/80 transition-all text-lg"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Abhijeet Chavan. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Built with MERN Stack (React, Node, Express, MongoDB) & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
