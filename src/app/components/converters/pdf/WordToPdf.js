// components/converters/WordToPdf.js
'use client';
import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, FileUp, Check, Settings, Zap } from 'lucide-react';

const WordToPdf = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [conversionSettings, setConversionSettings] = useState({
    pageSize: 'a4',
    orientation: 'portrait',
    quality: 'high',
    preserveFormatting: true,
    includeComments: false
  });

  const fileInputRef = useRef(null);

  // إعدادات حجم الصفحة
  const pageSizes = [
    { value: 'a4', label: 'A4', description: 'الحجم القياسي (21×29.7 سم)' },
    { value: 'letter', label: 'Letter', description: 'الحجم الأمريكي (21.6×27.9 سم)' },
    { value: 'a3', label: 'A3', description: 'الحجم الكبير (29.7×42 سم)' },
    { value: 'a5', label: 'A5', description: 'الحجم الصغير (14.8×21 سم)' },
    { value: 'legal', label: 'Legal', description: 'الحجم القانوني (21.6×35.6 سم)' }
  ];

  // أنواع الملفات المدعومة
  const supportedFormats = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word',
    'application/vnd.oasis.opendocument.text'
  ];

  // معالجة تحميل الملف
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // التحقق من نوع الملف
    const isWordFile = supportedFormats.includes(selectedFile.type) || 
                      selectedFile.name.toLowerCase().endsWith('.doc') ||
                      selectedFile.name.toLowerCase().endsWith('.docx') ||
                      selectedFile.name.toLowerCase().endsWith('.odt');

    if (!isWordFile) {
      setError('الرجاء تحميل ملف Word فقط (DOC, DOCX, ODT)');
      return;
    }

    // التحقق من حجم الملف (50MB كحد أقصى)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى 50MB');
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
    setPdfUrl(null); // إعادة تعيين أي PDF محول سابق
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

  // محاكاة تحويل Word إلى PDF
  const convertToPdf = async () => {
    if (!file) {
      setError('الرجاء تحميل ملف Word أولاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // محاكاة وقت التحويل (في التطبيق الحقيقي، استخدم مكتبة مثل libreoffice أو API)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // إنشاء PDF وهمي للعرض
      // في التطبيق الحقيقي، استخدم مكتبة مثل pdf-lib أو أرسل الملف إلى API
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
50 750 Td
(تم تحويل ملف Word إلى PDF بنجاح) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000308 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
395
%%EOF`;

      const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
    } catch (error) {
      console.error('Conversion error:', error);
      setError('حدث خطأ أثناء تحويل الملف إلى PDF. الرجاء المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  // تحميل ملف PDF
  const downloadPdf = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // إعادة تعيين كل شيء
  const clearAll = () => {
    setFile(null);
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

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">محول Word إلى PDF</h2>
              <p className="text-gray-600 text-sm">حول ملفات Word إلى PDF مع الحفاظ على التنسيق</p>
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
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FileUp className="w-8 h-8 text-blue-600" />
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
                      <p className="font-medium text-gray-700">انقر لتحميل ملف Word</p>
                      <p className="text-sm text-gray-500 mt-1">DOC, DOCX, ODT - الحد الأقصى 50MB</p>
                      <p className="text-xs text-blue-600 mt-2">💡 يدعم Microsoft Word و LibreOffice</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx,.odt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                    <FileUp className="w-4 h-4 ml-2" />
                    معلومات الملف
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
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
                      <span className="font-medium">
                        {file.type === 'application/msword' ? 'DOC' : 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' :
                         file.name.toLowerCase().endsWith('.odt') ? 'ODT' : 'Word Document'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر تعديل:</span>
                      <span className="font-medium">{formatFileDate(file.lastModified)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversion Settings */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Settings className="w-4 h-4 ml-2" />
                  إعدادات التحويل
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg mb-1">{orientation.icon}</div>
                          <span className="text-sm font-medium">{orientation.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality & Formatting */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conversionSettings.preserveFormatting}
                        onChange={(e) => updateSettings('preserveFormatting', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">الحفاظ على التنسيق الأصلي</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conversionSettings.includeComments}
                        onChange={(e) => updateSettings('includeComments', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">تضمين التعليقات والمراجعات</span>
                    </label>
                  </div>

                  {/* Quality Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جودة PDF
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
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
                  onClick={convertToPdf}
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري التحويل إلى PDF...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 ml-2" />
                      تحويل إلى PDF
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
                  
                  {pdfUrl && (
                    <button 
                      onClick={downloadPdf}
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تحميل PDF
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
                  معاينة التحويل {pdfUrl && <span className="text-green-600">(مكتمل)</span>}
                </h3>
                
                {pdfUrl ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg mb-2">تم التحويل بنجاح!</h4>
                      <p className="text-gray-600 mb-4">
                        تم تحويل ملف <strong>{file.name}</strong> إلى PDF بنجاح
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📄</div>
                          <div>
                            <strong>الحجم:</strong> {pageSizes.find(s => s.value === conversionSettings.pageSize)?.label}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🎯</div>
                          <div>
                            <strong>الاتجاه:</strong> {conversionSettings.orientation === 'portrait' ? 'عمودي' : 'أفقي'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border">
                        <h5 className="font-medium text-gray-700 mb-2">تفاصيل التحويل:</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>الحفاظ على التنسيق:</span>
                            <span className={conversionSettings.preserveFormatting ? 'text-green-600' : 'text-gray-400'}>
                              {conversionSettings.preserveFormatting ? 'مفعّل' : 'غير مفعّل'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>التعليقات:</span>
                            <span className={conversionSettings.includeComments ? 'text-green-600' : 'text-gray-400'}>
                              {conversionSettings.includeComments ? 'مضمنة' : 'غير مضمنة'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>الجودة:</span>
                            <span className="text-blue-600">
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
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p>سيظهر معاينة PDF هنا بعد التحويل</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {file ? 
                          `جاهز لتحويل ${file.name} إلى PDF` : 
                          'قم بتحميل ملف Word لبدء التحويل'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features & Benefits */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  ✨ مزايا التحويل إلى PDF:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>تنسيق ثابت</strong> عبر جميع الأجهزة</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>أمان أفضل</strong> للمستندات المهمة</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>حجم ملف أصغر</strong> للمشاركة</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>متوافق مع جميع الأنظمة</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>يدعم التوقيع الإلكتروني</strong></span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />
                      <span><strong>مثالي للطباعة والمشاركة</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-3">📋 صيغ Word المدعومة:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>DOC (Microsoft Word 97-2003)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>DOCX (Microsoft Word 2007+)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ODT (OpenDocument Text)</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>RTF (Rich Text Format)</span>
                  </div>
                </div>
              </div>

              {/* Usage Tips */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-medium text-orange-800 mb-3">💡 نصائح للتحويل الأمثل:</h4>
                <ul className="text-sm text-orange-700 space-y-2 list-disc list-inside">
                  <li>تأكد من أن الملف غير محمي بكلمة مرور</li>
                  <li>استخدم "جودة عالية" للمستندات الرسمية</li>
                  <li>تفعيل "الحفاظ على التنسيق" للمستندات المعقدة</li>
                  <li>تحقق من الملف النهائي قبل المشاركة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordToPdf;