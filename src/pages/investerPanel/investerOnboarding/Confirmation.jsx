import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";

const Confirmation = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("Confirmation & Redirect");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGoToDashboard = () => {
    // Navigate to investor dashboard
    navigate("/investor-panel/dashboard");
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
    <div className="min-h-screen px-4 sm:px-6 py-6 overflow-x-hidden" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Header */}
      <header className="bg-white rounded-xl mb-6">
        <div className="px-4 sm:px-5 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side - Logo and Brand Name */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-1">
              <img
                src={logoImage}
                alt="Unlocksley Logo"
                className="h-20 w-20 object-contain"
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
        <div className="hidden lg:block bg-[#CEC6FF] rounded-xl p-4 lg:ml-4 w-72 shrink-0 h-fit">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < 7; // All steps are completed
              const isActive = activeStep === step;

              return (
                <button
                  key={step}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 transition-colors flex items-center gap-2 font-poppins-custom ${
                    isActive ? "bg-white text-[#001D21]" : "text-[#001D21] hover:bg-[#ffffff]/70"
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
        <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 lg:p-8 lg:mr-4">
          <div className="mx-auto flex flex-col items-center text-center w-full max-w-3xl">
            {/* Title */}
            <h1 className="text-3xl text-[#0A2A2E] mb-2 font-poppins-custom font-semibold">Onboarding Completion Confirmation</h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#748A91] mb-6 font-poppins-custom">
              You're all set!
            </p>

            {/* Large Green Checkmark with Wavy Outline */}
            <div className="mb-8 relative">
            <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M73.6378 34.1906C72.3581 32.8552 71.0358 31.477 70.5042 30.1941C70.012 29.003 69.9858 27.2409 69.9562 25.3772C69.9103 22.2994 69.8578 18.8147 67.5216 16.4784C65.1853 14.1422 61.6875 14.0897 58.6228 14.0437C56.7591 14.0142 55.0134 13.988 53.8059 13.4958C52.523 12.9642 51.1448 11.6419 49.8094 10.3622C47.6306 8.27531 45.1631 5.90625 42 5.90625C38.8369 5.90625 36.3694 8.27531 34.1906 10.3622C32.8552 11.6419 31.477 12.9642 30.1941 13.4958C29.003 13.988 27.2409 14.0142 25.3772 14.0437C22.2994 14.0897 18.8147 14.1422 16.4784 16.4784C14.1422 18.8147 14.0897 22.3125 14.0437 25.3772C14.0142 27.2409 13.988 28.9866 13.4958 30.1941C12.9642 31.477 11.6419 32.8552 10.3622 34.1906C8.27531 36.3694 5.90625 38.8369 5.90625 42C5.90625 45.1631 8.27531 47.6306 10.3622 49.8094C11.6419 51.1448 12.9642 52.523 13.4958 53.8059C13.988 54.997 14.0142 56.7591 14.0437 58.6228C14.0897 61.7006 14.1422 65.1853 16.4784 67.5216C18.8147 69.8578 22.3125 69.9103 25.3772 69.9562C27.2409 69.9858 28.9866 70.012 30.1941 70.5042C31.477 71.0358 32.8552 72.3581 34.1906 73.6378C36.3694 75.7247 38.8369 78.0938 42 78.0938C45.1631 78.0938 47.6306 75.7247 49.8094 73.6378C51.1448 72.3581 52.523 71.0358 53.8059 70.5042C54.997 70.012 56.7591 69.9858 58.6228 69.9562C61.7006 69.9103 65.1853 69.8578 67.5216 67.5216C69.8578 65.1853 69.9103 61.7006 69.9562 58.6228C69.9858 56.7591 70.012 55.0134 70.5042 53.8059C71.0358 52.523 72.3581 51.1448 73.6378 49.8094C75.7247 47.6306 78.0938 45.1631 78.0938 42C78.0938 38.8369 75.7247 36.3694 73.6378 34.1906ZM70.7962 47.0859C69.2639 48.6806 67.6791 50.3344 66.8587 52.3031C66.0778 54.1866 66.045 56.4112 66.0122 58.5637C65.9761 61.005 65.9367 63.5316 64.7325 64.7391C63.5283 65.9466 60.9984 65.9827 58.5572 66.0187C56.4047 66.0516 54.18 66.0844 52.2966 66.8653C50.3278 67.6791 48.6872 69.2639 47.0761 70.8028C45.3534 72.4434 43.5717 74.1628 41.9934 74.1628C40.4152 74.1628 38.6334 72.4533 36.9075 70.8028C35.3128 69.2705 33.6591 67.6856 31.6903 66.8653C29.8069 66.0844 27.5822 66.0516 25.4297 66.0187C22.9884 65.9827 20.4619 65.9433 19.2544 64.7391C18.0469 63.5348 18.0108 61.005 17.9747 58.5637C17.9419 56.4112 17.9091 54.1866 17.1281 52.3031C16.3144 50.3344 14.7295 48.6938 13.1906 47.0827C11.5533 45.36 9.84375 43.5783 9.84375 42C9.84375 40.4217 11.5533 38.64 13.2038 36.9141C14.7361 35.3194 16.3209 33.6656 17.1413 31.6969C17.9222 29.8134 17.955 27.5887 17.9878 25.4362C18.0239 22.995 18.0633 20.4684 19.2675 19.2609C20.4717 18.0534 23.0016 18.0173 25.4428 17.9812C27.5953 17.9484 29.82 17.9156 31.7034 17.1347C33.6722 16.3209 35.3128 14.7361 36.9239 13.1972C38.64 11.5533 40.4217 9.84375 42 9.84375C43.5783 9.84375 45.36 11.5533 47.0859 13.2038C48.6806 14.7361 50.3344 16.3209 52.3031 17.1413C54.1866 17.9222 56.4112 17.955 58.5637 17.9878C61.005 18.0239 63.5316 18.0633 64.7391 19.2675C65.9466 20.4717 65.9827 23.0016 66.0187 25.4428C66.0516 27.5953 66.0844 29.82 66.8653 31.7034C67.6791 33.6722 69.2639 35.3128 70.8028 36.9239C72.4434 38.6466 74.1628 40.4283 74.1628 42.0066C74.1628 43.5848 72.4467 45.36 70.7962 47.0859ZM56.5163 32.7338C56.8849 33.1029 57.092 33.6033 57.092 34.125C57.092 34.6467 56.8849 35.1471 56.5163 35.5162L38.1413 53.8913C37.7721 54.2599 37.2717 54.467 36.75 54.467C36.2283 54.467 35.7279 54.2599 35.3588 53.8913L27.4838 46.0163C27.136 45.643 26.9467 45.1494 26.9557 44.6394C26.9647 44.1293 27.1713 43.6427 27.532 43.282C27.8927 42.9213 28.3793 42.7147 28.8894 42.7057C29.3994 42.6967 29.893 42.886 30.2662 43.2337L36.75 49.7142L53.7337 32.7338C54.1029 32.3651 54.6033 32.158 55.125 32.158C55.6467 32.158 56.1471 32.3651 56.5163 32.7338Z" fill="#22C55E"/>
            </svg>

            </div>

            {/* Welcome Message */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2A2E] mb-4 font-poppins-custom">
              Welcome Aboard, John.
            </h2>

            {/* Instruction Text */}
            <p className="text-base sm:text-lg text-[#748A91] mb-6 sm:mb-10 font-poppins-custom">
              Start exploring SPVs and manage your investments.
            </p>

            {/* Active Profile Message */}
            <p className="text-base sm:text-lg text-[#001D21] mb-10 font-poppins-custom">
              Your Investor Profile Is Now Active.
            </p>

            {/* Call to Action Button */}
            <button
              onClick={handleGoToDashboard}
              className="w-full sm:w-auto px-8 py-3 bg-[#00F0C3] text-[#001D21] rounded-xl hover:bg-[#00C4B3] transition-colors font-medium font-poppins-custom text-lg"
            >
              Go to My Dashboard
            </button>
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
            const isCompleted = index < 7;
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

export default Confirmation;

