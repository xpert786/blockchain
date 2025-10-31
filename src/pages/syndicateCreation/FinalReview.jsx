import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {RightsIcon} from "../../components/Icons";

const FinalReview = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in real app, this would come from context or props
  const reviewData = {
    leadInfo: {
      accreditation: "accredited",
      sectorFocus: ["Fintech", "Healthcare", "Technology"],
      geographyFocus: ["North America", "Europe", "Asia"],
      existingLpNetwork: "Yes",
      lpBaseSize: 50,
      enablePlatformLpAccess: true
    },
    entityProfile: {
      entityName: "Tech Ventures LLC",
      entityType: "LLC",
      registrationNumber: "LLC-2024-001",
      jurisdiction: "Delaware, USA",
      address: "123 Business St, Suite 100, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "contact@techventures.com"
    },
    kybVerification: {
      documentsUploaded: 3,
      businessDescription: "Technology investment syndicate focused on early-stage startups",
      yearsInBusiness: 5
    },
    compliance: {
      allAttestationsCompleted: true,
      digitalSignature: "John Smith",
      date: "2024-01-15"
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/syndicate-creation/success");
    }, 2000);
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/compliance-attestation");
  };

  const handleEdit = (step) => {
    const stepPaths = {
      "lead-info": "/syndicate-creation/lead-info",
      "entity-profile": "/syndicate-creation/entity-profile",
      "kyb-verification": "/syndicate-creation/kyb-verification",
      "compliance": "/syndicate-creation/compliance-attestation"
    };
    navigate(stepPaths[step]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 4: Final Review & Submit</h1>
        <p className="text-gray-600">Please review all information before submitting your syndicate application for platform compliance review.</p>
      </div>

      {/* Review Sections */}
      <div className="space-y-8">
        {/* Lead Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium  text-[#0A2A2E] ">Lead Information</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Home Jurisdiction:</span>
                <span className="ml-2 text-gray-500">United States</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Existing LP Network:</span>
                <span className="ml-2 text-gray-500">Yes</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Accredited Status:</span>
                <span className="ml-2 text-gray-500">I am an accredited investor</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Compliance Disclaimer:</span>
                <span className="ml-2 text-green-500">Acknowledged</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Roles */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium  text-[#0A2A2E] ">Team & Roles</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-800 font-medium">John Doe</div>
                <div className="text-gray-500 text-sm">john@example.com</div>
              </div>
              <div>
                <div className="text-gray-800 font-medium">Managing Partner</div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Create Deals</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Access Cap Tables</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Messaging</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">LP Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Strategy */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium  text-[#0A2A2E] ">Investment Strategy</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Sector Focus:</span>
                <span className="ml-2 text-gray-500">Fintech, SaaS, AI/ML</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Geography Focus:</span>
                <span className="ml-2 text-gray-500">North America, Europe</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Average Check Size:</span>
                <span className="ml-2 text-gray-500">$50,000</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">LP Base Size:</span>
                <span className="ml-2 text-gray-500">25 LPs</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Platform LP Access:</span>
                <span className="ml-2 text-green-500 cursor-pointer hover:underline">Enabled LPs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance & Attestation */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RightsIcon />
            <h2 className="text-xl font-medium  text-[#0A2A2E] ">Compliance & Attestation</h2>
          </div>
          <div className="bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Risk & Regulatory Attestation</span>
                <span className="text-green-500">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Jurisdictional Compliance</span>
                <span className="text-green-500">Acknowledged</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Additional Policies</span>
                <span className="text-gray-500 cursor-pointer hover:underline">compliance-policy.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
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
