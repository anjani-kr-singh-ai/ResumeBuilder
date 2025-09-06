import React, { useEffect, useRef } from 'react';
import './Features.css';

const Features = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Animation for elements when they enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const featuresList = [
    {
      id: 1,
      icon: "cloud",
      title: "Cloud Save",
      description: "Your resumes are securely stored in the cloud, accessible from anywhere, anytime"
    },
    {
      id: 2,
      icon: "ai",
      title: "AI Suggestions",
      description: "Get intelligent recommendations to improve your resume's impact and effectiveness"
    },
    {
      id: 3,
      icon: "download",
      title: "Multiple Export Options",
      description: "Download your resume in various formats (PDF, DOCX, TXT) tailored for different applications"
    },
    {
      id: 4,
      icon: "customize",
      title: "Advanced Customization",
      description: "Fine-tune colors, fonts, layouts, and spacing with professional design controls"
    }
  ];

  return (
    <section id="features" className="features-section" ref={sectionRef}>
      <div className="section-header">
        <span className="pre-title">Why choose us</span>
        <h2>Powerful Resume Features</h2>
        <p>Everything you need to create professional, standout resumes that get noticed</p>
      </div>
      
      <div className="features-container">
        {featuresList.map((feature, index) => (
          <div 
            key={feature.id} 
            className="feature-card"
            ref={(el) => (cardsRef.current[index] = el)}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className={`feature-icon ${feature.icon}`}>
              <div className="icon-background"></div>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <span className="feature-number">0{feature.id}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
