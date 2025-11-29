import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    transactionType: "",
    instrumentType: "",
    instrumentTypeId: null,
    valuation: "",
    shareClass: "Preferred",
    shareClassId: null,
    round: "Seed",
    roundId: null,
    roundSize: "",
    yourAllocation: "100000"
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

  // Fetch existing SPV step2 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        
        let step2Data = null;
        let currentSpvId = null;

        // Try to get SPV ID from step1 or from SPV list
        try {
          // Try to get user's SPVs
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

        // Try to get step2 data with SPV ID or default to 1
        const testSpvId = currentSpvId || 1;
        const step2Url = `${API_URL.replace(/\/$/, "")}/spv/${testSpvId}/update_step2/`;
        
        try {
          console.log("🔍 Fetching step2 data from:", step2Url);
          const step2Response = await axios.get(step2Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Step2 GET response:", step2Response.data);

          if (step2Response.data && step2Response.status === 200) {
            step2Data = step2Response.data;
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("✅ Found SPV ID from step2 data:", currentSpvId);
            }
          }
        } catch (getError) {
          if (getError.response?.status === 404) {
            console.log("⚠️ No step2 data found for SPV ID", testSpvId, "(this is normal for new SPVs)");
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("ℹ️ Will use SPV ID", testSpvId, "for new submission");
            }
          } else {
            console.error("❌ Error fetching step2 data:", getError.response?.status, getError.response?.data);
          }
        }

        // Set SPV ID if we found one
        if (currentSpvId) {
          setSpvId(currentSpvId);
          // Store in localStorage for consistency
          localStorage.setItem("currentSpvId", String(currentSpvId));
        }

        // If we got step2 data, populate the form
        if (step2Data) {
          const responseData = step2Data.step_data || step2Data.data || step2Data;
          
          console.log("✅ Step2 data found:", responseData);
          console.log("📋 Raw step2 response:", step2Data);

          // Map instrument_type ID to string value
          const instrumentIdToString = (instrumentId) => {
            const instrumentMap = {
              1: "equity",
              2: "convertible-note",
              3: "safe",
              4: "revenue-share"
            };
            return instrumentMap[instrumentId] || "";
          };

          // Map share_class ID to string value
          const shareClassIdToString = (shareClassId) => {
            const shareClassMap = {
              1: "Preferred",
              2: "Common",
              3: "Series A",
              4: "Series B"
            };
            return shareClassMap[shareClassId] || "Preferred";
          };

          // Map round ID to string value
          // Only valid round ID in backend is 1 (Seed)
          const roundIdToString = (roundId) => {
            const roundMap = {
              1: "Seed"
            };
            return roundMap[roundId] || "Seed"; // Default to Seed if ID not found
          };

          // Map valuation_type from API format to form format
          const valuationTypeMap = {
            "pre_money": "pre-money",
            "post_money": "post-money",
            "pre-money": "pre-money",
            "post-money": "post-money"
          };

          const mappedData = {
            transactionType: responseData.transaction_type || "",
            instrumentType: typeof responseData.instrument_type === 'number' 
              ? instrumentIdToString(responseData.instrument_type) 
              : (responseData.instrument_type || ""),
            instrumentTypeId: typeof responseData.instrument_type === 'number' ? responseData.instrument_type : null,
            valuation: valuationTypeMap[responseData.valuation_type] || responseData.valuation_type || "",
            shareClass: typeof responseData.share_class === 'number'
              ? shareClassIdToString(responseData.share_class)
              : (responseData.share_class || "Preferred"),
            shareClassId: typeof responseData.share_class === 'number' ? responseData.share_class : null,
            round: typeof responseData.round === 'number'
              ? (responseData.round === 1 ? roundIdToString(responseData.round) : "Seed") // Only ID 1 is valid, default to Seed for others
              : (responseData.round || "Seed"),
            roundId: typeof responseData.round === 'number' && responseData.round === 1 ? 1 : null, // Only store ID if it's 1
            roundSize: responseData.round_size || "",
            yourAllocation: responseData.allocation || "100000"
          };

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));

          setHasExistingData(true);
          console.log("✅ Form populated with existing step2 data:", mappedData);
        } else if (currentSpvId) {
          setSpvId(currentSpvId);
          setHasExistingData(false);
          console.log("✅ SPV ID found but no step2 data yet:", currentSpvId);
        } else {
          console.log("⚠️ No existing SPV or step2 data found");
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

      const step2Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step2/`;

      console.log("=== SPV Step2 API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("SPV ID:", currentSpvId);
      console.log("API URL:", step2Url);

      // Map form values to API format
      // Map instrument type string to ID
      const instrumentStringToId = (instrumentString) => {
        const instrumentMap = {
          "equity": 1,
          "convertible-note": 2,
          "safe": 3,
          "revenue-share": 4
        };
        return instrumentMap[instrumentString] || 1;
      };

      // Map share class string to ID
      const shareClassStringToId = (shareClassString) => {
        const shareClassMap = {
          "Preferred": 1,
          "Common": 2,
          "Series A": 3,
          "Series B": 4
        };
        return shareClassMap[shareClassString] || 1;
      };

      // Map round string to ID
      // Note: Only valid round ID in backend is 1 (Seed)
      // Other round values (Series A, Series B, Series C, Growth) don't have valid IDs
      const roundStringToId = (roundString) => {
        const validRoundMap = {
          "Seed": 1
        };
        // Only return ID for valid rounds, return null for invalid ones to skip the field
        return validRoundMap[roundString] || null;
      };

      // Map valuation type from form format to API format
      const valuationTypeMap = {
        "pre-money": "pre_money",
        "post-money": "post_money",
        "pre_money": "pre_money",
        "post_money": "post_money"
      };

      // Prepare data for API
      // Only include round if we have a valid ID (only ID 1 exists in backend)
      const roundValue = formData.roundId || (formData.round ? roundStringToId(formData.round) : null);
      
      const dataToSend = {
        transaction_type: formData.transactionType || null,
        instrument_type: formData.instrumentTypeId || (formData.instrumentType ? instrumentStringToId(formData.instrumentType) : null),
        valuation_type: formData.valuation ? valuationTypeMap[formData.valuation] || formData.valuation : null,
        share_class: formData.shareClassId || (formData.shareClass ? shareClassStringToId(formData.shareClass) : null),
        round_size: formData.roundSize ? String(formData.roundSize) : null,
        allocation: formData.yourAllocation ? String(formData.yourAllocation) : null
      };

      // Only add round if we have a valid ID (only ID 1 is valid in backend)
      // Explicitly check that round ID is 1 before sending
      if (roundValue === 1) {
        dataToSend.round = 1;
        console.log("✅ Round ID 1 (Seed) will be sent");
      } else if (roundValue !== null && roundValue !== undefined) {
        // If round ID is not 1, don't send it to avoid backend error
        console.log("⚠️ Round ID", roundValue, "is not valid in backend (only ID 1 exists). Skipping round field.");
      } else {
        console.log("ℹ️ No valid round ID found. Skipping round field.");
      }

      // Remove null/undefined/empty values
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === null || dataToSend[key] === undefined || dataToSend[key] === "") {
          delete dataToSend[key];
        }
      });

      console.log("📤 Prepared step2 data (round may be omitted if invalid):", dataToSend);
      if (!dataToSend.round && formData.round) {
        console.log("⚠️ Round field omitted - selected round may not have a valid ID in backend:", formData.round);
      }

      console.log("📤 Sending step2 data:", dataToSend);

      let response;

      // Use PATCH if we have existing data, otherwise POST
      if (hasExistingData && currentSpvId) {
        console.log("🔄 Updating existing SPV step2 data with PATCH");
        response = await axios.patch(step2Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step2 updated successfully:", response.data);
      } else {
        console.log("➕ Creating new SPV step2 data with POST");
        response = await axios.post(step2Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step2 created successfully:", response.data);
        if (response.data?.id || response.data?.spv_id) {
          const newSpvId = response.data.id || response.data.spv_id;
          setSpvId(newSpvId);
          console.log("✅ Stored SPV ID:", newSpvId);
        }
        setHasExistingData(true);
      }

      // Navigate to next step on success
    navigate("/syndicate-creation/spv-creation/step3");
    } catch (err) {
      console.error("SPV step2 error:", err);
      const backendData = err.response?.data;
      
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          let errorMessages = [];
          
          // Check for round field error specifically
          if (backendData.round && Array.isArray(backendData.round)) {
            const roundError = backendData.round[0];
            if (roundError && (roundError.includes("Invalid pk") || roundError.includes("does not exist"))) {
              errorMessages.push(`Round: The selected round "${formData.round}" is not available. Please select "Seed" only.`);
            } else {
              errorMessages.push(...backendData.round);
            }
          }
          
          // Check for other field errors (share_class, instrument_type, etc.)
          Object.keys(backendData).forEach(key => {
            if (key !== "round" && Array.isArray(backendData[key])) {
              const fieldErrors = backendData[key];
              fieldErrors.forEach(errorMsg => {
                if (errorMsg && (errorMsg.includes("Invalid pk") || errorMsg.includes("does not exist"))) {
                  errorMessages.push(`${key}: Invalid ID selected. Please choose a valid option.`);
                } else {
                  errorMessages.push(`${key}: ${errorMsg}`);
                }
              });
            } else if (key !== "round" && backendData[key]) {
              errorMessages.push(`${key}: ${backendData[key]}`);
            }
          });
          
          if (errorMessages.length > 0) {
            setError(errorMessages.join(" "));
          } else {
            setError("Failed to submit SPV step2 data. Please check your input.");
          }
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit SPV step2 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step1");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-medium text-gray-800">Terms</h1>
        <p className="text-gray-600">Define the financial and legal terms for your SPV.</p>
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
        {/* Transaction Type */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Transaction Type</h2>
          <p className="text-sm text-gray-600 mb-4">This helps with regulatory and legal structuring of your deal</p>
          <div className="space-y-3">
            <label className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="transactionType"
                value="primary"
                checked={formData.transactionType === "primary"}
                onChange={(e) => handleInputChange("transactionType", e.target.value)}
                className="mt-1 sm:mt-0"
              />
              <span className="text-gray-700">Primary</span>
            </label>
            <label className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="transactionType"
                value="secondary"
                checked={formData.transactionType === "secondary"}
                onChange={(e) => handleInputChange("transactionType", e.target.value)}
                className="mt-1 sm:mt-0"
              />
              <span className="text-gray-700">Secondary</span>
            </label>
          </div>
        </div>

        {/* Instrument Type */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Instrument Type</h2>
          <p className="text-sm text-gray-600 mb-4">Determines the legal instrument used for the deal</p>
          <select
            value={formData.instrumentType}
            onChange={(e) => handleInputChange("instrumentType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
          >
            <option value="">Select Instrument type</option>
            <option value="equity">Equity</option>
            <option value="convertible-note">Convertible Note</option>
            <option value="safe">SAFE</option>
            <option value="revenue-share">Revenue Share</option>
          </select>
        </div>

        {/* Valuation */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Valuation</h2>
          <p className="text-sm text-gray-600 mb-4">This helps with regulatory and legal structuring of your deal</p>
          <div className="space-y-3">
            <label className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="valuation"
                value="pre-money"
                checked={formData.valuation === "pre-money"}
                onChange={(e) => handleInputChange("valuation", e.target.value)}
                className="mt-1 sm:mt-0"
              />
              <span className="text-gray-700">Pre money</span>
            </label>
            <label className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="valuation"
                value="post-money"
                checked={formData.valuation === "post-money"}
                onChange={(e) => handleInputChange("valuation", e.target.value)}
                className="mt-1 sm:mt-0"
              />
              <span className="text-gray-700">Post money</span>
            </label>
          </div>
        </div>

        {/* Share Class and Round */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">Share class</h2>
            <select
              value={formData.shareClass}
              onChange={(e) => handleInputChange("shareClass", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="Preferred">Preferred</option>
              <option value="Common">Common</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">Round</h2>
            <select
              value={formData.round}
              onChange={(e) => handleInputChange("round", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="Seed">Seed</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Note: Only Seed is available in the backend.</p>
          </div>
        </div>

        {/* Round Size */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Round Size</h2>
          <input
            type="number"
            value={formData.roundSize}
            onChange={(e) => handleInputChange("roundSize", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            placeholder="Enter total round size"
          />
        </div>

        {/* Your Allocation */}
        <div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">Your Allocation</h2>
          <input
            type="number"
            value={formData.yourAllocation}
            onChange={(e) => handleInputChange("yourAllocation", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:scale-102 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
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

export default SPVStep2;
