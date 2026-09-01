import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { fallbackData } from '../data/fallbackData';

// Components
import Hero from '../components/Hero';
import AboutPreview from '../components/AboutPreview';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import ServicesSection from '../components/ServicesSection';
import CertificationsSection from '../components/CertificationsSection';
import ContactSection from '../components/ContactSection';

const Home = () => {
  const [data, setData] = useState({
    profile: null,
    skills: [],
    projects: [],
    experiences: [],
    educations: [],
    certifications: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        // Fetch all public sections concurrently
        const [
          profileRes,
          skillsRes,
          projectsRes,
          experiencesRes,
          educationsRes,
          certificationsRes,
          servicesRes,
        ] = await Promise.all([
          API.get('/profile').catch(() => ({ data: { data: null } })),
          API.get('/skills').catch(() => ({ data: { data: [] } })),
          API.get('/projects').catch(() => ({ data: { data: [] } })),
          API.get('/experience').catch(() => ({ data: { data: [] } })),
          API.get('/education').catch(() => ({ data: { data: [] } })),
          API.get('/certifications').catch(() => ({ data: { data: [] } })),
          API.get('/services').catch(() => ({ data: { data: [] } })),
        ]);

        setData({
          profile: profileRes.data?.data || fallbackData.profile,
          skills: (skillsRes.data?.data && skillsRes.data.data.length > 0) ? skillsRes.data.data : fallbackData.skills,
          projects: (projectsRes.data?.data && projectsRes.data.data.length > 0) ? projectsRes.data.data : fallbackData.projects,
          experiences: (experiencesRes.data?.data && experiencesRes.data.data.length > 0) ? experiencesRes.data.data : fallbackData.experiences,
          educations: (educationsRes.data?.data && educationsRes.data.data.length > 0) ? educationsRes.data.data : fallbackData.educations,
          certifications: (certificationsRes.data?.data && certificationsRes.data.data.length > 0) ? certificationsRes.data.data : fallbackData.certifications,
          services: (servicesRes.data?.data && servicesRes.data.data.length > 0) ? servicesRes.data.data : fallbackData.services,
        });
      } catch (err) {
        console.error('Error fetching portfolio data:', err.message);
        setError('Failed to load portfolio details. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="text-gray-400 text-sm">Loading Abhijeet's Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darkBg text-white flex items-center justify-center px-6 text-center">
        <div className="max-w-md p-6 bg-darkCard rounded-2xl border border-darkBorder shadow-lg">
          <h2 className="text-xl font-bold text-red-500 mb-4">Under Maintenance</h2>
          <p className="text-gray-405 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors font-semibold"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-darkBg text-gray-900 dark:text-white transition-colors duration-300">
      <Hero profile={data.profile} />
      <AboutPreview profile={data.profile} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <ExperienceSection experiences={data.experiences} />
      <EducationSection educations={data.educations} />
      <ServicesSection services={data.services} />
      <CertificationsSection certifications={data.certifications} />
      <ContactSection profile={data.profile} />
    </div>
  );
};

export default Home;
