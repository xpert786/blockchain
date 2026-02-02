import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep4 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    jurisdiction: "",
    entityType: "",
    minimumLPInvestment: "",
    targetClosingDate: "",
    totalCarry: "",
    carryRecipient: "",
    gpCommitment: "",
    dealPartners: "",
    dealName: "",
    accessMode: "private"
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

  // Fetch existing SPV step4 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

        let step4Data = null;
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

        // Try to get step4 data with SPV ID or default to 1
        const testSpvId = currentSpvId || 1;
        const step4Url = `${API_URL.replace(/\/$/, "")}/spv/${testSpvId}/update_step4/`;

        try {
          console.log("🔍 Fetching step4 data from:", step4Url);
          const step4Response = await axios.get(step4Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Step4 GET response:", step4Response.data);

          if (step4Response.data && step4Response.status === 200) {
            step4Data = step4Response.data;
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("✅ Found SPV ID from step4 data:", currentSpvId);
            }
          }
        } catch (getError) {
          if (getError.response?.status === 404) {
            console.log("⚠️ No step4 data found for SPV ID", testSpvId, "(this is normal for new SPVs)");
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("ℹ️ Will use SPV ID", testSpvId, "for new submission");
            }
          } else {
            console.error("❌ Error fetching step4 data:", getError.response?.status, getError.response?.data);
          }
        }

        // Set SPV ID if we found one
        if (currentSpvId) {
          setSpvId(currentSpvId);
          // Store in localStorage for consistency
          localStorage.setItem("currentSpvId", String(currentSpvId));
        }

        // If we got step4 data, populate the form
        if (step4Data) {
          const responseData = step4Data.step_data || step4Data.data || step4Data;

          console.log("✅ Step4 data found:", responseData);
          console.log("📋 Raw step4 response:", step4Data);

          // Map jurisdiction from API format (capitalized) to form format (lowercase)
          const jurisdictionMap = {
            "Delaware": "delaware",
            "Cayman": "cayman",
            "Singapore": "singapore",
            "delaware": "delaware",
            "cayman": "cayman",
            "singapore": "singapore"
          };

          // Map entity_type from API format (uppercase) to form format (lowercase)
          const entityTypeMap = {
            "LLC": "llc",
            "C-Corp": "c-corp",
            "LP": "lp",
            "llc": "llc",
            "c-corp": "c-corp",
            "lp": "lp"
          };

          // Map access_mode from API format to form format
          const accessModeMap = {
            "private": "private",
            "public": "public",
            "Visible to all": "public"
          };

          // Format numbers - API returns strings like "25000.00", convert to number for form
          const formatNumber = (value) => {
            if (!value) return "";
            if (typeof value === "string") {
              const num = parseFloat(value);
              return isNaN(num) ? "" : num.toString();
            }
            return value.toString();
          };

          // Format date - API returns "2025-01-15", form expects same format
          const formatDate = (dateValue) => {
            if (!dateValue) return "";
            // If it's already in YYYY-MM-DD format, return as is
            if (typeof dateValue === "string" && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return dateValue;
            }
            // Try to parse and format
            try {
              const date = new Date(dateValue);
              if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.error("Error parsing date:", e);
            }
            return dateValue;
          };

          const mappedData = {
            jurisdiction: jurisdictionMap[responseData.jurisdiction] || responseData.jurisdiction?.toLowerCase() || "",
            entityType: entityTypeMap[responseData.entity_type] || responseData.entity_type?.toLowerCase() || "",
            minimumLPInvestment: formatNumber(responseData.minimum_lp_investment),
            targetClosingDate: formatDate(responseData.target_closing_date),
            totalCarry: formatNumber(responseData.total_carry_percentage),
            carryRecipient: responseData.carry_recipient || "",
            gpCommitment: formatNumber(responseData.gp_commitment),
            dealPartners: responseData.deal_partners || "",
            dealName: responseData.deal_name || "",
            accessMode: accessModeMap[responseData.access_mode] || responseData.access_mode || "private"
          };

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));

          setHasExistingData(true);
          console.log("✅ Form populated with existing step4 data:", mappedData);
        } else if (currentSpvId) {
          setSpvId(currentSpvId);
          setHasExistingData(false);
          console.log("✅ SPV ID found but no step4 data yet:", currentSpvId);
        } else {
          console.log("⚠️ No existing SPV or step4 data found");
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

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

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

      const step4Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step4/`;

      console.log("=== SPV Step4 API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("SPV ID:", currentSpvId);
      console.log("API URL:", step4Url);
      console.log("Form Data:", formData);

      // Map form values to API format
      // Map jurisdiction from form format (lowercase) to API format (capitalized)
      const jurisdictionMap = {
        "delaware": "Delaware",
        "cayman": "Cayman",
        "singapore": "Singapore"
      };

      // Map entity_type from form format (lowercase) to API format (uppercase)
      const entityTypeMap = {
        "llc": "LLC",
        "c-corp": "C-Corp",
        "lp": "LP"
      };

      // Format numbers as strings with decimals
      const formatNumberString = (value) => {
        if (!value || value === "") return null;
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        // Format to 2 decimal places
        return num.toFixed(2);
      };

      // Prepare data for API
      const dataToSend = {};

      // Jurisdiction - capitalize first letter
      if (formData.jurisdiction) {
        dataToSend.jurisdiction = jurisdictionMap[formData.jurisdiction] ||
          formData.jurisdiction.charAt(0).toUpperCase() + formData.jurisdiction.slice(1).toLowerCase();
      }

      // Entity type - uppercase
      if (formData.entityType) {
        dataToSend.entity_type = entityTypeMap[formData.entityType] ||
          formData.entityType.toUpperCase();
      }

      // Minimum LP investment - format as string with decimals
      if (formData.minimumLPInvestment) {
        const formatted = formatNumberString(formData.minimumLPInvestment);
        if (formatted !== null) {
          dataToSend.minimum_lp_investment = formatted;
        }
      }

      // Target closing date - send as is (should be in YYYY-MM-DD format)
      if (formData.targetClosingDate) {
        dataToSend.target_closing_date = formData.targetClosingDate;
      }

      // Total carry percentage - format as string with decimals
      if (formData.totalCarry) {
        const formatted = formatNumberString(formData.totalCarry);
        if (formatted !== null) {
          dataToSend.total_carry_percentage = formatted;
        }
      }

      // Carry recipient - send as is
      if (formData.carryRecipient) {
        dataToSend.carry_recipient = formData.carryRecipient;
      }

      // GP commitment - format as string with decimals
      if (formData.gpCommitment) {
        const formatted = formatNumberString(formData.gpCommitment);
        if (formatted !== null) {
          dataToSend.gp_commitment = formatted;
        }
      }

      // Deal partners - send as is (could be a string or select value)
      if (formData.dealPartners) {
        dataToSend.deal_partners = formData.dealPartners;
      }

      // Deal name - send as is
      if (formData.dealName) {
        dataToSend.deal_name = formData.dealName;
      }

      // Access mode - send as is (defaults to "private")
      if (formData.accessMode) {
        dataToSend.access_mode = formData.accessMode;
      }

      console.log("📤 Prepared step4 data:", dataToSend);
      console.log("📤 Data keys:", Object.keys(dataToSend));

      // Check if we have any data to send
      if (Object.keys(dataToSend).length === 0) {
        console.log("⚠️ No data to send - all fields are empty");
        setError("Please fill in at least one field before proceeding.");
        setLoading(false);
        return;
      }

      let response;

      // Use PATCH if we have existing data, otherwise POST
      if (hasExistingData && currentSpvId) {
        console.log("🔄 Attempting to update existing SPV step4 data with PATCH");
        response = await axios.patch(step4Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step4 updated successfully with PATCH:", response.data);
      } else {
        console.log("➕ Creating new SPV step4 data with POST");
        response = await axios.post(step4Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step4 created successfully with POST:", response.data);
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
        console.log("✅ Success! Navigating to step5");
        navigate("/syndicate-creation/spv-creation/step5");
      } else {
        console.log("⚠️ Unexpected response status:", response?.status);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("SPV step4 error:", err);
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
                  errorMessages.push(`${key}: Invalid value selected. Please choose a valid option.`);
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
            setError("Failed to submit SPV step4 data. Please check your input.");
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
        setError(err.message || "Failed to submit SPV step4 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step3");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-medium text-gray-800">Fundraising & Jurisdiction Selection</h1>
        <p className="text-gray-600">Select the jurisdiction for your SPV and review the legal structure.</p>
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
      <div className="space-y-6">
        {/* Jurisdiction for the deal */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Jurisdiction for the deal</label>
          <p className="text-sm text-gray-600 mb-4">This will appear on the cap table</p>
          <div className="relative">
            <select
              value={formData.jurisdiction}
              onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Select jurisdiction</option>
              <option value="delaware">Delaware, USA</option>
              <option value="cayman">Cayman Islands</option>
              <option value="singapore">Singapore</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Entity Type */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Entity Type</label>
          <p className="text-sm text-gray-600 mb-4">Auto-selected based on jurisdiction</p>
          <div className="relative">
            <select
              value={formData.entityType}
              onChange={(e) => handleInputChange("entityType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Choose entity type</option>
              <option value="llc">LLC</option>
              <option value="c-corp">C-Corp</option>
              <option value="lp">LP</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Minimum LP Investment */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Minimum LP Investment ($)</label>
          <input
            type="number"
            value={formData.minimumLPInvestment}
            onChange={(e) => handleInputChange("minimumLPInvestment", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter minimum investment"
          />
        </div>

        {/* Target Closing Date */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Target Closing Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              value={formData.targetClosingDate}
              onChange={(e) => handleInputChange("targetClosingDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            />
          </div>
        </div>

        {/* Total Carry */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Total Carry (%)</label>
          <input
            type="number"
            value={formData.totalCarry}
            onChange={(e) => handleInputChange("totalCarry", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter carry percentage"
          />
        </div>

        {/* Carry Recipient */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Carry Recipient</label>
          <input
            type="text"
            value={formData.carryRecipient}
            onChange={(e) => handleInputChange("carryRecipient", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter carry recipient entity"
          />
        </div>

        {/* GP Commitment */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">GP Commitment</label>
          <input
            type="number"
            value={formData.gpCommitment}
            onChange={(e) => handleInputChange("gpCommitment", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter GP commitment amount"
          />
        </div>

        {/* Deal Partners */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Deal Partners</label>
          <div className="relative">
            <select
              value={formData.dealPartners}
              onChange={(e) => handleInputChange("dealPartners", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">List co-investors or strategic partners</option>
              <option value="partner1">Partner A</option>
              <option value="partner2">Partner B</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Deal name */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Deal name</label>
          <input
            type="text"
            value={formData.dealName}
            onChange={(e) => handleInputChange("dealName", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5]"
            placeholder="Enter your deal name"
          />
        </div>

        {/* Access Mode */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-4">Access Mode</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${formData.accessMode === "private"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => handleInputChange("accessMode", "private")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41 7.41C7.18894 7.61599 7.01163 7.86439 6.88866 8.14039C6.76568 8.41638 6.69955 8.71432 6.69422 9.01643C6.68889 9.31854 6.74447 9.61863 6.85763 9.89879C6.97079 10.179 7.13923 10.4335 7.35288 10.6471C7.56654 10.8608 7.82104 11.0292 8.10121 11.1424C8.38137 11.2555 8.68146 11.3111 8.98357 11.3058C9.28568 11.3004 9.58362 11.2343 9.85961 11.1113C10.1356 10.9884 10.384 10.8111 10.59 10.59M8.0475 3.81C8.36348 3.77063 8.68157 3.75059 9 3.75C14.25 3.75 16.5 9 16.5 9C16.1647 9.71784 15.7442 10.3927 15.2475 11.01M4.9575 4.9575C3.46594 5.97347 2.2724 7.36894 1.5 9C1.5 9 3.75 14.25 9 14.25C10.4369 14.2539 11.8431 13.8338 13.0425 13.0425M1.5 1.5L16.5 16.5" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <div>
                    <p className="font-medium text-gray-900">Private</p>
                    <p className="text-sm text-gray-500">Only invited investors can view and participate in this deal</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="accessMode"
                  value="private"
                  checked={formData.accessMode === "private"}
                  onChange={() => handleInputChange("accessMode", "private")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>

            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${formData.accessMode === "public"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => handleInputChange("accessMode", "public")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 9C1.5 9 3.75 3.75 9 3.75C14.25 3.75 16.5 9 16.5 9C16.5 9 14.25 14.25 9 14.25C3.75 14.25 1.5 9 1.5 9Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <div>
                    <p className="font-medium text-gray-900">Visible to all</p>
                    <p className="text-sm text-gray-500">Deal will be visible to all qualified investors</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="accessMode"
                  value="public"
                  checked={formData.accessMode === "public"}
                  onChange={() => handleInputChange("accessMode", "public")}
                  className="h-4 w-4 text-blue-600 focus:ring-[#00F0C3]  border-gray-300"
                />
              </div>
            </div>
          </div>
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

export default SPVStep4;
