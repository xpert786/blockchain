import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import unlockLogo from "../../assets/img/unlocklogo.png";

const SyndicateLayout = () => {
  const [activeStep, setActiveStep] = useState("lead-info");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { id: "lead-info", name: "Lead Info", path: "/syndicate-creation/lead-info" },
    { id: "entity-profile", name: "Entity Profile", path: "/syndicate-creation/entity-profile" },
    { id: "kyb-verification", name: "KYB Verification", path: "/syndicate-creation/kyb-verification" },
    { id: "compliance-attestation", name: "Compliance & Attestation", path: "/syndicate-creation/compliance-attestation" },
    { id: "final-review", name: "Final Review & Submit", path: "/syndicate-creation/final-review" }
  ];

  
  useEffect(() => {
    const currentStep = steps.find(step => location.pathname === step.path);
    if (currentStep) {
      setActiveStep(currentStep.id);
      setMenuOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    navigate(step.path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 sm:px-6 lg:px-8 pt-4">
      {/* Fixed Header */}
      <header className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 bg-white z-50 shadow-sm rounded-lg">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <img
              src={unlockLogo}
              alt="UNLOCKSLEY Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Center - Main title */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl leading-tight">
              <span className="text-[#9889FF]">Syndicated</span>{" "}
              <span className="text-[#001D21]">Account Application</span>
            </h1>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors translate-y-2"
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 mt-10 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="relative ml-auto w-72 max-w-full h-full bg-[#CEC6FF] p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#001D21]">Application Steps</h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/50 text-white hover:bg-white/10 transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeStep === step.id
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-700 hover:bg-white/60 hover:text-gray-900"
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="pt-28 lg:pt-32 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-8 top-32 bottom-8 w-64 h-fit bg-[#CEC6FF] p-4 overflow-y-auto rounded-lg">
          <nav className="space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeStep === step.id
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:bg-white/60 hover:text-gray-800"
                }`}
              >
                {step.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full lg:ml-[19rem] mb-10 lg:mb-6 mt-4 lg:mt-0">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SyndicateLayout;
