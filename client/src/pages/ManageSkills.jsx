import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus, FaTimes, FaSearch, FaCode, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Backend',
    level: 'Advanced',
  });

  const categories = ['All', 'Backend', 'Frontend', 'Database', 'Tools', 'Other'];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await API.get('/skills');
      if (response.data.success) {
        setSkills(response.data.data);
        setFilteredSkills(response.data.data);
      }
    } catch {
      toast.error('Failed to load skills list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Filter skills
  useEffect(() => {
    let list = [...skills];
    if (activeCategory !== 'All') {
      list = list.filter(
        (s) => (s.category || '').toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q) ||
          (s.level || '').toLowerCase().includes(q)
      );
    }
    setFilteredSkills(list);
  }, [searchQuery, activeCategory, skills]);

  const handleOpenCreate = () => {
    setFormData({ name: '', category: 'Backend', level: 'Advanced' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setEditingId(skill._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      if (editingId) {
        const response = await API.put(`/skills/${editingId}`, formData);
        if (response.data.success) {
          toast.success('Skill updated successfully');
          setSkills(skills.map((s) => (s._id === editingId ? response.data.data : s)));
        }
      } else {
        const response = await API.post('/skills', formData);
        if (response.data.success) {
          toast.success('Skill added successfully');
          setSkills([...skills, response.data.data]);
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this skill?')) return;
    try {
      const response = await API.delete(`/skills/${id}`);
      if (response.data.success) {
        toast.success('Skill deleted successfully');
        setSkills(skills.filter((s) => s._id !== id));
      }
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  const getLevelBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'advanced' || l === 'expert') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (l === 'intermediate') {
      return 'text-cyberCyan bg-cyberCyan/10 border-cyberCyan/30';
    }
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="flex bg-darkBg text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-[1600px]">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyberCyan/10 border border-cyberCyan/20 text-xs font-mono font-semibold text-cyberCyan uppercase tracking-widest mb-2">
              Capabilities Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Skills Matrix Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
              Add, organize, and calibrate technical proficiencies for public showcase.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-xl font-display font-bold text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <FaPlus size={12} />
            <span>Add Technical Skill</span>
          </button>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white bg-darkCard/60 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative md:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              placeholder="Filter skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-darkCard border border-white/10 focus:border-cyberCyan text-xs font-mono text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyberCyan shadow-glow-cyan"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="p-5 rounded-3xl glass-card flex flex-col justify-between group hover:border-primary-500/50 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider">
                      {skill.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getLevelBadge(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                    {skill.name}
                  </h3>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Skill"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer"
                    title="Delete Skill"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}

            {filteredSkills.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 font-mono rounded-3xl glass-card">
                No skills found matching your filter.
              </div>
            )}
          </div>
        )}

        {/* Modal Dialog */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/20"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                  <h3 className="text-lg font-bold font-display text-white">
                    {editingId ? 'Modify Technical Skill' : 'Add New Skill'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. ASP.NET Core 8, C#, SQL Server"
                      className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                    >
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Expertise Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                    >
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Beginner">Beginner</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-cyberCyan text-white font-mono text-xs font-bold shadow-glow-primary hover:opacity-95 transition-all cursor-pointer"
                    >
                      {editingId ? 'Update Skill' : 'Add Skill'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ManageSkills;
