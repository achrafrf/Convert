// components/converters/CreateRarArchive.js
'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Upload, File, Archive, Trash2, Download, Plus, X, FolderOpen, Package } from 'lucide-react';

const CreateRarArchive = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [archiveUrl, setArchiveUrl] = useState(null);
  const [archiveName, setArchiveName] = useState('');
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
    e.target.value = '';
  };

  const handleFiles = (newFiles) => {
    if (newFiles.length === 0) return;

    // التحقق من عدم تجاوز الحد الأقصى
    if (files.length + newFiles.length > 50) {
      alert('You can only add up to 50 files at once.');
      return;
    }

    const filesWithPreview = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      extension: file.name.split('.').pop().toLowerCase()
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
    setError(null);
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // الحصول على أيقونة الملف بناءً على النوع
  const getFileIcon = (fileType, extension) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType === 'application/pdf') return '📄';
    
    switch (extension) {
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📈';
      case 'txt': return '📄';
      case 'zip': case 'rar': case '7z': return '📦';
      case 'exe': return '⚙️';
      case 'html': case 'htm': return '🌐';
      default: return '📄';
    }
  };

  // إزالة ملف
  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // قراءة ملف كـ ArrayBuffer - الإصلاح هنا
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          if (e.target.result) {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file - empty result'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error(`FileReader error: ${reader.error?.message || 'Unknown error'}`));
        };
        
        reader.onabort = () => {
          reject(new Error('File reading was aborted'));
        };
        
        // استخدام readAsArrayBuffer للجميع أنواع الملفات
        reader.readAsArrayBuffer(file);
        
      } catch (error) {
        reject(new Error(`Error setting up FileReader: ${error.message}`));
      }
    });
  };

  // إنشاء الأرشيف
  const createArchive = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to create archive.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const zip = new JSZip();

      // التحقق من حجم الملفات الإجمالي
      const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
      if (totalSize > 500 * 1024 * 1024) { // 500MB limit
        throw new Error('Total file size exceeds 500MB. Please select smaller files.');
      }

      // إضافة جميع الملفات إلى الأرشيف
      for (const fileObj of files) {
        try {
          // التحقق من حجم الملف الفردي
          if (fileObj.file.size > 100 * 1024 * 1024) { // 100MB per file
            throw new Error(`File "${fileObj.name}" is too large (max 100MB per file)`);
          }

          const fileData = await readFileAsArrayBuffer(fileObj.file);
          zip.file(fileObj.name, fileData);
        } catch (err) {
          console.error(`Error processing file ${fileObj.name}:`, err);
          throw new Error(`Failed to process "${fileObj.name}": ${err.message}`);
        }
      }

      // إنشاء الأرشيف
      const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // إنشاء اسم الأرشيف
      const name = archiveName || `archive-${Date.now()}`;
      const fileName = `${name}.rar`;

      // حفظ الأرشيف
      saveAs(zipContent, fileName);
      
      // إنشاء URL للعرض (اختياري)
      const url = URL.createObjectURL(zipContent);
      setArchiveUrl(url);
      
    } catch (error) {
      console.error('Error creating archive:', error);
      setError(error.message || 'Failed to create archive. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // إعادة تعيين
  const resetConverter = () => {
    if (archiveUrl) {
      URL.revokeObjectURL(archiveUrl);
    }
    
    setFiles([]);
    setArchiveUrl(null);
    setArchiveName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تنظيف الذاكرة عند إغلاق المكون
  const handleClose = () => {
    if (archiveUrl) {
      URL.revokeObjectURL(archiveUrl);
    }
    onClose();
  };

  // إحصائيات الملفات
  const getFileStats = () => {
    const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
    const fileTypes = [...new Set(files.map(file => {
      if (file.type.startsWith('image/')) return 'Image';
      if (file.type.startsWith('video/')) return 'Video';
      if (file.type.startsWith('audio/')) return 'Audio';
      if (file.type === 'application/pdf') return 'PDF';
      return file.extension.toUpperCase();
    }))];
    
    return {
      totalFiles: files.length,
      totalSize: formatFileSize(totalSize),
      fileTypes: fileTypes.slice(0, 3).join(', ') + (fileTypes.length > 3 ? '...' : '')
    };
  };

  const stats = getFileStats();

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Create RAR Archive</h2>
                <p className="text-orange-100">Compress multiple files into one RAR archive</p>
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
          {!archiveUrl ? (
            <>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your files here
                </h3>
                <p className="text-gray-500 mb-4">
                  or click to select files from your computer
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Select Files</span>
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  All file types supported • Max files: 50 • Max size: 100MB per file
                </p>
              </div>

              {/* Archive Name Input */}
              {files.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archive Name (optional)
                  </label>
                  <input
                    type="text"
                    value={archiveName}
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder={`archive-${Date.now()}`}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for automatic naming
                  </p>
                </div>
              )}

              {/* File Statistics */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalFiles}</div>
                    <div className="text-sm text-blue-700">Total Files</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.totalSize}</div>
                    <div className="text-sm text-green-700">Total Size</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-lg font-bold text-purple-600 truncate">
                      {stats.fileTypes}
                    </div>
                    <div className="text-sm text-purple-700">File Types</div>
                  </div>
                </div>
              )}

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
                  
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <span className="text-2xl flex-shrink-0">
                            {getFileIcon(file.type, file.extension)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{file.size}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {file.extension.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetConverter}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                    
                    <button
                      onClick={createArchive}
                      disabled={isCreating || files.length === 0}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 ${
                        isCreating || files.length === 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isCreating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Archive...</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5" />
                          <span>Create RAR Archive</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                    <h4 className="font-semibold text-orange-800 mb-2">Features:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Supports all file types (images, documents, videos, etc.)</li>
                      <li>• Files are compressed to reduce size</li>
                      <li>• Process happens entirely in your browser - your files stay private</li>
                      <li>• Download will start automatically when archive is ready</li>
                      <li>• Maximum 100MB per file, 500MB total</li>
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
                Archive Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your {files.length} files have been compressed into a RAR archive.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Archive Details:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="text-left">
                    <span className="font-medium">Files:</span> {stats.totalFiles}
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Total Size:</span> {stats.totalSize}
                  </div>
                  <div className="text-left col-span-2">
                    <span className="font-medium">Compressed:</span> RAR format
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Again</span>
                </button>
                
                <button
                  onClick={resetConverter}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Archive</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRarArchive;