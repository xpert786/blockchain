import React, { useState } from "react";
import {SavechangesIcon, NotificationsIcon } from "../../../components/Icons";

const NotificationsCommunication = () => {
  const [emailPreferences, setEmailPreferences] = useState("email-preferences");

  const handleEmailPreferenceChange = (e) => {
    setEmailPreferences(e.target.value);
  };

  const handleSave = () => {
    console.log("Notifications settings saved:", {
      emailPreferences,
    });
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full">
        <div className="flex items-center justify-center sm:justify-start">
          <NotificationsIcon />
        </div>
        <div>
          <h4 className="text-base sm:text-lg text-[#001D21]">Notifications & Communication</h4>
        </div>
      </div>

      {/* Email Preferences Section - White Card */}
      <div className="bg-white rounded-xl p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Email Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="email-preferences"
              checked={emailPreferences === "email-preferences"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Email Preferences</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="new-lp-alerts"
              checked={emailPreferences === "new-lp-alerts"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">New LP Alerts</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="deal-status-updates"
              checked={emailPreferences === "deal-status-updates"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Deal Status Updates</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium cursor-pointer"
        >
          <SavechangesIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsCommunication;
