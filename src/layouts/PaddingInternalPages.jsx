// src/layout/PaddingInternalPages.jsx

import React from "react";
import { useTheme } from "./ThemePage";
import ErrorBoundary from "../components/ErrorBoundary";

/**
 * PaddingInternalPages layout that adds 120px horizontal padding
 * to its children, intended for post-login (internal) pages only.
 */
export default function PaddingInternalPages({ children }) {
  const { colors } = useTheme();

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen font-roboto bg-background text-text"
        style={{
          paddingLeft: "150px",
          paddingRight: "150px",
          paddingTop: "30px", // Added vertical spacing to create gap below header
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {children}
      </div>
    </ErrorBoundary>
  );
}
