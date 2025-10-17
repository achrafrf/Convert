// components/Navbar.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSmoothScroll } from './SmoothScrollContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const navItems = [
    { 
      label: 'HOME', 
      href: '/',
      hasDropdown: false
    },
    { 
      label: 'IMAGES', 
      href: '/videos',
      hasDropdown: true,
      dropdownItems: [
        { label: 'JPG TO PNG', href: '/videos/latest' },
        { label: 'WEBP TO PNG', href: '/videos/popular' },
        { label: 'JFIF TO PNG', href: '/videos/featured' },
        { label: 'PNG TO SVG', href: '/videos/featured' },
        { label: 'HEIC TO JPG', href: '/videos/featured' },
        { label: 'HEIC TO PNG', href: '/videos/featured' },
        { label: 'WEBP TO JPG', href: '/videos/featured' },
        { label: 'CONVERTE SVG', href: '/videos/featured' },
      ]
    },
    { 
      label: 'DOCUMENTS', 
      href: '/Documents',
      hasDropdown: true,
      dropdownItems: [
        { label: 'PDF TO WORD', href: '/categories/action' },
        { label: 'WORD TO PDF', href: '/categories/adventure' },
        { label: 'MERGE PDF', href: '/categories/comedy' },
        { label: 'PDF TO JPG', href: '/categories/drama' },
        { label: 'JPG TO PDF', href: '/categories/fantasy' },
        { label: 'DOCX TO PDF', href: '/categories/fantasy' },
        { label: 'PDF TO EPUB', href: '/categories/fantasy' },
        { label: 'EPUB TO PDF', href: '/categories/fantasy' },
        { label: 'HEIC TO PDF', href: '/categories/fantasy' },
      ]
    },
    { 
      label: 'STUDENTS', 
      href: '/community',
      hasDropdown: true,
      dropdownItems: [
        { label: 'IMAGE TO TEXT', href: '/community/forums' },
      ]
    },
    { 
      label: 'GALLERY', 
      href: '/gallery',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Photos', href: '/gallery/photos' },
        { label: 'GIFs', href: '/gallery/gifs' },
        { label: 'Wallpapers', href: '/gallery/wallpapers' }
      ]
    }
  ];

const { scrollToSection } = useSmoothScroll();

 const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
<nav className="navbar relative z-50">
      <div className="nav-container">
        {/* Logo - Netflix Style CanVmora */}
        <div className="logo-section">
        <Link href="/" className="logo" onClick={closeMenu}>
         <Image
      src="/logo.png"
      alt="ConVmora Logo"
      width={100}
      height={50}
      className="object-contain"
    />  
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <li 
              key={index} 
className={`nav-item font-bold ${item.hasDropdown ? 'dropdown' : ''} ${activeDropdown === index ? 'active' : ''}`}            >
              {item.hasDropdown ? (
                <>
                  <button 
                    className="nav-link dropdown-toggle"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.label} <span className="dropdown-arrow">~</span>
                  </button>
                  <div className="dropdown-content">
                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                      <Link 
                        key={dropdownIndex}
                        href={dropdownItem.href}
                        className="dropdown-link"
                        onClick={closeMenu}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href}
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}

      <style jsx>{`
.navbar {
  background-color: #240046;
  border-bottom: 1px solid #333;
  padding: 0;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000; /* Navbar يبقى 1000 */
  overflow: visible !important;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #240046;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1100; /* Dropdown يصبح 1100 */
  border: 1px solid #333;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: all 0.2s ease;
}

/* للموبايل أيضاً */
@media (max-width: 1024px) {
  .nav-menu {
    position: fixed;
    top: 60px;
    left: -100%;
    width: 280px;
    height: calc(100vh - 60px);
    background-color: #1a1a1a;
    flex-direction: column;
    transition: 0.3s ease;
    padding: 0;
    z-index: 999; /* قائمة الموبايل 999 */
    overflow-y: auto;
    border-right: 1px solid #333;
  }

  .dropdown-content {
    z-index: 1000; /* في الموبايل 1000 */
  }
}
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          height: 60px;
          padding: 0 20px;
        }

        /* Netflix Style Logo */
        .logo-section {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .netflix-logo {
          display: flex;
          align-items: center;
        }

        .logo-text {
          font-size: 28px;
          font-weight: 700;
          color: #474996;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .logo-text:hover {
          text-shadow: #4747ff;
          transform: scale(1.05);
        }

        .netflix-font {
          font-family: 'Bebas Neue', 'Arial Narrow', Arial, sans-serif;
        }

        /* Navigation Menu */
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          height: 100%;
          gap: 0;
        }

        .nav-item {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: visible !important;
        }

        .nav-link {
          color: #fff;
          text-decoration: none;
          padding: 0 20px;
          height: 100%;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.5px;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #fff;
          background-color: #2a2a2a;
        }

        /* Dropdown Styles */
        .dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .dropdown-arrow {
          color: #666;
          font-size: 12px;
          margin-left: 5px;
        }

     
        .dropdown.active .dropdown-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-link {
          color: #ccc;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          transition: all 0.2s ease;
          font-size: 13px;
          border-bottom: 1px solid #333;
        }

        .dropdown-link:hover {
          background-color: #3a3a3a;
          color: #fff;
        }

        .dropdown-link:last-child {
          border-bottom: none;
        }

        /* Hamburger Menu */
        .hamburger {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          z-index: 1001;
        }

        .hamburger span {
          width: 20px;
          height: 2px;
          background: #ccc;
          margin: 2px 0;
          transition: 0.3s;
          transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 998;
        }

        /* Mobile Styles */
        @media (max-width: 1024px) {
          .hamburger {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            top: 60px;
            left: -100%;
            width: 280px;
            height: calc(100vh - 60px);
            background-color: #1a1a1a;
            flex-direction: column;
            transition: 0.3s ease;
            padding: 0;
            z-index: 999;
            overflow-y: auto;
            border-right: 1px solid #333;
          }

          .nav-menu.active {
            left: 0;
          }

          .nav-item {
            width: 100%;
            height: auto;
            flex-direction: column;
            align-items: stretch;
            border-bottom: 1px solid #333;
              overflow: visible !important;
          }

          .nav-link {
            width: 100%;
            padding: 15px 20px;
            justify-content: space-between;
          }

          .dropdown-content {
            position: static;
            display: none;
            width: 100%;
            box-shadow: none;
            background-color: #2a2a2a;
            border: none;
            border-top: 1px solid #333;
            opacity: 1;
            visibility: visible;
            transform: none;
            transition: none;
          }

          .dropdown.active .dropdown-content {
            display: block;
          }

          .dropdown-link {
            padding: 12px 20px 12px 30px;
            border-bottom: 1px solid #333;
          }

          /* Adjust logo size for mobile */
          .logo-text {
            font-size: 24px;
          }
        }

        /* Tablet Styles */
        @media (max-width: 1200px) and (min-width: 1025px) {
          .nav-link {
            padding: 0 15px;
            font-size: 13px;
          }
          
          .logo-text {
            font-size: 26px;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .logo-text {
            font-size: 22px;
          }
          
          .nav-container {
            padding: 0 15px;
          }
        }
      `}</style>

      {/* Add Google Fonts for Netflix style */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>
    </nav>
  );
};

export default Navbar;