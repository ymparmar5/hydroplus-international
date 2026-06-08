import React, { useContext, useState } from 'react';
import ProductDetail from './ProdcutDetail';
import ExhibitionList from "./ExhibitionList";
import myContext from '../../Context/myContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const [tab, setTab] = useState(1)


    return (
        <div className="relative min-h-[80vh] bg-secondary-black text-secondary-white px-2 py-8 flex flex-col items-center overflow-x-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Blurred animated circles */}
                <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }}></div>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary-black/80 to-primary/10 pointer-events-none" />
            </div>
            <div className="w-full max-w-6xl bg-secondary-white text-secondary-black rounded-xl shadow-lg p-4 sm:p-8 my-6 flex flex-col md:flex-row items-center md:items-stretch border border-primary/20">
                {/* Left: Large Admin Image */}
                <div className="flex-shrink-0 flex justify-center items-center w-full md:w-1/3 mb-6 md:mb-0 md:mr-8">
                    <img className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-primary shadow" src="/admin.png" alt="User" />
                </div>
                {/* Right: Details */}
                <div className="flex flex-col justify-center w-full md:w-2/3">
                    <div className="mb-4 text-center md:text-left space-y-2">
                        <h1 className="text-2xl font-semibold"><span className="font-bold text-primary">Name: </span>{user?.name}</h1>
                        <h1 className="text-2xl font-semibold"><span className="font-bold text-primary">Email: </span>{user?.email}</h1>
                        <h1 className="text-2xl font-semibold"><span className="font-bold text-primary">Role: </span>{user?.role}</h1>
                    </div>
                    <div className="flex justify-center md:justify-start gap-4">
                        <Link to={'/AddProductPage'} className=" max-w-xs">
                            <button className="bg-primary hover:bg-primary-700 text-secondary-white rounded-md px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 w-full">Add Product</button>
                        </Link>
                        <Link to={'/AddUpdateImage'} className=" max-w-xs">
                            <button className="bg-primary hover:bg-primary-700 text-secondary-white rounded-md px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 w-full">Add Images</button>
                        </Link>

                        <Link to={'/addExhibition'} className=" max-w-xs">
                            <button className="bg-primary hover:bg-primary-700 text-secondary-white rounded-md px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 w-full">Add Exhibition</button>
                        </Link>


                    </div>

                </div>
                <Link to={'/sign-in'} className=" max-w-xs">
                    <button className="bg-red-600 hover:bg-red-700 text-secondary-white rounded-md px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 w-full" onClick={() => {
                        localStorage.removeItem("users")
                    }}>Logout</button>
                </Link>
            </div>


            <div className="w-full max-w-6xl mt-8">
                <div className='flex'>
                    <button
                        onClick={() => setTab(1)}
                        className={`${tab === 1
                                ? "bg-primary hover:bg-primary-700 text-secondary-white"
                                : "bg-gray-900 hover:bg-gray-300 text-gray-700"
                            } px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 `}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setTab(0)}
                        className={`${tab === 0
                                ? "bg-primary hover:bg-primary-700 text-secondary-white"
                                : "bg-gray-900 hover:bg-gray-300 text-gray-700"
                            }  px-6 py-2 font-semibold text-base mt-2 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 `}
                    >
                        Exhibition
                    </button>
                </div>

                {tab === 1 ? <ProductDetail /> : <ExhibitionList />}
            </div>
        </div>
    );
}

export default AdminDashboard;
