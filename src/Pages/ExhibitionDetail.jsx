import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import myContext from '../Context/myContext';

const ExhibitionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getExhibitionById, getPublishedExhibitions } = useContext(myContext);
    
    const [exhibition, setExhibition] = useState(null);
    const [otherExhibitions, setOtherExhibitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchExhibition = async () => {
            try {
                setLoading(true);
                const data = await getExhibitionById(id);
                if (data && data.status === 'published') {
                    setExhibition(data);
                    
                    // Get other exhibitions
                    const published = getPublishedExhibitions();
                    const others = published.filter(ex => ex.id !== id).slice(0, 8);
                    setOtherExhibitions(others);
                } else {
                    navigate('/exhibitions');
                }
            } catch (error) {
                console.error("Error fetching exhibition:", error);
                navigate('/exhibitions');
            } finally {
                setLoading(false);
            }
        };

        fetchExhibition();
    }, [id, getExhibitionById, getPublishedExhibitions, navigate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const openImageModal = (sectionIndex, imageIndex) => {
        setSelectedImageIndex({ sectionIndex, imageIndex });
    };

    const closeImageModal = () => {
        setSelectedImageIndex(null);
    };

    const navigateImage = (direction) => {
        if (!selectedImageIndex || !exhibition) return;
        
        const { sectionIndex, imageIndex } = selectedImageIndex;
        const currentSection = exhibition.sections[sectionIndex];
        
        if (direction === 'next') {
            if (imageIndex < currentSection.images.length - 1) {
                setSelectedImageIndex({ sectionIndex, imageIndex: imageIndex + 1 });
            } else if (sectionIndex < exhibition.sections.length - 1) {
                setSelectedImageIndex({ sectionIndex: sectionIndex + 1, imageIndex: 0 });
            }
        } else {
            if (imageIndex > 0) {
                setSelectedImageIndex({ sectionIndex, imageIndex: imageIndex - 1 });
            } else if (sectionIndex > 0) {
                const prevSection = exhibition.sections[sectionIndex - 1];
                setSelectedImageIndex({ sectionIndex: sectionIndex - 1, imageIndex: prevSection.images.length - 1 });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="flex items-center space-x-2 text-white">
                    <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Loading exhibition...</span>
                </div>
            </div>
        );
    }

    if (!exhibition) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Exhibition not found</h2>
                    <Link to="/exhibitions" className="text-primary-400 hover:text-primary-300">
                        ← Back to exhibitions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header Image */}
            {exhibition.headerImage && (
                <div className="relative h-64 md:h-96 bg-gray-800">
                    <img
                        src={exhibition.headerImage}
                        alt={exhibition.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    
                    {/* Header Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="container mx-auto">
                            <nav className="mb-4">
                                <Link to="/exhibitions" className="text-primary-400 hover:text-primary-300 text-sm">
                                    ← Back to Exhibitions
                                </Link>
                            </nav>
                            <div className="flex items-center mb-2">
                                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium mr-3">
                                    Exhibition
                                </span>
                                <span className="text-gray-300 text-sm">
                                    {formatDate(exhibition.publishedDate)}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white">
                                {exhibition.title}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {/* No Header Image Layout */}
            {!exhibition.headerImage && (
                <div className="bg-gray-800 py-12">
                    <div className="container mx-auto px-4">
                        <nav className="mb-6">
                            <Link to="/exhibitions" className="text-primary-400 hover:text-primary-300">
                                ← Back to Exhibitions
                            </Link>
                        </nav>
                        <div className="flex items-center mb-4">
                            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium mr-3">
                                Exhibition
                            </span>
                            <span className="text-gray-300">
                                {formatDate(exhibition.publishedDate)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white">
                            {exhibition.title}
                        </h1>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="space-y-12">
                            {exhibition.sections.map((section, sectionIndex) => (
                                <section key={section.id} className="bg-gray-800 rounded-lg p-6 md:p-8 border border-gray-700">
                                    {section.sectionTitle && (
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                            {section.sectionTitle}
                                        </h2>
                                    )}
                                    
                                    {section.description && (
                                        <div className="prose prose-invert max-w-none mb-8">
                                            <p className="text-gray-300 leading-relaxed text-lg">
                                                {section.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Section Images */}
                                    {section.images && section.images.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {section.images.filter(img => img.trim()).map((image, imageIndex) => (
                                                <div
                                                    key={imageIndex}
                                                    className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-700"
                                                    onClick={() => openImageModal(sectionIndex, imageIndex)}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${section.sectionTitle || 'Section'} Image ${imageIndex + 1}`}
                                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                        <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden w-full mb-4 bg-gray-800 text-white p-3 rounded-lg flex items-center justify-between border border-gray-700"
                        >
                            <span>Other Exhibitions</span>
                            <svg 
                                className={`h-5 w-5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Sidebar Content */}
                        <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
                                <h3 className="text-xl font-bold text-white mb-6">Other Exhibitions</h3>
                                
                                {otherExhibitions.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">No other exhibitions available</p>
                                ) : (
                                    <div className="space-y-4">
                                        {otherExhibitions.map((otherExhibition) => (
                                            <Link
                                                key={otherExhibition.id}
                                                to={`/exhibitionDetail/${otherExhibition.id}`}
                                                className="block group"
                                            >
                                                <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 hover:border-primary-500">
                                                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                                        {otherExhibition.headerImage ? (
                                                            <img
                                                                src={otherExhibition.headerImage}
                                                                alt={otherExhibition.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors truncate">
                                                            {otherExhibition.title}
                                                        </h4>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {formatDate(otherExhibition.publishedDate)}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {otherExhibition.sections?.length || 0} sections
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <Link
                                        to="/exhibitions"
                                        className="block text-center text-primary-400 hover:text-primary-300 text-sm font-medium"
                                    >
                                        View All Exhibitions →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImageIndex && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl w-full max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => navigateImage('prev')}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => navigateImage('next')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Image */}
                        <img
                            src={exhibition.sections[selectedImageIndex.sectionIndex].images[selectedImageIndex.imageIndex]}
                            alt="Full size view"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExhibitionDetail;