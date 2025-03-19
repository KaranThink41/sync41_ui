// src/pages/LandingPage.jsx

import React, { useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Cpu, Cloud, Lock, Globe, MessageSquare } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import ErrorBoundary from "../components/ErrorBoundary";
import { useTheme } from "../layouts/ThemePage";
import Header from "../components/Header";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// -------------------------------
// ParticleField: Subtle animated star background
// -------------------------------
const ParticleField = () => {
  const { colors } = useTheme();
  return (
    <div
      className="absolute inset-0 z-0"
      style={{ background: "linear-gradient(to bottom, #1D72D1, #1a365d)" }}
    >
      <Canvas>
        <Stars
          radius={150} // Reduced radius
          depth={80} // Reduced depth
          count={4000} // reduced count
          factor={6}
          saturation={0.2}
          fade
          speed={0.3}
          color="#FFFFFF"
          size={20} // increased size
          sizeAttenuation={false} // disabled attenuation
        />
        <OrbitControls enableZoom={false} autoRotate enablePan={false} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

// -------------------------------
// Feature List
// -------------------------------
const features = [
  { icon: Zap, title: "Instant Deployment", description: "Deploy global infrastructure in 60s." },
  { icon: Cpu, title: "AI Automation", description: "Optimize workflows with machine learning." },
  { icon: Cloud, title: "Multi-Cloud Sync", description: "Unified control for AWS, GCP & Azure." },
  { icon: Lock, title: "Zero-Trust Security", description: "Quantum-resistant encryption for your data." },
  { icon: Globe, title: "Edge Network", description: "200+ POPs with sub-20ms latency." },
  { icon: MessageSquare, title: "Unified Comms", description: "Integrated communication suite." },
];

// -------------------------------
// Process Steps
// -------------------------------
const processSteps = [
  {
    title: "System Integration",
    description: "Seamless API-first integration across your ecosystem.",
  },
  {
    title: "Workflow Automation",
    description: "Intelligent process orchestration for your business.",
  },
  {
    title: "Data Unification",
    description: "Cross-platform data synchronization for unified insights.",
  },
  {
    title: "Real-Time Insights",
    description: "Instant analytics to drive smarter decisions.",
  },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const { colors } = useTheme();

  // Progress bar animation at the top of the page
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  // For the horizontal marquee in "Our Integration Workflow"
  const [isHovering, setIsHovering] = useState(false);

  // Scroll down handler
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <ErrorBoundary>
      <div className="relative font-roboto">
        {/* Header with semi-transparent background */}
        <Header className="bg-black/50" />

        {/* Top Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 z-50"
          style={{
            scaleX,
            transformOrigin: "left",
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.background})`,
          }}
        />

        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <Suspense
            fallback={
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, #1D72D1, #1a365d)" }}
              />
            }
          >
            <ParticleField />
          </Suspense>

          {/* Semi-transparent overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30 z-10" />

          <div className="relative z-20 flex flex-col items-center text-center">
            {/* Heading */}
            <motion.h1
              className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight font-montserrat text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Enterprise Integration Platform
            </motion.h1>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-[#1D72D1] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>

            {/* New Scroll Down Indicator */}
            <motion.div
              className="mt-64 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              onClick={handleScrollDown}
            >
              <div className="flex flex-col items-center">
                <span className="text-white text-sm font-medium mb-2">Scroll Down</span>
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4 text-white transform rotate-90" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] font-montserrat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Enterprise Integration Solutions
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-6 border rounded-xl transition-colors bg-white shadow-lg border-[#E2E8F0]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <motion.div
                      className="mb-4 p-3 rounded-full w-fit mx-auto"
                      whileHover={{ rotate: 3 }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: "#1D72D1" }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-[#1D72D1] font-montserrat">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-roboto">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROCESS SECTION (Horizontal auto-scroll) */}
        <section
          className="py-16"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] font-montserrat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Integration Workflow
            </motion.h2>

            {/* Horizontal marquee container */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-8"
                style={{ x: 0 }}
                animate={{
                  x: isHovering ? 0 : ["0%", "-100%"], // auto-scroll from 0% to -100%
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  duration: 20, // Adjust speed here
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {[...processSteps, ...processSteps].map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="min-w-[280px] md:min-w-[320px] p-6 border rounded-xl transition-colors bg-[#1D72D1] border-[#334155] flex-shrink-0 shadow-lg"
                  >
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-16 bg-gray-100 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold mb-4 text-[#1D72D1]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Experience Seamless Integration
            </motion.h2>
            <p className="text-lg text-gray-700 mb-8">
              Unify your business with a platform that connects your essential tools through smart automation.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-[#1D72D1] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="w-full py-8 bg-gray-200 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-600 mb-4"> 2025 Sync41 Technologies. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <Link to="/about" className="text-gray-700 hover:text-[#1D72D1]">About Us</Link>
              <Link to="/services" className="text-gray-700 hover:text-[#1D72D1]">Services</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-[#1D72D1]">Pricing</Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#1D72D1]">Contact</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-[#1D72D1]">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-700 hover:text-[#1D72D1]">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}
