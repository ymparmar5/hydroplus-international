import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";

import {
  Mail,
  Phone,
  MapPin,
  Award,
  Users,
  Target,
  Eye,
  Wrench,
  Shield,
  Globe,
  Zap,
  Droplet,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowUp,
} from "lucide-react";

const colors = {
  primary: "#ff4300",
  secondary: "#ff6b35",
};



export default function About() {
  const [founders, setFounders] = useState(null);
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(fireDB, "team"), orderBy("time", "asc"));
        const querySnapshot = await getDocs(q);
        const membersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (membersList.length > 0) {
          const dbFounders = membersList.filter(m => m.role === "founder");
          const dbStaff = membersList.filter(m => m.role === "staff");

          if (dbFounders.length > 0) {
            setFounders(dbFounders);
          }
          if (dbStaff.length > 0) {
            setStaff(dbStaff);
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic team data:", error);
      }
    };
    fetchTeam();
  }, []);
  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Animated Background (static) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute w-60 h-60 xs:w-72 xs:h-72 sm:w-96 sm:h-96 rounded-full opacity-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, #ff4300, transparent)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      {/* Additional Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 xs:h-24 sm:h-32 bg-gradient-to-t from-primary/10 to-transparent z-0"></div>
      <div className="absolute top-0 right-0 w-40 xs:w-52 sm:w-64 h-40 xs:h-52 sm:h-64 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl z-0"></div>
      <style jsx>{`
          .gradient-text {
            background: linear-gradient(
              135deg,
              ${colors.primary},
              ${colors.secondary}
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 67, 0, 0.1);
          }
        `}</style>

      {/* Header Section (exact replica of Contact) */}
      <div className="relative h-[160px] xs:h-[200px] sm:h-[220px] md:h-[300px] lg:h-[350px] w-full mb-8 sm:mb-12 overflow-hidden animate-pulse-glow">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/contact.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.8)",
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black" />
        <div className="relative z-10 flex items-center justify-center h-full px-2">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 text-left ">
            About <span className="text-primary ">Hydroplus</span> International
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Owner Section - Responsive with 2 images */}


        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Owner Section - Responsive with 2 images */}
          <div className="max-w-6xl mx-auto mb-20 px-4">
            {/* Heading */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">
                Meet the Founders
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Vision, leadership, and dedication drive Hydroplus International forward.
                Get to know the person behind our success.
              </p>
            </div>

            {/* Cards */}
            <div className={`grid grid-cols-1 ${founders?.length > 1 ? 'md:grid-cols-2' : ''} gap-8 md:gap-10 lg:gap-12 max-w-4xl mx-auto`}>
              {founders?.map((founder, index) => (
                <div key={founder.id || index} className="group transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Image Container */}
                    <div className="relative z-10 mb-6">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-orange-500/50 transition-all duration-500 shadow-xl">
                        <img
                          src={founder.imageUrl}
                          alt={index === 0 ? "Owner Main" : "Co-Founder"}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Decorative ring */}
                      <div className="absolute inset-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-full border-2 border-orange-500/30 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>
                    
                    {/* Name and Title */}
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                        {founder.name}
                      </h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Company Overview */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Hydroplus International stands as a beacon of innovation in the
              water solutions industry. With over two decades of unwavering
              commitment to excellence, we have evolved from a visionary startup
              to a globally recognized leader in manufacturing and supplying
              premium pumps, motors, and power tools.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Our journey is marked by continuous innovation, exceptional
              quality, and an unrelenting focus on customer satisfaction. Today,
              we serve thousands of clients worldwide, delivering solutions that
              power industries and enhance lives.
            </p>
          </div>
        </div>

        {/* Achievements Counter (static) */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="glass-effect rounded-2xl p-6 md:p-8">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  5+
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  Years Experience
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-2xl p-6 md:p-8">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  30+
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  Team Members
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-2xl p-6 md:p-8">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  50+
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  SKUs
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-2xl p-6 md:p-8">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  1000+
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision (static) */}
        <div className="mb-20 grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Target
                className="w-8 h-8 mr-4"
                style={{ color: colors.primary }}
              />
              <h3 className="text-2xl font-bold gradient-text">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To revolutionize the water and power solutions industry by
              delivering innovative, reliable, and sustainable products that
              exceed customer expectations while contributing to global progress
              and environmental stewardship.
            </p>
          </div>
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 mr-4" style={{ color: colors.primary }} />
              <h3 className="text-2xl font-bold gradient-text">Our Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To be the world's most trusted and innovative leader in water and
              power solutions, setting new industry standards while fostering
              sustainable development and empowering communities globally.
            </p>
          </div>
        </div>

        {/* Our Services (static) */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Our Solutions
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-8">
              <div className="mb-6" style={{ color: colors.primary }}>
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">
                Water Pumps
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                High-efficiency water pumps for residential, commercial and
                industrial applications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Submersible Pumps
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Centrifugal Pumps
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Pressure Booster Pumps
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Solar Water Pumps
                </li>
              </ul>
            </div>
            <div className="glass-effect rounded-2xl p-8">
              <div className="mb-6" style={{ color: colors.primary }}>
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">
                Motors & Drives
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Reliable motors and drive systems engineered for optimal
                performance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  AC Motors
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  DC Motors
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Variable Drives
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Motor Controllers
                </li>
              </ul>
            </div>
            <div className="glass-effect rounded-2xl p-8">
              <div className="mb-6" style={{ color: colors.primary }}>
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">
                Power Tools
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Professional-grade power tools for various industrial
                applications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  High-Pressure Washers
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Air Compressors
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Welding Equipment
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <ChevronRight
                    className="w-4 h-4 mr-2"
                    style={{ color: colors.primary }}
                  />
                  Cutting Tools
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values (static) */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 gradient-text">
                  Innovation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Continuously advancing technology to deliver cutting-edge
                  solutions.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 gradient-text">
                  Quality
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Uncompromising commitment to excellence in every product.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 gradient-text">
                  Reliability
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Building trust through consistent performance and dependable
                  service.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6">
                <div
                  className="mb-4 flex justify-center"
                  style={{ color: colors.primary }}
                >
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 gradient-text">
                  Sustainability
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creating eco-friendly solutions for a sustainable future.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us (static) */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Why Choose Hydroplus
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6 h-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-center mb-3 gradient-text">
                  Trusted & Certified
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  ISO 9001:2015 certified, 25+ years of trust in water and air
                  solutions.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6 h-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-center mb-3 gradient-text">
                  Expertise & Support
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Professional team, 750+ SKUs, and strong dealer education.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6 h-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-center mb-3 gradient-text">
                  Wide Product Range
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Specializing in high-pressure washers, air compressors, and
                  more.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="glass-effect rounded-xl p-6 h-full">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-center mb-3 gradient-text">
                  Global Presence
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Products available worldwide, easy access to parts & support.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Owner's Image Gallery Section */}
        <div className="min-h-screen w-full flex flex-col items-center justify-center pb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-orange-600">
            Our Team
          </h2>
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-14">
            {staff?.map((member, idx) => (
              <div
                key={member.id || idx}
                className="relative flex flex-col justify-between h-[28rem] text-center overflow-hidden bg-white rounded-3xl shadow-[0_8px_32px_0_rgba(255,67,0,0.25)] transition-all duration-500 min-w-[240px] max-w-full w-full hover:shadow-[0_12px_40px_0_rgba(255,67,0,0.3)]"
              >
                {/* Top accent circle - orange gradient */}
                <div className="absolute rounded-full h-44 w-44 bg-gradient-to-br from-orange-600 to-orange-500 -top-14 -right-14 z-[2] opacity-85"></div>

                {/* Bottom-left accent circle - white */}
                <div className="absolute rounded-full h-44 w-44 bg-gray-300 -bottom-14 -left-14 z-[2] opacity-85"></div>

                <div className="flex flex-col items-center pt-16 pb-2">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-44 w-44 rounded-full border-[6px] border-orange-50 shadow-[0_0_8px_rgba(255,67,0,0.15)] object-cover bg-white mb-5 mt-4 z-[3] relative block mx-auto"
                  />
                  <h3 className="text-xl font-bold mb-1 text-center tracking-wide text-orange-600">
                    {member.name}
                  </h3>
                  <span className="text-lg font-medium text-center mb-1 block tracking-wider text-gray-600">
                    {member.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Contact Section (static) */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
              Get in Touch
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <a
                href="mailto:contact.hydroplusinternational@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-xl"
                style={{ backgroundColor: `${colors.primary}08` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg mb-3 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div className="gradient-text font-semibold mb-1">Email</div>
                <div className="text-gray-600 text-sm text-center leading-snug">
                  contact.hydroplusinternational@gmail.com
                </div>
              </a>
              <a
                href="tel:+918000074088"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-xl"
                style={{ backgroundColor: `${colors.primary}08` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg mb-3 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div className="gradient-text font-semibold mb-1">Phone</div>
                <div className="text-gray-600 text-sm text-center leading-snug">
                  +91 8000074088
                </div>
              </a>
              <a
                href="https://goo.gl/maps/2w1vQw8Qw8Qw8Qw8A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 rounded-xl"
                style={{ backgroundColor: `${colors.primary}08` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg mb-3 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="gradient-text font-semibold mb-1">Location</div>
                <div className="text-gray-600 text-sm text-center leading-snug">
                  Surat, Gujarat, India
                </div>
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
