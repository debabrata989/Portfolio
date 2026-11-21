import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
  const projectsData = [
    {
      title: 'Real-Time Face Detection',
      description: 'A Real-Time Face Detection System utilizing modern computer vision techniques.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop',
      tech: ['Python', 'OpenCV'],
      liveLink: '#',
      repoLink: 'https://github.com/debabrtamalik'
    },
    {
      title: 'DEBA AI Chatbot',
      description: 'A full-stack, customized AI assistant powered by the Google Gemini API with robust features like real-time responses, persistent chat history, user authentication, and a scalable Node.js/Express backend.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
      tech: ['Google Gemini API', 'Node.js', 'Express', 'JavaScript', 'HTML/CSS'],
      liveLink: '/chatbot/index.html',
      repoLink: 'https://github.com/debabrtamalik/ai-chatbot'
    },
    {
      title: 'Personal Developer Portfolio',
      description: 'A high-end, responsive personal portfolio featuring a sleek dark theme, glassmorphism UI, smooth scroll animations, and interactive dynamic components.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
      tech: ['React', 'CSS3', 'JavaScript', 'Framer Motion'],
      liveLink: 'http://localhost:5173',
      repoLink: 'https://github.com/debabrtamalik'
    }
  ];

  return (
    <section id="projects" className="section-container">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Featured Projects
      </motion.h2>

      <div className="projects-grid">
        {projectsData.map((project, index) => (
          <motion.div 
            key={index}
            className="project-card glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -10 }}
          >
            <div className="project-img-wrapper">
              <img src={project.image} alt={project.title} className="project-img" />
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tag, i) => (
                  <span key={i} className="tech-tag">{tag}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="clickable">↗️ Live Demo</a>
                <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="clickable">Source</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
