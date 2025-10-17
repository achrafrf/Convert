'use client';

import { useState } from 'react';
import { 
  Image, 
  FileText, 
  Zap, 
  Shield, 
  Download,
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// استيراد المحولات
import JpgToPng from './components/converters/JpgToPng';
import WebpToPng from './components/converters/WebpToPng';
import JfifToPng from './components/converters/JfifToPng';
import PngToSvg from './components/converters/PngToSvg';
import HeicToJpg from './components/converters/HeicToJpg';
import HeicToPng from './components/converters/HeicToPng';
import WebpToJpg from './components/converters/WebpToJpg';
import SvgConverter from './components/converters/SvgConverter';
import ImageCompressor from './components/converters/ImageCompressor';
import PdfToWord from './components/converters/pdf/PdfToWord';
import PdfToJpg from './components/converters/pdf/PdfToJpg';
import JpgToPdf from './components/converters/pdf/JpgToPdf';
import DocxToPdf from './components/converters/documents/DocxToPdf';
import ImageToText from './components/converters/student-tools/ImageToText';
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function Home() {
  const [isHovered, setIsHovered] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      category: "🖼️ تحويل الصور",
      items: [
        { 
          title: "JPG إلى PNG", 
          desc: "تحويل الصور من JPG إلى PNG مع الحفاظ على الجودة", 
          component: 'jpg-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-purple-500 to-pink-500",
          popular: true
        },
        { 
          title: "WEBP إلى PNG", 
          desc: "تحويل الصور من WEBP إلى PNG بدقة عالية", 
          component: 'webp-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-blue-500 to-cyan-500",
          popular: true
        },
        { 
          title: "JFIF إلى PNG", 
          desc: "تحويل صور JFIF إلى formato PNG القياسي", 
          component: 'jfif-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-green-500 to-emerald-500"
        },
        { 
          title: "PNG إلى SVG", 
          desc: "تحويل الصور النقطية إلى متجهات SVG", 
          component: 'png-to-svg',
          icon: <Image className="w-6 h-6" />,
          color: "from-orange-500 to-red-500"
        },
        { 
          title: "HEIC إلى JPG", 
          desc: "تحويل صور آيفون HEIC إلى JPG عالمي", 
          component: 'heic-to-jpg',
          icon: <Image className="w-6 h-6" />,
          color: "from-indigo-500 to-purple-500",
          popular: true
        },
        { 
          title: "HEIC إلى PNG", 
          desc: "تحويل صور HEIC إلى PNG مع الحفاظ على الجودة", 
          component: 'heic-to-png',
          icon: <Image className="w-6 h-6" />,
          color: "from-teal-500 to-green-500"
        },
        { 
          title: "WEBP إلى JPG", 
          desc: "تحويل صور WEBP إلى formato JPG المتوافق", 
          component: 'webp-to-jpg',
          icon: <Image className="w-6 h-6" />,
          color: "from-yellow-500 to-orange-500"
        },
        { 
          title: "محول SVG", 
          desc: "تحويل وتعديل ملفات SVG المتجهة", 
          component: 'svg-converter',
          icon: <Image className="w-6 h-6" />,
          color: "from-pink-500 to-rose-500"
        },
        { 
          title: "ضغط الصور", 
          desc: "تقليل حجم الصور دون خسارة الجودة المرئية", 
          component: 'compress',
          icon: <Zap className="w-6 h-6" />,
          color: "from-gray-500 to-slate-500",
          popular: true
        },
      ]
    },
    {
      category: "📄 تحويل المستندات",
      items: [
        { 
          title: "PDF إلى Word", 
          desc: "تحويل PDF إلى مستند Word قابل للتعديل", 
          href: "/document-conversion/pdf-to-word", 
          icon: <FileText className="w-6 h-6" />,
          color: "from-blue-500 to-cyan-500",
          popular: true
        },
        { 
          title: "Word إلى PDF", 
          desc: "تحويل مستند Word إلى PDF بجودة عالية", 
          href: "/document-conversion/word-to-pdf", 
          icon: <FileText className="w-6 h-6" />,
          color: "from-indigo-500 to-purple-500",
          popular: true
        },
        { 
          title: "دمج PDF", 
          desc: "دمج عدة ملفات PDF في ملف واحد منظم", 
          href: "/document-conversion/merge-pdf", 
          icon: <Download className="w-6 h-6" />,
          color: "from-teal-500 to-green-500"
        },
         { 
      title: "PDF إلى JPG", 
      desc: "تحويل صفحات PDF إلى صور JPG", 
      component: 'pdf-to-jpg',
      icon: <FileText className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "JPG إلى PDF", 
      desc: "تحويل الصور إلى ملف PDF واحد", 
      component: 'jpg-to-pdf',
      icon: <Image className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      popular: true
    },
    { 
      title: "DOCX إلى PDF", 
      desc: "تحويل مستند Word إلى PDF", 
      component: 'docx-to-pdf',
      icon: <FileText className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      popular: true
    },
    { 
      title: "PDF إلى EPUB", 
      desc: "تحويل PDF إلى كتاب إلكتروني EPUB", 
      component: 'pdf-to-epub',
      icon: <FileText className="w-6 h-6" />,
      color: "from-teal-500 to-green-500"
    },
    { 
      title: "EPUB إلى PDF", 
      desc: "تحويل الكتاب الإلكتروني إلى PDF", 
      component: 'epub-to-pdf',
      icon: <FileText className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500"
    },
    { 
      title: "HEIC إلى PDF", 
      desc: "تحويل صور آيفون إلى ملف PDF", 
      component: 'heic-to-pdf',
      icon: <Image className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    },
      ]
    },
    {
      category: "📄 student tools",
      items: [
        { 
      title: "صورة إلى نص", 
      desc: "استخراج النص من الصور باستخدام OCR الذكي", 
      component: 'image-to-text',
      icon: <FileText className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      popular: true
    },
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "آمن 100%",
      description: "ملفاتك لا تصل إلى سيرفرنا، المعالجة في متصفحك مباشرة"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "سريع جداً",
      description: "تحويل فوري دون انتظار، حتى للملفات الكبيرة"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "جودة عالية",
      description: "حافظ على جودة ملفاتك مع أفضل خوارزميات التحويل"
    }
  ];

  const handleToolClick = (tool) => {
    if (tool.component) {
      setActiveTool(tool.component);
    }
  };

  const closeConverter = () => {
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
     <Hero />
      

      {/* Features Grid */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 group hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Sections */}
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
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-violet-800 group relative overflow-hidden ${
                      isHovered === tool.title ? 'scale-105' : 'scale-100'
                    }`}
                    onMouseEnter={() => setIsHovered(tool.title)}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => handleToolClick(tool)}
                  >
                    {tool.popular && (
                      <div className="absolute top-1 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        الأكثر استخداماً
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
                      <span className="text-sm text-gray-500">مجاني</span>
                      <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center group">
                        استخدام الأداة
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يحولون ملفاتهم بثقة وسهولة
          </p>
          <button className="bg-white text-purple-500 px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-bold text-lg">
            ابدأ التحويل مجاناً
          </button>
        </div>
      </section>

      {/* Footer */}
     <Footer />
      {/* Render Active Converter */}
      {activeTool === 'jpg-to-png' && <JpgToPng onClose={closeConverter} />}
      {activeTool === 'webp-to-png' && <WebpToPng onClose={closeConverter} />}
      {activeTool === 'jfif-to-png' && <JfifToPng onClose={closeConverter} />}
      {activeTool === 'png-to-svg' && <PngToSvg onClose={closeConverter} />}
      {activeTool === 'heic-to-jpg' && <HeicToJpg onClose={closeConverter} />}
      {activeTool === 'heic-to-png' && <HeicToPng onClose={closeConverter} />}
      {activeTool === 'webp-to-jpg' && <WebpToJpg onClose={closeConverter} />}
      {activeTool === 'svg-converter' && <SvgConverter onClose={closeConverter} />}
      {activeTool === 'compress' && <ImageCompressor onClose={closeConverter} />}
      {activeTool === 'pdf-to-word' && <PdfToWord onClose={closeConverter} />}
      {activeTool === 'pdf-to-jpg' && <PdfToJpg onClose={closeConverter} />}
      {activeTool === 'jpg-to-pdf' && <JpgToPdf onClose={closeConverter} />}
      {activeTool === 'docx-to-pdf' && <DocxToPdf onClose={closeConverter} />}
      {activeTool === 'pdf-to-epub' && <PdfToEpub onClose={closeConverter} />}
      {activeTool === 'epub-to-pdf' && <EpubToPdf onClose={closeConverter} />}
      {activeTool === 'heic-to-pdf' && <HeicToPdf onClose={closeConverter} />}
      {activeTool === 'image-to-text' && <ImageToText onClose={closeConverter} />}
    </div>
  );
}