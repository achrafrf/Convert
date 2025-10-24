// components/Blog.js
'use client';

import { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, Share, Bookmark, Eye } from 'lucide-react';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // بيانات المقالات الافتراضية
  const blogPosts = [
    {
      id: 1,
      title: "أفضل طرق تحويل الصور إلى PDF",
      excerpt: "تعلم كيفية تحويل الصور إلى ملفات PDF بجودة عالية وبأسهل الطرق المتاحة. دليل شامل للمبتدئين والمحترفين.",
      image: "/api/placeholder/600/400",
      author: "أحمد محمد",
      date: "2024-01-15",
      readTime: "5 دقائق",
      views: "1.2K",
      category: "مستندات",
      content: `
        <h2>مقدمة عن تحويل الصور إلى PDF</h2>
        <p>تحويل الصور إلى PDF أصبح من الأساسيات في عالم الرقمنة. سواء كنت طالباً، موظفاً، أو صاحب عمل، ستحتاج إلى هذه المهارة.</p>
        
        <h3>لماذا نستخدم PDF؟</h3>
        <p>تنسيق PDF يضمن الحفاظ على تنسيق الملف الأصلي بغض النظر عن الجهاز أو البرنامج المستخدم في الفتح.</p>
        
        <h3>الطرق المتاحة:</h3>
        <ul>
          <li>استخدام برامج التحويل المتخصصة</li>
          <li>المواقع الإلكترونية المجانية</li>
          <li>التطبيقات المحمولة</li>
          <li>الأدوات المدمجة في أنظمة التشغيل</li>
        </ul>
        
        <h3>نصائح للحصول على أفضل نتيجة:</h3>
        <ol>
          <li>استخدم صور عالية الدقة</li>
          <li>اختر حجم مناسب للملف</li>
          <li>رتب الصور بالترتيب الصحيح</li>
          <li>احفظ نسخة احتياطية</li>
        </ol>
        
        <p>باتباع هذه الخطوات البسيطة، يمكنك تحويل صورك إلى PDF باحترافية وسهولة.</p>
      `
    },
    {
      id: 2,
      title: "كيفية ضغط الملفات بدون فقدان الجودة",
      excerpt: "اكتشف أسرار ضغط الملفات مع الحفاظ على الجودة الأصلية. تقنيات متقدمة تناسب جميع أنواع الملفات.",
      image: "/api/placeholder/600/400",
      author: "فاطمة أحمد",
      date: "2024-01-12",
      readTime: "8 دقائق",
      views: "2.4K",
      category: "ضغط الملفات",
      content: `
        <h2>فن ضغط الملفات مع الحفاظ على الجودة</h2>
        <p>ضغط الملفات ليس مجرد تقليل للحجم، بل هو فن الموازنة بين الحجم والجودة.</p>
        
        <h3>أنواع الضغط:</h3>
        <ul>
          <li>الضغط بدون فقدان (Lossless)</li>
          <li>الضغط مع فقدان (Lossy)</li>
        </ul>
        
        <h3>أفضل برامج الضغط:</h3>
        <p>هناك العديد من البرامج المتاحة، لكن الأهم هو اختيار البرنامج المناسب لنوع الملف.</p>
        
        <h3>إعدادات مهمة:</h3>
        <ol>
          <li>معدل الضغط المناسب</li>
          <li>دقة الصورة المثلى</li>
          <li>تنسيق الملف المناسب</li>
        </ol>
      `
    },
    {
      id: 3,
      title: "تحويل الفيديو إلى صيغ مختلفة بجودة عالية",
      excerpt: "دليل شامل لتحويل مقاطع الفيديو بين الصيغ المختلفة مع الحفاظ على الجودة الأصلية والإعدادات المتقدمة.",
      image: "/api/placeholder/600/400",
      author: "خالد إبراهيم",
      date: "2024-01-10",
      readTime: "12 دقائق",
      views: "3.1K",
      category: "فيديو",
      content: `
        <h2>تحويل الفيديو: من البداية إلى الإحتراف</h2>
        <p>تحويل الفيديو يحتاج إلى فهم دقيق للصيغ والإعدادات للحصول على أفضل نتيجة.</p>
        
        <h3>الصيغ الشائعة:</h3>
        <ul>
          <li>MP4 - الأكثر شيوعاً</li>
          <li>AVI - جودة عالية</li>
          <li>MOV - محرري الفيديو</li>
          <li>WEBM - الويب</li>
        </ul>
      `
    },
    {
      id: 4,
      title: "أفضل أدوات تحويل المستندات المجانية",
      excerpt: "تعرف على أفضل الأدوات المجانية لتحويل المستندات بين الصيغ المختلفة مع مقارنة شاملة للمميزات.",
      image: "/api/placeholder/600/400",
      author: "سارة عبدالله",
      date: "2024-01-08",
      readTime: "6 دقائق",
      views: "1.8K",
      category: "أدوات",
      content: `
        <h2>أدوات تحويل المستندات المجانية</h2>
        <p>لا حاجة لدفع المال عندما تتوفر أدوات مجانية بمستوى احترافي.</p>
      `
    },
    {
      id: 5,
      title: "كيفية تحويل PDF إلى Word مع الحفاظ على التنسيق",
      excerpt: "تعلم كيفية تحويل ملفات PDF إلى مستندات Word مع الحفاظ الكامل على التنسيق والجداول والصور.",
      image: "/api/placeholder/600/400",
      author: "محمد حسن",
      date: "2024-01-05",
      readTime: "7 دقائق",
      views: "2.9K",
      category: "مستندات",
      content: `
        <h2>تحويل PDF إلى Word باحترافية</h2>
        <p>تحويل PDF إلى Word يحتاج إلى أدوات ذكية تفهم تنسيق المستند.</p>
      `
    },
    {
      id: 6,
      title: "أمان الملفات أثناء عملية التحويل",
      excerpt: "نصائح مهمة لحماية ملفاتك وبياناتك الشخصية أثناء استخدام أدوات التحويل عبر الإنترنت.",
      image: "/api/placeholder/600/400",
      author: "نورا الكواري",
      date: "2024-01-03",
      readTime: "9 دقائق",
      views: "1.5K",
      category: "أمان",
      content: `
        <h2>حماية ملفاتك أثناء التحويل</h2>
        <p>الأمان أولوية قصوى عندما تتعامل مع ملفاتك الشخصية على الإنترنت.</p>
      `
    },
    {
      id: 7,
      title: "تحويل الصور بين الصيغ المختلفة",
      excerpt: "دليل شامل لتحويل الصور بين جميع الصيغ الشائعة مع شرح الفروقات بين كل صيغة ومميزاتها.",
      image: "/api/placeholder/600/400",
      author: "ياسمين علي",
      date: "2024-01-01",
      readTime: "10 دقائق",
      views: "2.2K",
      category: "صور",
      content: `
        <h2>عالم صيغ الصور</h2>
        <p>كل صيغة صور لها استخداماتها ومميزاتها الخاصة.</p>
      `
    },
    {
      id: 8,
      title: "أفضل الممارسات لتحويل الملفات الكبيرة",
      excerpt: "كيفية التعامل مع الملفات كبيرة الحجم أثناء التحويل وتجنب المشاكل الشائعة.",
      image: "/api/placeholder/600/400",
      author: "راشد السعدي",
      date: "2023-12-28",
      readTime: "11 دقائق",
      views: "1.7K",
      category: "نصائح",
      content: `
        <h2>تحويل الملفات الكبيرة</h2>
        <p>الملفات الكبيرة تحتاج إلى استراتيجيات خاصة للتعامل معها.</p>
      `
    },
    {
      id: 9,
      title: "تحويل المستندات إلى ePub للقراءة الإلكترونية",
      excerpt: "تعلم كيفية تحويل المستندات إلى صيغة ePub المثالية للكتب الإلكترونية والأجهزة اللوحية.",
      image: "/api/placeholder/600/400",
      author: "لمى عبدالرحمن",
      date: "2023-12-25",
      readTime: "8 دقائق",
      views: "1.3K",
      category: "كتب",
      content: `
        <h2>تحويل إلى ePub</h2>
        <p>صيغة ePub هي المعيار الذهبي للكتب الإلكترونية.</p>
      `
    }
  ];

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const openPost = (post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={closePost}
            className="flex items-center space-x-2 space-x-reverse text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى المدونة</span>
          </button>

          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedPost.category}
                </span>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPost.date)}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Eye className="w-4 h-4" />
                  <span>{selectedPost.views} مشاهدة</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedPost.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {selectedPost.excerpt}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 space-x-reverse border-t border-gray-200 pt-6">
                <button className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-blue-600 transition-colors">
                  <Share className="w-5 h-5" />
                  <span>مشاركة</span>
                </button>
                <button className="flex items-center space-x-2 space-x-reverse text-gray-500 hover:text-red-600 transition-colors">
                  <Bookmark className="w-5 h-5" />
                  <span>حفظ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              style={{
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}
            />
          </div>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(post => post.id !== selectedPost.id && post.category === selectedPost.category)
                .slice(0, 2)
                .map(post => (
                  <div
                    key={post.id}
                    onClick={() => openPost(post)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.date)}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 street-heading">
            مدونة التحويل
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto street-subtitle">
            اكتشف أحدث النصائح والحيل في عالم تحويل الملفات. دليل شامل من الخبراء.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => openPost(post)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Eye className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="mt-4 flex items-center justify-end">
                  <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors flex items-center space-x-1 space-x-reverse">
                    <span>اقرأ المزيد</span>
                    <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg border transition-colors ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .street-heading {
          font-family: 'Bebas Neue', 'Impact', 'Arial Black', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.8),
                       6px 6px 0px rgba(139, 92, 246, 0.3);
        }
        
        .street-subtitle {
          font-family: 'Rajdhani', 'Orbitron', 'Arial', sans-serif;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prose {
          color: #374151;
        }

        .prose h2 {
          color: #1f2937;
          font-weight: 700;
          font-size: 1.5em;
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .prose h3 {
          color: #374151;
          font-weight: 600;
          font-size: 1.25em;
          margin-top: 1.6em;
          margin-bottom: 0.8em;
        }

        .prose p {
          margin-bottom: 1.25em;
        }

        .prose ul, .prose ol {
          margin-bottom: 1.25em;
          padding-right: 1.625em;
        }

        .prose li {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
};

export default Blog;