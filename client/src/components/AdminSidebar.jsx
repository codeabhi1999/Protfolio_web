import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaLaptopCode,
  FaBriefcase,
  FaGlobe,
  FaSignOutAlt,
  FaShieldAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { name: 'Overview KPI', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Profile & Bio', path: '/admin/profile', icon: <FaUser /> },
    { name: 'Skills Matrix', path: '/admin/skills', icon: <FaCode /> },
    { name: 'Projects Studio', path: '/admin/projects', icon: <FaLaptopCode /> },
    { name: 'Career & Timeline', path: '/admin/experience', icon: <FaBriefcase /> },
    { name: 'Security & Access', path: '/admin/security', icon: <FaShieldAlt /> },
  ];

  const currentModule = menuItems.find((item) => item.path === location.pathname) || {
    name: 'Admin Console',
    icon: <FaShieldAlt />,
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const renderNavLinks = (isMobile = false) => (
    <nav className="px-4 py-2 flex flex-col gap-1.5">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => isMobile && setMobileOpen(false)}
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
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold animate-pulse">
              {unreadCount} New
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const renderFooter = () => (
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
  );

  return (
    <>
      {/* ==================================================== */}
      {/* 1. MOBILE TOP NAVIGATION BAR (Visible on screens < md) */}
      {/* ==================================================== */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-[#0a0e18]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-cyberCyan flex items-center justify-center font-black text-xs text-white shadow-glow-primary">
            AC
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              <span>Abhijeet.dev</span>
              <FaShieldAlt size={10} className="text-cyberCyan" />
            </div>
            <p className="text-[9px] font-mono text-cyberCyan font-medium">
              Admin Suite
            </p>
          </div>
        </Link>

        {/* Current Module Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300">
          <span className="text-cyberCyan">{currentModule.icon}</span>
          <span className="truncate max-w-[120px]">{currentModule.name}</span>
        </div>

        {/* Hamburger Drawer Toggle Button */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold font-mono">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. MOBILE SLIDE-OUT DRAWER OVERLAY & PANEL            */}
      {/* ==================================================== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <div className="relative z-50 w-72 sm:w-80 bg-[#0a0e18] text-white h-full flex flex-col justify-between border-r border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex flex-col">
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-cyberCyan flex items-center justify-center font-black text-xs text-white shadow-glow-primary">
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

                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close navigation"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Module category label */}
              <div className="px-6 pt-5 pb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider">
                  System Modules
                </span>
              </div>

              {/* Nav links */}
              {renderNavLinks(true)}
            </div>

            {/* Bottom Admin Card and Actions */}
            {renderFooter()}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (Visible on screens >= md) */}
      {/* ==================================================== */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#0a0e18] text-white min-h-screen sticky top-0 h-screen flex-col justify-between border-r border-white/10 shrink-0 select-none z-30 shadow-2xl overflow-y-auto">
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
          {renderNavLinks(false)}
        </div>

        {/* Sidebar Footer Info & Actions */}
        {renderFooter()}
      </aside>
    </>
  );
};

export default AdminSidebar;
