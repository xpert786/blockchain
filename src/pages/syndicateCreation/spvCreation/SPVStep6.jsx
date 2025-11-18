import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep6 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    dealName: "",
    accessMode: "private",
    tags: [],
    syndicateSelector: "",
    dealMemo: "",
    document: null
  });
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spvId, setSpvId] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [supportingDocumentUrl, setSupportingDocumentUrl] = useState(null);

  const commonTags = ["Fintech", "Healthcare", "Technology", "North America", "Europe", "Asia", "SaaS", "E-commerce", "AI/ML", "Blockchain"];

  // Helper function to construct file URL from API response
  const constructFileUrl = (filePath) => {
    if (!filePath) return null;
    
    const baseDomain = "http://168.231.121.7";
    
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    } else if (filePath.startsWith('/')) {
      if (filePath.startsWith('/api/blockchain-backend/')) {
        return `${baseDomain}${filePath.replace(/^\/api/, '')}`;
      } else if (filePath.startsWith('/blockchain-backend/')) {
        return `${baseDomain}${filePath}`;
      } else if (filePath.startsWith('/media/')) {
        return `${baseDomain}/blockchain-backend${filePath}`;
      } else {
        return `${baseDomain}/blockchain-backend${filePath}`;
      }
    } else {
      return `${baseDomain}/blockchain-backend/${filePath}`;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setTagInput("");
      setShowTagDropdown(false);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        handleTagAdd(tagInput);
      }
    }
  };

  const handleTagInputBlur = (e) => {
    // Small delay to allow dropdown click to register
    // Check if the related target is within the dropdown
    const relatedTarget = e.relatedTarget || document.activeElement;
    const dropdown = document.querySelector('[data-tag-dropdown]');
    if (!dropdown || !dropdown.contains(relatedTarget)) {
      setTimeout(() => {
        setShowTagDropdown(false);
      }, 200);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        document: file
      }));
      // Clear existing URL when new file is selected
      setSupportingDocumentUrl(null);
    }
  };


  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step5");
  };

  const handleGenerateAI = () => {
    console.log("Generate with AI clicked");
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  // Fetch existing SPV step5 data on mount (step6 updates step5 endpoint)
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        
        let step5Data = null;
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

        // Try to get step5 data with SPV ID or default to 1
        const testSpvId = currentSpvId || 1;
        const step5Url = `${API_URL.replace(/\/$/, "")}/spv/${testSpvId}/update_step5/`;
        
        try {
          console.log("🔍 Fetching step5 data from:", step5Url);
          const step5Response = await axios.get(step5Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Step5 GET response:", step5Response.data);

          if (step5Response.data && step5Response.status === 200) {
            step5Data = step5Response.data;
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("✅ Found SPV ID from step5 data:", currentSpvId);
            }
          }
        } catch (getError) {
          if (getError.response?.status === 404) {
            console.log("⚠️ No step5 data found for SPV ID", testSpvId, "(this is normal for new SPVs)");
            if (!currentSpvId) {
              currentSpvId = testSpvId;
              console.log("ℹ️ Will use SPV ID", testSpvId, "for new submission");
            }
          } else {
            console.error("❌ Error fetching step5 data:", getError.response?.status, getError.response?.data);
          }
        }

        // Set SPV ID if we found one
        if (currentSpvId) {
          setSpvId(currentSpvId);
        }

        // If we got step5 data, populate the form
        if (step5Data) {
          const responseData = step5Data.step_data || step5Data.data || step5Data;
          
          console.log("✅ Step5 data found:", responseData);

          // Map investment_visibility from API format (lowercase) to form format
          const investmentVisibilityMap = {
            "hidden": "private",
            "visible": "public",
            "limited": "public",
            "Hidden": "private",
            "Visible": "public",
            "Limited": "public"
          };

          const mappedData = {
            dealName: responseData.deal_name || "",
            accessMode: investmentVisibilityMap[responseData.investment_visibility] || 
              (responseData.investment_visibility === "visible" ? "public" : "private"),
            tags: Array.isArray(responseData.deal_tags) 
              ? responseData.deal_tags 
              : (responseData.deal_tags ? [responseData.deal_tags] : []),
            syndicateSelector: responseData.syndicate_selection || "",
            dealMemo: responseData.deal_memo || "",
            document: null // Don't set file object, just URL
          };

          // Handle supporting document URL
          if (responseData.supporting_document) {
            const documentUrl = constructFileUrl(responseData.supporting_document);
            setSupportingDocumentUrl(documentUrl);
            console.log("✅ Supporting document URL found:", documentUrl);
          }

          setFormData(prev => ({ ...prev, ...mappedData }));
          setHasExistingData(true);
          
          console.log("✅ Form populated with existing step5 data:", mappedData);
        } else if (currentSpvId) {
          setSpvId(currentSpvId);
          setHasExistingData(false);
          console.log("✅ SPV ID found but no step5 data yet:", currentSpvId);
        } else {
          console.log("⚠️ No existing SPV or step5 data found");
          setHasExistingData(false);
        }
      } catch (err) {
        console.error("Error in fetchExistingData:", err);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    fetchExistingData();
  }, [location.pathname]);

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";

      // Get SPV ID from state or fetch it
      let currentSpvId = spvId;

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
      }

      const step5Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step5/`;

      console.log("=== SPV Step6 API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("SPV ID:", currentSpvId);
      console.log("API URL:", step5Url);
      console.log("Form Data:", formData);

      // Map form data to API format
      const investmentVisibilityMap = {
        "private": "hidden",
        "public": "visible",
        "Private": "hidden",
        "Public": "visible"
      };

      // Fetch existing step5 data to preserve all fields
      let existingStep5Data = {
        lp_invite_emails: [],
        lp_invite_message: "",
        lead_carry_percentage: "",
        auto_invite_active_spvs: false,
        invite_private_note: "",
        invite_tags: []
      };
      
      if (hasExistingData && currentSpvId) {
        try {
          const getStep5Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step5/`;
          const step5Response = await axios.get(getStep5Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          const responseData = step5Response.data?.step_data || step5Response.data?.data || step5Response.data;
          if (responseData) {
            existingStep5Data = {
              lp_invite_emails: responseData.lp_invite_emails || [],
              lp_invite_message: responseData.lp_invite_message || "",
              lead_carry_percentage: responseData.lead_carry_percentage || "",
              auto_invite_active_spvs: responseData.auto_invite_active_spvs || false,
              invite_private_note: responseData.invite_private_note || "",
              invite_tags: responseData.invite_tags || []
            };
            console.log("✅ Fetched existing step5 data to preserve:", existingStep5Data);
          }
        } catch (fetchError) {
          console.log("⚠️ Could not fetch existing step5 data:", fetchError.response?.status);
          // Use default empty values if fetch fails
        }
      }

      // Check if we need to upload a document
      const hasDocument = formData.document && formData.document instanceof File;

      // Prepare data for API - merge step6 fields with existing step5 fields
      // Use FormData if we have a document to upload, otherwise use JSON
      let dataToSend;
      let headers;

      if (hasDocument) {
        // Use FormData for file upload
        dataToSend = new FormData();
        
        // Add all text fields
        if (existingStep5Data.lp_invite_emails && existingStep5Data.lp_invite_emails.length > 0) {
          existingStep5Data.lp_invite_emails.forEach(email => {
            dataToSend.append("lp_invite_emails", email);
          });
        }
        if (existingStep5Data.lp_invite_message) {
          dataToSend.append("lp_invite_message", existingStep5Data.lp_invite_message);
        }
        if (existingStep5Data.lead_carry_percentage) {
          dataToSend.append("lead_carry_percentage", existingStep5Data.lead_carry_percentage);
        }
        dataToSend.append("investment_visibility", investmentVisibilityMap[formData.accessMode] || "hidden");
        dataToSend.append("auto_invite_active_spvs", existingStep5Data.auto_invite_active_spvs);
        if (existingStep5Data.invite_private_note) {
          dataToSend.append("invite_private_note", existingStep5Data.invite_private_note);
        }
        if (existingStep5Data.invite_tags && existingStep5Data.invite_tags.length > 0) {
          existingStep5Data.invite_tags.forEach(tag => {
            dataToSend.append("invite_tags", tag);
          });
        }
        if (formData.tags && formData.tags.length > 0) {
          formData.tags.forEach(tag => {
            dataToSend.append("deal_tags", tag);
          });
        }
        if (formData.syndicateSelector) {
          dataToSend.append("syndicate_selection", formData.syndicateSelector);
        }
        if (formData.dealMemo) {
          dataToSend.append("deal_memo", formData.dealMemo);
        }
        if (formData.dealName) {
          dataToSend.append("deal_name", formData.dealName);
        }

        // Add supporting document file
        dataToSend.append("supporting_document", formData.document);
        console.log("📎 Supporting document will be uploaded:", formData.document.name);

        // Don't set Content-Type header, let browser set it with boundary for FormData
        headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        };
      } else {
        // Use JSON if no file upload
        dataToSend = {
          lp_invite_emails: existingStep5Data.lp_invite_emails,
          lp_invite_message: existingStep5Data.lp_invite_message,
          lead_carry_percentage: existingStep5Data.lead_carry_percentage || "",
          investment_visibility: investmentVisibilityMap[formData.accessMode] || "hidden",
          auto_invite_active_spvs: existingStep5Data.auto_invite_active_spvs,
          invite_private_note: existingStep5Data.invite_private_note,
          invite_tags: existingStep5Data.invite_tags,
          deal_tags: formData.tags && formData.tags.length > 0 ? formData.tags : [],
          syndicate_selection: formData.syndicateSelector || "",
          deal_memo: formData.dealMemo || "",
          deal_name: formData.dealName || ""
        };

        headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
      }

      console.log("📤 Prepared step6 data (merged with step5):", hasDocument ? "FormData with file" : dataToSend);

      let response;

      // Use PATCH if we have existing data, otherwise POST
      if (hasExistingData && currentSpvId) {
        console.log("🔄 Attempting to update existing SPV step5 data with PATCH");
        response = await axios.patch(step5Url, dataToSend, {
          headers: headers
        });
        console.log("✅ SPV step5 updated successfully with PATCH:", response.data);
      } else {
        console.log("➕ Creating new SPV step5 data with POST");
        response = await axios.post(step5Url, dataToSend, {
          headers: headers
        });
        console.log("✅ SPV step5 created successfully with POST:", response.data);
        
        if (response?.data?.id || response?.data?.spv_id) {
          const newSpvId = response.data.id || response.data.spv_id;
          setSpvId(newSpvId);
          console.log("✅ Stored SPV ID:", newSpvId);
        }
        setHasExistingData(true);
      }

      // Update supporting document URL if response includes it
      if (response?.data) {
        const responseData = response.data.step_data || response.data.data || response.data;
        if (responseData.supporting_document) {
          const documentUrl = constructFileUrl(responseData.supporting_document);
          setSupportingDocumentUrl(documentUrl);
          console.log("✅ Supporting document URL updated:", documentUrl);
        }
      }

      // Navigate to next step on success
      navigate("/syndicate-creation/spv-creation/step7");
    } catch (err) {
      console.error("SPV step6 error:", err);
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
            setError("Failed to submit SPV step6 data. Please check your input.");
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
        setError(err.message || "Failed to submit SPV step6 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-medium text-gray-800">Additional Information</h1>
        <p className="text-gray-600">Configure how your SPV will appear to investors and control access settings.</p>
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
      

        {/* Access Mode */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-4">Access Mode</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.accessMode === "private"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("accessMode", "private")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.41 7.41C7.18894 7.61599 7.01163 7.86439 6.88866 8.14039C6.76568 8.41638 6.69955 8.71432 6.69422 9.01643C6.68889 9.31854 6.74447 9.61863 6.85763 9.89879C6.97079 10.179 7.13923 10.4335 7.35288 10.6471C7.56654 10.8608 7.82104 11.0292 8.10121 11.1424C8.38137 11.2555 8.68146 11.3111 8.98357 11.3058C9.28568 11.3004 9.58362 11.2343 9.85961 11.1113C10.1356 10.9884 10.384 10.8111 10.59 10.59M8.0475 3.81C8.36348 3.77063 8.68157 3.75059 9 3.75C14.25 3.75 16.5 9 16.5 9C16.1647 9.71784 15.7442 10.3927 15.2475 11.01M4.9575 4.9575C3.46594 5.97347 2.2724 7.36894 1.5 9C1.5 9 3.75 14.25 9 14.25C10.4369 14.2539 11.8431 13.8338 13.0425 13.0425M1.5 1.5L16.5 16.5" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#0A2A2E]"
                />
              </div>
            </div>

            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                formData.accessMode === "public"
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("accessMode", "public")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 9C1.5 9 3.75 3.75 9 3.75C14.25 3.75 16.5 9 16.5 9C16.5 9 14.25 14.25 9 14.25C3.75 14.25 1.5 9 1.5 9Z" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#0A2A2E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Tags</label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 border border-[#0A2A2E] rounded-lg bg-[#F4F6F5] min-h-[50px] items-center">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-[#0A2A2E]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => setShowTagDropdown(true)}
                onBlur={handleTagInputBlur}
                placeholder={formData.tags.length === 0 ? "Type and press Enter to add tags" : ""}
                className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Tag Dropdown */}
            {showTagDropdown && (
              <div 
                data-tag-dropdown
                className="absolute z-10 w-full mt-1 bg-white border border-[#0A2A2E] rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-2 py-1 mb-1">Common Tags</p>
                  {commonTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTagAdd(tag)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="w-full text-left px-3 py-2 hover:bg-[#F4F6F5] rounded-lg text-sm text-gray-700 focus:outline-none focus:bg-[#F4F6F5]"
                      >
                        {tag}
                      </button>
                    ))}
                  {commonTags.filter(tag => !formData.tags.includes(tag)).length === 0 && (
                    <p className="text-xs text-gray-400 px-3 py-2">All common tags added</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Syndicate selector */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Syndicate selector</label>
          <div className="relative">
            <select
              value={formData.syndicateSelector}
              onChange={(e) => handleInputChange("syndicateSelector", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#F4F6F5] appearance-none"
            >
              <option value="">Select syndicate</option>
              <option value="syndicate1">Syndicate 1</option>
              <option value="syndicate2">Syndicate 2</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Leave blank to use default naming convention</p>
        </div>

        {/* Deal Memo */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Deal Memo</label>
          <div className="relative">
            <textarea
              value={formData.dealMemo}
              onChange={(e) => handleInputChange("dealMemo", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white h-32 pr-28"
              placeholder="Enter deal memo"
              style={{ resize: "vertical" }}
            />
            <div className="absolute left-3 bottom-3 flex space-x-2">
              <button
                type="button"
                onClick={handleGenerateAI}
                className="px-4 py-2 text-sm bg-[#F4F6F5] hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-[#0A2A2E]"
              >
                Generate with AI
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-[#0A2A2E]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Upload a Document */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-2">Upload a Document</label>
          <div className={`border border-[#0A2A2E] rounded-lg p-8 text-center hover:border-gray-400 transition-colors ${
            (formData.document || supportingDocumentUrl) ? "bg-green-50 border-green-500" : "bg-[#F4F6F5]"
          }`}>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="document-upload"
            />
            {formData.document ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 8L12 3L7 8" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 3V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </div>
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">Document uploaded successfully</p>
                  <p className="text-sm text-gray-600">{formData.document.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.document.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer px-4 py-2 text-sm bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors border border-[#0A2A2E]"
                  >
                    Change File
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("document", null);
                      setSupportingDocumentUrl(null);
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors border border-[#0A2A2E]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : supportingDocumentUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-700 font-medium">Document loaded from server</p>
                  <p className="text-sm text-gray-600">
                    {supportingDocumentUrl.split('/').pop() || "Supporting Document"}
                  </p>
                  <a 
                    href={supportingDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs underline mt-1 inline-block hover:text-blue-700"
                  >
                    View existing file
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer px-4 py-2 text-sm bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors border border-[#0A2A2E]"
                  >
                    Change File
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSupportingDocumentUrl(null);
                      const fileInput = document.getElementById("document-upload");
                      if (fileInput) fileInput.value = "";
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors border border-[#0A2A2E]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="document-upload" className="cursor-pointer">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600">Drag and drop or click to upload document (PDF, DOCX)</p>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-[#0A2A2E] w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-[#0A2A2E] w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Next"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SPVStep6;
