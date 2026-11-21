import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      role: 'B.Tech (CSE)',
      company: 'Gandhi Institute of Excellent Technocrats',
      date: '2023 - 2027',
      description: 'Computer Science and Engineering'
    },
    {
      role: 'Class 12 (CBSE)',
      company: 'Bhadrak Autonomous College',
      date: '2023',
      description: 'Intermediate / Higher Secondary Education'
    },
    {
      role: 'AI/ML Internship',
      company: 'CTTC Bhubaneswar',
      date: 'Training',
      description: 'Hands-on internship in Artificial Intelligence and Machine Learning paradigms.'
    },
    {
      role: 'Data Science',
      company: 'Coursera',
      date: 'Certification',
      description: 'Specialized training and certification in fundamental Data Science concepts.'
    }
  ];

  return (
    <section id="experience" className="section-container">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Experience & Education
      </motion.h2>

      <div className="timeline">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            className="timeline-item"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-content glass-panel">
              <h3 className="glow-text">{exp.role}</h3>
              <p className="timeline-date">{exp.company} | {exp.date}</p>
              <p>{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
