/** @type {import('next').NextConfig} */
const nextConfig = {
  // تمكين تجريبية ESM
  experimental: {
    esmExternals: 'loose'
  },
  
  // إعدادات Webpack
  webpack: (config, { isServer }) => {
    // تعطيل تحذيرات الحزم غير المثبتة
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      os: false,
      url: false,
      worker_threads: false,
      child_process: false,
    };

    // معالجة مكتبات ffmpeg
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    // تجاهل تحذيرات حجم الحزمة لـ ffmpeg
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@ffmpeg/ },
      { module: /node_modules\/@ffmpeg/ }
    ];

    return config;
  },

  // إعدادات للبيئة التطويرية
  typescript: {
    ignoreBuildErrors: false,
  },

  // إعدادات للبيئة الانتاجية
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;