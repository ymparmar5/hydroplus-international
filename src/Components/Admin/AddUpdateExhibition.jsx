import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import myContext from '../../Context/myContext';
import { uploadImage } from '../../utils/uploadImage';

const AddUpdateExhibition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Get context functions
    const { 
        loading, 
        setLoading,
        addExhibition, 
        updateExhibition, 
        getExhibitionById 
    } = useContext(myContext);

    const [exhibition, setExhibition] = useState({
        title: "",
        headerImage: "",
        sections: [{
            id: 1,
            sectionTitle: "",
            description: "",
            images: [""]
        }],
        publishedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: "draft", // draft, published
    });

    const [imageUploading, setImageUploading] = useState({});

    useEffect(() => {
        if (id) {
            const fetchExhibition = async () => {
                try {
                    const data = await getExhibitionById(id);
                    if (data) {
                        // Ensure sections have the proper structure
                        if (!data.sections || data.sections.length === 0) {
                            data.sections = [{
                                id: 1,
                                sectionTitle: "",
                                description: "",
                                images: [""]
                            }];
                        }
                        setExhibition(data);
                    } else {
                        navigate("/admin");
                    }
                } catch (error) {
                    console.error("Error fetching exhibition: ", error);
                    navigate("/admin");
                }
            };
            fetchExhibition();
        }
    }, [id, navigate, getExhibitionById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!exhibition.title.trim()) {
            toast.error("Please enter exhibition title");
            return;
        }

        // Validate that at least one section has content
        const hasValidSection = exhibition.sections.some(section => 
            section.sectionTitle.trim() || section.description.trim() || 
            section.images.some(img => img.trim())
        );

        if (!hasValidSection) {
            toast.error("Please add at least one section with content");
            return;
        }

        try {
            if (id) {
                await updateExhibition(id, exhibition);
            } else {
                await addExhibition(exhibition);
            }
            navigate("/admin");
        } catch (error) {
            // Error is handled in context
            console.error("Error saving exhibition:", error);
        }
    };

    const handleHeaderImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadKey = 'headerImage';
            setImageUploading(prev => ({ ...prev, [uploadKey]: true }));
            try {
                const url = await uploadImage(file);
                setExhibition(prev => ({
                    ...prev,
                    headerImage: url
                }));
                toast.success('Header image uploaded successfully!');
            } catch (error) {
                toast.error('Header image upload failed');
            } finally {
                setImageUploading(prev => ({ ...prev, [uploadKey]: false }));
            }
        }
    };

    const handleSectionImageUpload = async (e, sectionIndex, imageIndex) => {
        const file = e.target.files[0];
        if (file) {
            const uploadKey = `section-${sectionIndex}-image-${imageIndex}`;
            setImageUploading(prev => ({ ...prev, [uploadKey]: true }));
            try {
                const url = await uploadImage(file);
                setExhibition(prev => ({
                    ...prev,
                    sections: prev.sections.map((section, idx) => {
                        if (idx === sectionIndex) {
                            const newImages = [...section.images];
                            newImages[imageIndex] = url;
                            return { ...section, images: newImages };
                        }
                        return section;
                    })
                }));
                toast.success('Section image uploaded successfully!');
            } catch (error) {
                toast.error('Section image upload failed');
            } finally {
                setImageUploading(prev => ({ ...prev, [uploadKey]: false }));
            }
        }
    };

    const addSection = () => {
        const newSection = {
            id: Date.now(), // Use timestamp for unique ID
            sectionTitle: "",
            description: "",
            images: [""]
        };
        setExhibition(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    const removeSection = (sectionIndex) => {
        if (exhibition.sections.length > 1) {
            setExhibition(prev => ({
                ...prev,
                sections: prev.sections.filter((_, idx) => idx !== sectionIndex)
            }));
        } else {
            toast.error("At least one section is required");
        }
    };

    const updateSection = (sectionIndex, field, value) => {
        setExhibition(prev => ({
            ...prev,
            sections: prev.sections.map((section, idx) => {
                if (idx === sectionIndex) {
                    return { ...section, [field]: value };
                }
                return section;
            })
        }));
    };

    const addImageToSection = (sectionIndex) => {
        setExhibition(prev => ({
            ...prev,
            sections: prev.sections.map((section, idx) => {
                if (idx === sectionIndex) {
                    return { ...section, images: [...section.images, ""] };
                }
                return section;
            })
        }));
    };

    const removeImageFromSection = (sectionIndex, imageIndex) => {
        setExhibition(prev => ({
            ...prev,
            sections: prev.sections.map((section, idx) => {
                if (idx === sectionIndex) {
                    if (section.images.length > 1) {
                        return { 
                            ...section, 
                            images: section.images.filter((_, imgIdx) => imgIdx !== imageIndex)
                        };
                    } else {
                        toast.error("At least one image slot is required per section");
                        return section;
                    }
                }
                return section;
            })
        }));
    };

    const removeImageUrl = (sectionIndex, imageIndex) => {
        setExhibition(prev => ({
            ...prev,
            sections: prev.sections.map((section, idx) => {
                if (idx === sectionIndex) {
                    const newImages = [...section.images];
                    newImages[imageIndex] = "";
                    return { ...section, images: newImages };
                }
                return section;
            })
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-lg font-semibold text-white">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    const inputClass = "border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-700 text-white placeholder-gray-400";
    const buttonClass = "px-4 py-2 rounded font-medium transition-colors";
    const labelClass = "text-sm text-gray-300 mb-1 block";

    return (
        <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {id ? 'Update Exhibition' : 'Add Exhibition'}
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Exhibition Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Exhibition Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Exhibition Title <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Exhibition Title"
                                    value={exhibition.title}
                                    onChange={(e) => setExhibition({ ...exhibition, title: e.target.value })}
                                    className={`${inputClass} w-full`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Published Date</label>
                                <input
                                    type="date"
                                    value={exhibition.publishedDate}
                                    onChange={(e) => setExhibition({ ...exhibition, publishedDate: e.target.value })}
                                    className={`${inputClass} w-full`}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className={labelClass}>Status</label>
                            <select
                                value={exhibition.status}
                                onChange={(e) => setExhibition({ ...exhibition, status: e.target.value })}
                                className={`${inputClass} w-full md:w-1/2`}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Header Image */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Header Image</h3>
                        <div>
                            <input
                                type="file"
                                onChange={handleHeaderImageUpload}
                                className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:rounded"
                                accept="image/*"
                                disabled={imageUploading.headerImage}
                            />
                            {imageUploading.headerImage && (
                                <div className="flex items-center mt-2 text-sm text-gray-400">
                                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Uploading header image...
                                </div>
                            )}
                            {exhibition.headerImage && (
                                <div className="relative inline-block mt-3">
                                    <img
                                        src={exhibition.headerImage}
                                        alt="Header Preview"
                                        className="w-40 h-24 object-cover rounded border border-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setExhibition({ ...exhibition, headerImage: "" })}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exhibition Sections */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">Exhibition Sections</h3>
                            <button
                                type="button"
                                onClick={addSection}
                                className={`${buttonClass} bg-primary-600 text-white hover:bg-primary-700`}
                            >
                                Add Section
                            </button>
                        </div>

                        {exhibition.sections.map((section, sectionIndex) => (
                            <div key={section.id} className="border border-gray-600 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-md font-medium text-gray-300">Section {sectionIndex + 1}</h4>
                                    {exhibition.sections.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSection(sectionIndex)}
                                            className={`${buttonClass} bg-red-600 text-white hover:bg-red-700 text-xs`}
                                        >
                                            Remove Section
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Section Title</label>
                                        <input
                                            type="text"
                                            placeholder="Section Title"
                                            value={section.sectionTitle}
                                            onChange={(e) => updateSection(sectionIndex, 'sectionTitle', e.target.value)}
                                            className={`${inputClass} w-full`}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea
                                            placeholder="Section Description"
                                            value={section.description}
                                            onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                                            rows={4}
                                            className={`${inputClass} w-full`}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className={labelClass}>Section Images</label>
                                            <button
                                                type="button"
                                                onClick={() => addImageToSection(sectionIndex)}
                                                className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 text-xs`}
                                            >
                                                Add Image
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {section.images.map((image, imageIndex) => (
                                                <div key={imageIndex} className="border border-gray-700 rounded p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-gray-400">Image {imageIndex + 1}</span>
                                                        {section.images.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImageFromSection(sectionIndex, imageIndex)}
                                                                className="text-red-400 hover:text-red-300 text-xs"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleSectionImageUpload(e, sectionIndex, imageIndex)}
                                                        className="w-full text-sm text-gray-300 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:rounded"
                                                        accept="image/*"
                                                        disabled={imageUploading[`section-${sectionIndex}-image-${imageIndex}`]}
                                                    />
                                                    
                                                    {imageUploading[`section-${sectionIndex}-image-${imageIndex}`] && (
                                                        <div className="flex items-center mt-2 text-sm text-gray-400">
                                                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                                            </svg>
                                                            Uploading...
                                                        </div>
                                                    )}
                                                    
                                                    {image && (
                                                        <div className="relative inline-block mt-2">
                                                            <img
                                                                src={image}
                                                                alt={`Section ${sectionIndex + 1} Image ${imageIndex + 1}`}
                                                                className="w-24 h-24 object-cover rounded border border-gray-600"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImageUrl(sectionIndex, imageIndex)}
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`${buttonClass} w-full bg-primary-600 text-white hover:bg-primary-700 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        {id ? 'Update Exhibition' : 'Add Exhibition'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUpdateExhibition;