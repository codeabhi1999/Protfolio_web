import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt,
  FaUser,
  FaCode,
  FaLaptopCode,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaEnvelope,
  FaHome,
  FaSignOutAlt,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Profile Bio', path: '/admin/profile', icon: <FaUser /> },
    { name: 'Manage Skills', path: '/admin/skills', icon: <FaCode /> },
    { name: 'Manage Projects', path: '/admin/projects', icon: <FaLaptopCode /> },
    { name: 'Experience Timeline', path: '/admin/experience', icon: <FaBriefcase /> },
    { name: 'Education History', path: '/admin/education', icon: <FaGraduationCap /> },
    { name: 'Certifications', path: '/admin/certifications', icon: <FaCertificate /> },
    { name: 'Contact Messages', path: '/admin/messages', icon: <FaEnvelope /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div className="flex flex-col">
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-bold tracking-wider text-primary-400 flex items-center gap-2">
            <span>AC.dev Admin</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Management Portal</p>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="p-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Actions */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <FaHome />
          <span>Go To Site</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all w-full text-left cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
