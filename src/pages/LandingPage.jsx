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

// Testimonials for social proof
const testimonials = [
  {
    quote: "Sync41 transformed our workflow efficiency by 300%. The integration capabilities are unmatched in the industry.",
    author: "Anshuman Singh",
    position: "Co-founder @ Think41"
  },
  {
    quote: "After implementing Sync41, our team saved 20 hours per week on manual data transfers. The ROI was immediate.",
    author: "Himanshu Varshney",
    position: "Co-founder @ Think41"
  },
  {
    quote: "The security features and compliance standards of Sync41 gave us confidence to move our entire enterprise stack to their platform.",
    author: "Sripathi Krishnan",
    position: "Co-founder @ Think41"
  }
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
        <Header />

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
                className="absolute inset-0 z-[-1]"
                style={{ background: "linear-gradient(to bottom, #1D72D1, #1a365d)" }}
              />
            }
          >
            <ParticleField />
          </Suspense>

          {/* Semi-transparent overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30 z-[1]" />

          <div className="relative z-[2] flex flex-col items-center text-center px-4 max-w-6xl mx-auto">
            {/* Heading */}
            <motion.h1
              className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight font-montserrat text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Enterprise Integration Platform
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Seamlessly connect your business applications and automate workflows with our powerful integration platform.
            </motion.p>

            {/* Get Started Button */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-transparent text-white border-2 border-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
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
        <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] font-montserrat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Enterprise Integration Solutions
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our platform connects your essential business tools through intelligent automation, saving time and reducing errors.
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-8 border rounded-xl transition-all bg-white shadow-lg border-[#E2E8F0] hover:shadow-xl hover:border-[#1D72D1] group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  >
                    <motion.div
                      className="mb-6 p-4 rounded-full w-fit mx-auto bg-[#1D72D1] group-hover:bg-[#6D3BF5] transition-colors duration-300"
                      whileHover={{ rotate: 3, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-[#1D72D1] font-montserrat group-hover:text-[#6D3BF5] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-600 font-roboto">
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
          className="py-20"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] font-montserrat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Integration Workflow
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A streamlined approach to connecting your business systems and automating workflows.
            </motion.p>

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
                    className="min-w-[280px] md:min-w-[320px] p-8 border rounded-xl transition-all bg-gradient-to-br from-[#1D72D1] to-[#6D3BF5] border-[#334155] flex-shrink-0 shadow-lg hover:shadow-xl"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {step.title}
                    </h3>
                    <p className="text-base font-medium text-gray-100">
                      {step.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] font-montserrat"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Trusted by Industry Leaders
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              See what our clients have to say about their experience with our platform.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="p-8 bg-white rounded-xl shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="mb-4 text-[#1D72D1]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-20 bg-gradient-to-r from-[#1D72D1] to-[#6D3BF5] text-center">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Experience Seamless Integration
            </motion.h2>
            <p className="text-xl text-gray-100 mb-10 max-w-3xl mx-auto">
              Unify your business with a platform that connects your essential tools through smart automation.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl bg-transparent text-white border-2 border-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="w-full py-12 bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">Sync41</h3>
                <p className="text-gray-400">Enterprise Integration Platform for modern businesses.</p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                  <li><Link to="/enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link to="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                  <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/partners" className="hover:text-white transition-colors">Partners</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0"> 2025 Sync41 Technologies. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-white">Terms of Service</Link>
                <Link to="/cookies" className="text-sm text-gray-500 hover:text-white">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}
