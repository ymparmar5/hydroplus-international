import React, { useRef, useState, useEffect, useCallback } from "react";
import "../Style/Category.css";
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
            <section className="w-full relative pt-6 pb-20 md:pt-8 md:pb-16 overflow-hidden">


                <div className="container mx-auto p-4 relative z-10" ref={containerRef}>
                    <div className="text-center mb-12">
                        <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-500/30 mb-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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