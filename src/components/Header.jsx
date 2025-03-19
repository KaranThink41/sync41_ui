// src/components/Header.jsx
import React from "react";
import { Menu, X, MessageSquare, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../layouts/ThemePage";
import Button from '../components/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { colors } = useTheme();

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
      className="sticky top-0 z-50 shadow-sm w-full"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
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
            onClick={() => navigate("/schedule")}
          >
            <MessageSquare className="h-7 w-7" style={{ color: colors.primary }} />
            <span
              className="ml-2 text-xl font-bold text-[#1D72D1] hover:text-[#6D3BF5] cursor-pointer"
              onClick={() => navigate("/schedule")}
            >
              Sync41
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/schedule" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Home</Link>
            <Link to="/schedule/integrations" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Integrations</Link>
            <Link to="/schedule/profile" className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5] transition-colors duration-200 px-3 py-2 rounded-md">Profile</Link>
            <button onClick={handleLogout} className="text-lg font-bold text-[#1D72D1] hover:text-[#6D3BF5]">Logout</button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
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
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
