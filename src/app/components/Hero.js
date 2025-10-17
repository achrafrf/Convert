import React from 'react'
import { Sparkles, Upload, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      className="relative py-16 md:py-24 bg-[#19182b] text-white clip-diagonal"
      style={{ 
        height: '620px', 
        width: '100%'
      }}
    >
      {/* صورة الخلفية مع تأثيرات متعددة */}
   <div 
  className="absolute inset-0 z-0"  // غير من z-1 إلى z-0
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
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 ml-2" />
More than 10,000 transfers per month
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Convert{' '}
            <span className="text-violet-300 bg-clip-text drop-shadow-lg">
              Any File
            </span>
            <br />
Easily and quickly
          </h1>
          
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
An integrated platform for converting images and documents with high quality. Fast, secure, and completely free.          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="bg-white/90 text-gray-800 px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/30 hover:border-blue-300 font-medium flex items-center group backdrop-blur-sm hover:scale-105">
              <Upload className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
Start converting now
            </button>
            <button className="bg-violet-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-medium flex items-center group backdrop-blur-sm">
Explore all tools
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* إضافة الـ styles */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}

export default Hero;