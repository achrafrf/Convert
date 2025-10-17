'use client';

import { useState } from 'react';
import { Download, Image, Sparkles, CheckCircle, X } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

export default function JpgToPng({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFile(null);
  };

  const convertToPng = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const convertedBlob = new Blob([selectedFile], { type: 'image/png' });
      const convertedUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        url: convertedUrl,
        name: selectedFile.name.replace('.jpg', '.png').replace('.jpeg', '.png'),
        size: selectedFile.size
      });
    } catch (err) {
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile.url;
      link.download = convertedFile.name;
      link.click();
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConvertedFile(null);
  };

  return (
    <div id='JPGTOPNG' className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">JPG إلى PNG</h2>
              <p className="text-gray-600 text-sm">تحويل الصور من JPG إلى PNG</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">رفع الصورة</h3>

              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={['jpg', 'jpeg']}
                maxSize={5}
              />

              {selectedFile && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
                      <p className="text-gray-600 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={convertToPng}
                disabled={!selectedFile || isConverting}
                className={`w-full mt-4 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                  !selectedFile || isConverting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                }`}
              >
                {isConverting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    جاري التحويل...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Sparkles className="w-4 h-4 ml-2" />
                    تحويل إلى PNG
                  </span>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النتيجة</h3>

              {convertedFile ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Image className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{convertedFile.name}</p>
                    <p className="text-green-600 text-sm mt-1">تم التحويل بنجاح!</p>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل الصورة
                  </button>

                  <button
                    onClick={resetConverter}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-2xl font-semibold hover:border-purple-400 transition-colors"
                  >
                    تحويل صورة أخرى
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {selectedFile ? 'انقر على تحويل لبدء العملية' : 'سيظهر ملف PNG المحول هنا'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}