import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const AccreditationOnboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Accreditation (If Applicable)");
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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
            {/* Right Side - Application Title */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="flex flex-col items-end">
                <h1 className="text-2xl font-semibold mb-1">
                  <span className="text-[#9889FF]">Investor</span>{" "}
                  <span className="text-[#001D21]">Onboarding</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-200px)] px-6 pb-6">
        {/* Left Sidebar */}
        <div className="bg-[#CEC6FF] rounded-xl p-4 m-4 h-fit">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < 3; // First 3 steps are completed
              const isActive = activeStep === step;
              
              return (
                <div
                  key={step}
                  className={`${
                    isActive ? "bg-[#FFFFFF]" : ""
                  } rounded-lg px-4 py-3 cursor-pointer transition-colors flex items-center gap-2`}
                  onClick={() => handleStepClick(step)}
                >
                  {isCompleted && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="2" fill="none"/>
                      <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <span className={`${isActive ? "text-[#001D21]" : "text-[#001D21]"} font-medium font-poppins-custom`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-6 m-4">
          <div className="px-10 mx-auto">
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
    </div>
  );
};

export default AccreditationOnboarding;

