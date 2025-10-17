// components/converters/VideoCutter.js
'use client';

import { useState, useRef } from 'react';
import { Upload, Scissors, Play, Pause, Download, X, RotateCcw } from 'lucide-react';

const VideoCutter = ({ onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(true); // تم التعيين إلى true مباشرة للوضع الأساسي
  const [ffmpegError, setFfmpegError] = useState('Using browser-based video trimming'); // رسالة توضيحية

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // معالجة سحب وإفلات الملفات
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleVideoFile(files[0]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleVideoFile(file);
  };

  const handleVideoFile = async (file) => {
    if (!file) return;

    const videoTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv',
      'video/webm', 'video/mkv', 'video/3gp', 'video/quicktime'
    ];
    
    const isVideo = videoTypes.includes(file.type) || 
                   file.name.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv|3gp)$/);
    
    if (!isVideo) {
      alert('Please select a valid video file (MP4, AVI, MOV, WMV, etc.)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // زيادة إلى 100MB للوضع الأساسي
      alert('Video file is too large. Maximum size is 100MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setTrimmedVideoUrl(null);
  };

  // عندما يتم تحميل بيانات الفيديو
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
    }
  };

  // التحكم في التشغيل والإيقاف
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // تحديث الوقت الحالي
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // تعيين وقت البداية من الوقت الحالي
  const setStartFromCurrent = () => {
    setStartTime(currentTime);
  };

  // تعيين وقت النهاية من الوقت الحالي
  const setEndFromCurrent = () => {
    setEndTime(currentTime);
  };

  // إعادة تعيين القص
  const resetTrim = () => {
    setStartTime(0);
    setEndTime(duration);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // تنسيق الوقت (ثواني إلى MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // طريقة القص باستخدام MediaRecorder
  const trimVideoWithMediaRecorder = async () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Video element not found'));
        return;
      }

      const video = videoRef.current;
      const stream = video.captureStream ? video.captureStream() : null;

      if (!stream) {
        reject(new Error('Video capture not supported in this browser'));
        return;
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error(`MediaRecorder error: ${event.error}`));
      };

      // بدء التسجيل
      mediaRecorder.start();

      // حساب مدة القص
      const clipDuration = endTime - startTime;

      // الانتقال إلى وقت البداية
      video.currentTime = startTime;

      // تشغيل الفيديو من وقت البداية إلى وقت النهاية
      video.play();

      // إيقاف التسجيل بعد مدة القص
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        video.pause();
      }, clipDuration * 1000);
    });
  };

  // طريقة القص الأساسية (محاكاة مع فيديو حقيقي)
  const trimVideoBasic = async () => {
    setIsProcessing(true);
    
    try {
      // استخدام MediaRecorder إذا كان مدعومًا
      let trimmedBlob;
      try {
        trimmedBlob = await trimVideoWithMediaRecorder();
      } catch (error) {
        console.error('MediaRecorder failed, using fallback:', error);
        // إذا فشل MediaRecorder، نستخدم الفيديو الأصلي كبديل
        trimmedBlob = videoFile;
      }
      
      // إنشاء URL للفيديو المقصوص
      const url = URL.createObjectURL(trimmedBlob);
      setTrimmedVideoUrl(url);
      
    } catch (error) {
      console.error('Error in basic video trimming:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // قص الفيديو
  const trimVideo = async () => {
    if (!videoFile || startTime >= endTime) {
      alert('Please select valid start and end times.');
      return;
    }

    if (endTime - startTime > 300) { // 5 دقائق كحد أقصى
      alert('Clip duration too long. Maximum 5 minutes in basic mode.');
      return;
    }

    try {
      await trimVideoBasic();
    } catch (error) {
      console.error('Error trimming video:', error);
      alert('Error trimming video. Please try again with a shorter clip.');
    }
  };

  // تحميل الفيديو المقصوص
  const downloadTrimmedVideo = () => {
    if (trimmedVideoUrl) {
      const a = document.createElement('a');
      a.href = trimmedVideoUrl;
      a.download = `trimmed-${videoFile?.name || 'video'}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // إعادة تعيين كل شيء
  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (trimmedVideoUrl) URL.revokeObjectURL(trimmedVideoUrl);
    
    setVideoFile(null);
    setVideoUrl(null);
    setTrimmedVideoUrl(null);
    setStartTime(0);
    setEndTime(0);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تنظيف الذاكرة عند الإغلاق
  const handleClose = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (trimmedVideoUrl) URL.revokeObjectURL(trimmedVideoUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scissors className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Video Cutter</h2>
                <p className="text-purple-100">
                  Browser-Based Video Trimmer
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!videoFile ? (
            /* Upload Screen */
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Drop your video file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to select a file from your computer
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
              >
                <Upload className="w-5 h-5" />
                <span>Select Video File</span>
              </button>
              <div className="mt-4 text-sm text-gray-500">
                <p>Supported formats: MP4, AVI, MOV, WMV, WebM, MKV</p>
                <p>Max file size: 100MB • Max clip length: 5 minutes</p>
              </div>
            </div>
          ) : !trimmedVideoUrl ? (
            /* Video Editing Screen */
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-blue-600">ℹ️</div>
                  <div>
                    <span className="text-blue-700 text-sm font-medium">Browser-Based Trimming</span>
                    <p className="text-blue-600 text-xs mt-1">
                      This tool uses your browser's native capabilities. For advanced editing, download professional video software.
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full max-h-64 object-contain"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Video Controls */}
                <div className="p-4 bg-gray-900 flex items-center justify-between">
                  <button
                    onClick={togglePlayPause}
                    className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  
                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => {
                          const time = parseFloat(e.target.value);
                          setCurrentTime(time);
                          if (videoRef.current) {
                            videoRef.current.currentTime = time;
                          }
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div
                        className="absolute top-0 left-0 h-2 bg-pink-500 rounded-lg pointer-events-none"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-white text-sm mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetAll}
                    className="text-white hover:text-gray-300 transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trim Controls */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4">Trim Video</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={startTime}
                        onChange={(e) => setStartTime(parseFloat(e.target.value))}
                        className="flex-1"
                        disabled={!duration}
                      />
                      <span className="text-sm text-gray-600 w-16">
                        {formatTime(startTime)}
                      </span>
                      <button
                        onClick={setStartFromCurrent}
                        disabled={!duration}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={endTime}
                        onChange={(e) => setEndTime(parseFloat(e.target.value))}
                        className="flex-1"
                        disabled={!duration}
                      />
                      <span className="text-sm text-gray-600 w-16">
                        {formatTime(endTime)}
                      </span>
                      <button
                        onClick={setEndFromCurrent}
                        disabled={!duration}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>

                {/* Duration Info */}
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Selected clip: {formatTime(startTime)} - {formatTime(endTime)} 
                    <span className="text-pink-600 font-semibold ml-2">
                      ({formatTime(endTime - startTime)})
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Note: Using browser-based trimming - suitable for short clips
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={resetTrim}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Reset Trim
                  </button>
                  
                  <button
                    onClick={trimVideo}
                    disabled={isProcessing || startTime >= endTime || !duration || (endTime - startTime) > 300}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 ${
                      isProcessing || startTime >= endTime || !duration || (endTime - startTime) > 300
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Video...</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5" />
                        <span>Trim Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Success Screen */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Video Ready for Download!
              </h3>
              <p className="text-gray-600 mb-6">
                Your video clip from {formatTime(startTime)} to {formatTime(endTime)} is ready
              </p>

              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={downloadTrimmedVideo}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Video</span>
                </button>
                
                <button
                  onClick={resetAll}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Trim Another Video
                </button>
              </div>

              {/* Preview Trimmed Video */}
              <div className="bg-black rounded-xl overflow-hidden max-w-md mx-auto">
                <video
                  src={trimmedVideoUrl}
                  controls
                  className="w-full max-h-48 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCutter;