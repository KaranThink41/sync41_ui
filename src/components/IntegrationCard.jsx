// src/components/IntegrationCard.jsx
import React from "react";
import { motion } from "framer-motion";
import GmailLogo from "../assets/gmail.svg";
import GoogleDriveLogo from "../assets/google-drive.svg";
import SlackLogo from "../assets/slack.svg";
import OutlookLogo from "../assets/outlook.svg";
import GoogleCalendarLogo from "../assets/google-calendar.svg";
import GitHubLogo from "../assets/github.svg"; // Add GitHub logo asset
import { useTheme } from "../layouts/ThemePage";
import Button from "../components/Button"; // Import the Button component

export default function IntegrationCard({ 
  service, 
  onConnect, 
  onTestConnection, 
  onConfigureService, 
  onToggleAutoSync 
}) {
  const { colors } = useTheme();

  const getServiceIcon = () => {
    switch(service.name) {
      case "Gmail":
        return <img src={GmailLogo} alt="Gmail Logo" className="w-10 h-10 mx-auto" />;
      case "Google Drive":
        return <img src={GoogleDriveLogo} alt="Google Drive Logo" className="w-10 h-10 mx-auto" />;
      case "Slack":
        return <img src={SlackLogo} alt="Slack Logo" className="w-10 h-10 mx-auto" />;
      case "GitHub":
        return <img src={GitHubLogo} alt="GitHub Logo" className="w-10 h-10 mx-auto" />;
      case "Outlook":
        return <img src={OutlookLogo} alt="Outlook Logo" className="w-10 h-10 mx-auto" />;
      case "Google Calendar":
        return <img src={GoogleCalendarLogo} alt="Google Calendar Logo" className="w-10 h-10 mx-auto" />;
      default:
        return <div className="text-sm text-gray-500">No Logo</div>;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-3xl p-8 text-center shadow-sm hover:shadow-md border"
      style={{
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.primary,
        color: colors.text,
      }}
    >
      <div className="mb-4">
        {getServiceIcon()}
      </div>

      <h3 className="font-medium text-xl mb-1" style={{ color: colors.primary }}>
        {service.name}
      </h3>

      <p 
        className="text-lg font-semibold mb-3"
        style={{ color: service.isConnected ? "#38c172" : colors.textSecondary }}
      >
        {service.isConnected ? "Connected" : "Not Connected"}
      </p>

      {service.isConnected && service.lastSynced && (
        <p className="text-xs mb-3 text-gray-500">
          Last Synced: {service.lastSynced}
        </p>
      )}

      <Button 
        onClick={() => onConnect(service.name)}
        variant={service.isConnected ? "outline" : "primary"}
        fullWidth
      >
        {service.isConnected ? "Disconnect" : "Connect"}
      </Button>

      {service.isConnected && (
        <>
          <div className="mt-3 space-y-2">
            <Button 
              onClick={() => onTestConnection(service.name)}
              variant="primary"
              fullWidth
            >
              Test Connection
            </Button>
            <Button 
              onClick={() => onConfigureService(service.name)}
              variant="primary"
              fullWidth
            >
              Configure
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={service.autoSync || false}
                onChange={() => onToggleAutoSync(service.name)}
              />
              <span className="ml-2 text-sm" style={{ color: colors.primary }}>
                Auto-Sync
              </span>
            </label>
          </div>
        </>
      )}

      {service.error && (
        <div className="mt-2">
          <span className="text-xs" style={{ color: "#e3342f" }}>
            {service.error}
          </span>
        </div>
      )}
    </motion.div>
  );
}
