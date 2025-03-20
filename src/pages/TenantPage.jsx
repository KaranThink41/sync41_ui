// src/pages/TenentPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Your configured Axios or fetch wrapper
import { useTenantStore } from "../store/tenantStore"; // Zustand store for tenant data
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants"; // If needed

export default function TenentPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get the setter function from Zustand to store the tenant id
  const setTenantId = useTenantStore((state) => state.setTenantId);

  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make an API call to /tenant/login/ (proxied via Vite config)
      const response = await api.post("/tenant/login/", {
        email,
        password,
      });

      // Assuming the response contains the tenant id in response.data.tenantId
      const tenantId = response.data.tenantId;
      setTenantId(tenantId);
      console.log("Tenant login success:", response.data);

      // Navigate to dynamic route (e.g., "/<tenantId>/landingpage")
      navigate(`/${tenantId}/landingpage`);
      
    } catch (err) {
      console.error("Tenant login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary animate-gradient-x">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">
          Tenant Login
        </h1>
        <form onSubmit={handleTenantSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="tenantEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="tenantEmail"
              type="email"
              className="mt-1 block w-full rounded-md border border-border bg-backgroundSecondary p-2 text-gray-900 focus:border-primary focus:ring-primary"
              placeholder="tenant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="tenantPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="tenantPassword"
              type="password"
              className="mt-1 block w-full rounded-md border border-border bg-backgroundSecondary p-2 text-gray-900 focus:border-primary focus:ring-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm font-semibold">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-primary text-white font-semibold hover:bg-secondary transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
          <button onClick={handleTenantSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}
