import React, { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { Image as ImageIcon, Plus, Trash2, X } from "lucide-react";

const GalleryList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "gallery"), orderBy("time", "desc"));
      const querySnapshot = await getDocs(q);
      const imageList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imageList);
    } catch (error) {
      console.error("Error fetching gallery: ", error);
      toast.error("Failed to fetch gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
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

    setUploading(true);
    try {
      const url = await uploadImage(file);
      
      const payload = {
        imageUrl: url,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      await addDoc(collection(fireDB, "gallery"), payload);
      toast.success("Image added to gallery successfully!");
      fetchImages();
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this image from the gallery?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(fireDB, "gallery", id));
      toast.success("Image removed from gallery successfully!");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image: ", error);
      toast.error("Failed to delete gallery image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Gallery Page</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Gallery Management</h2>
        </div>
        
        {/* Upload Button wrapper */}
        <label className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-orange-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="h-4 w-4" />
          Upload Gallery Image
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="flex items-center justify-center p-4 border border-primary/20 rounded-2xl gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-primary">Uploading and adding image to gallery...</p>
        </div>
      )}

      {loading && images.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div>
          {images.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-16 text-center">
              <ImageIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No gallery images found</h3>
              <p className="text-sm text-gray-400 mt-1">Upload images to display them on the Gallery page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div 
                  key={img.id} 
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] aspect-square transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(255,67,0,0.15)]"
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  
                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-110 shadow-lg"
                      title="Delete Image"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Info Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[10px] text-gray-300 px-2 py-0.5 rounded font-mono">
                    {img.date || "Added"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryList;
