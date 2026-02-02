import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UpdateContactIcon, SavechangesIcon } from "../../../components/Icons";

const GeneralInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    link: ""
  });
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Fetch general info from API
  useEffect(() => {
    const fetchGeneralInfo = async () => {
      setLoading(true);
      setError("");

      try {
        const API_URL = getApiUrl();
        const accessToken = getAccessToken();

        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        const response = await axios.get(`${API_URL}/syndicate/settings/general-info/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("General info fetched:", response.data);

        const data = response.data?.data || response.data || {};

        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          bio: data.bio || "",
          link: data.link || ""
        });

        if (data.logo) {
          setLogo(data.logo);
          setLogoError(false);
        }
      } catch (err) {
        console.error("Error fetching general info:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load general information";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
    if (success) {
      setSuccess("");
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, or GIF)");
      // Clear file selection on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 1MB");
      // Clear file selection on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }

    setLogoFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      setLogoError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setError("Please select a logo file first");
      return;
    }

    setUploadingLogo(true);
    setError("");
    setSuccess("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const uploadFormData = new FormData();
      uploadFormData.append('logo', logoFile);

      console.log("Uploading logo:", logoFile.name);

      const response = await axios.patch(`${API_URL}/syndicate/settings/general-info/`, uploadFormData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
          // Don't set Content-Type - let axios set it automatically with boundary for FormData
        }
      });

      console.log("Logo uploaded:", response.data);

      // Update logo from response
      const uploadedLogo = response.data?.data?.logo || response.data?.logo;
      if (uploadedLogo) {
        setLogo(uploadedLogo);
        setLogoError(false);
      }

      // Clear preview and file selection after successful upload
      setLogoPreview(null);
      setLogoFile(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSuccess("Logo uploaded successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error uploading logo:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to upload logo";
      setError(errorMessage);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const payload = {
        first_name: formData.firstName || null,
        last_name: formData.lastName || null,
        bio: formData.bio || null,
        link: formData.link || null
      };

      console.log("Saving general info:", payload);

      const response = await axios.patch(`${API_URL}/syndicate/settings/general-info/`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("General info saved:", response.data);
      setSuccess("General information updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error saving general info:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save general information";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-row gap-2 items-center sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0">
        <div className="flex sm:justify-start">
          <UpdateContactIcon />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#01373D]">General Information</h2>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
            <p className="text-sm text-gray-600">Loading general information...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Logo Upload Section */}
          <div>
            <div className="!border-1 border-dashed border-[#E2E2E2] rounded-lg p-6 sm:p-8 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-[#F4F6F5] mx-auto sm:mx-0 overflow-hidden relative">
                  {(logoPreview || (logo && !logoError)) ? (
                    <img
                      src={logoPreview || logo}
                      alt="Logo"
                      className="w-full h-full object-cover rounded-full"
                      onError={() => {
                        setLogoError(true);
                      }}
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleLogoSelect}
                    className="hidden"
                    id="logo-upload"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className={`px-3 py-2 !border border-[#01373D] rounded-lg transition-colors font-poppins-custom text-base ${uploadingLogo
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      Choose Logo
                    </button>
                    {logoFile && (
                      <>
                        <button
                          type="button"
                          onClick={handleLogoUpload}
                          disabled={uploadingLogo}
                          className={`px-3 py-2 rounded-lg font-poppins-custom text-base transition-colors ${uploadingLogo
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                              : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
                            }`}
                        >
                          {uploadingLogo ? "Uploading..." : "Upload"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                            setError("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          disabled={uploadingLogo}
                          className={`px-3 py-2 rounded-lg font-poppins-custom text-base transition-colors ${uploadingLogo
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                  {logoFile && (
                    <p className="text-xs text-gray-600 font-poppins-custom">{logoFile.name}</p>
                  )}
                  <p className="text-sm sm:text-base text-gray-500 font-poppins-custom">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] resize-none font-poppins-custom"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Link</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium ${saving
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
                }`}
            >
              {saving ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <SavechangesIcon />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralInfo;
