import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    acknowledge: false,
    termsAndPrivacy: false,
    cookies: false,
  });
  const [error, setError] = useState("");
  const [roleChecked, setRoleChecked] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Check user role on mount - redirect syndicate users immediately
  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      // First try localStorage (should have role from verify_code response)
      const rawUserData = localStorage.getItem("userData");
      console.log("📋 TermsOfService: Raw localStorage userData string:", rawUserData);

      let userData = {};
      try {
        userData = JSON.parse(rawUserData || "{}");
      } catch (e) {
        console.error("📋 TermsOfService: Error parsing userData:", e);
        userData = {};
      }

      let detectedRole = (userData?.role || "").toLowerCase().trim();

      console.log("📋 TermsOfService: Checking role from localStorage:", detectedRole);
      console.log("📋 TermsOfService: Full userData object:", JSON.stringify(userData, null, 2));
      console.log("📋 TermsOfService: userData.role value:", userData?.role);
      console.log("📋 TermsOfService: userData.role type:", typeof userData?.role);

      // If role not found in localStorage, try user API endpoint
      if (!detectedRole || detectedRole === "") {
        console.log("📋 TermsOfService: Role not found in localStorage, trying user API...");
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
          const accessToken = localStorage.getItem("accessToken");

          if (accessToken) {
            // Get user_id from localStorage or try to extract from token
            let userId = userData?.user_id || userData?.id;

            // If no user_id, try to extract from token
            if (!userId) {
              try {
                const parts = accessToken.split('.');
                if (parts.length >= 2) {
                  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                  userId = payload?.user_id || payload?.user || payload?.sub;
                }
              } catch (e) {
                console.warn("Could not extract user_id from token:", e);
              }
            }

            if (userId) {
              // Use the user API endpoint to get role
              const userUrl = `${API_URL.replace(/\/$/, "")}/users/${userId}/`;
              console.log("📋 TermsOfService: Fetching user from:", userUrl);

              const resp = await axios.get(userUrl, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              const userInfo = resp.data;
              console.log("📋 TermsOfService: User API response:", JSON.stringify(userInfo, null, 2));

              // Get role from user response
              detectedRole = (userInfo?.role || "").toLowerCase().trim();
              console.log("📋 TermsOfService: Role from user API:", detectedRole);

              // Update localStorage if role found
              if (detectedRole) {
                userData.role = detectedRole;
                userData.user_id = userId;
                // Also save other user info
                if (userInfo.email) userData.email = userInfo.email;
                if (userInfo.username) userData.username = userInfo.username;
                localStorage.setItem("userData", JSON.stringify(userData));
                console.log("✅ TermsOfService: Saved role to localStorage from user API:", detectedRole);
              } else {
                console.warn("⚠️ TermsOfService: Role not found in user API response");
              }
            } else {
              console.warn("⚠️ TermsOfService: No user_id found to fetch user data");
            }
          } else {
            console.warn("⚠️ TermsOfService: No access token found");
          }
        } catch (e) {
          console.warn("Could not fetch role from user API:", e);
          console.warn("Error details:", e.response?.data || e.message);
        }
      } else {
        console.log("✅ TermsOfService: Role found in localStorage, using it:", detectedRole);
      }

      // Store role in state for use in handleSubmit
      setUserRole(detectedRole);
      setRoleChecked(true);

      console.log("📋 TermsOfService: Final detected role:", detectedRole);
      console.log("✅ TermsOfService: Showing terms page for user to accept (role will be checked on submit)");
    };

    checkRoleAndRedirect();
  }, [navigate]);

  // Get user role from API or localStorage (for submit handler)
  const getUserRole = async () => {
    // First try localStorage
    let userData = JSON.parse(localStorage.getItem("userData") || "{}");
    let userRole = (userData?.role || "").toLowerCase();

    // If role not found, try registration status API
    if (!userRole) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const statusUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/get_registration_status/`;
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          const resp = await axios.get(statusUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const status = resp.data;

          // Try to get role from status response
          userRole = (status?.role || status?.user?.role || status?.user_role || "").toLowerCase();

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

    return userRole;
  };

  const handleCheckboxChange = (name) => {
    setAgreements({
      ...agreements,
      [name]: !agreements[name],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (agreements.acknowledge && agreements.termsAndPrivacy && agreements.cookies) {
      console.log("All agreements accepted:", agreements);

      // Use role from state (already checked on mount)
      let finalRole = userRole;

      // If role not in state, try to get it again
      if (!finalRole || finalRole === "") {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        finalRole = (userData?.role || "").toLowerCase().trim();

        // If still not found, try user API endpoint
        if (!finalRole || finalRole === "") {
          try {
            const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
              // Get user_id from localStorage or extract from token
              let userId = userData?.user_id || userData?.id;

              if (!userId) {
                try {
                  const parts = accessToken.split('.');
                  if (parts.length >= 2) {
                    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                    userId = payload?.user_id || payload?.user || payload?.sub;
                  }
                } catch (e) {
                  console.warn("Could not extract user_id from token:", e);
                }
              }

              if (userId) {
                // Use the user API endpoint to get role
                const userUrl = `${API_URL.replace(/\/$/, "")}/users/${userId}/`;
                const resp = await axios.get(userUrl, {
                  headers: { Authorization: `Bearer ${accessToken}` }
                });
                const userInfo = resp.data;
                finalRole = (userInfo?.role || "").toLowerCase().trim();

                // Update localStorage if role found
                if (finalRole) {
                  userData.role = finalRole;
                  localStorage.setItem("userData", JSON.stringify(userData));
                }
              }
            }
          } catch (e) {
            console.warn("Could not fetch role in handleSubmit:", e);
          }
        }
      }

      console.log("📋 TermsOfService handleSubmit - Final role:", finalRole);
      console.log("📋 TermsOfService handleSubmit - Role check:", {
        isSyndicate: finalRole === "syndicate" || finalRole.includes("syndicate"),
        roleValue: finalRole
      });

      if (finalRole === "syndicate" || finalRole.includes("syndicate")) {
        // Syndicate users go to syndicate creation
        console.log("✅ Redirecting syndicate user to syndicate creation");
        navigate("/syndicate-creation/lead-info", { replace: true });
      } else {
        // Investors go to quick profile set
        console.log("✅ Redirecting investor to quick profile set");
        navigate("/quick-profile-set");
      }
    } else {
      setError("Please accept all terms and conditions to continue.");
    }
  };

  const documents = [
    "General Terms of Services",
    "Investing Banking Terms",
    "E-Sign Consent",
    "InfraFi Deposit Placement and Custodial Agreement",
    "Cookie Consent Preferences"
  ];

  // Don't render if role not checked yet (prevents flash of content)
  if (!roleChecked) {
    return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl p-6">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#001D21] mb-6 text-start">Terms Of Service</h1>

          {/* Document List */}
          <div className="space-y-3 mb-6">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F4F6F5] rounded-lg !border-[0.5px] border-[#0A2A2E]">
                <span className="text-[#0A2A2E] font-poppins-custom text-sm">{doc}</span>
                <button className="bg-[#00F0C3] text-[#0A2A2E] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 text-sm cursor-pointer">
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Checkbox Options */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Acknowledge Documents */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acknowledge"
                checked={agreements.acknowledge}
                onChange={() => handleCheckboxChange("acknowledge")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="acknowledge" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I acknowledge that i have received, read, and understand that above documents and i agree to their terms.
              </label>
            </div>

            {/* Terms and Privacy Policy */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="termsAndPrivacy"
                checked={agreements.termsAndPrivacy}
                onChange={() => handleCheckboxChange("termsAndPrivacy")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="termsAndPrivacy" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I agree to the <span className="text-[#9889FF] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#9889FF] cursor-pointer hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Cookie Consent */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="cookies"
                checked={agreements.cookies}
                onChange={() => handleCheckboxChange("cookies")}
                className="mt-1 w-5 h-5 text-[#00F0C3] bg-gray-100 border-gray-300 rounded focus:ring-[#00F0C3] focus:ring-2"
              />
              <label htmlFor="cookies" className="text-[#0A2A2E] font-poppins-custom text-sm">
                I consent to cookies from this site.
              </label>
            </div>

            {/* Submit Button */}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex justify-start pt-4">
              <button
                type="submit"
                className="bg-[#00F0C3] text-[#0A2A2E] font-semibold py-2.5 px-6 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
