import { Timestamp, addDoc, collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import { uploadImage } from '../../utils/uploadImage';

const AddUpdateImage = () => {
  const navigate = useNavigate();

  // Memoized function to create initial state with current timestamp for 10 images
  const createInitialState = useCallback(() => ({
    imgurl1: "",
    imgurl2: "",
    imgurl3: "",
    imgurl4: "",
    imgurl5: "",
    imgurl6: "",
    imgurl7: "",
    imgurl8: "",
    imgurl9: "",
    imgurl10: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }), []);

  const [homeImages, setHomeImages] = useState(() => createInitialState());
  const [aboutImages, setAboutImages] = useState(() => createInitialState());
  const [homeDocId, setHomeDocId] = useState(null);
  const [aboutDocId, setAboutDocId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState({});

  // Fetch existing images on component mount
  const fetchExistingImages = async () => {
    setInitialLoading(true);
    try {
      // Query for home type
      const homeQuery = query(collection(fireDB, "Images"), where("type", "==", "home"));
      const homeSnapshot = await getDocs(homeQuery);
      
      if (!homeSnapshot.empty) {
        const homeDoc = homeSnapshot.docs[0];
        const homeData = homeDoc.data();
        setHomeDocId(homeDoc.id);
        setHomeImages({
          imgurl1: homeData.imgurl1 || "",
          imgurl2: homeData.imgurl2 || "",
          imgurl3: homeData.imgurl3 || "",
          imgurl4: homeData.imgurl4 || "",
          imgurl5: homeData.imgurl5 || "",
          imgurl6: homeData.imgurl6 || "",
          imgurl7: homeData.imgurl7 || "",
          imgurl8: homeData.imgurl8 || "",
          imgurl9: homeData.imgurl9 || "",
          imgurl10: homeData.imgurl10 || "",
          time: homeData.time,
          date: homeData.date,
        });
      }

      // Query for about type
      const aboutQuery = query(collection(fireDB, "Images"), where("type", "==", "about"));
      const aboutSnapshot = await getDocs(aboutQuery);
      
      if (!aboutSnapshot.empty) {
        const aboutDoc = aboutSnapshot.docs[0];
        const aboutData = aboutDoc.data();
        setAboutDocId(aboutDoc.id);
        setAboutImages({
          imgurl1: aboutData.imgurl1 || "",
          imgurl2: aboutData.imgurl2 || "",
          imgurl3: aboutData.imgurl3 || "",
          imgurl4: aboutData.imgurl4 || "",
          imgurl5: aboutData.imgurl5 || "",
          imgurl6: aboutData.imgurl6 || "",
          imgurl7: aboutData.imgurl7 || "",
          imgurl8: aboutData.imgurl8 || "",
          imgurl9: aboutData.imgurl9 || "",
          imgurl10: aboutData.imgurl10 || "",
          time: aboutData.time,
          date: aboutData.date,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch existing images");
      console.error("Fetch error:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingImages();
  }, []);

  const saveImages = async (type) => {
    const payload = type === 'home' ? homeImages : aboutImages;
    const docId = type === 'home' ? homeDocId : aboutDocId;

    // Check if at least one image is uploaded
    const hasImages = Object.keys(payload).some(key =>
      key.startsWith('imgurl') && payload[key]
    );

    if (!hasImages) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      // Ensure all 10 imgurl fields exist in the payload, even if empty
      const completePayload = {
        imgurl1: payload.imgurl1 || "",
        imgurl2: payload.imgurl2 || "",
        imgurl3: payload.imgurl3 || "",
        imgurl4: payload.imgurl4 || "",
        imgurl5: payload.imgurl5 || "",
        imgurl6: payload.imgurl6 || "",
        imgurl7: payload.imgurl7 || "",
        imgurl8: payload.imgurl8 || "",
        imgurl9: payload.imgurl9 || "",
        imgurl10: payload.imgurl10 || "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        type,
      };

      if (docId) {
        // Update existing document
        await updateDoc(doc(fireDB, "Images", docId), completePayload);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} images updated successfully!`);
      } else {
        // Create new document
        const docRef = await addDoc(collection(fireDB, "Images"), completePayload);
        if (type === 'home') {
          setHomeDocId(docRef.id);
        } else {
          setAboutDocId(docRef.id);
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} images added successfully!`);
      }

      // Update the state with new timestamp and date
      if (type === 'home') {
        setHomeImages(prev => ({
          ...prev,
          time: completePayload.time,
          date: completePayload.date,
        }));
      } else {
        setAboutImages(prev => ({
          ...prev,
          time: completePayload.time,
          date: completePayload.date,
        }));
      }
    } catch (error) {
      toast.error("Failed to save images. Please try again.");
      console.error("Firestore error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const field = e.target.name;
    const uploadKey = `${type}-${field}`;

    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const url = await uploadImage(file);
      if (type === 'home') {
        setHomeImages((prev) => ({ ...prev, [field]: url }));
      } else {
        setAboutImages((prev) => ({ ...prev, [field]: url }));
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeImage = (type, field) => {
    if (type === 'home') {
      setHomeImages(prev => ({ ...prev, [field]: "" }));
    } else {
      setAboutImages(prev => ({ ...prev, [field]: "" }));
    }
    toast.success("Image removed from form (click Save to update)");
  };

  // Render image inputs for 10 images
  const renderImageInputs = (type, imageState) =>
    Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
      const field = `imgurl${i}`;
      const uploadKey = `${type}-${field}`;
      const isUploading = uploadingImages[uploadKey];

      return (
        <div
          key={i}
          className="flex flex-col items-center gap-3"
        >
          {/* Upload Box (Preview only, no choose file inside) */}
          <div className="group relative w-full aspect-square flex items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl bg-gray-700/50 hover:border-primary hover:bg-primary-50/5 transition-all duration-300 backdrop-blur-sm overflow-hidden">
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 backdrop-blur-sm rounded-2xl z-10">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-primary animate-pulse">Uploading...</span>
              </div>
            )}

            {imageState[field] ? (
              <>
                <img
                  src={imageState[field]}
                  alt={`preview-${i}`}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                />
                {/* Image overlay with info */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">
                  Image {i}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Image {i}</span>
              </div>
            )}

            {/* Remove Button */}
            {imageState[field] && (
              <button
                type="button"
                onClick={() => removeImage(type, field)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-bold transition-all duration-200 shadow-lg hover:scale-110 z-10"
                title="Remove image"
              >
                ×
              </button>
            )}
          </div>

          {/* Choose File Button outside the preview box */}
          <input
            id={`${type}-${field}`}
            type="file"
            name={field}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleImageUpload(e, type)}
            disabled={isUploading}
            className="w-full p-2 text-xs bg-gray-700 border border-gray-600 rounded-xl text-gray-300 
                     file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 
                     file:text-xs file:font-bold file:bg-primary file:text-white 
                     hover:file:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed 
                     hover:border-primary transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      );
    });

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-bold text-lg">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Home Images Section */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8 mb-10">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-12 bg-gradient-to-b from-primary to-primary-600 rounded-full shadow-lg"></div>
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  🏠 {homeDocId ? 'Update' : 'Add'} Home Page Images
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-50/10 to-primary-100/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <p className="text-gray-300 text-sm flex items-center gap-2 flex-wrap">
                <span className="text-lg">📸</span>
                Upload up to 10 images for the home page (JPEG, PNG, WebP - Max 5MB each)
              </p>
              {homeDocId && (
                <p className="text-primary text-xs mt-2 font-semibold">
                  ✓ Existing images loaded - modify and click Save to update
                </p>
              )}
            </div>
          </div>

          {/* Enhanced responsive grid for 10 images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
            {renderImageInputs("home", homeImages)}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => saveImages("home")}
              disabled={loading}
              className="group px-10 py-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3 text-lg hover:scale-105"
            >
              {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{loading ? 'Saving...' : homeDocId ? '🔄 Update Home Images' : '💾 Save Home Images'}</span>
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AddUpdateImage;