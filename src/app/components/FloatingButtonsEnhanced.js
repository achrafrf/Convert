// components/FloatingButtonsEnhanced.js
'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, Zap, Heart, Sparkles } from 'lucide-react';

const FloatingButtonsEnhanced = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDesignedByClick = () => {
    // افتح portfolio
    window.open('https://github.com/achrafrf', '_blank');
  };

  return (
    <>
      {/* زر Designed By مع تأثيرات متطورة */}
      <button
        onClick={handleDesignedByClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 left-6 z-50 px-5 py-3 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-cyan-600/90 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 group border-2 border-white/30 backdrop-blur-md"
        aria-label="Designed by Achraf Rafiq"
      >
        <div className="flex items-center space-x-2 space-x-reverse relative">
          {/* تأثير Sparkles عند Hover */}
          {isHovered && (
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-2 -right-2 animate-ping" />
          )}
          
          <Zap className="w-5 h-5 text-amber-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
          
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-200">Designed by</span>
            <span className="text-sm font-bold flex items-center">
              <span className="text-amber-300 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text">
                Achraf Rafiq
              </span>
            </span>
          </div>
        </div>
      </button>

      {/* زر Scroll to Top مع تأثيرات متطورة */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-violet-500/90 to-violet-800/90 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group border-2 border-white/30 backdrop-blur-md"
          aria-label="Scroll to top"
        >
          <div className="relative">
            <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
            
            {/* تأثير دائري */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </button>
      )}
    </>
  );
};

export default FloatingButtonsEnhanced;