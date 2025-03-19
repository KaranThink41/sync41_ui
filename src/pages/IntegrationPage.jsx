// src/pages/IntegrationPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { 
  FaGoogle, 
  FaSlack, 
  FaWhatsapp, 
  FaMicrosoft, 
  FaCalendarAlt,
  FaGoogleDrive
} from "react-icons/fa";
import IntegrationCard from "../components/IntegrationCard";
import ThemePage, { useTheme } from "../layouts/ThemePage";
import PaddingInternalPages from "../layouts/PaddingInternalPages";
import ErrorBoundary from "../components/ErrorBoundary";

const IntegrationPage = () => {
  const { colors } = useTheme();
  const [services, setServices] = useState([
    { name: "Gmail", icon: FaGoogle, isConnected: false, lastSynced: null, autoSync: false, error: null },
    { name: "Google Drive", icon: FaGoogleDrive, isConnected: false, lastSynced: null, autoSync: false, error: null },
    { name: "Slack", icon: FaSlack, isConnected: false, lastSynced: null, autoSync: false, error: null },
    { name: "WhatsApp", icon: FaWhatsapp, isConnected: false, lastSynced: null, autoSync: false, error: null },
    { name: "Outlook", icon: FaMicrosoft, isConnected: false, lastSynced: null, autoSync: false, error: null },
    { name: "Google Calendar", icon: FaCalendarAlt, isConnected: false, lastSynced: null, autoSync: false, error: null },
  ]);

  const [popup, setPopup] = useState({ show: false, service: null });

  const handleConnect = (serviceName) => {
    setPopup({ show: true, service: serviceName });
  };

  const confirmConnection = () => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.name === popup.service
          ? {
              ...service,
              isConnected: !service.isConnected,
              lastSynced: !service.isConnected ? new Date().toLocaleString() : null,
              error: null,
            }
          : service
      )
    );
    setPopup({ show: false, service: null });
  };

  const onTestConnection = (serviceName) => {
    alert(`Testing connection for ${serviceName}...`);
  };

  const onConfigureService = (serviceName) => {
    alert(`Configure settings for ${serviceName}`);
  };

  const onToggleAutoSync = (serviceName) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.name === serviceName
          ? { ...service, autoSync: !service.autoSync }
          : service
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <ErrorBoundary> {/* Wrap with ErrorBoundary */}
      <ThemePage>
        <PaddingInternalPages>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full overflow-hidden"
            style={{ fontFamily: "Inter, sans-serif", backgroundColor: colors.background, color: colors.text }}
          >
            <div className="max-w-7xl mx-auto py-6">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold py-2 mb-4"
                style={{ color: colors.primary }}
              >
                Integration Services
              </motion.h1>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
              >
                {services.map((service) => (
                  <motion.div key={service.name} variants={itemVariants}>
                    <IntegrationCard 
                      service={service} 
                      onConnect={handleConnect}
                      onTestConnection={onTestConnection}
                      onConfigureService={onConfigureService}
                      onToggleAutoSync={onToggleAutoSync}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Confirmation Popup with inline style */}
              <AnimatePresence>
                {popup.show && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="p-8 rounded-lg shadow-xl max-w-md w-full"
                      style={{ 
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#FFFFFF", // White background for the popup
                        color: colors.text,
                      }}
                    >
                      <div className="text-center mb-6">
                        <div className="mx-auto mb-4 flex items-center justify-center">
                          {services.find((s) => s.name === popup.service)?.isConnected ? (
                            <div className="relative">
                              <div className="absolute -inset-1 bg-red-100 opacity-50 blur-sm rounded-full"></div>
                              <FiXCircle className="w-14 h-14 relative" style={{ color: "#e3342f" }} />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="absolute -inset-1 bg-green-100 opacity-50 blur-sm rounded-full"></div>
                              <FiCheckCircle className="w-14 h-14 relative" style={{ color: "#38c172" }} />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>
                          {services.find((s) => s.name === popup.service)?.isConnected
                            ? `Disconnect ${popup.service}?`
                            : `Connect ${popup.service}?`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {services.find((s) => s.name === popup.service)?.isConnected
                            ? "This will revoke access to your account data."
                            : "This will allow access to basic account information."}
                        </p>
                      </div>

                      <div className="flex justify-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-lg font-medium shadow-md"
                          style={{
                            backgroundColor: colors.primary,
                            color: "#FFFFFF",
                          }}
                          onClick={confirmConnection}
                        >
                          Confirm
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-lg font-medium shadow-md"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}`,
                          }}
                          onClick={() => setPopup({ show: false, service: null })}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </PaddingInternalPages>
      </ThemePage>
    </ErrorBoundary> 
  );
};

export default IntegrationPage;