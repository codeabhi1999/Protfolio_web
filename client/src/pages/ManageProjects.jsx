import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      }
    } catch (error) {
      toast.error('Failed to load projects list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
      technologies: project.technologies.join(', '),
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
        setFormData(prev => ({
          ...prev,
          image: response.data.url, // Path to statically served file
        }));
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload image';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, technologies, category } = formData;

    if (!title.trim() || !description.trim() || !technologies.trim() || !category.trim()) {
      toast.error('Please enter all required fields (Title, Description, Technologies, Category)');
      return;
    }

    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const response = await API.put(`/projects/${editingId}`, payload);
        if (response.data.success) {
          toast.success('Project updated successfully');
          setProjects(projects.map(p => p._id === editingId ? response.data.data : p));
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
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      const response = await API.delete(`/projects/${id}`);
      if (response.data.success) {
        toast.success('Project deleted successfully');
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Projects</h1>
            <p className="text-sm text-slate-400 mt-1">Configure project cards, URLs, descriptions, and feature items.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-primary-650 hover:bg-primary-550 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FaPlus /> Add Project
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-455 uppercase text-[10px] font-bold tracking-wider border-b border-slate-850">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Technologies</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="p-4 font-semibold">{project.title}</td>
                      <td className="p-4 text-slate-400">{project.category}</td>
                      <td className="p-4">
                        <span
                          className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                            project.featured
                              ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                              : 'text-slate-500 bg-slate-800 border-slate-700'
                          }`}
                        >
                          {project.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 max-w-[200px] truncate">
                        {project.technologies.join(', ')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-slate-400 hover:text-red-400 p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {projects.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">
                        No projects created. Click 'Add Project' to insert details.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Projects Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Project Details' : 'Add New Project'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Daily Expense Tracker"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value=".NET">.NET</option>
                      <option value="MERN">MERN</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description for preview cards"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    rows={4}
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Provide full technical scope, specifications, or challenges met..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Technologies (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB, Tailwind CSS"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Project Image Path/URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="e.g. /uploads/image.png or Cloud URL"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-850 text-slate-200 text-xs font-bold rounded-lg border border-dashed border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <FaUpload /> {uploading ? 'Uploading...' : 'Upload Image File'}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Live Demo URL</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-slate-800 bg-slate-950 rounded focus:ring-primary-550"
                  />
                  <label htmlFor="featured" className="text-sm font-semibold select-none cursor-pointer">
                    Feature on Homepage Carousel / Featured Section
                  </label>
                </div>

                <div className="pt-4 flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {editingId ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageProjects;
