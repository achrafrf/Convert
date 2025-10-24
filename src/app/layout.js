import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import FloatingButtonsEnhanced from "./components/FloatingButtonsEnhanced";
import { SmoothScrollProvider } from "./components/SmoothScrollContext";
import Image from 'next/image'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Converter Mora",
  description: "Convert files online for free",
  verification: {
    google: "google27951cad47cb4edd",
  },
  openGraph: {
    title: 'Converter Mora',
    description: 'Convert all types of files easily and quickly',
    images: ['/logo.png'], 
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
        {/* ✅ Meta tags إضافية لتحسين ظهور الصورة في Google */}
        <meta property="og:title" content="Converter Mora" />
        <meta property="og:description" content="Convert all types of files easily and quickly" />
        <meta property="og:image" content="https://convertermora.vercel.app/logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://convertermora.vercel.app/logo.png" />
        <meta name="twitter:title" content="Converter Mora" />
        <meta name="twitter:description" content="Convert all types of files easily and quickly" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
        {/* ✅ Navbar هنا داخل body بشكل صحيح */}
        <Navbar />
        {children}
        <FloatingButtonsEnhanced />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
