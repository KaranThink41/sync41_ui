import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaRobot,
  FaChartBar,
  FaCloud,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import ErrorBoundary from "../components/ErrorBoundary";
import { ACCESS_TOKEN_KEY } from "../constants";
import api from "../api";
import { useTheme } from "../layouts/ThemePage";
import Button from "../components/Button";
import { create }from "zustand";

// Zustand store for global state - to store JWT tokens
const useStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
}));

export default function LoginPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setTokens } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      // Using the absolute API endpoint from your old login page
      const res = await api.post("http://ec2-3-91-217-18.compute-1.amazonaws.com:8000/auth/login/", { email, password });
      
      // Store the access token in localStorage for persistent sessions
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
      
      // Store tokens in global state using Zustand
      setTokens(res.data.access, res.data.refresh);
      
      navigate("/schedule");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-text font-roboto"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl border flex flex-col lg:flex-row overflow-hidden"
          style={{ borderColor: colors.primary }}
        >
          <div className="flex flex-col lg:flex-row min-h-[700px] w-full">
            {/* Left Side - Login Form */}
            <div className="flex-1 p-12 space-y-8 border-r border-gray-100">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center mb-12"
              >
                {/* Animated Icon */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-6"
                >
                  <div className="text-6xl" style={{ color: colors.primary }}>
                    <FaUser />
                  </div>
                </motion.div>

                {/* Heading */}
                <h2
                  className="font-montserrat text-4xl font-bold"
                  style={{ color: colors.primary }}
                >
                  Welcome Back
                </h2>
                <p
                  className="text-body mt-2"
                  style={{ color: colors.primary }}
                >
                  Sync41 Integration Platform
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {/* Email Field */}
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4,
                      type: "tween",
                      ease: "easeOut",
                      duration: 0.5,
                    }}
                    className="group relative"
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Email
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser style={{ color: colors.primary }} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        style={{ borderColor: colors.primary }}
                        placeholder="Email"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5,
                      type: "tween",
                      ease: "easeOut",
                      duration: 0.5,
                    }}
                    className="group relative"
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock style={{ color: colors.primary }} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        style={{ borderColor: colors.primary }}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Access Dashboard"}
                </Button>

                <div className="flex flex-col gap-4 text-center">
                  <Link
                    to="/signup"
                    className="text-lg font-medium transition-colors hover:text-secondary"
                    style={{ color: colors.primary }}
                  >
                    Don't have an account? Start Free Trial →
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium transition-colors hover:text-secondary"
                    style={{ color: colors.primary }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Right Side - Features Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="flex-1 p-12 hidden lg:flex flex-col justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <h3 className="font-montserrat text-2xl font-bold mb-8 text-white">
                Why Sync41?
              </h3>
              <div className="space-y-8">
                {[
                  {
                    icon: <FaRobot className="text-3xl" />,
                    title: "Smart Automation",
                    text: "Streamline integration workflows with AI-driven orchestration",
                  },
                  {
                    icon: <FaChartBar className="text-3xl" />,
                    title: "Real-time Analytics",
                    text: "Interactive dashboards delivering insights on integration performance",
                  },
                  {
                    icon: <FaCloud className="text-3xl" />,
                    title: "Cloud Connectivity",
                    text: "Effortless data flow across multiple platforms and services",
                  },
                  {
                    icon: <FaUser className="text-3xl" />,
                    title: "Collaborative Management",
                    text: "Customizable access and permissions for your integration teams",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.2,
                      type: "tween",
                      duration: 0.5,
                    }}
                    className="group flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border border-transparent hover:border-primary"
                    style={{ willChange: "transform, opacity", color: "#FFFFFF" }}
                  >
                    <div className="transition-colors">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-sm mt-1" style={{ color: "#f1f1f1" }}>
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                className="mt-12 pt-8"
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}
              >
                <div className="flex flex-col gap-3 text-sm" style={{ color: "#f1f1f1" }}>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle style={{ color: "#FFFFFF" }} />
                    <span>Secure data protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle style={{ color: "#FFFFFF" }} />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  );
}
