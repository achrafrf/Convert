// components/FloatingButtonsEnhanced.js
'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, Sparkles } from 'lucide-react';
import Image from 'next/image';

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
      {/* زر Designed By مع الصورة */}
      <button
        onClick={handleDesignedByClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-1 left-2 z-50 p-3  transition-all duration-500 hover:scale-105  "
        aria-label="Designed by Achraf Rafiq"
      >
        <div className="flex items-center space-x-2 space-x-reverse relative">
          {/* تأثير Sparkles عند Hover */}
          {isHovered && (
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-ping" />
          )}
          
          {/* الصورة بدلاً من النص */}
          <div className="relative">
            <Image 
              src="/designedbyachraf.png" 
              alt="Designed by Achraf Rafiq"
              width={120}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
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