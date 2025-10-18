// app/page.js
'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import ToolsSection from './components/ToolsSection';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ConverterModal from './components/ConverterModal';
import About from './components/About';

export default function Home() {
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (tool) => {
    if (tool.component) {
      setActiveTool(tool.component);
    }
  };

  const closeConverter = () => {
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Hero />
      <Features />
      <About />
      <ToolsSection onToolClick={handleToolClick} />
      <CTA />
      <Footer />
      <ConverterModal activeTool={activeTool} onClose={closeConverter} />
    </div>
  );
}