// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TenantPage from "./pages/TenantPage"; // Tenant page for input
import LandingPage from "./pages/LandingPage";
import SchedulePage from "./pages/SchedulePage";
import IntegrationPage from "./pages/IntegrationPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemePage from "./layouts/ThemePage";
import PaddingInternalPages from "./layouts/PaddingInternalPages";

function App() {
  // Get the token from localStorage
  const token = localStorage.getItem("ACCESS_TOKEN_KEY");

  return (
    <ThemePage>
      <BrowserRouter>
        {/* 
          Public pages do not show the header.
          Protected pages (wrapped by PaddingInternalPages) include the header automatically.
        */}
        <main className={token ? "w-full px-0" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={!token ? <TenantPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/login"
              element={!token ? <LoginPage /> : <Navigate to="/schedule" />}
            />
            <Route
              path="/signup"
              element={!token ? <SignupPage /> : <Navigate to="/schedule" />}
            />
            {/* Dynamic tenant landing page */}
            <Route
              path="/:tenant/landingpage"
              element={!token ? <LandingPage /> : <Navigate to="/schedule" />}
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
