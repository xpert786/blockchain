import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {RightsIcon} from "../../components/Icons";

const FinalReview = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewData, setReviewData] = useState({
    // Lead Information
            leadInfo: {
      homeJurisdiction: "",
      existingLpNetwork: "",
      accreditedStatus: "",
      complianceDisclaimer: ""
    },
    // Team & Roles
    teamRoles: {
      count: 0,
      members: []
    },
    // Investment Strategy
    investmentStrategy: {
      sectorFocus: [],
      averageCheckSize: "",
      platformLpAccess: "",
      geographyFocus: [],
      lpBaseSize: ""
    },
    // Compliance & Attestation
            compliance: {
      riskRegulatoryAttestation: "",
      additionalPolicies: null
    },
    // Entity KYB
    entityKyb: {
      entityLegalName: "",
      entityType: "",
      registrationNumber: "",
      kybVerificationStatus: ""
    },
    // Beneficial Owners
    beneficialOwners: {
      count: 0,
      allKycApproved: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [stepsCompleted, setStepsCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  const handleSubmit = async () => {
    // Check if step1 and step2 are both true
    if (!stepsCompleted.step1 || !stepsCompleted.step2) {
      alert("Please complete Step 1 and Step 2 before submitting the application.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const step4Url = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;

      console.log("=== PATCH Step4 - Submit Application ===");
      console.log("API URL:", step4Url);

      const response = await axios.patch(step4Url, {
        application_submitted: true
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("✅ Application submitted successfully:", response.data);

      // Navigate to success page on success
      navigate("/syndicate-creation/success");
    } catch (err) {
      console.error("Error submitting application:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          const errorMessages = Object.values(backendData).flat();
          alert(errorMessages.join(", ") || "Failed to submit application.");
        } else {
          alert(String(backendData));
        }
      } else {
        alert(err.message || "Failed to submit application. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/compliance-attestation");
  };

  // Fetch all review data on mount
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const step4Url = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;

        console.log("=== Fetching Step4 Review Data ===");
        console.log("API URL:", step4Url);

        const response = await axios.get(step4Url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Step4 response:", response.data);

        if (response.data && response.status === 200) {
          const data = response.data;
          const reviewSummary = data.review_summary || {};
          
          // Extract steps_completed information
          if (data.steps_completed) {
            setStepsCompleted({
              step1: data.steps_completed.step1 || false,
              step2: data.steps_completed.step2 || false,
              step3: data.steps_completed.step3 || false,
              step4: data.steps_completed.step4 || false
            });
            console.log("Steps completed:", data.steps_completed);
          }

          // Helper to construct file URL
          const constructFileUrl = (filePath) => {
            if (!filePath) return null;
            const baseDomain = "http://168.231.121.7";
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
              return filePath;
            } else if (filePath.startsWith('/blockchain-backend/')) {
              return `${baseDomain}${filePath}`;
            } else if (filePath.startsWith('/media/')) {
              return `${baseDomain}/blockchain-backend${filePath}`;
            } else if (filePath.startsWith('media/')) {
              return `${baseDomain}/blockchain-backend/${filePath}`;
            }
            return `${baseDomain}/blockchain-backend/${filePath}`;
          };

          // Extract Lead Information from review_summary.lead_information
          const leadInfo = reviewSummary.lead_information || {};
          const extractedLeadInfo = {
            homeJurisdiction: leadInfo.home_jurisdiction || "N/A",
            existingLpNetwork: leadInfo.existing_lp_network || "N/A",
            accreditedStatus: leadInfo.accredited_status || "N/A",
            complianceDisclaimer: leadInfo.compliance_disclaimer || "N/A"
          };

          // Extract Team & Roles from review_summary.team_and_roles
          const teamRoles = reviewSummary.team_and_roles || {};
          const extractedTeamRoles = {
            count: teamRoles.count || 0,
            members: teamRoles.members || []
          };

          // Extract Investment Strategy from review_summary.investment_strategy
          const investmentStrategy = reviewSummary.investment_strategy || {};
          const extractedInvestmentStrategy = {
            sectorFocus: Array.isArray(investmentStrategy.sector_focus) 
              ? investmentStrategy.sector_focus.join(", ") 
              : (investmentStrategy.sector_focus || "N/A"),
            averageCheckSize: investmentStrategy.average_check_size || "N/A",
            platformLpAccess: investmentStrategy.platform_lp_access || "N/A",
            geographyFocus: Array.isArray(investmentStrategy.geography_focus) 
              ? investmentStrategy.geography_focus.join(", ") 
              : (investmentStrategy.geography_focus || "N/A"),
            lpBaseSize: investmentStrategy.lp_base_size || "N/A"
          };

          // Extract Compliance & Attestation from review_summary.compliance_and_attestation
          const compliance = reviewSummary.compliance_and_attestation || {};
          const extractedCompliance = {
            riskRegulatoryAttestation: compliance.risk_regulatory_attestation || "N/A",
            additionalPolicies: compliance.additional_policies 
              ? constructFileUrl(compliance.additional_policies) 
              : null
          };

          // Extract Entity KYB from review_summary.entity_kyb
          const entityKyb = reviewSummary.entity_kyb || {};
          const extractedEntityKyb = {
            entityLegalName: entityKyb.entity_legal_name || "N/A",
            entityType: entityKyb.entity_type || "N/A",
            registrationNumber: entityKyb.registration_number || "N/A",
            kybVerificationStatus: entityKyb.kyb_verification_status || "N/A"
          };

          // Extract Beneficial Owners from review_summary.beneficial_owners
          const beneficialOwners = reviewSummary.beneficial_owners || {};
          const extractedBeneficialOwners = {
            count: beneficialOwners.count || 0,
            allKycApproved: beneficialOwners.all_kyc_approved || false
          };

          setReviewData({
            leadInfo: extractedLeadInfo,
            teamRoles: extractedTeamRoles,
            investmentStrategy: extractedInvestmentStrategy,
            compliance: extractedCompliance,
            entityKyb: extractedEntityKyb,
            beneficialOwners: extractedBeneficialOwners
          });

          console.log("✅ Review data populated from review_summary:", {
            leadInfo: extractedLeadInfo,
            teamRoles: extractedTeamRoles,
            investmentStrategy: extractedInvestmentStrategy,
            compliance: extractedCompliance,
            entityKyb: extractedEntityKyb,
            beneficialOwners: extractedBeneficialOwners
          });
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("No step4 data found");
        } else {
          console.error("Error fetching review data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, []);

  const handleEdit = (step) => {
    const stepPaths = {
      "lead-info": "/syndicate-creation/lead-info",
      "entity-profile": "/syndicate-creation/entity-profile",
      "kyb-verification": "/syndicate-creation/kyb-verification",
      "beneficial-owners": "/syndicate-creation/beneficial-owners",
      "compliance": "/syndicate-creation/compliance-attestation",
    };
    if (stepPaths[step]) {
    navigate(stepPaths[step]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl text-[#001D21]">Step 4: Final Review & Submit</h1>
        <p className="text-gray-600">
          Please review all information before submitting your syndicate application for platform compliance review.
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-6">
        {/* Lead Information */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Lead Information</h2>
              </div>
           
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Home Jurisdiction:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.leadInfo.homeJurisdiction}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Existing LP Network:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.leadInfo.existingLpNetwork}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Accredited Status:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.leadInfo.accreditedStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Compliance Disclaimer:</span>
                <span className={reviewData.leadInfo.complianceDisclaimer === "Acknowledged" ? "text-green-600 font-medium" : "text-gray-800"}>
                  {loading ? "Loading..." : reviewData.leadInfo.complianceDisclaimer}
                        </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Roles */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Team & Roles</h2>
              </div>
           
          </div>
            <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Team Members Count:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.teamRoles.count}</span>
                </div>
              {reviewData.teamRoles.members && reviewData.teamRoles.members.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-600 block mb-2">Team Members:</span>
                  <div className="space-y-2">
                    {reviewData.teamRoles.members.map((member, index) => (
                      <div key={index} className="text-gray-800">
                        {member.name || member.email || `Member ${index + 1}`}
                    </div>
                    ))}
                  </div>
                </div>
              )}
              {reviewData.teamRoles.count === 0 && (
                <div className="text-gray-500 text-sm">No team members added yet</div>
              )}
            </div>
          </div>

        {/* Investment Strategy */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Investment Strategy</h2>
                </div>
         
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Sector Focus:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.investmentStrategy.sectorFocus}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Average Check Size:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.investmentStrategy.averageCheckSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Platform LP Access:</span>
                <span className={reviewData.investmentStrategy.platformLpAccess === "Enabled" ? "text-green-600 font-medium" : "text-gray-800"}>
                  {loading ? "Loading..." : reviewData.investmentStrategy.platformLpAccess}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">LP Base Size:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.investmentStrategy.lpBaseSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Geography Focus:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.investmentStrategy.geographyFocus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance & Attestation */}
        <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Compliance & Attestation</h2>
              </div>
            
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Risk & Regulatory Attestation:</span>
                <span className={reviewData.compliance.riskRegulatoryAttestation === "Completed" ? "text-green-600 font-medium" : "text-gray-800"}>
                  {loading ? "Loading..." : reviewData.compliance.riskRegulatoryAttestation}
                </span>
              </div>
              {reviewData.compliance.additionalPolicies && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Additional Policies:</span>
                  <a 
                    href={reviewData.compliance.additionalPolicies} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                      >
                    View File
                      </a>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Entity KYB */}
          <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Entity KYB</h2>
            </div>
            </div>
            <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Entity Legal Name:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.entityKyb.entityLegalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Entity Type:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.entityKyb.entityType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Registration Number:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.entityKyb.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">KYB Verification Status:</span>
                <span className={reviewData.entityKyb.kybVerificationStatus === "Approved" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                  {loading ? "Loading..." : reviewData.entityKyb.kybVerificationStatus}
                  </span>
                </div>
            </div>
          </div>
        </div>

        {/* Beneficial Owners */}
                  <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-xl font-semibold text-[#0A2A2E]">Beneficial Owners</h2>
            </div>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Count:</span>
                <span className="text-gray-800">{loading ? "Loading..." : reviewData.beneficialOwners.count}</span>
                  </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">All KYC Approved:</span>
                <span className={reviewData.beneficialOwners.allKycApproved ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                  {loading ? "Loading..." : (reviewData.beneficialOwners.allKycApproved ? "Yes" : "No")}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

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
              ? "bg-[#00F0C3] text-black cursor-not-allowed"
              : "bg-[#00F0C3] hover:bg-teal-600 text-black"
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6668 1.33301L10.0002 14.6663L7.3335 8.66634M14.6668 1.33301L1.3335 5.99967L7.3335 8.66634M14.6668 1.33301L7.3335 8.66634" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FinalReview;
