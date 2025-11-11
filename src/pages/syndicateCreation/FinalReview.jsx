import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {RightsIcon} from "../../components/Icons";

const API_BASE = "http://168.231.121.7/blockchain-backend";
const DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyODc5NjM1LCJpYXQiOjE3NjI4NjE2MzUsImp0aSI6ImRhNmI2MzY4ZDY0ZjRmNWI4MDEzNGZjNzYzOWIwOGRmIiwidXNlcl9pZCI6IjY0In0.WnQQo2aPZlEOvNcQGBUDGjcbu_t3CX8XpKUpAFNOjQA";

const FinalReview = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spvData, setSpvData] = useState(null);
  const [isLoadingSpv, setIsLoadingSpv] = useState(true);
  const [spvError, setSpvError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const token = storedToken || DEFAULT_TOKEN;

    const fetchSpv = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/spv/1/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load SPV details (${response.status})`);
        }

        const data = await response.json();
        setSpvData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching SPV data:", error);
          setSpvError(error);
        }
      } finally {
        setIsLoadingSpv(false);
      }
    };

    fetchSpv();

    return () => controller.abort();
  }, []);

  // Mock fallback data - used when API data unavailable
  const reviewData = {
    leadInfo: {
      accreditation: "accredited",
      sectorFocus: ["Fintech", "Healthcare", "Technology"],
      geographyFocus: ["North America", "Europe", "Asia"],
      existingLpNetwork: "Yes",
      lpBaseSize: 50,
      enablePlatformLpAccess: true,
      homeJurisdiction: "United States",
    },
    entityProfile: {
      entityName: "Tech Ventures LLC",
      entityType: "LLC",
      registrationNumber: "LLC-2024-001",
      jurisdiction: "Delaware, USA",
      address: "123 Business St, Suite 100, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "contact@techventures.com",
    },
    kybVerification: {
      documentsUploaded: 3,
      businessDescription: "Technology investment syndicate focused on early-stage startups",
      yearsInBusiness: 5,
    },
    compliance: {
      allAttestationsCompleted: true,
      digitalSignature: "John Smith",
      date: "2024-01-15",
    },
    team: [
      {
        name: "John Doe",
        email: "john@example.com",
        role: "Managing Partner",
        permissions: ["Create Deals", "Access Cap Tables", "Messaging", "LP Data"],
      },
    ],
    strategy: {
      sectorFocus: ["Fintech", "SaaS", "AI/ML"],
      geographyFocus: ["North America", "Europe"],
      averageCheckSize: "$50,000",
      lpBaseSize: "25 LPs",
      platformLpAccess: true,
    },
  };

  const finalData = useMemo(() => {
    if (!spvData) return reviewData;

    const leadInfoApi = spvData.lead_info || {};
    const entityProfileApi = spvData.entity_profile || {};
    const kybApi = spvData.kyb_verification || {};
    const complianceApi = spvData.compliance || {};
    const teamApi = spvData.team || [];
    const strategyApi = spvData.strategy || {};

    return {
      leadInfo: {
        accreditation: leadInfoApi.accreditation ?? reviewData.leadInfo.accreditation,
        sectorFocus: leadInfoApi.sector_focus ?? reviewData.leadInfo.sectorFocus,
        geographyFocus: leadInfoApi.geography_focus ?? reviewData.leadInfo.geographyFocus,
        existingLpNetwork: leadInfoApi.existing_lp_network ?? reviewData.leadInfo.existingLpNetwork,
        lpBaseSize: leadInfoApi.lp_base_size ?? reviewData.leadInfo.lpBaseSize,
        enablePlatformLpAccess: leadInfoApi.enable_platform_lp_access ?? reviewData.leadInfo.enablePlatformLpAccess,
        homeJurisdiction: leadInfoApi.home_jurisdiction ?? reviewData.leadInfo.homeJurisdiction,
      },
      entityProfile: {
        entityName: entityProfileApi.entity_name ?? reviewData.entityProfile.entityName,
        entityType: entityProfileApi.entity_type ?? reviewData.entityProfile.entityType,
        registrationNumber: entityProfileApi.registration_number ?? reviewData.entityProfile.registrationNumber,
        jurisdiction: entityProfileApi.jurisdiction ?? reviewData.entityProfile.jurisdiction,
        address: entityProfileApi.address ?? reviewData.entityProfile.address,
        phone: entityProfileApi.phone ?? reviewData.entityProfile.phone,
        email: entityProfileApi.email ?? reviewData.entityProfile.email,
      },
      kybVerification: {
        documentsUploaded: kybApi.documents_uploaded ?? reviewData.kybVerification.documentsUploaded,
        businessDescription: kybApi.business_description ?? reviewData.kybVerification.businessDescription,
        yearsInBusiness: kybApi.years_in_business ?? reviewData.kybVerification.yearsInBusiness,
      },
      compliance: {
        allAttestationsCompleted: complianceApi.all_attestations_completed ?? reviewData.compliance.allAttestationsCompleted,
        digitalSignature: complianceApi.digital_signature ?? reviewData.compliance.digitalSignature,
        date: complianceApi.date ?? reviewData.compliance.date,
      },
      team: teamApi.length ? teamApi : reviewData.team,
      strategy: {
        sectorFocus: strategyApi.sector_focus ?? reviewData.strategy.sectorFocus,
        geographyFocus: strategyApi.geography_focus ?? reviewData.strategy.geographyFocus,
        averageCheckSize: strategyApi.average_check_size ?? reviewData.strategy.averageCheckSize,
        lpBaseSize: strategyApi.lp_base_size ?? reviewData.strategy.lpBaseSize,
        platformLpAccess: strategyApi.platform_lp_access ?? reviewData.strategy.platformLpAccess,
      },
    };
  }, [spvData]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      const token = storedToken || DEFAULT_TOKEN;

      const response = await fetch(`${API_BASE}/api/syndicate/step4/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ application_submitted: true }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      navigate("/syndicate-creation/success");
    } catch (error) {
      console.error("Failed to submit final review:", error);
      alert("There was an issue submitting your application. Please try again.");
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
      compliance: "/syndicate-creation/compliance-attestation",
    };
    navigate(stepPaths[step]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl text-[#001D21]">Step 4: Final Review & Submit</h1>
        <p className="text-gray-600">
          Please review all information before submitting your syndicate application for platform compliance review.
        </p>
        {isLoadingSpv && <p className="text-sm text-[#748A91]">Loading latest syndicate data…</p>}
        {spvError && (
          <p className="text-sm text-red-600">
            Unable to load live data. Showing the most recent saved information instead.
          </p>
        )}
      </div>

      {/* Review Sections */}
      <div className="space-y-8">
        {/* Lead Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium text-[#0A2A2E]">Lead Information</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Home Jurisdiction:</span>
                <span className="ml-2 text-gray-500">{finalData.leadInfo.homeJurisdiction}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Existing LP Network:</span>
                <span className="ml-2 text-gray-500">{String(finalData.leadInfo.existingLpNetwork)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Accredited Status:</span>
                <span className="ml-2 text-gray-500">{finalData.leadInfo.accreditation}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-600">Sector Focus:</span>
                {(finalData.leadInfo.sectorFocus || []).map((sector) => (
                  <span key={sector} className="px-2 py-1 bg-white border border-[#E2E2FB] rounded text-gray-600">{sector}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium text-gray-600">Geography Focus:</span>
                {(finalData.leadInfo.geographyFocus || []).map((geo) => (
                  <span key={geo} className="px-2 py-1 bg-white border border-[#E2E2FB] rounded text-gray-600">{geo}</span>
                ))}
              </div>
              <div>
                <span className="font-medium text-gray-600">Platform LP Access:</span>
                <span className="ml-2 text-gray-500">{finalData.leadInfo.enablePlatformLpAccess ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Roles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium text-[#0A2A2E]">Team & Roles</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4 space-y-4">
            {finalData.team.map((member, idx) => (
              <div key={`${member.email}-${idx}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white rounded-lg p-3">
                <div>
                  <div className="text-gray-800 font-medium">{member.name}</div>
                  <div className="text-gray-500 text-sm">{member.email}</div>
                </div>
                <div>
                  <div className="text-gray-800 font-medium">{member.role}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(member.permissions || []).map((perm) => (
                      <span key={perm} className="px-2 py-1 bg-white border border-[#E2E2FB] rounded text-xs text-gray-600">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit("lead-info")}
                  className="self-start sm:self-center px-3 py-1.5 text-sm border border-[#01373D] rounded-lg text-[#01373D] hover:bg-[#F4F6F5]"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Strategy */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium text-[#0A2A2E]">Investment Strategy</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Sector Focus:</span>
                <span className="ml-2 text-gray-500">{(finalData.strategy.sectorFocus || []).join(", ")}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Geography Focus:</span>
                <span className="ml-2 text-gray-500">{(finalData.strategy.geographyFocus || []).join(", ")}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Average Check Size:</span>
                <span className="ml-2 text-gray-500">{finalData.strategy.averageCheckSize}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">LP Base Size:</span>
                <span className="ml-2 text-gray-500">{finalData.strategy.lpBaseSize}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Platform LP Access:</span>
                <span className="ml-2 text-gray-500">{finalData.strategy.platformLpAccess ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance & Attestation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium text-[#0A2A2E]">Compliance & Attestation</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Risk & Regulatory Attestation</span>
                <span className="text-green-500">
                  {finalData.compliance.allAttestationsCompleted ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Digital Signature</span>
                <span className="text-gray-500">{finalData.compliance.digitalSignature}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Signed Date</span>
                <span className="text-gray-500">{finalData.compliance.date}</span>
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
