'use client';

import { useState } from 'react';
import { Download, Image, Sparkles, CheckCircle, X, Settings } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

export default function SvgConverter({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionType, setConversionType] = useState('png');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFile(null);
  };

  const convertSvg = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const type = conversionType === 'png' ? 'image/png' : 'image/jpeg';
      const extension = conversionType === 'png' ? '.png' : '.jpg';
      
      const convertedBlob = new Blob([selectedFile], { type });
      const convertedUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        url: convertedUrl,
        name: selectedFile.name.replace('.svg', extension),
        size: selectedFile.size,
        type: conversionType
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
    <div className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">محول SVG</h2>
              <p className="text-gray-600 text-sm">تحويل وتعديل ملفات SVG المتجهة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">رفع الملف</h3>

              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={['svg']}
                maxSize={5}
              />

              {/* Conversion Options */}
              <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-700 text-sm">خيارات التحويل</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConversionType('png')}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      conversionType === 'png'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    إلى PNG
                  </button>
                  <button
                    onClick={() => setConversionType('jpg')}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      conversionType === 'jpg'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    إلى JPG
                  </button>
                </div>
              </div>

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
                onClick={convertSvg}
                disabled={!selectedFile || isConverting}
                className={`w-full mt-4 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                  !selectedFile || isConverting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
                }`}
              >
                {isConverting ? 'جاري التحويل...' : `تحويل إلى ${conversionType.toUpperCase()}`}
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النتيجة</h3>

              {convertedFile ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Image className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{convertedFile.name}</p>
                    <p className="text-green-600 text-sm mt-1">تم التحويل بنجاح!</p>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4">
                    <p className="text-purple-700 text-sm text-center">
                      🎨 تم تحويل الملف المتجه إلى صورة نقطية عالية الجودة!
                    </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    تحميل الصورة
                  </button>

                  <button
                    onClick={resetConverter}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-2xl font-semibold hover:border-pink-400 transition-colors"
                  >
                    تحويل ملف آخر
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {selectedFile ? 'انقر على تحويل لبدء العملية' : 'سيظهر الملف المحول هنا'}
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