import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaCopy, 
  FaCheck, 
  FaPaperPlane,
  FaClock
} from 'react-icons/fa';
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
  const [copiedField, setCopiedField] = useState(null);

  const email = profile?.email || 'chavanabhijeet95@gmail.com';
  const phone = profile?.phone || '7057731248';

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
        toast.success(response.data.message || 'Message sent successfully! Thank you.', { id: toastId });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send message. Please try again or reach out directly.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-3"
          >
            Start A Conversation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Let's Build Something Exceptional
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Whether you have an upcoming project, a full-time .NET / Full-Stack opening, or simply want to connect, my inbox is always open.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* LEFT: Contact Information & Direct Channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 rounded-3xl glass-card space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <h3 className="text-xl font-bold font-display text-white">
                  Direct Channels
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Channel Items */}
              <div className="space-y-4">
                
                {/* Email Channel */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/40 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-3 rounded-xl bg-primary-600/20 text-primary-400 text-lg shrink-0">
                      <FaEnvelope />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-gray-400 uppercase font-bold">Email Address</div>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm font-bold text-white hover:text-cyberCyan transition-colors truncate block"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(email, 'Email')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy Email"
                  >
                    {copiedField === 'Email' ? <FaCheck className="text-emerald-400" size={12} /> : <FaCopy size={12} />}
                  </button>
                </div>

                {/* Phone Channel */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyberCyan/40 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-3 rounded-xl bg-cyberCyan/20 text-cyberCyan text-lg shrink-0">
                      <FaPhone />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-gray-400 uppercase font-bold">Phone Number</div>
                      <a
                        href={`tel:${phone}`}
                        className="text-sm font-bold text-white hover:text-cyberCyan transition-colors truncate block font-mono"
                      >
                        +91 {phone}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(phone, 'Phone')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                    title="Copy Phone"
                  >
                    {copiedField === 'Phone' ? <FaCheck className="text-emerald-400" size={12} /> : <FaCopy size={12} />}
                  </button>
                </div>

                {/* Location Channel */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-cyberViolet/20 text-cyberViolet text-lg shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-gray-400 uppercase font-bold">Base Location</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {profile?.location || 'Nagpur, Maharashtra, INDIA'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Response Time Notice */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs font-mono text-gray-400">
                <FaClock className="text-amber-400 shrink-0" />
                <span>Typical response time: Under 12 hours</span>
              </div>

              {/* Social Channels */}
              <div className="pt-5 border-t border-white/10">
                <div className="text-xs font-mono uppercase font-bold text-gray-400 mb-3">Professional Profiles</div>
                <div className="flex gap-3">
                  <a
                    href={profile?.socialLinks?.github || 'https://github.com/abhijeetchavan'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white/15 rounded-xl text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all text-base"
                    title="GitHub"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={profile?.socialLinks?.linkedin || 'https://linkedin.com/in/abhijeetchavan'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white/15 rounded-xl text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all text-base"
                    title="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={profile?.socialLinks?.instagram || 'https://instagram.com/abhijeetchavan'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white/15 rounded-xl text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all text-base"
                    title="Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Frosted Glass Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 p-8 rounded-3xl glass-card relative"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Your Name <span className="text-cyberCyan">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Abhijeet Chavan"
                    className="px-4 py-3 rounded-xl border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 focus:outline-none bg-darkBg/90 text-white placeholder-gray-500 text-sm transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Your Email <span className="text-cyberCyan">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="abhijeet@example.com"
                    className="px-4 py-3 rounded-xl border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 focus:outline-none bg-darkBg/90 text-white placeholder-gray-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
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
                    className="px-4 py-3 rounded-xl border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 focus:outline-none bg-darkBg/90 text-white placeholder-gray-500 text-sm transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Project Proposal / Hiring"
                    className="px-4 py-3 rounded-xl border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 focus:outline-none bg-darkBg/90 text-white placeholder-gray-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                  Your Message <span className="text-cyberCyan">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Describe your project, team requirements, or role details..."
                  className="px-4 py-3 rounded-xl border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 focus:outline-none bg-darkBg/90 text-white placeholder-gray-500 text-sm transition-all resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary-600 via-indigo-600 to-cyberCyan text-white shadow-glow-primary hover:shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={13} />
                    <span>Send Message Directly</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
