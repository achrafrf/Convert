// components/About.js
'use client';
import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Award, Users, Zap, Shield, Globe, Heart } from 'lucide-react';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "سريع وفعال",
      description: "تحويل فوري للملفات بدون انتظار مع أحدث التقنيات"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "آمن ومحمي",
      description: "جميع عملياتك مؤمنة ولا نحتفظ بملفاتك بعد التحويل"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "يعمل في المتصفح",
      description: "لا حاجة لتحميل برامج، كل شيء يعمل مباشرة في متصفحك"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "مجاني بالكامل",
      description: "جميع الأدوات متاحة مجاناً بدون أي رسوم خفية"
    }
  ];

  const stats = [
    { number: "500+", label: "Satisfied user" },
    { number: "1,000+", label: "Converted file" },
    { number: "99.9%", label: "Success rate" },
    { number: "24/7", label: "Continuous support" }
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section with Video */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-right space-y-8 street-font">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Converter platform 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Comprehensive
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
An integrated platform that enables you to convert all types of files easily and quickly.
From photos to documents, from videos to eBooks - everything you need in one place.                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-end">
                <div className="flex items-center space-x-2 space-x-reverse bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700 font-medium">Trusted platform</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">+50 thousand users</span>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-80 lg:h-96 object-cover"
                  poster="/api/placeholder/600/400"
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  متصفحك لا يدعم تشغيل الفيديو
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <button
                        onClick={togglePlay}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white" />
                        )}
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                    >
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlay}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <Play className="w-12 h-12 text-white fill-current" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Description */}
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
Watch this short video to learn how our platform works.                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
How does the platform work?            </h2>
            <p className="text-xl text-gray-600">
Three simple steps separate you from converting your files            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-200">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
Select the tool
              </h3>
              <p className="text-gray-600">
Choose from dozens of conversion tools available.              </p>
              <div className="absolute top-10 right-1/2 transform translate-x-1/2 md:translate-x-0 md:right-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-200">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Download the file
              </h3>
              <p className="text-gray-600">
Upload your file and adjust the settings as you need.              </p>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
              <div className="absolute top-10 right-1/2 transform translate-x-1/2 md:translate-x-0 md:right-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 border-2 border-blue-200">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
Download the result       
       </h3>
              <p className="text-gray-600">
Download the converted file and enjoy the result.
              </p>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>
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
    </div>
  );
};

export default About;