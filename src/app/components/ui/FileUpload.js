'use client';

import { Upload, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function FileUpload({ 
  onFileSelect, 
  acceptedTypes, 
  maxSize = 5, 
  className = "" 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    setError('');
    
    if (!file) return;
    
    if (!acceptedTypes.some(type => file.type.includes(type) || file.name.endsWith(type))) {
      setError(`يرجى اختيار ملف من الأنواع: ${acceptedTypes.join(', ')}`);
      return;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      setError(`حجم الملف كبير جداً. الحد الأقصى ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={acceptedTypes.map(type => `.${type},image/${type}`).join(',')}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              اسحب وأفلت الملف هنا
            </p>
            <p className="text-gray-500 text-sm">
              أو انقر لاختيار الملف
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3 inline-block">
            <p className="text-xs text-gray-600">
              يدعم: {acceptedTypes.join(', ').toUpperCase()} • الحد الأقصى: {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}