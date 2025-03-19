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
  // For demonstration, authenticated is true.
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <ThemePage>
      <BrowserRouter>
        {isAuthenticated && <Header />}

        <main className={isAuthenticated ? "w-full px-0" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={!isAuthenticated ? <LandingPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignupPage /> : <Navigate to="/schedule" />}
            />

            {/* Protected/Internal Routes */}
            <Route
              path="/schedule"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <PaddingInternalPages>
                    <SchedulePage />
                  </PaddingInternalPages>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule/integrations"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <PaddingInternalPages>
                    <IntegrationPage />
                  </PaddingInternalPages>
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
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
