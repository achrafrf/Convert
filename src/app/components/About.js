// components/About.js
'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Award, Users, Zap, Shield, Globe, Heart } from 'lucide-react';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

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

  // إظهار/إخفاء عناصر التحكم
  const showVideoControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        setCurrentTime(video.currentTime);
        setDuration(video.duration || 0);
        setProgress((video.currentTime / video.duration) * 100 || 0);
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', updateProgress);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', updateProgress);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    showVideoControls();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    showVideoControls();
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      }
    }
    showVideoControls();
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
      setProgress(percent * 100);
    }
    showVideoControls();
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section with Video */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right space-y-6 lg:space-y-8 street-font order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Converter platform 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Comprehensive
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 lg:mr-auto">
                  An integrated platform that enables you to convert all types of files easily and quickly.
                  From photos to documents, from videos to eBooks - everything you need in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 lg:px-6 lg:py-3 shadow-lg">
                  <Award className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
                  <span className="text-gray-700 font-medium text-sm lg:text-base">Trusted platform</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 lg:px-6 lg:py-3 shadow-lg">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-green-500" />
                  <span className="text-gray-700 font-medium text-sm lg:text-base">+50 thousand users</span>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div 
              className="relative group order-1 lg:order-2"
              onMouseEnter={showVideoControls}
              onMouseMove={showVideoControls}
              onMouseLeave={() => {
                if (isPlaying) {
                  setShowControls(false);
                }
              }}
              onTouchStart={showVideoControls}
            >
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  poster="/api/placeholder/600/400"
                  onEnded={() => {
                    setIsPlaying(false);
                    setShowControls(true);
                  }}
                  onClick={togglePlay}
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Progress Bar */}
                <div 
                  className="absolute bottom-16 left-0 right-0 h-1 bg-gray-600/50 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-red-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Video Controls Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                    {/* Time Display */}
                    <div className="flex items-center justify-between text-white text-xs lg:text-sm mb-2 px-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-2 lg:p-3 hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          ) : (
                            <Play className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          )}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-2 lg:p-3 hover:bg-white/30 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          ) : (
                            <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          )}
                        </button>

                        {/* Progress Bar for Mobile */}
                        <div 
                          className="hidden sm:block w-24 lg:w-32 h-1 bg-gray-600/50 rounded cursor-pointer ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProgressClick(e);
                          }}
                        >
                          <div 
                            className="h-full bg-red-500 rounded transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen();
                        }}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-2 lg:p-3 hover:bg-white/30 transition-colors"
                      >
                        <Maximize className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && showControls && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-4 lg:p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <Play className="w-8 h-8 lg:w-12 lg:h-12 text-white fill-current" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Description */}
              <div className="mt-3 lg:mt-4 text-center">
                <p className="text-gray-600 text-sm lg:text-base">
                  Watch this short video to learn how our platform works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm lg:text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make our file conversion platform the best choice for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              How does the platform work?
            </h2>
            <p className="text-lg lg:text-xl text-gray-600">
              Three simple steps separate you from converting your files
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl lg:text-2xl font-bold text-blue-600 border-2 border-blue-200">
                1
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">
                Select the tool
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">
                Choose from dozens of conversion tools available.
              </p>
              <div className="absolute top-8 right-1/2 transform translate-x-1/2 md:translate-x-0 md:right-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl lg:text-2xl font-bold text-blue-600 border-2 border-blue-200">
                2
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">
                Upload the file
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">
                Upload your file and adjust the settings as you need.
              </p>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
              <div className="absolute top-8 right-1/2 transform translate-x-1/2 md:translate-x-0 md:right-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl lg:text-2xl font-bold text-blue-600 border-2 border-blue-200">
                3
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">
                Download the result
              </h3>
              <p className="text-gray-600 text-sm lg:text-base">
                Download the converted file and enjoy the result.
              </p>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-0.5 bg-blue-200 hidden md:block"></div>
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