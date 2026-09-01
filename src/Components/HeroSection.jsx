import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { fireDB } from '../FireBase/FireBaseConfig';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const SLIDE_INTERVAL = 4000;

// High-quality placeholder generator
const generatePlaceholder = (width = 1920, height = 800) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="25%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#334155;stop-opacity:1" />
          <stop offset="75%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
        <pattern id="heroPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <circle cx="30" cy="30" r="1" fill="#334155" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite"/>
          </circle>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#heroGrad)"/>
      <rect width="100%" height="100%" fill="url(#heroPattern)"/>
    </svg>
  `)}`;
};

const HeroSection = () => {
  // State initialization - NO PLACEHOLDER START
  const [slides, setSlides] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [preloadQueue] = useState(new Map());

  // Refs for performance
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const firstLoadCompleteRef = useRef(false);
  const preloadManagerRef = useRef(new Map());

  // Optimized image preloader with priority queue
  const preloadImage = useCallback((src, index, priority = 'normal') => {
    if (!src || !isMountedRef.current || loadedImages.has(index)) {
      return Promise.resolve(true);
    }

    // Check if already in progress
    if (preloadManagerRef.current.has(src)) {
      return preloadManagerRef.current.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();

      // Set priority attributes
      if (priority === 'high') {
        img.fetchPriority = 'high';
        img.loading = 'eager';
        img.decoding = 'sync';
      } else {
        img.loading = 'lazy';
        img.decoding = 'async';
      }

      img.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => {
        console.warn(`Image preload timeout: ${src}`);
        reject(new Error('Timeout'));
      }, priority === 'high' ? 8000 : 15000);

      img.onload = () => {
        clearTimeout(timeout);
        if (isMountedRef.current) {
          setLoadedImages(prev => new Set([...prev, index]));
          resolve(true);
        }
      };

      img.onerror = (err) => {
        clearTimeout(timeout);
        console.error(`Failed to preload image ${src}:`, err);
        reject(err);
      };

      // Start loading
      img.src = src;
    });

    preloadManagerRef.current.set(src, promise);
    return promise;
  }, [loadedImages]);

  // Intelligent preload manager
  const managePreloading = useCallback((currentIndex, slideData) => {
    if (!slideData.length) return;

    // Priority order: current, next, previous, then rest
    const totalSlides = slideData.length;
    const next1 = (currentIndex + 1) % totalSlides;
    const next2 = (currentIndex + 2) % totalSlides;
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;

    // High priority: current and next
    const highPriorityPromises = [
      preloadImage(slideData[currentIndex]?.src, currentIndex, 'high'),
      preloadImage(slideData[next1]?.src, next1, 'high')
    ];

    // Medium priority: previous and next+1
    const mediumPriorityPromises = [
      preloadImage(slideData[prev]?.src, prev, 'normal'),
      preloadImage(slideData[next2]?.src, next2, 'normal')
    ];

    // Execute high priority immediately
    Promise.allSettled(highPriorityPromises).then(() => {
      if (!firstLoadCompleteRef.current) {
        firstLoadCompleteRef.current = true;
        setIsInitialLoading(false);
      }

      // Then handle medium priority
      setTimeout(() => {
        Promise.allSettled(mediumPriorityPromises);
      }, 100);

      // Low priority: remaining slides
      setTimeout(() => {
        slideData.forEach((slide, index) => {
          if (![currentIndex, next1, prev, next2].includes(index)) {
            preloadImage(slide.src, index, 'low');
          }
        });
      }, 500);
    });
  }, [preloadImage]);

  // Optimized data fetcher - REMOVED CACHE
  const fetchSlides = useCallback(async () => {
    try {
      // Fetch fresh data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const querySnapshot = await getDocs(collection(fireDB, "Images"));
      clearTimeout(timeoutId);

      const homeImages = [];
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.type === "home") homeImages.push(data);
      });

      if (homeImages.length === 0) {
        setIsInitialLoading(false);
        return;
      }

      // Sort and process images
      homeImages.sort((a, b) => (b.time?.seconds || 0) - (a.time?.seconds || 0));
      const latest = homeImages[0];

      const newSlides = [];
      // Check all 10 possible image slots
      for (let i = 1; i <= 10; i++) {
        const imgUrl = latest[`imgurl${i}`];
        if (imgUrl && imgUrl.trim() !== "") {
          newSlides.push({
            src: imgUrl,
            alt: `Slide ${i}`,
            name: `Slide ${i}`,
          });
        }
      }

      if (newSlides.length > 0) {
        setSlides(newSlides);

        // Start aggressive preloading
        requestAnimationFrame(() => {
          managePreloading(0, newSlides);
        });
      } else {
        setIsInitialLoading(false);
      }

    } catch (error) {
      console.error('Failed to fetch slides:', error);
      setIsInitialLoading(false);
    }
  }, [managePreloading]);

  // Initialize on mount
  useEffect(() => {
    fetchSlides();

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchSlides]);

  // Auto-slideshow with smart preloading
  useEffect(() => {
    if (slides.length <= 1 || !isPlaying) return;

    intervalRef.current = setInterval(() => {
      setSlideIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % slides.length;

        // Preload around new index
        requestAnimationFrame(() => {
          managePreloading(nextIndex, slides);
        });

        return nextIndex;
      });
    }, SLIDE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides, isPlaying, managePreloading]);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    const nextIndex = (slideIndex + 1) % slides.length;
    setSlideIndex(nextIndex);
    managePreloading(nextIndex, slides);
  }, [slideIndex, slides, managePreloading]);

  const prevSlide = useCallback(() => {
    const prevIndex = (slideIndex - 1 + slides.length) % slides.length;
    setSlideIndex(prevIndex);
    managePreloading(prevIndex, slides);
  }, [slideIndex, slides, managePreloading]);

  const goToSlide = useCallback((index) => {
    if (index === slideIndex) return;
    setSlideIndex(index);
    managePreloading(index, slides);
  }, [slideIndex, slides, managePreloading]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Memoized background elements
  const backgroundElements = useMemo(() => (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
    </div>
  ), []);

  // Memoized hero content
  const heroContent = useMemo(() => (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex items-center justify-start pointer-events-none">

    </div>
  ), []);

  // Loading state - show placeholder until first slide loads
  if (isInitialLoading || slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden">
        {backgroundElements}
        <div className="relative w-full">
          <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
            <img
              className="w-full h-full object-cover object-center"
              src={generatePlaceholder()}
              alt="Loading..."
              style={{ minHeight: '50vh' }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          {heroContent}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      {backgroundElements}

      <div className="relative w-full">
        <div className="relative w-full">
          {slides.map((slide, index) => {
            const isActive = index === slideIndex;
            const isLoaded = loadedImages.has(index);

            return (
              <div
                key={`slide-${index}-${slide.src}`}
                className={`w-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                  }`}
                style={{ display: isActive ? 'block' : 'block' }}
              >
                <div className="relative w-full">
                  <img
                    className="w-full h-auto sm:object-cover object-contain sm:object-center object-center"
                    src={slide.src}
                    alt={slide.alt}
                    loading={index <= 1 ? "eager" : "lazy"}
                    decoding={index === slideIndex ? "sync" : "async"}
                    style={{
                      filter: isLoaded ? 'blur(0px)' : 'blur(2px)',
                      transition: 'filter 0.3s ease-out',
                      minHeight: window.innerWidth >= 640 ? '50vh' : 'auto',
                      transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
                    }}
                    onLoad={() => {
                      if (!loadedImages.has(index)) {
                        setLoadedImages(prev => new Set([...prev, index]));
                      }
                    }}
                    onError={(e) => {
                      console.warn(`Image load error for slide ${index}`);
                      e.target.src = generatePlaceholder();
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          className="hidden lg:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/10 hover:bg-black/10 backdrop-blur-sm rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/30 z-20 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden lg:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/10 hover:bg-black/10 backdrop-blur-sm rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/30 z-20 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </button>
        {heroContent}
      </div>
    </section>
  );
};

export default HeroSection;