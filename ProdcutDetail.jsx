import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../Context/myContext";
import Loader from "../Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../FireBase/FireBaseConfig";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

    const navigate = useNavigate();

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product Deleted successfully');
            getAllProductFunction();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleDelete = async (productId, title) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (confirmed) {
            await deleteProduct(productId);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64 text-white">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Loading products...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Product Management</h1>
                    <button
                        onClick={() => navigate('/AddProductPage')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add New Product
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Products</h3>
                        <p className="text-3xl font-bold text-white">{getAllProduct.length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Categories</h3>
                        <p className="text-3xl font-bold text-primary-400">
                            {[...new Set(getAllProduct.map(item => item.category))].length}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Active Products</h3>
                        <p className="text-3xl font-bold text-green-400">{getAllProduct.length}</p>
                    </div>
                </div>

                {getAllProduct.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-4">No products found</div>
                        <button
                            onClick={() => navigate('/AddProductPage')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Create Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            S.No.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-600">
                                    {getAllProduct.map((item, index) => {
                                        const { id, title, category, imgurl1 } = item;
                                        return (
                                            <tr key={index} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {imgurl1 && (
                                                            <img
                                                                src={imgurl1}
                                                                alt={title}
                                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-white">
                                                                {title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {category}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/AddProductPage/${id}`)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(id, title)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;