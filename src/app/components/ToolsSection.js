// components/ToolsSection.js
import { useState } from 'react';
import { Image, FileText, Zap, Download, ArrowRight ,Scissors ,FileArchive , Disc    } from 'lucide-react';

const ToolsSection = ({ onToolClick }) => {
  const [isHovered, setIsHovered] = useState(null);

  const tools = [
    {
      category: "🖼️ Convert Images",
      items: [
        { 
          title: "JPG to PNG", 
          desc: "Convert images from JPG to PNG while preserving quality", 
          component: 'jpg-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-purple-500 to-pink-500",
          popular: true
        },
        { 
          title: "WEBP to PNG", 
          desc: "Convert images from WEBP to PNG with high resolution", 
          component: 'webp-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-blue-500 to-cyan-500",
          popular: true
        },
        { 
          title: "JFIF to PNG", 
          desc: "Convert JFIF images to standard PNG format", 
          component: 'jfif-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-green-500 to-emerald-500"
        },
        { 
          title: "PNG to SVG", 
          desc: "Convert raster images to SVG vectors", 
          component: 'png-to-svg',
          icon: <Image className="w-6 h-6" />,
          color: "from-orange-500 to-red-500"
        },
        { 
          title: "HEIC to JPG", 
          desc: "Convert iPhone HEIC images to universal JPG", 
          component: 'heic-to-jpg',
          icon: <Image className="w-6 h-6" />,
          color: "from-indigo-500 to-purple-500",
          popular: true
        },
        { 
          title: "HEIC to PNG", 
          desc: "Convert HEIC images to PNG while preserving quality", 
          component: 'heic-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-teal-500 to-green-500"
        },
        { 
          title: "WEBP to JPG", 
          desc: "Convert WEBP images to compatible JPG format", 
          component: 'webp-to-jpg',
          icon: <Image className="w-6 h-6" />,
          color: "from-yellow-500 to-orange-500"
        },
        { 
          title: "SVG Converter", 
          desc: "Convert and edit SVG vector files", 
          component: 'svg-converter',
          icon: <Image className="w-6 h-6" />,
          color: "from-pink-500 to-rose-500"
        },
        { 
          title: "Image Compressor", 
          desc: "Reduce image size without losing visual quality", 
          component: 'compress',
          icon: <Zap className="w-6 h-6" />,
          color: "from-gray-500 to-slate-500",
          popular: true
        },
          { 
          title: "Image to ICO", 
          desc: "Convert images from Any Image to Ico while preserving quality", 
          component: 'Image-to-Ico',
          icon: <Image className="w-6 h-6" />,
          color: "from-purple-500 to-pink-500",
          popular: true
        },
      ]
    },
    {
      category: "📄 Document Conversion",
      items: [
        { 
          title: "PDF to Word", 
          desc: "Convert PDF to editable Word document", 
          component: 'pdf-to-word',
          icon: <FileText className="w-6 h-6" />,
          color: "from-blue-500 to-cyan-500",
          popular: true
        },
        { 
          title: "Word to PDF", 
          desc: "Convert Word document to high-quality PDF", 
          component: 'WordToPdf',
          icon: <FileText className="w-6 h-6" />,
          color: "from-indigo-500 to-purple-500",
          popular: true
        },
        { 
          title: "Merge PDF", 
          desc: "Merge multiple PDF files into one organized file", 
          component: 'merge-pdf',
          icon: <Download className="w-6 h-6" />,
          color: "from-teal-500 to-green-500"
        },
        { 
          title: "PDF to JPG", 
          desc: "Convert PDF pages to JPG images", 
          component: 'pdf-to-jpg',
          icon: <FileText className="w-6 h-6" />,
          color: "from-purple-500 to-pink-500"
        },
        { 
          title: "JPG to PDF", 
          desc: "Convert images to a single PDF file", 
          component: 'jpg-to-pdf',
          icon: <Image className="w-6 h-6" />,
          color: "from-orange-500 to-red-500",
          popular: true
        },
        { 
          title: "DOCX to PDF", 
          desc: "Convert Word document to PDF", 
          component: 'docx-to-pdf',
          icon: <FileText className="w-6 h-6" />,
          color: "from-indigo-500 to-purple-500",
          popular: true
        },
        { 
          title: "PDF to EPUB", 
          desc: "Convert PDF to EPUB e-book", 
          component: 'PdfToEpub',
          icon: <FileText className="w-6 h-6" />,
          color: "from-teal-500 to-green-500"
        },
        { 
          title: "EPUB to PDF", 
          desc: "Convert e-book to PDF", 
          component: 'epub-to-pdf',
          icon: <FileText className="w-6 h-6" />,
          color: "from-yellow-500 to-orange-500"
        },
        { 
          title: "HEIC to PDF", 
          desc: "Convert iPhone images to PDF file", 
          component: 'heic-to-pdf',
          icon: <Image className="w-6 h-6" />,
          color: "from-pink-500 to-rose-500"
        },
        
      ]
    },
    {
      category: "🎓 Student Tools",
      items: [
        { 
          title: "Image to Text", 
          desc: "Extract text from images using smart OCR", 
          component: 'image-to-text',
          icon: <FileText className="w-6 h-6" />,
          color: "from-green-500 to-emerald-500",
          popular: true
        },
        {
  title: "Video Cutter", 
  desc: "Trim and cut video files to your desired length", 
  component: 'video-cutter',
  icon: <Scissors className="w-6 h-6" />,
  color: "from-pink-500 to-purple-500",
  popular: true
},
 {
  title: "CreateRarArchive", 
  desc: "Trim and cut video files to your desired length", 
  component: 'CreateRarArchive',
  icon: <FileArchive  className="w-6 h-6" />,
  color: "from-pink-500 to-purple-500",
  popular: true
},
 {
  title: "CreateIsoImage", 
  desc: "Trim and cut video files to your desired length", 
  component: 'CreateIsoImage',
  icon: <Disc    className="w-6 h-6" />,
  color: "from-pink-500 to-purple-500",
  popular: true
}
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {tools.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{category.category}</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((tool, toolIndex) => (
                <div
                  key={toolIndex}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-violet-800 group relative overflow-hidden cursor-pointer ${
                    isHovered === tool.title ? 'scale-105' : 'scale-100'
                  }`}
                  onMouseEnter={() => setIsHovered(tool.title)}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={() => onToolClick(tool)}
                >
                  {tool.popular && (
                    <div className="absolute top-1 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-xl mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {tool.desc}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Free</span>
                    <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center group">
                      Use Tool
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;