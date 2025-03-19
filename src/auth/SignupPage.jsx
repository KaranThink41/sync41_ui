import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaCloud,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaRobot,
  FaChartBar,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import ErrorBoundary from "../components/ErrorBoundary";
import { ACCESS_TOKEN_KEY } from "../constants";
import api from "../api";
import Button from "../components/Button";
import { useTheme } from "../layouts/ThemePage";

export default function SignupPage() {
  // Tenant ID from your old signup page
  const tenant_id = "708d3f5f-de53-40ff-b531-3f7a6fab4844";
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength logic
  const [passwordStrength, setPasswordStrength] = useState(0);
  const calculateStrength = (pass) => {
    let strength = 0;
    if (/.{8,}/.test(pass)) strength += 40;  // at least 8 characters
    if (/[A-Z]/.test(pass)) strength += 30;     // uppercase letter
    if (/[0-9]/.test(pass)) strength += 30;     // number
    return Math.min(strength, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      // Using the absolute API endpoint with tenant_id included
      const res = await api.post("http://127.0.0.1:8000/auth/signup/", {
        name,
        tenant_id,
        email,
        password,
      });
      // Store the access token in localStorage for persistent sessions
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(calculateStrength(value));
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
            {/* Left Side - Signup Form */}
            <div className="flex-1 p-12 space-y-8 border-r border-gray-100">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center mb-12"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-6"
                >
                  <div className="text-6xl" style={{ color: colors.primary }}>
                    <FaBolt />
                  </div>
                </motion.div>
                <h2 className="font-montserrat text-h1 font-bold" style={{ color: colors.primary }}>
                  Create Your Account
                </h2>
                <p className="text-body mt-2" style={{ color: colors.primary }}>
                  Sync41 Integration Platform
                </p>
              </motion.div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {/* Full Name Field */}
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "tween", ease: "easeOut", duration: 0.5 }}
                    className="group relative"
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.primary }}
                    >
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-primary" style={{ color: colors.primary }} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter your full name"
                        style={{ borderColor: colors.primary }}
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "tween", ease: "easeOut", duration: 0.5 }}
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
                        <FaCloud className="text-primary" style={{ color: colors.primary }} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter your email"
                        style={{ borderColor: colors.primary }}
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, type: "tween", ease: "easeOut", duration: 0.5 }}
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
                        <FaLock className="text-primary" style={{ color: colors.primary }} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter a secure password"
                        style={{ borderColor: colors.primary }}
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
                    <div className="mt-2">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="flex flex-col gap-4 text-center">
                  <Link
                    to="/login"
                    className="text-lg font-medium transition-colors hover:text-secondary"
                    style={{ color: colors.primary }}
                  >
                    Already have an account? Sign In →
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
                    transition={{ delay: 0.6 + index * 0.2, type: "tween", duration: 0.5 }}
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
