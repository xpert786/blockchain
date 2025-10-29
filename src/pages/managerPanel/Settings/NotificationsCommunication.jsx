import React, { useState } from "react";
import { BellIcon, SaveIcon } from "../../../components/Icons";

const NotificationsCommunication = () => {
  const [emailPreferences, setEmailPreferences] = useState("email-preferences");
  const [newLPAlerts, setNewLPAlerts] = useState(false);
  const [dealStatusUpdates, setDealStatusUpdates] = useState(false);

  const handleEmailPreferenceChange = (e) => {
    setEmailPreferences(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "newLPAlerts") {
      setNewLPAlerts(checked);
    } else if (name === "dealStatusUpdates") {
      setDealStatusUpdates(checked);
    }
  };

  const handleSave = () => {
    console.log("Notifications settings saved:", {
      emailPreferences,
      newLPAlerts,
      dealStatusUpdates
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <BellIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Notifications & Communication</h2>
        </div>
      </div>

      {/* Email Preferences Section */}
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Email Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="email-preferences"
              checked={emailPreferences === "email-preferences"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Email Preferences</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="new-lp-alerts"
              checked={emailPreferences === "new-lp-alerts"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">New LP Alerts</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="emailPreferences"
              value="deal-status-updates"
              checked={emailPreferences === "deal-status-updates"}
              onChange={handleEmailPreferenceChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Deal Status Updates</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SaveIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsCommunication;
