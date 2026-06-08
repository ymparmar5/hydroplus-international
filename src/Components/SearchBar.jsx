import { useContext, useState, useEffect, useRef } from "react";
import myContext from "../Context/myContext";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onClose }) => {
    const context = useContext(myContext);
    const { getAllProduct } = context;

    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);

    const navigate = useNavigate();

    // Add error handling for getAllProduct
    const filterSearchData = getAllProduct && getAllProduct.length > 0 
        ? getAllProduct.filter((obj) => obj.title.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
        : [];

    const handleItemClick = (itemId) => {
        setSearch("");
        setSelectedIndex(-1);
        navigate(`/productinfo/${itemId}`);
    };

    const handleKeyDown = (e) => {
        if (!search || filterSearchData.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < filterSearchData.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : filterSearchData.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < filterSearchData.length) {
                    handleItemClick(filterSearchData[selectedIndex].id);
                }
                break;
            case 'Escape':
                setSearch("");
                setSelectedIndex(-1);
                break;
        }
    };

    // Reset selected index when search changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [search]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearch("");
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-[90vw] max-w-xs sm:max-w-md mx-auto my-2 sm:my-0" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    placeholder='Search here'
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300'
                />
                <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {onClose && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary text-lg sm:hidden"
                    onClick={onClose}
                    aria-label="Close search bar"
                  >
                    &#10005;
                  </button>
                )}
            </div>
            
            {search && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 max-h-72 sm:max-h-96 overflow-y-auto w-screen max-w-xs sm:max-w-full sm:w-auto mx-auto sm:mx-0">
                    {filterSearchData.length > 0 ? (
                        filterSearchData.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-2 sm:p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 border-b border-white/10 last:border-b-0 ${
                                    index === selectedIndex ? 'bg-primary/20 border-primary/30' : ''
                                }`}
                                onClick={() => handleItemClick(item.id)}
                            >
                                <div className="flex-shrink-0">
                                    <img 
                                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" 
                                        src={item.imgurl1} 
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 font-medium truncate text-sm sm:text-base">
                                        {item.title.length > 28 ? `${item.title.slice(0, 28)}...` : item.title}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-gray-500">
                            <img 
                                className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" 
                                src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png" 
                                alt="No results" 
                            />
                            <p className="text-xs sm:text-sm">No products found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
