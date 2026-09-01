import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await API.get('/skills');
      if (response.data.success) {
        setSkills(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load skills list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', category: 'Frontend', level: 'Intermediate' });
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
        // Edit Skill
        const response = await API.put(`/skills/${editingId}`, formData);
        if (response.data.success) {
          toast.success('Skill updated successfully');
          setSkills(skills.map(s => s._id === editingId ? response.data.data : s));
        }
      } else {
        // Create Skill
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
    if (!window.confirm('Delete this skill?')) return;
    try {
      const response = await API.delete(`/skills/${id}`);
      if (response.data.success) {
        toast.success('Skill deleted successfully');
        setSkills(skills.filter(s => s._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Skills</h1>
            <p className="text-sm text-slate-400 mt-1">Configure technical capabilities and levels.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-primary-650 hover:bg-primary-550 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FaPlus /> Add Skill
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
                <thead className="bg-slate-950 text-slate-450 uppercase text-[10px] font-bold tracking-wider border-b border-slate-850">
                  <tr>
                    <th className="p-4">Skill Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Experience Level</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {skills.map((skill) => (
                    <tr key={skill._id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="p-4 font-semibold">{skill.name}</td>
                      <td className="p-4 text-slate-400">{skill.category}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            skill.level === 'Advanced'
                              ? 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20'
                              : skill.level === 'Intermediate'
                              ? 'text-indigo-450 bg-indigo-500/10 border-indigo-500/20'
                              : 'text-amber-450 bg-amber-500/10 border-amber-500/20'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(skill)}
                            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="text-slate-400 hover:text-red-400 p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {skills.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        No skills configured. Click 'Add Skill' to insert some.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Skill Dialog Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Skill Details' : 'Add New Skill'}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ASP.NET Core, React.js"
                    className="w-full px-4 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Expertise Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-800 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Advanced">Advanced (Advanced badge)</option>
                    <option value="Intermediate">Intermediate (Intermediate badge)</option>
                    <option value="Beginner">Beginner (Beginner badge)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    {editingId ? 'Save Changes' : 'Create Skill'}
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

export default ManageSkills;
