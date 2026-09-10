import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { 
  FaProjectDiagram, 
  FaBrain, 
  FaBriefcase, 
  FaEnvelopeOpenText, 
  FaTrash, 
  FaCheck, 
  FaSearch, 
  FaReply, 
  FaCopy, 
  FaSyncAlt, 
  FaEye, 
  FaTimes,
  FaCalendarAlt,
  FaPhone
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
    newMessages: 0,
  });
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, skillRes, expRes, msgRes] = await Promise.all([
        API.get('/projects').catch(() => ({ data: { data: [] } })),
        API.get('/skills').catch(() => ({ data: { data: [] } })),
        API.get('/experience').catch(() => ({ data: { data: [] } })),
        API.get('/contact').catch(() => ({ data: { data: [] } })),
      ]);

      const messagesList = msgRes.data?.data || [];
      const newMsgCount = messagesList.filter((m) => m.status === 'New').length;

      setStats({
        projects: (projRes.data?.data || []).length,
        skills: (skillRes.data?.data || []).length,
        experience: (expRes.data?.data || []).length,
        messages: messagesList.length,
        newMessages: newMsgCount,
      });

      setMessages(messagesList);
      setFilteredMessages(messagesList);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter messages by search query and status
  useEffect(() => {
    let list = [...messages];

    if (statusFilter !== 'All') {
      list = list.filter((m) => m.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.subject || '').toLowerCase().includes(q) ||
          (m.message || '').toLowerCase().includes(q)
      );
    }

    setFilteredMessages(list);
  }, [searchQuery, statusFilter, messages]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await API.patch(`/contact/${id}`, { status });
      if (response.data.success) {
        toast.success(`Message marked as ${status}`);
        const updated = messages.map((m) => (m._id === id ? { ...m, status } : m));
        setMessages(updated);
        setStats((prev) => ({
          ...prev,
          newMessages: updated.filter((m) => m.status === 'New').length,
        }));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      const response = await API.delete(`/contact/${id}`);
      if (response.data.success) {
        toast.success('Message deleted successfully');
        const updated = messages.filter((m) => m._id !== id);
        setMessages(updated);
        setStats((prev) => ({
          ...prev,
          messages: prev.messages - 1,
          newMessages: updated.filter((m) => m.status === 'New').length,
        }));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard!');
  };

  const statCards = [
    { 
      title: 'Deployed Projects', 
      value: stats.projects, 
      icon: <FaProjectDiagram />, 
      color: 'from-indigo-600 to-primary-500', 
      badge: 'Production Systems',
      shadow: 'shadow-glow-primary'
    },
    { 
      title: 'Mastered Skills', 
      value: stats.skills, 
      icon: <FaBrain />, 
      color: 'from-cyberCyan to-blue-500', 
      badge: 'Tech Stack Matrix',
      shadow: 'shadow-glow-cyan'
    },
    { 
      title: 'Career Milestones', 
      value: stats.experience, 
      icon: <FaBriefcase />, 
      color: 'from-purple-600 to-cyberViolet', 
      badge: 'Work Timeline',
      shadow: 'shadow-glow-violet'
    },
    { 
      title: 'Inquiry Messages', 
      value: stats.messages, 
      subValue: `${stats.newMessages} New`,
      icon: <FaEnvelopeOpenText />, 
      color: 'from-emerald-500 to-teal-500', 
      badge: stats.newMessages > 0 ? `${stats.newMessages} Unread` : 'Inbox Clear',
      highlight: stats.newMessages > 0,
      shadow: 'shadow-glow-emerald'
    },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-darkBg text-white min-h-screen">
      <AdminSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-[1600px]">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-2">
              System Control Console
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
              Live statistics, client communication logs, and content telemetries.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <FaSyncAlt className={loading ? 'animate-spin' : ''} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyberCyan shadow-glow-cyan"></div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Syncing Dashboard...</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card relative overflow-hidden transition-all group ${
                    card.highlight ? 'border-amber-500/50 shadow-glow-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-gray-400 tracking-wider">
                        {card.title}
                      </p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white">
                          {card.value}
                        </span>
                        {card.subValue && (
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {card.subValue}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 mt-2">
                        {card.badge}
                      </div>
                    </div>

                    <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr ${card.color} text-white text-lg sm:text-xl shadow-md group-hover:scale-110 transition-transform`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Contact Messages Log */}
            <div className="rounded-2xl sm:rounded-3xl glass-card overflow-hidden shadow-2xl border border-white/10">
              
              {/* Header & Filter Controls */}
              <div className="p-4 sm:p-6 lg:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    Client & Recruiter Messages
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Manage direct portfolio contact inquiries and notifications
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Status Filters */}
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
                    {['All', 'New', 'Read'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          statusFilter === st
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-grow md:w-64">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaSearch size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search sender, topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan text-xs font-mono text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Messages Table with Horizontal Scroll Safety */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[700px]">
                  <thead className="bg-[#0b101c] text-gray-400 uppercase text-[10px] font-mono font-bold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4 sm:px-6">Sender Details</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Message Snippet</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 sm:pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMessages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 sm:px-6">
                          <div className="font-bold text-white font-display">{msg.name}</div>
                          <div className="text-xs font-mono text-cyberCyan flex items-center gap-1.5 mt-0.5">
                            <span>{msg.email}</span>
                            <button
                              onClick={() => handleCopyEmail(msg.email)}
                              className="text-gray-500 hover:text-white cursor-pointer"
                              title="Copy Email"
                            >
                              <FaCopy size={10} />
                            </button>
                          </div>
                          {msg.phone && (
                            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1 mt-0.5">
                              <FaPhone size={9} /> {msg.phone}
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-gray-200 max-w-[180px] truncate text-xs">
                          {msg.subject || 'General Inquiry'}
                        </td>

                        <td className="p-4 text-xs text-gray-400 max-w-[280px]">
                          <p className="line-clamp-2 leading-relaxed">{msg.message}</p>
                        </td>

                        <td className="p-4 text-xs font-mono text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                              msg.status === 'New'
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                                : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </td>

                        <td className="p-4 sm:pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Detail Button */}
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="p-2 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="View Full Inquiry"
                            >
                              <FaEye size={12} />
                            </button>

                            {/* Reply Button */}
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                              className="p-2 bg-white/5 hover:bg-cyberCyan/20 text-gray-300 hover:text-cyberCyan rounded-lg transition-colors"
                              title="Reply via Email Client"
                            >
                              <FaReply size={12} />
                            </a>

                            {/* Status Toggle */}
                            {msg.status === 'New' && (
                              <button
                                onClick={() => handleUpdateStatus(msg._id, 'Read')}
                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                                title="Mark as Read"
                              >
                                <FaCheck size={12} />
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Message"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredMessages.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-16 text-center text-gray-400 font-mono">
                          No inquiries found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Message Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 relative shadow-2xl border border-white/20 my-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-cyberCyan bg-cyberCyan/10 px-3 py-1 rounded-full">
                      Inquiry Details
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      ID: {selectedMessage._id.substring(0, 8)}...
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                      {selectedMessage.subject || 'General Inquiry'}
                    </h3>
                    <div className="text-xs font-mono text-gray-400 mt-1 flex items-center gap-2">
                      <FaCalendarAlt size={11} className="text-cyberCyan" />
                      <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Sender Name</div>
                      <div className="text-sm font-bold text-white mt-0.5">{selectedMessage.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Sender Email</div>
                      <div className="text-sm font-mono text-cyberCyan mt-0.5 flex items-center gap-2">
                        <span className="break-all">{selectedMessage.email}</span>
                        <button
                          onClick={() => handleCopyEmail(selectedMessage.email)}
                          className="hover:text-white cursor-pointer shrink-0"
                          title="Copy Email"
                        >
                          <FaCopy size={11} />
                        </button>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Phone Number</div>
                        <div className="text-sm font-mono text-gray-200 mt-0.5">{selectedMessage.phone}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-mono uppercase font-bold text-gray-400 mb-2">Message Body</div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {selectedMessage.status === 'New' ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedMessage._id, 'Read')}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer text-center"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-gray-400">Status: Read</span>
                      )}
                    </div>

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                      className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-2 text-center"
                    >
                      <FaReply size={11} /> Reply to {selectedMessage.name}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AdminDashboard;
