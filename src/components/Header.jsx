// src/components/Header.jsx
import React from "react";
import { Menu, X, MessageSquare, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../layouts/ThemePage";
import Button from '../components/Button';

export default function Header({ className = "" }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/" || location.pathname === "";
  
  // Check if we're on a protected route (after login)
  const isProtectedRoute = location.pathname.startsWith("/schedule");

  const handleLogout = () => {
    navigate("/login");
  };

  const linkClasses =
    "text-text-secondary hover:text-text transition-colors duration-200 px-3 py-2 rounded-md hover:bg-background-secondary";

  const buttonClasses = `
    flex items-center px-4 py-2 rounded-lg transition-all
    text-white
    border border-transparent
    hover:text-${colors.secondary}
    hover:bg-transparent
  `;

  return (
    <header
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${className} 
        ${isLandingPage && !isProtectedRoute ? 'bg-transparent backdrop-blur-sm' : 'bg-white shadow-sm'}`}
      style={{
        backgroundColor: isLandingPage && !isProtectedRoute ? 'rgba(0,0,0,0.2)' : colors.background,
        color: isLandingPage && !isProtectedRoute ? 'white' : colors.text,
      }}
    >
      {/* Use the same 150px horizontal padding as PaddingInternalPages */}
      <div
        className="py-1.2"
        style={{
          paddingLeft: "306px",
          paddingRight: "306px",
        }}
      >
        <div className="flex justify-between items-center">
          {/* Logo (click navigates to /schedule) */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate(isLandingPage ? "/" : "/schedule")}
          >
            <MessageSquare className={`h-7 w-7 ${isLandingPage && !isProtectedRoute ? 'text-white' : ''}`} style={{ color: isLandingPage && !isProtectedRoute ? 'white' : colors.primary }} />
            <span
              className={`ml-2 text-xl font-bold ${isLandingPage && !isProtectedRoute ? 'text-white hover:text-gray-200' : 'text-[#1D72D1] hover:text-[#6D3BF5]'} cursor-pointer`}
              onClick={() => navigate(isLandingPage ? "/" : "/schedule")}
            >
              Sync41
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isLandingPage ? (
              <>
                <Link to="/about" className={`text-lg font-bold ${isLandingPage && !isProtectedRoute ? 'text-white hover:text-gray-200' : 'text-[#1D72D1] hover:text-[#6D3BF5]'} transition-colors duration-200 px-3 py-2 rounded-md`}>About</Link>
                <Link to="/services" className={`text-lg font-bold ${isLandingPage && !isProtectedRoute ? 'text-white hover:text-gray-200' : 'text-[#1D72D1] hover:text-[#6D3BF5]'} transition-colors duration-200 px-3 py-2 rounded-md`}>Services</Link>
                <Link to="/pricing" className={`text-lg font-bold ${isLandingPage && !isProtectedRoute ? 'text-white hover:text-gray-200' : 'text-[#1D72D1] hover:text-[#6D3BF5]'} transition-colors duration-200 px-3 py-2 rounded-md`}>Pricing</Link>
                <Link to="/login" className={`text-lg font-bold ${isLandingPage && !isProtectedRoute ? 'text-white hover:text-gray-200' : 'text-[#1D72D1] hover:text-[#6D3BF5]'} transition-colors duration-200 px-3 py-2 rounded-md`}>Login</Link>
                <Link to="/signup" className="ml-2 inline-flex items-center px-6 py-2 text-base font-bold rounded-lg bg-white text-[#1D72D1] shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-105">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/schedule" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Home</Link>
                <Link to="/schedule/integrations" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Integrations</Link>
                <Link to="/schedule/profile" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Profile</Link>
                <button onClick={handleLogout} className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5]">Logout</button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isLandingPage && !isProtectedRoute ? 'text-white' : 'text-gray-500'} hover:text-gray-300 focus:outline-none`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden ${isLandingPage && !isProtectedRoute ? 'bg-black bg-opacity-80' : 'bg-white'} border-t border-gray-700 py-4`}>
            <div className="flex flex-col space-y-2">
              {isLandingPage ? (
                <>
                  <Link
                    to="/about"
                    className="text-lg font-bold text-white hover:text-gray-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/services"
                    className="text-lg font-bold text-white hover:text-gray-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-lg font-bold text-white hover:text-gray-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/login"
                    className="text-lg font-bold text-white hover:text-gray-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-lg font-bold text-white hover:text-gray-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/schedule"
                    className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/schedule/integrations"
                    className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Integrations
                  </Link>
                  <Link
                    to="/schedule/profile"
                    className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] py-2">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
