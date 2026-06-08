import React, { useRef, useState, useEffect, useCallback } from "react";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import { getAuth } from "firebase/auth";
import { ArrowRight, Sparkles, Zap, ChevronRight } from "lucide-react";

// Add this line to handle navigation - replace with your actual router setup
const useNavigate = () => {
    return (path) => {
        console.log(`Navigating to: ${path}`);
        window.location.href = path; // ✅ This will actually navigate
    };
}

// Memoized card component to prevent unnecessary re-renders
const CategoryCard = React.memo(({ 
    item, 
    index, 
    isVisible, 
    role, 
    onCategoryClick, 
    onImageUpload 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div
            className={`category-card-wrapper ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
            style={{ 
                animationDelay: `${index * 150}ms`,
                transform: 'translate3d(0,0,0)',
                willChange: 'transform, opacity'
            }}
        >
            <div
                className={`glassmorphic-card ${isHovered ? 'card-hover' : ''}`}
                onClick={() => onCategoryClick(item.name)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform'
                }}
            >
                <img 
                    className="category-image" 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                    style={{
                        transform: 'translateX(-50%) translate3d(0,0,0)',
                        backfaceVisibility: 'hidden',
                        filter: 'none',
                        imageRendering: 'auto'
                    }}
                />
                <div className="glassmorphic-button">{item.name}</div>

                {role === "admin" && (
                    <div className="admin-upload">
                        <input
                            className="upload-input"
                            type="file"
                            onChange={(e) => onImageUpload(e, index)}
                        />
                    </div>
                )}
            </div>

            {/* Enhanced accent rings */}
            <div className="accents">
                <div className="orbital-ring ring-1"></div>
                <div className="orbital-ring ring-2"></div>
                <div className="orbital-ring ring-3"></div>
                <div className="glow-ring"></div>
                <div className="top-light"></div>
                <div className="corner-accent corner-tl"></div>
                <div className="corner-accent corner-tr"></div>
                <div className="corner-accent corner-bl"></div>
                <div className="corner-accent corner-br"></div>
            </div>
        </div>
    );
});

CategoryCard.displayName = 'CategoryCard';

const Category = () => {
    const [category, setCategory] = useState([]);
    const [role, setRole] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const observerRef = useRef(null);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user?.email) {
            // setRole("admin");
        }
    }, [user]);

    // Throttled intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting !== isVisible) {
                    setIsVisible(entry.isIntersecting);
                }
            },
            { 
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
        
        observerRef.current = observer;
        
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        
        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [isVisible]);

    // Fetch categories from Firestore
    const fetchCategories = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(fireDB, "categories"));
            const categoryList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategory(categoryList);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Upload image to Cloudinary and update Firestore
    const handleImageUpload = useCallback(async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!user) {
            alert("You must be logged in to upload images.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "category");

            const response = await fetch("https://api.cloudinary.com/v1_1/hydroplus/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.secure_url) throw new Error("Cloudinary upload failed");

            const categoryRef = doc(fireDB, "categories", category[index].id);
            await setDoc(categoryRef, { ...category[index], image: data.secure_url });

            fetchCategories();
        } catch (error) {
            console.error("Image upload failed", error);
        }
    }, [user, category, fetchCategories]);

    const handleCategoryClick = useCallback((name) => {
        navigate(`/shop/${name}`);
    }, [navigate]);

    return (
        <>
            <style>{`
                @import url("https://fonts.cdnfonts.com/css/mona-sans");
                
                /* Optimized animations with GPU acceleration */
                @keyframes rotate360 {
                    0% { transform: translate3d(0,0,0) rotate(0deg); }
                    100% { transform: translate3d(0,0,0) rotate(360deg); }
                }
                
                @keyframes rotateReverse {
                    0% { transform: translate3d(0,0,0) rotate(0deg); }
                    100% { transform: translate3d(0,0,0) rotate(-360deg); }
                }
                
                @keyframes pulse-ring {
                    0%, 100% { 
                        opacity: 0.6;
                        transform: translate3d(0,0,0) scale(1);
                    }
                    50% { 
                        opacity: 0.9;
                        transform: translate3d(0,0,0) scale(1.02);
                    }
                }
                
                @keyframes fade-in-up {
                    0% { 
                        opacity: 0; 
                        transform: translate3d(0, 40px, 0) scale(0.95); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translate3d(0, 0, 0) scale(1); 
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(0, -20px, 0); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(0, -30px, 0); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    33% { transform: translate3d(10px, -15px, 0); }
                    66% { transform: translate3d(-10px, 10px, 0); }
                }
                
                @keyframes corner-glow {
                    0%, 100% { 
                        opacity: 0.5; 
                        box-shadow: 0 0 8px rgba(255, 128, 0, 0.3);
                    }
                    50% { 
                        opacity: 1; 
                        box-shadow: 0 0 15px rgba(255, 128, 0, 0.6);
                    }
                }
                
                /* Main card styles */
                .glassmorphic-card {
                    position: relative;
                    width: 100%;
                    max-width: 320px;
                    margin-left: auto;
                    margin-right: auto;
                    height: 350px;
                    border-radius: 20px;
                    background: linear-gradient(180deg, rgba(255, 67, 0, 0.12) 0%, rgba(25, 25, 25, 0.85) 70%);
                    box-shadow: 
                        inset 0 2px 4px 0 rgba(255, 148, 61, 0.3),
                        inset 0 -2px 4px 0 rgba(0, 0, 0, 0.3),
                        0 10px 40px rgba(0, 0, 0, 0.5),
                        0 4px 8px rgba(255, 67, 0, 0.1);
                    color: #ccc;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    font-family: "Mona-Sans", "Mona Sans", sans-serif;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
                    margin-top: 20px;
                    margin-bottom: 20px;
                    transform: translate3d(0,0,0);
                    backface-visibility: hidden;
                    will-change: transform;
                    border: 1px solid rgba(255, 128, 0, 0.15);
                    overflow: visible;
                }
                
                .card-hover {
                    transform: translate3d(0, -8px, 0) scale(1.02) !important;
                    box-shadow: 
                        inset 0 2px 4px 0 rgba(255, 148, 61, 0.4),
                        inset 0 -2px 4px 0 rgba(0, 0, 0, 0.3),
                        0 20px 50px rgba(255, 67, 0, 0.25),
                        0 8px 16px rgba(0, 0, 0, 0.4);
                }
                
                .glassmorphic-button {
                    width: fit-content;
                    border-radius: 100px;
                    padding: 10px 40px;
                    margin: 12px auto 0 auto;
                    background: linear-gradient(135deg, rgba(255, 67, 0, 0.95) 0%, rgba(255, 100, 0, 0.9) 100%);
                    color: white;
                    border: 1px solid rgba(255, 128, 0, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95rem;
                    letter-spacing: 0.5px;
                    transform: translate3d(0,0,0);
                    text-align: center;
                    display: block;
                    box-shadow: 0 4px 12px rgba(255, 67, 0, 0.3);
                }
                
                .glassmorphic-button:hover {
                    background: linear-gradient(135deg, rgba(255, 100, 0, 1) 0%, rgba(255, 67, 0, 0.95) 100%);
                    box-shadow: 
                        0 0 20px rgba(255, 67, 0, 0.5),
                        0 6px 16px rgba(255, 67, 0, 0.4),
                        inset 0 1px 1px rgba(255, 255, 255, 0.2);
                    transform: translate3d(0, -2px, 0) scale(1.05);
                }
                
                .category-image {
                    position: absolute;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%) translate3d(0,0,0);
                    width: 90%;
                    height: 220px;
                    max-width: 240px;
                    object-fit: contain;
                    object-position: center;
                    user-select: none;
                    pointer-events: none;
                    border-radius: 12px;
                    backface-visibility: hidden;
                    image-rendering: auto;
                    z-index: 10;
                    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
                    transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .card-hover .category-image {
                    transform: translateX(-50%) translate3d(0, -8px, 0) scale(1.05);
                    filter: drop-shadow(0 12px 24px rgba(255, 67, 0, 0.2));
                }
                
                .admin-upload {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 30;
                }
                
                .upload-input {
                    width: 80px;
                    font-size: 12px;
                    padding: 4px;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    cursor: pointer;
                    color: white;
                }
                
                /* Enhanced accent elements */
                .accents {
                    user-select: none;
                    pointer-events: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    will-change: transform;
                    z-index: -1;
                }
                
                /* Orbital rings - smaller and contained */
                .orbital-ring {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    border: 1.5px solid;
                    will-change: transform;
                }
                
                .ring-1 {
                    width: 85%;
                    height: 85%;
                    border-color: rgba(255, 128, 0, 0.12);
                    animation: rotate360 20s linear infinite;
                }
                
                .ring-2 {
                    width: 75%;
                    height: 75%;
                    border-color: rgba(255, 148, 61, 0.15);
                    border-style: dashed;
                    border-width: 1px;
                    animation: rotateReverse 25s linear infinite;
                }
                
                .ring-3 {
                    width: 95%;
                    height: 95%;
                    border-color: rgba(255, 67, 0, 0.08);
                    animation: pulse-ring 4s ease-in-out infinite;
                }
                
                /* Glow ring */
                .glow-ring {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    height: 90%;
                    border-radius: 50%;
                    background: radial-gradient(circle, transparent 65%, rgba(255, 128, 0, 0.05) 85%, transparent 100%);
                    animation: pulse-ring 3s ease-in-out infinite;
                    will-change: transform, opacity;
                }
                
                /* Top light bar */
                .top-light {
                    position: absolute;
                    left: 50%;
                    bottom: -35px;
                    transform: translateX(-50%);
                    width: 65%;
                    max-width: 250px;
                    height: 5px;
                    border-radius: 10px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 199, 142, 0.7) 25%, 
                        rgba(255, 239, 249, 0.9) 50%, 
                        rgba(255, 199, 142, 0.7) 75%, 
                        transparent 100%);
                    box-shadow: 
                        0 0 8px 1px rgba(255, 199, 142, 0.5),
                        0 0 15px 3px rgba(255, 158, 61, 0.3),
                        0 0 30px 6px rgba(255, 128, 0, 0.15);
                    animation: pulse-ring 2s ease-in-out infinite;
                }
                
                /* Corner accents - more visible */
                .corner-accent {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 2.5px solid rgba(255, 128, 0, 0.6);
                    animation: corner-glow 3s ease-in-out infinite;
                }
                
                .corner-tl {
                    top: -2px;
                    left: -2px;
                    border-right: none;
                    border-bottom: none;
                    border-top-left-radius: 18px;
                }
                
                .corner-tr {
                    top: -2px;
                    right: -2px;
                    border-left: none;
                    border-bottom: none;
                    border-top-right-radius: 18px;
                    animation-delay: 0.75s;
                }
                
                .corner-bl {
                    bottom: -2px;
                    left: -2px;
                    border-right: none;
                    border-top: none;
                    border-bottom-left-radius: 18px;
                    animation-delay: 1.5s;
                }
                
                .corner-br {
                    bottom: -2px;
                    right: -2px;
                    border-left: none;
                    border-top: none;
                    border-bottom-right-radius: 18px;
                    animation-delay: 2.25s;
                }
                
                /* Animation classes */
                .fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
                }
                
                /* Background animations */
                .bg-float-1 { 
                    animation: float 8s ease-in-out infinite;
                    will-change: transform;
                }
                .bg-float-2 { 
                    animation: float-delayed 10s ease-in-out infinite 2s;
                    will-change: transform;
                }
                .bg-float-3 { 
                    animation: float-slow 12s ease-in-out infinite 4s;
                    will-change: transform;
                }
                
                /* Category card wrapper */
                .category-card-wrapper {
                    position: relative;
                    opacity: 0;
                    transform: translate3d(0, 40px, 0) scale(0.95);
                    will-change: transform, opacity;
                    padding: 10px 0;
                }
                
                /* Performance optimizations */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .glassmorphic-card {
                        height: 300px;
                        max-width: 280px;
                    }
                    
                    .category-image {
                        height: 170px;
                        top: 20px;
                    }
                    
                    .top-light {
                        bottom: -30px;
                        width: 60%;
                        height: 4px;
                    }
                    
                    .corner-accent {
                        width: 30px;
                        height: 30px;
                        border-width: 2px;
                    }
                    
                    .orbital-ring {
                        border-width: 1px;
                    }
                }
                
                @media (max-width: 480px) {
                    .glassmorphic-card {
                        height: 280px;
                        max-width: 260px;
                    }
                    
                    .category-image {
                        height: 150px;
                        top: 18px;
                    }
                    
                    .glassmorphic-button {
                        padding: 8px 32px;
                        font-size: 0.875rem;
                    }
                    
                    .corner-accent {
                        width: 25px;
                        height: 25px;
                    }
                    
                    .top-light {
                        bottom: -25px;
                        height: 3px;
                    }
                }
                
                /* Reduce motion for users who prefer it */
                @media (prefers-reduced-motion: reduce) {
                    .orbital-ring,
                    .glow-ring,
                    .top-light,
                    .corner-accent,
                    .bg-float-1,
                    .bg-float-2,
                    .bg-float-3 {
                        animation: none !important;
                    }
                }
            `}</style>
            
            <section className="w-full relative bg-gradient-to-br from-black via-gray-900 to-black pt-6 pb-20 md:pt-8 md:pb-16 overflow-hidden">
                {/* Background elements with optimized animations */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-1/4 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl bg-float-1" 
                        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}></div>
                    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl bg-float-2"
                        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/4 rounded-full blur-3xl bg-float-3"
                        style={{ transform: 'translate3d(-50%, -50%, 0)', willChange: 'transform' }}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
                </div>

                <div className="container mx-auto p-4 relative z-10" ref={containerRef}>
                    <div className="text-center mb-12">
                        <div className={`inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-500/30 mb-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                            style={{ transform: isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,32px,0)', willChange: 'transform, opacity' }}>
                            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                            <h1 className="text-sm sm:text-sm md:text-lg lg:text-3xl xlg:text-3lg font-bold text-white">
                                Featured <span className="text-orange-500">Categories</span>
                            </h1>
                        </div>
                    </div>  

                    <div className="max-w-7xl mx-auto px-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
                            {category.map((item, index) => {
                                return (
                                    <CategoryCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isVisible={isVisible}
                                        role={role}
                                        onCategoryClick={handleCategoryClick}
                                        onImageUpload={handleImageUpload}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Category;