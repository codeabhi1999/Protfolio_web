import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaLock, FaEnvelope, FaArrowLeft, FaEye, FaEyeSlash, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleQuickFill = () => {
    setEmail('abhijeet.chavan@gmail.com');
    setPassword('admin123456');
    toast.success('Admin credentials autofilled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back, Abhijeet!');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col justify-center items-center px-4 sm:px-6 py-10 sm:py-0 relative overflow-hidden font-sans">
      
      {/* Ambient Glowing Orbs */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-600/15 blur-[140px] pointer-events-none mix-blend-screen animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyberCyan/12 blur-[140px] pointer-events-none mix-blend-screen animate-pulse-glow" />
      <div className="fixed inset-0 cyber-grid radial-mask pointer-events-none z-0" />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={() => navigate('/')}
        className="sm:absolute sm:top-10 sm:left-10 mb-6 sm:mb-0 self-start sm:self-auto text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-mono font-bold tracking-wide z-20 group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full"
      >
        <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform text-cyberCyan" />
        Back to Website
      </motion.button>

      {/* Login Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden group shadow-2xl border border-white/10">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-cyberCyan rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-glow-primary rotate-3"
            >
              <FaShieldAlt className="text-white text-2xl -rotate-3" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-1.5">
              Admin Command
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Authorized personnel authentication portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider ml-1">
                Admin Email
              </label>
              <div className="relative group/input">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyberCyan transition-colors">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  placeholder="abhijeet.chavan.dev@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 outline-none text-xs sm:text-sm text-white placeholder:text-gray-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group/input">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-cyberCyan transition-colors">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyberCyan focus:ring-2 focus:ring-cyberCyan/30 outline-none text-xs sm:text-sm text-white placeholder:text-gray-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Autofill Helper */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-cyberCyan flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-cyberCyan/40"
            >
              <FaBolt size={10} className="text-amber-400" />
              <span>Autofill Demo Admin Credentials</span>
            </button>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                'Access Admin Console'
              )}
            </motion.button>
          </form>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs font-mono text-gray-500 mt-6">
          Encrypted Authentication • Abhijeet Chavan Portfolio API
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
