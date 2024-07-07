import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">Login</Link></li>
        <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>
        <li className="navbar-item"><Link to="/conversations" className="navbar-link">Conversations</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
