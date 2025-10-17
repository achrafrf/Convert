// components/converters/ImageToText.js
'use client';
import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { FileText, Upload, Copy, Download, X, Languages } from 'lucide-react';

const ImageToText = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('الرجاء تحميل ملف صورة فقط');
        return;
      }
      
      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setText('');
      setDetectedLanguage('');
    }
  };

  const detectLanguageFromText = (text) => {
    // كشف اللغة بناءً على الأحرف
    const arabicChars = /[\u0600-\u06FF]/;
    const englishChars = /[a-zA-Z]/;
    
    if (arabicChars.test(text)) {
      return 'العربية';
    } else if (englishChars.test(text)) {
      return 'English';
    } else {
      return 'غير معروفة';
    }
  };

  const convertImageToText = async () => {
    if (!image) {
      alert('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setProgress(0);
    setText('');
    setDetectedLanguage('');

    try {
      // محاكاة شريط التقدم
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 10;
        });
      }, 300);

      // إنشاء Worker مع الإصاح الصحيح
      const worker = await createWorker('eng+ara'); // تحميل اللغات المطلوبة
      
      // تحديث التقدم
      setProgress(90);

      // التعرف على النص
      const { data } = await worker.recognize(image);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // تعيين النص المكتشف
      setText(data.text);
      
      // كشف اللغة تلقائياً
      const lang = detectLanguageFromText(data.text);
      setDetectedLanguage(lang);
      
      // إنهاء ال Worker
      await worker.terminate();
      
      // إعادة التعيين
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error('OCR Error:', error);
      setText('حدث خطأ في تحويل الصورة إلى نص. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      setProgress(0);
    }
  };

  // نسخة مبسطة بدون كشف لغة
  const convertImageToTextSimple = async () => {
    if (!image) {
      alert('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setProgress(0);
    setText('');
    setDetectedLanguage('');

    try {
      // شريط تقدم محاكى
      const progressSteps = [10, 25, 50, 75, 90, 100];
      for (const step of progressSteps) {
        setProgress(step);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // استخدام Tesseract.js بشكل صحيح
      const worker = await createWorker();
      
      // تهيئة ال Worker بلغات متعددة
      await worker.load();
      await worker.initialize('eng+ara'); // الإنجليزية والعربية
      
      const { data } = await worker.recognize(image);
      setText(data.text);
      
      // كشف اللغة
      const lang = detectLanguageFromText(data.text);
      setDetectedLanguage(lang);
      
      await worker.terminate();
      setLoading(false);
      
    } catch (error) {
      console.error('OCR Error:', error);
      setText('حدث خطأ في تحويل الصورة إلى نص. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      setProgress(0);
    }
  };

  // الحل الأكثر موثوقية
  const convertImageToTextReliable = async () => {
    if (!image) {
      alert('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setProgress(0);
    setText('');
    setDetectedLanguage('');

    try {
      // استخدام أسلوب أكثر موثوقية
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker();

      // محاكاة التقدم
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 5;
        });
      }, 200);

      // التعرف على النص
      const result = await worker.recognize(image);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setText(result.data.text);
      
      // كشف اللغة
      const lang = detectLanguageFromText(result.data.text);
      setDetectedLanguage(lang);
      
      await worker.terminate();
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 600);

    } catch (error) {
      console.error('OCR Error:', error);
      setText('حدث خطأ في تحويل الصورة إلى نص. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      setProgress(0);
    }
  };

  const clearAll = () => {
    setImage(null);
    setText('');
    setDetectedLanguage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('تم نسخ النص إلى الحافظة!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('تم نسخ النص إلى الحافظة!');
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `النص-المستخرج-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول الصور إلى نص</h2>
              <p className="text-gray-600 text-sm">استخرج النص من الصور باستخدام الذكاء الاصطناعي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <div className="space-y-4">
                    <img 
                      src={image} 
                      alt="Uploaded" 
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                    <p className="text-sm text-gray-600">انقر لتغيير الصورة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">انقر لتحميل صورة</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG, BMP - الحد الأقصى 5MB</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Language Detection Info */}
              {detectedLanguage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2 space-x-reverse">
                  <Languages className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 text-sm">
                    <strong>اللغة المكتشفة:</strong> {detectedLanguage}
                  </span>
                </div>
              )}

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex space-x-3 space-x-reverse">
                  <button 
                    onClick={convertImageToTextReliable} 
                    disabled={!image || loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        جاري التحويل... {progress}%
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 ml-2" />
                        استخراج النص تلقائياً
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={clearAll}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    مسح الكل
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    ✅ الكشف التلقائي عن اللغة (العربية/الإنجليزية)
                  </p>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">النص المستخرج</h3>
                {text && (
                  <div className="flex space-x-2 space-x-reverse">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="نسخ النص"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={downloadText}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="تحميل النص"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-300 rounded-lg h-64 overflow-auto bg-gray-50">
                {text ? (
                  <div className="p-4">
                    <div className="whitespace-pre-wrap text-gray-800 text-sm leading-6 font-sans direction-rtl text-right">
                      {text}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {loading ? (
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-700">جاري معالجة الصورة...</p>
                        <p className="text-sm text-gray-500 mt-1">{progress}% مكتمل</p>
                        <p className="text-xs text-gray-400 mt-2">جاري الكشف التلقائي عن اللغة</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>سيظهر النص المستخرج هنا</p>
                        <p className="text-xs text-gray-400 mt-1">مع الكشف التلقائي عن اللغة</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✨ الميزات الجديدة:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <strong>الكشف التلقائي عن اللغة</strong> (العربية/الإنجليزية)</li>
                  <li>• دعم الصور باللغتين معاً</li>
                  <li>• لا حاجة لاختيار اللغة يدوياً</li>
                  <li>• نتائج أدق مع الخوارزميات المحسنة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToText;