import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaProjectDiagram, FaBrain, FaBriefcase, FaEnvelopeOpenText, FaTrash, FaCheck } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
    newMessages: 0,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, skillRes, expRes, msgRes] = await Promise.all([
        API.get('/projects'),
        API.get('/skills'),
        API.get('/experience'),
        API.get('/contact'),
      ]);

      const messagesList = msgRes.data?.data || [];
      const newMsgCount = messagesList.filter(m => m.status === 'New').length;

      setStats({
        projects: (projRes.data?.data || []).length,
        skills: (skillRes.data?.data || []).length,
        experience: (expRes.data?.data || []).length,
        messages: messagesList.length,
        newMessages: newMsgCount,
      });

      setMessages(messagesList);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error.message);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await API.patch(`/contact/${id}`, { status });
      if (response.data.success) {
        toast.success(`Message marked as ${status}`);
        // Refresh local listings
        setMessages(
          messages.map((m) => (m._id === id ? { ...m, status } : m))
        );
        // Recalculate stats
        const updatedMessages = messages.map((m) => (m._id === id ? { ...m, status } : m));
        setStats(prev => ({
          ...prev,
          newMessages: updatedMessages.filter(m => m.status === 'New').length
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      const response = await API.delete(`/contact/${id}`);
      if (response.data.success) {
        toast.success('Message deleted successfully');
        setMessages(messages.filter((m) => m._id !== id));
        setStats(prev => ({
          ...prev,
          messages: prev.messages - 1,
          newMessages: messages.filter((m) => m._id !== id && m.status === 'New').length
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: <FaProjectDiagram />, color: 'bg-indigo-600' },
    { title: 'Total Skills', value: stats.skills, icon: <FaBrain />, color: 'bg-emerald-600' },
    { title: 'Experiences', value: stats.experience, icon: <FaBriefcase />, color: 'bg-blue-600' },
    { title: 'New Messages', value: stats.newMessages, icon: <FaEnvelopeOpenText />, color: 'bg-amber-600', highlight: stats.newMessages > 0 },
  ];

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <AdminSidebar />

      {/* Main Panel Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1.5">Overview statistics and contact logs.</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`p-6 bg-slate-900 border ${
                    card.highlight ? 'border-amber-500/40' : 'border-slate-800'
                  } rounded-xl flex items-center justify-between shadow-md`}
                >
                  <div className="space-y-1">
                    <p className="text-xs text-slate-450 uppercase font-bold tracking-wider">{card.title}</p>
                    <p className="text-3xl font-black">{card.value}</p>
                  </div>
                  <span className={`p-4 rounded-lg text-xl text-white ${card.color}`}>
                    {card.icon}
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Contact Messages Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">Contact Messages Log</h3>
                <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
                  Total: {stats.messages}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-450 uppercase text-[10px] font-bold tracking-wider border-b border-slate-850">
                    <tr>
                      <th className="p-4">Sender</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {messages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="p-4">
                          <div className="font-bold">{msg.name}</div>
                          <div className="text-xs text-slate-450 mt-0.5">{msg.email}</div>
                          {msg.phone && <div className="text-xs text-slate-500 font-mono">{msg.phone}</div>}
                        </td>
                        <td className="p-4 font-medium max-w-[150px] truncate">{msg.subject}</td>
                        <td className="p-4 text-xs text-slate-350 max-w-[250px] whitespace-pre-line">{msg.message}</td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                              msg.status === 'New'
                                ? 'text-amber-500 bg-amber-500/15 border-amber-500/20'
                                : msg.status === 'Read'
                                ? 'text-blue-400 bg-blue-400/15 border-blue-400/20'
                                : 'text-slate-400 bg-slate-800 border-slate-700'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {msg.status === 'New' && (
                              <button
                                onClick={() => handleUpdateStatus(msg._id, 'Read')}
                                className="p-2 bg-slate-800 hover:bg-primary-900/40 text-slate-300 hover:text-primary-400 rounded transition-colors cursor-pointer"
                                title="Mark as Read"
                              >
                                <FaCheck size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-2 bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 rounded transition-colors cursor-pointer"
                              title="Delete Message"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {messages.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No messages received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
