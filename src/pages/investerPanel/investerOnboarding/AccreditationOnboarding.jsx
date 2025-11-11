import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const AccreditationOnboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Accreditation (If Applicable)");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    investmentType: "",
    fullName: "",
    residence: "United States",
    accreditation: "",
  });

  

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContinue = () => {
    navigate("/investor-onboarding/agreements");
  };

  const handleSkip = () => {
    navigate("/investor-onboarding/agreements");
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/bank-details");
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    const stepRoutes = {
      "Basic Information": "/investor-onboarding/basic-info",
      "KYC / Identity Verification": "/investor-onboarding/kyc-verification",
      "Bank Details / Payment Setup": "/investor-onboarding/bank-details",
      "Accreditation (If Applicable)": "/investor-onboarding/accreditation",
      "Accept Agreements": "/investor-onboarding/agreements",
      "Final Review": "/investor-onboarding/final-review",
      "Confirmation & Redirect": "/investor-onboarding/confirmation",
    };
    if (stepRoutes[step]) {
      navigate(stepRoutes[step]);
      setIsMobileMenuOpen(false);
    }
  };

  const steps = [
    "Basic Information",
    "KYC / Identity Verification",
    "Bank Details / Payment Setup",
    "Accreditation (If Applicable)",
    "Accept Agreements",
    "Final Review",
    "Confirmation & Redirect",
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 overflow-x-hidden" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-4 sm:px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
            {/* Right Side - Application Title */}
            <div className="flex items-center gap-4 flex-1 justify-center sm:justify-end">
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                <h1 className="text-2xl font-semibold mb-1">
                  <span className="text-[#9889FF]">Investor</span>{" "}
                  <span className="text-[#001D21]">Onboarding</span>
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#01373D] text-[#01373D]"
                aria-label="Open onboarding menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start min-h-[calc(100vh-200px)] px-4 sm:px-6 pb-6 gap-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block bg-[#CEC6FF] rounded-xl p-4 lg:m-4 w-72 shrink-0 h-fit">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < 3; // First 3 steps are completed
              const isActive = activeStep === step;

              return (
                <button
                  key={step}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${
                    isActive ? "bg-[#FFFFFF] text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/70"
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  {isCompleted && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                      <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="font-medium">{step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-6 lg:m-4 w-full">
          <div className="px-2 sm:px-6 lg:px-10 mx-auto">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 4: Accreditation</h1>
            
            {/* Subtitle */}
            <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
              Depending on your country, we may need to verify your investor accreditation status.
            </p>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Investment Type */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  Will you be investing money as an Individual, a Trust, or a Firm or Fund?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="individual"
                      checked={formData.investmentType === "individual"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Individual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="trust"
                      checked={formData.investmentType === "trust"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Trust</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="investmentType"
                      value="firm"
                      checked={formData.investmentType === "firm"}
                      onChange={(e) => handleInputChange("investmentType", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">Firm or Fund</span>
                  </label>
                </div>
              </div>

              {/* Full Legal Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  What is your full legal name?
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="Enter your full legal name"
                />
              </div>

              {/* Legal Place of Residence */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Where is your legal place of residence?
                </label>
                <select
                  value={formData.residence}
                  onChange={(e) => handleInputChange("residence", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Accreditation */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  How are you accredited?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="5m"
                      checked={formData.accreditation === "5m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I have at least $5M in investment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="2.2m-5m"
                      checked={formData.accreditation === "2.2m-5m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $2.2M and $5M in assets</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="1m-2.2m"
                      checked={formData.accreditation === "1m-2.2m"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                        <span className="ml-3 text-[#748A91] font-poppins-custom">I have between $1M and $2.2M in assets</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="income"
                      checked={formData.accreditation === "income"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-5 h-5 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">
                      I have income of $200k (or $300k jointly with spouse) for the past 2 years and expect the same this year
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="series"
                      checked={formData.accreditation === "series"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">
                      I am a Series 7, Series 65 or Series 82 holder and my license is active and in good standing
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="accreditation"
                      value="not-accredited"
                      checked={formData.accreditation === "not-accredited"}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className="w-4 h-4 accent-black border-gray-300"
                    />
                    <span className="ml-3 text-[#748A91] font-poppins-custom">I'm not accredited yet</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center gap-2"
                style={{ border: "1px solid #0A2A2E" }}
              >
                <span>←</span> Previous
              </button>
              <button
                onClick={handleSkip}
                className="px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2"
              >
                Skip <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-[#01373D]">Onboarding Steps</h4>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#01373D] text-[#01373D]"
            aria-label="Close onboarding menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          {steps.map((step, index) => {
            const isCompleted = index < 3;
            const isActive = activeStep === step;

            return (
              <button
                key={step}
                type="button"
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${
                  isActive ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
                }`}
              >
                {isCompleted && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                    <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="font-medium">{step}</span>
              </button>
            );
          })}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default AccreditationOnboarding;

