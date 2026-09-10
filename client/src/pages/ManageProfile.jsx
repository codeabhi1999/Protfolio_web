import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { 
  FaSave, 
  FaUpload, 
  FaUser, 
  FaFilePdf, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone,
  FaCheckCircle,
  FaEye,
  FaShieldAlt
} from 'react-icons/fa';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    title: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    profileImage: '',
    resumeUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      instagram: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/profile');
        if (response.data.success && response.data.data) {
          const profile = response.data.data;
          setFormData({
            name: profile.name || '',
            role: profile.role || '',
            title: profile.title || '',
            bio: profile.bio || '',
            location: profile.location || '',
            email: profile.email || '',
            phone: profile.phone || '',
            profileImage: profile.profileImage || '',
            resumeUrl: profile.resumeUrl || '',
            socialLinks: {
              github: profile.socialLinks?.github || '',
              linkedin: profile.socialLinks?.linkedin || '',
              instagram: profile.socialLinks?.instagram || '',
            },
          });
        }
      } catch {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const field = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    const isImage = type === 'image';
    if (isImage) setImageUploading(true);
    else setResumeUploading(true);

    const toastId = toast.loading(`Uploading ${type}...`);

    try {
      const response = await API.post('/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(`${type} uploaded successfully!`, { id: toastId });
        setFormData((prev) => ({
          ...prev,
          [isImage ? 'profileImage' : 'resumeUrl']: response.data.url,
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to upload ${type}`, { id: toastId });
    } finally {
      if (isImage) setImageUploading(false);
      else setResumeUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving profile changes...');

    try {
      const response = await API.put('/profile', formData);
      if (response.data.success) {
        toast.success('Profile details saved successfully!', { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile details', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-darkBg text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-[1600px]">
        
        {/* Header Ribbon */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-2">
              Identity Management
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              Profile & Career Bio
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
              Update your hero presentation, technical biography, contact details, and resume assets.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary-600 to-cyberCyan text-white shadow-glow-primary hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FaSave size={14} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyberCyan shadow-glow-cyan"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Form Column (8 cols) */}
            <div className="xl:col-span-8 rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 border border-white/10">
              
              {/* Tab Navigation */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-6 sm:mb-8 w-full sm:w-fit overflow-x-auto scrollbar-none gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('identity')}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'identity'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Personal Identity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('bio')}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'bio'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Narrative & Bio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('socials')}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'socials'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Socials & Resume
                </button>
                <Link
                  to="/admin/security"
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold text-cyberCyan hover:bg-cyberCyan/10 border border-cyberCyan/30 transition-all flex items-center gap-1.5 ml-1"
                >
                  <FaShieldAlt size={11} />
                  <span>Login & Security</span>
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* TAB 1: Personal Identity */}
                {activeTab === 'identity' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Abhijeet Chavan"
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan focus:ring-1 focus:ring-cyberCyan/50 outline-none text-sm text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Primary Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          placeholder=".NET Developer"
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan focus:ring-1 focus:ring-cyberCyan/50 outline-none text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Professional Headline Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Full Stack Developer | .NET & MERN Stack Developer"
                        className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan focus:ring-1 focus:ring-cyberCyan/50 outline-none text-sm text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Base Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Nagpur, Maharashtra, INDIA"
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="chavanabhijeet95@gmail.com"
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="7057731248"
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Narrative & Bio */}
                {activeTab === 'bio' && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        Full Professional Biography
                      </label>
                      <textarea
                        name="bio"
                        rows={9}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Write your comprehensive technical narrative..."
                        className="p-4 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan focus:ring-1 focus:ring-cyberCyan/50 outline-none text-sm text-white leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Socials & Resume */}
                {activeTab === 'socials' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <FaGithub /> GitHub URL
                        </label>
                        <input
                          type="text"
                          name="social_github"
                          value={formData.socialLinks.github}
                          onChange={handleChange}
                          placeholder="https://github.com/..."
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <FaLinkedin /> LinkedIn URL
                        </label>
                        <input
                          type="text"
                          name="social_linkedin"
                          value={formData.socialLinks.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/..."
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs text-white font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <FaInstagram /> Instagram URL
                        </label>
                        <input
                          type="text"
                          name="social_instagram"
                          value={formData.socialLinks.instagram}
                          onChange={handleChange}
                          placeholder="https://instagram.com/..."
                          className="px-4 py-3 rounded-xl bg-darkBg border border-white/10 focus:border-cyberCyan outline-none text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/10">
                      {/* Image Upload */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <FaUser className="text-primary-400" />
                          <span>Profile Photo Asset</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          disabled={imageUploading}
                          className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-primary-600 file:text-white hover:file:bg-primary-500 cursor-pointer"
                        />
                        {formData.profileImage && (
                          <div className="text-[11px] font-mono text-gray-400 truncate">
                            Active: {formData.profileImage}
                          </div>
                        )}
                      </div>

                      {/* Resume PDF Upload */}
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                          <FaFilePdf className="text-red-400" />
                          <span>Resume PDF Asset</span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, 'resume')}
                          disabled={resumeUploading}
                          className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-cyberCyan file:text-black hover:file:bg-cyan-300 cursor-pointer"
                        />
                        {formData.resumeUrl && (
                          <div className="text-[11px] font-mono text-gray-400 truncate">
                            Active: {formData.resumeUrl}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Live Preview Side Card (4 cols) */}
            <div className="xl:col-span-4 rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 border border-white/10 xl:sticky xl:top-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-cyberCyan flex items-center gap-2">
                  <FaEye /> Live Public Preview
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Visual Card */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0c1424] to-[#161f36] border border-white/10 space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 via-cyberCyan to-cyberViolet flex items-center justify-center font-black text-xl text-white shadow-glow-primary">
                  {formData.name ? formData.name.substring(0, 2).toUpperCase() : 'AC'}
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {formData.name || 'Abhijeet Chavan'}
                  </h3>
                  <p className="text-xs font-mono text-cyberCyan mt-0.5">
                    {formData.role || '.NET Developer'}
                  </p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-4">
                  {formData.bio || 'Your technical biography appears here for prospective recruiters and clients.'}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-primary-400" />
                    <span>{formData.location || 'Nagpur, India'}</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <FaCheckCircle size={10} /> Active
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono text-gray-400 space-y-1">
                <div>Email: <span className="text-white">{formData.email || 'None'}</span></div>
                <div>Phone: <span className="text-white">{formData.phone || 'None'}</span></div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default ManageProfile;
