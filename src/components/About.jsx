import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/deba.png'; // Make sure your photo is here or replace this name

const About = () => {
  return (
    <section id="about" className="section-container">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        About Me
      </motion.h2>

      <div className="about-grid">
        <motion.div
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={profileImg} alt="Profile" className="about-img" />
        </motion.div>

        <motion.div
          className="about-text glass-panel"
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            Hello! I'm DEBABRATA MALIK, a passionate Fullstack Developer and AI Enthusiast. I specialize in building stunning, responsive, and highly interactive web applications using modern technologies.
          </p>
          <p>
            My journey in web development blends a love for aesthetic design with a drive to solve complex problems through clean and efficient code. I'm constantly exploring new tools in the AI landscape to stay ahead and create innovative solutions.
          </p>
          <a href="/resume.pdf" download="Debabrata_Malik_Resume.pdf" className="btn-primary clickable" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Download CV
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
