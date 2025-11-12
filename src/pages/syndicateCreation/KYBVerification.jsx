import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {UpsyndicateIcon} from "../../components/Icons";


const KYBVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
  const [currentKycRecordId, setCurrentKycRecordId] = useState(null); // Store the most recent record ID for PATCH
  const [fileUrls, setFileUrls] = useState({
    incorporationCertificate: null,
    bankStatement: null,
    proofOfAddress: null,
    beneficiaryIdentity: null,
    beneficiaryProofOfAddress: null
  });
  const [formData, setFormData] = useState({
    companyLegalName: "",
    fullName: "",
    position: "",
    incorporationCertificate: null,
    bankStatement: null,
    addressLine1: "",
    addressLine2: "",
    townCity: "",
    postalCode: "",
    country: "",
    proofOfAddress: null,
    beneficiaryIdentity: null,
    beneficiaryProofOfAddress: null,
    soeEligibility: "Hidden",
    notarySigning: "NO",
    deedOfAdherence: "NO",
    contactNumber: "",
    contactEmail: "",
    agreeToTerms: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    // Clear file URL when new file is selected
    setFileUrls(prev => ({
      ...prev,
      [field]: null
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

  // Fetch existing KYC data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setIsLoadingExistingData(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        // Try /api/kyc/ first (for POST), fallback to /kyc/my_kyc/ (for GET)
        const kycUrl = `${API_URL.replace(/\/$/, "")}/kyc/`;
        const kycGetUrl = `${API_URL.replace(/\/$/, "")}/kyc/my_kyc/`;

        console.log("=== Fetching KYC Data ===");
        console.log("API URL:", kycUrl);

        try {
          // For GET, try /kyc/my_kyc/ first (which returns array), fallback to /api/kyc/ if needed
          let kycResponse;
          try {
            kycResponse = await axios.get(kycGetUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });
          } catch (getError) {
            // If /kyc/my_kyc/ fails, try /api/kyc/ (might be different endpoint structure)
            if (getError.response?.status === 404 || getError.response?.status === 405) {
              console.log("⚠️ /kyc/my_kyc/ not available, trying /api/kyc/");
              kycResponse = await axios.get(kycUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });
            } else {
              throw getError;
            }
          }

          console.log("KYC response:", kycResponse.data);

          if (kycResponse.data && kycResponse.status === 200) {
            const responseData = kycResponse.data;
            
            console.log("📦 Full KYC response structure:", JSON.stringify(responseData, null, 2));
            
            // API returns an array of KYC records - get the most recent one
            let kycData = null;
            
            if (Array.isArray(responseData) && responseData.length > 0) {
              // Sort by submitted_at (most recent first) or by id (highest first)
              const sortedRecords = [...responseData].sort((a, b) => {
                // First try to sort by submitted_at
                if (a.submitted_at && b.submitted_at) {
                  return new Date(b.submitted_at) - new Date(a.submitted_at);
                }
                // Fall back to id (higher id = more recent)
                return (b.id || 0) - (a.id || 0);
              });
              
              // Get the most recent record
              kycData = sortedRecords[0];
              const recordId = kycData.id;
              setCurrentKycRecordId(recordId);
              console.log("✅ Found array of KYC records, using most recent:", recordId);
              console.log("✅ Total records:", responseData.length);
              console.log("✅ Most recent record submitted_at:", kycData.submitted_at);
            } else if (typeof responseData === 'object' && !Array.isArray(responseData)) {
              // Handle single object response (fallback)
              const stepData = responseData.step_data || {};
              const profile = responseData.profile || {};
              
              if (Object.keys(stepData).length > 0) {
                kycData = stepData;
                console.log("✅ Using step_data");
              } else if (Object.keys(profile).length > 0) {
                kycData = profile;
                console.log("✅ Using profile");
              } else {
                kycData = responseData;
                console.log("✅ Using root level data");
              }
            }
            
            if (!kycData) {
              console.log("⚠️ No KYC data found in response");
              setHasExistingData(false);
              return;
            }
            
            console.log("✅ kycData:", JSON.stringify(kycData, null, 2));
            console.log("✅ kycData keys:", Object.keys(kycData));
            
            // Extract all fields from API response
            // Note: Based on the API response, fields are directly on the KYC object
            const companyLegalName = kycData.company_legal_name || kycData.company_name || kycData.legal_name || "";
            
            // Get full name from user_details if available, or from direct fields
            const userDetails = kycData.user_details || {};
            const fullName = kycData.full_name || 
                            kycData.owner_name || 
                            kycData.name || 
                            kycData.owner_full_name ||
                            (userDetails.first_name && userDetails.last_name 
                              ? `${userDetails.first_name} ${userDetails.last_name}`.trim()
                              : userDetails.first_name || userDetails.username || "") || "";
            const position = kycData.position || kycData.owner_position || "";
            const addressLine1 = kycData.address_1 || kycData.address_line_1 || kycData.address_line1 || "";
            const addressLine2 = kycData.address_2 || kycData.address_line_2 || kycData.address_line2 || "";
            const townCity = kycData.city || kycData.town_city || kycData.town || "";
            const postalCode = kycData.zip_code || kycData.postal_code || kycData.zip || "";
            const country = kycData.country || "";
            const soeEligibility = kycData.sie_eligibilty || kycData.sie_eligibility || kycData.soe_eligibility || "Hidden";
            const notarySigning = kycData.notary || kycData.notary_signing || "NO";
            
            // Convert deedOfAdherence from boolean/string to "YES"/"NO"
            let deedOfAdherence = "NO";
            if (kycData.Unlocksley_To_Sign_a_Deed_Of_adherence === "true" || 
                kycData.Unlocksley_To_Sign_a_Deed_Of_adherence === true ||
                kycData.Unlocksley_To_Sign_a_Deed_Of_adherence === "YES" ||
                kycData.deed_of_adherence === "YES" ||
                kycData.deed_of_adherence === true) {
              deedOfAdherence = "YES";
            }
            
            const contactNumber = kycData.Investee_Company_Contact_Number || 
                                 kycData.contact_number || 
                                 kycData.phone || 
                                 kycData.contact_phone || "";
            const contactEmail = kycData.Investee_Company_Email || 
                                kycData.contact_email || 
                                kycData.email || 
                                kycData.contact_email_address || "";
            
            // Convert agreeToTerms from boolean/string to boolean
            const agreeToTerms = kycData.I_Agree_To_Investee_Terms === "true" || 
                                kycData.I_Agree_To_Investee_Terms === true || 
                                kycData.I_Agree_To_Investee_Terms === "1" ||
                                kycData.agree_to_terms === true ||
                                kycData.agree_to_terms === "true";
            
            // Extract file URLs (check multiple field name variations)
            const incorporationCertificateUrl = constructFileUrl(
              kycData.certificate_of_incorporation || 
              kycData.incorporation_certificate ||
              kycData.company_certificate_of_incorporation
            );
            const bankStatementUrl = constructFileUrl(
              kycData.company_bank_statement || 
              kycData.bank_statement ||
              kycData.company_bank_statement_file
            );
            const proofOfAddressUrl = constructFileUrl(
              kycData.company_proof_of_address || 
              kycData.proof_of_address ||
              kycData.company_proof_of_address_file
            );
            const beneficiaryIdentityUrl = constructFileUrl(
              kycData.owner_identity_doc || 
              kycData.beneficiary_identity ||
              kycData.owner_identity_document ||
              kycData.beneficiary_identity_doc
            );
            const beneficiaryProofOfAddressUrl = constructFileUrl(
              kycData.owner_proof_of_address || 
              kycData.beneficiary_proof_of_address ||
              kycData.owner_proof_of_address_file ||
              kycData.beneficiary_proof_of_address_file
            );
            
            console.log("✅ Extracted form data:", {
              companyLegalName,
              fullName,
              position,
              addressLine1,
              addressLine2,
              townCity,
              postalCode,
              country,
              soeEligibility,
              notarySigning,
              deedOfAdherence,
              contactNumber,
              contactEmail,
              agreeToTerms
            });
            
            console.log("✅ File URLs:", {
              incorporationCertificate: incorporationCertificateUrl,
              bankStatement: bankStatementUrl,
              proofOfAddress: proofOfAddressUrl,
              beneficiaryIdentity: beneficiaryIdentityUrl,
              beneficiaryProofOfAddress: beneficiaryProofOfAddressUrl
            });
            
            // Check if we have any data (at least one field filled)
            // Even if companyLegalName, fullName, position are empty, we still have data if address or files exist
            if (addressLine1 || addressLine2 || townCity || postalCode || country || 
                incorporationCertificateUrl || bankStatementUrl || proofOfAddressUrl || 
                beneficiaryIdentityUrl || beneficiaryProofOfAddressUrl || contactNumber || 
                contactEmail || soeEligibility !== "Hidden" || notarySigning !== "NO") {
              setHasExistingData(true);
              
              // Populate form with existing data
              setFormData({
                companyLegalName: companyLegalName || "", // May be empty, that's okay
                fullName: fullName || "", // May be empty, that's okay
                position: position || "", // May be empty, that's okay
                incorporationCertificate: null, // Don't set file, just URL
                bankStatement: null,
                addressLine1: addressLine1 || "",
                addressLine2: addressLine2 || "",
                townCity: townCity || "",
                postalCode: postalCode || "",
                country: country || "",
                proofOfAddress: null,
                beneficiaryIdentity: null,
                beneficiaryProofOfAddress: null,
                soeEligibility: soeEligibility || "Hidden",
                notarySigning: notarySigning || "NO",
                deedOfAdherence: deedOfAdherence || "NO",
                contactNumber: contactNumber || "",
                contactEmail: contactEmail || "",
                agreeToTerms: agreeToTerms || false
              });
              
              // Set file URLs for display
              setFileUrls({
                incorporationCertificate: incorporationCertificateUrl,
                bankStatement: bankStatementUrl,
                proofOfAddress: proofOfAddressUrl,
                beneficiaryIdentity: beneficiaryIdentityUrl,
                beneficiaryProofOfAddress: beneficiaryProofOfAddressUrl
              });
              
              console.log("✅ Form populated with existing KYC data");
              console.log("✅ Record ID:", kycData.id);
              console.log("✅ Record submitted_at:", kycData.submitted_at);
            } else {
              console.log("⚠️ No valid KYC data found in response");
              setHasExistingData(false);
            }
          } else {
            setHasExistingData(false);
          }
        } catch (kycErr) {
          // If KYC data doesn't exist (404) or array is empty, it's fine - user will create new
          if (kycErr.response?.status === 404) {
            console.log("No existing KYC data found - will create new");
            setHasExistingData(false);
          } else if (Array.isArray(kycResponse?.data) && kycResponse.data.length === 0) {
            console.log("KYC array is empty - will create new");
            setHasExistingData(false);
          } else {
            console.error("Error fetching existing KYC data:", kycErr);
            console.error("Error details:", kycErr.response?.data);
            console.error("Error status:", kycErr.response?.status);
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
    setLoading(true);
    setError("");

    try {
      // Get access token and user ID from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const userDataStr = localStorage.getItem("userData");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = userData?.user_id || userData?.id;

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add user ID
      formDataToSend.append("user", userId.toString());

      // Add files only if new files are selected
      // For PATCH: If no new file, don't send file field (keeps existing file)
      // For POST: Send file if exists, otherwise don't send (optional fields)
      if (formData.incorporationCertificate) {
        formDataToSend.append("certificate_of_incorporation", formData.incorporationCertificate);
        console.log("Incorporation certificate file will be uploaded:", formData.incorporationCertificate.name);
      } else if (!hasExistingData) {
        // For new data, file is optional - don't send if not provided
        console.log("No incorporation certificate file for new data");
      } else {
        console.log("No new incorporation certificate file, keeping existing file");
      }
      
      if (formData.bankStatement) {
        formDataToSend.append("company_bank_statement", formData.bankStatement);
        console.log("Bank statement file will be uploaded:", formData.bankStatement.name);
      } else if (!hasExistingData) {
        console.log("No bank statement file for new data");
      } else {
        console.log("No new bank statement file, keeping existing file");
      }
      
      if (formData.proofOfAddress) {
        formDataToSend.append("company_proof_of_address", formData.proofOfAddress);
        console.log("Proof of address file will be uploaded:", formData.proofOfAddress.name);
      } else if (!hasExistingData) {
        console.log("No proof of address file for new data");
      } else {
        console.log("No new proof of address file, keeping existing file");
      }
      
      if (formData.beneficiaryIdentity) {
        formDataToSend.append("owner_identity_doc", formData.beneficiaryIdentity);
        console.log("Beneficiary identity file will be uploaded:", formData.beneficiaryIdentity.name);
      } else if (!hasExistingData) {
        console.log("No beneficiary identity file for new data");
      } else {
        console.log("No new beneficiary identity file, keeping existing file");
      }
      
      if (formData.beneficiaryProofOfAddress) {
        formDataToSend.append("owner_proof_of_address", formData.beneficiaryProofOfAddress);
        console.log("Beneficiary proof of address file will be uploaded:", formData.beneficiaryProofOfAddress.name);
      } else if (!hasExistingData) {
        console.log("No beneficiary proof of address file for new data");
      } else {
        console.log("No new beneficiary proof of address file, keeping existing file");
      }

      // Add required text fields (always send if they exist, even if empty string for PATCH)
      formDataToSend.append("company_legal_name", formData.companyLegalName || "");
      formDataToSend.append("full_name", formData.fullName || "");
      formDataToSend.append("position", formData.position || "");
      
      // Add address fields
      if (formData.addressLine1) {
        formDataToSend.append("address_1", formData.addressLine1);
      }
      if (formData.addressLine2) {
        formDataToSend.append("address_2", formData.addressLine2);
      }
      if (formData.townCity) {
        formDataToSend.append("city", formData.townCity);
      }
      if (formData.postalCode) {
        formDataToSend.append("zip_code", formData.postalCode);
      }
      if (formData.country) {
        formDataToSend.append("country", formData.country);
      }

      // Add dropdown/select fields
      formDataToSend.append("sie_eligibilty", formData.soeEligibility);
      formDataToSend.append("notary", formData.notarySigning);

      // Convert deedOfAdherence from "YES"/"NO" to "true"/"false"
      const deedOfAdherenceValue = formData.deedOfAdherence === "YES" ? "true" : "false";
      formDataToSend.append("Unlocksley_To_Sign_a_Deed_Of_adherence", deedOfAdherenceValue);

      // Add contact fields (only if provided)
      if (formData.contactNumber) {
        formDataToSend.append("Investee_Company_Contact_Number", formData.contactNumber);
      }
      if (formData.contactEmail) {
        formDataToSend.append("Investee_Company_Email", formData.contactEmail);
      }

      // Convert agreeToTerms boolean to string
      formDataToSend.append("I_Agree_To_Investee_Terms", formData.agreeToTerms ? "true" : "false");

      // Get API URL
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      // Use /api/kyc/ for POST (create new)
      // Try /api/kyc/{id}/ first for PATCH, fallback to /kyc/{id}/
      const postUrl = `${API_URL.replace(/\/$/, "")}/kyc/`;
      const patchUrlApi = `${API_URL.replace(/\/$/, "")}/kyc/${currentKycRecordId}/`;
      const patchUrlKyc = `${API_URL.replace(/\/$/, "")}/kyc/${currentKycRecordId}/`;

      console.log("=== KYB Verification API Call ===");
      console.log("Has Existing Data:", hasExistingData);
      console.log("Current KYC Record ID:", currentKycRecordId);
      console.log("Form Data:", {
        companyLegalName: formData.companyLegalName,
        fullName: formData.fullName,
        position: formData.position,
        hasFiles: {
          incorporationCertificate: !!formData.incorporationCertificate,
          bankStatement: !!formData.bankStatement,
          proofOfAddress: !!formData.proofOfAddress,
          beneficiaryIdentity: !!formData.beneficiaryIdentity,
          beneficiaryProofOfAddress: !!formData.beneficiaryProofOfAddress
        }
      });

      let response;
      
      // Use PATCH to update existing record if we have a record ID, otherwise POST to create new
      if (hasExistingData && currentKycRecordId) {
        console.log("🔄 Updating existing KYC record with PATCH, ID:", currentKycRecordId);
        console.log("Trying PATCH URL (API):", patchUrlApi);
        try {
          // Try /api/kyc/{id}/ first
          response = await axios.patch(patchUrlApi, formDataToSend, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          });
          console.log("✅ KYB verification updated successfully via /api/kyc/{id}/:", response.data);
        } catch (patchError1) {
          // If /api/kyc/{id}/ fails, try /kyc/{id}/
          if (patchError1.response?.status === 405 || patchError1.response?.status === 404) {
            console.log("⚠️ PATCH to /api/kyc/{id}/ failed, trying /kyc/{id}/");
            try {
              response = await axios.patch(patchUrlKyc, formDataToSend, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Accept': 'application/json'
                }
              });
              console.log("✅ KYB verification updated successfully via /kyc/{id}/:", response.data);
            } catch (patchError2) {
              // If PATCH fails entirely, try POST to /api/kyc/ (some APIs allow POST for updates)
              if (patchError2.response?.status === 405 || patchError2.response?.status === 404) {
                console.log("⚠️ PATCH not allowed, trying POST to /api/kyc/ instead");
                response = await axios.post(postUrl, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
                });
                console.log("✅ KYB verification created/updated successfully via POST:", response.data);
                // Update record ID if response includes it
                if (response.data?.id) {
                  setCurrentKycRecordId(response.data.id);
                }
                setHasExistingData(true);
              } else {
                throw patchError2;
              }
            }
          } else {
            throw patchError1;
          }
        }
      } else {
        console.log("➕ Creating new KYC record with POST");
        console.log("POST URL:", postUrl);
        console.log("Full URL will be:", postUrl);
        try {
          response = await axios.post(postUrl, formDataToSend, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
              // Note: Don't set Content-Type header - axios will set it automatically with boundary for FormData
            }
          });
          console.log("✅ KYB verification created successfully:", response.data);
          console.log("✅ Response status:", response.status);
          // If response includes the new record ID, store it
          if (response.data?.id) {
            setCurrentKycRecordId(response.data.id);
            console.log("✅ Stored new KYC record ID:", response.data.id);
          }
          // Mark that data now exists for future fetches
          setHasExistingData(true);
        } catch (postError) {
          console.error("❌ POST error details:", {
            status: postError.response?.status,
            statusText: postError.response?.statusText,
            data: postError.response?.data,
            message: postError.message
          });
          
          // If POST to /api/kyc/ fails with 405 (Method Not Allowed), try /kyc/my_kyc/ as fallback
          if (postError.response?.status === 405) {
            console.log("⚠️ POST to /api/kyc/ returned 405 (Method Not Allowed), trying /kyc/my_kyc/ as fallback");
            const fallbackUrl = `${API_URL.replace(/\/$/, "")}/kyc/my_kyc/`;
            try {
              response = await axios.post(fallbackUrl, formDataToSend, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Accept': 'application/json'
                }
              });
              console.log("✅ KYB verification created successfully via fallback:", response.data);
              if (response.data?.id) {
                setCurrentKycRecordId(response.data.id);
              }
              setHasExistingData(true);
            } catch (fallbackError) {
              console.error("❌ Fallback POST also failed:", fallbackError.response?.status, fallbackError.response?.data);
              throw fallbackError;
            }
          } else {
            throw postError;
          }
        }
      }

      // Navigate to next step on success
      navigate("/syndicate-creation/compliance-attestation");

    } catch (err) {
      console.error("KYB verification error:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to submit KYB verification.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to submit KYB verification. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/entity-profile");
  };

  const FileUploadArea = ({ label, field, accept = ".pdf,.jpg,.jpeg,.png" }) => {
    const fileUrl = fileUrls[field];
    const file = formData[field];
    const hasFile = file || fileUrl;
    
    return (
    <div>
      <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
        {label}
      </label>
      <label htmlFor={field} className="cursor-pointer">
        <div className="border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-8 text-center hover:bg-[#F0F2F1] transition-colors">
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileUpload(field, e.target.files[0])}
            className="hidden"
            id={field}
          />
          <div className="mb-4 flex justify-center">
            <UpsyndicateIcon />
          </div>
          <p className="text-gray-500">Click to upload Files</p>
            {file && (
              <p className="text-green-600 mt-2">✓ {file.name}</p>
            )}
            {fileUrl && !file && (
              <div className="mt-2">
                <p className="text-blue-600 text-sm">✓ File loaded from server</p>
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-500 text-xs underline mt-1 inline-block"
                >
                  View existing file
                </a>
              </div>
          )}
        </div>
      </label>
        {hasFile && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, [field]: null }));
              setFileUrls(prev => ({ ...prev, [field]: null }));
              const fileInput = document.getElementById(field);
              if (fileInput) fileInput.value = "";
            }}
            className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
    </div>
  );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 3: KYB Verification</h1>
        <p className="text-gray-600">Trustworthy business starts here with fast, accurate KYB verification</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Company Information Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Company Legal Name *
            </label>
            <input
              type="text"
              value={formData.companyLegalName}
              onChange={(e) => handleInputChange("companyLegalName", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Your Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Your Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <FileUploadArea 
            label="Company certificate of incorporation" 
            field="incorporationCertificate" 
          />

          <FileUploadArea 
            label="Company bank statement of the account you wish to receive The invest in" 
            field="bankStatement" 
          />
        </div>

        {/* Address Information Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange("addressLine2", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Town/City
            </label>
            <input
              type="text"
              value={formData.townCity}
              onChange={(e) => handleInputChange("townCity", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2A2E] mb-2">
              Postal Code/Zip Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>

          <FileUploadArea 
            label="Company Proof Of Address" 
            field="proofOfAddress" 
          />
        </div>

        {/* Beneficiary Owner & Eligibility Section */}
        <div className="space-y-6">
          <FileUploadArea 
            label="Beneficiary Owner Identity Document" 
            field="beneficiaryIdentity" 
          />

          <FileUploadArea 
            label="Beneficiary Owner Proof Of Address" 
            field="beneficiaryProofOfAddress" 
          />

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              S/SIE Eligibility
            </label>
            <select
              value={formData.soeEligibility}
              onChange={(e) => handleInputChange("soeEligibility", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Hidden">Hidden</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Is Notary / Wet Signing Of Document At Close Or Conversion Of Share
            </label>
            <select
              value={formData.notarySigning}
              onChange={(e) => handleInputChange("notarySigning", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Will You Required Unlocksley To Sign a Deed Of adherence in Order To Close The Deal
            </label>
            <select
              value={formData.deedOfAdherence}
              onChange={(e) => handleInputChange("deedOfAdherence", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="NO">NO</option>
              <option value="YES">YES</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Investee Company Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter contact number (e.g., +1234567890)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
              Investee Company Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter email address (e.g., contact@company.com)"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="mr-3"
              />
              <span className="text-gray-700">I Agree To Investee Terms</span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] hover:bg-[#E8EAE9] text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 !border border-[#01373D]"
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
          {!loading && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default KYBVerification;


