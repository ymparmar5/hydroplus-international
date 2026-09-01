import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import myContext from '../Context/myContext';

const Exhibitions = () => {
    const { exhibitions, getPublishedExhibitions } = useContext(myContext);
    const [filteredExhibitions, setFilteredExhibitions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        const published = getPublishedExhibitions();
        let sorted = [...published];

        // Sort exhibitions
        if (sortBy === "newest") {
            sorted.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        } else if (sortBy === "oldest") {
            sorted.sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate));
        } else if (sortBy === "title") {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Filter by search term
        if (searchTerm) {
            sorted = sorted.filter(exhibition =>
                exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exhibition.sections.some(section =>
                    section.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    section.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        setFilteredExhibitions(sorted);
    }, [exhibitions, searchTerm, sortBy, getPublishedExhibitions]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const inputClass = "border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-700 text-white placeholder-gray-400";

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Exhibitions
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Discover our curated collection of exhibitions showcasing innovation, 
                        creativity, and excellence in various fields.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search exhibitions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${inputClass} w-full`}
                        />
                    </div>
                    <div className="md:w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`${inputClass} w-full`}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Alphabetical</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-center mb-6">
                    <p className="text-gray-400">
                        {filteredExhibitions.length} exhibition{filteredExhibitions.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {/* Exhibitions Grid */}
                {filteredExhibitions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No exhibitions found</h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? "Try adjusting your search terms" 
                                : "Check back later for new exhibitions"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExhibitions.map((exhibition) => (
                            <Link 
                                key={exhibition.id} 
                                to={`/exhibitionDetail/${exhibition.id}`}
                                className="group"
                            >
                                <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-700 hover:border-primary-500">
                                    {/* Header Image */}
                                    <div className="relative h-48 bg-gray-700">
                                        {exhibition.headerImage ? (
                                            <img
                                                src={exhibition.headerImage}
                                                alt={exhibition.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                Exhibition
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                {formatDate(exhibition.publishedDate)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                                            {exhibition.title}
                                        </h3>

                                        {/* First section preview */}
                                        {exhibition.sections && exhibition.sections.length > 0 && (
                                            <div className="mb-4">
                                                {exhibition.sections[0].sectionTitle && (
                                                    <h4 className="text-primary-400 text-sm font-medium mb-1">
                                                        {exhibition.sections[0].sectionTitle}
                                                    </h4>
                                                )}
                                                {exhibition.sections[0].description && (
                                                    <p className="text-gray-300 text-sm">
                                                        {truncateText(exhibition.sections[0].description)}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <span>{exhibition.sections?.length || 0} sections</span>
                                            <span className="flex items-center text-primary-400 group-hover:text-primary-300 font-medium">
                                                View Exhibition
                                                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Load More Button (if you want to implement pagination later) */}
                {filteredExhibitions.length > 0 && (
                    <div className="text-center mt-12">
                        <div className="inline-flex items-center text-gray-400 text-sm">
                            <div className="h-px bg-gray-600 w-16 mr-4"></div>
                            <span>End of exhibitions</span>
                            <div className="h-px bg-gray-600 w-16 ml-4"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exhibitions;