import { useState, useEffect } from 'react';
import MyContext from './myContext';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  addDoc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { fireDB } from "../FireBase/FireBaseConfig";
import toast from 'react-hot-toast';

function MyState({ children }) {
  const [loading, setLoading] = useState(false);
  const [getAllProduct, setGetAllProduct] = useState([]);
  const [categories, setCategorie] = useState({});
  const [categoryImages, setCategoryImages] = useState({});
  const [subcategoryImages, setSubcategoryImages] = useState({});
  const [exhibitions, setExhibitions] = useState([]);

  // ---------------------- PRODUCT FETCH ----------------------
  const getAllProductFunction = () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy('time'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productArray = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setGetAllProduct(productArray);
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching products: ", error);
      setLoading(false);
    }
  };

  // ---------------------- CATEGORY & SUBCATEGORY MANAGEMENT ----------------------
  const getCategoriesFunction = () => {
    try {
      const q = query(collection(fireDB, "categories"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoryData = {};
        const categoryImageData = {};
        const subcategoryImageData = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categoryData[data.name] = data.subcategories || [];
          categoryImageData[data.name] = data.image || '';
          subcategoryImageData[data.name] = data.subcategoryImages || {};
        });

        setCategorie(categoryData);
        setCategoryImages(categoryImageData);
        setSubcategoryImages(subcategoryImageData);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  // ✅ Add new category (prevent duplicates)
  const addNewCategory = async (newCategory, categoryImage = '') => {
    try {
      const formattedName = newCategory.trim();
      if (!formattedName) return toast.error("Category name cannot be empty.");

      const exists = Object.keys(categories).some(
        (cat) => cat.toLowerCase() === formattedName.toLowerCase()
      );
      if (exists) return toast.error(`Category "${formattedName}" already exists.`);

      await setDoc(doc(fireDB, "categories", formattedName), {
        name: formattedName,
        image: categoryImage,
        subcategories: [],
        subcategoryImages: {}
      });

      setCategorie((prev) => ({ ...prev, [formattedName]: [] }));
      if (categoryImage) {
        setCategoryImages((prev) => ({ ...prev, [formattedName]: categoryImage }));
      }

      toast.success(`Category "${formattedName}" added successfully!`);
    } catch (error) {
      console.error("Error adding category: ", error);
      toast.error("Failed to add category.");
    }
  };

  // ✅ Update existing category
  const updateCategory = async (oldName, newName, newImage = '') => {
    try {
      const trimmedNew = newName.trim();
      if (!trimmedNew) return toast.error("New category name cannot be empty.");

      if (oldName === trimmedNew) {
        const docRef = doc(fireDB, "categories", oldName);
        await updateDoc(docRef, { image: newImage || categoryImages[oldName] });
        setCategoryImages((prev) => ({ ...prev, [oldName]: newImage || prev[oldName] }));
        toast.success(`Category "${oldName}" image updated.`);
        return;
      }

      const exists = Object.keys(categories).some(
        (cat) => cat.toLowerCase() === trimmedNew.toLowerCase() && cat !== oldName
      );
      if (exists) return toast.error(`Category "${trimmedNew}" already exists.`);

      const oldDocRef = doc(fireDB, "categories", oldName);
      const oldDoc = await getDoc(oldDocRef);
      if (!oldDoc.exists()) return toast.error("Original category not found.");

      const oldData = oldDoc.data();

      await setDoc(doc(fireDB, "categories", trimmedNew), {
        ...oldData,
        name: trimmedNew,
        image: newImage || oldData.image,
      });

      await deleteDoc(oldDocRef);

      setCategorie((prev) => {
        const { [oldName]: removed, ...rest } = prev;
        return { ...rest, [trimmedNew]: oldData.subcategories || [] };
      });

      setCategoryImages((prev) => {
        const { [oldName]: removed, ...rest } = prev;
        return { ...rest, [trimmedNew]: newImage || oldData.image };
      });

      setSubcategoryImages((prev) => {
        const { [oldName]: removed, ...rest } = prev;
        return { ...rest, [trimmedNew]: oldData.subcategoryImages || {} };
      });

      toast.success(`Category "${oldName}" updated to "${trimmedNew}".`);
    } catch (error) {
      console.error("Error updating category: ", error);
      toast.error("Failed to update category.");
    }
  };

  // ✅ Add new subcategory (prevent duplicates)
  // ✅ Add new subcategory (with proper duplicate prevention, same logic as category)
const addNewSubcategory = async (category, newSubcategory, subcategoryImage = '') => {
  try {
    const formattedSub = newSubcategory.trim();
    if (!formattedSub) return toast.error("Subcategory name cannot be empty.");

    // Defensive check: category must exist
    if (!categories[category]) return toast.error(`Category "${category}" not found.`);

    const currentSubcategories = categories[category] || [];

    // 🧠 Case-insensitive duplicate prevention (same as addNewCategory)
    const exists = currentSubcategories.some(
      (sub) => sub.toLowerCase() === formattedSub.toLowerCase()
    );
    if (exists)
      return toast.error(`Subcategory "${formattedSub}" already exists in "${category}".`);

    const categoryRef = doc(fireDB, "categories", category);
    const currentSubcategoryImages = subcategoryImages[category] || {};

    const updatedSubcategories = [...currentSubcategories, formattedSub];
    const updatedSubcategoryImages = {
      ...currentSubcategoryImages,
      [formattedSub]: subcategoryImage || ''
    };

    // ✅ Write to Firestore (merge mode, to keep existing fields intact)
    await setDoc(
      categoryRef,
      {
        subcategories: updatedSubcategories,
        subcategoryImages: updatedSubcategoryImages
      },
      { merge: true }
    );

    // ✅ Update local state immediately (no duplicate entries)
    setCategorie((prev) => ({
      ...prev,
      [category]: updatedSubcategories
    }));

    setSubcategoryImages((prev) => ({
      ...prev,
      [category]: updatedSubcategoryImages
    }));

    toast.success(`Subcategory "${formattedSub}" added to "${category}".`);
  } catch (error) {
    console.error("Error adding subcategory: ", error);
    toast.error("Failed to add subcategory.");
  }
};


  // ✅ Update subcategory
  const updateSubcategory = async (category, oldName, newName, newImage = '') => {
    try {
      const trimmedNew = newName.trim();
      if (!trimmedNew) return toast.error("New subcategory name cannot be empty.");

      const currentSubcategories = categories[category] || [];
      const currentSubcategoryImages = subcategoryImages[category] || {};

      if (oldName === trimmedNew) {
        const categoryRef = doc(fireDB, "categories", category);
        await updateDoc(categoryRef, {
          subcategoryImages: {
            ...currentSubcategoryImages,
            [oldName]: newImage || currentSubcategoryImages[oldName]
          }
        });
        setSubcategoryImages((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [oldName]: newImage || prev[category][oldName]
          }
        }));
        toast.success(`Subcategory "${oldName}" image updated.`);
        return;
      }

      const exists = currentSubcategories.some(
        (sub) => sub.toLowerCase() === trimmedNew.toLowerCase() && sub !== oldName
      );
      if (exists)
        return toast.error(`Subcategory "${trimmedNew}" already exists in "${category}".`);

      const updatedSubcategories = currentSubcategories.map((sub) =>
        sub === oldName ? trimmedNew : sub
      );

      const updatedSubcategoryImages = {
        ...currentSubcategoryImages,
        [trimmedNew]: newImage || currentSubcategoryImages[oldName]
      };
      delete updatedSubcategoryImages[oldName];

      const categoryRef = doc(fireDB, "categories", category);
      await updateDoc(categoryRef, {
        subcategories: updatedSubcategories,
        subcategoryImages: updatedSubcategoryImages
      });

      setCategorie((prev) => ({
        ...prev,
        [category]: updatedSubcategories
      }));

      setSubcategoryImages((prev) => ({
        ...prev,
        [category]: updatedSubcategoryImages
      }));

      toast.success(`Subcategory "${oldName}" updated to "${trimmedNew}".`);
    } catch (error) {
      console.error("Error updating subcategory: ", error);
      toast.error("Failed to update subcategory.");
    }
  };

  // ✅ Delete category
  const deleteCategory = async (categoryToDelete) => {
    try {
      await deleteDoc(doc(fireDB, "categories", categoryToDelete));

      setCategorie((prev) => {
        const { [categoryToDelete]: _, ...rest } = prev;
        return rest;
      });

      setCategoryImages((prev) => {
        const { [categoryToDelete]: _, ...rest } = prev;
        return rest;
      });

      setSubcategoryImages((prev) => {
        const { [categoryToDelete]: _, ...rest } = prev;
        return rest;
      });

      toast.success(`Category "${categoryToDelete}" deleted.`);
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast.error("Failed to delete category.");
    }
  };

  // ✅ Delete subcategory
  const deleteSubcategory = async (category, subcategoryToDelete) => {
    try {
      const currentSubcategories = categories[category] || [];
      const updatedSubcategories = currentSubcategories.filter(
        (sub) => sub !== subcategoryToDelete
      );

      const currentSubcategoryImages = subcategoryImages[category] || {};
      const updatedSubcategoryImages = { ...currentSubcategoryImages };
      delete updatedSubcategoryImages[subcategoryToDelete];

      const categoryRef = doc(fireDB, "categories", category);
      await updateDoc(categoryRef, {
        subcategories: updatedSubcategories,
        subcategoryImages: updatedSubcategoryImages
      });

      setCategorie((prev) => ({
        ...prev,
        [category]: updatedSubcategories
      }));

      setSubcategoryImages((prev) => ({
        ...prev,
        [category]: updatedSubcategoryImages
      }));

      toast.success(`Subcategory "${subcategoryToDelete}" deleted.`);
    } catch (error) {
      console.error("Error deleting subcategory: ", error);
      toast.error("Failed to delete subcategory.");
    }
  };

  // ---------------------- EXHIBITIONS MANAGEMENT ----------------------
  const getAllExhibitionsFunction = () => {
    try {
      const q = query(collection(fireDB, "exhibitions"), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const exhibitionArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setExhibitions(exhibitionArray);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching exhibitions: ", error);
      toast.error("Failed to fetch exhibitions.");
    }
  };

  const addExhibition = async (exhibitionData) => {
    try {
      setLoading(true);
      const newExhibition = {
        ...exhibitionData,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        sections: exhibitionData.sections.map((section) => ({
          ...section,
          images: section.images.filter((img) => img.trim() !== "")
        }))
      };

      const docRef = await addDoc(collection(fireDB, "exhibitions"), newExhibition);
      toast.success("Exhibition added successfully!");
      return docRef.id;
    } catch (error) {
      console.error("Error adding exhibition: ", error);
      toast.error("Failed to add exhibition.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExhibition = async (exhibitionId, exhibitionData) => {
    try {
      setLoading(true);
      const docRef = doc(fireDB, "exhibitions", exhibitionId);

      const updatedExhibition = {
        ...exhibitionData,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        sections: exhibitionData.sections.map((section) => ({
          ...section,
          images: section.images.filter((img) => img.trim() !== "")
        }))
      };

      await setDoc(docRef, updatedExhibition);
      toast.success("Exhibition updated successfully!");
    } catch (error) {
      console.error("Error updating exhibition: ", error);
      toast.error("Failed to update exhibition.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteExhibition = async (exhibitionId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(fireDB, "exhibitions", exhibitionId));
      toast.success("Exhibition deleted successfully!");
    } catch (error) {
      console.error("Error deleting exhibition: ", error);
      toast.error("Failed to delete exhibition.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getExhibitionById = async (exhibitionId) => {
    try {
      const docRef = doc(fireDB, "exhibitions", exhibitionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return { ...docSnap.data(), id: docSnap.id };
      toast.error("No such exhibition found!");
      return null;
    } catch (error) {
      console.error("Error fetching exhibition: ", error);
      toast.error("Failed to fetch exhibition.");
      throw error;
    }
  };

  const toggleExhibitionStatus = async (exhibitionId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const docRef = doc(fireDB, "exhibitions", exhibitionId);
      await updateDoc(docRef, {
        status: newStatus,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      });
      toast.success(`Exhibition ${newStatus === 'published' ? 'published' : 'saved as draft'}.`);
    } catch (error) {
      console.error("Error updating exhibition status: ", error);
      toast.error("Failed to update exhibition status.");
      throw error;
    }
  };

  const getPublishedExhibitions = () => exhibitions.filter((e) => e.status === 'published');
  const getDraftExhibitions = () => exhibitions.filter((e) => e.status === 'draft');
// ✅ Helper: Get image for a specific subcategory
const getSubcategoryImage = (categoryName, subcategoryName) => {
  return subcategoryImages[categoryName]?.[subcategoryName] || '';
};

  // ---------------------- INIT FETCH ----------------------
  useEffect(() => {
    const unsubProducts = getAllProductFunction();
    const unsubCategories = getCategoriesFunction();
    const unsubExhibitions = getAllExhibitionsFunction();
    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubCategories) unsubCategories();
      if (unsubExhibitions) unsubExhibitions();
    };
  }, []);

  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        getAllProduct,
        categories,
        categoryImages,
        subcategoryImages,
        addNewCategory,
        addNewSubcategory,
        updateCategory,
        updateSubcategory,
        deleteCategory,
        deleteSubcategory,
        exhibitions,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        getExhibitionById,
        toggleExhibitionStatus,
        getPublishedExhibitions,
        getDraftExhibitions,
            getSubcategoryImage, // ✅ Add this line back

      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;
