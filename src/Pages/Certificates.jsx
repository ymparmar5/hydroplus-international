import { useState } from "react";
import { X, ZoomIn, Eye, ShieldCheck, FileText } from "lucide-react";

const certificates = [
  {
    src: "/certificate1.jpg",
    name: "GST Registration",
    description: "Goods and Services Tax Registration Certificate"
  },
  {
    src: "/certificate2.jpg",
    name: "Udyam Registration",
    description: "MSME Registration Certificate"
  },
  {
    src: "/certificate3.jpg",
    name: "ISO Certification",
    description: "International Organization for Standardization"
  },
  {
    src: "/certificate4.jpg",
    name: "Import Export License",
    description: "International Trade Authorization"
  }
];

export default function Certificates() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index) => {
    setImageErrors(prev => new Set([...prev, index]));
  };

  const openModal = (certificate) => {
    setSelectedImage(certificate);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="">
      {/* Header Section */}

      <div className="text-center py-8 px-4">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-500/30 mb-6 transition-all duration-1000 transform`}
            style={{ 'translate3d(0,0,0)': 'translate3d(0,32px,0)', willChange: 'transform, opacity' }}>

            <h1 className="text-sm sm:text-sm md:text-lg lg:text-3xl xlg:text-3lg font-bold text-white">
              Our <span className="text-orange-500">Certificates</span>
            </h1>
            
          </div>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Professional certifications and business registrations validating our expertise and compliance
        </p>
        </div>
      
        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mt-4 rounded-full"
          style={{ background: 'linear-gradient(to right, #ff4300, #cc3600)' }}></div>
      </div>

      {/* Certificates Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {certificates.map((certificate, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-3xl"
            >
              {/* Certificate Number Badge */}
              <div
                className="absolute -top-3 -right-3 z-10 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                style={{ background: 'linear-gradient(135deg, #ff4300, rgba(255, 67, 0, 0.8))' }}
              >
                #{index + 1}
              </div>

              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl">
                {!imageErrors.has(index) ? (
                  <>
                    {/* Loading Skeleton */}
                    {!loadedImages.has(index) && (
                      <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-xl">
                        <div className="flex items-center justify-center h-full">
                          <div
                            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'rgba(255, 67, 0, 0.3)', borderTopColor: 'transparent' }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <img
                      src={certificate.src}
                      alt={certificate.name}
                      className={`w-full h-auto aspect-[4/3] object-cover rounded-xl transition-all duration-500 cursor-pointer ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                        } group-hover:scale-105`}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                      onClick={() => openModal(certificate)}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openModal(certificate)}
                          className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                          <Eye className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                          onClick={() => openModal(certificate)}
                          className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                        >
                          <ZoomIn className="w-5 h-5 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Error State */
                  <div className="aspect-[4/3] bg-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400">
                    <div className="flex justify-center mb-2"><FileText className="w-10 h-10 text-gray-500" /></div>
                    <p className="text-sm text-center px-4 font-medium">{certificate.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Image not available</p>
                  </div>
                )}
              </div>

              {/* Certificate Info */}
              <div className="mt-4 text-center">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {certificate.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {certificate.description}
                </p>
                {/* Status Indicator */}
                <div className="flex items-center justify-center mt-2">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: '#ff4300' }}
                  ></div>
                  <span className="text-xs text-gray-500">Verified & Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-2 md:p-3 rounded-2xl max-w-5xl max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-lg"
            />

            {/* Modal Info */}
            <div className="flex justify-center items-center">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#ff4300' }}
              />
              <h3 className="text-white font-bold text-xl ">
                {selectedImage.name}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* CSS for additional protection */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        
        img {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-select: none !important;
          -webkit-touch-callout: none !important;
          pointer-events: none !important;
        }

        /* Hide scrollbars to prevent right-click on them */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 67, 0, 0.3);
          border-radius: 4px;
        }

        /* Prevent image dragging */
        img::selection {
          background: transparent;
        }
        
        img::-moz-selection {
          background: transparent;
        }

        /* Additional protection for text selection */
        ::selection {
          background: transparent;
        }
        
        ::-moz-selection {
          background: transparent;
        }

        /* Hide text cursor */
        * {
          cursor: default !important;
        }

        button {
          cursor: pointer !important;
        }

        /* Prevent highlighting */
        *:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}