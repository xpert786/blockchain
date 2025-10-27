import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {RightsIcon} from "../../components/Icons";
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
    }
  }, [location.pathname]);

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    navigate(step.path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen px-8 pt-4" style={{ backgroundColor: '#F4F6F5' }}>
      {/* Fixed Header */}
      <header className="fixed top-4 left-8 right-8 bg-white z-50 shadow-sm rounded-lg">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-3">
              <img
                src={unlockLogo}
                alt="UNLOCKSLEY Logo"
                className="w-25 h-15 object-contain"
              />
            </div>

            {/* Center - Main title */}
            <div className="text-center">
              <h1 className="text-2xl ">
                <span className="text-[#9889FF]">Syndicated</span>{" "}
                <span className="text-[#001D21]">Account Application</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-28">
        {/* Fixed Sidebar */}
        <aside className="fixed left-8 top-32 bottom-8 w-64 h-fit bg-[#CEC6FF] p-4 overflow-y-auto rounded-lg">
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
        <main className="flex-1 ml-70 mb-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SyndicateLayout;
