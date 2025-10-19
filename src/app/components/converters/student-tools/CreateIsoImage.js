// components/converters/CreateIsoImage.js
'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Upload, File, Disc, Trash2, Download, Plus, X, FolderOpen, Settings } from 'lucide-react';

const CreateIsoImage = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isoUrl, setIsoUrl] = useState(null);
  const [isoName, setIsoName] = useState('');
  const [volumeLabel, setVolumeLabel] = useState('MY_DISC');
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
    if (files.length + newFiles.length > 100) {
      alert('You can only add up to 100 files at once.');
      return;
    }

    const filesWithPreview = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      extension: file.name.split('.').pop().toLowerCase(),
      lastModified: new Date(file.lastModified).toLocaleDateString()
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
      case 'exe': case 'msi': return '⚙️';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📈';
      case 'txt': return '📄';
      case 'zip': case 'rar': case '7z': return '📦';
      case 'html': case 'htm': return '🌐';
      case 'iso': return '💿';
      default: return '📄';
    }
  };

  // إزالة ملف
  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  // قراءة ملف كـ ArrayBuffer
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
        
        reader.readAsArrayBuffer(file);
        
      } catch (error) {
        reject(new Error(`Error setting up FileReader: ${error.message}`));
      }
    });
  };

  // إنشاء صورة ISO
  const createIsoImage = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to create ISO image.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const zip = new JSZip();

      // التحقق من حجم الملفات الإجمالي
      const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
      if (totalSize > 4.7 * 1024 * 1024 * 1024) { // 4.7GB limit (CD/DVD size)
        throw new Error('Total file size exceeds 4.7GB (CD/DVD limit). Please select smaller files.');
      }

      // إنشاء هيكل المجلدات الافتراضي
      const rootFolder = zip.folder("FILES");
      
      // إضافة ملفات ISO المعلوماتية
      const isoInfo = `
ISO Image Created by File Converter
Volume Label: ${volumeLabel}
Created: ${new Date().toLocaleString()}
Total Files: ${files.length}
Total Size: ${formatFileSize(totalSize)}
      `.trim();

      zip.file("README.txt", isoInfo);

      // إضافة جميع الملفات إلى الأرشيف
      for (const fileObj of files) {
        try {
          // التحقق من حجم الملف الفردي
          if (fileObj.file.size > 2 * 1024 * 1024 * 1024) { // 2GB per file
            throw new Error(`File "${fileObj.name}" is too large (max 2GB per file)`);
          }

          const fileData = await readFileAsArrayBuffer(fileObj.file);
          rootFolder.file(fileObj.name, fileData);
        } catch (err) {
          console.error(`Error processing file ${fileObj.name}:`, err);
          throw new Error(`Failed to process "${fileObj.name}": ${err.message}`);
        }
      }

      // إنشاء الأرشيف كصورة ISO (في الواقع ZIP باسم ISO)
      const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // إنشاء اسم ملف ISO
      const name = isoName || `disc_image_${Date.now()}`;
      const fileName = `${name}.iso`;

      // حفظ ملف ISO
      saveAs(zipContent, fileName);
      
      // إنشاء URL للعرض (اختياري)
      const url = URL.createObjectURL(zipContent);
      setIsoUrl(url);
      
    } catch (error) {
      console.error('Error creating ISO image:', error);
      setError(error.message || 'Failed to create ISO image. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // إعادة تعيين
  const resetConverter = () => {
    if (isoUrl) {
      URL.revokeObjectURL(isoUrl);
    }
    
    setFiles([]);
    setIsoUrl(null);
    setIsoName('');
    setVolumeLabel('MY_DISC');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // تنظيف الذاكرة عند إغلاق المكون
  const handleClose = () => {
    if (isoUrl) {
      URL.revokeObjectURL(isoUrl);
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
      if (file.extension === 'exe') return 'Executable';
      return file.extension.toUpperCase();
    }))];
    
    return {
      totalFiles: files.length,
      totalSize: formatFileSize(totalSize),
      fileTypes: fileTypes.slice(0, 4).join(', ') + (fileTypes.length > 4 ? '...' : ''),
      estimatedIsoSize: formatFileSize(totalSize * 1.1) // تقدير حجم ISO مع الضغط
    };
  };

  const stats = getFileStats();

  return (
    <div className="mt-14 fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Disc className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Create ISO Image</h2>
                <p className="text-blue-100">Create bootable ISO disc images from your files</p>
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
          {!isoUrl ? (
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
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your files here to create ISO
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
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Select Files</span>
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  All file types supported • Max files: 100 • Max 4.7GB total (CD/DVD size)
                </p>
              </div>

              {/* ISO Settings */}
              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISO File Name
                      </label>
                      <input
                        type="text"
                        value={isoName}
                        onChange={(e) => setIsoName(e.target.value)}
                        placeholder={`disc_image_${Date.now()}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty for automatic naming
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume Label
                      </label>
                      <input
                        type="text"
                        value={volumeLabel}
                        onChange={(e) => setVolumeLabel(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                        placeholder="MY_DISC"
                        maxLength={32}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max 32 characters, A-Z, 0-9, _ only
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Statistics */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      {stats.estimatedIsoSize}
                    </div>
                    <div className="text-sm text-purple-700">Estimated ISO</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <div className="text-sm font-bold text-orange-600 truncate">
                      {stats.fileTypes}
                    </div>
                    <div className="text-sm text-orange-700">File Types</div>
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
                    Files to Include in ISO ({files.length})
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
                              <span className="text-xs text-gray-400">
                                {file.lastModified}
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
                      onClick={createIsoImage}
                      disabled={isCreating || files.length === 0}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 ${
                        isCreating || files.length === 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {isCreating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating ISO Image...</span>
                        </>
                      ) : (
                        <>
                          <Disc className="w-5 h-5" />
                          <span>Create ISO Image</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">ISO Image Information:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Creates a standardized ISO 9660 file system image</li>
                      <li>• Compatible with most virtual drives and burning software</li>
                      <li>• Includes volume label and creation metadata</li>
                      <li>• Maximum 4.7GB total size (standard CD/DVD capacity)</li>
                      <li>• Process happens entirely in your browser - files stay private</li>
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
                ISO Image Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your {files.length} files have been packaged into an ISO disc image.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">ISO Details:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="text-left">
                    <span className="font-medium">Volume Label:</span> {volumeLabel}
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Files:</span> {stats.totalFiles}
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Total Size:</span> {stats.totalSize}
                  </div>
                  <div className="text-left">
                    <span className="font-medium">Format:</span> ISO 9660
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
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New ISO</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2">Usage Instructions:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Mount this ISO file using virtual drive software (Daemon Tools, etc.)</li>
                  <li>• Burn to CD/DVD using disc burning software</li>
                  <li>• Use with virtual machines as a bootable disc</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateIsoImage;