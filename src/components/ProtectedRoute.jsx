// src/layouts/PaddingInternalPages.jsx
import React from "react";
import { useTheme } from "../layouts/ThemePage";
import ErrorBoundary from "../components/ErrorBoundary";
import ProtectedNavbar from "../components/ProtectedNavbar"; // <-- Import your ProtectedNavbar here

/**
 * PaddingInternalPages layout that adds horizontal padding
 * and now also includes the ProtectedNavbar for post-login pages.
 */
export default function PaddingInternalPages({ children }) {
  const { colors } = useTheme();

  return (
    <ErrorBoundary>
      {/* Always show ProtectedNavbar for internal pages */}
      <ProtectedNavbar />

      <div
        className="min-h-screen font-roboto bg-background text-text"
        style={{
          paddingLeft: "150px",
          paddingRight: "150px",
          paddingTop: "30px", // gap below header
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {children}
      </div>
    </ErrorBoundary>
  );
}
