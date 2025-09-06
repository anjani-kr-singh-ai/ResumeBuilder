import React, { useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, useInView } from 'framer-motion';
import './Hero.css';
import '../pages/HomePage.css';

const Hero = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    threshold: 0.2,
    triggerOnce: false
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
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

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 15, 
        delay: 0.8 
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 123, 255, 0.4)",
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.95 
    }
  };

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15, 
        delay: 0.5 
      }
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };
  
  // Background particles for decoration
  const particles = Array(5).fill().map((_, i) => ({
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="hero-section">
      {/* Decorative particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="particle"
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
        ref={ref}
        className="hero-container"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div className="hero-content" variants={containerVariants}>
          <motion.h1 className="hero-title">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Build Your{" "}
            </motion.span>
            <motion.span 
              className="highlight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.2 } 
              }}
            >
              Resume
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {" "}in Minutes
            </motion.span>
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-description">
            Create professional resumes that stand out and get you noticed by recruiters. 
            Our AI-powered platform makes it simple and effective.
          </motion.p>
          <motion.button 
            className="cta-button"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </motion.button>
        </motion.div>
        <motion.div 
          className="hero-image"
          variants={imageVariants}
        >
          <motion.div 
            className="placeholder-image"
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.3 } 
            }}
          >
            <div className="image-content">
              <div className="resume-mockup"></div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
