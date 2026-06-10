import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import myContext from '../Context/myContext';

const Footer = () => {
  const { categories } = useContext(myContext);

  const [openDropdowns, setOpenDropdowns] = useState({
    quickLinks: false,
    services: false,
    contact: false
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  return (
    <footer className="w-full bg-gradient-to-br from-black via-gray-900 to-black border-t border-white/10 relative">
      {/* Custom CSS for 425px breakpoint and dropdown animation */}
      <style>{`
        @media (min-width: 426px) {
          .footer-mobile { display: none !important; }
          .footer-desktop { display: block !important; }
        }
        @media (max-width: 425px) {
          .footer-mobile { display: block !important; }
          .footer-desktop { display: none !important; }
        }
        .dropdown-content {
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
          overflow: hidden;
          opacity: 1;
        }
        .dropdown-content.closed {
          max-height: 0;
          opacity: 0;
        }
        .dropdown-content.open {
          max-height: 500px;
          opacity: 1;
        }
      `}</style>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        
        {/* Main Footer Content: 1 col on mobile, 3 col on sm/md, 4 col on lg+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-8">
          
          {/* Company Info - always first column */}
          <div className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
            <img src="/logo.svg" alt="HydroPlus" className="h-10 w-auto mb-1" />
            <h3 className="text-lg sm:text-xl font-bold text-white">HydroPlus International</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">Strenth in every strokes</p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-2">
              Leading provider of premium water treatment and filtration solutions for residential, commercial, and industrial applications.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-2">
              <a href="https://www.facebook.com/people/Hydroplus-International/61576041157055/?mibextid=wwXIfr&rdid=Fbqr3NIgIqq5Eja9&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Hr5PnDc7J%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a href="https://www.instagram.com/hydroplus_international_" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a href="https://in.linkedin.com/in/hydroplus-international-17a643365?original_referer=https%3A%2F%2Fwww.google.com%2F" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a href="https://www.youtube.com/@hydroplusinternational" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.36 0 12 0 12s0 3.64.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.772 20.5 12 20.5 12 20.5s7.228 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.64 24 12 24 12s0-3.64-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Responsive with Dropdown */}
          <div className="w-full text-left">
            {/* Desktop/Tablet View (above 425px) */}
            <div className="footer-desktop">
              <h4 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Quick Links</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">Contact</Link></li>
                <li><Link to="/shop" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">Products</Link></li>
                <li><Link to="/certificates" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">Certificates</Link></li>
                <li><Link to="/exhibitions" className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1">Exhibitions</Link></li>
              </ul>
            </div>
            
            {/* Mobile View with Dropdown (425px and below) */}
            <div className="footer-mobile">
              <button onClick={() => toggleDropdown('quickLinks')} className="w-full flex items-center justify-between text-base font-semibold text-white mb-4 py-2 border-b border-white/10">
                Quick Links
                {openDropdowns.quickLinks ? <ChevronUp className="w-4 h-4 text-white transition-transform duration-300 rotate-180" /> : <ChevronDown className="w-4 h-4 text-white transition-transform duration-300" />}
              </button>
              <div className={`dropdown-content ${openDropdowns.quickLinks ? 'open' : 'closed'}`}>
                <ul className="space-y-2 mb-4">
                  <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Home</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Contact</Link></li>
                  <li><Link to="/shop" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Products</Link></li>
                  <li><Link to="/certificates" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Certificates</Link></li>
                  <li><Link to="/exhibitions" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Exhibitions</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Services - Responsive with Dropdown */}
          {/* FIX: Added missing wrapper div to prevent breaking CSS Grid */}
          <div className="w-full text-left">
            {/* Desktop/Tablet View */}
            <div className="footer-desktop">
              <h4 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Our Categories</h4>
              <ul className="space-y-1 md:space-y-2">
                {categories && Object.keys(categories).map((categoryName, index) => (
                  <li key={index}>
                    <a className="text-gray-400 hover:text-primary transition-colors duration-300 text-xs md:text-sm block py-0.5 md:py-1" href={`/shop/${encodeURIComponent(categoryName)}`}>
                      {categoryName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile View with Dropdown (425px and below) */}
            <div className="footer-mobile">
              <button onClick={() => toggleDropdown('services')} className="w-full flex items-center justify-between text-base font-semibold text-white mb-4 py-2 border-b border-white/10">
                Our Categories
                {openDropdowns.services ? <ChevronUp className="w-4 h-4 text-white transition-transform duration-300 rotate-180" /> : <ChevronDown className="w-4 h-4 text-white transition-transform duration-300" />}
              </button>
              <div className={`dropdown-content ${openDropdowns.services ? 'open' : 'closed'}`}>
                <ul className="space-y-2 mb-4">
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Water Filtration</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Industrial Treatment</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Residential Solutions</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Commercial Systems</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm block py-1">Maintenance & Support</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info - Responsive with Dropdown */}
          <div className="w-full text-left">
            {/* Desktop/Tablet View (above 425px) */}
            <div className="footer-desktop">
              <h4 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Contact Info</h4>
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs md:text-sm">Phone</p>
                    <p className="text-white text-xs md:text-sm truncate"><a href="tel:+918000074088">+91 80000 74088</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs md:text-sm">Email</p>
                    <p className="text-white text-xs md:text-sm truncate">contact.hydroplusinternational@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-xs md:text-sm">Address</p>
                    <p className="text-white text-xs md:text-sm leading-relaxed">Pasodara Rd, opp.Brahamahans Plaza</p>
                    <p className="text-white text-xs md:text-sm leading-relaxed">Pasodara, Kholvad, Surat,</p>
                    <p className="text-white text-xs md:text-sm leading-relaxed">Gujarat, India, 394190</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile View with Dropdown (425px and below) */}
            <div className="footer-mobile">
              <button onClick={() => toggleDropdown('contact')} className="w-full flex items-center justify-between text-base font-semibold text-white mb-4 py-2 border-b border-white/10">
                Contact Info
                {openDropdowns.contact ? <ChevronUp className="w-4 h-4 text-white transition-transform duration-300 rotate-180" /> : <ChevronDown className="w-4 h-4 text-white transition-transform duration-300" />}
              </button>
              <div className={`dropdown-content ${openDropdowns.contact ? 'open' : 'closed'}`}>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-3 h-3 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white text-sm"><a href="tel:+918000074088">+91 80000 74088</a></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-3 h-3 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm align-start">Email</p>
                      <p className="text-white text-sm">contact.hydroplusinternational@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white text-sm leading-relaxed">Surat, Gujarat, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 HydroPlus. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/tandc" className="text-gray-400 hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;