// src/components/LandingNavbar.jsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-white/30 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo / Brand - non-navigating */}
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
              Sync41
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium">
              About
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium">
              Services
            </a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium">
              Pricing
            </a>
            <Link
              to="/tenant"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Tenant
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-white text-primary font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-white hover:text-gray-200 transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 bg-white/40 backdrop-blur-sm shadow-sm">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium" onClick={() => setIsOpen(false)}>
                Services
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors font-medium" onClick={() => setIsOpen(false)}>
                Pricing
              </a>
              <Link
                to="/tenant"
                className="text-white hover:text-gray-200 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Tenant
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-fit px-4 py-2 bg-white text-primary font-semibold rounded-lg hover:scale-105 transition-transform"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
