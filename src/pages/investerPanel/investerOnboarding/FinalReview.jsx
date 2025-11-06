import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const FinalReview = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Final Review");

  const handleSubmit = () => {
    navigate("/investor-onboarding/confirmation");
  };

  const handlePrevious = () => {
    navigate("/investor-onboarding/agreements");
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
              const isCompleted = index < 5; // First 5 steps are completed
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
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom">Final Review & Submit</h1>
            
            {/* Subtitle */}
            <p className="text-sm text-[#748A91] mb-8 font-poppins-custom">
              Please review all information before submitting your syndicate application for platform compliance review.
            </p>

            {/* Review Sections */}
            <div className="space-y-6">
              {/* Lead Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                  <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Lead Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-1 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Full Name:</span>
                    <span className="text-[#748A91] font-poppins-custom">John Doe</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Email Address:</span>
                    <span className="text-[#748A91] font-poppins-custom">john.doe@email.com</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Country:</span>
                    <span className="text-[#748A91] font-poppins-custom">United States</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Phone Number:</span>
                    <span className="text-[#748A91] font-poppins-custom">+1 555-123-4567</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Role:</span>
                    <span className="text-[#748A91] font-poppins-custom">Investor</span>
                  </div>
                </div>
              </div>

              {/* KYC Details Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                  <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">KYC Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-1 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Date of Birth:</span>
                    <span className="text-[#748A91] font-poppins-custom">01/01/1990</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">ID Uploaded:</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#748A91] font-poppins-custom">Passport.pdf</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Address:</span>
                    <span className="text-[#748A91] font-poppins-custom">123 Main Street, California</span>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                  <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Bank Details</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Bank Name:</span>
                    <span className="text-[#748A91] font-poppins-custom">Chase Bank</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Account Number:</span>
                    <span className="text-[#748A91] font-poppins-custom">****5678</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Preferred Currency:</span>
                    <span className="text-[#748A91] font-poppins-custom">USD</span>
                  </div>
                </div>
              </div>

              {/* Accreditation (Optional) Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                  <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Accreditation (Optional)</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Accredited Investor:</span>
                    <span className="text-[#748A91] font-poppins-custom">Yes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Proof Document:</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#748A91] font-poppins-custom">NetWorth.pdf</span>
                  </div>
                  <div className="flex">
                    <span className="text-[#0A2A2E] font-poppins-custom mr-2">Preferred Currency:</span>
                    <span className="text-[#748A91] font-poppins-custom">USD</span>
                  </div>
                </div>
              </div>

              {/* Agreements Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">Agreements</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
                  <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#0A2A2E] font-poppins-custom">Terms & Conditions</span>
                  </div>
                  <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#0A2A2E] font-poppins-custom">Risk Disclosure</span>
                  </div>
                  <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#0A2A2E] font-poppins-custom">Privacy Policy</span>
                  </div>
                  <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.84533 10.4267L11.1787 6.42667L10.1547 5.57333L7.288 9.01267L5.80467 7.52867L4.862 8.47133L6.862 10.4713L7.378 10.9873L7.84533 10.4267Z" fill="#22C55E"/>
                    </svg>
                    <span className="text-[#0A2A2E] font-poppins-custom">Confirmation of True Information</span>
                  </div>
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
                onClick={handleSubmit}
                className="px-6 py-3 bg-[#00F0C3] text-black rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom flex items-center gap-2"
              >
                Submit for Review
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 2.5L9.16667 10.8333M17.5 2.5L12.5 17.5L9.16667 10.8333M17.5 2.5L2.5 7.5L9.16667 10.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalReview;

