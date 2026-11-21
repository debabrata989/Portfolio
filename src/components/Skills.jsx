import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillsList = [
    { name: 'Python & C', icon: '💻', percentage: 90 },
    { name: 'Machine Learning', icon: '🧠', percentage: 80 },
    { name: 'Data Science', icon: '📊', percentage: 85 },
    { name: 'React & JS', icon: '🌐', percentage: 90 },
    { name: 'HTML & CSS', icon: '🎨', percentage: 95 },
    { name: 'Google Cloud', icon: '☁️', percentage: 75 },
  ];

  return (
    <section id="skills" className="section-container">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        My Skills
      </motion.h2>
      
      <div className="skills-grid">
        {skillsList.map((skill, index) => (
          <motion.div 
            key={index}
            className="skill-card glass-panel"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="skill-icon">
              {skill.icon}
            </div>
            <h3>{skill.name}</h3>
            <div className="skill-bar-bg">
              <motion.div 
                className="skill-bar-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + (index * 0.1) }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
