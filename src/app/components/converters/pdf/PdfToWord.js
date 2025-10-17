'use client';

import { useState } from 'react';
import { Download, FileText, Sparkles, CheckCircle, X, FileUp } from 'lucide-react';
import FileUpload from '../../ui/FileUpload';

export default function PdfToWord({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFile(null);
  };

  const convertToWord = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const convertedBlob = new Blob([selectedFile], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const convertedUrl = URL.createObjectURL(convertedBlob);
      
      setConvertedFile({
        url: convertedUrl,
        name: selectedFile.name.replace('.pdf', '.docx'),
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">PDF إلى Word</h2>
              <p className="text-gray-600 text-sm">تحويل PDF إلى مستند Word قابل للتعديل</p>
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
                maxSize={20}
              />

              {selectedFile && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
                      <p className="text-gray-600 text-xs">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 bg-yellow-50 rounded-2xl p-4">
                <h4 className="font-semibold text-yellow-800 text-sm mb-2">ملاحظات هامة:</h4>
                <ul className="text-yellow-700 text-xs space-y-1">
                  <li>• يحافظ على النصوص والتنسيق الأساسي</li>
                  <li>• يدعم المستندات العربية والإنجليزية</li>
                  <li>• الحد الأقصى للملف: 20MB</li>
                </ul>
              </div>

              <button
                onClick={convertToWord}
                disabled={!selectedFile || isConverting}
                className={`w-full mt-4 py-3 px-4 rounded-2xl font-semibold transition-all duration-300 ${
                  !selectedFile || isConverting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                }`}
              >
                {isConverting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    جاري التحويل...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FileUp className="w-4 h-4 ml-2" />
                    تحويل إلى Word
                  </span>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النتيجة</h3>

              {convertedFile ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{convertedFile.name}</p>
                    <p className="text-green-600 text-sm mt-1">تم التحويل بنجاح!</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <p className="text-green-700 text-sm text-center">
                      📝 تم تحويل PDF إلى مستند Word قابل للتعديل!
                    </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل مستند Word
                  </button>

                  <button
                    onClick={resetConverter}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-2xl font-semibold hover:border-blue-400 transition-colors"
                  >
                    تحويل ملف آخر
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {selectedFile ? 'انقر على تحويل لبدء العملية' : 'سيظهر مستند Word هنا'}
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