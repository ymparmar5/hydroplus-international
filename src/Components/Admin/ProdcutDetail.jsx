import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../Context/myContext";
import Loader from "../Loader";
import { getProductId } from "../../config/api";

const getProductTitle = (product) => {
    const title = product?.title || "Untitled Product";
    const modelMatch = title.match(/\bModel\s*:/i);

    if (!modelMatch) {
        return { name: title, model: "" };
    }

    return {
        name: title.slice(0, modelMatch.index).trim(),
        model: title.slice(modelMatch.index).trim(),
    };
};

const ProductDetail = () => {
    const { loading, deleteProduct, getAllProduct } = useContext(myContext);
    const navigate = useNavigate();

    const handleDelete = async (productId, title) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (confirmed) {
            await deleteProduct(productId);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-black text-white">
                <Loader />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-black px-0 pb-8 pt-0">
            <div className="mx-auto w-full max-w-[662px] bg-[#1f2b3a] text-white shadow-2xl sm:mt-0">
                <div className="overflow-x-auto border-x border-[#3c4858]">
                    <table className="w-full min-w-[640px] border-collapse">
                        <tbody className="divide-y divide-[#3c4858]">
                            {(getAllProduct || []).map((item, index) => {
                                const productId = getProductId(item);
                                const { name, model } = getProductTitle(item);

                                return (
                                    <tr key={productId || index} className="h-[82px] bg-[#1f2b3a] transition-colors hover:bg-[#243244]">
                                        <td className="w-[72px] px-4 text-center align-middle text-sm font-bold text-white">
                                            {index + 1}
                                        </td>
                                        <td className="w-[64px] px-2 align-middle">
                                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white">
                                                <img
                                                    src={item.imgurl1 || "/noimg.png"}
                                                    alt={item.title || "Product"}
                                                    className="h-full w-full object-contain p-1"
                                                    onError={(event) => {
                                                        event.currentTarget.src = "/noimg.png";
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/productinfo/${productId}`)}
                                                className="block max-w-[330px] text-left text-[14px] font-extrabold leading-[1.45] text-white transition hover:text-primary"
                                            >
                                                <span className="block">{name}</span>
                                                {model && <span className="block">{model}</span>}
                                            </button>
                                        </td>
                                        <td className="w-[112px] px-4 text-right align-middle">
                                            <div className="flex items-center justify-end gap-2 text-[14px] font-bold">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/AddProductPage/${productId}`)}
                                                    className="text-[#4da3ff] transition hover:text-[#8fc5ff]"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(productId, item.title)}
                                                    className="text-[#ff4b55] transition hover:text-[#ff858b]"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {(!getAllProduct || getAllProduct.length === 0) && (
                        <div className="flex min-h-[260px] flex-col items-center justify-center border-t border-[#3c4858] bg-[#1f2b3a] px-4 text-center">
                            <p className="text-base font-bold text-white">No products found</p>
                            <button
                                type="button"
                                onClick={() => navigate("/AddProductPage")}
                                className="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                            >
                                Add Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;
