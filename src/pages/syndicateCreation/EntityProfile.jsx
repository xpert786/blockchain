import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {LeadIcon, RightsIcon} from "../../components/Icons";
import axios from "axios";

const EntityProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firmName: "",
    description: "",
    logo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null); // Store logo URL from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamData, setTeamData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: {
      createDeals: false,
      accessCapTables: false,
      messaging: false,
      ipData: false
    },
    enableRoleBasedAccess: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      
      // Clear logo URL when new file is selected
      setLogoUrl(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch existing step2 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const step2Url = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;

        console.log("=== Fetching Step2 Data ===");
        console.log("API URL:", step2Url);

        try {
          const step2Response = await axios.get(step2Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("Step2 response:", step2Response.data);

          if (step2Response.data && step2Response.status === 200) {
            const responseData = step2Response.data;
            
            // Get step_data and profile (same structure as step1)
            const stepData = responseData.step_data || {};
            const profile = responseData.profile || {};
            
            console.log("✅ step_data:", stepData);
            console.log("✅ profile:", profile);
            
            // Get firm_name from step_data or profile
            const firmName = stepData.firm_name || profile.firm_name || "";
            // Get description from step_data or profile
            const description = stepData.description || profile.description || "";
            // Get logo URL from step_data or profile
            const logo = stepData.logo || profile.logo;
            
            console.log("✅ Firm Name:", firmName);
            console.log("✅ Description:", description);
            console.log("✅ Logo:", logo);
            
            if (firmName || description || logo) {
              setHasExistingData(true);
              
              // Populate form with existing data
              setFormData({
                firmName: firmName,
                description: description || "",
                logo: null // Don't set logo file, just URL
              });
              
              // If logo exists as URL, set it for preview
              if (logo) {
                let logoUrl;
                const baseDomain = "http://168.231.121.7";
                
                console.log("🔍 Processing logo path:", logo);
                
                // Logo might be a full URL or a relative path
                if (logo.startsWith('http://') || logo.startsWith('https://')) {
                  // Already a full URL - use as is
                  logoUrl = logo;
                  console.log("✅ Logo is already a full URL");
                } else if (logo.startsWith('/')) {
                  // Relative path starting with /
                  // API might return paths like:
                  // - /blockchain-backend/media/... (correct)
                  // - /api/blockchain-backend/media/... (has /api prefix - remove it)
                  // - /media/... (needs /blockchain-backend prefix)
                  
                  if (logo.startsWith('/api/blockchain-backend/')) {
                    // Path starts with /api/blockchain-backend/ - remove /api
                    logoUrl = `${baseDomain}${logo.replace(/^\/api/, '')}`;
                    console.log("✅ Removed /api prefix from logo path");
                  } else if (logo.startsWith('/blockchain-backend/')) {
                    // Path already includes /blockchain-backend, just prepend domain
                    logoUrl = `${baseDomain}${logo}`;
                    console.log("✅ Logo path already includes /blockchain-backend");
                  } else if (logo.startsWith('/media/')) {
                    // Path starts with /media/, prepend /blockchain-backend
                    logoUrl = `${baseDomain}/blockchain-backend${logo}`;
                    console.log("✅ Added /blockchain-backend prefix to /media path");
                  } else {
                    // Other paths - prepend /blockchain-backend
                    logoUrl = `${baseDomain}/blockchain-backend${logo}`;
                    console.log("✅ Added /blockchain-backend prefix to path");
                  }
                } else {
                  // Relative path without leading / - prepend /blockchain-backend/
                  logoUrl = `${baseDomain}/blockchain-backend/${logo}`;
                  console.log("✅ Added /blockchain-backend/ prefix to relative path");
                }
                
                setLogoUrl(logoUrl);
                setLogoPreview(logoUrl);
                console.log("✅ Final logo URL:", logoUrl);
                console.log("✅ Original logo value from API:", logo);
              }
              
              console.log("✅ Form populated with existing data");
            } else {
              setHasExistingData(false);
            }
          } else {
            setHasExistingData(false);
          }
        } catch (step2Err) {
          // If step2 data doesn't exist (404), it's fine - user will create new
          if (step2Err.response?.status === 404) {
            console.log("No existing step2 data found - will create new");
            setHasExistingData(false);
          } else {
            console.error("Error fetching existing step2 data:", step2Err);
            console.error("Error details:", step2Err.response?.data);
          }
        }
      } catch (err) {
        console.error("Error in fetchExistingData:", err);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleNext = async () => {
    setError("");
    
    // Validation
    if (!formData.firmName.trim()) {
      setError("Firm / Syndicate Name is required.");
      return;
    }

    setLoading(true);

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        setError("You must be logged in to continue. Please log in again.");
        navigate("/login");
        return;
      }

      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("firm_name", formData.firmName);
      formDataToSend.append("description", formData.description || "");
      
      // Append logo file only if a new file is selected
      // For PATCH: If no new file, don't send logo field (keeps existing logo)
      // For POST: Send empty string if no logo
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
        console.log("Logo file will be uploaded:", formData.logo.name);
      } else if (!hasExistingData) {
        // For new data, send empty string if no logo
        formDataToSend.append("logo", "");
        console.log("No logo file, sending empty string for new data");
      } else {
        // For existing data, don't send logo field (keeps existing logo)
        console.log("No new logo file, keeping existing logo");
      }

      console.log("=== EntityProfile API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("Firm Name:", formData.firmName);
      console.log("Description:", formData.description);
      console.log("Logo:", formData.logo ? formData.logo.name : logoUrl || "No logo");

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;

      console.log("Calling API:", finalUrl);

      let response;
      
      // Use PATCH if data exists, POST if it's new
      if (hasExistingData) {
        console.log("🔄 Updating existing data with PATCH");
        response = await axios.patch(finalUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        console.log("EntityProfile updated successfully:", response.data);
      } else {
        console.log("➕ Creating new data with POST");
        response = await axios.post(finalUrl, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });
        console.log("EntityProfile created successfully:", response.data);
        // Mark that data now exists for future updates
        setHasExistingData(true);
      }

      // Navigate to next step
      navigate("/syndicate-creation/kyb-verification");
      
    } catch (err) {
      console.error("Error submitting EntityProfile:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessage = backendData.message || 
            backendData.error || 
            JSON.stringify(backendData);
          setError(errorMessage);
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit entity profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/lead-info");
  };

  const handleTeamInputChange = (field, value) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission, value) => {
    setTeamData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handleSendInvitation = () => {
    // Handle sending invitation logic here
    console.log("Sending invitation:", teamData);
    setShowTeamModal(false);
    // Reset form
    setTeamData({
      name: "",
      email: "",
      role: "",
      permissions: {
        createDeals: false,
        accessCapTables: false,
        messaging: false,
        ipData: false
      },
      enableRoleBasedAccess: false
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 2: Entity Profile</h1>
        <p className="text-gray-600">Company information and structure</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Firm / Syndicate Name */}
        <div>
          <label className="block text-sm  text-[#0A2A2E] mb-2">
            Firm / Syndicate Name *
          </label>
          <input
            type="text"
            value={formData.firmName}
            onChange={(e) => handleInputChange("firmName", e.target.value)}
            className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Write here..."
          />
        </div>

        {/* Syndicate Logo */}
        <div>
          <label className="block text-sm font-medium  text-[#0A2A2E] mb-4">
            Syndicate Logo
          </label>
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            <div className="w-24 h-24 bg-[#F4F6F5] rounded-lg flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Logo image failed to load:", logoPreview);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <LeadIcon/>
              )}
            </div>
            
            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 !border border-[#01373D] bg-[#F4F6F5] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer inline-block"
              >
                {(formData.logo || logoUrl) ? "Change File" : "Choose File"}
              </label>
              {(formData.logo || logoUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: null }));
                    setLogoPreview(null);
                    setLogoUrl(null);
                    // Reset file input
                    const fileInput = document.getElementById("logo-upload");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="ml-2 px-3 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {formData.logo && (
            <p className="text-xs text-gray-500 mt-2">Selected: {formData.logo.name}</p>
          )}
          {logoUrl && !formData.logo && (
            <p className="text-xs text-gray-500 mt-2">Current logo loaded from server</p>
          )}
        </div>

        
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Next"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Team & Roles Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-[#01373DB2]/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-lg mx-4 h-auto max-h-[50vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Team & Roles</h2>
              <button
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Description */}
            <p className="text-gray-600 mb-6">Add team members and configure their roles and permissions.</p>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={teamData.name}
                  onChange={(e) => handleTeamInputChange("name", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={teamData.email}
                  onChange={(e) => handleTeamInputChange("email", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email Address"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={teamData.role}
                  onChange={(e) => handleTeamInputChange("role", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Permissions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={teamData.permissions.createDeals}
                      onChange={(e) => handlePermissionChange("createDeals", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Create Deals</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={teamData.permissions.accessCapTables}
                      onChange={(e) => handlePermissionChange("accessCapTables", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Access Cap Tables</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={teamData.permissions.messaging}
                      onChange={(e) => handlePermissionChange("messaging", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Messaging</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={teamData.permissions.ipData}
                      onChange={(e) => handlePermissionChange("ipData", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">IP Data</span>
                  </label>
                </div>
              </div>

              {/* Role-based Access Controls */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={teamData.enableRoleBasedAccess}
                    onChange={(e) => handleTeamInputChange("enableRoleBasedAccess", e.target.checked)}
                    className="mr-2 mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Enable Role-based Access Controls</span>
                    <p className="text-xs text-gray-500 mt-1">
                      When enabled, permissions will be automatically assigned based on team member roles and can be overridden individually.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Send Invitation Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSendInvitation}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Send Invitation
                <RightsIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityProfile;
