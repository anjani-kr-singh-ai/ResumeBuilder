import React, { useEffect, useRef } from 'react';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        <div className="footer-section about">
          <div className="footer-logo">
            <h3>ResumeMaker</h3>
          </div>
          <p>Creating professional resumes made simple. Build, customize, and download your perfect resume in minutes. Stand out from the crowd with our expert-designed templates.</p>
          <div className="social-links">
            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#templates">Resume Templates</a></li>
            <li><a href="#features">Premium Features</a></li>
            <li><a href="#faqs">FAQ Center</a></li>
            <li><a href="#blog">Career Blog</a></li>
            <li><a href="#contact">Support</a></li>
          </ul>
        </div>
        
        <div className="footer-section legal">
          <h3>Legal</h3>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Settings</a></li>
            <li><a href="#accessibility">Accessibility</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <ul>
            <li><i className="far fa-envelope"></i> support@resumemaker.com</li>
            <li><i className="fas fa-phone-alt"></i> (555) 123-4567</li>
            <li><i className="fas fa-map-marker-alt"></i> 123 Resume St, San Francisco, CA</li>
            <li><i className="far fa-clock"></i> Mon-Fri: 9AM - 6PM EST</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} <span className="highlight">ResumeMaker</span>. All Rights Reserved. | Designed with <i className="fas fa-heart"></i> for job seekers</p>
      </div>
    </footer>
  );
};

export default Footer;
