import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Correcting paths/typos for assets. Assuming 'bg-images.png' and others exist under src/assets/img.
import bgImage from "/src/assets/img/bg-images.png";
import logo from "/src/assets/img/logo.png";
import loginLogo from "/src/assets/img/loginlogo.png"; 
import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // NOTE: For live environments, ensure VITE_API_URL is correctly defined and secured.
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("API_URL:", API_URL);
      
      const finalUrl = `${API_URL.replace(/\/$/, "")}/users/login/`;
      console.log("Final URL:", finalUrl);
      
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      console.log("Payload:", payload);

      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Login successful:", response.data);
      console.log("Full response data:", JSON.stringify(response.data, null, 2));

      // Extract user data
      const userInfo = response.data?.user || response.data;
      const userRole = userInfo?.role;
      const userId = userInfo?.id || userInfo?.user_id;
      const username = userInfo?.username;
      const email = userInfo?.email;
      const isActive = userInfo?.is_active;
      const dateJoined = userInfo?.date_joined;

      console.log("=== Login Role Debug ===");
      console.log("Raw role from response:", userRole);

      // Save tokens if returned
      if (response.data?.tokens || response.data?.access) {
        const accessToken = response.data?.tokens?.access || response.data?.access;
        const refreshToken = response.data?.tokens?.refresh || response.data?.refresh;
        
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
      }
      
      // Save user data
      const userData = {
        user_id: userId,
        username: username,
        email: email,
        role: userRole,
        is_active: isActive,
        date_joined: dateJoined,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("User data saved to localStorage:", userData);

      // Navigate based on user role - normalize the role value
      const normalizedRole = (userRole || "").toLowerCase().trim();
      console.log("Normalized role (lowercase, trimmed):", normalizedRole);
      
      // Redirect syndicate users 
      if (normalizedRole === "syndicate" || normalizedRole === "syndicate_manager" || normalizedRole.includes("syndicate")) {
        console.log("✅ Redirecting to syndicate creation (LeadInfo)");
        navigate("/syndicate-creation/lead-info");
      } else if (normalizedRole === "investor") {
        console.log("✅ Investor role detected, checking onboarding status...");
        
        // Check investor profile to see if all onboarding steps are completed
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            console.log("⚠️ No access token found, redirecting to onboarding");
            navigate("/investor-onboarding/basic-info");
            return;
          }

          const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
          const profileUrl = `${API_URL.replace(/\/$/, "")}/profiles/`;
          
          console.log("Fetching investor profile from:", profileUrl);
          
          const profileResponse = await axios.get(profileUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          // Handle different response formats (single object or result array)
          let profileData = profileResponse.data?.results?.[0] || 
                            (profileResponse.data && typeof profileResponse.data === 'object' && !Array.isArray(profileResponse.data) ? profileResponse.data : null) ||
                            (Array.isArray(profileResponse.data) ? profileResponse.data[0] : null);

          if (profileData) {
            
            // Check if all 6 steps are completed
            const stepsCompleted = [
              profileData.step1_completed,
              profileData.step2_completed,
              profileData.step3_completed,
              profileData.step4_completed,
              profileData.step5_completed,
              profileData.step6_completed
            ];

            const allStepsCompleted = stepsCompleted.every(step => step === true);
            
            console.log("Update: Step completion status:", { allCompleted: allStepsCompleted });

            if (allStepsCompleted) {
              console.log("✅ All onboarding steps completed, redirecting to dashboard");
              navigate("/investor-panel/dashboard");
            } else {
              console.log("⚠️ Onboarding incomplete, redirecting to onboarding");
              navigate("/investor-onboarding/basic-info");
            }
          } else {
            console.log("⚠️ No profile data found, redirecting to onboarding");
            navigate("/investor-onboarding/basic-info");
          }
        } catch (profileError) {
          console.error("Error fetching investor profile, redirecting to onboarding:", profileError);
          navigate("/investor-onboarding/basic-info");
        }
      } else {
        console.log("⚠️ Unknown role, defaulting to home page. Role value:", normalizedRole);
        // Default fallback
        navigate("/");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMsg = backendData.non_field_errors?.[0] || 
                           backendData.email?.[0] || 
                           backendData.password?.[0] || 
                           JSON.stringify(backendData);
          setError(errorMsg);
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login handler
  const handleGoogleLogin = async () => {
    setError("");
    try {
      setLoading(true);
      
      // Google OAuth Client ID from your credentials
      const clientId = "514125135351-t9d89tav43rcqqe90km3i5hb3e60ubav.apps.googleusercontent.com";
      
      // Redirect URI - must match EXACTLY what's configured in Google Cloud Console
      // Build redirect URI with base path
      const basePath = import.meta.env.BASE_URL || '/blockchain-frontend/';
      const cleanBase = basePath.replace(/\/$/, ''); // Remove trailing slash if present
      const redirectUri = `${window.location.origin}${cleanBase}/oauth2callback`;
      
      console.log("🔐 Google OAuth Configuration:");
      console.log("═══════════════════════════════════════");
      console.log("Client ID:", clientId);
      console.log("Current Origin:", window.location.origin);
      console.log("Base Path:", basePath);
      console.log("═══════════════════════════════════════");
      console.log("🔴 REDIRECT URI (COPY THIS EXACTLY):");
      console.log(redirectUri);
      console.log("═══════════════════════════════════════");
      console.log("⚠️ Add this EXACT URI to Google Cloud Console:");
      console.log("   1. Go to: https://console.cloud.google.com/apis/credentials");
      console.log("   2. Find OAuth client:", clientId);
      console.log("   3. Click 'Edit'");
      console.log("   4. Under 'Authorized redirect URIs', click 'ADD URI'");
      console.log("   5. Paste:", redirectUri);
      console.log("   6. Click 'SAVE'");
      console.log("═══════════════════════════════════════");
      
      // Build Google OAuth URL
      const scope = encodeURIComponent("openid profile email");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=consent&include_granted_scopes=true`;

      // Open popup window
      const width = 600, height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2.5;
      const popup = window.open(authUrl, "google_oauth", `width=${width},height=${height},left=${left},top=${top}`);
      
      if (!popup) {
        setError("Popup blocked. Please allow popups for this site.");
        setLoading(false);
        return;
      }

      // Listen for message from callback page
      const handleMessage = async (event) => {
        // Security check: ensure message comes from same origin
        if (event.origin !== window.origin) return;
        
        const msg = event.data || {};
        if (msg.type !== "google_auth") return;
        
        // Clean up
        window.removeEventListener("message", handleMessage);
        popup.close();

        // Handle errors
        if (msg.error) {
          let errorMsg = String(msg.error);
          if (errorMsg.includes("invalid_client") || errorMsg.includes("OAuth client") || errorMsg.includes("not found")) {
            errorMsg = `OAuth Configuration Error: Please add "${redirectUri}" to Google Cloud Console under "Authorized redirect URIs". Error: ${msg.error}`;
          }
          setError(errorMsg);
          setLoading(false);
          return;
        }

        const accessToken = msg.access_token;
        if (!accessToken) {
          setError("No access token received from Google.");
          setLoading(false);
          return;
        }

        // Send token to your backend API
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
          const url = `${API_URL.replace(/\/$/, "")}/auth/google/`;
          
          // For LOGIN (not signup), don't send role - backend will return user's existing role
          // Only send access_token for login
          const payload = {
            access_token: accessToken
          };
          
          console.log("📤 Google Login - Sending to backend:", url);
          console.log("Payload:", { access_token: "***" });

          const response = await axios.post(url, payload, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          console.log("✅ Backend response:", response.data);
          console.log("📋 Full response:", JSON.stringify(response.data, null, 2));

          // Save tokens if returned
          if (response.data?.tokens || response.data?.access) {
            const access = response.data?.tokens?.access || response.data?.access;
            const refresh = response.data?.tokens?.refresh || response.data?.refresh;
            if (access) localStorage.setItem("accessToken", access);
            if (refresh) localStorage.setItem("refreshToken", refresh);
          }

          // Save user data - get role from backend response
          const userInfo = response.data?.user || response.data;
          const userRole = userInfo?.role;
          const userId = userInfo?.id || userInfo?.user_id;
          const username = userInfo?.username;
          const email = userInfo?.email;
          
          console.log("📋 User role from backend:", userRole);
          console.log("📋 User info:", userInfo);
          
          const userData = {
            user_id: userId,
            username: username,
            email: email,
            role: userRole
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("✅ Saved userData to localStorage:", userData);

          // Navigate based on role from backend (same logic as regular login)
          const normalizedRole = (userRole || "").toLowerCase().trim();
          console.log("📋 Normalized role:", normalizedRole);
          
          if (normalizedRole === "syndicate" || normalizedRole.includes("syndicate")) {
            console.log("✅ Redirecting syndicate user to syndicate creation");
            navigate("/syndicate-creation/lead-info");
          } else if (normalizedRole === "investor") {
            console.log("✅ Investor role detected, checking onboarding status...");
            // Check if onboarding is complete
            try {
              const accessToken = localStorage.getItem("accessToken");
              if (accessToken) {
                const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
                const profileUrl = `${API_URL.replace(/\/$/, "")}/profiles/`;
                const profileResponse = await axios.get(profileUrl, {
                  headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                
                const profileData = profileResponse.data?.results?.[0] || profileResponse.data;
                const allStepsCompleted = profileData && [
                  profileData.step1_completed,
                  profileData.step2_completed,
                  profileData.step3_completed,
                  profileData.step4_completed,
                  profileData.step5_completed,
                  profileData.step6_completed
                ].every(step => step === true);
                
                if (allStepsCompleted) {
                  console.log("✅ All onboarding steps completed, redirecting to dashboard");
                  navigate("/investor-panel/dashboard");
                } else {
                  console.log("⚠️ Onboarding incomplete, redirecting to onboarding");
                  navigate("/investor-onboarding/basic-info");
                }
              } else {
                console.log("⚠️ No access token, redirecting to onboarding");
                navigate("/investor-onboarding/basic-info");
              }
            } catch (err) {
              console.error("Error checking onboarding status:", err);
              navigate("/investor-onboarding/basic-info");
            }
          } else {
            console.warn("⚠️ Unknown role, defaulting to home. Role value:", normalizedRole);
            navigate("/");
          }

        } catch (err) {
          console.error("Backend API error:", err);
          const backend = err.response?.data;
          setError(backend ? (typeof backend === "object" ? JSON.stringify(backend) : String(backend)) : err.message || "Google login failed");
        } finally {
          setLoading(false);
        }
      };

      window.addEventListener("message", handleMessage);
      
      // Cleanup if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          setLoading(false);
        }
      }, 1000);
      
    } catch (e) {
      console.error("Google login flow error:", e);
      setError(String(e));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>


      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel - Visual/Marketing Section */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full">
          {/* Purple background and content layout */}
          <div className="bg-[#CEC6FF] w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8">
            
            {/* Logo/Branding (Top) */}
            <img src={logo} alt="Login Logo" className="w-1/3 max-w-[150px] h-auto object-contain" />
            
            {/* Main Text Content (Middle - Takes up remaining space) */}
            <div className="flex flex-col items-center justify-center flex-grow ">
                <h1 className="text-[30px] font-semibold text-white font-poppins-custom">Invest Globally. <br />
                Compliantly. Confidently.</h1>
                <p className="text-white font-poppins-custom leading-tight mr-16 mt-2">Built for global accredited investors and <br />
                syndicate leads.</p>
            </div>
            

            {/* Image Content (Bottom - MOVED HERE) */}
            <div className="flex justify-start items-end w-full space-x-3 mt-7">
              <img src={loginimg} alt="Login Asset 1" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg2} alt="Login Asset 2" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg3} alt="Login Asset 3" className="w-1/3 max-w-[50px] h-auto object-contain" />
            </div>
            
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-7 sm:p-8 md:p-6">
          <div className="w-full max-w-md">
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] mb-2 font-semibold">Welcome Back</h1>
              <p className="text-[#0A2A2E] font-poppins-custom">Sign in to your account to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>}
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="block text-sm text-[#0A2A2E] font-poppins-custom mb-1 outline-none">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {/* Placeholder Eye Icon for visibility toggle */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              
              <div className="flex items-center justify-between mb-4 ">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    // Tailwind uses accent color for checkbox styling in modern versions, but keeping inline color for compatibility
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-[#0A2A2E] font-poppins-custom">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#ED1C24] hover:text-red-700 transition-colors">
                  Forgot password?
                </Link>
              </div>

            
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto text-[#0A2A2E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Log In"}
              </button>

          


            </form>


            <div className="flex items-center mb-2 mt-2
             ">
              <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
              <span className="text-lg text-[#0A2A2E] mx-5 font-poppins-custom">or</span>
              <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
            </div>

            <div className="flex flex-row items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex flex-row  items-center justify-center gap-1 w-full bg-white text-[#0A2A2E] font-semibold py-3 px-4 rounded-lg border-2 border-[#0A2A2E] hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_3034_1961)">
                <path d="M5.57386 0.526248C3.97522 1.08083 2.59654 2.13346 1.64035 3.5295C0.684163 4.92554 0.200854 6.59143 0.261418 8.28245C0.321982 9.97348 0.923226 11.6005 1.97684 12.9246C3.03045 14.2486 4.48089 15.1999 6.11511 15.6387C7.44002 15.9806 8.82813 15.9956 10.1601 15.6825C11.3668 15.4115 12.4823 14.8317 13.3976 14C14.3502 13.1079 15.0417 11.9731 15.3976 10.7175C15.7845 9.35208 15.8534 7.91616 15.5989 6.52H8.15886V9.60625H12.4676C12.3815 10.0985 12.197 10.5683 11.9251 10.9875C11.6531 11.4068 11.2994 11.7669 10.8851 12.0462C10.359 12.3943 9.76586 12.6285 9.14387 12.7337C8.52005 12.8497 7.88019 12.8497 7.25636 12.7337C6.6241 12.603 6.02599 12.3421 5.50011 11.9675C4.6553 11.3695 4.02096 10.5199 3.68762 9.54C3.34863 8.54174 3.34863 7.45951 3.68762 6.46125C3.9249 5.76152 4.31716 5.12442 4.83511 4.5975C5.42785 3.98343 6.17828 3.54449 7.00406 3.32884C7.82984 3.11319 8.69906 3.12916 9.51637 3.375C10.1548 3.57099 10.7387 3.91342 11.2214 4.375C11.7072 3.89166 12.1922 3.40708 12.6764 2.92125C12.9264 2.66 13.1989 2.41125 13.4451 2.14375C12.7083 1.45809 11.8435 0.924569 10.9001 0.573748C9.18225 -0.0500151 7.30259 -0.0667781 5.57386 0.526248Z" fill="white"/>
                <path d="M5.57397 0.526245C7.30254 -0.067184 9.1822 -0.0508623 10.9002 0.572495C11.8437 0.925699 12.7082 1.46179 13.444 2.14999C13.194 2.41749 12.9302 2.66749 12.6752 2.92749C12.1902 3.41166 11.7056 3.89416 11.2215 4.37499C10.7388 3.91342 10.1549 3.57098 9.51646 3.37499C8.69943 3.1283 7.83024 3.1114 7.00424 3.32617C6.17824 3.54094 5.42735 3.97907 4.83396 4.59249C4.31601 5.11941 3.92375 5.75652 3.68646 6.45624L1.09521 4.44999C2.02273 2.6107 3.62865 1.20377 5.57397 0.526245Z" fill="#E33629"/>
                <path d="M0.407438 6.43745C0.546714 5.74719 0.777942 5.07873 1.09494 4.44995L3.68619 6.4612C3.34721 7.45946 3.34721 8.54169 3.68619 9.53995C2.82285 10.2066 1.9591 10.8766 1.09494 11.55C0.301376 9.97035 0.0593537 8.17058 0.407438 6.43745Z" fill="#F8BD00"/>
                <path d="M8.15876 6.5188H15.5988C15.8533 7.91496 15.7844 9.35088 15.3975 10.7163C15.0416 11.9719 14.3501 13.1067 13.3975 13.9988C12.5613 13.3463 11.7213 12.6988 10.885 12.0463C11.2996 11.7666 11.6535 11.4062 11.9254 10.9865C12.1973 10.5668 12.3817 10.0965 12.4675 9.6038H8.15876C8.15751 8.5763 8.15876 7.54755 8.15876 6.5188Z" fill="#587DBD"/>
                <path d="M1.09375 11.55C1.95792 10.8834 2.82167 10.2134 3.685 9.54004C4.01901 10.5203 4.65426 11.3699 5.5 11.9675C6.02751 12.3404 6.62691 12.5992 7.26 12.7275C7.88382 12.8435 8.52368 12.8435 9.1475 12.7275C9.76949 12.6223 10.3626 12.3881 10.8888 12.04C11.725 12.6925 12.565 13.34 13.4012 13.9925C12.4861 14.8247 11.3705 15.4049 10.1637 15.6763C8.83176 15.9894 7.44365 15.9744 6.11875 15.6325C5.07088 15.3528 4.09209 14.8595 3.24375 14.1838C2.34583 13.4709 1.61244 12.5725 1.09375 11.55Z" fill="#319F43"/>
                </g>
                <defs>
                <clipPath id="clip0_3034_1961">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
                </defs>
                </svg>


                  </span>Login with Google
              </button>
            </div>

            <div className="py-2">
              <p>don't have an account? <Link to="/register" className="text-[#CEC6FF] decoration-underline hover:text-[#00E6B0] transition-colors"
              style={{textDecoration: "underline"}}
              >Create one</Link></p>
            </div>

            <div className="border-1 border-[#0A2A2E] rounded-lg p-2 bg-[#F4F6F5]">
              <p className="text-xs p-1 text-[#0A2A2E] font-poppins-custom">
              By logging in, you acknowledge that Unlocksley does not provide investment advice and is intended for accredited/HNW investors only. Compliance varies by jurisdiction.
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;