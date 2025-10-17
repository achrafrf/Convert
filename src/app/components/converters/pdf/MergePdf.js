// components/converters/MergePdf.js
'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, Trash2, Download, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

const MergePdf = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // معالجة سحب وإفلات الملفات
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // معالجة اختيار الملفات
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    // إعادة تعيين قيمة input للسماح باختيار نفس الملف مرة أخرى
    e.target.value = '';
  };

  const handleFiles = (newFiles) => {
    const pdfFiles = newFiles.filter(file => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        alert(`File "${file.name}" is not a PDF. Please select PDF files only.`);
        return false;
      }
      return true;
    });
    
    if (pdfFiles.length === 0) return;

    // التحقق من عدم تجاوز الحد الأقصى
    if (files.length + pdfFiles.length > 10) {
      alert('You can only merge up to 10 PDF files at once.');
      return;
    }

    const filesWithPreview = pdfFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
    setError(null);
  };

  // إزالة ملف
  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // نقل ملف لأعلى
  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    setFiles(newFiles);
  };

  // نقل ملف لأسفل
  const moveFileDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  // قراءة ملف كـ ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // دمج PDFs
  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      // إنشاء مستند PDF جديد
      const mergedPdf = await PDFDocument.create();

      // دمج جميع PDFs
      for (const fileObj of files) {
        try {
          // قراءة ملف PDF
          const pdfBytes = await readFileAsArrayBuffer(fileObj.file);
          const pdf = await PDFDocument.load(pdfBytes);
          
          // نسخ جميع الصفحات من PDF الحالي إلى PDF المدمج
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(page => mergedPdf.addPage(page));
          
        } catch (err) {
          console.error(`Error processing file ${fileObj.name}:`, err);
          throw new Error(`Failed to process "${fileObj.name}". The file may be corrupted or protected.`);
        }
      }

      // حفظ PDF المدمج
      const mergedPdfBytes = await mergedPdf.save();
      
      // إنشاء Blob وعنوان URL للتحميل
      const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(mergedPdfBlob);
      setMergedPdfUrl(url);
      
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setError(error.message || 'Failed to merge PDF files. Please try again.');
    } finally {
      setIsMerging(false);
    }
  };

  // تحميل الملف المدمج
  const downloadMergedPdf = () => {
    if (mergedPdfUrl) {
      const a = document.createElement('a');
      a.href = mergedPdfUrl;
      a.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // تنظيف الذاكرة بعد التحميل
      setTimeout(() => {
        URL.revokeObjectURL(mergedPdfUrl);
      }, 1000);
    }
  };

  // إعادة تعيين
  const resetConverter = () => {
    // تنظيف جميع URLs
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }
    
    setFiles([]);
    setMergedPdfUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تنظيف الذاكرة عند إغلاق المكون
  const handleClose = () => {
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }
    onClose();
  };

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Merge PDF Files</h2>
                <p className="text-purple-100">Combine multiple PDFs into one document</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!mergedPdfUrl ? (
            <>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your PDF files here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to select files from your computer
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept=".pdf,application/pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Select PDF Files</span>
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  Supported format: PDF • Max files: 10
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Files List */}
              {files.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selected Files ({files.length})
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {files.map((file, index) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <button
                            onClick={() => moveFileUp(index)}
                            disabled={index === 0}
                            className={`p-2 rounded-lg ${
                              index === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveFileDown(index)}
                            disabled={index === files.length - 1}
                            className={`p-2 rounded-lg ${
                              index === files.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Merge Button */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetConverter}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                    
                    <button
                      onClick={mergePdfs}
                      disabled={isMerging || files.length < 2}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 ${
                        isMerging || files.length < 2
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isMerging ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Merging {files.length} PDFs...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>Merge PDF Files</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Tips:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Use the arrows to rearrange the order of pages</li>
                      <li>• All PDFs will be merged in the order shown above</li>
                      <li>• Protected or corrupted PDFs may not work</li>
                      <li>• Process happens entirely in your browser - your files stay private</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Screen */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Successfully Merged!
              </h3>
              <p className="text-gray-600 mb-6">
                Your {files.length} PDF files have been combined into one document.
              </p>

              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={downloadMergedPdf}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                
                <button
                  onClick={resetConverter}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Merge More</span>
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">Merged Files:</h4>
                <div className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={file.id} className="flex items-center space-x-2 justify-center">
                      <span className="text-gray-400 w-6 text-right">{index + 1}.</span>
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="text-left flex-1">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MergePdf;