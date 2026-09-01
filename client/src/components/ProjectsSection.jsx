import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

const ProjectsSection = ({ projects }) => {
  // Filter featured projects for landing preview (up to 3 or 4)
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);

  // If no featured projects exist, show the first few projects
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-darkBg/60 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-primary-500 mx-auto mt-4 rounded-full"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 dark:text-gray-400 mt-4 text-sm sm:text-base"
          >
            A selective preview of systems, utilities, and applications I have designed and deployed.
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
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={project._id || index}
                className="flex flex-col bg-white dark:bg-darkCard rounded-2xl overflow-hidden border border-gray-200 dark:border-darkBorder/40 shadow-md hover:shadow-xl transition-all duration-300 glow-card"
              >
                {/* Visual Thumbnail */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center text-white">
                  {projectImgUrl ? (
                    <img
                      src={projectImgUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center select-none text-center px-4">
                      <span className="text-4xl font-extrabold tracking-wider text-primary-400">
                        {project.title.substring(0, 4)}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 mt-2 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-900/30">
                        {project.category} System
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider bg-primary-100 dark:bg-primary-950/40 px-2.5 py-1 rounded-md border border-primary-200/30 dark:border-primary-900/20">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3.5">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2.5 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {project.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-bold bg-gray-100 text-gray-650 dark:bg-darkBg/60 dark:text-slate-400 px-2 py-0.5 rounded border border-gray-200 dark:border-darkBorder/40"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] font-bold text-gray-400 px-1 py-0.5">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons Panel */}
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-darkBorder/30">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      >
                        <FaGithub /> GitHub
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

          {displayProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No projects added yet.
            </div>
          )}
        </div>

        {/* View All Projects CTA */}
        <div className="text-center mt-16">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-bold rounded-lg shadow-md transition-all group"
          >
            View All Projects <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
