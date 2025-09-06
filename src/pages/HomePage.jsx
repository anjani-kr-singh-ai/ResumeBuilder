import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TemplateShowcase from '../components/TemplateShowcase';
import Features from '../components/Features';
import FAQs from '../components/FAQs';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TemplateShowcase />
      <Features />
      <FAQs />
      <Footer />
    </>
  );
};

export default HomePage;
