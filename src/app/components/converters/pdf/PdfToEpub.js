// components/converters/PdfToEpub.js
'use client';
import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, Book, Check, Settings, Zap } from 'lucide-react';

const PdfToEpub = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [epubUrl, setEpubUrl] = useState(null);
  const [error, setError] = useState('');
  const [conversionSettings, setConversionSettings] = useState({
    layout: 'reflowable',
    quality: 'high',
    includeImages: true,
    preserveFormatting: true,
    generateTOC: true,
    language: 'ar'
  });

  const fileInputRef = useRef(null);

  // معالجة تحميل الملف
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // التحقق من نوع الملف
    const isPdfFile = selectedFile.type === 'application/pdf' || 
                     selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdfFile) {
      setError('الرجاء تحميل ملف PDF فقط');
      return;
    }

    // التحقق من حجم الملف (30MB كحد أقصى)
    if (selectedFile.size > 30 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى 30MB');
      return;
    }

    setError('');
    setFile({
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified
    });
    setEpubUrl(null);
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // تنسيق تاريخ الملف
  const formatFileDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // محاكاة تحويل PDF إلى EPUB
  const convertToEpub = async () => {
    if (!file) {
      setError('الرجاء تحميل ملف PDF أولاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // محاكاة وقت التحويل
      await new Promise(resolve => setTimeout(resolve, 4000));

      // إنشاء EPUB وهمي للعرض
      const epubContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">urn:uuid:${Date.now()}</dc:identifier>
    <dc:title>${file.name.replace('.pdf', '')}</dc:title>
    <dc:language>${conversionSettings.language}</dc:language>
    <dc:creator>PDF to EPUB Converter</dc:creator>
  </metadata>
  <manifest>
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="toc"/>
    <itemref idref="content"/>
  </spine>
</package>`;

      const epubBlob = new Blob([epubContent], { type: 'application/epub+zip' });
      const url = URL.createObjectURL(epubBlob);
      setEpubUrl(url);
      
    } catch (error) {
      console.error('Conversion error:', error);
      setError('حدث خطأ أثناء تحويل الملف إلى EPUB. الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // تحميل ملف EPUB
  const downloadEpub = () => {
    if (epubUrl) {
      const a = document.createElement('a');
      a.href = epubUrl;
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}.epub`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // إعادة تعيين كل شيء
  const clearAll = () => {
    setFile(null);
    setEpubUrl(null);
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
    if (epubUrl) {
      URL.revokeObjectURL(epubUrl);
    }
    onClose();
  };

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول PDF إلى EPUB</h2>
              <p className="text-gray-600 text-sm">حول ملفات PDF إلى كتب إلكترونية EPUB</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload & Settings Section */}
            <div className="space-y-4">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFileDate(file.lastModified)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">انقر لتغيير الملف</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">انقر لتحميل ملف PDF</p>
                      <p className="text-sm text-gray-500 mt-1">PDF - الحد الأقصى 30MB</p>
                      <p className="text-xs text-purple-600 mt-2">📖 مثالي للكتب والمستندات</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
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

              {/* File Info */}
              {file && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 ml-2" />
                    معلومات الملف
                  </h3>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex justify-between">
                      <span>اسم الملف:</span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحجم:</span>
                      <span className="font-medium">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النوع:</span>
                      <span className="font-medium">PDF Document</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الصفحات:</span>
                      <span className="font-medium">~{Math.ceil(file.size / 50000)} صفحة</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversion Settings */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Settings className="w-4 h-4 ml-2" />
                  إعدادات EPUB
                </h3>
                
                <div className="space-y-4">
                  {/* Layout Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع التخطيط
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      {[
                        { value: 'reflowable', label: 'قابل للتكيف', description: 'يتكيف مع حجم الشاشة' },
                        { value: 'fixed', label: 'ثابت', description: 'يحافظ على التصميم الأصلي' }
                      ].map(layout => (
                        <button
                          key={layout.value}
                          onClick={() => updateSettings('layout', layout.value)}
                          className={`flex-1 p-3 rounded-lg border-2 transition-all text-center ${
                            conversionSettings.layout === layout.value 
                              ? 'border-purple-500 bg-purple-50 text-purple-700' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-sm font-medium block">{layout.label}</span>
                          <span className="text-xs text-gray-500">{layout.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لغة الكتاب
                    </label>
                    <select
                      value={conversionSettings.language}
                      onChange={(e) => updateSettings('language', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conversionSettings.includeImages}
                        onChange={(e) => updateSettings('includeImages', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">تضمين الصور</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conversionSettings.preserveFormatting}
                        onChange={(e) => updateSettings('preserveFormatting', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">الحفاظ على التنسيق</span>
                    </label>

                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conversionSettings.generateTOC}
                        onChange={(e) => updateSettings('generateTOC', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">إنشاء فهرس المحتويات</span>
                    </label>
                  </div>

                  {/* Quality Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جودة التحويل
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
                              ? 'border-purple-500 bg-purple-50 text-purple-700' 
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
                  onClick={convertToEpub}
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري التحويل إلى EPUB...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 ml-2" />
                      تحويل إلى EPUB
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
                  
                  {epubUrl && (
                    <button 
                      onClick={downloadEpub}
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تحميل EPUB
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview & Info Section */}
            <div className="space-y-6">
              {/* Conversion Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  معاينة التحويل {epubUrl && <span className="text-green-600">(مكتمل)</span>}
                </h3>
                
                {epubUrl ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">تم التحويل بنجاح!</h4>
                      <p className="text-gray-600 mb-4">
                        تم تحويل ملف <strong>{file.name}</strong> إلى EPUB بنجاح
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📚</div>
                          <div>
                            <strong>النوع:</strong> {conversionSettings.layout === 'reflowable' ? 'قابل للتكيف' : 'ثابت'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🌍</div>
                          <div>
                            <strong>اللغة:</strong> {conversionSettings.language === 'ar' ? 'العربية' : 'English'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border">
                        <h5 className="font-medium text-gray-700 mb-2">تفاصيل EPUB:</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>الصور:</span>
                            <span className={conversionSettings.includeImages ? 'text-green-600' : 'text-gray-400'}>
                              {conversionSettings.includeImages ? 'مضمنة' : 'غير مضمنة'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>التنسيق:</span>
                            <span className={conversionSettings.preserveFormatting ? 'text-green-600' : 'text-gray-400'}>
                              {conversionSettings.preserveFormatting ? 'محفوظ' : 'مبسط'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>فهرس المحتويات:</span>
                            <span className={conversionSettings.generateTOC ? 'text-green-600' : 'text-gray-400'}>
                              {conversionSettings.generateTOC ? 'مضاف' : 'غير مضاف'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>الجودة:</span>
                            <span className="text-purple-600">
                              {conversionSettings.quality === 'high' ? 'عالية' : 
                               conversionSettings.quality === 'medium' ? 'متوسطة' : 'منخفضة'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg min-h-48 text-gray-400">
                    <div className="text-center">
                      <Book className="w-12 h-12 mx-auto mb-2" />
                      <p>سيظهر معاينة EPUB هنا بعد التحويل</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {file ? 
                          `جاهز لتحويل ${file.name} إلى EPUB` : 
                          'قم بتحميل ملف PDF لبدء التحويل'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features & Benefits */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                  ✨ مزايا EPUB:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>متوافق مع جميع قارئات الكتب</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>يتكيف مع أحجام الشاشات المختلفة</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>يدعم الإشارات المرجعية والملاحظات</strong></span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>حجم ملف أصغر</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>يدعم الخطوط القابلة للتغيير</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>مثالي للقراءة الطويلة</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Readers */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-3">📱 التطبيقات المدعومة:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-blue-700">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Apple Books</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Google Play Books</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Amazon Kindle</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Kobo</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Calibre</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>FBReader</span>
                  </div>
                </div>
              </div>

              {/* Usage Tips */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-medium text-orange-800 mb-3">💡 نصائح للتحويل الأمثل:</h4>
                <ul className="text-sm text-orange-700 space-y-2 list-disc list-inside">
                  <li>استخدم "قابل للتكيف" للكتب النصية</li>
                  <li>استخدم "ثابت" للكتب المصورة والمجلات</li>
                  <li>تفعيل "فهرس المحتويات" للكتب الطويلة</li>
                  <li>اختر الجودة العالية للكتب المهمة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToEpub;