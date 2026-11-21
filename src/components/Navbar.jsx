import React from 'react';

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <h1 className="gradient-text">DM.</h1>
      </div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="theme-toggle clickable" onClick={toggleTheme}>
        {theme === 'dark' ? <span style={{fontSize: '24px'}}>☀️</span> : <span style={{fontSize: '24px'}}>🌙</span>}
      </button>
    </nav>
  );
};

export default Navbar;
