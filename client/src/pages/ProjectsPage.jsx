import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaSearch, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { fallbackData } from '../data/fallbackData';

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
        const list = (response.data?.data && response.data.data.length > 0)
          ? response.data.data
          : fallbackData.projects;
        setProjects(list);
        setFilteredProjects(list);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        setProjects(fallbackData.projects);
        setFilteredProjects(fallbackData.projects);
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
      result = result.filter(project => 
        (project.category || '').toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project =>
          (project.title || '').toLowerCase().includes(query) ||
          (project.description || '').toLowerCase().includes(query) ||
          (project.technologies || []).some(tech => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(result);
  }, [activeCategory, searchQuery, projects]);

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

  return (
    <div className="min-h-screen bg-darkBg text-white pt-28 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-cyberCyan transition-colors mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit"
        >
          <FaArrowLeft size={12} /> Back to Portfolio Home
        </Link>

        {/* Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-3">
            Portfolio Archive
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            Engineering Project Catalog
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl text-sm sm:text-base">
            Detailed architectures, system utilities, enterprise modules, and payment integrations I have designed and deployed.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-stretch md:items-center mb-10 pb-6 border-b border-white/10">
          
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white bg-darkCard/60 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProjCat"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-cyberCyan shadow-glow-primary -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative md:w-80 order-1 md:order-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={13} />
            </span>
            <input
              type="text"
              placeholder="Search by tech or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/10 bg-darkCard text-white text-xs font-mono focus:ring-2 focus:ring-cyberCyan/40 focus:border-cyberCyan focus:outline-none placeholder-gray-500 transition-all"
            />
          </div>
        </div>

        {/* Loader skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-96 rounded-3xl glass-card animate-pulse"></div>
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
                    key={project._id || index}
                    className="rounded-3xl glass-card flex flex-col justify-between overflow-hidden group hover:border-primary-500/50"
                  >
                    {/* Browser Mockup Window Header */}
                    <div className="bg-[#0b101c] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 truncate max-w-[170px]">
                        app://{project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.net
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyberCyan uppercase bg-cyberCyan/10 px-2 py-0.5 rounded">
                        {project.category || '.NET'}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-[#0c1424] via-[#111c33] to-[#1e163d] flex items-center justify-center text-white border-b border-white/5">
                      {projectImgUrl ? (
                        <img
                          src={projectImgUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-center px-6 select-none">
                          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-cyberCyan shadow-glow-cyan mb-2 group-hover:scale-110 transition-transform">
                            <FaLaptopCode size={26} />
                          </div>
                          <span className="text-xl font-bold font-display tracking-tight text-white mt-1">
                            {project.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono font-bold text-cyberCyan uppercase tracking-wider bg-cyberCyan/10 px-2.5 py-0.5 rounded">
                            {project.category || 'Architecture'}
                          </span>
                          {project.featured && (
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                              ★ Featured
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        {project.detailedDescription && (
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2 font-mono">
                            {project.detailedDescription}
                          </p>
                        )}

                        {/* Tech Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-5">
                          {(project.technologies || []).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono bg-white/5 text-gray-300 px-2.5 py-0.5 rounded border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons Footer */}
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                          >
                            <FaGithub size={13} /> Source
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
                            <FaCheckCircle size={10} className="text-emerald-400" /> Enterprise Codebase
                          </span>
                        )}

                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-mono font-bold text-white px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-cyberCyan hover:opacity-90 transition-all shadow-glow-primary ml-auto"
                          >
                            <FaExternalLinkAlt size={11} /> Live Demo
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-gray-400 ml-auto bg-white/5 px-2 py-1 rounded border border-white/5">
                            Deployed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 font-mono rounded-3xl glass-card">
                <p className="text-lg font-bold text-white">No projects found matching your criteria.</p>
                <p className="text-xs text-gray-400 mt-1">Try selecting another category or clearing search.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
