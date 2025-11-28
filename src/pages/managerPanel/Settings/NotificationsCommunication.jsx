import React, { useState, useEffect } from "react";

// --- Inline Icons ---
const NotificationsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SavechangesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Toast Component ---
const SuccessToast = ({ message, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="bg-white border-l-4 border-[#00F0C3] rounded-lg shadow-xl p-4 flex items-center gap-3 min-w-[300px]">
        <div className="bg-green-50 rounded-full p-1.5">
          <CheckCircleIcon />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Success</h4>
          <p className="text-xs text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

const NotificationsCommunication = () => {
  // --- Configuration ---
  const API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/notifications/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzIyMjg0LCJpYXQiOjE3NjQzMDQyODQsImp0aSI6IjkyMDRhMGY3ODhjNDRlMDQ5MWE4NjkzZWY3NzlmYTljIiwidXNlcl9pZCI6IjIifQ.6h81mnprtOjPpn2-_mkasbrXSwKwbr7wHkhEC-j6_ag";

  // --- State ---
  const [formData, setFormData] = useState({
    notifyEmail: true,
    notifyLpAlerts: false,
    notifyDealUpdates: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- Effects ---
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        
        setFormData({
          notifyEmail: data.notify_email_preference ?? true,
          notifyLpAlerts: data.notify_new_lp_alerts ?? false,
          notifyDealUpdates: data.notify_deal_updates ?? true
        });
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    const payload = {
      notification_preference: "custom",
      notify_email_preference: formData.notifyEmail,
      notify_new_lp_alerts: formData.notifyLpAlerts,
      notify_deal_updates: formData.notifyDealUpdates
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Show success pop-up
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-poppins-custom">Loading settings...</div>;
  }

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <SuccessToast message="Preferences updated successfully!" isVisible={showToast} />

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
              type="checkbox"
              name="notifyEmail"
              checked={formData.notifyEmail}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 rounded focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Email Preferences</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="notifyLpAlerts"
              checked={formData.notifyLpAlerts}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 rounded focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">New LP Alerts</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="notifyDealUpdates"
              checked={formData.notifyDealUpdates}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 rounded focus:ring-[#00F0C3] cursor-pointer"
            />
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Deal Status Updates</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium cursor-pointer shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <SavechangesIcon />
          <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsCommunication;