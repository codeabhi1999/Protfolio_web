import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import API from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageProfile from './pages/ManageProfile';
import ManageSkills from './pages/ManageSkills';
import ManageProjects from './pages/ManageProjects';
import ManageTimeline from './pages/ManageTimeline';

// Public Layout Wrapper with Navbar & Footer
const BaseLayout = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/profile');
        if (response.data.success && response.data.data) {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching profile for footer:', err.message);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-darkBg text-white relative overflow-hidden font-sans selection:bg-primary-500/30">
      {/* Global Ambient Glow Orbs */}
      <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-600/15 blur-[140px] pointer-events-none mix-blend-screen z-0 animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyberCyan/12 blur-[140px] pointer-events-none mix-blend-screen z-0 animate-pulse-glow" />
      <div className="fixed top-[35%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-cyberViolet/10 blur-[120px] pointer-events-none mix-blend-screen z-0" />

      {/* Cyber Grid Pattern with Radial Vignette */}
      <div className="fixed inset-0 cyber-grid radial-mask pointer-events-none z-0" />

      <Navbar />
      <div className="flex-grow z-10 relative">
        <Outlet />
      </div>
      <div className="z-10 relative">
        <Footer profile={profile} />
      </div>
    </div>
  );
};

function App() {
  // Enforce dark mode on the root HTML element globally
  useEffect(() => {
    window.document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages Routes */}
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Administrative Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<ManageProfile />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="experience" element={<ManageTimeline />} />
            {/* Redirects */}
            <Route path="messages" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
      {/* Dynamic Action Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-semibold border dark:border-slate-800 bg-white text-slate-900 dark:bg-slate-900 dark:text-white',
          duration: 4000,
        }}
      />
    </AuthProvider>
  );
}

export default App;
