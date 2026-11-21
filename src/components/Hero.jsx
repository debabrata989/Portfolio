import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="hero-content section-container">
        <motion.p
          className="hero-greeting"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          HELLO, I AM
        </motion.p>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          DEBABRATA MALIK
        </motion.h1>
        <motion.div
          className="hero-subtitle glow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Fullstack Developer | AI Enthusiast
        </motion.div>
        
        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a href="#projects" className="btn-primary clickable">View Projects</a>
          <a href="#contact" className="btn-secondary clickable">Contact Me</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
