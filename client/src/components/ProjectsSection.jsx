import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaCode, FaCheckCircle, FaLaptopCode } from 'react-icons/fa';

const ProjectsSection = ({ projects }) => {
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-mono font-semibold text-primary-300 uppercase tracking-widest mb-3"
          >
            Production Portfolio
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight"
          >
            Featured Engineering Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto"
          >
            A selective showcase of production-ready systems, full-stack applications, and enterprise modules I have architected and deployed.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => {
            const projectImgUrl = project.image
              ? (project.image.startsWith('http') ? project.image : `${serverUrl}${project.image}`)
              : null;

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
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

                {/* Visual Thumbnail or Interactive Architecture Graphic */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-[#0c1424] via-[#111c33] to-[#1e163d] flex items-center justify-center text-white border-b border-white/5">
                  {projectImgUrl ? (
                    <img
                      src={projectImgUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center select-none text-center px-6 relative z-10">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-cyberCyan shadow-glow-cyan mb-2 group-hover:scale-110 transition-transform">
                        <FaLaptopCode size={26} />
                      </div>
                      <span className="text-xl font-bold font-display tracking-tight text-white mt-1">
                        {project.title}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 mt-1">
                        Enterprise Web Solution
                      </span>
                    </div>
                  )}
                  {/* Subtle Grid Accent in Thumbnail */}
                  <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-cyberCyan transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-gray-300 mt-2.5 leading-relaxed line-clamp-3">
                      {project.detailedDescription || project.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {(project.technologies || []).slice(0, 5).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono font-medium bg-white/5 text-gray-300 px-2.5 py-1 rounded-md border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies || []).length > 5 && (
                        <span className="text-[10px] font-mono text-gray-500 px-1 py-1">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
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
                        <FaCheckCircle size={10} className="text-emerald-400" /> Enterprise Repository
                      </span>
                    )}

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-mono font-bold text-white px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-cyberCyan hover:opacity-90 transition-all shadow-glow-primary ml-auto"
                      >
                        <FaExternalLinkAlt size={11} /> Live System
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-gray-400 ml-auto bg-white/5 px-2 py-1 rounded border border-white/5">
                        Production Ready
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {displayProjects.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 font-mono">
              No projects added yet.
            </div>
          )}
        </div>

        {/* View All Projects CTA */}
        <div className="text-center mt-16">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-display font-bold text-sm bg-white/10 hover:bg-white/15 border border-white/15 text-white hover:border-primary-500/40 transition-all shadow-lg group hover:scale-105 active:scale-95"
          >
            Explore Full Project Catalog
            <FaArrowRight size={12} className="text-cyberCyan group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
