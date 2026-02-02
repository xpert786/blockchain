import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    portfolioCompany: "",
    portfolioCompanyId: null,
    companyStage: "pre-seed",
    companyStageId: null,
    countryOfIncorporation: "",
    incorporationType: "",
    incorporationTypeId: null,
    founderEmail: "",
    displayName: "",
    pitchDeck: null
  });
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [spvId, setSpvId] = useState(null);
  const [pitchDeckUrl, setPitchDeckUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [foundDraftSpvId, setFoundDraftSpvId] = useState(null);
  const [userChoseCreateNew, setUserChoseCreateNew] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pitchDeck: file
      }));
      // Clear existing URL when new file is selected
      setPitchDeckUrl(null);
    }
  };

  // Handle user choosing to continue with existing draft
  const handleContinueDraft = async () => {
    if (foundDraftSpvId) {
      setIsLoadingExistingData(true);
      setSpvId(foundDraftSpvId);
      localStorage.setItem("currentSpvId", String(foundDraftSpvId));
      setShowDraftModal(false);
      console.log("✅ User chose to continue with draft SPV:", foundDraftSpvId);

      // Fetch and populate existing step1 data
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const step1Url = `${API_URL.replace(/\/$/, "")}/spv/${foundDraftSpvId}/update_step1/`;

        const step1Response = await axios.get(step1Url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (step1Response.data && step1Response.status === 200) {
          const responseData = step1Response.data.step_data || step1Response.data.data || step1Response.data;

          // Map the data to form format (same logic as in useEffect)
          const stageIdToString = (stageId) => {
            const stageMap = { 1: "pre-seed", 2: "seed", 3: "series-a", 4: "series-b", 5: "growth" };
            return stageMap[stageId] || "pre-seed";
          };

          const typeIdToString = (typeId) => {
            const typeMap = { 1: "llc", 2: "corporation", 3: "c-corp", 4: "s-corp", 5: "other" };
            return typeMap[typeId] || "";
          };

          const companyStageValue = typeof responseData.company_stage === 'number'
            ? stageIdToString(responseData.company_stage)
            : (responseData.company_stage || "pre-seed");

          const incorporationTypeValue = typeof responseData.incorporation_type === 'number'
            ? typeIdToString(responseData.incorporation_type)
            : (responseData.incorporation_type || "");

          const mappedData = {
            displayName: responseData.display_name || "",
            portfolioCompany: responseData.portfolio_company_name || (typeof responseData.portfolio_company === 'string' ? responseData.portfolio_company : "") || "",
            portfolioCompanyId: typeof responseData.portfolio_company === 'number' ? responseData.portfolio_company : null,
            companyStage: companyStageValue,
            companyStageId: typeof responseData.company_stage === 'number' ? responseData.company_stage : null,
            countryOfIncorporation: responseData.country_of_incorporation || "",
            incorporationType: incorporationTypeValue,
            incorporationTypeId: typeof responseData.incorporation_type === 'number' ? responseData.incorporation_type : null,
            founderEmail: responseData.founder_email || "",
            pitchDeck: null
          };

          // Handle pitch deck URL
          if (responseData.pitch_deck) {
            const pitchDeckUrlValue = constructFileUrl(responseData.pitch_deck);
            setPitchDeckUrl(pitchDeckUrlValue);
          }

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));

          setHasExistingData(true);
          console.log("✅ Form populated with existing draft data");
        }
      } catch (getError) {
        if (getError.response?.status === 404) {
          console.log("✅ SPV exists but step1 data not found yet - will start fresh");
          // SPV exists but step1 hasn't been filled yet - this is fine
        } else {
          console.error("❌ Error fetching step1 data:", getError.response?.status, getError.response?.data);
        }
      } finally {
        setIsLoadingExistingData(false);
      }
    }
  };

  // Handle user choosing to create new SPV (delete old draft)
  const handleCreateNew = async () => {
    setUserChoseCreateNew(true); // Set flag to prevent modal from showing again
    setShowDraftModal(false);

    if (foundDraftSpvId) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("⚠️ No access token, skipping deletion");
        } else {
          const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
          const deleteUrl = `${API_URL.replace(/\/$/, "")}/spv/${foundDraftSpvId}/`;

          console.log("🗑️ Deleting old draft SPV:", foundDraftSpvId);

          await axios.delete(deleteUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          console.log("✅ Old draft SPV deleted successfully");
        }
      } catch (deleteError) {
        console.error("⚠️ Error deleting old draft SPV:", deleteError.response?.status, deleteError.response?.data);
        // Continue anyway - the old SPV might not exist or might be in a different state
      }
    }

    // Clear everything and start fresh
    setSpvId(null);
    setFoundDraftSpvId(null);
    localStorage.removeItem("currentSpvId");
    setIsLoadingExistingData(false);
    console.log("🆕 Starting fresh SPV creation (old draft deleted)");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.ms-powerpoint" || file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation")) {
      setFormData(prev => ({
        ...prev,
        pitchDeck: file
      }));
      // Clear existing URL when new file is selected
      setPitchDeckUrl(null);
    }
  };

  // Fetch existing SPV step1 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        // If user already chose to create new, skip draft check
        if (userChoseCreateNew) {
          setIsLoadingExistingData(false);
          return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

        // Check if SPV ID was passed from navigation or localStorage
        // IMPORTANT: We need to VALIDATE that the SPV is actually a draft before using it
        let currentSpvId = location.state?.spvId || null;
        let step1Data = null;

        // If we have an SPV ID from navigation, validate it's a draft first
        if (currentSpvId) {
          // Parse if it's a string
          if (typeof currentSpvId === 'string' && !isNaN(currentSpvId)) {
            currentSpvId = parseInt(currentSpvId, 10);
          }

          // Validate this SPV is actually a draft before using it
          try {
            const checkDraftUrl = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/final_review/`;
            const draftCheckResponse = await axios.get(checkDraftUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });

            const reviewData = draftCheckResponse.data;
            const finalReviewStatus = reviewData?.spv_status || reviewData?.status;

            if (finalReviewStatus && finalReviewStatus.toLowerCase() !== 'draft') {
              console.log("⚠️ SPV", currentSpvId, "is not a draft (status:", finalReviewStatus, "), will find/create draft SPV");
              currentSpvId = null; // Not a draft, don't use it
            } else {
              console.log("✅ SPV", currentSpvId, "is a draft, will use it");
            }
          } catch (draftCheckError) {
            // 404 on final_review means it's a draft (not submitted yet)
            if (draftCheckError.response?.status === 404) {
              console.log("✅ SPV", currentSpvId, "has no final_review (404) - it's a draft, will use it");
            } else {
              console.log("⚠️ Could not validate SPV", currentSpvId, "- will find/create draft SPV instead");
              currentSpvId = null; // Can't validate, don't use it
            }
          }
        }

        // If we have a validated draft SPV ID, try to fetch step1 data
        if (currentSpvId) {
          console.log("✅ Using validated draft SPV ID:", currentSpvId);

          // Try to fetch step1 data for this SPV
          try {
            const step1Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step1/`;
            const step1Response = await axios.get(step1Url, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });

            if (step1Response.data && step1Response.status === 200) {
              step1Data = step1Response.data;
              console.log("✅ Found step1 data for SPV ID:", currentSpvId);
            }
          } catch (getError) {
            if (getError.response?.status === 404) {
              console.log("✅ SPV", currentSpvId, "exists but step1 data not found yet (404) - this is normal, will use this SPV");
              // SPV exists but step1 hasn't been filled yet - this is fine, we'll use this SPV
            } else {
              console.error("❌ Error fetching step1 data:", getError.response?.status, getError.response?.data);
            }
          }
        }

        // If we don't have a validated SPV ID yet, check localStorage and SPV list
        if (!currentSpvId) {
          // First check localStorage, but we'll validate it
          const storedSpvId = localStorage.getItem("currentSpvId");
          if (storedSpvId && !isNaN(storedSpvId)) {
            const parsedStoredId = parseInt(storedSpvId, 10);
            // Quick validation - check if it's a draft
            try {
              const checkDraftUrl = `${API_URL.replace(/\/$/, "")}/spv/${parsedStoredId}/final_review/`;
              await axios.get(checkDraftUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });
              // If we get here, final_review exists - check status
              // (We'll check status in the SPV list check below)
            } catch (draftCheckError) {
              // 404 means it's a draft - use it
              if (draftCheckError.response?.status === 404) {
                currentSpvId = parsedStoredId;
                console.log("✅ Found draft SPV ID in localStorage:", currentSpvId);
              } else {
                // Other error - clear localStorage and find new draft
                console.log("⚠️ Stored SPV ID", parsedStoredId, "is invalid, clearing localStorage");
                localStorage.removeItem("currentSpvId");
              }
            }
          }

          // If still no validated SPV ID, try to get SPV list to find existing draft SPV
          if (!currentSpvId) {
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

              // Check if SPV is a draft (can be reused)
              // A draft SPV is one that:
              // 1. Has no final_review (404) - means it hasn't been submitted yet
              // 2. Has final_review with status "draft"
              // 3. Has status "draft" in the SPV list
              const checkIfSPVIsDraft = async (spvId, spvStatus = null) => {
                // First, check the status from the list if available
                if (spvStatus) {
                  const normalizedStatus = spvStatus.toLowerCase();
                  if (normalizedStatus === 'draft') {
                    console.log("✅ SPV", spvId, "has draft status in list - can use same SPV");
                    return true; // It's a draft, can use this SPV
                  } else if (normalizedStatus === 'pending review' || normalizedStatus === 'pending_review') {
                    console.log("⚠️ SPV", spvId, "has pending review status - will create new SPV");
                    return false; // Already submitted, start new SPV
                  }
                }

                // Then check the final_review endpoint to get the actual spv_status
                try {
                  const finalReviewUrl = `${API_URL.replace(/\/$/, "")}/spv/${spvId}/final_review/`;
                  const finalReviewResponse = await axios.get(finalReviewUrl, {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                  });

                  // Get spv_status from the final_review response
                  const reviewData = finalReviewResponse.data;
                  const finalReviewStatus = reviewData?.spv_status || reviewData?.status;

                  if (finalReviewStatus) {
                    const normalizedStatus = finalReviewStatus.toLowerCase();
                    if (normalizedStatus === 'draft') {
                      console.log("✅ SPV", spvId, "has draft status in final_review - can use same SPV");
                      return true; // It's a draft, can use this SPV
                    } else {
                      console.log("⚠️ SPV", spvId, "has status:", finalReviewStatus, "in final_review - will create new SPV");
                      return false; // Not draft, start new SPV
                    }
                  }

                  // If no spv_status found in final_review, check other indicators
                  const fullSpvData = reviewData?.full_spv_data || reviewData;
                  if (fullSpvData?.submitted_at || fullSpvData?.final_submitted) {
                    console.log("⚠️ SPV", spvId, "has been submitted (found submitted_at/final_submitted) - will create new SPV");
                    return false; // Already submitted, start new SPV
                  }

                  // If final_review exists but no clear status, assume it's been submitted (start new)
                  console.log("⚠️ SPV", spvId, "final_review exists but no draft status - will create new SPV");
                  return false;
                } catch (err) {
                  // If we can't access final_review (404), it means the SPV hasn't been submitted yet
                  // This is a draft SPV - we can use it!
                  if (err.response?.status === 404) {
                    console.log("✅ SPV", spvId, "has no final_review (404) - this is a draft SPV, can use it");
                    return true; // No final_review = draft = can use this SPV
                  }
                  // For other errors, assume it's not a draft to be safe (start new)
                  console.log("⚠️ Error checking SPV", spvId, "status - will create new SPV");
                  return false;
                }
              };

              // If we get a list, find the most recent SPV that hasn't been finalized
              if (Array.isArray(spvData) && spvData.length > 0) {
                // Sort by id (highest first) or created_at to get most recent first
                const sortedSpvs = [...spvData].sort((a, b) => {
                  if (a.created_at && b.created_at) {
                    return new Date(b.created_at) - new Date(a.created_at);
                  }
                  return (b.id || 0) - (a.id || 0);
                });

                // Check each SPV starting from most recent to find one that's a draft
                for (const spv of sortedSpvs) {
                  const isDraft = await checkIfSPVIsDraft(spv.id, spv.status);
                  if (isDraft) {
                    currentSpvId = spv.id;
                    console.log("✅ Found draft SPV ID:", currentSpvId);
                    break;
                  } else {
                    console.log("⚠️ SPV", spv.id, "is not a draft, checking next...");
                  }
                }

                // If all SPVs are finalized, we'll start a new one (currentSpvId will remain null)
                if (!currentSpvId) {
                  console.log("ℹ️ All existing SPVs have been finalized. Starting new SPV creation.");
                }
              } else if (spvData && spvData.id) {
                // Single SPV object - check if it's a draft
                const isDraft = await checkIfSPVIsDraft(spvData.id, spvData.status);
                if (isDraft) {
                  currentSpvId = spvData.id;
                  console.log("✅ Found draft SPV ID from single object:", currentSpvId);
                } else {
                  console.log("⚠️ SPV is not a draft. Starting new SPV creation.");
                }
              }
            } catch (spvListError) {
              console.log("⚠️ Could not get SPV list:", spvListError.response?.status, spvListError.response?.data);
              // If we can't get SPV list, we'll create a new SPV
            }
          }
        }

        // If we have a validated draft SPV ID but no step1 data yet, try to fetch it
        // NOTE: 404 is normal if step1 data doesn't exist yet - we'll still use this SPV
        if (currentSpvId && !step1Data) {
          const step1Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step1/`;

          try {
            console.log("🔍 Fetching step1 data from:", step1Url);
            const step1Response = await axios.get(step1Url, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });

            console.log("✅ Step1 GET response:", step1Response.data);

            if (step1Response.data && step1Response.status === 200) {
              step1Data = step1Response.data;
              console.log("✅ Found step1 data for SPV ID:", currentSpvId);
            }
          } catch (getError) {
            if (getError.response?.status === 404) {
              console.log("✅ SPV", currentSpvId, "exists but step1 data not found yet (404) - this is normal, will use this SPV");
              // SPV exists but step1 hasn't been filled yet - this is fine, we'll use this SPV
              // The 404 is expected and doesn't mean the SPV doesn't exist
            } else {
              console.error("❌ Error fetching step1 data:", getError.response?.status, getError.response?.data);
              // If it's a different error (not 404), the SPV might not exist - clear it
              if (getError.response?.status === 400 || getError.response?.status === 403) {
                console.log("⚠️ SPV", currentSpvId, "seems invalid, clearing it");
                currentSpvId = null;
                localStorage.removeItem("currentSpvId");
              }
            }
          }
        }

        if (!currentSpvId) {
          // No draft SPV found - we'll start fresh
          // Don't set a default SPV ID here, let the submission create a new one
          console.log("ℹ️ No draft SPV found. Will create new SPV on submission.");
        }

        // Set SPV ID only if we found a VALIDATED draft one
        // If no draft SPV found, currentSpvId will be null and we'll start fresh
        if (currentSpvId) {
          // Final validation: make sure this SPV actually exists and is a draft
          try {
            const finalCheckUrl = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/final_review/`;
            await axios.get(finalCheckUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });
            // If we get here without 404, check the status
            // (We already checked this above, but double-check)
            console.log("✅ SPV", currentSpvId, "validated as draft");
          } catch (finalCheckError) {
            // 404 is good (means draft), but other errors mean invalid SPV
            if (finalCheckError.response?.status !== 404) {
              console.log("⚠️ SPV", currentSpvId, "validation failed, clearing it");
              currentSpvId = null;
              localStorage.removeItem("currentSpvId");
            }
          }
        }

        if (currentSpvId && !userChoseCreateNew) {
          // Found a draft SPV - show modal to let user choose (only if user hasn't already chosen to create new)
          setFoundDraftSpvId(currentSpvId);
          setShowDraftModal(true);
          setIsLoadingExistingData(false); // Stop loading since we're showing modal
          console.log("✅ Found draft SPV ID:", currentSpvId, "- showing modal for user choice");
          // Don't set SPV ID yet - wait for user's choice
        } else {
          // Clear SPV ID to start fresh
          setSpvId(null);
          // Clear localStorage as well
          localStorage.removeItem("currentSpvId");
          setIsLoadingExistingData(false);
          console.log("🆕 Starting fresh SPV creation (no valid draft SPV found)");
        }

        // If we got step1 data, populate the form
        if (step1Data && currentSpvId) {
          // Handle different response structures
          const responseData = step1Data.step_data || step1Data.data || step1Data;

          console.log("✅ Step1 data found:", responseData);
          console.log("📋 Raw step1 response:", step1Data);

          // Map company_stage ID to string value
          const stageIdToString = (stageId) => {
            const stageMap = {
              1: "pre-seed",
              2: "seed",
              3: "series-a",
              4: "series-b",
              5: "growth"
            };
            return stageMap[stageId] || "pre-seed";
          };

          // Map incorporation_type ID to string value
          const typeIdToString = (typeId) => {
            const typeMap = {
              1: "llc",
              2: "corporation",
              3: "c-corp",
              4: "s-corp",
              5: "other"
            };
            return typeMap[typeId] || "";
          };

          // Map API response to form data
          const companyStageValue = typeof responseData.company_stage === 'number'
            ? stageIdToString(responseData.company_stage)
            : (responseData.company_stage || "pre-seed");

          const incorporationTypeValue = typeof responseData.incorporation_type === 'number'
            ? typeIdToString(responseData.incorporation_type)
            : (responseData.incorporation_type || "");

          const mappedData = {
            displayName: responseData.display_name || "",
            portfolioCompany: responseData.portfolio_company_name || (typeof responseData.portfolio_company === 'string' ? responseData.portfolio_company : "") || "",
            portfolioCompanyId: typeof responseData.portfolio_company === 'number' ? responseData.portfolio_company : null,
            companyStage: companyStageValue,
            companyStageId: typeof responseData.company_stage === 'number' ? responseData.company_stage : null,
            countryOfIncorporation: responseData.country_of_incorporation || "",
            incorporationType: incorporationTypeValue,
            incorporationTypeId: typeof responseData.incorporation_type === 'number' ? responseData.incorporation_type : null,
            founderEmail: responseData.founder_email || "",
            pitchDeck: null // Don't set file object, just URL
          };

          // Handle pitch deck URL
          if (responseData.pitch_deck) {
            const pitchDeckUrlValue = constructFileUrl(responseData.pitch_deck);
            setPitchDeckUrl(pitchDeckUrlValue);
          }

          setFormData(prev => ({
            ...prev,
            ...mappedData
          }));

          setHasExistingData(true);
          console.log("✅ Form populated with existing step1 data:", mappedData);
        } else if (currentSpvId) {
          // If we have an unfinalized SPV ID but no step1 data, it means the SPV exists but step1 hasn't been filled yet
          setHasExistingData(false);
          console.log("✅ Unfinalized SPV ID found but no step1 data yet:", currentSpvId);
        } else {
          // No unfinalized SPV found - start fresh
          console.log("🆕 Starting new SPV creation (no unfinalized SPV found)");
          setHasExistingData(false);
        }
      } catch (err) {
        console.error("Error in fetchExistingData:", err);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    fetchExistingData();
  }, [location.pathname, userChoseCreateNew]); // Refetch when route changes or user makes choice

  const handleNext = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

      // Get current SPV ID from state, location, or localStorage (in that order)
      // CRITICAL: Check localStorage FIRST to prevent creating duplicate SPVs
      let currentSpvId = localStorage.getItem("currentSpvId") || spvId || location.state?.spvId;

      // If we have an SPV ID from localStorage, parse it (it's stored as string)
      if (currentSpvId && typeof currentSpvId === 'string' && !isNaN(currentSpvId)) {
        currentSpvId = parseInt(currentSpvId, 10);
      }

      // If we have an SPV ID, ALWAYS use UPDATE - never create a new one
      // This prevents duplicate SPV creation
      if (currentSpvId) {
        console.log("✅ Using existing SPV ID for UPDATE:", currentSpvId);
        // Update state and localStorage to ensure consistency
        setSpvId(currentSpvId);
        localStorage.setItem("currentSpvId", String(currentSpvId));
      } else {
        // Before creating a new SPV, double-check if there's an existing unfinalized one
        // IMPORTANT: Only create a new SPV if we're absolutely sure there isn't one already
        // First check localStorage one more time (in case it was set elsewhere)
        const storedSpvId = localStorage.getItem("currentSpvId");
        if (storedSpvId && !isNaN(storedSpvId)) {
          currentSpvId = parseInt(storedSpvId, 10);
          console.log("✅ Found SPV ID in localStorage:", currentSpvId);
        }

        // If still no SPV ID, check the API for existing unfinalized SPVs
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
              // Check each SPV to find one that's not finalized
              for (const spv of spvData) {
                try {
                  const finalReviewUrl = `${API_URL.replace(/\/$/, "")}/spv/${spv.id}/final_review/`;
                  const finalReviewResponse = await axios.get(finalReviewUrl, {
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    }
                  });

                  const reviewData = finalReviewResponse.data;
                  const finalReviewStatus = reviewData?.spv_status || reviewData?.status;

                  if (finalReviewStatus && finalReviewStatus.toLowerCase() === 'draft') {
                    currentSpvId = spv.id;
                    console.log("✅ Found existing draft SPV:", currentSpvId);
                    // Store it in localStorage
                    localStorage.setItem("currentSpvId", String(currentSpvId));
                    break;
                  }
                } catch (err) {
                  // If final_review doesn't exist (404), it's likely a draft
                  if (err.response?.status === 404) {
                    currentSpvId = spv.id;
                    console.log("✅ Found SPV without final_review (draft):", currentSpvId);
                    // Store it in localStorage
                    localStorage.setItem("currentSpvId", String(currentSpvId));
                    break;
                  }
                }
              }
            }
          } catch (spvListError) {
            console.log("⚠️ Could not check SPV list before creating:", spvListError.response?.status);
          }
        }
      }

      // If we found an SPV ID, update state
      if (currentSpvId) {
        setSpvId(currentSpvId);
      }

      // If we have an SPV ID, ALWAYS use update endpoint (whether it has existing data or not)
      // This prevents creating duplicate SPVs
      // Only create a new SPV if currentSpvId is null/undefined
      if (currentSpvId) {
        // Update existing SPV
        const step1Url = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/update_step1/`;

        console.log("=== SPV Step1 Update API Call ===");
        console.log("SPV ID:", currentSpvId);
        console.log("API URL:", step1Url);

        // Prepare JSON payload (as per curl example)
        const payload = {};

        // Add text fields
        if (formData.displayName) {
          payload.display_name = formData.displayName;
        }
        if (formData.portfolioCompany) {
          // If we have an ID, send ID, otherwise send name
          if (formData.portfolioCompanyId) {
            payload.portfolio_company = formData.portfolioCompanyId;
          }
          payload.portfolio_company_name = formData.portfolioCompany;
        }
        if (formData.companyStageId) {
          payload.company_stage = formData.companyStageId;
        } else if (formData.companyStage) {
          // Map stage names to IDs
          const stageMap = {
            "pre-seed": 1,
            "seed": 2,
            "series-a": 3,
            "series-b": 4,
            "growth": 5
          };
          payload.company_stage = stageMap[formData.companyStage] || 1;
        }
        if (formData.countryOfIncorporation) {
          payload.country_of_incorporation = formData.countryOfIncorporation;
        }
        if (formData.incorporationTypeId) {
          payload.incorporation_type = formData.incorporationTypeId;
        } else if (formData.incorporationType) {
          // Map incorporation types to IDs
          const typeMap = {
            "llc": 1,
            "corporation": 2,
            "c-corp": 3,
            "s-corp": 4,
            "other": 5
          };
          payload.incorporation_type = typeMap[formData.incorporationType] || 1;
        }
        if (formData.founderEmail) {
          payload.founder_email = formData.founderEmail;
        }

        // Handle pitch deck - if new file selected, use FormData, otherwise send null in JSON
        if (formData.pitchDeck) {
          // If there's a file, we need to use FormData
          console.log("Pitch deck file will be uploaded:", formData.pitchDeck.name);
          const formDataToSend = new FormData();
          Object.keys(payload).forEach(key => {
            formDataToSend.append(key, payload[key]);
          });
          formDataToSend.append("pitch_deck", formData.pitchDeck);

          // Update existing SPV with PATCH using FormData
          console.log("🔄 Updating existing SPV step1 data with PATCH (FormData for file upload)");
          const response = await axios.patch(step1Url, formDataToSend, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          });
          console.log("✅ SPV step1 updated successfully:", response.data);
        } else {
          // No file - use JSON payload with null for pitch_deck
          payload.pitch_deck = null;
          console.log("No new pitch deck file, keeping existing file");

          // Update existing SPV with PATCH using JSON
          console.log("🔄 Updating existing SPV step1 data with PATCH (JSON)");
          console.log("Payload:", payload);
          const response = await axios.patch(step1Url, payload, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          console.log("✅ SPV step1 updated successfully:", response.data);
        }

        // Navigate to next step on success, passing SPV ID in state
        navigate("/syndicate-creation/spv-creation/step2", {
          state: { spvId: currentSpvId }
        });
      } else {
        // Create new SPV using the create_step1 endpoint
        const createStep1Url = `${API_URL.replace(/\/$/, "")}/spv/create_step1/`;

        console.log("=== SPV Step1 Create API Call ===");
        console.log("API URL:", createStep1Url);

        // Prepare JSON payload for create endpoint (not FormData)
        const payload = {};

        // Add text fields
        if (formData.displayName) {
          payload.display_name = formData.displayName;
        }
        if (formData.portfolioCompany) {
          // If we have an ID, send ID, otherwise send name
          if (formData.portfolioCompanyId) {
            payload.portfolio_company = formData.portfolioCompanyId;
          }
          payload.portfolio_company_name = formData.portfolioCompany;
        }
        if (formData.companyStageId) {
          payload.company_stage = formData.companyStageId;
        } else if (formData.companyStage) {
          // Map stage names to IDs
          const stageMap = {
            "pre-seed": 1,
            "seed": 2,
            "series-a": 3,
            "series-b": 4,
            "growth": 5
          };
          payload.company_stage = stageMap[formData.companyStage] || 1;
        }
        if (formData.countryOfIncorporation) {
          payload.country_of_incorporation = formData.countryOfIncorporation;
        }
        if (formData.incorporationTypeId) {
          payload.incorporation_type = formData.incorporationTypeId;
        } else if (formData.incorporationType) {
          // Map incorporation types to IDs
          const typeMap = {
            "llc": 1,
            "corporation": 2,
            "c-corp": 3,
            "s-corp": 4,
            "other": 5
          };
          payload.incorporation_type = typeMap[formData.incorporationType] || 1;
        }
        if (formData.founderEmail) {
          payload.founder_email = formData.founderEmail;
        }

        // For create endpoint, we'll need to handle file upload separately if needed
        // For now, create without pitch deck, or use FormData if API supports it
        console.log("➕ Creating new SPV step1 with create_step1 endpoint");
        console.log("Payload:", payload);

        // Try JSON first (as per curl example)
        let response;
        try {
          response = await axios.post(createStep1Url, payload, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          console.log("✅ SPV step1 created successfully:", response.data);

          // Update SPV ID if response includes it
          if (response.data?.id || response.data?.spv_id) {
            const newSpvId = response.data.id || response.data.spv_id;
            setSpvId(newSpvId);
            // Store SPV ID in localStorage to persist across steps
            localStorage.setItem("currentSpvId", String(newSpvId));
            console.log("✅ Stored new SPV ID in state and localStorage:", newSpvId);
            setHasExistingData(true);

            // Navigate to next step, passing SPV ID
            navigate("/syndicate-creation/spv-creation/step2", {
              state: { spvId: newSpvId }
            });
            return; // Exit early after successful creation
          } else {
            // Even if no ID in response, navigate (SPV might have been created)
            navigate("/syndicate-creation/spv-creation/step2");
            return;
          }
        } catch (createError) {
          // If JSON fails and we have a file, try FormData
          if (formData.pitchDeck && createError.response?.status === 400) {
            console.log("⚠️ JSON create failed, trying with FormData for file upload");
            const formDataToSend = new FormData();
            Object.keys(payload).forEach(key => {
              formDataToSend.append(key, payload[key]);
            });
            formDataToSend.append("pitch_deck", formData.pitchDeck);

            response = await axios.post(createStep1Url, formDataToSend, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
              }
            });
            console.log("✅ SPV step1 created successfully with FormData:", response.data);

            if (response.data?.id || response.data?.spv_id) {
              const newSpvId = response.data.id || response.data.spv_id;
              setSpvId(newSpvId);
              // Store SPV ID in localStorage to persist across steps
              localStorage.setItem("currentSpvId", String(newSpvId));
              console.log("✅ Stored new SPV ID in state and localStorage:", newSpvId);
              setHasExistingData(true);

              // Navigate to next step, passing SPV ID
              navigate("/syndicate-creation/spv-creation/step2", {
                state: { spvId: newSpvId }
              });
              return; // Exit early after successful creation
            } else {
              // Even if no ID in response, navigate (SPV might have been created)
              navigate("/syndicate-creation/spv-creation/step2");
              return;
            }
          } else {
            throw createError;
          }
        }
      }
    } catch (err) {
      console.error("SPV step1 error:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to submit SPV step1 data.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit SPV step1 data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-medium text-gray-800">Company Overview</h1>
        <p className="text-gray-600">Let's start by gathering some basic information about the deal you're creating.</p>
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

      {/* Draft SPV Found Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Draft SPV Found</h2>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700">
                We found an existing draft SPV (ID: <span className="font-semibold">{foundDraftSpvId}</span>).
              </p>
              <p className="text-gray-600 text-sm">
                Would you like to continue with this draft or create a new SPV?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleContinueDraft}
                className="flex-1 bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue with Draft
              </button>
              <button
                onClick={handleCreateNew}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create New SPV
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center pt-2">
              Note: Creating a new SPV will delete the existing draft.
            </p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Portfolio Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio Company
          </label>
          <input
            type="text"
            value={formData.portfolioCompany}
            onChange={(e) => handleInputChange("portfolioCompany", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter company"
          />
        </div>

        {/* Company Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company stage
          </label>
          <select
            value={formData.companyStage}
            onChange={(e) => handleInputChange("companyStage", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series-a">Series A</option>
            <option value="series-b">Series B</option>
            <option value="growth">Growth</option>
          </select>
        </div>

        {/* Country of Incorporation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of incorporation
          </label>
          <select
            value={formData.countryOfIncorporation}
            onChange={(e) => handleInputChange("countryOfIncorporation", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose county of incorporation</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Incorporation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incorporation type
          </label>
          <select
            value={formData.incorporationType}
            onChange={(e) => handleInputChange("incorporationType", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose incorporation type</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="c-corp">C-Corp</option>
            <option value="s-corp">S-Corp</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Founder Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Founder email
            <span className="ml-2 relative inline-block group">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 bg-yellow-100 text-xs text-gray-700 rounded-lg border border-yellow-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none z-10 transition-all shadow-lg">
                Our platform will reach out to this contact to validate the deal.
              </span>
            </span>
          </label>
          <input
            type="email"
            value={formData.founderEmail}
            onChange={(e) => handleInputChange("founderEmail", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter founder email"
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Display name for SPV"
          />
        </div>

        {/* Upload Pitch Deck */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Pitch Deck
          </label>
          <input
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
            id="pitch-deck-upload"
          />
          <label
            htmlFor="pitch-deck-upload"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full flex flex-col items-center justify-center gap-2 border-1 bg-[#F4F6F5] border-[#0A2A2E] rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors block"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17 8L12 3L7 8" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 3V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <p className="text-sm text-gray-600">
              Drag and drop or click to upload pitch deck (PDF, PPT, PPTX)
            </p>
            {formData.pitchDeck && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.pitchDeck.name}</p>
            )}
            {pitchDeckUrl && !formData.pitchDeck && (
              <div className="mt-2">
                <p className="text-blue-600 text-sm">✓ File loaded from server</p>
                <a
                  href={pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500 text-xs underline mt-1 inline-block"
                >
                  View existing file
                </a>
              </div>
            )}
          </label>
          {(formData.pitchDeck || pitchDeckUrl) && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setFormData(prev => ({ ...prev, pitchDeck: null }));
                setPitchDeckUrl(null);
                const fileInput = document.getElementById("pitch-deck-upload");
                if (fileInput) fileInput.value = "";
              }}
              className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200 mt-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
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
    </div>
  );
};

export default SPVStep1;
