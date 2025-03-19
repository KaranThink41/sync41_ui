// src/pages/ProfilePage.jsx
import React, { useState, Suspense } from "react";
import {
  Shield,
  Bell,
  Edit2,
  Trash,
  Lock,
  Globe,
  Mail,
  Cloud,
  Calendar,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThemePage, { useTheme } from "../layouts/ThemePage";
import Button from "../components/Button";
import ErrorBoundary from "../components/ErrorBoundary";
import PaddingInternalPages from "../layouts/PaddingInternalPages";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  });

  const [connectedServices] = useState([
    {
      id: 1,
      name: "Gmail",
      icon: <Mail size={18} style={{ color: colors.primary }} />, 
      lastSync: "2024-03-10 15:30",
      status: "Connected",
    },
    {
      id: 2,
      name: "Drive",
      icon: <Cloud size={18} style={{ color: colors.primary }} />, 
      lastSync: "2024-03-10 14:45",
      status: "Connected",
    },
    {
      id: 3,
      name: "Calendar",
      icon: <Calendar size={18} style={{ color: colors.primary }} />, 
      lastSync: "2024-03-10 13:20",
      status: "Connected",
    },
  ]);

  // Editing states for the profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);

  // Modal state: "password" or "delete"
  const [activeModal, setActiveModal] = useState(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const saveProfileChanges = () => {
    setUser((prev) => ({
      ...prev,
      name: tempName,
      avatar: tempAvatar,
    }));
    setIsEditingProfile(false);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password changed:", passwordData);
    setActiveModal(null);
  };

  // Handle account deletion
  const deleteAccount = () => {
    console.log("Account deletion initiated");
    setActiveModal(null);
  };

  return (
    <ErrorBoundary>
      <ThemePage>
        <PaddingInternalPages>
          <main className="max-w-7xl mx-auto py-8">
            {/* Profile Header */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-sm mb-8"
              style={{
                boxShadow: `0px 10px 20px rgba(29, 114, 209, 0.15)`,
                border: `1px solid ${colors.primary}1A`,
              }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="absolute -inset-1 rounded-full blur-sm"
                      style={{
                        background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                        opacity: 0.1,
                      }}
                    ></div>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {isEditingProfile && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                          <Edit2 className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </label>
                    {isEditingProfile && (
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    )}
                  </div>

                  {/* Name / Email */}
                  <div>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="text-lg font-bold bg-gray-100 rounded-lg px-4 py-2"
                        style={{ fontSize: '16px' }}
                      />
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
                          {user.name}
                        </h1>
                        <p className="font-bold text-lg" style={{ fontSize: '16px', color: colors.textSecondary }}>
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Profile Buttons */}
                {isEditingProfile ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveProfileChanges}
                      variant="primary"
                      size="sm"
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="primary"
                    size="md"
                    className="flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" style={{ color: colors.primary }} />
                    Edit Profile
                  </Button>
                )}
              </div>
            </motion.div>

            {/* MODALS */}
            <AnimatePresence>
              {/* Password Change Modal */}
              {activeModal === "password" && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
                        Change Password
                      </h3>
                      <button onClick={() => setActiveModal(null)}>
                        <X className="h-6 w-6 text-gray-500" />
                      </button>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.current}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              current: e.target.value}))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              new: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirm: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-200"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="button"
                          onClick={() => setActiveModal(null)}
                          variant="outline"
                          size="md"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                        >
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}

              {/* Delete Account Modal */}
              {activeModal === "delete" && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
                        Delete Account
                      </h3>
                      <button onClick={() => setActiveModal(null)}>
                        <X className="h-6 w-6 text-gray-500" />
                      </button>
                    </div>
                    <p className="mb-4 font-bold text-lg" style={{ fontSize: '16px' }}>
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        variant="outline"
                        size="md"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={deleteAccount}
                        variant="primary"
                        size="md"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Settings Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left/ Main Column (Account Settings) */}
              <div className="lg:col-span-2 space-y-8">
                <div
                  className="bg-white rounded-2xl p-8 shadow-sm"
                  style={{
                    border: `1px solid ${colors.primary}1A`,
                  }}
                >
                  <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
                    Account Settings
                  </h2>

                  {/* Security Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      Security
                    </h3>
                    <SettingItem
                      icon={<Lock size={20} style={{ color: colors.primary }} />}
                      title="Password"
                      description="Last updated 3 months ago"
                      onEdit={() => setActiveModal("password")}
                    />
                    <SettingItem
                      icon={<Shield size={20} style={{ color: colors.primary }} />}
                      title="Two-Factor Authentication"
                      description="SMS authentication enabled"
                      onEdit={() => console.log("Edit 2FA")}
                    />
                  </div>

                  {/* Preferences Section */}
                  <div className="space-y-6 mt-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      Preferences
                    </h3>
                    <SettingItem
                      icon={<Bell size={20} style={{ color: colors.primary }} />}
                      title="Notifications"
                      description="Customize notification preferences"
                      onEdit={() => console.log("Edit Notifications")}
                    />
                    <SettingItem
                      icon={<Globe size={20} style={{ color: colors.primary }} />}
                      title="Language & Region"
                      description="English (United States)"
                      onEdit={() => console.log("Edit Language")}
                    />
                  </div>

                  {/* Delete Account Section */}
                  <div className="space-y-6 mt-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      Account
                    </h3>
                    <SettingItem
                      icon={<Trash size={20} style={{ color: colors.primary }} />}
                      title="Delete Account"
                      description="Permanently remove your account and data"
                      onEdit={() => setActiveModal("delete")}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Connected Services) */}
              <div className="lg:col-span-1">
                <div
                  className="bg-white rounded-2xl p-8 shadow-sm"
                  style={{
                    border: `1px solid ${colors.primary}1A`,
                  }}
                >
                  <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
                    Connected Services
                  </h2>
                  <div className="space-y-4">
                    {connectedServices.map((service) => (
                      <ServiceItem key={service.id} service={service} />
                    ))}
                  </div>
                  <span
                    className="text-[#1D72D1] font-bold text-center block mx-auto hover:text-[#6D3BF5] cursor-pointer mt-4"
                    onClick={() => navigate("/schedule/integrations")}
                  >
                    Connect New Service
                  </span>
                </div>
              </div>
            </div>
          </main>
        </PaddingInternalPages>
      </ThemePage>
    </ErrorBoundary>
  );
}

// Updated SettingItem Component
const SettingItem = ({ icon, title, description, onEdit }) => {
  const { colors } = useTheme();
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        <div>
          <h4 className="text-lg font-bold" style={{ fontSize: '16px', color: colors.text }}>
            {title}
          </h4>
          <p className="text-lg font-bold text-gray-500" style={{ fontSize: '16px' }}>{description}</p>
        </div>
      </div>
      <button onClick={onEdit} className="text-lg font-bold transition-colors text-[#1D72D1] hover:text-[#6D3BF5]" style={{ fontSize: '16px' }}>
        Edit
      </button>
    </div>
  );
};

const ServiceItem = ({ service }) => {
  const { colors } = useTheme();
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">{service.icon}</div>
        <div>
          <h3 className="text-lg font-bold" style={{ fontSize: '16px', color: colors.text }}>
            {service.name}
          </h3>
          <p className="text-xs font-bold text-gray-500">
            Last sync: {service.lastSync}
          </p>
        </div>
      </div>
    </div>
  );
};