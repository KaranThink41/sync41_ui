// src/components/Header.jsx
import React from "react";
import { Menu, X, MessageSquare, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../layouts/ThemePage";

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
        className="py-4"
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
              className="ml-2 text-xl font-bold"
              style={{ color: colors.primary }}
            >
              Sync41
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/schedule" className={linkClasses}>
              Home
            </Link>
            <Link to="/schedule/integrations" className={linkClasses}>
              Integrations
            </Link>
            <Link to="/schedule/profile" className={linkClasses}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className={buttonClasses}
              style={{ backgroundColor: colors.primary }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
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
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/schedule/integrations"
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Integrations
              </Link>
              <Link
                to="/schedule/profile"
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className={`${buttonClasses} w-full justify-center`}
                style={{ backgroundColor: colors.primary }}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
