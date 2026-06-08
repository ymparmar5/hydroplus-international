import { useNavigate } from "react-router-dom";
import myContext from "../Context/myContext";
import { useContext, useState, useEffect } from "react";
import Loader from "./Loader";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getProductId } from "../config/api";

const HomeProductCard = () => {
  const navigate = useNavigate();
  const { loading, getAllProduct } = useContext(myContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

const products =
  getAllProduct?.filter((item) => item.bestSell === "true") || [];


  const totalSlides = Math.ceil(products.length / slidesPerView);

  // Responsive slidesPerView
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setSlidesPerView(4); // 2xl screens
      else if (width >= 1280) setSlidesPerView(4); // xl screens
      else if (width >= 1024) setSlidesPerView(3); // lg screens
      else if (width >= 768) setSlidesPerView(2); // md screens
      else setSlidesPerView(1); // sm screens
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to first slide when slidesPerView changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [slidesPerView]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section className="w-full relative bg-gradient-to-br from-black via-gray-900 to-black py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-primary/20 backdrop-blur-sm rounded-full px-5 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 border border-primary/30">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Best <span className="text-primary">Selling</span>
            </h1>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
            <Loader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto relative px-10 sm:px-12 md:px-14 lg:px-16">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => {
                  const slideProducts = products.slice(
                    slideIndex * slidesPerView,
                    slideIndex * slidesPerView + slidesPerView
                  );
                  return (
                    <div
                      key={slideIndex}
                      className="w-full flex-shrink-0"
                    >
                      <div
                        className={`grid gap-4 sm:gap-5 md:gap-6 lg:gap-5 xl:gap-6 ${
                          slidesPerView === 1
                            ? "grid-cols-1 place-items-center max-w-sm mx-auto"
                            : slidesPerView === 2
                            ? "grid-cols-2"
                            : slidesPerView === 3
                            ? "grid-cols-3"
                            : "grid-cols-4"
                        }`}
                      >
                        {slideProducts.map((item) => (
                          <div
                            key={getProductId(item)}
                            onClick={() => navigate(`/productinfo/${getProductId(item)}`)}
                            className="bg-white/5 backdrop-blur-lg rounded-xl p-3 sm:p-4 md:p-5 border border-white/10 hover:border-primary transition-all duration-500 hover:scale-105 cursor-pointer flex flex-col h-full w-full max-w-xs mx-auto"
                          >
                            <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center mb-3 sm:mb-3.5 md:mb-4 rounded-lg">
                              <img
                                src={item.imgurl1}
                                alt={item.title}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <h2 className="text-white text-sm sm:text-base md:text-lg font-semibold text-center uppercase tracking-wide truncate px-1 mb-2">
                              {item.title}
                            </h2>
                            <span className="inline-block h-1 w-8 sm:w-10 rounded bg-primary mb-2 sm:mb-3 self-center"></span>
                            <p className="text-gray-300 text-xs sm:text-sm text-center line-clamp-2 px-1 mb-3">
                              {item.features}
                            </p>

                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute -left-3 sm:-left-5 md:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white border border-white/40 shadow-lg hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute -right-3 sm:-right-5 md:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white border border-white/40 shadow-lg hover:scale-110 transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 gap-2 sm:gap-2.5">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 border-2 shadow-md ${
                    index === currentSlide
                      ? "bg-primary border-primary scale-125"
                      : "bg-white/40 border-white/60 hover:bg-white/70"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProductCard;
