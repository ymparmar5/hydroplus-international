import { useEffect,  useState } from 'react';
import HeroSection from '../Components/HeroSection';
import Category from '../Components/Category';
import CustomerReviews from '../Components/CustomerReviews';
import Form from '../Components/Form';
import HomeProductCard from '../Components/HomeProductCard';

const Home = () => {
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrolled = (scrollTop + windowHeight) / docHeight;

      if (scrolled >= 1) {
        setShowPopup(true);
        localStorage.setItem("hasShownPopup", "true");
        window.removeEventListener("scroll", handleScroll); // remove after trigger
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const handleClosePopup = () => {
        setShowPopup(false);
    };
    return (
        <main className="min-h-screen w-full flex flex-col bg-black">
            <HeroSection />
            <Category />
            <HomeProductCard />
            <CustomerReviews/>
            <Form isVisible={showPopup} onClose={handleClosePopup} />


        </main>
    );
};

export default Home;

