import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'framer-motion';
import './TemplateShowcase.css';

const TemplateShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const controls = useAnimation();
  const carouselRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });
  
  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and corporate style for traditional industries",
      features: ["ATS-friendly format", "Clean hierarchy", "Professional tone"],
      accent: "#0062cc"
    },
    {
      id: 2,
      name: "Creative",
      description: "Bold design for creative professionals",
      features: ["Unique layout", "Color accents", "Visual hierarchy"],
      accent: "#e83e8c"
    },
    {
      id: 3,
      name: "Minimal",
      description: "Simple and elegant for a modern look",
      features: ["Spacious design", "Clean typography", "Modern aesthetic"],
      accent: "#28a745"
    },
    {
      id: 4,
      name: "Technical",
      description: "Focused on skills and technical expertise",
      features: ["Skills-focused", "Project highlights", "Technical details"],
      accent: "#6f42c1"
    }
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === templates.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? templates.length - 1 : prevIndex - 1
    );
  };

  // Control animations based on scroll visibility
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInView) {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isInView, currentIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 10 
      }
    }
  };

  const slideVariants = {
    hidden: (direction) => {
      return {
        x: direction > 0 ? 500 : -500,
        opacity: 0,
        scale: 0.9
      };
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: (direction) => {
      return {
        x: direction > 0 ? -500 : 500,
        opacity: 0,
        scale: 0.9,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      };
    }
  };

  const headingVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }
    }
  };
  
  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 15, 
        delay: 0.4 
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(74, 107, 255, 0.4)",
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.95 
    }
  };
  
  // Create background particles for decoration like in Hero component
  const particles = Array(5).fill().map((_, i) => ({
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <section id="templates" className="template-showcase" ref={ref}>
      {/* Decorative particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="template-particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    
      <motion.div 
        className="section-header"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants}>Professional Templates</motion.h2>
        <motion.p variants={itemVariants}>Choose from our professionally designed templates</motion.p>
      </motion.div>
      
      <motion.div 
        className="carousel-container" 
        ref={carouselRef}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div 
          className="carousel-controls"
          variants={itemVariants}
        >
          <motion.button 
            className="carousel-control prev" 
            onClick={prevSlide}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.button 
            className="carousel-control next" 
            onClick={nextSlide}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="carousel-track"
          variants={itemVariants}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="template-highlight"
            >
              <div className="template-display">
                <motion.div 
                  className="template-preview-large"
                  style={{'--accent-color': templates[currentIndex].accent}}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2,
                    type: "spring", 
                    stiffness: 100
                  }}
                >
                  <motion.div 
                    className="template-mockup"
                    whileHover={{ 
                      scale: 1.03, 
                      transition: { duration: 0.3 } 
                    }}
                  >
                    <div className="mockup-header"></div>
                    <div className="mockup-sidebar"></div>
                    <div className="mockup-content">
                      <div className="mockup-section"></div>
                      <div className="mockup-section"></div>
                      <div className="mockup-section short"></div>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="template-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4,
                    type: "spring", 
                    stiffness: 100 
                  }}
                >
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {templates[currentIndex].name} Template
                  </motion.h3>
                  <motion.p 
                    className="template-desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    {templates[currentIndex].description}
                  </motion.p>
                  <motion.div 
                    className="template-features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <h4>Key Features</h4>
                    <ul>
                      {templates[currentIndex].features.map((feature, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + (index * 0.1), duration: 0.2 }}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link 
                      to={`/builder?template=${templates[currentIndex].name.toLowerCase()}`} 
                      className="use-template-btn"
                      style={{'--button-color': templates[currentIndex].accent}}
                    >
                      Use This Template
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TemplateShowcase;