// src/layouts/ThemePage.jsx
import React, { createContext, useContext } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

// Create a Theme Context
const ThemeContext = createContext();

// Define your theme
const theme = {
  colors: {
    primary: "#1D72D1",
    secondary: "#6D3BF5",
    background: "#FFFFFF",
    text: "#333333",
  },
};

// Custom hook to access the theme
export function useTheme() {
  return useContext(ThemeContext);
}

// ThemePage component that provides the context
export default function ThemePage({ children }) {
  return (
    <ErrorBoundary>
      <ThemeContext.Provider value={theme}>
        <div className="min-h-screen bg-background text-text font-roboto">
          {children}
        </div>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}
