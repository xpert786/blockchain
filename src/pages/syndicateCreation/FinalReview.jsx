import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {RightsIcon} from "../../components/Icons";

const FinalReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [kybData, setKybData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch step4 data and KYB data on mount and when route changes (e.g., via sidebar navigation)
  useEffect(() => {
    // Reset state when navigating to this page (important for sidebar navigation)
    setReviewData(null);
    setKybData(null);
    setIsLoading(true);
    setError(null);

    const fetchReviewData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No access token found. Please login again.");
          setIsLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        
        // Fetch step4 data
        const step4Url = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;
        console.log("=== Fetching Step4 Data for Final Review (via sidebar or direct navigation) ===");
        console.log("API URL:", step4Url);
        console.log("Current path:", location.pathname);

        const [step4Response, kycResponse] = await Promise.allSettled([
          axios.get(step4Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }),
          axios.get(`${API_URL.replace(/\/$/, "")}/kyc/my_kyc/`, {
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
        ]);

        // Process step4 data
        if (step4Response.status === 'fulfilled' && step4Response.value.data && step4Response.value.status === 200) {
          const responseData = step4Response.value.data;
          const profile = responseData.profile || {};
          const stepData = responseData.step_data || {};
          
          console.log("✅ Profile data:", profile);
          console.log("✅ Step data:", stepData);
          
          // Extract all data from profile
          const extractedData = {
            // Step 1: Lead Information
            leadInfo: {
              sectors: profile.sectors || [],
              geographies: profile.geographies || [],
              isAccredited: profile.is_accredited || "",
              understandsRegulatoryRequirements: profile.understands_regulatory_requirements || false,
              existingLpCount: profile.existing_lp_count || "",
              enablePlatformLpAccess: profile.enable_platform_lp_access || false,
            },
            // Step 2: Entity Profile
            entityProfile: {
              firmName: profile.firm_name || "",
              description: profile.description || "",
              logo: profile.logo ? constructFileUrl(profile.logo) : null,
            },
            // Step 4: Compliance & Attestation
            compliance: {
              riskRegulatoryAttestation: profile.risk_regulatory_attestation || false,
              jurisdictionalComplianceAcknowledged: profile.jurisdictional_compliance_acknowledged || false,
              additionalCompliancePolicies: profile.additional_compliance_policies 
                ? constructFileUrl(profile.additional_compliance_policies) 
                : null,
            },
            // Step 5: Application Status
            application: {
              applicationSubmitted: stepData.application_submitted || profile.application_submitted || false,
              submittedAt: responseData.submitted_at || profile.submitted_at || "",
              applicationStatus: responseData.application_status || profile.application_status || "",
            }
          };
          
          console.log("✅ Extracted review data:", extractedData);
          setReviewData(extractedData);
        } else if (step4Response.status === 'rejected') {
          console.error("Error fetching step4 data:", step4Response.reason);
          if (step4Response.reason.response?.status === 404) {
            setError("No data found. Please complete all steps first.");
          } else {
            setError(step4Response.reason.message || "Failed to load review data. Please try again.");
          }
        }

        // Process KYB/KYC data
        if (kycResponse.status === 'fulfilled' && kycResponse.value.data && kycResponse.value.status === 200) {
          const kycResponseData = kycResponse.value.data;
          
          console.log("✅ KYC response:", kycResponseData);
          
          // Get the most recent KYC record
          if (Array.isArray(kycResponseData) && kycResponseData.length > 0) {
            const sortedRecords = [...kycResponseData].sort((a, b) => {
              if (a.submitted_at && b.submitted_at) {
                return new Date(b.submitted_at) - new Date(a.submitted_at);
              }
              return (b.id || 0) - (a.id || 0);
            });
            
            const mostRecentKyc = sortedRecords[0];
            console.log("✅ Most recent KYB record:", mostRecentKyc);
            
            // Extract KYB data
            const extractedKybData = {
              companyLegalName: mostRecentKyc.company_legal_name || "",
              fullName: mostRecentKyc.full_name || 
                       (mostRecentKyc.user_details?.first_name && mostRecentKyc.user_details?.last_name
                         ? `${mostRecentKyc.user_details.first_name} ${mostRecentKyc.user_details.last_name}`.trim()
                         : mostRecentKyc.user_details?.first_name || mostRecentKyc.user_details?.username || ""),
              position: mostRecentKyc.position || "",
              addressLine1: mostRecentKyc.address_1 || "",
              addressLine2: mostRecentKyc.address_2 || "",
              townCity: mostRecentKyc.city || "",
              postalCode: mostRecentKyc.zip_code || "",
              country: mostRecentKyc.country || "",
              contactNumber: mostRecentKyc.Investee_Company_Contact_Number || "",
              contactEmail: mostRecentKyc.Investee_Company_Email || "",
              soeEligibility: mostRecentKyc.sie_eligibilty || "Hidden",
              notarySigning: mostRecentKyc.notary || "NO",
              deedOfAdherence: mostRecentKyc.Unlocksley_To_Sign_a_Deed_Of_adherence === true || 
                              mostRecentKyc.Unlocksley_To_Sign_a_Deed_Of_adherence === "true" ? "YES" : "NO",
              agreeToTerms: mostRecentKyc.I_Agree_To_Investee_Terms === true || 
                           mostRecentKyc.I_Agree_To_Investee_Terms === "true",
              files: {
                incorporationCertificate: mostRecentKyc.certificate_of_incorporation 
                  ? constructFileUrl(mostRecentKyc.certificate_of_incorporation) 
                  : null,
                bankStatement: mostRecentKyc.company_bank_statement 
                  ? constructFileUrl(mostRecentKyc.company_bank_statement) 
                  : null,
                proofOfAddress: mostRecentKyc.company_proof_of_address 
                  ? constructFileUrl(mostRecentKyc.company_proof_of_address) 
                  : null,
                beneficiaryIdentity: mostRecentKyc.owner_identity_doc 
                  ? constructFileUrl(mostRecentKyc.owner_identity_doc) 
                  : null,
                beneficiaryProofOfAddress: mostRecentKyc.owner_proof_of_address 
                  ? constructFileUrl(mostRecentKyc.owner_proof_of_address) 
                  : null,
              }
            };
            
            console.log("✅ Extracted KYB data:", extractedKybData);
            setKybData(extractedKybData);
          }
        } else if (kycResponse.status === 'rejected') {
          console.log("⚠️ No KYB data found or error fetching:", kycResponse.reason?.response?.status);
          // KYB data is optional, so we don't set error for this
        }
      } catch (err) {
        console.error("Error fetching review data:", err);
        setError(err.message || "Failed to load review data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [location.pathname]); // Refetch when route changes (e.g., via sidebar navigation)


  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const step4Url = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;

      console.log("=== Submitting Application ===");
      console.log("API URL:", step4Url);

      const response = await axios.post(step4Url, {
        application_submitted: true
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Application submitted successfully:", response.data);
      navigate("/syndicate-creation/success");
    } catch (err) {
      console.error("Failed to submit application:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "There was an issue submitting your application. Please try again.";
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/compliance-attestation");
  };

  const handleEdit = (step) => {
    const stepPaths = {
      "lead-info": "/syndicate-creation/lead-info",
      "entity-profile": "/syndicate-creation/entity-profile",
      "kyb-verification": "/syndicate-creation/kyb-verification",
      "compliance": "/syndicate-creation/compliance-attestation",
    };
    if (stepPaths[step]) {
    navigate(stepPaths[step]);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl text-[#001D21]">Step 4: Final Review & Submit</h1>
        <p className="text-gray-600">
          Please review all information before submitting your syndicate application for platform compliance review.
        </p>
        {isLoading && <p className="text-sm text-[#748A91]">Loading latest syndicate data…</p>}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {!reviewData && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No data found. Please complete all steps first.</p>
        </div>
      )}

      {/* Review Sections */}
      {reviewData && (
      <div className="space-y-8">
          {/* Step 1: Lead Information */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-medium text-[#0A2A2E]">Step 1: Lead Information</h2>
              </div>
              <button
                onClick={() => handleEdit("lead-info")}
                className="px-3 py-1.5 text-sm border border-[#01373D] rounded-lg text-[#01373D] hover:bg-[#F4F6F5]"
              >
                Edit
              </button>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                  <span className="font-medium text-gray-600">Accredited Status:</span>
                  <span className="ml-2 text-gray-500 capitalize">
                    {reviewData.leadInfo.isAccredited === "yes" ? "Accredited" : 
                     reviewData.leadInfo.isAccredited === "no" ? "Not Accredited" : 
                     reviewData.leadInfo.isAccredited || "N/A"}
                  </span>
              </div>
              <div>
                  <span className="font-medium text-gray-600">Understands Regulatory Requirements:</span>
                  <span className="ml-2 text-gray-500">
                    {reviewData.leadInfo.understandsRegulatoryRequirements ? "Yes" : "No"}
                  </span>
              </div>
              <div>
                  <span className="font-medium text-gray-600">Existing LP Count:</span>
                  <span className="ml-2 text-gray-500">{reviewData.leadInfo.existingLpCount || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Platform LP Access:</span>
                  <span className="ml-2 text-gray-500">
                    {reviewData.leadInfo.enablePlatformLpAccess ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600 block mb-2">Sector Focus:</span>
                  <div className="flex flex-wrap gap-2">
                    {reviewData.leadInfo.sectors && reviewData.leadInfo.sectors.length > 0 ? (
                      reviewData.leadInfo.sectors.map((sector) => (
                        <span key={sector.id || sector} className="px-2 py-1 bg-white border border-[#E2E2FB] rounded text-gray-600">
                          {sector.name || sector}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No sectors selected</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600 block mb-2">Geography Focus:</span>
                  <div className="flex flex-wrap gap-2">
                    {reviewData.leadInfo.geographies && reviewData.leadInfo.geographies.length > 0 ? (
                      reviewData.leadInfo.geographies.map((geo) => (
                        <span key={geo.id || geo} className="px-2 py-1 bg-white border border-[#E2E2FB] rounded text-gray-600">
                          {geo.name || geo}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No geographies selected</span>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>

          {/* Step 2: Entity Profile */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-medium text-[#0A2A2E]">Step 2: Entity Profile</h2>
              </div>
              <button
                onClick={() => handleEdit("entity-profile")}
                className="px-3 py-1.5 text-sm border border-[#01373D] rounded-lg text-[#01373D] hover:bg-[#F4F6F5]"
              >
                Edit
              </button>
          </div>
            <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Firm / Syndicate Name:</span>
                  <span className="ml-2 text-gray-500">{reviewData.entityProfile.firmName || "N/A"}</span>
                </div>
                {reviewData.entityProfile.logo && (
                <div>
                    <span className="font-medium text-gray-600">Logo:</span>
                    <div className="mt-2">
                      <img 
                        src={reviewData.entityProfile.logo} 
                        alt="Firm logo" 
                        className="h-16 w-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-500">{reviewData.entityProfile.description || "No description provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: KYB Verification */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-medium text-[#0A2A2E]">Step 3: KYB Verification</h2>
                </div>
                <button
                onClick={() => handleEdit("kyb-verification")}
                className="px-3 py-1.5 text-sm border border-[#01373D] rounded-lg text-[#01373D] hover:bg-[#F4F6F5]"
                >
                  Edit
                </button>
              </div>
            <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
              {kybData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {kybData.companyLegalName && (
                    <div>
                      <span className="font-medium text-gray-600">Company Legal Name:</span>
                      <span className="ml-2 text-gray-500">{kybData.companyLegalName}</span>
                    </div>
                  )}
                  {kybData.fullName && (
                    <div>
                      <span className="font-medium text-gray-600">Full Name:</span>
                      <span className="ml-2 text-gray-500">{kybData.fullName}</span>
                    </div>
                  )}
                  {kybData.position && (
                    <div>
                      <span className="font-medium text-gray-600">Position:</span>
                      <span className="ml-2 text-gray-500">{kybData.position}</span>
                    </div>
                  )}
                  {kybData.addressLine1 && (
                    <div>
                      <span className="font-medium text-gray-600">Address Line 1:</span>
                      <span className="ml-2 text-gray-500">{kybData.addressLine1}</span>
                    </div>
                  )}
                  {kybData.addressLine2 && (
                    <div>
                      <span className="font-medium text-gray-600">Address Line 2:</span>
                      <span className="ml-2 text-gray-500">{kybData.addressLine2}</span>
                    </div>
                  )}
                  {kybData.townCity && (
                    <div>
                      <span className="font-medium text-gray-600">Town/City:</span>
                      <span className="ml-2 text-gray-500">{kybData.townCity}</span>
                    </div>
                  )}
                  {kybData.postalCode && (
                    <div>
                      <span className="font-medium text-gray-600">Postal Code:</span>
                      <span className="ml-2 text-gray-500">{kybData.postalCode}</span>
                    </div>
                  )}
                  {kybData.country && (
                    <div>
                      <span className="font-medium text-gray-600">Country:</span>
                      <span className="ml-2 text-gray-500">{kybData.country}</span>
                    </div>
                  )}
                  {kybData.contactNumber && (
                    <div>
                      <span className="font-medium text-gray-600">Contact Number:</span>
                      <span className="ml-2 text-gray-500">{kybData.contactNumber}</span>
                    </div>
                  )}
                  {kybData.contactEmail && (
                    <div>
                      <span className="font-medium text-gray-600">Contact Email:</span>
                      <span className="ml-2 text-gray-500">{kybData.contactEmail}</span>
                    </div>
                  )}
                  {kybData.soeEligibility && kybData.soeEligibility !== "Hidden" && (
                    <div>
                      <span className="font-medium text-gray-600">S/SIE Eligibility:</span>
                      <span className="ml-2 text-gray-500">{kybData.soeEligibility}</span>
          </div>
                  )}
                  {kybData.notarySigning && (
                    <div>
                      <span className="font-medium text-gray-600">Notary Signing:</span>
                      <span className="ml-2 text-gray-500">{kybData.notarySigning}</span>
        </div>
                  )}
                  {kybData.deedOfAdherence && (
        <div>
                      <span className="font-medium text-gray-600">Deed of Adherence:</span>
                      <span className="ml-2 text-gray-500">{kybData.deedOfAdherence}</span>
          </div>
                  )}
                  {(kybData.files.incorporationCertificate || 
                    kybData.files.bankStatement || 
                    kybData.files.proofOfAddress || 
                    kybData.files.beneficiaryIdentity || 
                    kybData.files.beneficiaryProofOfAddress) && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600 block mb-2">Uploaded Documents:</span>
                      <div className="space-y-2">
                        {kybData.files.incorporationCertificate && (
              <div>
                            <a 
                              href={kybData.files.incorporationCertificate} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              ✓ Certificate of Incorporation
                            </a>
              </div>
                        )}
                        {kybData.files.bankStatement && (
              <div>
                            <a 
                              href={kybData.files.bankStatement} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              ✓ Company Bank Statement
                            </a>
              </div>
                        )}
                        {kybData.files.proofOfAddress && (
              <div>
                            <a 
                              href={kybData.files.proofOfAddress} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              ✓ Company Proof of Address
                            </a>
              </div>
                        )}
                        {kybData.files.beneficiaryIdentity && (
              <div>
                            <a 
                              href={kybData.files.beneficiaryIdentity} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              ✓ Beneficiary Owner Identity Document
                            </a>
              </div>
                        )}
                        {kybData.files.beneficiaryProofOfAddress && (
              <div>
                            <a 
                              href={kybData.files.beneficiaryProofOfAddress} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline text-sm"
                            >
                              ✓ Beneficiary Owner Proof of Address
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <p>No KYB verification data found. Click "Edit" to complete KYB verification.</p>
              </div>
              )}
          </div>
        </div>

          {/* Step 4: Compliance & Attestation */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-medium text-[#0A2A2E]">Step 4: Compliance & Attestation</h2>
              </div>
              <button
                onClick={() => handleEdit("compliance")}
                className="px-3 py-1.5 text-sm border border-[#01373D] rounded-lg text-[#01373D] hover:bg-[#F4F6F5]"
              >
                Edit
              </button>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Risk & Regulatory Attestation:</span>
                <span className="text-green-500">
                    {reviewData.compliance.riskRegulatoryAttestation ? "✓ Completed" : "✗ Not Completed"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Jurisdictional Compliance Acknowledged:</span>
                  <span className="text-green-500">
                    {reviewData.compliance.jurisdictionalComplianceAcknowledged ? "✓ Completed" : "✗ Not Completed"}
                  </span>
                </div>
                {reviewData.compliance.additionalCompliancePolicies && (
                  <div>
                    <span className="font-medium text-gray-600">Additional Compliance Policies:</span>
                    <div className="mt-2">
                      <a 
                        href={reviewData.compliance.additionalCompliancePolicies} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-xl font-medium text-[#0A2A2E]">Application Status</h2>
            </div>
            <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    reviewData.application.applicationStatus === "submitted" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {reviewData.application.applicationStatus ? 
                      reviewData.application.applicationStatus.charAt(0).toUpperCase() + 
                      reviewData.application.applicationStatus.slice(1) 
                      : "Pending"}
                  </span>
                </div>
                {reviewData.application.submittedAt && (
                  <div>
                    <span className="font-medium text-gray-600">Submitted At:</span>
                    <span className="ml-2 text-gray-500">{formatDate(reviewData.application.submittedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto ${
            isSubmitting
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit for Review
              <RightsIcon />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FinalReview;
