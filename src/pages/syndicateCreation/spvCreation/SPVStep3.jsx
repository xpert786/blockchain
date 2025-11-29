import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    adviserEntity: "Platform Advisers LLC",
    masterPartnershipEntity: "",
    masterPartnershipEntityId: null,
    fundLead: "",
    fundLeadId: null
  });
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spvId, setSpvId] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch existing SPV step3 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        
        let step3Data = null;
        let currentSpvId = null;

        // Try to get SPV ID from SPV list
        try {
          const spvListUrl = `${API_URL.replace(/\/$/, "")}/spv/`;
          const spvListResponse = await axios.get(spvListUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("SPV list response:", spvListResponse.data);

          // Handle paginated response or direct array
          const spvData = spvListResponse.data?.results || spvListResponse.data;

          if (Array.isArray(spvData) && spvData.length > 0) {
            const sortedSpvs = [...spvData].sort((a, b) => {
              if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return (b.id || 0) - (a.id || 0);
            });
            currentSpvId = sortedSpvs[0].id;
            console.log("✅ Found existing SPV ID:", currentSpvId);
          } else if (spvData && spvData.id) {
            currentSpvId = spvData.id;
            console.log("✅ Found SPV ID from single object:", currentSpvId);
          }
        } catch (spvListError) {
          console.log("⚠️ Could not get SPV list:", spvListError.response?.status);
        }

        // Try to get step3 data with SPV ID or default to 1
        const testSpvId = currentSpvId || 1;
        const step3Url = `${API_URL.replace(/\/$/, "")}/spv/${testSpvId}/update_step3/`;
        
        try {
          console.log("🔍 Fetching step3 data from:", step3Url);
          const step3Response = await axios.get(step3Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Step3 GET response:", step3Response.data);

          if (step3Response.data && step3Response.status === 200) {
            step3Data = step3Response.data;
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("✅ Found SPV ID from step3 data:", currentSpvId);
            }
          }
        } catch (getError) {
          if (getError.response?.status === 404) {
            console.log("⚠️ No step3 data found for SPV ID", testSpvId, "(this is normal for new SPVs)");
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("ℹ️ Will use SPV ID", testSpvId, "for new submission");
            }
          } else {
            console.error("❌ Error fetching step3 data:", getError.response?.status, getError.response?.data);
          }
        }

        // Set SPV ID if we found one
        if (currentSpvId) {
          setSpvId(currentSpvId);
          // Store in localStorage for consistency
          localStorage.setItem("currentSpvId", String(currentSpvId));
        }

        // If we got step3 data, populate the form
        if (step3Data) {
          const responseData = step3Data.step_data || step3Data.data || step3Data;
          
          console.log("✅ Step3 data found:", responseData);
          console.log("📋 Raw step3 response:", step3Data);

          // Map adviser_entity from API format to form format
          const adviserEntityMap = {
            "platform_advisers": "Platform Advisers LLC",
            "self_advised": "Self-Advised Entity",
            "Platform Advisers LLC": "Platform Advisers LLC",
            "Self-Advised Entity": "Self-Advised Entity"
          };

          // Map master_partnership_entity ID to string value
          // Note: IDs might be 1, 2, 3, etc. Map them to option values
          const masterPartnershipIdToString = (entityId) => {
            const entityMap = {
              1: "entity1",
              2: "entity2",
              3: "entity3"
            };
            return entityMap[entityId] || "";
          };

          // Map fund_lead ID to string value
          // Note: IDs might be 1, 2, 3, etc. Map them to option values
          const fundLeadIdToString = (leadId) => {
            const leadMap = {
              1: "lead1",
              2: "lead2",
              3: "lead3"
            };
            return leadMap[leadId] || "";
          };

          const mappedData = {
            adviserEntity: adviserEntityMap[responseData.adviser_entity] || responseData.adviser_entity || "Platform Advisers LLC",
            masterPartnershipEntity: typeof responseData.master_partnership_entity === 'number'
              ? masterPartnershipIdToString(responseData.master_partnership_entity)
              : (responseData.master_partnership_entity || ""),
            masterPartnershipEntityId: typeof responseData.master_partnership_entity === 'number' ? responseData.master_partnership_entity : null,
            fundLead: typeof responseData.fund_lead === 'number'
              ? fundLeadIdToString(responseData.fund_lead)
              : (responseData.fund_lead || ""),
            fundLeadId: typeof responseData.fund_lead === 'number' ? responseData.fund_lead : null
          };

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));

          setHasExistingData(true);
          console.log("✅ Form populated with existing step3 data:", mappedData);
        } else if (currentSpvId) {
          setSpvId(currentSpvId);
          setHasExistingData(false);
          console.log("✅ SPV ID found but no step3 data yet:", currentSpvId);
        } else {
          console.log("⚠️ No existing SPV or step3 data found");
          setHasExistingData(false);
        }
      } catch (err) {
        console.error("Error in fetchExistingData:", err);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    fetchExistingData();
  }, [location.pathname]); // Refetch when route changes

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";

      // Get SPV ID from state, localStorage, or fetch it
      let currentSpvId = spvId || localStorage.getItem("currentSpvId");
      
      // Parse if it's a string from localStorage
      if (currentSpvId && typeof currentSpvId === 'string' && !isNaN(currentSpvId)) {
        currentSpvId = parseInt(currentSpvId, 10);
      }

      if (!currentSpvId) {
        try {
          const spvListUrl = `${API_URL.replace(/\/$/, "")}/spv/`;
          const spvListResponse = await axios.get(spvListUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          const spvData = spvListResponse.data?.results || spvListResponse.data;

          if (Array.isArray(spvData) && spvData.length > 0) {
            const sortedSpvs = [...spvData].sort((a, b) => {
              if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return (b.id || 0) - (a.id || 0);
            });
            currentSpvId = sortedSpvs[0].id;
            console.log("✅ Found SPV ID from list:", currentSpvId);
          } else if (spvData && spvData.id) {
            currentSpvId = spvData.id;
            console.log("✅ Found SPV ID from single object:", currentSpvId);
          }
        } catch (spvError) {
          console.log("⚠️ Could not get SPV list:", spvError.response?.status);
        }

        // If still no SPV ID, use 1 as default
        if (!currentSpvId) {
          currentSpvId = 1;
          console.log("ℹ️ Using default SPV ID: 1");
        }

        setSpvId(currentSpvId);
        // Store in localStorage for consistency
        if (currentSpvId) {
          localStorage.setItem("currentSpvId", String(currentSpvId));
        }
      }

      const step3Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step3/`;

      console.log("=== SPV Step3 API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("SPV ID:", currentSpvId);
      console.log("API URL:", step3Url);
      console.log("Form Data:", formData);

      // Map form values to API format
      // Map adviser entity from form format to API format
      const adviserEntityMap = {
        "Platform Advisers LLC": "platform_advisers",
        "Self-Advised Entity": "self_advised",
        "platform_advisers": "platform_advisers",
        "self_advised": "self_advised"
      };

      // Map master partnership entity string to ID
      const masterPartnershipStringToId = (entityString) => {
        const entityMap = {
          "entity1": 1,
          "entity2": 2,
          "entity3": 3
        };
        return entityMap[entityString] || null;
      };

      // Map fund lead string to ID
      const fundLeadStringToId = (leadString) => {
        const leadMap = {
          "lead1": 1,
          "lead2": 2,
          "lead3": 3
        };
        return leadMap[leadString] || null;
      };

      // Prepare data for API
      // Always send adviser_entity (it has a default value)
      const dataToSend = {};
      
      // Adviser entity - always send (has default)
      if (formData.adviserEntity) {
        const mappedAdviser = adviserEntityMap[formData.adviserEntity] || formData.adviserEntity;
        if (mappedAdviser) {
          dataToSend.adviser_entity = mappedAdviser;
        }
      }

      // Master partnership entity - only send if valid ID
      const masterPartnershipValue = formData.masterPartnershipEntityId || 
        (formData.masterPartnershipEntity ? masterPartnershipStringToId(formData.masterPartnershipEntity) : null);
      if (masterPartnershipValue !== null && masterPartnershipValue !== undefined) {
        dataToSend.master_partnership_entity = masterPartnershipValue;
      }

      // Fund lead - only send if valid ID
      const fundLeadValue = formData.fundLeadId || 
        (formData.fundLead ? fundLeadStringToId(formData.fundLead) : null);
      if (fundLeadValue !== null && fundLeadValue !== undefined) {
        dataToSend.fund_lead = fundLeadValue;
      }

      console.log("📤 Prepared step3 data:", dataToSend);
      console.log("📤 Data keys:", Object.keys(dataToSend));

      // Check if we have any data to send
      if (Object.keys(dataToSend).length === 0) {
        console.log("⚠️ No data to send - all fields are empty or invalid");
        setError("Please fill in at least one field before proceeding.");
        setLoading(false);
        return;
      }

      let response;

      // Use PATCH if we have existing data, otherwise POST
      if (hasExistingData && currentSpvId) {
        console.log("🔄 Attempting to update existing SPV step3 data with PATCH");
        response = await axios.patch(step3Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step3 updated successfully with PATCH:", response.data);
      } else {
        console.log("➕ Creating new SPV step3 data with POST");
        response = await axios.post(step3Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step3 created successfully with POST:", response.data);
        console.log("📋 POST response:", response);
        console.log("📋 POST response status:", response.status);
        console.log("📋 POST response data:", response.data);
        
        if (response?.data?.id || response?.data?.spv_id) {
          const newSpvId = response.data.id || response.data.spv_id;
          setSpvId(newSpvId);
          console.log("✅ Stored SPV ID:", newSpvId);
        }
        setHasExistingData(true);
      }

      // Navigate to next step on success
      if (response && response.status >= 200 && response.status < 300) {
        console.log("✅ Success! Navigating to step4");
        navigate("/syndicate-creation/spv-creation/step4");
      } else {
        console.log("⚠️ Unexpected response status:", response?.status);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("SPV step3 error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      const backendData = err.response?.data;
      
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          let errorMessages = [];
          
          // Check for field errors
          Object.keys(backendData).forEach(key => {
            if (Array.isArray(backendData[key])) {
              const fieldErrors = backendData[key];
              fieldErrors.forEach(errorMsg => {
                if (errorMsg && (errorMsg.includes("Invalid pk") || errorMsg.includes("does not exist"))) {
                  if (key === "master_partnership_entity") {
                    errorMessages.push(`Master Partnership Entity: Invalid ID selected. Please choose a valid option.`);
                  } else if (key === "fund_lead") {
                    errorMessages.push(`Fund Lead: Invalid ID selected. Please choose a valid option.`);
                  } else {
                    errorMessages.push(`${key}: Invalid ID selected. Please choose a valid option.`);
                  }
                } else {
                  errorMessages.push(`${key}: ${errorMsg}`);
                }
              });
            } else if (backendData[key]) {
              errorMessages.push(`${key}: ${backendData[key]}`);
            }
          });
          
          if (errorMessages.length > 0) {
            setError(errorMessages.join(" "));
          } else {
            setError("Failed to submit SPV step3 data. Please check your input.");
          }
        } else {
          setError(String(backendData));
        }
      } else if (err.response?.status === 405) {
        setError("Method not allowed. Please contact support.");
      } else if (err.response?.status === 404) {
        setError("SPV not found. Please start from step 1.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError(err.message || "Failed to submit SPV step3 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step2");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-medium text-gray-800">Adviser & Legal Structure</h1>
        <p className="text-gray-600">Configure the legal and advisory structure for your SPV.</p>
        {isLoadingExistingData && (
          <p className="text-sm text-gray-500">Loading existing data...</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Adviser Entity */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Adviser Entity</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.adviserEntity === "Platform Advisers LLC"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("adviserEntity", "Platform Advisers LLC")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Platform Advisers LLC</p>
                  <p className="text-sm text-gray-500">Default</p>
                </div>
                <input
                  type="radio"
                  name="adviserEntity"
                  value="Platform Advisers LLC"
                  checked={formData.adviserEntity === "Platform Advisers LLC"}
                  onChange={() => handleInputChange("adviserEntity", "Platform Advisers LLC")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.adviserEntity === "Self-Advised Entity"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("adviserEntity", "Self-Advised Entity")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Self-Advised Entity</p>
                  <p className="text-sm text-[#22C55E]">Additional $1,000 setup fee applies</p>
                </div>
                <input
                  type="radio"
                  name="adviserEntity"
                  value="Self-Advised Entity"
                  checked={formData.adviserEntity === "Self-Advised Entity"}
                  onChange={() => handleInputChange("adviserEntity", "Self-Advised Entity")}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Master Partnership Entity */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Master Partnership Entity</h2>
          <p className="text-sm text-gray-600 mb-4">This will appear on the cap table</p>
          <select
            value={formData.masterPartnershipEntity}
            onChange={(e) => handleInputChange("masterPartnershipEntity", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
          >
            <option value="">Select master partnership entity</option>
            <option value="entity1">Entity 1</option>
            <option value="entity2">Entity 2</option>
            <option value="entity3">Entity 3</option>
          </select>
        </div>

        {/* Fund Lead */}
        <div>
                <h2 className="text-lg font-medium text-gray-800 mb-2">Fund Lead</h2>
          <p className="text-sm text-gray-600 mb-4">This person will be designated in fund documentation</p>
          <select
            value={formData.fundLead}
            onChange={(e) => handleInputChange("fundLead", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparen                                                                  t bg-[#F4F6F5]"
          >
            <option value="">Select fund lead</option>
            <option value="lead1">Lead 1</option>
            <option value="lead2">Lead 2</option>
            <option value="lead3">Lead 3</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading || isLoadingExistingData}
          className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SPVStep3;



