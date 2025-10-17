// components/converters/ImageToIco.js
'use client';
import { useState, useRef, useEffect } from 'react';
import { Upload, Download, X, Settings, Image as ImageIcon, Check, Zap, Star } from 'lucide-react';

const ImageToIco = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [icoUrl, setIcoUrl] = useState(null);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    size: 256, // تم التغيير إلى 256 افتراضيًا
    preserveAspectRatio: true,
    quality: 'high',
    backgroundColor: 'transparent',
    autoHD: true // إضافة وضع HD التلقائي
  });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // أحجام ICO الشائعة مع تمييز الحجم 256
  const icoSizes = [
    { value: 16, label: '16x16 (صغير)', description: 'للاستخدام في الأماكن الضيقة' },
    { value: 32, label: '32x32 (متوسط)', description: 'الحجم القياسي للأيقونات' },
    { value: 48, label: '48x48 (كبير)', description: 'مناسب لمعظم الاستخدامات' },
    { value: 64, label: '64x64 (كبير جداً)', description: 'للعرض عالي الدقة' },
    { value: 128, label: '128x128 (ضخم)', description: 'لشاشات عالية الدقة' },
    { value: 256, label: '256x256 (HD)', description: 'لأحدث إصدارات Windows', recommended: true }
  ];

  // عند تحميل الصورة، تطبيق الإعدادات التلقائية
  useEffect(() => {
    if (image && settings.autoHD) {
      // تطبيق الإعدادات التلقائية للجودة العالية
      setSettings(prev => ({
        ...prev,
        size: 256,
        preserveAspectRatio: true,
        quality: 'high',
        backgroundColor: 'transparent'
      }));
    }
  }, [image, settings.autoHD]);

  // معالجة تحميل الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم. الرجاء تحميل صورة (JPG, PNG, GIF, BMP, WebP)');
      return;
    }

    // التحقق من حجم الملف (10MB كحد أقصى)
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى 10MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
      setImage(e.target.result);
      setIcoUrl(null); // إعادة تعيين أي أيقونة محولة سابقة
    };
    reader.readAsDataURL(file);
  };

  // تحسين الصورة للجودة العالية
  const enhanceImageForHD = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // زيادة الدقة للجودة العالية
        const scale = settings.size === 256 ? 1.5 : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // تطبيق تحسينات للجودة العالية
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      img.src = imageSrc;
    });
  };

  // تحويل الصورة إلى ICO
  const convertToIco = async () => {
    if (!image) {
      setError('الرجاء تحميل صورة أولاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // تحسين الصورة للجودة العالية إذا كان الوضع التلقائي مفعل
      const processedImage = settings.autoHD ? await enhanceImageForHD(image) : image;

      // إنشاء عنصر صورة
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // تعيين حجم Canvas بناءً على الإعدادات
          const size = settings.size;
          canvas.width = size;
          canvas.height = size;

          // تعيين خلفية شفافة إذا تم اختيارها
          if (settings.backgroundColor === 'transparent') {
            ctx.clearRect(0, 0, size, size);
          } else {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(0, 0, size, size);
          }

          // إعدادات الجودة العالية
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // حساب الأبعاد مع الحفاظ على نسبة العرض إلى الارتفاع إذا مطلوب
          let drawWidth = size;
          let drawHeight = size;
          let offsetX = 0;
          let offsetY = 0;

          if (settings.preserveAspectRatio) {
            const ratio = Math.min(size / img.width, size / img.height);
            drawWidth = img.width * ratio;
            drawHeight = img.height * ratio;
            offsetX = (size - drawWidth) / 2;
            offsetY = (size - drawHeight) / 2;
          }

          // رسم الصورة على Canvas بجودة عالية
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

          // تحويل Canvas إلى Blob ثم إلى ICO
          canvas.toBlob((blob) => {
            if (!blob) {
              throw new Error('فشل في إنشاء الأيقونة');
            }

            // إنشاء URL للـ Blob
            const url = URL.createObjectURL(blob);
            setIcoUrl(url);
            setLoading(false);
          }, 'image/png', 1.0); // جودة 100%

        } catch (canvasError) {
          console.error('Canvas error:', canvasError);
          setError('حدث خطأ أثناء معالجة الصورة');
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError('فشل تحميل الصورة');
        setLoading(false);
      };

      img.src = processedImage;

    } catch (error) {
      console.error('Conversion error:', error);
      setError('حدث خطأ أثناء التحويل: ' + error.message);
      setLoading(false);
    }
  };

  // تحميل ملف ICO
  const downloadIco = () => {
    if (icoUrl) {
      const a = document.createElement('a');
      a.href = icoUrl;
      a.download = `icon-hd-${settings.size}x${settings.size}-${Date.now()}.ico`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // تفعيل الوضع التلقائي HD
  const enableAutoHD = () => {
    setSettings({
      size: 256,
      preserveAspectRatio: true,
      quality: 'high',
      backgroundColor: 'transparent',
      autoHD: true
    });
  };

  // إعادة تعيين كل شيء
  const clearAll = () => {
    setImage(null);
    setOriginalImage(null);
    setIcoUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تحديث الإعدادات
  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
      // إذا تم تغيير الحجم يدويًا، تعطيل الوضع التلقائي
      ...(key === 'size' && value !== 256 && { autoHD: false })
    }));
  };

  // تنظيف الذاكرة عند الإغلاق
  const handleClose = () => {
    if (icoUrl) {
      URL.revokeObjectURL(icoUrl);
    }
    onClose();
  };

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول الصور إلى أيقونات</h2>
              <p className="text-gray-600 text-sm">حول أي صورة إلى أيقونة ICO بجودة HD تلقائيًا</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1 space-y-4">
              {/* Auto HD Banner */}
              {settings.autoHD && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">وضع HD التلقائي</span>
                  </div>
                  <p className="text-sm opacity-90">
                    الإعدادات المثالية مفعلة: 256×256 - جودة عالية - خلفية شفافة
                  </p>
                </div>
              )}

              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <div className="space-y-4">
                    <img 
                      src={image} 
                      alt="Uploaded" 
                      className="max-h-48 mx-auto rounded-lg object-contain shadow-sm"
                    />
                    <p className="text-sm text-gray-600">انقر لتغيير الصورة</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">انقر لتحميل صورة</p>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF, BMP, WebP - الحد الأقصى 10MB</p>
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 text-red-600">⚠️</div>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Quick Action - Auto HD */}
              {!settings.autoHD && (
                <button
                  onClick={enableAutoHD}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center shadow-sm"
                >
                  <Zap className="w-4 h-4 ml-2" />
                  تفعيل الوضع التلقائي HD
                </button>
              )}

              {/* Settings */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Settings className="w-4 h-4 ml-2" />
                  {settings.autoHD ? 'الإعدادات التلقائية' : 'إعدادات الأيقونة'}
                </h3>
                
                <div className="space-y-4">
                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حجم الأيقونة
                    </label>
                    <select
                      value={settings.size}
                      onChange={(e) => updateSettings('size', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={settings.autoHD}
                    >
                      {icoSizes.map(size => (
                        <option key={size.value} value={size.value} className={size.recommended ? 'bg-green-50 text-green-700' : ''}>
                          {size.label} {size.recommended && '⭐'}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.autoHD ? 
                        'الإعداد التلقائي: 256×256 بيكسل (جودة HD)' : 
                        icoSizes.find(s => s.value === settings.size)?.description
                      }
                    </p>
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.preserveAspectRatio}
                        onChange={(e) => updateSettings('preserveAspectRatio', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={settings.autoHD}
                      />
                      <span className="text-sm text-gray-700">الحفاظ على نسبة العرض إلى الارتفاع</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.autoHD ? 
                        'مفعل تلقائيًا للحصول على أفضل نتيجة' : 
                        'سيتم إضافة خلفية شفافة للحفاظ على الشكل الأصلي'
                      }
                    </p>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لون الخلفية
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      {[
                        { value: 'transparent', label: 'شفاف', color: 'bg-checkerboard' },
                        { value: '#ffffff', label: 'أبيض', color: 'bg-white border' },
                        { value: '#000000', label: 'أسود', color: 'bg-black' },
                        { value: '#f3f4f6', label: 'رمادي', color: 'bg-gray-100' }
                      ].map(bg => (
                        <button
                          key={bg.value}
                          onClick={() => updateSettings('backgroundColor', bg.value)}
                          disabled={settings.autoHD}
                          className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                            settings.backgroundColor === bg.value 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200'
                          } ${bg.color} ${bg.value === '#ffffff' ? 'border-gray-300' : ''} ${
                            settings.autoHD ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <span className="text-xs text-gray-700 block">{bg.label}</span>
                        </button>
                      ))}
                    </div>
                    {settings.autoHD && (
                      <p className="text-xs text-green-600 mt-1">
                        ⭐ الخلفية الشفافة مفعلة تلقائيًا لأفضل جودة
                      </p>
                    )}
                  </div>

                  {/* Auto HD Toggle */}
                  <div>
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoHD}
                        onChange={(e) => updateSettings('autoHD', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">الوضع التلقائي HD</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      التطبيق التلقائي للإعدادات المثالية (256×256 - جودة عالية)
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={convertToIco}
                  disabled={!image || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      {settings.autoHD ? 'جاري إنشاء أيقونة HD...' : 'جاري إنشاء الأيقونة...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 ml-2" />
                      {settings.autoHD ? 'إنشاء أيقونة HD' : 'إنشاء أيقونة ICO'}
                    </>
                  )}
                </button>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    onClick={clearAll}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    مسح الكل
                  </button>
                  
                  {icoUrl && (
                    <button 
                      onClick={downloadIco}
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تحميل {settings.autoHD ? 'ICO HD' : 'ICO'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Original Image Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">الصورة الأصلية</h3>
                {image ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg min-h-48">
                    <img 
                      src={image} 
                      alt="Original" 
                      className="max-h-40 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg min-h-48 text-gray-400">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>سيظهر معاينة الصورة هنا</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ICO Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  معاينة الأيقونة {settings.autoHD && <span className="text-green-600">(HD)</span>}
                </h3>
                
                {icoUrl ? (
                  <div className="space-y-4">
                    {/* Selected Size Preview */}
                    <div className="text-center">
                      <div className="inline-block p-4 bg-checkerboard rounded-lg border-2 border-green-200">
                        <img 
                          src={icoUrl} 
                          alt="ICO Preview" 
                          className="mx-auto"
                          style={{ 
                            width: `${Math.min(128, settings.size)}px`,
                            height: `${Math.min(128, settings.size)}px`
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        الحجم: {settings.size} × {settings.size} بيكسل
                        {settings.autoHD && <span className="text-green-600 font-medium"> ⭐ جودة HD</span>}
                      </p>
                    </div>

                    {/* Multiple Sizes Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">معاينة بمقاييس مختلفة:</h4>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {[16, 32, 48, 64, 128, 256].filter(size => size <= settings.size).map(size => (
                          <div key={size} className="text-center">
                            <div className={`inline-block p-2 bg-checkerboard rounded border ${
                              size === 256 ? 'border-2 border-green-400' : 'border-gray-200'
                            }`}>
                              <img 
                                src={icoUrl} 
                                alt={`${size}x${size}`}
                                width={Math.min(64, size)}
                                height={Math.min(64, size)}
                                className="rounded"
                              />
                            </div>
                            <p className={`text-xs mt-1 ${
                              size === 256 ? 'text-green-600 font-medium' : 'text-gray-500'
                            }`}>
                              {size}×{size} {size === 256 && '⭐'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg min-h-48 text-gray-400">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>سيظهر معاينة الأيقونة هنا بعد التحويل</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {settings.autoHD ? 
                          'الحجم التلقائي: 256×256 بيكسل (جودة HD)' : 
                          `الحجم المحدد: ${settings.size} × ${settings.size}`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features & Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  💡 ميزات الوضع التلقائي HD:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>256×256 بيكسل</strong> - الدقة القصوى</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>جودة HD</strong> - معالجة متقدمة للصورة</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>خلفية شفافة</strong> - للحصول على أفضل مظهر</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>مناسب لـ Windows 10/11</strong> - أحدث الإصدارات</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>تحسين تلقائي</strong> - لا حاجة للإعدادات اليدوية</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0 text-green-500" />
                      <span><strong>متوافق مع جميع التطبيقات</strong> - شفافية كاملة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Preview */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Checkerboard Background Style */}
      <style jsx>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
};

export default ImageToIco;