import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";

const DEFAULT_GALLERY_IMAGES = [
  "/1 (6).jpg",
  "/1 (5).jpg",
  "/1 (4).jpg",
  "/1 (3).jpg",
  "/1 (2).jpg",
  "/1 (1).jpg",
  "/1 (1).jpeg",
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
];

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY_IMAGES);
  
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(fireDB, "gallery"), orderBy("time", "desc"));
        const querySnapshot = await getDocs(q);
        const imagesList = querySnapshot.docs.map(doc => doc.data().imageUrl);
        if (imagesList.length > 0) {
          setGalleryImages(imagesList);
        }
      } catch (error) {
        console.error("Error fetching gallery images: ", error);
      }
    };
    fetchGallery();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <img
          src={galleryImages[0] || "/1 (6).jpg"}
          alt="" // ✅ alt text हटाया ताकि hover पर कुछ ना दिखे
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-orange-500 tracking-wide drop-shadow-lg">
            Our Gallery
          </h1>
        </div>
      </div>

      {/* Intro Content */}
      <div className="max-w-4xl text-center px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4">
          Moments We Cherish
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Our journey has been filled with incredible moments, showcasing our
          products, our team, and the trust of our clients. Each image tells a
          story of dedication, hard work, and the promise of quality that
          HydroPlus stands for.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 max-w-7xl w-full pb-16">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
            onClick={() => openModal(idx)}
          >
            <img
              src={img}
              alt="" // ✅ alt खाली ताकि hover पर कोई "image 6" text ना दिखे
              className="w-full h-64 object-cover transform hover:scale-110 transition duration-500"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-orange-500 hover:text-orange-400 text-4xl font-bold z-60 transition-colors duration-200"
          >
            ×
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 text-orange-500 hover:text-orange-400 text-6xl font-bold z-60 transition-colors duration-200 hover:scale-110 transform"
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 text-orange-500 hover:text-orange-400 text-6xl font-bold z-60 transition-colors duration-200 hover:scale-110 transform"
          >
            ›
          </button>

          {/* Modal Content */}
          <div className="max-w-4xl max-h-full mx-4">
            <img
              src={galleryImages[currentImageIndex]}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Counter */}
            <div className="text-center mt-4">
              <span className="text-orange-400 font-semibold">
                {currentImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          </div>

          {/* Background Click to Close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeModal}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Gallery;