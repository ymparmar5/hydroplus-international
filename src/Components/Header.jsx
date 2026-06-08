import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showGalleryDropdown, setShowGalleryDropdown] = useState(false);
  const [showMobileGalleryDropdown, setShowMobileGalleryDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/80 backdrop-blur-lg border-b border-white/10'
        : 'bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-sm'
      }`}>
      <div className="mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <img
                src="/logo.svg"
                alt="logo"
                className="h-10 sm:h-12 md:h-14  lg:h-16 xl:h-20 object-contain  p-0 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </NavLink>

          {/* Desktop Navigation - Only show on xl screens and up */}
          <nav className="hidden xl:flex items-center gap-2 2xl:gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm 2xl:text-base font-medium px-3 2xl:px-4 py-2 rounded-xl transition-all duration-300 relative group ${isActive
                  ? 'text-primary bg-primary/20 border border-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Home
              <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-sm 2xl:text-base font-medium px-3 2xl:px-4 py-2 rounded-xl transition-all duration-300 relative group ${isActive
                  ? 'text-primary bg-primary/20 border border-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Shop
              <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm 2xl:text-base font-medium px-3 2xl:px-4 py-2 rounded-xl transition-all duration-300 relative group ${isActive
                  ? 'text-primary bg-primary/20 border border-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Contact
              <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>

            {/* Gallery Dropdown */}
           {/* Gallery Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowGalleryDropdown(true)}
              onMouseLeave={() => setShowGalleryDropdown(false)}
            >
              <button className="text-sm 2xl:text-base font-medium px-3 2xl:px-4 py-2 rounded-xl transition-all duration-300 relative group text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1">
                Gallery
                <ChevronDown className="w-3 h-3" />
                <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {showGalleryDropdown && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden min-w-[160px] animate-slide-down">
                    <NavLink
                      to="/gallery"
                      className={({ isActive }) =>
                        `block text-sm 2xl:text-base font-medium px-4 py-2 transition-all duration-300 ${isActive
                          ? 'text-primary bg-primary/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      Gallery
                    </NavLink>
                    <NavLink
                      to="/exhibitions"
                      className={({ isActive }) =>
                        `block text-sm 2xl:text-base font-medium px-4 py-2 transition-all duration-300 ${isActive
                          ? 'text-primary bg-primary/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      Exhibitions
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm 2xl:text-base font-medium px-3 2xl:px-4 py-2 rounded-xl transition-all duration-300 relative group ${isActive
                  ? 'text-primary bg-primary/20 border border-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              About
              <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>
          </nav>

          {/* Search Bar - Only show on large screens */}
          <div className="hidden lg:flex xl:hidden items-center justify-center flex-1 max-w-sm mx-4">
            <SearchBar />
          </div>

          {/* Search Bar - Desktop XL+ */}
          <div className="hidden xl:flex items-center gap-4 flex-1 max-w-md mx-6 2xl:mx-8">
            <SearchBar />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Icon - Mobile/Tablet */}
            <button
              className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              aria-label="Toggle search bar"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* User Icon */}
            <Link to="/admin" className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden mt-2 mb-4 px-2">
            <SearchBar onClose={() => setShowMobileSearch(false)} />
          </div>
        )}

        {/* Mobile/Tablet Navigation */}
        {isMobileMenuOpen && (
          <nav className="xl:hidden mt-4 mb-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 animate-slide-down">
            <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-primary bg-primary/20 border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-primary bg-primary/20 border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-primary bg-primary/20 border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Contact
              </NavLink>

              {/* Mobile Gallery Dropdown */}
              <div>
                <button
                  onClick={() => setShowMobileGalleryDropdown(!showMobileGalleryDropdown)}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Gallery
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMobileGalleryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMobileGalleryDropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    <NavLink
                      to="/gallery"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                          ? 'text-primary bg-primary/20 border border-primary/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      Gallery
                    </NavLink>
                    <NavLink
                      to="/exhibitions"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                          ? 'text-primary bg-primary/20 border border-primary/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      Exhibitions
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-primary bg-primary/20 border border-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                About
              </NavLink>
            </div>
          </nav>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          0% { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slide-down { 
          animation: slide-down 0.3s ease-out; 
        }
      `}</style>
    </header>
  );
};

export default Header;