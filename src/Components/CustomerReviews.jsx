import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, CircleUserRound } from 'lucide-react';

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  const reviews = [
    {
      id: 1,
      name: "Rajesh Patel",
      role: "Farm Owner",
      rating: 5,
      image: "/admin.png",
      text: "HydroPlus water pumps are perfect for our agricultural needs. High pressure and very reliable even in remote areas!",
      company: "Patel Farms, Gujarat"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Homeowner",
      rating: 5,
      image: "/admin.png",
      text: "We’ve been using HydroPlus at home for over a year now. The water flow is great, and there’s zero maintenance hassle.",
      company: "Sharma Residence, Delhi"
    },
    {
      id: 3,
      name: "Anil Verma",
      role: "Factory Manager",
      rating: 5,
      image: "/admin.png",
      text: "HydroPlus industrial pumps helped streamline our machinery cooling systems. Great performance and service!",
      company: "Verma Industries, Pune"
    },
    {
      id: 4,
      name: "Sneha Iyer",
      role: "Car Wash Owner",
      rating: 5,
      image: "/admin.png",
      text: "The high-pressure pumps from HydroPlus are perfect for our car wash station. Durable and efficient!",
      company: "Sparkle Car Wash, Bengaluru"
    },
    {
      id: 5,
      name: "Ravi Singh",
      role: "Workshop Supervisor",
      rating: 5,
      image: "/admin.png",
      text: "Using HydroPlus pumps in our automobile workshop has made engine cleaning so much faster and more effective.",
      company: "Singh Auto Works, Lucknow"
    },
    {
      id: 6,
      name: "Neha Desai",
      role: "Housing Society Secretary",
      rating: 5,
      image: "/admin.png",
      text: "We installed HydroPlus pumps in our residential building and the water pressure is perfect across all floors.",
      company: "Greenview Apartments, Mumbai"
    }
  ];


  // Responsive slides per view calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSlidesPerView(3); // Large screens: 3 per slide
      } else if (width >= 768) {
        setSlidesPerView(2); // Medium screens: 2 per slide
      } else {
        setSlidesPerView(1); // Small screens: 1 per slide
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate total slides based on responsive slides per view
  const totalSlides = Math.ceil(reviews.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="w-full relative bg-gradient-to-br from-black via-gray-900 to-black py-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">


        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/30 mb-6 transition-all duration-1000 transform  }`}>
            <Star className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="text-sm sm:text-sm md:text-lg lg:text-3xl xlg:text-3lg font-bold text-white animate-slide-up">
              Customers <span className="text-primary">Testimonials</span>
            </h1>
          </div>
        </div>


        {/* Responsive Swiper */}
        <div className="max-w-5xl mx-auto relative">
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {Array.from({ length: totalSlides }, (_, slideIndex) => {
                const slideReviews = reviews.slice(slideIndex * slidesPerView, slideIndex * slidesPerView + slidesPerView);
                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className={`grid gap-6 px-1 my-2 sm:px-2 md:px-4 ${slidesPerView === 1 ? 'grid-cols-1' : slidesPerView === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      }`}>
                      {slideReviews.map((review) => (
                        <div key={review.id} className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10 hover:border-text-primary-500 transition-all duration-500 hover:scale-105 flex flex-col">
                          {/* Quote Icon */}
                          <div className="flex justify-center items-center mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full flex items-center justify-center">
                              <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                          </div>

                          {/* Review Text */}
                          <div className="text-center mb-4 sm:mb-6 flex-1">
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed italic">
                              "{review.text}"
                            </p>
                          </div>

                          {/* Customer Info */}
                          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            {/* <div className="w-10 h-10 sm:w-12 sm:h-12 align-center justify-center  rounded-full overflow-hidden border-2 border-text-primary-500 flex-shrink-0"> */}
                            {/* <img
                                src={review.image}
                                alt={review.name}
                                className="w-full h-full object-cover object-center"
                              /> */}
                            {/* </div> */}
                            <CircleUserRound size={46} color="#ffffff" strokeWidth={0.75} />
                            <div className="text-left min-w-0 flex-1">
                              <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">{review.name}</h4>
                              <p className="text-gray-400 text-xs truncate">{review.role}</p>
                              <p className="text-primary text-xs font-medium truncate">{review.company}</p>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex justify-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-current" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:left-2 top-1/2 transform -translate-y-1/2  w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/40 z-20 shadow-xl"
          >
            <ChevronLeft className="w-3 h-3 sm:w-2 sm:h-2 md:w-4 md:h-4" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 sm:right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-5 md:w-5 md:h-5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/40 z-20 shadow-xl"
          >
            <ChevronRight className="w-3 h-3 sm:w-2 sm:h-2 md:w-4 md:h-4" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 sm:mt-6 gap-1.5 sm:gap-2 md:gap-3">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 border-2 shadow-lg ${index === currentSlide
                  ? 'bg-primary border-primary scale-125'
                  : 'bg-white/50 border-white/70 hover:bg-white/70'
                  }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 