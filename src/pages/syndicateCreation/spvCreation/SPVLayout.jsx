import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import unlockLogo from "../../../assets/img/unlocklogo.png";

const SPVLayout = () => {
  const [activeStep, setActiveStep] = useState("step1");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessError, setAccessError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check user authentication, role, and SPV creation access (is_active && is_staff)
  useEffect(() => {
    const checkAccess = async () => {
      setIsCheckingAccess(true);
      setAccessDenied(false);
      setAccessError("");

      try {
        const accessToken = localStorage.getItem("accessToken");
        const userDataStr = localStorage.getItem("userData");
        
        if (!accessToken) {
          console.log("⚠️ SPVLayout: No access token, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        if (!userDataStr) {
          console.log("⚠️ SPVLayout: No user data found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        let userData;
        try {
          userData = JSON.parse(userDataStr);
        } catch (error) {
          console.error("⚠️ SPVLayout: Error parsing user data:", error);
          navigate("/login", { replace: true });
          return;
        }

        // Check user role
        const userRole = userData?.role?.toLowerCase()?.trim();
        const isSyndicate = userRole && (
          userRole === "syndicate" || 
          userRole === "syndicate_manager" || 
          userRole.includes("syndicate")
        );
        
        if (!isSyndicate) {
          console.log("⚠️ SPVLayout: User is not a syndicate, redirecting");
          if (userRole === "investor") {
            navigate("/investor-panel/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
          return;
        }

        // Check user status from API (is_active && is_staff)
        const userId = userData?.user_id || userData?.id;
        if (!userId) {
          console.log("⚠️ SPVLayout: User ID not found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const userUrl = `${API_URL.replace(/\/$/, "")}/users/${userId}/`;

        console.log("=== SPVLayout: Checking User Status for SPV Creation Access ===");
        console.log("API URL:", userUrl);
        console.log("User ID:", userId);

        const response = await axios.get(userUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("User status response:", response.data);

        if (response.data && response.status === 200) {
          const user = response.data;
          const isActive = user.is_active === true;
          const isStaff = user.is_staff === true;

          console.log("User status check:", {
            isActive,
            isStaff,
            bothRequired: isActive && isStaff
          });

          // Check if both is_active and is_staff are true
          if (isActive && isStaff) {
            console.log("✅ User has access to SPV creation");
            setAccessDenied(false);
            setIsCheckingAccess(false);
          } else {
            // Deny access
            console.log("❌ Access denied - user does not have required permissions");
            let errorMsg = "Access denied. ";
            if (!isActive && !isStaff) {
              errorMsg += "Your account is not active and you are not a staff member. Please contact support.";
            } else if (!isActive) {
              errorMsg += "Your account is not active. Please contact support to activate your account.";
            } else if (!isStaff) {
              errorMsg += "You are not authorized to create deals. Please contact support to get staff access.";
            }
            setAccessError(errorMsg);
            setAccessDenied(true);
            setIsCheckingAccess(false);
          }
        } else {
          setAccessError("Failed to verify user status. Please try again.");
          setAccessDenied(true);
          setIsCheckingAccess(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to verify access. Please try again.";
        setAccessError(errorMsg);
        setAccessDenied(true);
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [navigate]);

  const steps = [
    { id: "step1", name: "Deal Information", path: "/syndicate-creation/spv-creation/step1" },
    { id: "step2", name: "Terms", path: "/syndicate-creation/spv-creation/step2" },
    { id: "step3", name: "Adviser & Legal Structure", path: "/syndicate-creation/spv-creation/step3" },
    { id: "step4", name: "Fundraising & Jurisdiction selection", path: "/syndicate-creation/spv-creation/step4" },
    { id: "step5", name: "Invite LPs", path: "/syndicate-creation/spv-creation/step5" },
    { id: "step7", name: "Final Summary & Review", path: "/syndicate-creation/spv-creation/step7" }
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

  // Show loading state while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <svg className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied message
  if (accessDenied) {
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
                <span className="text-[#9889FF]">SPV</span>{" "}
                <span className="text-[#001D21]">Creation Flow</span>
              </h1>
            </div>
          </div>
        </header>

        {/* Access Denied Message */}
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 pt-28">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-red-600 mb-4">{accessError}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/syndicate-creation/success")}
                    className="bg-[#00F0C3] hover:bg-[#00C4B3] text-black px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors border border-gray-300"
                  >
                    Go To Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-[#9889FF]">SPV</span>{" "}
              <span className="text-[#001D21]">Creation Flow</span>
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
              <h2 className="text-lg font-semibold text-[#001D21]">Creation Steps</h2>
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

export default SPVLayout;
