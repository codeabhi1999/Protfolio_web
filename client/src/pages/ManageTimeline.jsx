import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaTimes, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTimeline = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Experience Form State
  const [expFormData, setExpFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: 'Present',
    location: '',
    responsibilities: '',
    technologies: '',
  });

  // Education Form State
  const [eduFormData, setEduFormData] = useState({
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, eduRes] = await Promise.all([
        API.get('/experience'),
        API.get('/education'),
      ]);
      setExperiences(expRes.data?.data || []);
      setEducations(eduRes.data?.data || []);
    } catch {
      toast.error('Failed to load timeline records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    if (activeTab === 'experience') {
      setExpFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: 'Present',
        location: '',
        responsibilities: '',
        technologies: '',
      });
    } else {
      setEduFormData({
        degree: '',
        institution: '',
        startYear: '',
        endYear: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    if (activeTab === 'experience') {
      setExpFormData({
        company: item.company,
        position: item.position,
        startDate: item.startDate,
        endDate: item.endDate,
        location: item.location || '',
        responsibilities: (item.responsibilities || []).join('\n'),
        technologies: (item.technologies || []).join(', '),
      });
    } else {
      setEduFormData({
        degree: item.degree,
        institution: item.institution,
        startYear: item.startYear,
        endYear: item.endYear,
        description: item.description || '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'experience') {
        const { company, position, startDate } = expFormData;
        if (!company.trim() || !position.trim() || !startDate.trim()) {
          toast.error('Company, Position, and Start Date are required');
          return;
        }

        const payload = {
          ...expFormData,
          responsibilities: expFormData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
          technologies: expFormData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (editingId) {
          const res = await API.put(`/experience/${editingId}`, payload);
          if (res.data.success) {
            toast.success('Experience record updated');
            setExperiences(experiences.map(e => e._id === editingId ? res.data.data : e));
          }
        } else {
          const res = await API.post('/experience', payload);
          if (res.data.success) {
            toast.success('Experience record added');
            setExperiences([res.data.data, ...experiences]);
          }
        }
      } else {
        const { degree, institution, startYear, endYear } = eduFormData;
        if (!degree.trim() || !institution.trim() || !startYear.trim() || !endYear.trim()) {
          toast.error('Please enter all required fields');
          return;
        }

        if (editingId) {
          const res = await API.put(`/education/${editingId}`, eduFormData);
          if (res.data.success) {
            toast.success('Education record updated');
            setEducations(educations.map(e => e._id === editingId ? res.data.data : e));
          }
        } else {
          const res = await API.post('/education', eduFormData);
          if (res.data.success) {
            toast.success('Education record added');
            setEducations([res.data.data, ...educations]);
          }
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      const route = activeTab === 'experience' ? `/experience/${id}` : `/education/${id}`;
      const response = await API.delete(route);
      if (response.data.success) {
        toast.success('Record deleted successfully');
        if (activeTab === 'experience') {
          setExperiences(experiences.filter(e => e._id !== id));
        } else {
          setEducations(educations.filter(e => e._id !== id));
        }
      }
    } catch {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-darkBg text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-[1600px]">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyberEmerald/10 border border-cyberEmerald/20 text-xs font-mono font-semibold text-cyberEmerald uppercase tracking-widest mb-2">
              Chronicle Studio
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              Career & Education Timeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
              Manage chronological employment history, degrees, and academic milestones.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl font-display font-bold text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <FaPlus size={12} />
            <span>Add {activeTab === 'experience' ? 'Experience' : 'Education'}</span>
          </button>
        </header>

        {/* Tab Selection */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-6 sm:mb-8 w-full sm:w-fit overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('experience')}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaBriefcase size={12} />
            <span>Work Experience ({experiences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaGraduationCap size={13} />
            <span>Education ({educations.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyberCyan shadow-glow-cyan"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'experience' ? (
              // Experience List
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {experiences.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-6 rounded-3xl glass-card flex flex-col justify-between group hover:border-primary-500/50 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-cyberCyan flex items-center gap-1.5 bg-cyberCyan/10 px-3 py-0.5 rounded-full">
                          <FaCalendarAlt size={10} /> {exp.startDate} – {exp.endDate}
                        </span>
                        {exp.location && (
                          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                            <FaMapMarkerAlt size={10} /> {exp.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold font-display text-white group-hover:text-cyberCyan transition-colors mt-2">
                        {exp.position}
                      </h3>
                      <p className="text-xs font-semibold text-gray-300 font-mono mt-0.5">
                        {exp.company}
                      </p>

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-4 space-y-1.5 pt-3 border-t border-white/5">
                          {exp.responsibilities.slice(0, 3).map((r, rIdx) => (
                            <li key={rIdx} className="text-xs text-gray-400 flex items-start gap-2">
                              <FaCheckCircle className="text-emerald-400 mt-1 shrink-0 text-[10px]" />
                              <span className="line-clamp-2">{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {(exp.technologies || []).slice(0, 3).map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono bg-white/5 text-gray-400 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {experiences.length === 0 && (
                  <div className="col-span-full py-16 text-center text-gray-400 font-mono rounded-3xl glass-card">
                    No work experience added. Click 'Add Experience' above.
                  </div>
                )}
              </div>
            ) : (
              // Education List
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {educations.map((edu) => (
                  <div
                    key={edu._id}
                    className="p-6 rounded-3xl glass-card flex flex-col justify-between group hover:border-cyberViolet/50 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-cyberViolet flex items-center gap-1.5 bg-cyberViolet/10 px-3 py-0.5 rounded-full">
                          <FaCalendarAlt size={10} /> {edu.startYear} – {edu.endYear}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-display text-white group-hover:text-cyberViolet transition-colors mt-2">
                        {edu.degree}
                      </h3>
                      <p className="text-xs font-semibold text-gray-300 font-mono mt-0.5">
                        {edu.institution}
                      </p>

                      {edu.description && (
                        <p className="mt-3 p-3 rounded-xl bg-white/5 text-xs text-gray-300 font-mono">
                          {edu.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(edu)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {educations.length === 0 && (
                  <div className="col-span-full py-16 text-center text-gray-400 font-mono rounded-3xl glass-card">
                    No education records added. Click 'Add Education' above.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Dialog */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 relative shadow-2xl border border-white/20 my-auto"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                  <h3 className="text-xl font-bold font-display text-white">
                    {editingId ? 'Modify Record' : `Add ${activeTab === 'experience' ? 'Experience' : 'Education'}`}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'experience' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            Job Position *
                          </label>
                          <input
                            type="text"
                            required
                            value={expFormData.position}
                            onChange={(e) => setExpFormData({ ...expFormData, position: e.target.value })}
                            placeholder="e.g. Dot Net Developer"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={expFormData.company}
                            onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                            placeholder="e.g. Global IT Services"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            Start Date *
                          </label>
                          <input
                            type="text"
                            required
                            value={expFormData.startDate}
                            onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
                            placeholder="09/2023"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            End Date
                          </label>
                          <input
                            type="text"
                            value={expFormData.endDate}
                            onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
                            placeholder="Present"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            Location
                          </label>
                          <input
                            type="text"
                            value={expFormData.location}
                            onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
                            placeholder="Nagpur, INDIA"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Key Responsibilities (one per line)
                        </label>
                        <textarea
                          rows={4}
                          value={expFormData.responsibilities}
                          onChange={(e) => setExpFormData({ ...expFormData, responsibilities: e.target.value })}
                          placeholder="Developed ICU management module&#10;Integrated SQL Server stored procedures"
                          className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={expFormData.technologies}
                          onChange={(e) => setExpFormData({ ...expFormData, technologies: e.target.value })}
                          placeholder="C#, ASP.NET Core, SQL Server, JavaScript"
                          className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Degree / Credential *
                        </label>
                        <input
                          type="text"
                          required
                          value={eduFormData.degree}
                          onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                          placeholder="e.g. Master of Computer Applications"
                          className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Institution / University *
                        </label>
                        <input
                          type="text"
                          required
                          value={eduFormData.institution}
                          onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                          placeholder="e.g. Prof. Ram Meghe Institute of Technology"
                          className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            Start Year *
                          </label>
                          <input
                            type="text"
                            required
                            value={eduFormData.startYear}
                            onChange={(e) => setEduFormData({ ...eduFormData, startYear: e.target.value })}
                            placeholder="2020"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                            End Year *
                          </label>
                          <input
                            type="text"
                            required
                            value={eduFormData.endYear}
                            onChange={(e) => setEduFormData({ ...eduFormData, endYear: e.target.value })}
                            placeholder="2022"
                            className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Distinction & Description
                        </label>
                        <input
                          type="text"
                          value={eduFormData.description}
                          onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                          placeholder="e.g. 9.0 CGPA Distinction · Location: Amravati, India"
                          className="px-4 py-2.5 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs sm:text-sm text-white font-mono"
                        />
                      </div>
                    </>
                  )}

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
                      {editingId ? 'Save Timeline Changes' : 'Add Record'}
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

export default ManageTimeline;
