import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // Create a new FormData object
    const formToSubmit = new FormData();
    // ⚠️ IMPORTANT: Get your free access key from https://web3forms.com/
    // and replace 'YOUR_ACCESS_KEY_HERE' with your actual key
    formToSubmit.append("access_key", "b47473f9-b846-4d2e-b45c-e685f00f1c32");
    formToSubmit.append("name", formData.name);
    formToSubmit.append("email", formData.email);
    formToSubmit.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formToSubmit
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus("Oops! Something went wrong.");
        console.log("Error", data);
      }
    } catch (error) {
      setStatus("Error sending message.");
      console.error(error);
    }

    // Clear status message after 5 seconds
    setTimeout(() => {
      setStatus("");
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section-container">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Get In Touch
      </motion.h2>

      <div className="contact-container">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>
            I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
          <div className="social-links">
            <a href="mailto:debabrtamalik@gmail.com" className="clickable" target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Email</a>
            <a href="https://github.com/debabrtamalik" className="clickable" target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 'bold' }}>GitHub</a>
            <a href="https://linkedin.com/in/debabrtamalik" className="clickable" target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 'bold' }}>LinkedIn</a>
            <a href="https://twitter.com/debabrtamalik" className="clickable" target="_blank" rel="noreferrer" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Twitter</a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form glass-panel"
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="form-input" required />
          </div>
          <div className="form-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" required />
          </div>
          <div className="form-group">
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="form-input" required></textarea>
          </div>
          <button type="submit" className="btn-primary clickable" style={{ alignSelf: 'flex-start' }} disabled={status === "Sending..."}>
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>
          {status && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: status.includes("success") ? '#4ade80' : 'inherit' }}>{status}</p>}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
