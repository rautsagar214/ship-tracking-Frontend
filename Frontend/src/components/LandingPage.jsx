import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Truck, Package, Globe, Clock, Shield, CheckCircle, Ship, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY;

export default function LandingPage() {
  const [containerId, setContainerId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock tracking function - replace with actual API call
  const handleTracking = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTrackingResult({
        containerId: containerId,
        status: 'In Transit',
        currentLocation: 'Mumbai Port',
        departureLocation: 'Singapore Port',
        eta: '2024-03-25',
        lastUpdated: new Date().toLocaleString(),
      });
      setLoading(false);
    }, 1500);
  };

  const services = [
    {
      icon: <Truck className="h-12 w-12 text-blue-600" />,
      title: 'Global Shipping',
      description: 'International shipping services across all major ports worldwide',
      image: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=500'
    },
    {
      icon: <Package className="h-12 w-12 text-blue-600" />,
      title: 'Cargo Services',
      description: 'Secure handling of all types of cargo including containers and bulk shipments',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=500'
    },
    {
      icon: <Globe className="h-12 w-12 text-blue-600" />,
      title: 'Worldwide Network',
      description: 'Connected to major shipping routes and ports around the globe',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=500'
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-600" />,
      title: 'Real-time Tracking',
      description: '24/7 shipment tracking and monitoring services',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=500'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Ship className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                ShipTrack
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <motion.button
                onClick={() => scrollToSection('services')}
                className={`font-medium hover:text-blue-400 transition-colors ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                Services
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('about')}
                className={`font-medium hover:text-blue-400 transition-colors ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                About
              </motion.button>
              <Link to="/contact">
                <motion.button
                  className={`font-medium hover:text-blue-400 transition-colors ${
                    isScrolled ? 'text-gray-600' : 'text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  Contact
                </motion.button>
              </Link>
              <Link to="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isScrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Track Shipment
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg ${isScrolled ? 'text-gray-600' : 'text-white'}`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4"
            >
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    scrollToSection('services');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    scrollToSection('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-600"
                >
                  About
                </button>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
                <Link to="/track">
                  <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                    Track Shipment
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute w-full h-full">
          <div
            className="absolute w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1470)',
              filter: 'brightness(0.7)',
              width: '100vw',
              height: '100vh',
            }}
          ></div>
        </div>

        {/* Enhanced Gradient Overlay with better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 pt-32">
          <div className="text-center text-white max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Global Shipping
              <span className="block text-blue-400">Made Simple</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-12 text-gray-200"
            >
              Track your shipment in real-time with our advanced tracking system
            </motion.p>
            
            <Link to="/track">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-medium transition-colors bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl"
              >
                Track Shipment
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

    
     

      {/* Services Section with Images */}
      <div id="services" className="container mx-auto px-6 py-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Section with Parallax */}
      <div id="about" className="relative py-20 bg-fixed bg-cover bg-center"
           style={{ 
             backgroundImage: 'url(https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1470)', 
             backgroundAttachment: 'fixed' 
           }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-8">Why Choose ShipTrack?</h2>
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle className="text-green-400 h-6 w-6" />
                  <p>Global network covering 150+ countries</p>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle className="text-green-400 h-6 w-6" />
                  <p>Real-time tracking and monitoring</p>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle className="text-green-400 h-6 w-6" />
                  <p>Professional and experienced team</p>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                >
                  <CheckCircle className="text-green-400 h-6 w-6" />
                  <p>Competitive rates and flexible solutions</p>
                </motion.div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800" 
                alt="Shipping Container"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer with Modern Design */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-6"
              >
                <Ship className="h-8 w-8" />
                <span className="text-2xl font-bold">ShipTrack</span>
              </motion.div>
              <p className="text-gray-400">Leading global shipping and logistics provider with years of experience in the industry.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/track" className="text-gray-400 hover:text-white transition-colors">
                    Track Shipment
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <button 
                    onClick={() => scrollToSection('services')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Our Services
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <ul className="space-y-4 text-gray-400">
                <motion.li whileHover={{ x: 5 }}>Email: info@shiptrack.com</motion.li>
                <motion.li whileHover={{ x: 5 }}>Phone: +1 234 567 890</motion.li>
                <motion.li whileHover={{ x: 5 }}>Address: 123 Shipping Street</motion.li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Follow Us</h3>
              <div className="flex gap-6">
                <motion.a
                  whileHover={{ y: -5 }}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5 }}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5 }}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -5 }}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 ShipTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 