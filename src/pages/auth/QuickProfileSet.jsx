import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";

const QuickProfileSet = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyndicate, setIsSyndicate] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  const [agreements, setAgreements] = useState({
    acknowledge: false,
    termsAndPrivacy: false,
    cookies: false,
  });

  // Check user role FIRST - redirect syndicate users away immediately
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      // First try localStorage
      let userData = JSON.parse(localStorage.getItem("userData") || "{}");
      let userRole = (userData?.role || "").toLowerCase();
      
      console.log("📋 QuickProfileSet: Checking role from localStorage:", userRole);
      
      // If role not found, try registration status API
      if (!userRole) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
          const statusUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/get_registration_status/`;
          const accessToken = localStorage.getItem("accessToken");
          
          if (accessToken) {
            const resp = await axios.get(statusUrl, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const status = resp.data;
            console.log("📋 QuickProfileSet: Registration status response:", status);
            
            // Try to get role from status response
            userRole = (status?.role || status?.user?.role || status?.user_role || "").toLowerCase();
            console.log("📋 QuickProfileSet: Role from API:", userRole);
            
            // Update localStorage if role found
            if (userRole) {
              userData.role = userRole;
              localStorage.setItem("userData", JSON.stringify(userData));
            }
          }
        } catch (e) {
          console.warn("Could not fetch role from registration status:", e);
        }
      }
      
      // Check if syndicate user
      const isSyndicateUser = userRole === "syndicate" || userRole.includes("syndicate");
      setIsSyndicate(isSyndicateUser);
      setRoleChecked(true);
      
      // Redirect syndicate users immediately
      if (isSyndicateUser) {
        console.log("⚠️ Syndicate user detected on QuickProfileSet - redirecting to syndicate creation");
        navigate("/syndicate-creation/lead-info", { replace: true });
        return;
      }
      
      console.log("✅ User is investor, proceeding with investor progress fetch");
    };
    
    checkRoleAndRedirect();
  }, [navigate]);

  // 🔥 Fetch Investor Progress API - ONLY for investors, AFTER role check
  useEffect(() => {
    // Don't fetch if role not checked yet or if user is syndicate
    if (!roleChecked || isSyndicate) {
      if (isSyndicate) {
        setLoading(false);
      }
      return;
    }

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // No token: redirect to login
          setError("Not authenticated. Please sign in.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const res = await fetch("http://168.231.121.7/blockchain-backend/api/investor-progress/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Investor progress API error:", data);
          // handle invalid token specifically
          if (data?.code === "token_not_valid" || (data?.detail && data.detail.includes("token_not_valid"))) {
            // clear tokens and redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setError("Session expired. Please sign in again.");
            navigate("/login");
            return;
          }
          setError(JSON.stringify(data));
          setProgressData(null);
        } else {
          console.log("API Response:", data);
          setProgressData(data);
        }
      } catch (error) {
        console.error("API Error =", error);
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [roleChecked, isSyndicate, navigate]);

  const handleCheckboxChange = (name) => {
    setAgreements({ ...agreements, [name]: !agreements[name] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("QuickProfileSet: handleSubmit", agreements);
    if (agreements.acknowledge && agreements.termsAndPrivacy && agreements.cookies) {
      setError(null);
      // navigate to investor onboarding step 1 (BasicInfo)
      console.log("QuickProfileSet: navigating to investor onboarding step 1");
      navigate("/investor-onboarding/basic-info");
    } else {
      setError("Please accept all terms and conditions to continue.");
    }
  };

  // Don't render if syndicate user (should be redirected)
  if (isSyndicate) {
    return <div className="text-center p-6">Redirecting...</div>;
  }

  if (loading || !roleChecked) {
    return <div className="text-center p-6">Loading...</div>;
  }

const documents = progressData
  ? [
      { label: "Email verified", value: progressData?.steps?.email_verified },
      { label: "Phone verified", value: progressData?.steps?.phone_verified },
      { label: "Accredited verified", value: progressData?.steps?.accredited_verified },
      { label: "KYC completed", value: progressData?.steps?.kyc_completed },
      { label: "Tax forms completed", value: progressData?.steps?.tax_forms_completed },
    ]
  : [];


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#001D21] mb-6 text-start">
            {progressData?.status_message || "You're almost ready!"}
          </h1>

          {/* Document Status */}
          <div className="space-y-3 mb-6">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#F4F6F5] rounded-lg border border-[#0A2A2E]/50"
              >
                    <span
                  className={`text-sm font-semibold ${
                    doc.value ? "text-green-600" : "text-red-500"
                  }`}
                >
                {doc.value ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.109 15L11.4423 3.33332C11.297 3.07682 11.0862 2.86347 10.8314 2.71504C10.5767 2.56661 10.2872 2.4884 9.99234 2.4884C9.69752 2.4884 9.40797 2.56661 9.15324 2.71504C8.8985 2.86347 8.6877 3.07682 8.54234 3.33332L1.87567 15C1.72874 15.2545 1.6517 15.5432 1.65235 15.8371C1.653 16.1309 1.73132 16.4194 1.87938 16.6732C2.02744 16.927 2.23996 17.1371 2.49542 17.2823C2.75088 17.4275 3.04018 17.5026 3.33401 17.5H16.6673C16.9598 17.4997 17.2469 17.4225 17.5001 17.2761C17.7532 17.1297 17.9634 16.9192 18.1094 16.6659C18.2555 16.4126 18.3324 16.1253 18.3323 15.8329C18.3322 15.5405 18.2552 15.2532 18.109 15Z" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 7.5V10.8333" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 14.167H10.01" stroke="#ED1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                }
                </span>
                <span className="text-[#0A2A2E] text-sm">{doc.label}</span>

            
              </div>
            ))}
          </div>

          {/* Agreement Checkboxes */}
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acknowledge"
                checked={agreements.acknowledge}
                onChange={() => handleCheckboxChange("acknowledge")}
              />
              <label htmlFor="acknowledge">
                I acknowledge that I have received and understand the above documents.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsAndPrivacy"
                checked={agreements.termsAndPrivacy}
                onChange={() => handleCheckboxChange("termsAndPrivacy")}
              />
              <label htmlFor="termsAndPrivacy">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="cookies"
                checked={agreements.cookies}
                onChange={() => handleCheckboxChange("cookies")}
              />
              <label htmlFor="cookies">I consent to cookies.</label>
            </div>

            <button
              type="submit"
              className="bg-[#00F0C3] px-6 py-2 rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickProfileSet;
