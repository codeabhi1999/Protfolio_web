import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  FaShieldAlt,
  FaKey,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave,
  FaUserCheck,
  FaServer,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const ManageSecurity = () => {
  const { admin } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword.trim()) {
      toast.error('Please enter your current password to authorize changes');
      return;
    }

    if (!formData.newEmail.trim() && !formData.newPassword.trim()) {
      toast.error('Please enter a new email or new password to update');
      return;
    }

    if (formData.newPassword.trim()) {
      if (formData.newPassword.trim().length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New password and confirm password do not match');
        return;
      }
    }

    if (formData.newEmail.trim() && !formData.newEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Updating credentials...');

    try {
      const payload = {
        currentPassword: formData.currentPassword.trim(),
        ...(formData.newEmail.trim() && { newEmail: formData.newEmail.trim() }),
        ...(formData.newPassword.trim() && { newPassword: formData.newPassword.trim() }),
      };

      const response = await API.put('/auth/update-credentials', payload);

      if (response.data?.success) {
        toast.success(response.data.message || 'Credentials updated successfully!', { id: toastId });

        // Update local stored session
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        }

        // Reset inputs
        setFormData({
          currentPassword: '',
          newEmail: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.data?.message || 'Failed to update credentials', { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to update credentials',
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#040711] min-h-screen text-gray-200">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 max-w-7xl overflow-x-hidden relative">
        {/* Glow ambient accent */}
        <div className="fixed top-12 right-24 w-96 h-96 bg-primary-600/10 blur-[130px] pointer-events-none" />

        {/* Page Header */}
        <header className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyberCyan tracking-wider mb-2">
            <FaShieldAlt />
            <span>Security & Authentication Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
            Admin Credentials & Access
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Modify your administrative email address and secure master password stored in Supabase PostgreSQL.
          </p>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shrink-0">
              <FaUserCheck />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono text-gray-400 uppercase">Active Login Email</div>
              <div className="text-sm sm:text-base font-bold text-white truncate font-display mt-0.5">
                {admin?.email || 'abhijeet.chavan.dev@gmail.com'}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Active Admin
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyberCyan/10 border border-cyberCyan/20 flex items-center justify-center text-cyberCyan text-xl shrink-0">
              <FaServer />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono text-gray-400 uppercase">Auth Storage Engine</div>
              <div className="text-sm sm:text-base font-bold text-white font-display mt-0.5">
                Supabase PostgreSQL
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">
                Bcrypt Salted & Hashed (Cost 10)
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card border border-white/10 flex items-center gap-4 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 text-xl shrink-0">
              <FaKey />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono text-gray-400 uppercase">Session Security</div>
              <div className="text-sm sm:text-base font-bold text-white font-display mt-0.5">
                JWT Bearer & Cookie
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">
                Auto-refreshed upon password change
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="max-w-3xl rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 lg:p-10 border border-white/10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Email Update */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-5">
                <FaEnvelope className="text-cyberCyan" />
                <h2 className="text-base font-bold font-display text-white">
                  Update Login Email Address
                </h2>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                  New Admin Email (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    name="newEmail"
                    value={formData.newEmail}
                    onChange={handleChange}
                    placeholder="e.g. new.email@example.com (leave blank to keep current)"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyberCyan transition-colors font-sans"
                  />
                </div>
                <p className="text-[11px] font-mono text-gray-500 mt-1.5">
                  This email will become your new username for logging into the Admin Studio.
                </p>
              </div>
            </div>

            {/* Section 2: Password Update */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-5">
                <FaLock className="text-primary-400" />
                <h2 className="text-base font-bold font-display text-white">
                  Change Master Password
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                    New Password (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {formData.newPassword && (
                <div className="mt-3 text-xs font-mono flex items-center gap-2">
                  {formData.newPassword.length >= 6 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <FaCheckCircle size={12} /> Password length criteria met
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <FaExclamationTriangle size={12} /> Must be at least 6 characters
                    </span>
                  )}
                  {formData.confirmPassword && (
                    formData.newPassword === formData.confirmPassword ? (
                      <span className="text-emerald-400 flex items-center gap-1 ml-4">
                        <FaCheckCircle size={12} /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1 ml-4">
                        <FaExclamationTriangle size={12} /> Passwords do not match
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Current Password Verification */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-2">
                Current Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <FaKey size={14} />
                </span>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your current password to authorize changes"
                  className="w-full bg-black/60 border border-white/20 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyberCyan transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white cursor-pointer"
                >
                  {showCurrentPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              <p className="text-[11px] font-mono text-gray-400 mt-2">
                Required for security verification before changes are written to the database.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    currentPassword: '',
                    newEmail: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Clear Inputs
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FaSave size={14} />
                <span>{submitting ? 'Updating Credentials...' : 'Save New Credentials'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ManageSecurity;
