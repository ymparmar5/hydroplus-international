import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Shop from "./Pages/Shop";
// import CategoryPage from "./Pages/CategoryPage";
import Error from "./Pages/Error";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductInfo from "./Pages/ProductInfo";
import ScrollTop from "./Components/ScrollTop";

import UserDashboard from "./Components/UserDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import MyState from "./Context/MyState";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteForUser } from "./Components/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./Components/ProtectedRouteForAdmin";
import Signup from "./Pages/SIgnup";
import SignIN from "./Pages/SignIn";
import TermsAndConditions from "./Pages/TermsAndConditions";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Certificates from "./Pages/Certificates";
import SocialSidebar from "./Components/SocialSidebar";
import Exhibitions from "./Pages/exhibitions";
import AddUpdateImage from "./Components/Admin/AddUpdateImage";
import AddOrUpdateProductPage from "./Components/Admin/AddOrUpdateProductPage";
import AddUpdateExhibition from "./Components/Admin/AddUpdateExhibition";
import ExhibitionDetail from "./Pages/ExhibitionDetail";
import Gallery from "./Pages/Gallery";

const App = () => {
  // useEffect(() => {
  //   const handleRightClick = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", handleRightClick);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleRightClick);
  //   };
  // }, []);

  return (

    <MyState >
      <BrowserRouter>
        <Header />

        <ScrollTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/certificates" element={<Certificates />} />


          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<SignIN />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/tandc" element={<TermsAndConditions />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/exhibitionDetail/:id" element={<ExhibitionDetail />} />



          <Route path="/user" element={
            <ProtectedRouteForUser>
              <UserDashboard />
            </ProtectedRouteForUser>
          } />

          <Route path="/admin" element={
            <ProtectedRouteForAdmin >
              <AdminDashboard />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/AddUpdateImage" element={
            <ProtectedRouteForAdmin >
              <AddUpdateImage />
            </ProtectedRouteForAdmin>} />

          <Route path="/AddProductPage" element={
            <ProtectedRouteForAdmin>
              <AddOrUpdateProductPage />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/AddProductPage/:id" element={
            <ProtectedRouteForAdmin>
              <AddOrUpdateProductPage />
            </ProtectedRouteForAdmin>
          } />

           <Route path="/addExhibition" element={
            <ProtectedRouteForAdmin>
              <AddUpdateExhibition />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/addExhibition/:id" element={
            <ProtectedRouteForAdmin>
              <AddUpdateExhibition />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/error" element={<Error />} />
        </Routes>

        <div className="hidden lg:block">
          <SocialSidebar />
        </div>
        
        {/* Fixed Bottom Left Certificate Icon for All Pages */}
        <Link to="/certificates" className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40" title="View Certificates">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 md:p-3 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center animate-bounce shadow-2xl border border-white/10 backdrop-blur-md hover:scale-110 transition-transform">
            <FileText className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
        </Link>
        
        <Footer />
        <Toaster />

      </BrowserRouter>
    </MyState>
  );
};

export default App;
