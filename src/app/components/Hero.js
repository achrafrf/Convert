import React from 'react'
import { Sparkles, Upload, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      className="relative py-16 md:py-24 bg-[#19182b] text-white street-font"
      style={{ 
        minHeight: '620px', 
        width: '100%'
      }}
    >
      {/* صورة الخلفية مع تأثيرات متعددة */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* طبقات تظليل متعددة */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-1"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 z-1"></div>
      

      {/* المحتوى */}
      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col justify-center h-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium mb-8 backdrop-blur-md street-tag">
            <Sparkles className="w-4 h-4 ml-2" />
            MORE THAN 10,000 TRANSFERS PER MONTH
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl street-heading tracking-tight">
            CONVERT{' '}
            <span className="text-violet-300 street-accent bg-clip-text drop-shadow-lg">
              ANY FILE
            </span>
            <br />
            EASILY & QUICKLY
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg street-subtitle tracking-wide">
            INTEGRATED PLATFORM FOR CONVERTING IMAGES & DOCUMENTS WITH HIGH QUALITY. 
            FAST, SECURE, COMPLETELY FREE.
          </p>

          {/* قسم الأزرار - تم تعديله ليكون متجاوبًا بشكل أفضل */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
            <button className="w-full sm:w-auto bg-white text-gray-900 px-6 sm:px-8 py-4 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white font-black flex items-center justify-center group backdrop-blur-sm hover:scale-105 street-button uppercase tracking-wider text-sm relative z-20">
              <Upload className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              START CONVERTING NOW
            </button>
            <button className="w-full sm:w-auto bg-violet-600 text-white px-6 sm:px-8 py-4 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-black flex items-center justify-center group backdrop-blur-sm border-2 border-violet-400 street-button-alt uppercase tracking-wider text-sm relative z-20">
              EXPLORE ALL TOOLS
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* إضافة الـ styles */}
      <style jsx>{`
        .street-font {
          font-family: 'Bebas Neue', 'Impact', 'Arial Black', 'Franklin Gothic Heavy', sans-serif;
        }
        
        .street-heading {
          font-family: 'Bebas Neue', 'Impact', 'Arial Black', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.8),
                       6px 6px 0px rgba(139, 92, 246, 0.3);
        }
        
        .street-accent {
          background: linear-gradient(45deg, #a78bfa, #c4b5fd, #ddd6fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
        }
        
        .street-tag {
          font-family: 'Rajdhani', 'Orbitron', 'Arial Narrow', sans-serif;
          font-weight: 700;
          letter-spacing: 1.5px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
        }
        
        .street-subtitle {
          font-family: 'Rajdhani', 'Orbitron', 'Arial', sans-serif;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .street-button {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          letter-spacing: 2px;
          border: 2px solid #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .street-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
        }
        
        .street-button-alt {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          letter-spacing: 2px;
          border: 2px solid #8b5cf6;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .street-button-alt:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
          background: #7c3aed;
        }

        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }

        /* تأثيرات إضافية للـ Street Style */
        .street-heading {
          position: relative;
        }

        .street-heading::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #a78bfa, transparent);
        }
      `}</style>
    </section>
  );
}

export default Hero;