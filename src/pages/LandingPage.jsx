// src/pages/LandingPage.jsx
import React, { useState, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ArrowRight, Zap, Cpu, Cloud, Lock, Globe, MessageSquare } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import ErrorBoundary from "../components/ErrorBoundary";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../layouts/ThemePage";

// -------------------------------
// ParticleField: Subtle animated star background
// -------------------------------
const ParticleField = () => {
  const { colors } = useTheme();
  return (
    <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${colors.primary}, #1a365d)` }}>
      <Canvas>
        <Stars
          radius={150}
          depth={60}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
          color="#FFFFFF"
          size={1.5}
          sizeAttenuation
        />
        <OrbitControls enableZoom={false} autoRotate enablePan={false} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

// -------------------------------
// Hero Slider Settings
// -------------------------------
const heroSliderSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 8000,
  fade: true,
  arrows: false,
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
// Process Steps (No numbering)
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

  // For the progress bar at the top
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  // For auto-scrolling marquee (horizontal) that pauses on hover
  const [isHovering, setIsHovering] = useState(false);

  return (
    <ErrorBoundary>
      <div className="relative font-roboto">
        {/* Progress Bar */}
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
          <Suspense fallback={<div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${colors.primary}, #1a365d)` }} />}>
            <ParticleField />
          </Suspense>
          {/* Semi-transparent overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="relative z-20 text-center">
            <motion.h1
              className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Enterprise Integration Platform
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16" style={{ backgroundColor: colors.background }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-3xl font-bold mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ color: colors.primary }}
            >
              Enterprise Integration Solutions
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-6 border rounded-xl transition-colors"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <motion.div
                      className="mb-4 p-3 rounded-full w-fit mx-auto"
                      whileHover={{ rotate: 3 }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROCESS SECTION (Horizontal auto-scroll, no numbering) */}
        <section className="py-16" style={{ backgroundColor: colors.background }}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ color: colors.primary }}
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
                {/* Duplicate the steps array so it loops seamlessly */}
                {[...processSteps, ...processSteps].map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="min-w-[280px] md:min-w-[320px] p-6 bg-white border rounded-xl flex-shrink-0"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16" style={{ backgroundColor: colors.background }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              className="rounded-xl p-12 relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 0 0 2px ${colors.primary}20`,
              }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
                Experience Effortless Integration
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
                Empower your business with a unified platform that connects all your critical tools through intelligent automation.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer
          className="border-t"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.background,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-12 text-center" style={{ color: colors.primary }}>
            <motion.div
              className="mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Zap className="h-8 w-8 mx-auto" />
            </motion.div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Sync41 Technologies. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
