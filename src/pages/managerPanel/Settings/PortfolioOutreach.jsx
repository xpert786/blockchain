import React, { useState, useEffect } from "react";

// --- Inline Icons ---
const ProtoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12H22" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2A15.3 15.3 0 0 1 15.3 12 15.3 15.3 0 0 1 12 22 15.3 15.3 0 0 1 8.7 12 15.3 15.3 0 0 1 12 2Z" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SavechangesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const PortfolioOutreach = () => {
  // State: "restrict" means restrict: true, "allow" means restrict: false
  // Defaulting to "restrict" initially, will update on mount
  const [contactPermission, setContactPermission] = useState("restrict");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch

  // --- Configuration ---
  const API_URL = "http://72.61.251.114/blockchain-backend/api/syndicate/settings/portfolio/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzQyMTA3LCJpYXQiOjE3NjQzMjQxMDcsImp0aSI6ImJjZTYyZjFhYTVjNjQwNjI4NTA4ZTFjNGIyZTg4OWUyIiwidXNlcl9pZCI6IjY0In0.5oRansS7Iariy7FTFUmVWsbX4GM6mWtinOoXlXqH_So";

  // --- Fetch Initial Settings ---
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          // Fix: Extract data from the nested 'data' property if it exists
          const settings = result.data || result;

          // Logic: If restrict is true -> Select "restrict". If false -> Select "allow".
          if (settings.restrict === true) {
            setContactPermission("restrict");
          } else {
            setContactPermission("allow");
          }
        } else {
          console.error("Failed to fetch settings");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handlePermissionChange = (e) => {
    setContactPermission(e.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    // Logic: 
    // If contactPermission is "restrict" -> restrict: true
    // If contactPermission is "allow"    -> restrict: false
    const payload = {
      restrict: contactPermission === "restrict"
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("Portfolio outreach settings saved:", payload);
        alert("Settings saved successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to save settings", errorData);
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F5]">
        <div className="w-8 h-8 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full border border-gray-100">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="p-2 bg-[#F4F6F5] rounded-full">
            <ProtoIcon />
          </div>
        </div>
        <div>
          <h4 className="text-base sm:text-lg text-[#001D21] font-semibold">Portfolio Company Outreach</h4>
          <p className="text-sm sm:text-base text-gray-500 font-poppins-custom mt-1">
            Grants The Platform Permission To Contact Portfolio Companies Directly For{" "}
            <span className="font-semibold text-[#748A91]">Valuation, Tax Reporting, And Compliance Purposes.</span>
          </p>
        </div>
      </div>

      {/* Contact Permission Setting - White Card */}
      <div className="bg-white rounded-xl p-6 w-full border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-[#001D21] mb-4 font-poppins-custom">Allow Platform Contact?</h3>
        <div className="space-y-4">

          {/* Restrict Option */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setContactPermission("restrict")}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${contactPermission === "restrict" ? "border-[#00F0C3]" : "border-gray-300"}`}>
              {contactPermission === "restrict" && <div className="w-2.5 h-2.5 rounded-full bg-[#00F0C3]"></div>}
            </div>
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Restrict </label>
          </div>

          {/* Allow Option */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setContactPermission("allow")}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${contactPermission === "allow" ? "border-[#00F0C3]" : "border-gray-300"}`}>
              {contactPermission === "allow" && <div className="w-2.5 h-2.5 rounded-full bg-[#00F0C3]"></div>}
            </div>
            <label className="text-sm text-gray-700 font-poppins-custom cursor-pointer">Allow</label>
          </div>

        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium shadow-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SavechangesIcon />
          )}
          <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default PortfolioOutreach;