import React, { useState } from 'react';
import { X, Building2, Mail, Phone, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Form = ({ isVisible, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    const isProductInquiry = Boolean(product);
    const inquiryType = isProductInquiry ? "Product Inquiry" : "Dealership Inquiry";

    // Prepare WhatsApp message - Fixed variable name
    const messageLines = [
      `${inquiryType} :`,
      isProductInquiry && `Product Name: ${product}`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Company: ${formData.companyName}`,
    ].filter(Boolean); // removes falsey values

    // WhatsApp link
    const whatsappURL = `https://wa.me/918000074088?text=${encodeURIComponent(messageLines.join('\n'))}`;

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);

      // Open WhatsApp with pre-filled message
      window.open(whatsappURL, '_blank'); // open in new tab

      onClose();
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gstNumber: '',
        companyName: ''
      });
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-gray-700/70 animate-[fadeIn_0.3s_ease-out]" 
      onClick={onClose}
    >
      {/* Popup Container */}
      <div 
        className="relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden bg-secondary-white animate-[popupZoom_0.3s_ease-out]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 relative overflow-hidden bg-primary">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary-white/10 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-secondary-white/10 transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="text-secondary-white w-6 h-6" />
              <div>
                {product ? (
                  <h2 className="text-xl font-bold text-secondary-white m-0">Product Inquiry</h2>
                ) : (
                  <h2 className="text-xl font-bold text-secondary-white m-0">Become a Dealer</h2>
                )}
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 rounded-full bg-transparent border-none text-secondary-white cursor-pointer transition-colors duration-200 hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Name Field */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="mr-2 w-4 h-4" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } bg-gray-50 text-gray-700 text-base transition-colors duration-200 focus:outline-none focus:border-primary placeholder:text-gray-500/60 box-border`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="mr-2 w-4 h-4" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } bg-gray-50 text-gray-700 text-base transition-colors duration-200 focus:outline-none focus:border-primary placeholder:text-gray-500/60 box-border`}
              placeholder="Enter your email address"
            />
            {errors.email && <div className="text-sm text-red-500 mt-1">{errors.email}</div>}
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="mr-2 w-4 h-4" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              } bg-gray-50 text-gray-700 text-base transition-colors duration-200 focus:outline-none focus:border-primary placeholder:text-gray-500/60 box-border`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="text-sm text-red-500 mt-1">{errors.phone}</div>}
          </div>

          {/* Company Name Field */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Building2 className="mr-2 w-4 h-4" />
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.companyName ? 'border-red-500' : 'border-gray-200'
              } bg-gray-50 text-gray-700 text-base transition-colors duration-200 focus:outline-none focus:border-primary placeholder:text-gray-500/60 box-border`}
              placeholder="Enter your company name"
            />
            {errors.companyName && <div className="text-sm text-red-500 mt-1">{errors.companyName}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-lg font-medium bg-primary text-secondary-white border-none cursor-pointer transition-all duration-200 text-base mt-4 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="text-xs text-center text-gray-700/70 mt-4">
            By submitting, you agree to our terms and conditions
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes popupZoom {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Form;