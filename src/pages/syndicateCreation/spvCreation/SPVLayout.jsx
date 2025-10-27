import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import unlockLogo from "../../../assets/img/unlocklogo.png";

const SPVLayout = () => {
  const [activeStep, setActiveStep] = useState("step1");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { id: "step1", name: "Deal Information", path: "/syndicate-creation/spv-creation/step1" },
    { id: "step2", name: "Terms", path: "/syndicate-creation/spv-creation/step2" },
    { id: "step3", name: "Adviser & Legal Structure", path: "/syndicate-creation/spv-creation/step3" },
    { id: "step4", name: "Fundraising & Jurisdiction selection", path: "/syndicate-creation/spv-creation/step4" },
    { id: "step5", name: "Invite LPs", path: "/syndicate-creation/spv-creation/step5" },
    { id: "step6", name: "Deal Discription", path: "/syndicate-creation/spv-creation/step6" },
    { id: "step7", name: "Final Summary & Review", path: "/syndicate-creation/spv-creation/step7" }
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
                <span className="text-[#9889FF]">SPV</span>{" "}
                <span className="text-[#001D21]">Creation Flow</span>
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

export default SPVLayout;
