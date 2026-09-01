import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';

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
    } catch (error) {
      toast.error('Failed to load timeline statistics');
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
        responsibilities: item.responsibilities?.join('\n') || '',
        technologies: item.technologies?.join(', ') || '',
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
          responsibilities: expFormData.responsibilities.split('\n').filter(Boolean),
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
        // Education Submission
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
    if (!window.confirm('Are you sure you want to delete this record?')) return;
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
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Timeline History</h1>
            <p className="text-sm text-slate-400 mt-1">Configure your employment history and graduation achievements.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-primary-650 hover:bg-primary-550 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FaPlus /> Add Record
          </button>
        </header>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 mb-6 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('experience')}
            className={`pb-4 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'experience' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400'
            }`}
          >
            Work Experience ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`pb-4 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'education' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400'
            }`}
          >
            Education History ({educations.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {activeTab === 'experience' ? (
              /* Experience Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-450 uppercase text-[10px] font-bold tracking-wider border-b border-slate-850">
                    <tr>
                      <th className="p-4">Position</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Period</th>
                      <th className="p-4">Location</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {experiences.map((exp) => (
                      <tr key={exp._id} className="hover:bg-slate-855 hover:bg-slate-850/40 transition-colors">
                        <td className="p-4 font-semibold">{exp.position}</td>
                        <td className="p-4 text-slate-300">{exp.company}</td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{exp.startDate} - {exp.endDate}</td>
                        <td className="p-4 text-slate-450">{exp.location}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenEdit(exp)}
                              className="text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(exp._id)}
                              className="text-slate-450 hover:text-red-400 p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {experiences.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">
                          No experiences configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Education Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-450 uppercase text-[10px] font-bold tracking-wider border-b border-slate-850">
                    <tr>
                      <th className="p-4">Degree</th>
                      <th className="p-4">Institution</th>
                      <th className="p-4">Period</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {educations.map((edu) => (
                      <tr key={edu._id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="p-4 font-semibold">{edu.degree}</td>
                        <td className="p-4 text-slate-300">{edu.institution}</td>
                        <td className="p-4 text-slate-400 font-mono text-xs">{edu.startYear} - {edu.endYear}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenEdit(edu)}
                              className="text-slate-450 hover:text-white p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(edu._id)}
                              className="text-slate-455 hover:text-red-400 p-2 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {educations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">
                          No education history configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal Dialog */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold">
                  {editingId ? 'Edit Timeline Record' : 'Add New Timeline Record'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              {activeTab === 'experience' ? (
                /* Experience Form */
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Position Title *</label>
                      <input
                        type="text"
                        required
                        value={expFormData.position}
                        onChange={(e) => setExpFormData({ ...expFormData, position: e.target.value })}
                        placeholder="e.g. Jr. .NET Developer"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={expFormData.company}
                        onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })}
                        placeholder="e.g. IT Solutions Pvt Ltd"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Start Period (e.g. Jul 2024) *</label>
                      <input
                        type="text"
                        required
                        value={expFormData.startDate}
                        onChange={(e) => setExpFormData({ ...expFormData, startDate: e.target.value })}
                        placeholder="Jul 2024"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">End Period (e.g. Present)</label>
                      <input
                        type="text"
                        value={expFormData.endDate}
                        onChange={(e) => setExpFormData({ ...expFormData, endDate: e.target.value })}
                        placeholder="Present"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={expFormData.location}
                      onChange={(e) => setExpFormData({ ...expFormData, location: e.target.value })}
                      placeholder="Nagpur, Maharashtra, India"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Responsibilities (one bullet per line)</label>
                    <textarea
                      rows={5}
                      value={expFormData.responsibilities}
                      onChange={(e) => setExpFormData({ ...expFormData, responsibilities: e.target.value })}
                      placeholder="Developed database layers using Entity Framework Core&#10;Created dashboard APIs using Express..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      value={expFormData.technologies}
                      onChange={(e) => setExpFormData({ ...expFormData, technologies: e.target.value })}
                      placeholder="C#, ASP.NET Core, SQL Server, React"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
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
                      {editingId ? 'Save Changes' : 'Add Experience'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Education Form */
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow text-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">Degree / Qualification *</label>
                    <input
                      type="text"
                      required
                      value={eduFormData.degree}
                      onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                      placeholder="e.g. Master of Computer Applications (MCA)"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Institution / University *</label>
                    <input
                      type="text"
                      required
                      value={eduFormData.institution}
                      onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                      placeholder="e.g. Nagpur University Campus"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-550"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">Start Year *</label>
                      <input
                        type="text"
                        required
                        value={eduFormData.startYear}
                        onChange={(e) => setEduFormData({ ...eduFormData, startYear: e.target.value })}
                        placeholder="2022"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">End/Graduation Year *</label>
                      <input
                        type="text"
                        required
                        value={eduFormData.endYear}
                        onChange={(e) => setEduFormData({ ...eduFormData, endYear: e.target.value })}
                        placeholder="2024"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={4}
                      value={eduFormData.description}
                      onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                      placeholder="Additional course highlights or curriculum details..."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
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
                      {editingId ? 'Save Changes' : 'Add Education'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageTimeline;
