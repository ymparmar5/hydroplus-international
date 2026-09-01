import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageCircle } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { name, email, subject, message } = formData;

    const text = `Name: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
    const phone = "918000074088"; // without + sign

    const whatsappUrl = `https://wa.me/${phone}?text=${text}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };


  const FloatingShape = ({ delay, duration, size, top, left }) => (
    <div
      className={`absolute w-${size} h-${size} rounded-full opacity-20`}
      style={{
        background: `linear-gradient(45deg, #ff4300, rgba(255, 67, 0, 0.3))`,
        top: `${top}%`,
        left: `${left}%`,
        animation: `float ${duration}s ease-in-out infinite ${delay}s`,
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden ">
      {/* Header Section */}
      <div className="relative h-[160px] xs:h-[200px] sm:h-[220px] md:h-[300px] lg:h-[350px] w-full mb-8 sm:mb-12 overflow-hidden animate-pulse-glow">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contact.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.8)',
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black" />
        <div className="relative z-10 flex items-center justify-center h-full px-2">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 text-left ">
            Let's <span className="text-primary ">Connect</span>
          </h1>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-60 h-60 xs:w-72 xs:h-72 sm:w-96 sm:h-96 rounded-full opacity-10 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #ff4300, transparent)',
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 67, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 67, 0, 0.6); }
        }
        @keyframes slideIn {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 1s ease-out; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out 0.3s both; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      <div className="flex-col gap-10 max-w-full md:max-w-6xl mx-auto px-6 xs:px-10 sm:px-10 py-10 sm:py-12 relative z-10  ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">

          {/* Left Side - Lottie Animation & Contact Info */}
          <div className="animate-slide-in">
            <div className="relative">
              <FloatingShape delay={0} duration={4} size={16} top={10} left={10} />
              <FloatingShape delay={1} duration={5} size={12} top={60} left={80} />
              <FloatingShape delay={2} duration={6} size={8} top={80} left={20} />

              <div className="space-y-6 sm:space-y-8">
                {/* Lottie Animation */}
                <div className="w-full h-52 xs:h-64 sm:h-80 md:h-96 rounded-2xl flex items-center justify-center border border-primary/20">
                  <DotLottieReact
                    src="https://lottie.host/ae36f017-af39-4778-8908-d1687a0c97fb/UMvc5mwvQL.lottie"
                    loop
                    autoplay
                  />
                </div>



                {/* Animated Geometric Shapes */}
                <div className="relative flex justify-center">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 border-2 border-primary rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute top-2 xs:top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 border-2 border-primary-300 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                  <div className="absolute top-4 xs:top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-primary rounded-full opacity-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="animate-slide-in-right">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-2xl border border-white/10">
              <div className="mb-4 xs:mb-6 sm:mb-8">
                <h2 className="text-2xl xs:text-2.5xl sm:text-3xl font-bold text-white mb-1 xs:mb-2">Send A Message</h2>
                <p className="text-gray-400 text-xs sm:text-base">Fill out the form below and we'll get back to you soon.</p>
              </div>

              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                      className="w-full pl-12 pr-4 py-3 xs:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300 text-sm xs:text-base"
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="w-full pl-12 pr-4 py-3 xs:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300 text-sm xs:text-base"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <MessageCircle className="absolute left-3 top-4 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    required
                    className="w-full pl-12 pr-4 py-3 xs:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300 text-sm xs:text-base"
                  />
                </div>

                <div className="relative group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    rows="5"
                    required
                    className="w-full px-4 py-3 xs:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-all duration-300 resize-none text-sm xs:text-base"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 xs:py-4 px-6 xs:px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 text-sm xs:text-base"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 xs:w-6 xs:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <img src='/whatsapp.png' className="w-8 h-8" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>


            </div>
          </div>

        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 my-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
            {/* Item */}
            {[
              {
                icon: <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
                label: "Email",
                value: "contact@hydroplusinternational.com"
              },
              {
                icon: <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
                label: "Phone",
                value: "+91 8000074088"
              },
              {
                icon: <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />,
                label: "Location",
                value: "Surat, Gujrat, India"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="min-w-[44px] min-h-[44px] sm:min-w-[52px] sm:min-h-[52px] bg-primary flex items-center justify-center rounded-full shadow-lg shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 overflow-hidden text-sm sm:text-base text-white space-y-1">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-gray-300 text-xs sm:text-sm leading-snug break-words whitespace-normal">
                    {item.value}
                  </div>
                </div>
              </div>

            ))}
          </div>
        </div>

        <div className="w-full  my-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.096654626436!2d72.9467617!3d21.2676413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be047df044a45d1%3A0xcabc91354e1cb1c3!2sHydroplus%20International!5e0!3m2!1sen!2sin!4v1754221303088!5m2!1sen!2sin"
            className="w-full h-[50vh]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>



      </div>


      {/* Additional Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 xs:h-24 sm:h-32 bg-gradient-to-t from-primary/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-40 xs:w-52 sm:w-64 h-40 xs:h-52 sm:h-64 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl"></div>

    </div>
  );
};

export default ContactPage;