import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import unlockLogo from "../../assets/img/unlocklogo.png";

const SyndicateLayout = () => {
  const [activeStep, setActiveStep] = useState("lead-info");
  const [menuOpen, setMenuOpen] = useState(false);
  const [entityType, setEntityType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Additional protection check - verify user is authenticated and is a syndicate
  useEffect(() => {
    const completedStatuses = ["submitted", "approved", "completed", "accepted"];
    const normalizeStatus = (value) => (value || "").toString().toLowerCase().trim();

    const verifySyndicateUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userDataStr = localStorage.getItem("userData");
      
      if (!accessToken) {
        navigate("/login", { replace: true });
        return;
      }

      if (!userDataStr) {
        navigate("/login", { replace: true });
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userDataStr);
      } catch (error) {
        console.error("SyndicateLayout: unable to parse user data:", error);
        navigate("/login", { replace: true });
        return;
      }

      const userRole = userData?.role?.toLowerCase()?.trim();
      const isSyndicate = userRole && (
        userRole === "syndicate" || 
        userRole === "syndicate_manager" || 
        userRole.includes("syndicate")
      );

      if (!isSyndicate) {
        if (userRole === "investor") {
          navigate("/investor-panel/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
        return;
      }

      let status = normalizeStatus(userData?.application_status);
      let isCompleted =
        !!userData?.syndicate_profile_completed || completedStatuses.includes(status);

      if (!isCompleted) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
          const finalUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;

          const response = await fetch(finalUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          });

          if (response.ok) {
            const data = await response.json();
            const latestStatus = normalizeStatus(
              data?.application_status ||
              data?.profile?.application_status ||
              data?.step_data?.application_status
            );

            if (latestStatus) {
              status = latestStatus;
              if (completedStatuses.includes(latestStatus)) {
                isCompleted = true;
                const updatedUser = {
                  ...userData,
                  application_status: latestStatus,
                  syndicate_profile_completed: true
                };
                localStorage.setItem("userData", JSON.stringify(updatedUser));
              }
            }
          }
        } catch (error) {
          console.error("SyndicateLayout: failed to fetch syndicate status:", error);
        }
      }

      if (isCompleted) {
        navigate("/manager-panel/dashboard", { replace: true });
      }
    };

    verifySyndicateUser();
  }, [navigate]);

  // Fetch entity type from step3a to determine if Beneficial Owners step should be shown
  useEffect(() => {
    const fetchEntityType = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const step3aUrl = `${API_URL.replace(/\/$/, "")}/syndicate/step3a/`;

        const response = await axios.get(step3aUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("=== Fetching Entity Type for Sidebar ===");
        console.log("Step3a response:", response.data);

        if (response.data && response.status === 200) {
          const data = response.data;
          const nestedData = data.data || {};
          const stepData = data.step_data || {};
          const profile = data.profile || {};
          
          // Get entity type from various possible locations
          const entityTypeValue = nestedData.entity_type || 
                                 stepData.entity_type || 
                                 profile.entity_type || 
                                 data.entity_type;
          
          if (entityTypeValue) {
            const normalizedType = String(entityTypeValue).toLowerCase().trim();
            setEntityType(normalizedType);
            console.log("✅ Entity type fetched and normalized:", normalizedType);
            console.log("✅ Will hide beneficial-owners:", normalizedType === "individual");
          } else {
            console.log("⚠️ No entity type found in response");
          }
        }
      } catch (err) {
        // If 404 or error, entity type not set yet - that's fine
        if (err.response?.status === 404) {
          console.log("No step3a data found yet - beneficial owners will show by default");
        } else {
          console.error("Error fetching entity type:", err);
        }
      }
    };

    fetchEntityType();
    
    // Also listen for location changes to refetch when navigating to/from kyb-verification
    const interval = setInterval(() => {
      if (location.pathname.includes('kyb-verification')) {
        fetchEntityType();
      }
    }, 2000); // Check every 2 seconds when on kyb-verification page

    return () => clearInterval(interval);
  }, [location.pathname]);

  // Define all steps
  const allSteps = [
    { id: "lead-info", name: "Lead Info", path: "/syndicate-creation/lead-info" },
    { id: "entity-profile", name: "Syndicate Profile", path: "/syndicate-creation/entity-profile" },
    { id: "kyb-verification", name: "KYB Verification", path: "/syndicate-creation/kyb-verification" },
    { id: "beneficial-owners", name: "Beneficial Owners (UBOs)", path: "/syndicate-creation/beneficial-owners" },
    { id: "compliance-attestation", name: "Compliance & Attestation", path: "/syndicate-creation/compliance-attestation" },
    { id: "final-review", name: "Final Review & Submit", path: "/syndicate-creation/final-review" }
  ];

  // Filter steps: hide beneficial-owners if entity type is "individual"
  const steps = allSteps.filter(step => {
    if (step.id === "beneficial-owners") {
      // Only show if entity type is NOT "individual"
      // If entityType is null (not fetched yet), show it by default
      if (entityType === null) {
        return true; // Show by default until we know the entity type
      }
      const isIndividual = entityType === "individual";
      console.log("🔍 Filtering beneficial-owners step. Entity type:", entityType, "Is Individual:", isIndividual, "Will show:", !isIndividual);
      return !isIndividual;
    }
    return true;
  });

  const handleLogout = () => {
    ["accessToken", "refreshToken", "userData", "tempUserData"].forEach((key) => localStorage.removeItem(key));
    navigate("/login", { replace: true });
  };

  const LogoutButton = ({ className = "" }) => (
    <button
      type="button"
      onClick={handleLogout}
      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-transparent px-4 py-2 text-sm font-medium text-black transition hover:bg-black/10 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.25 4.16666H15C16.3807 4.16666 17.5 5.28595 17.5 6.66666V13.3333C17.5 14.714 16.3807 15.8333 15 15.8333H11.25"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33301 10H12.4997M3.33301 10L6.24967 6.66666M3.33301 10L6.24967 13.3333"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Logout
    </button>
  );

  
  useEffect(() => {
    const currentStep = steps.find(step => location.pathname === step.path);
    if (currentStep) {
      setActiveStep(currentStep.id);
      setMenuOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, steps]);

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    navigate(step.path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 sm:px-6 lg:px-8 pt-4">
      {/* Fixed Header */}
      <header className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 bg-white z-50 shadow-sm rounded-lg">
        <div className="px-3 sm:px-5 py-3 flex items-center gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <img
              src={unlockLogo}
              alt="UNLOCKSLEY Logo"
              className="h-20 w-20 object-contain"
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
            <LogoutButton />
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
          <LogoutButton />
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
