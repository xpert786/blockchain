import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import InviteLPsModal from "./InviteLPsModal";

const SPVStep5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [spvId, setSpvId] = useState(null);
  const [invites, setInvites] = useState([]);
  const [inviteData, setInviteData] = useState({
    lpInviteEmails: [],
    lpInviteMessage: "",
    leadCarryPercentage: "",
    investmentVisibility: "Hidden",
    autoInviteActiveSpvs: false,
    invitePrivateNote: "",
    inviteTags: [],
    dealTags: [],
    syndicateSelection: "",
    dealMemo: ""
  });

  const handleNext = () => {
    navigate("/syndicate-creation/spv-creation/step6");
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step4");
  };

  const handleSkip = () => {
    navigate("/syndicate-creation/spv-creation/step6");
  };

  // Fetch existing SPV step5 data on mount
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
          // Store in localStorage for consistency
          localStorage.setItem("currentSpvId", String(currentSpvId));
        }

        // If we got step5 data, populate the form
        if (step5Data) {
          const responseData = step5Data.step_data || step5Data.data || step5Data;
          
          console.log("✅ Step5 data found:", responseData);
          console.log("📋 Raw step5 response:", step5Data);

          // Map investment_visibility from API format (lowercase) to form format (capitalized)
          const investmentVisibilityMap = {
            "hidden": "Hidden",
            "visible": "Visible",
            "limited": "Limited",
            "Hidden": "Hidden",
            "Visible": "Visible",
            "Limited": "Limited"
          };

          // Format numbers - API returns strings like "5.00", convert to number for form
          const formatNumber = (value) => {
            if (!value) return "";
            if (typeof value === "string") {
              const num = parseFloat(value);
              return isNaN(num) ? "" : num.toString();
            }
            return value.toString();
          };

          // Handle arrays - convert to strings for form display
          const formatArrayToString = (arr) => {
            if (!arr) return "";
            if (Array.isArray(arr)) {
              return arr.join(", ");
            }
            return arr.toString();
          };

          const mappedData = {
            lpInviteEmails: Array.isArray(responseData.lp_invite_emails) 
              ? responseData.lp_invite_emails 
              : (responseData.lp_invite_emails ? [responseData.lp_invite_emails] : []),
            lpInviteMessage: responseData.lp_invite_message || "",
            leadCarryPercentage: formatNumber(responseData.lead_carry_percentage),
            investmentVisibility: investmentVisibilityMap[responseData.investment_visibility] || 
              (responseData.investment_visibility ? 
                responseData.investment_visibility.charAt(0).toUpperCase() + 
                responseData.investment_visibility.slice(1).toLowerCase() 
                : "Hidden"),
            autoInviteActiveSpvs: responseData.auto_invite_active_spvs || false,
            invitePrivateNote: responseData.invite_private_note || "",
            inviteTags: Array.isArray(responseData.invite_tags) 
              ? responseData.invite_tags 
              : (responseData.invite_tags ? [responseData.invite_tags] : []),
            dealTags: Array.isArray(responseData.deal_tags) 
              ? responseData.deal_tags 
              : (responseData.deal_tags ? [responseData.deal_tags] : []),
            syndicateSelection: responseData.syndicate_selection || "",
            dealMemo: responseData.deal_memo || ""
          };

          setInviteData(mappedData);
          setHasExistingData(true);
          
          // Display invites if we have emails
          if (mappedData.lpInviteEmails && mappedData.lpInviteEmails.length > 0) {
            const invitesList = mappedData.lpInviteEmails.map((email, index) => ({
              id: index,
              email: email,
              name: email.split('@')[0] || "User",
              status: "Active"
            }));
            setInvites(invitesList);
          }
          
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
  }, [location.pathname]); // Refetch when route changes

  const handleInviteLPs = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitInvite = async (modalFormData) => {
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

      const step5Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step5/`;

      console.log("=== SPV Step5 API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("SPV ID:", currentSpvId);
      console.log("API URL:", step5Url);
      console.log("Modal Form Data:", modalFormData);

      // Map modal form data to API format
      // Map investment visibility from form format (capitalized) to API format (lowercase)
      const investmentVisibilityMap = {
        "Hidden": "hidden",
        "Visible": "visible",
        "Limited": "limited",
        "hidden": "hidden",
        "visible": "visible",
        "limited": "limited"
      };

      // Format numbers as strings with decimals
      const formatNumberString = (value) => {
        if (!value || value === "") return null;
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        // Format to 2 decimal places
        return num.toFixed(2);
      };

      // Parse emails string to array (split by comma or newline)
      const parseEmailsToArray = (emailsString) => {
        if (!emailsString || emailsString === "") return [];
        // Split by comma or newline, trim each email, and filter out empty strings and invalid emails
        return emailsString
          .split(/[,\n]/)
          .map(email => email.trim())
          .filter(email => email !== "" && email.includes("@") && email.includes("."));
      };

      // Parse tags string to array (split by comma)
      const parseTagsToArray = (tagsString) => {
        if (!tagsString || tagsString === "") return [];
        // Split by comma, trim each tag, and filter out empty strings
        return tagsString
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag !== "");
      };

      // Parse emails first (will be used for both invite and step5 update)
      const emailsArray = parseEmailsToArray(modalFormData.emails);
      
      // First, send invite using the same endpoint as SPVDetails
      if (emailsArray.length > 0) {
        try {
          const inviteLpsUrl = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/invite-lps/`;
          console.log("📤 Sending invite to:", inviteLpsUrl);
          
          const invitePayload = {
            emails: emailsArray,
            message: modalFormData.message || "",
            lead_carry_percentage: modalFormData.leadCarry ? parseFloat(modalFormData.leadCarry) : 0,
            investment_visibility: investmentVisibilityMap[modalFormData.investmentVisibility] || "hidden",
            auto_invite_active_spvs: modalFormData.anyRaisingSPV || false,
            private_note: modalFormData.privateNote || "",
            tags: parseTagsToArray(modalFormData.tags)
          };

          console.log("📤 Invite payload:", invitePayload);

          const inviteResponse = await axios.post(inviteLpsUrl, invitePayload, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Invite sent successfully:", inviteResponse.data);
          
          // Update invites list with the newly invited emails
          const newInvites = emailsArray.map((email, index) => ({
            id: Date.now() + index,
            email: email,
            name: email.split('@')[0] || "User",
            status: "Active"
          }));
          setInvites(prev => {
            const existingEmails = prev.map(inv => inv.email.toLowerCase());
            const uniqueNewInvites = newInvites.filter(inv => !existingEmails.includes(inv.email.toLowerCase()));
            return [...prev, ...uniqueNewInvites];
          });
        } catch (inviteError) {
          console.error("⚠️ Error sending invite (continuing with step5 update):", inviteError);
          // Don't fail the whole operation if invite fails, just log it
          if (inviteError.response?.status === 401) {
            setError("Unauthorized. Please login again.");
            setLoading(false);
            return;
          }
          // Show error but continue with step5 update
          const errorMsg = inviteError.response?.data?.message || inviteError.response?.data?.error || inviteError.message || "Failed to send invite";
          setError(`Invite failed: ${errorMsg}. Continuing with step5 update...`);
        }
      }

      // Prepare data for API
      const dataToSend = {};

      // LP invite emails - convert string to array (reuse emailsArray from invite call above)
      // For PATCH, merge with existing emails; for POST, use new emails
      if (emailsArray.length > 0) {
        if (hasExistingData && inviteData.lpInviteEmails && inviteData.lpInviteEmails.length > 0) {
          // Merge with existing emails, avoiding duplicates
          const existingEmails = inviteData.lpInviteEmails.map(email => email.toLowerCase());
          const newEmails = emailsArray.filter(email => !existingEmails.includes(email.toLowerCase()));
          dataToSend.lp_invite_emails = [...inviteData.lpInviteEmails, ...newEmails];
        } else {
          // New submission, use new emails
          dataToSend.lp_invite_emails = emailsArray;
        }
      } else if (hasExistingData && inviteData.lpInviteEmails && inviteData.lpInviteEmails.length > 0) {
        // Keep existing emails if no new emails provided
        dataToSend.lp_invite_emails = inviteData.lpInviteEmails;
      }

      // LP invite message
      if (modalFormData.message) {
        dataToSend.lp_invite_message = modalFormData.message;
      }

      // Lead carry percentage - format as string with decimals
      if (modalFormData.leadCarry) {
        const formatted = formatNumberString(modalFormData.leadCarry);
        if (formatted !== null) {
          dataToSend.lead_carry_percentage = formatted;
        }
      }

      // Investment visibility - convert to lowercase
      if (modalFormData.investmentVisibility) {
        dataToSend.investment_visibility = investmentVisibilityMap[modalFormData.investmentVisibility] || 
          modalFormData.investmentVisibility.toLowerCase();
      }

      // Auto invite active SPVs
      dataToSend.auto_invite_active_spvs = modalFormData.anyRaisingSPV || false;

      // Invite private note
      if (modalFormData.privateNote) {
        dataToSend.invite_private_note = modalFormData.privateNote;
      }

      // Invite tags - convert string to array
      // For PATCH, merge with existing tags; for POST, use new tags
      const inviteTagsArray = parseTagsToArray(modalFormData.tags);
      if (inviteTagsArray.length > 0) {
        if (hasExistingData && inviteData.inviteTags && inviteData.inviteTags.length > 0) {
          // Merge with existing tags, avoiding duplicates
          const existingTags = inviteData.inviteTags.map(tag => tag.toLowerCase());
          const newTags = inviteTagsArray.filter(tag => !existingTags.includes(tag.toLowerCase()));
          dataToSend.invite_tags = [...inviteData.inviteTags, ...newTags];
        } else {
          // New submission, use new tags
          dataToSend.invite_tags = inviteTagsArray;
        }
      } else if (hasExistingData && inviteData.inviteTags && inviteData.inviteTags.length > 0) {
        // Keep existing tags if no new tags provided
        dataToSend.invite_tags = inviteData.inviteTags;
      }

      // Deal tags - keep existing if available, or use empty array
      if (inviteData.dealTags && inviteData.dealTags.length > 0) {
        dataToSend.deal_tags = inviteData.dealTags;
      }

      // Syndicate selection - keep existing if available
      if (inviteData.syndicateSelection) {
        dataToSend.syndicate_selection = inviteData.syndicateSelection;
      }

      // Deal memo - keep existing if available
      if (inviteData.dealMemo) {
        dataToSend.deal_memo = inviteData.dealMemo;
      }

      console.log("📤 Prepared step5 data:", dataToSend);
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
        console.log("🔄 Attempting to update existing SPV step5 data with PATCH");
        response = await axios.patch(step5Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step5 updated successfully with PATCH:", response.data);
      } else {
        console.log("➕ Creating new SPV step5 data with POST");
        response = await axios.post(step5Url, dataToSend, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log("✅ SPV step5 created successfully with POST:", response.data);
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

      // Update invites list with all emails from response
      if (response?.data) {
        const responseData = response.data.step_data || response.data.data || response.data;
        const allEmails = responseData.lp_invite_emails || dataToSend.lp_invite_emails || [];
        
        if (allEmails.length > 0) {
          const allInvites = allEmails.map((email, index) => ({
            id: Date.now() + index,
            email: email,
            name: email.split('@')[0] || "User",
            status: "Active"
          }));
          setInvites(allInvites);
        }
      } else if (emailsArray.length > 0) {
        // Fallback: update with new emails if response doesn't have data
        const newInvites = emailsArray.map((email, index) => ({
          id: Date.now() + index,
          email: email,
          name: email.split('@')[0] || "User",
          status: "Active"
        }));
        setInvites(prev => {
          const existingEmails = prev.map(inv => inv.email.toLowerCase());
          const uniqueNewInvites = newInvites.filter(inv => !existingEmails.includes(inv.email.toLowerCase()));
          return [...prev, ...uniqueNewInvites];
        });
      }

      // Update invite data state with response data or form data
      if (response?.data) {
        const responseData = response.data.step_data || response.data.data || response.data;
        setInviteData(prev => ({
          ...prev,
          lpInviteEmails: responseData.lp_invite_emails || prev.lpInviteEmails,
          lpInviteMessage: responseData.lp_invite_message || prev.lpInviteMessage,
          leadCarryPercentage: responseData.lead_carry_percentage ? parseFloat(responseData.lead_carry_percentage).toString() : prev.leadCarryPercentage,
          investmentVisibility: responseData.investment_visibility ? 
            responseData.investment_visibility.charAt(0).toUpperCase() + responseData.investment_visibility.slice(1).toLowerCase() 
            : prev.investmentVisibility,
          autoInviteActiveSpvs: responseData.auto_invite_active_spvs !== undefined ? responseData.auto_invite_active_spvs : prev.autoInviteActiveSpvs,
          invitePrivateNote: responseData.invite_private_note || prev.invitePrivateNote,
          inviteTags: responseData.invite_tags || prev.inviteTags,
          dealTags: responseData.deal_tags || prev.dealTags,
          syndicateSelection: responseData.syndicate_selection || prev.syndicateSelection,
          dealMemo: responseData.deal_memo || prev.dealMemo
        }));
      } else {
        // Fallback: update with form data
        const parsedEmailsArray = parseEmailsToArray(modalFormData.emails);
        const parsedTagsArray = parseTagsToArray(modalFormData.tags);
        setInviteData(prev => ({
          ...prev,
          lpInviteEmails: parsedEmailsArray.length > 0 ? [...prev.lpInviteEmails, ...parsedEmailsArray] : prev.lpInviteEmails,
          lpInviteMessage: modalFormData.message || prev.lpInviteMessage,
          leadCarryPercentage: modalFormData.leadCarry || prev.leadCarryPercentage,
          investmentVisibility: modalFormData.investmentVisibility || prev.investmentVisibility,
          autoInviteActiveSpvs: modalFormData.anyRaisingSPV !== undefined ? modalFormData.anyRaisingSPV : prev.autoInviteActiveSpvs,
          invitePrivateNote: modalFormData.privateNote || prev.invitePrivateNote,
          inviteTags: parsedTagsArray.length > 0 ? [...prev.inviteTags, ...parsedTagsArray] : prev.inviteTags
        }));
      }

      // Close modal on success
      setIsModalOpen(false);
    } catch (err) {
      console.error("SPV step5 error:", err);
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
            setError("Failed to submit SPV step5 data. Please check your input.");
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
        setError(err.message || "Failed to submit SPV step5 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-medium text-gray-800">Invite LPs</h1>
          <p className="text-gray-600">
            Configure how your SPV will appear to investors and control access settings.
          </p>
          {isLoadingExistingData && (
            <p className="text-sm text-gray-500">Loading existing data...</p>
          )}
        </div>
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-[#01373D] w-full sm:w-auto"
        >
          Skip
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#F4F6F5]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={handleInviteLPs}
          className="bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <span>Invite LPs</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Invited LPs Table */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4 py-3 px-4 text-sm font-medium text-gray-500 border-b border-gray-200">
          <div className="text-left">Team member</div>
          <div className="text-center">Email address</div>
          <div className="text-right">Access</div>
        </div>
        {invites.length > 0 ? (
          invites
            .filter(invite => 
              invite.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              invite.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((invite) => (
              <div key={invite.id} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-medium">{invite.name}</span>
                </div>
                <div className="text-gray-700 text-center sm:text-left">{invite.email}</div>
                <div className="font-medium text-right sm:text-left">{invite.status}</div>
              </div>
            ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No invites yet. Click "Invite LPs" to invite investors.</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-[#01373D] w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center space-x-2 bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
        >
          <span>Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>

      {/* Invite LPs Modal */}
      <InviteLPsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleSubmitInvite}
        loading={loading}
      />
    </div>
  );
};

export default SPVStep5;
