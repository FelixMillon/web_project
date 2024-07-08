import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">Login</Link></li>
        <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>
        <li className="navbar-item"><Link to="/conversations" className="navbar-link">Conversations</Link></li>
        <li className="navbar-item"><button onClick={handleLogout} className="navbar-link logout-button">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
