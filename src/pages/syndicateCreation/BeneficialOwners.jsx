import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BeneficialOwners = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [beneficialOwners, setBeneficialOwners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    streetAddress: "",
    area: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
    role1: "Beneficial Owner",
    ownership: "0",
    role2: "Beneficiary",
    email: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch list of beneficial owners on mount
  useEffect(() => {
    const fetchBeneficialOwners = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const step3bUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3b/`;

        console.log("=== Fetching Step3b List ===");
        console.log("API URL:", step3bUrl);

        const response = await axios.get(step3bUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Step3b list response:", response.data);

        if (response.data && response.status === 200) {
          // API might return array directly or nested in data
          const data = response.data;
          const ownersList = Array.isArray(data) ? data : (data.results || data.data || []);
          setBeneficialOwners(ownersList);
          console.log("✅ Beneficial owners list loaded:", ownersList.length);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("No beneficial owners found - starting fresh");
          setBeneficialOwners([]);
        } else {
          console.error("Error fetching beneficial owners:", err);
        }
      }
    };

    fetchBeneficialOwners();
  }, []);

  const resetForm = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      streetAddress: "",
      area: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      role1: "Beneficial Owner",
      ownership: "0",
      role2: "Beneficiary",
      email: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (owner) => {
    setFormData({
      fullName: owner.full_name || "",
      dateOfBirth: owner.date_of_birth || "",
      nationality: owner.nationality || "",
      streetAddress: owner.street_address || "",
      area: owner.area_landmark || "",
      postalCode: owner.postal_code || "",
      city: owner.city || "",
      state: owner.state || "",
      country: owner.country || "",
      role1: owner.role ? owner.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Beneficial Owner",
      ownership: owner.ownership_percentage ? String(owner.ownership_percentage) : "0",
      role2: owner.beneficiary_role ? owner.beneficiary_role.charAt(0).toUpperCase() + owner.beneficiary_role.slice(1) : "Beneficiary",
      email: owner.email || ""
    });
    setEditingId(owner.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this beneficial owner?")) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const deleteUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3b/${id}/`;

      await axios.delete(deleteUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Refresh the list
      setBeneficialOwners(prev => prev.filter(owner => owner.id !== id));
      console.log("✅ Beneficial owner deleted");
    } catch (err) {
      console.error("Error deleting beneficial owner:", err);
      setError("Failed to delete beneficial owner. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Basic validation
    if (!formData.fullName.trim()) {
      setError("Full Name is required.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      
      // Prepare request data
      const requestData = {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth || "",
        nationality: formData.nationality || "",
        email: formData.email || "",
        street_address: formData.streetAddress || "",
        area_landmark: formData.area || "",
        postal_code: formData.postalCode || "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        role: formData.role1.toLowerCase().replace(/\s+/g, '_') || "beneficial_owner",
        ownership_percentage: parseFloat(formData.ownership) || 0.00,
        beneficiary_role: formData.role2.toLowerCase() || "beneficiary"
      };

      let response;
      if (editingId) {
        // Update existing
        const updateUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3b/${editingId}/`;
        console.log("=== PATCH Step3b Data ===");
        console.log("API URL:", updateUrl);
        response = await axios.patch(updateUrl, requestData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } else {
        // Create new
        const createUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3b/`;
        console.log("=== POST Step3b Data ===");
        console.log("API URL:", createUrl);
        response = await axios.post(createUrl, requestData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      }

      console.log("✅ Step3b saved successfully:", response.data);

      // Refresh the list
      const listResponse = await axios.get(`${API_URL.replace(/\/$/, "")}/syndicate/step3b/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = listResponse.data;
      const ownersList = Array.isArray(data) ? data : (data.results || data.data || []);
      setBeneficialOwners(ownersList);

      // Reset form and hide it
      resetForm();
    } catch (err) {
      console.error("Error saving Step3b:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to save beneficial owner information.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to save beneficial owner information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/kyb-verification");
  };

  const handleNext = () => {
    navigate("/syndicate-creation/compliance-attestation");
  };

  const handleKycInvite = (email) => {
    console.log("Triggering KYC invite link for:", email);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[#001D21] mb-2">Step 3b: Beneficial Owners (UBOs)</h1>
        <p className="text-gray-600">Trustworthy business starts here with fast, accurate KYB verification.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Add Beneficial Owner Button */}
      {!showForm && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleAddClick}
            className="bg-[#CEC6FF] hover:bg-purple-600 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Beneficial Owner
          </button>
        </div>
      )}

      {/* Beneficial Owners List */}
      {!showForm && beneficialOwners.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-[#0A2A2E]">Beneficial Owners List</h2>
          {beneficialOwners.map((owner) => (
            <div key={owner.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{owner.full_name || "N/A"}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {owner.email && <span>Email: {owner.email}</span>}
                    {owner.ownership_percentage && <span className="ml-4">Ownership: {owner.ownership_percentage}%</span>}
                  </p>
                  <p className="text-sm text-gray-600">
                    {owner.role && <span>Role: {owner.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>}
                    {owner.beneficiary_role && <span className="ml-4">Beneficiary Role: {owner.beneficiary_role.charAt(0).toUpperCase() + owner.beneficiary_role.slice(1)}</span>}
                  </p>
                  {owner.city && owner.country && (
                    <p className="text-sm text-gray-600 mt-1">
                      Location: {owner.city}, {owner.country}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(owner)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(owner.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form (shown when adding or editing) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Nationality
              </label>
              <div className="relative">
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                >
                  <option value="">Nationality</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="SG">Singapore</option>
                  <option value="IN">India</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Residential Address */}
          <div className="space-y-4 bg-[#F9F8FF] border border-[#0A2A2E] rounded-lg p-4">
            <h2 className="text-lg font-semibold text-[#0A2A2E]">Residential Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Flat No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter State name"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    Area/ landmark
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter City Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter Country name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role and Ownership */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  value={formData.role1}
                  onChange={(e) => handleInputChange("role1", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                >
                  <option value="Beneficial Owner">Beneficial Owner</option>
                  <option value="Director">Director</option>
                  <option value="Trustee">Trustee</option>
                  <option value="Partner">Partner</option>
                  <option value="Protector">Protector</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Ownership %
              </label>
              <input
                type="text"
                value={formData.ownership}
                onChange={(e) => handleInputChange("ownership", e.target.value)}
                className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Beneficiary Role
              </label>
              <div className="relative">
                <select
                  value={formData.role2}
                  onChange={(e) => handleInputChange("role2", e.target.value)}
                  className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                >
                  <option value="Beneficiary">Beneficiary</option>
                  <option value="Director">Director</option>
                  <option value="Shareholder">Shareholder</option>
                  <option value="PSC">PSC</option>
                  <option value="Trustee">Trustee</option>
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="flex-1 border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email"
                />
                <button
                  type="button"
                  onClick={() => handleKycInvite(formData.email)}
                  className="bg-[#00F0C3] hover:bg-[#00D9A8] text-black px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Send KYC Invite
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Compliance Text */}
      {!showForm && (
        <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4 mt-8">
          <p className="text-sm font-medium text-gray-700 mb-1">Compliance Text:</p>
          <p className="text-sm text-gray-600">
            Unlocksley uses regulated KYB/KYC providers to verify your entity and its beneficial owners.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BeneficialOwners;
