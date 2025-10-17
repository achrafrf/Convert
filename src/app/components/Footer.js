// components/Footer.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-blue-100/80 font-sans dark:bg-violet-950">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {/* Newsletter Section */}
          <div className="sm:col-span-2">
            <h1 className="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">
              اشترك في نشرتنا الإخبارية للحصول على التحديثات.
            </h1>

            <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
              <input 
                id="email" 
                type="text" 
                className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300" 
                placeholder="البريد الإلكتروني" 
              />
      
              <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                اشتراك
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">روابط سريعة</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <Link href="/" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                الرئيسية
              </Link>
              <Link href="/about" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                من نحن
              </Link>
              <Link href="/philosophy" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                فلسفتنا
              </Link>
            </div>
          </div>

          {/* Industries */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">المجالات</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <Link href="/industries/retail" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                التجزئة والتجارة الإلكترونية
              </Link>
              <Link href="/industries/technology" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                تكنولوجيا المعلومات
              </Link>
              <Link href="/industries/finance" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                التمويل والتأمين
              </Link>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200 md:my-8 dark:border-gray-700 h-2" />
        
        {/* App Stores and Social Media */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4 hover:cursor-pointer">
            <Image 
              src="https://www.svgrepo.com/show/303139/google-play-badge-logo.svg" 
              width={130} 
              height={110} 
              alt="Google Play" 
              className="hover:scale-105 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/303128/download-on-the-app-store-apple-logo.svg" 
              width={130} 
              height={110} 
              alt="App Store" 
              className="hover:scale-105 transition-transform"
            />
          </div>
          
          <div className="flex gap-4 hover:cursor-pointer mt-4 sm:mt-0">
            <Image 
              src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg" 
              width={30} 
              height={30} 
              alt="Facebook" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/303115/twitter-3-logo.svg" 
              width={30} 
              height={30} 
              alt="Twitter" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/303145/instagram-2-1-logo.svg" 
              width={30} 
              height={30} 
              alt="Instagram" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/94698/github.svg" 
              width={30} 
              height={30} 
              alt="GitHub" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/22037/path.svg" 
              width={30} 
              height={30} 
              alt="Path" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/28145/linkedin.svg" 
              width={30} 
              height={30} 
              alt="LinkedIn" 
              className="hover:scale-110 transition-transform"
            />
            <Image 
              src="https://www.svgrepo.com/show/22048/dribbble.svg" 
              width={30} 
              height={30} 
              alt="Dribbble" 
              className="hover:scale-110 transition-transform"
            />
          </div>
        </div>
        
        {/* Copyright */}
        <p className="font-sans p-8 text-start md:text-center md:text-lg md:p-4">
          © 2025 ConverterMora. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};

export default Footer;