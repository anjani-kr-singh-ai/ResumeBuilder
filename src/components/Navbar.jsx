import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById('main-navbar');
      if (isMenuOpen && navbar && !navbar.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav id="main-navbar" className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">
          <h1>
            <span className="logo-text-primary">Resume</span>
            <span className="logo-text-secondary">Maker</span>
          </h1>
        </Link>
      </div>

      <div className="navbar-right">
        <button 
          className="navbar-mobile-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu4Line size={24} />}
        </button>

        {isHomePage && (
          <ul className="navbar-links">
            <li><a href="#templates">Templates</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        )}
        
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <button className="navbar-btn dashboard-btn">
                  Dashboard
                </button>
              </Link>
              <button 
                className="navbar-btn logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="navbar-btn login-btn">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="navbar-btn signup-btn">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
