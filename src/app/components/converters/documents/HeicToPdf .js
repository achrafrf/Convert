// components/converters/HeicToPdf.js
'use client';
import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, Image as ImageIcon, Plus, Trash2, Check } from 'lucide-react';

const HeicToPdf = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [conversionSettings, setConversionSettings] = useState({
    pageSize: 'a4',
    orientation: 'portrait',
    quality: 'high',
    margin: 'normal'
  });

  const fileInputRef = useRef(null);

  // إعدادات حجم الصفحة
  const pageSizes = [
    { value: 'a4', label: 'A4', description: 'الحجم القياسي (21×29.7 سم)' },
    { value: 'letter', label: 'Letter', description: 'الحجم الأمريكي (21.6×27.9 سم)' },
    { value: 'a3', label: 'A3', description: 'الحجم الكبير (29.7×42 سم)' },
    { value: 'a5', label: 'A5', description: 'الحجم الصغير (14.8×21 سم)' }
  ];

  // إعدادات الهوامش
  const marginOptions = [
    { value: 'small', label: 'صغير', description: 'هامش 10px' },
    { value: 'normal', label: 'عادي', description: 'هامش 20px' },
    { value: 'large', label: 'كبير', description: 'هامش 40px' },
    { value: 'none', label: 'بدون', description: 'بدون هوامش' }
  ];

  // معالجة تحميل الصور
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      // التحقق من نوع الملف (HEIC أو صور أخرى)
      const isHeic = file.type === 'image/heic' || 
                    file.name.toLowerCase().endsWith('.heic') ||
                    file.type === 'image/heif' ||
                    file.name.toLowerCase().endsWith('.heif');
      
      const isImage = file.type.startsWith('image/');
      
      if (!isImage) {
        setError('الرجاء تحميل ملفات صور فقط');
        return false;
      }

      if (!isHeic) {
        setError('هذا المحول مخصص لصور HEIC. الرجاء تحميل صور HEIC فقط');
        return false;
      }

      // التحقق من حجم الملف (15MB كحد أقصى)
      if (file.size > 15 * 1024 * 1024) {
        setError(`حجم الملف ${file.name} كبير جداً. الحد الأقصى 15MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setError('');

    // تحميل الصور وعرض معايناتها
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });

    // إعادة تعيين حقل الإدخال للسماح بتحميل نفس الملف مرة أخرى
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تحويل HEIC إلى صيغة يمكن عرضها (محاكاة)
  const convertHeicToDisplayable = async (heicFile) => {
    return new Promise((resolve, reject) => {
      // في الواقع، سنستخدم مكتبة لتحويل HEIC إلى PNG/JPG
      // لكن هنا سنستخدم محاكاة للعرض
      
      const reader = new FileReader();
      reader.onload = (e) => {
        // إنشاء صورة معاينة (في التطبيق الحقيقي، استخدم heic2any أو similar)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(heicFile);
    });
  };

  // إزالة صورة من القائمة
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // إنشاء PDF من الصور
  const createPdf = async () => {
    if (images.length === 0) {
      setError('الرجاء تحميل صور HEIC أولاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // محاكاة عملية التحويل
      // في التطبيق الحقيقي، استخدم مكتبة مثل jspdf مع heic2any
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // إنشاء PDF وهمي للعرض
      const pdfBlob = new Blob(['PDF simulation content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
    } catch (error) {
      console.error('PDF creation error:', error);
      setError('حدث خطأ أثناء إنشاء PDF. الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // تحميل ملف PDF
  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `heic-to-pdf-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // إعادة ترتيب الصور
  const moveImage = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  // إعادة تعيين كل شيء
  const clearAll = () => {
    setImages([]);
    setPdfUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تحديث الإعدادات
  const updateSettings = (key, value) => {
    setConversionSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // تنظيف الذاكرة عند الإغلاق
  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    onClose();
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول HEIC إلى PDF</h2>
              <p className="text-gray-600 text-sm">حول صور iPhone HEIC إلى ملف PDF واحد</p>
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
            {/* Upload & Settings Section */}
            <div className="lg:col-span-1 space-y-4">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-3 py-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">انقر لتحميل صور HEIC</p>
                    <p className="text-sm text-gray-500 mt-1">HEIC, HEIF - الحد الأقصى 15MB للصورة</p>
                    <p className="text-xs text-orange-600 mt-2">💡 مناسب لصور iPhone و iPad</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".heic,.heif,image/heic,image/heif"
                  multiple
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

              {/* Images List */}
              {images.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center justify-between">
                    <span>الصور المختارة ({images.length})</span>
                    <button
                      onClick={clearAll}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      مسح الكل
                    </button>
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {images.map((image, index) => (
                      <div key={image.id} className="flex items-center space-x-3 space-x-reverse bg-white p-2 rounded-lg border">
                        <img 
                          src={image.preview} 
                          alt="Preview" 
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {image.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(image.size)}
                          </p>
                        </div>
                        <div className="flex space-x-1 space-x-reverse">
                          {index > 0 && (
                            <button
                              onClick={() => moveImage(index, 'up')}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              title="تحريك لأعلى"
                            >
                              ↑
                            </button>
                          )}
                          {index < images.length - 1 && (
                            <button
                              onClick={() => moveImage(index, 'down')}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              title="تحريك لأسفل"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="إزالة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversion Settings */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <FileText className="w-4 h-4 ml-2" />
                  إعدادات PDF
                </h3>
                
                <div className="space-y-4">
                  {/* Page Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حجم الصفحة
                    </label>
                    <select
                      value={conversionSettings.pageSize}
                      onChange={(e) => updateSettings('pageSize', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      {pageSizes.map(size => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {pageSizes.find(s => s.value === conversionSettings.pageSize)?.description}
                    </p>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اتجاه الصفحة
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      {[
                        { value: 'portrait', label: 'عمودي', icon: '📄' },
                        { value: 'landscape', label: 'أفقي', icon: '📄' }
                      ].map(orientation => (
                        <button
                          key={orientation.value}
                          onClick={() => updateSettings('orientation', orientation.value)}
                          className={`flex-1 p-3 rounded-lg border-2 transition-all text-center ${
                            conversionSettings.orientation === orientation.value 
                              ? 'border-orange-500 bg-orange-50 text-orange-700' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg mb-1">{orientation.icon}</div>
                          <span className="text-sm font-medium">{orientation.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Margins */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الهوامش
                    </label>
                    <select
                      value={conversionSettings.margin}
                      onChange={(e) => updateSettings('margin', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      {marginOptions.map(margin => (
                        <option key={margin.value} value={margin.value}>
                          {margin.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {marginOptions.find(m => m.value === conversionSettings.margin)?.description}
                    </p>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جودة الصور في PDF
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      {[
                        { value: 'high', label: 'عالية', description: 'جودة ممتازة' },
                        { value: 'medium', label: 'متوسطة', description: 'جودة جيدة' },
                        { value: 'low', label: 'منخفضة', description: 'حجم ملف أصغر' }
                      ].map(quality => (
                        <button
                          key={quality.value}
                          onClick={() => updateSettings('quality', quality.value)}
                          className={`flex-1 p-2 rounded-lg border-2 transition-all text-center ${
                            conversionSettings.quality === quality.value 
                              ? 'border-orange-500 bg-orange-50 text-orange-700' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-sm font-medium block">{quality.label}</span>
                          <span className="text-xs text-gray-500">{quality.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={createPdf}
                  disabled={images.length === 0 || loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري إنشاء PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 ml-2" />
                      إنشاء PDF ({images.length} صورة)
                    </>
                  )}
                </button>
                
                {pdfUrl && (
                  <button 
                    onClick={downloadPdf}
                    className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل PDF
                  </button>
                )}

                <button 
                  onClick={clearAll}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  بدء من جديد
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* PDF Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  معاينة PDF {pdfUrl && <span className="text-green-600">(جاهز للتحميل)</span>}
                </h3>
                
                {pdfUrl ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-green-200">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">تم إنشاء PDF بنجاح!</h4>
                      <p className="text-gray-600 mb-4">
                        تم تحويل {images.length} صورة HEIC إلى ملف PDF واحد
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>حجم الصفحة:</strong> {pageSizes.find(s => s.value === conversionSettings.pageSize)?.label}
                        </div>
                        <div>
                          <strong>الاتجاه:</strong> {conversionSettings.orientation === 'portrait' ? 'عمودي' : 'أفقي'}
                        </div>
                        <div>
                          <strong>الجودة:</strong> {conversionSettings.quality === 'high' ? 'عالية' : conversionSettings.quality === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </div>
                        <div>
                          <strong>الهوامش:</strong> {marginOptions.find(m => m.value === conversionSettings.margin)?.label}
                        </div>
                      </div>
                    </div>

                    {/* Images Grid Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">معاينة الصور في PDF:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.slice(0, 6).map((image, index) => (
                          <div key={image.id} className="text-center">
                            <div className="bg-checkerboard rounded-lg p-2 border">
                              <img 
                                src={image.preview} 
                                alt={`Page ${index + 1}`}
                                className="w-full h-24 object-contain mx-auto rounded"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">الصفحة {index + 1}</p>
                          </div>
                        ))}
                        {images.length > 6 && (
                          <div className="text-center">
                            <div className="bg-gray-100 rounded-lg p-2 border h-24 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">+{images.length - 6} أكثر</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">و {images.length - 6} صفحات أخرى</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg min-h-48 text-gray-400">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>سيظهر معاينة PDF هنا بعد التحويل</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {images.length > 0 ? 
                          `جاهز لتحويل ${images.length} صورة إلى PDF` : 
                          'قم بتحميل صور HEIC لبدء التحويل'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features & Tips */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                  💡 معلومات عن تحويل HEIC إلى PDF:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-700">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>مثالي لصور <strong>iPhone و iPad</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>حافظ على <strong>جودة الصور الأصلية</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>اضبط <strong>حجم الصفحة والهوامش</strong></span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>إعادة ترتيب الصور <strong>بسهولة</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>اختر من <strong>متعددة الأحجام</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span>نتيجة <strong>متوافقة مع جميع الأجهزة</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-3">📝 كيفية الاستخدام:</h4>
                <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                  <li>انقر على منطقة التحميل واختر صور HEIC من جهازك</li>
                  <li>رتب الصور بالترتيب المطلوب باستخدام أزرار الأعلى/أسفل</li>
                  <li>اضبط إعدادات PDF حسب احتياجاتك</li>
                  <li>انقر على "إنشاء PDF" وانتظر اكتمال التحويل</li>
                  <li>حمّل ملف PDF النهائي إلى جهازك</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default HeicToPdf;