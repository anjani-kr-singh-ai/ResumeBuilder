import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQs.css';

const FAQs = () => {
  const faqsList = [
    {
      id: 1,
      question: "How does Resume Maker help my job search?",
      answer: "Resume Maker helps you create professional, ATS-friendly resumes tailored to your industry. Our templates and AI suggestions increase your chances of landing interviews by highlighting your skills effectively."
    },
    {
      id: 2,
      question: "Can I download my resume in different formats?",
      answer: "Yes, you can download your completed resume in PDF, DOCX, and TXT formats. This gives you flexibility when applying for different positions that may require specific file formats."
    },
    {
      id: 3,
      question: "Is my information secure?",
      answer: "Absolutely. We use enterprise-grade encryption to protect your data. Your information is stored securely in the cloud, and we never share your personal details with third parties."
    },
    {
      id: 4,
      question: "Do I need to pay for using Resume Maker?",
      answer: "Resume Maker offers both free and premium options. The basic templates and features are free, while advanced templates, AI suggestions, and unlimited downloads are available with our premium subscription."
    },
    {
      id: 5,
      question: "Can I edit my resume after creating it?",
      answer: "Yes, you can edit your resume anytime. Just log in to your account, select the resume you want to modify, and make your changes. All updates are saved automatically."
    }
  ];

  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const answerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="faqs" className="faqs-section">
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about Resume Maker</p>
      </motion.div>
      
      <motion.div 
        className="faqs-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {faqsList.map((faq, index) => (
          <motion.div 
            key={faq.id}
            variants={itemVariants}
            className={`faq-item ${activeId === faq.id ? 'active' : ''}`}
            onClick={() => toggleFAQ(faq.id)}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(0, 123, 255, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <motion.div 
              className="faq-question"
              whileHover={{ backgroundColor: "rgba(0, 123, 255, 0.05)" }}
            >
              <h3>{faq.question}</h3>
              <motion.span 
                className="toggle-icon"
                animate={{ 
                  rotate: activeId === faq.id ? 45 : 0 
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              ></motion.span>
            </motion.div>
            <AnimatePresence>
              {activeId === faq.id && (
                <motion.div 
                  className="faq-answer"
                  variants={answerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FAQs;
