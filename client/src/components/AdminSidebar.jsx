import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaLaptopCode,
  FaBriefcase,
  FaEnvelope,
  FaGlobe,
  FaSignOutAlt,
  FaShieldAlt,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await API.get('/contact');
        if (res.data?.success && Array.isArray(res.data.data)) {
          const newCount = res.data.data.filter((m) => m.status === 'New').length;
          setUnreadCount(newCount);
        }
      } catch {
        // Silently ignore if offline
      }
    };
    fetchUnread();
  }, []);

  const menuItems = [
    { name: 'Overview KPI', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Profile & Bio', path: '/admin/profile', icon: <FaUser /> },
    { name: 'Skills Matrix', path: '/admin/skills', icon: <FaCode /> },
    { name: 'Projects Studio', path: '/admin/projects', icon: <FaLaptopCode /> },
    { name: 'Career & Timeline', path: '/admin/experience', icon: <FaBriefcase /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-72 bg-[#0a0e18] text-white min-h-screen flex flex-col justify-between border-r border-white/10 shrink-0 select-none relative z-30 shadow-2xl">
      <div className="flex flex-col">
        {/* Header Branding */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-cyberCyan flex items-center justify-center font-black text-xs text-white shadow-glow-primary group-hover:scale-105 transition-transform">
              AC
            </div>
            <div>
              <div className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Abhijeet.dev</span>
                <FaShieldAlt size={11} className="text-cyberCyan" />
              </div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                Admin Command Suite
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Category Label */}
        <div className="px-6 pt-6 pb-2">
          <span className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider">
            System Modules
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="px-4 py-2 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600/70 to-cyberCyan/60 text-white shadow-glow-primary border border-white/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </div>
              {item.path === '/admin/dashboard' && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Info & Actions */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#080b13]">
        
        {/* Admin Identity Card */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
            A
          </div>
          <div className="min-w-0 flex-grow">
            <div className="text-xs font-bold text-white truncate font-display">
              {admin?.email || 'abhijeet.chavan.dev'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated Admin
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <FaGlobe size={11} className="text-cyberCyan" />
            <span>Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
          >
            <FaSignOutAlt size={11} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
