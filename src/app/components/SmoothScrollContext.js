'use client';
import { createContext, useContext, useRef } from 'react';

const SmoothScrollContext = createContext();

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};

export const SmoothScrollProvider = ({ children }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Hauteur du header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      // Animation de défilement personnalisée plus lente et plus fluide
      smoothScrollTo(offsetPosition, 1200); // 1200ms = 1.2 secondes
    }
  };

  // Fonction de défilement smooth personnalisée
  const smoothScrollTo = (targetPosition, duration = 1200) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Fonction d'easing pour un effet plus smooth (easeInOutCubic)
      const ease = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };
      
      const run = ease(progress);
      window.scrollTo(0, startPosition + distance * run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollToSection }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};