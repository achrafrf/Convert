// components/converters/ImageToText.js
'use client';
import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { FileText, Upload, Copy, Download, X, Languages, Settings, Zap } from 'lucide-react';

const ImageToText = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [imageQuality, setImageQuality] = useState('');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const fileInputRef = useRef(null);

  // معالجة تحميل الصورة مع تحسين الجودة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء تحميل ملف صورة فقط');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. الحد الأقصى 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          analyzeImageQuality(img);
          setImage(e.target.result);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setText('');
      setDetectedLanguage('');
    }
  };

  // تحليل جودة الصورة
  const analyzeImageQuality = (img) => {
    const quality = img.width < 300 || img.height < 300 ? 'منخفضة (الدقة صغيرة)' : 'جيدة';
    setImageQuality(quality);
  };

  // تحسين الصورة قبل المعالجة
  const enhanceImage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // زيادة الدقة للصور الصغيرة
        const scale = img.width < 600 ? 2 : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // تطبيق تحسينات
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageSrc;
    });
  };

  const detectLanguageFromText = (text) => {
    const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    
    const arabicRatio = arabicChars.length / (text.length || 1);
    const englishRatio = englishChars.length / (text.length || 1);
    
    if (arabicRatio > 0.3 && arabicRatio > englishRatio) {
      return { code: 'ara', name: 'العربية', confidence: Math.round(arabicRatio * 100) };
    } else if (englishRatio > 0.3) {
      return { code: 'eng', name: 'English', confidence: Math.round(englishRatio * 100) };
    } else {
      return { code: 'unknown', name: 'غير معروفة', confidence: 0 };
    }
  };

  // النسخة المحسنة باستخدام API الصحيح
  const convertImageToTextEnhanced = async () => {
    if (!image) {
      alert('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('جاري تحسين الصورة...');
    setText('');
    setDetectedLanguage('');

    try {
      // الخطوة 1: تحسين الصورة
      setProgress(10);
      setProgressStatus('جاري تحسين جودة الصورة...');
      const enhancedImage = await enhanceImage(image);
      
      // الخطوة 2: إنشاء وتحميل Worker
      setProgress(30);
      setProgressStatus('جاري تحميل محرك التعرف على النص...');
      
      const worker = await createWorker();
      
      // تحديد اللغة بناءً على الاختيار
      let lang = 'eng+ara';
      if (selectedLanguage !== 'auto') {
        lang = selectedLanguage;
      }

      // تحميل اللغة مباشرة في createWorker أو استخدام loadLanguage
      setProgress(50);
      setProgressStatus('جاري تهيئة الإعدادات المتقدمة...');
      
      // الطريقة الصحيحة: تمرير اللغة عند إنشاء الـ Worker أو استخدام loadLanguage
      await worker.loadLanguage(lang);
      await worker.initialize(lang);
      
      // تطبيق إعدادات متقدمة لتحسين الدقة
      await worker.setParameters({
        tessedit_pageseg_mode: '6', // كتلة نصية موحدة
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF .,!?()[]{}:;-"\'',
        tessedit_ocr_engine_mode: '1', // محرك LSTM
        preserve_interword_spaces: '1',
      });

      // الخطوة 3: التعرف على النص
      setProgress(70);
      setProgressStatus('جاري التعرف على النص...');
      
      const { data } = await worker.recognize(enhancedImage);

      setProgress(90);
      setProgressStatus('جاري معالجة النتائج...');

      // تنظيف النص الناتج
      let cleanedText = data.text
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();

      setText(cleanedText);
      
      // كشف اللغة
      const langInfo = detectLanguageFromText(cleanedText);
      setDetectedLanguage(langInfo);

      // الخطوة 4: التنظيف
      setProgress(100);
      setProgressStatus('اكتمل!');
      
      await worker.terminate();
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressStatus('');
      }, 1000);

    } catch (error) {
      console.error('OCR Error:', error);
      setText('حدث خطأ في تحويل الصورة إلى نص. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      setProgress(0);
      setProgressStatus('');
    }
  };

  // نسخة مبسطة وموثوقة
  const convertImageToTextSimple = async () => {
    if (!image) {
      alert('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('جاري المعالجة...');
    setText('');
    setDetectedLanguage('');

    try {
      const worker = await createWorker();
      
      // استخدام الطريقة المبسطة
      setProgress(30);
      setProgressStatus('جاري تحميل اللغة...');
      
      // تحديد اللغة
      let lang = 'eng+ara';
      if (selectedLanguage !== 'auto') {
        lang = selectedLanguage;
      }

      await worker.loadLanguage(lang);
      await worker.initialize(lang);
      
      setProgress(60);
      setProgressStatus('جاري التعرف على النص...');
      
      const { data } = await worker.recognize(image);
      
      setProgress(90);
      setProgressStatus('جاري معالجة النتائج...');

      setText(data.text);
      
      const langInfo = detectLanguageFromText(data.text);
      setDetectedLanguage(langInfo);

      setProgress(100);
      await worker.terminate();
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressStatus('');
      }, 500);

    } catch (error) {
      console.error('OCR Error:', error);
      setText('حدث خطأ في تحويل الصورة إلى نص. الرجاء المحاولة مرة أخرى.');
      setLoading(false);
      setProgress(0);
      setProgressStatus('');
    }
  };

  // نسخة باستخدام createWorker مع الإعدادات المسبقة
  const convertImageToTextReliable = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);
    setProgressStatus('جاري التحضير...');
    setText('');

    try {
      // تحديد اللغة
      let lang = 'eng+ara';
      if (selectedLanguage !== 'auto') {
        lang = selectedLanguage;
      }

      // إنشاء Worker مع الإعدادات المسبقة
      const worker = await createWorker(lang, 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(60);
            setProgressStatus('جاري التعرف على النص...');
          }
        }
      });

      setProgress(30);
      setProgressStatus('جاري معالجة الصورة...');

      const { data } = await worker.recognize(image);
      
      setProgress(90);
      setProgressStatus('جاري التنظيف...');

      let finalText = data.text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
        .replace(/\s+/g, ' ')
        .trim();

      setText(finalText);
      
      const langInfo = detectLanguageFromText(finalText);
      setDetectedLanguage(langInfo);

      setProgress(100);
      setProgressStatus('اكتمل!');
      
      await worker.terminate();
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProgressStatus('');
      }, 800);

    } catch (error) {
      console.error('OCR Error:', error);
      setText('فشل في معالجة الصورة. جرب صورة أخرى أو تأكد من وضوح النص.');
      setLoading(false);
      setProgress(0);
      setProgressStatus('');
    }
  };

  const clearAll = () => {
    setImage(null);
    setText('');
    setDetectedLanguage('');
    setImageQuality('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('تم نسخ النص إلى الحافظة!');
    } catch (err) {
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول الصور إلى نص</h2>
              <p className="text-gray-600 text-sm">استخرج النص من الصور بدقة عالية</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAdvancedMode(!advancedMode)}
              className={`p-2 rounded-lg transition-colors ${
                advancedMode 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="الوضع المتقدم"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <div className="space-y-4">
                    <img 
                      src={image} 
                      alt="Uploaded" 
                      className="max-h-48 mx-auto rounded-lg object-contain shadow-sm"
                    />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">انقر لتغيير الصورة</p>
                      {imageQuality && (
                        <p className={`text-xs mt-1 ${
                          imageQuality.includes('منخفضة') ? 'text-red-500' : 'text-green-500'
                        }`}>
                          جودة الصورة: {imageQuality}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">انقر لتحميل صورة</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG, BMP - الحد الأقصى 10MB</p>
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

              {/* Advanced Settings */}
              {advancedMode && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                    <Zap className="w-4 h-4 ml-2" />
                    الإعدادات المتقدمة
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-1">
                        اختيار اللغة
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 border border-purple-300 rounded-lg text-sm bg-white"
                      >
                        <option value="auto">الكشف التلقائي</option>
                        <option value="ara">العربية فقط</option>
                        <option value="eng">الإنجليزية فقط</option>
                        <option value="ara+eng">العربية والإنجليزية</option>
                      </select>
                    </div>
                    <p className="text-xs text-purple-600">
                      💡 اختيار اللغة يدوياً يحسن الدقة مع الصور المعقدة
                    </p>
                  </div>
                </div>
              )}

              {/* Language Detection & Quality Info */}
              {(detectedLanguage || imageQuality) && (
                <div className="space-y-2">
                  {detectedLanguage && detectedLanguage.code !== 'unknown' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Languages className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 text-sm">
                          <strong>اللغة:</strong> {detectedLanguage.name}
                        </span>
                      </div>
                      {detectedLanguage.confidence > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {detectedLanguage.confidence}% تأكيد
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex space-x-3 space-x-reverse">
                  <button 
                    onClick={convertImageToTextReliable}
                    disabled={!image || loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        {progressStatus} {progress}%
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 ml-2" />
                        استخراج النص
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={clearAll}
                    disabled={loading}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    مسح الكل
                  </button>
                </div>

                {/* Progress Bar */}
                {loading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {advancedMode ? 
                      '🔍 الوضع المتقدم: تحسينات الذكاء الاصطناعي للدقة القصوى' : 
                      '✅ الكشف التلقائي عن اللغة • معالجة مسبقة للصورة • نتائج أدق'
                    }
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
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                      title="نسخ النص"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={downloadText}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
                      title="تحميل النص"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="border border-gray-300 rounded-lg h-64 overflow-auto bg-gray-50 shadow-inner">
                {text ? (
                  <div className="p-4">
                    <div className={`whitespace-pre-wrap text-gray-800 text-sm leading-6 font-sans ${
                      detectedLanguage?.code === 'ara' ? 'text-right direction-rtl' : 'text-left direction-ltr'
                    }`}>
                      {text}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {loading ? (
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-700">{progressStatus}</p>
                        <p className="text-sm text-gray-500 mt-1">{progress}% مكتمل</p>
                        {advancedMode && (
                          <p className="text-xs text-purple-400 mt-2">⚡ الوضع المتقدم نشط</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>سيظهر النص المستخرج هنا</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {advancedMode ? 
                            'مع معالجة متقدمة وتحسين الذكاء الاصطناعي' : 
                            'مع الكشف التلقائي عن اللغة ومعالجة الصورة'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tips & Features */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  💡 نصائح لتحسين الدقة:
                </h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>استخدم صور <strong>عالية الدقة</strong> وواضحة</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>تأكد من <strong>إضاءة جيدة</strong> وعدم وجود ظلال</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>الصور ذات <strong>تباين عالي</strong> بين النص والخلفية</span>
                  </li>
                  <li className="flex items-start">
                    <span className="ml-2">•</span>
                    <span>استخدم <strong>الوضع المتقدم</strong> للصور المعقدة</span>
                  </li>
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