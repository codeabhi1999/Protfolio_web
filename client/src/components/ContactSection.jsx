import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import API from '../services/api';

const ContactSection = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!message.trim()) {
      toast.error('Message is required');
      return false;
    }
    if (message.trim().length < 10) {
      toast.error('Message must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const toastId = toast.loading('Sending your message...');

    try {
      const response = await API.post('/contact', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Message sent successfully!', { id: toastId });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-darkBg relative">
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
            Get In Touch
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
            Have a question, proposal, or want to discuss a project? Drop a message here!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 bg-gray-50 dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-darkBorder/40 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-darkBorder/30 pb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary-500 bg-primary-100 dark:bg-primary-950/40 p-3 rounded-lg">
                    <FaEnvelope />
                  </span>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</h5>
                    <a
                      href={`mailto:${profile?.email || 'abhijeet.chavan.dev@gmail.com'}`}
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors mt-0.5 block"
                    >
                      {profile?.email || 'abhijeet.chavan.dev@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl text-indigo-500 bg-indigo-100 dark:bg-indigo-950/40 p-3 rounded-lg">
                    <FaPhone />
                  </span>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</h5>
                    <a
                      href={`tel:${profile?.phone || '+919876543210'}`}
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors mt-0.5 block"
                    >
                      {profile?.phone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40 p-3 rounded-lg">
                    <FaMapMarkerAlt />
                  </span>
                  <div>
                    <h5 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</h5>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                      {profile?.location || 'Nagpur, Maharashtra, India'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-gray-200 dark:border-darkBorder/30">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Connect Socially</h4>
                <div className="flex gap-3">
                  <a
                    href={profile?.socialLinks?.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white dark:bg-darkBg rounded-lg text-gray-500 hover:text-primary-500 border border-gray-200 dark:border-darkBorder/40 transition-colors"
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href={profile?.socialLinks?.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white dark:bg-darkBg rounded-lg text-gray-500 hover:text-primary-500 border border-gray-200 dark:border-darkBorder/40 transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href={profile?.socialLinks?.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white dark:bg-darkBg rounded-lg text-gray-500 hover:text-primary-500 border border-gray-200 dark:border-darkBorder/40 transition-colors"
                  >
                    <FaInstagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-gray-50 dark:bg-darkCard p-8 rounded-2xl border border-gray-200 dark:border-darkBorder/40 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Abhijeet Chavan"
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-darkBorder focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-darkBg text-gray-900 dark:text-white text-sm transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="abhijeet@example.com"
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-darkBorder focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-darkBg text-gray-900 dark:text-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="+91 XXXXX XXXXX"
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-darkBorder focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-darkBg text-gray-900 dark:text-white text-sm transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Project Proposal / Job Opportunity"
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-darkBorder focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-darkBg text-gray-900 dark:text-white text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Tell me about your project context or vacancy..."
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-darkBorder focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-darkBg text-gray-900 dark:text-white text-sm transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-700 text-white font-bold rounded-lg shadow-md hover:shadow-primary-650/30 transition-all cursor-pointer flex items-center justify-center"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
