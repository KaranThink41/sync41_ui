// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SchedulePage from "./pages/SchedulePage";
import IntegrationPage from "./pages/IntegrationPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemePage from "./layouts/ThemePage";
import PaddingInternalPages from "./layouts/PaddingInternalPages"; // New layout for internal pages

function App() {
  // We are no longer setting an "isAuthenticated" state here since authentication is now based on token availability.
  // Public pages (Landing, Login, Signup) are accessible without authentication.
  // Protected pages will check localStorage for a token using ProtectedRoute.
  
  return (
    <ThemePage>
      <BrowserRouter>
        {/* Show Header if token exists */}
        {localStorage.getItem("ACCESS_TOKEN_KEY") && <Header />}

        <main className={localStorage.getItem("ACCESS_TOKEN_KEY") ? "w-full px-0" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={!localStorage.getItem("ACCESS_TOKEN_KEY") ? <LandingPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/login"
              element={!localStorage.getItem("ACCESS_TOKEN_KEY") ? <LoginPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/signup"
              element={!localStorage.getItem("ACCESS_TOKEN_KEY") ? <SignupPage /> : <Navigate to="/schedule" />}
            />

            {/* Protected/Internal Routes */}
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <PaddingInternalPages>
                    <SchedulePage />
                  </PaddingInternalPages>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule/integrations"
              element={
                <ProtectedRoute>
                  <PaddingInternalPages>
                    <IntegrationPage />
                  </PaddingInternalPages>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule/profile"
              element={
                <ProtectedRoute>
                  <PaddingInternalPages>
                    <ProfilePage />
                  </PaddingInternalPages>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemePage>
  );
}

export default App;
