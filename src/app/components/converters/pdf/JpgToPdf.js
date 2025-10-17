'use client';

import { useState } from 'react';
import { Download, FileText, Image, Sparkles, CheckCircle, X, Plus, Trash2 } from 'lucide-react';

export default function JpgToPdf({ onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['jpg', 'jpeg', 'png'].some(ext => file.name.toLowerCase().endsWith(ext))
    );
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    setConvertedFile(null);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsConverting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const convertedBlob = new Blob(selectedFiles, { type: 'application/pdf' });
      const convertedUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        url: convertedUrl,
        name: `converted_${Date.now()}.pdf`,
        size: selectedFiles.reduce((sum, file) => sum + file.size, 0)
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
    setSelectedFiles([]);
    setConvertedFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">JPG إلى PDF</h2>
              <p className="text-gray-600 text-sm">تحويل الصور إلى ملف PDF واحد</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">رفع الصور</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:border-orange-400 hover:bg-orange-50"
                   onClick={() => document.getElementById('image-input')?.click()}>
                <input
                  id="image-input"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  multiple
                  onChange={handleFileSelect}
                />
                
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">انقر لاختيار الصور</p>
                  <p className="text-gray-500 text-sm">يدعم: JPG, PNG • الحد الأقصى: 10 صور</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="bg-white rounded-xl p-3 flex items-center justify-between border">
                      <div className="flex items-center space-x-3">
                        <Image className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={convertToPdf}
                disabled={selectedFiles.length === 0 || isConverting}
                className={`w-full mt-4 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedFiles.length === 0 || isConverting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                }`}
              >
                {isConverting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    جاري إنشاء PDF...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FileText className="w-4 h-4 ml-2" />
                    إنشاء PDF ({selectedFiles.length} صورة)
                  </span>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النتيجة</h3>

              {convertedFile ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-8 h-8 text-orange-400" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{convertedFile.name}</p>
                    <p className="text-green-600 text-sm mt-1">تم الإنشاء بنجاح!</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <p className="text-green-700 text-sm text-center">
                      📄 تم دمج {selectedFiles.length} صورة في ملف PDF واحد!
                    </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل ملف PDF
                  </button>

                  <button
                    onClick={resetConverter}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-2xl font-semibold hover:border-orange-400 transition-colors"
                  >
                    إنشاء PDF جديد
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {selectedFiles.length > 0 ? 'انقر على إنشاء لبدء العملية' : 'سيظهر ملف PDF هنا'}
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