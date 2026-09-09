import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaTimes, 
  FaUpload, 
  FaLaptopCode, 
  FaGithub, 
  FaExternalLinkAlt, 
  FaStar,
  FaSearch
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    technologies: '',
    category: 'Full Stack',
    image: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data);
        setFilteredProjects(response.data.data);
      }
    } catch {
      toast.error('Failed to load projects list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredProjects(
        projects.filter(
          (p) =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.category || '').toLowerCase().includes(q) ||
            (p.technologies || []).some((t) => t.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, projects]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      detailedDescription: '',
      technologies: '',
      category: 'Full Stack',
      image: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      detailedDescription: project.detailedDescription || '',
      technologies: (project.technologies || []).join(', '),
      category: project.category,
      image: project.image || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured === true,
    });
    setEditingId(project._id);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Uploading project image...');

    try {
      const response = await API.post('/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Image uploaded successfully!', { id: toastId });
        setFormData((prev) => ({
          ...prev,
          image: response.data.url,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, technologies, category } = formData;

    if (!title.trim() || !description.trim() || !technologies.trim() || !category.trim()) {
      toast.error('Please enter required fields (Title, Description, Technologies, Category)');
      return;
    }

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        const response = await API.put(`/projects/${editingId}`, payload);
        if (response.data.success) {
          toast.success('Project updated successfully');
          setProjects(projects.map((p) => (p._id === editingId ? response.data.data : p)));
        }
      } else {
        const response = await API.post('/projects', payload);
        if (response.data.success) {
          toast.success('Project added successfully');
          setProjects([response.data.data, ...projects]);
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this project?')) return;
    try {
      const response = await API.delete(`/projects/${id}`);
      if (response.data.success) {
        toast.success('Project deleted successfully');
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="flex bg-darkBg text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-[1600px]">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-2">
              Production Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Projects Studio Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
              Create and manage software case studies, repository links, and featured items.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-xl font-display font-bold text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <FaPlus size={12} />
            <span>Create New Project</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-8 flex justify-end">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-darkCard border border-white/10 focus:border-cyberCyan text-xs font-mono text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyberCyan shadow-glow-cyan"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="rounded-3xl glass-card flex flex-col justify-between overflow-hidden group hover:border-primary-500/50 relative"
              >
                {/* Mockup Header */}
                <div className="bg-[#0b101c] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-gray-400 uppercase font-bold text-[10px]">
                    {project.category}
                  </span>
                  {project.featured ? (
                    <span className="text-amber-400 flex items-center gap-1 font-bold text-[10px]">
                      <FaStar size={10} /> Featured
                    </span>
                  ) : (
                    <span className="text-gray-600 text-[10px]">Standard</span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {(project.technologies || []).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                          title="View Repository"
                        >
                          <FaGithub size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyberCyan hover:text-white"
                          title="Live Demo"
                        >
                          <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 font-mono rounded-3xl glass-card">
                No projects found. Click 'Create New Project' to add your first project.
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl rounded-3xl glass-card p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/20 my-8"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                  <h3 className="text-xl font-bold font-display text-white">
                    {editingId ? 'Modify Project Showcase' : 'Create New Project Showcase'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Hospital Management System"
                        className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                      >
                        <option value=".NET">.NET</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="MERN">MERN</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="High-level summary for cards..."
                      className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Detailed Architectural Summary
                    </label>
                    <textarea
                      rows={3}
                      value={formData.detailedDescription}
                      onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                      placeholder="In-depth modules, architecture, database design..."
                      className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Technologies (comma-separated) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="ASP.NET, C#, SQL Server, HTML, CSS, JavaScript"
                      className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs text-white font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Image Upload & Featured Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Thumbnail Image Asset
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-primary-600 file:text-white hover:file:bg-primary-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <label htmlFor="featured" className="text-xs font-mono font-bold text-white cursor-pointer">
                        Feature on Hero / Landing Preview
                      </label>
                    </div>
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
                      {editingId ? 'Save Project Changes' : 'Publish Project'}
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

export default ManageProjects;
