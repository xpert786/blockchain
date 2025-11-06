import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const BasicInfo = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    country: "United States",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContinue = () => {
    // Navigate to next step
    navigate("/investor-onboarding/kyc-verification");
  };

  const handlePrevious = () => {
    // Navigate back or disable if first step
    navigate("/investor-panel/welcome");
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
    // Navigate based on step
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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F4F6F5'  }}>
      {/* Header */}
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
            {/* Right Side - Application Title and Information */}
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
        <div className=" bg-[#CEC6FF] rounded-xl p-4 m-4 h-fit">
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step}
                className={`${
                  activeStep === step ? "bg-[#FFFFFF]" : ""
                } rounded-lg px-4 py-3 cursor-pointer transition-colors`}
                onClick={() => handleStepClick(step)}
              >
                <span className={`${activeStep === step ? "text-[#001D21]" : "text-[#001D21]"} font-medium font-poppins-custom`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-6 m-4">
          <div className="px-10 mx-auto">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 1: Basic Info</h1>
            
            {/* Subtitle */}
            <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
              Tell us a bit about yourself to get started with your investment journey.
            </p>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                  style={{ border: "0.5px solid #0A2A2E" }}
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="w-32">
                    <div className="bg-[#F4F6F5] rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#9889FF] focus-within:border-transparent" style={{ border: "0.5px solid #0A2A2E" }}>
                      <span className="text-2xl">🇺🇸</span>
                      <select
                        value={formData.phoneCode}
                        onChange={(e) => handleInputChange("phoneCode", e.target.value)}
                        className="flex-1  outline-none bg-transparent text-[#0A2A2E] font-poppins-custom cursor-pointer"
                      >
                        <option value="+1">+1 US</option>
                        <option value="+44">+44 UK</option>
                        <option value="+33">+33 FR</option>
                        <option value="+49">+49 DE</option>
                      </select>
                    </div>
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="000 - 000 - 0000"
                    />
                  </div>
                </div>
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Country of Residence <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
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
                onClick={handleContinue}
                className="px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2"
              >
                Continue <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;

