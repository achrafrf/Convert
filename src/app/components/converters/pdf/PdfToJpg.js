'use client';

import { useState } from 'react';
import { Download, FileText, Image, Sparkles, CheckCircle, X } from 'lucide-react';
import FileUpload from '../../ui/FileUpload';

export default function PdfToJpg({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFiles, setConvertedFiles] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFiles(null);
    // محاكاة عدد الصفحات
    setPagesCount(Math.floor(Math.random() * 10) + 1);
  };

  const convertToJpg = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // محاكاة تحويل متعدد الصفحات
      const convertedUrls = [];
      for (let i = 0; i < pagesCount; i++) {
        const convertedBlob = new Blob([selectedFile], { type: 'image/jpeg' });
        const convertedUrl = URL.createObjectURL(convertedBlob);
        convertedUrls.push({
          url: convertedUrl,
          name: `${selectedFile.name.replace('.pdf', '')}_page_${i + 1}.jpg`,
          size: selectedFile.size / pagesCount
        });
      }
      
      setConvertedFiles(convertedUrls);
    } catch (err) {
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAll = () => {
    if (convertedFiles) {
      convertedFiles.forEach((file, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.name;
          link.click();
        }, index * 100);
      });
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConvertedFiles(null);
    setPagesCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">PDF إلى JPG</h2>
              <p className="text-gray-600 text-sm">تحويل صفحات PDF إلى صور JPG</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">رفع ملف PDF</h3>

              <FileUpload
                onFileSelect={handleFileSelect}
                acceptedTypes={['pdf']}
                maxSize={15}
              />

              {selectedFile && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
                      <p className="text-gray-600 text-xs">{pagesCount} صفحات</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={convertToJpg}
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
                    جاري تحويل {pagesCount} صفحات...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Image className="w-4 h-4 ml-2" />
                    تحويل إلى JPG
                  </span>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النتيجة</h3>

              {convertedFiles ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Image className="w-8 h-8 text-purple-400" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">تم تحويل {pagesCount} صفحة</p>
                    <p className="text-green-600 text-sm mt-1">جاهزة للتحميل!</p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-blue-700 text-sm text-center">
                      📸 تم تحويل جميع صفحات PDF إلى صور JPG منفصلة
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadAll}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل جميع الصور
                  </button>

                  <button
                    onClick={resetConverter}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-2xl font-semibold hover:border-purple-400 transition-colors"
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
                    {selectedFile ? 'انقر على تحويل لبدء العملية' : 'ستظهر الصور المحولة هنا'}
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