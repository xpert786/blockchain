import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const KYCVerification = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("KYC / Identity Verification");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    idFile: null,
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange("idFile", file);
    }
  };

  const handleContinue = () => {
    navigate("/investor-onboarding/bank-details");
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/basic-info");
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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-5 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            {/* Right Side - Application Title */}
            <div className="flex items-center justify-center md:justify-end gap-4 flex-1">
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <h1 className="text-xl sm:text-2xl font-semibold mb-1">
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
      <div className="flex flex-col lg:flex-row items-start gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-72 shrink-0 bg-[#CEC6FF] rounded-xl p-6 ml-0 lg:ml-4">
          <div className="space-y-2">
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => handleStepClick(step)}
                className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom ${
                  activeStep === step ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/60"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 lg:p-8 lg:mr-4">
          <div className="mx-auto w-full max-w-3xl">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Step 2: KYC / Identity Verification</h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-4 font-poppins-custom text-center sm:text-left">
              Help us verify your identity to meet compliance and protect your investment account.
            </p>

            {/* Accepted IDs Highlight */}
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 mb-8 inline-block text-center sm:text-left">
              <span className="text-sm text-[#0A2A2E] font-poppins-custom">
                Accepted: Passport, Driver's License, etc.
              </span>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
              {/* Upload Government-Issued ID */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom flex items-center gap-2">
                  Upload Government-Issued ID <span className="text-red-500">*</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-help">
                    <circle cx="8" cy="8" r="7" stroke="#748A91" strokeWidth="1.5" fill="none"/>
                    <path d="M8 5V8M8 11H8.01" stroke="#748A91" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </label>
                <div className="border-2 bg-[#F4F6F5] rounded-lg p-8 text-center cursor-pointer hover:border-[#9889FF] transition-colors" style={{ border: "0.5px solid #0A2A2E" }}>
                  <input
                    type="file"
                    id="idUpload"
                    onChange={handleFileChange}
                    accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label htmlFor="idUpload" className="cursor-pointer">
                    <div className="mb-4 flex justify-center"> 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 8L12 3L7 8" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3V15" stroke="#01373D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    <p className="text-[#748A91] font-poppins-custom mb-2">
                    Drag and drop or click to upload pitch deck (PDF, PPT, PPTX)
                    </p>
                    <p className="text-[#748A91] font-poppins-custom mb-2">Front and back in a single file, max 5MB</p>
                  </label>
                </div>
                {formData.idFile && (
                  <p className="text-sm text-[#748A91] mt-2 font-poppins-custom">
                    Selected: {formData.idFile.name}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex">
                    <select
                      value={formData.birthMonth}
                      onChange={(e) => handleInputChange("birthMonth", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <select
                      value={formData.birthDay}
                      onChange={(e) => handleInputChange("birthDay", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex">
                    <select
                      value={formData.birthYear}
                      onChange={(e) => handleInputChange("birthYear", e.target.value)}
                      className="w-fit bg-[#F4F6F5] text-[#748A91] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-base font-medium text-[#0A2A2E] mb-4 font-poppins-custom">
                  Residential Address<span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      Street Address:
                    </label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="e.g., 123 Main Street"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      City:
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                      placeholder="e.g., New York"
                    />
                  </div>

                  {/* State / Province and ZIP / Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                        State / Province:
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                        style={{ border: "0.5px solid #0A2A2E" }}
                        placeholder="e.g., California"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                        ZIP / Postal Code:
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                        style={{ border: "0.5px solid #0A2A2E" }}
                        placeholder="e.g., 10001"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-base font-medium text-[#0A2A2E] mb-2 font-poppins-custom">
                      Country:
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full bg-[#F4F6F5] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9889FF] focus:border-transparent font-poppins-custom"
                      style={{ border: "0.5px solid #0A2A2E" }}
                    >
                      <option value="">Select your country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-6 mt-12">
              <button
                onClick={handlePrevious}
                className="w-full sm:w-auto px-6 py-3 bg-[#F4F6F5] text-[#001D21] rounded-xl hover:bg-gray-300 transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2"
                style={{ border: "1px solid #0A2A2E" }}
              >
                <span>←</span> Previous
              </button>
              <button
                onClick={handleContinue}
                className="w-full sm:w-auto px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center justify-center gap-2"
              >
                Continue <span>→</span>
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
        <div className="p-4 space-y-2 overflow-y-auto">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              className={`w-full text-left rounded-lg px-4 py-3 transition-colors font-poppins-custom ${
                activeStep === step ? "bg-[#00F0C3]/20 text-[#001D21]" : "text-[#001D21] hover:bg-[#F4F6F5]"
              }`}
            >
              {step}
            </button>
          ))}
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

export default KYCVerification;

