import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', '.NET', 'MERN'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await API.get('/projects');
        if (response.data.success) {
          setProjects(response.data.data);
          setFilteredProjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects when tab or search queries change
  useEffect(() => {
    let result = [...projects];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(project => project.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(result);
  }, [activeCategory, searchQuery, projects]);

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-white dark:bg-darkBg text-gray-900 dark:text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header back navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Project Portfolio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl text-sm sm:text-base">
            Explore my systems, custom utilities, payment integrations, and application designs.
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-stretch md:items-center mb-10 pb-6 border-b border-gray-205 border-gray-200 dark:border-darkBorder/40">
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2.5 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-700 dark:bg-darkCard dark:border-darkBorder/30 dark:text-gray-300 dark:hover:bg-darkCard/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box input */}
          <div className="relative md:w-80 order-1 md:order-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by tech or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-darkBorder bg-gray-50 dark:bg-darkCard text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Loader skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-96 rounded-2xl bg-gray-100 dark:bg-darkCard/40 border border-gray-200 dark:border-darkBorder/20 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const projectImgUrl = project.image
                  ? (project.image.startsWith('http') ? project.image : `${serverUrl}${project.image}`)
                  : null;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={project._id}
                    className="flex flex-col bg-gray-50 border border-gray-200 dark:bg-darkCard dark:border-darkBorder/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-darkBorder transition-all duration-300"
                  >
                    {/* Visual Thumbnail */}
                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center text-white">
                      {projectImgUrl ? (
                        <img
                          src={projectImgUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-center px-4 select-none">
                          <span className="text-4xl font-extrabold tracking-wider text-primary-400">
                            {project.title.substring(0, 4)}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 mt-2 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-900/30">
                            {project.category} System
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-primary-650 dark:text-primary-400 bg-primary-100 dark:bg-primary-950/40 px-2 py-0.5 rounded border border-primary-200/20 dark:border-primary-900/20 uppercase tracking-wide">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-250 dark:border-amber-900/20 uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Detailed Description Preview */}
                        {project.detailedDescription && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 italic line-clamp-2">
                            {project.detailedDescription}
                          </p>
                        )}

                        {/* Tech Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-5">
                          {project.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-bold bg-white dark:bg-darkBg/60 text-gray-650 dark:text-slate-400 px-2.5 py-0.5 rounded border border-gray-200 dark:border-darkBorder/40 shadow-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-150 dark:border-darkBorder/30">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                          >
                            <FaGithub /> GitHub Repository
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors ml-auto"
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-darkCard/30 rounded-2xl border border-dashed border-gray-300 dark:border-darkBorder/40">
                <p className="text-lg font-bold">No projects available yet.</p>
                <p className="text-xs text-gray-400 mt-1">Try modifying your filter or search query.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
