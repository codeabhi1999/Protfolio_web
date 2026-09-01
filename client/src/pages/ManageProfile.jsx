import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FaSave, FaUpload } from 'react-icons/fa';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

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
      } catch (error) {
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
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
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
        setFormData(prev => ({
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
    <div className="flex bg-slate-950 text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Profile Bio</h1>
          <p className="text-sm text-slate-400 mt-1">Configure your personal name, role description, and resumes.</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-4xl space-y-6 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abhijeet Chavan"
                  className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Jr. .NET Developer / Full Stack Developer"
                  className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Full Stack Developer | .NET & MERN Stack Developer"
                className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Bio Description</label>
              <textarea
                name="bio"
                rows={5}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write your developer biography..."
                className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Nagpur, Maharashtra, India"
                  className="w-full px-4 py-3 rounded-lg border border-slate-855 border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abhijeet.chavan.dev@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Document and Image Paths Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border border-slate-800 rounded-xl bg-slate-950/40">
              {/* Profile Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Profile Image File</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="/uploads/avatar.jpg"
                    className="flex-grow px-3 py-2.5 rounded border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="file"
                    id="profile-img-upload"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-img-upload"
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
                  >
                    <FaUpload size={14} />
                  </label>
                </div>
              </div>

              {/* Resume File */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Resume PDF Document</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="/uploads/resume.pdf"
                    className="flex-grow px-3 py-2.5 rounded border border-slate-800 bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="file"
                    id="resume-pdf-upload"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => handleFileUpload(e, 'resume')}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-pdf-upload"
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition-colors"
                  >
                    <FaUpload size={14} />
                  </label>
                </div>
              </div>
            </div>

            {/* Social Profile Links */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Social Accounts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-450">GitHub URL</label>
                  <input
                    type="url"
                    name="social_github"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-450">LinkedIn URL</label>
                  <input
                    type="url"
                    name="social_linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-550"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-450">Instagram URL</label>
                  <input
                    type="url"
                    name="social_instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-850 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-750 text-white font-bold rounded-lg shadow-md hover:shadow-primary-650/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaSave /> {saving ? 'Saving Profile Details...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ManageProfile;
