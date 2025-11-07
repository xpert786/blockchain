import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      
      // Append logo file if selected
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      } else {
        formDataToSend.append("logo", ""); // Send empty string if no logo
      }

      console.log("=== EntityProfile API Call ===");
      console.log("Firm Name:", formData.firmName);
      console.log("Description:", formData.description);
      console.log("Logo:", formData.logo ? formData.logo.name : "No logo");

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;

      console.log("Calling API:", finalUrl);

      const response = await axios.post(finalUrl, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      console.log("EntityProfile submitted successfully:", response.data);

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
                {formData.logo ? "Change File" : "Choose File"}
              </label>
              {formData.logo && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: null }));
                    setLogoPreview(null);
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
        </div>

        {/* Add Team Members Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowTeamModal(true)}
            className="bg-[#CEC6FF] hover:bg-purple-600 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Team Members
          </button>
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
