import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in both email and password fields');
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden font-sans">
      
      {/* Premium Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 sm:top-12 sm:left-12 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm font-medium tracking-wide z-20 group cursor-pointer"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
          <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
        </div>
        Back to Website
      </motion.button>

      {/* Login Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/20 rotate-3"
            >
              <FaLock className="text-white text-2xl -rotate-3" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-400 font-medium">Authenticate to access the admin portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Field */}
            <div className="space-y-2 relative">
              <label htmlFor="email" className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group/input">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary-400 transition-colors">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none text-sm text-white placeholder:text-gray-600 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group/input">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary-400 transition-colors">
                  <FaLock size={14} />
                </span>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 outline-none text-sm text-white placeholder:text-gray-600 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full relative overflow-hidden mt-8 py-3.5 bg-white text-black font-bold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-primary-100 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </span>
            </motion.button>
          </form>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6 font-medium">
          Secure Access Portal • Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
