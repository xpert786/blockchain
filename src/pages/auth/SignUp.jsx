import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";
import logo from "/src/assets/img/logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRoleSelectModal, setShowRoleSelectModal] = useState(false);

  // Check role on component mount
  useEffect(() => {
    const tempUserData = JSON.parse(localStorage.getItem("tempUserData") || "{}");
    console.log("=== SignUp Component Mounted ===");
    console.log("tempUserData from localStorage:", tempUserData);
    console.log("Role in localStorage:", tempUserData.role);
    
    if (!tempUserData.role) {
      console.warn("⚠️ No role found in localStorage on mount. User should have selected role from RoleSelect page.");
    } else {
      console.log("✅ Role found on mount:", tempUserData.role);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatBackendError = (data) => {
    if (!data) return "Failed to create account.";

    if (typeof data === "string") return data;

    if (Array.isArray(data)) {
      return data
        .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
        .join(" ");
    }

    if (typeof data === "object") {
      if (data.error) return formatBackendError(data.error);
      if (data.detail) return formatBackendError(data.detail);

      const messages = Object.entries(data).map(([key, value]) => {
        const formattedValue = Array.isArray(value) ? value.join(" ") : formatBackendError(value);
        return `${key.replace(/_/g, " ")}: ${formattedValue}`;
      });

      return messages.join(" ");
    }

    return "Failed to create account.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Get temp user data from localStorage (saved during RoleSelect)
      const tempUserData = JSON.parse(localStorage.getItem("tempUserData") || "{}");
      
      console.log("=== SignUp Form Submit - Role Check ===");
      console.log("tempUserData from localStorage:", tempUserData);
      console.log("Role value:", tempUserData.role);
      
      // Verify role is present and valid
      if (!tempUserData.role) {
        console.warn("⚠️ Role is missing from localStorage");
        setError("Role is missing. Please go back and select a role.");
        return;
      }
      
      // Ensure role is in correct format (lowercase: "investor" or "syndicate")
      const role = String(tempUserData.role).toLowerCase().trim();
      console.log("Normalized role:", role);
      
      if (role !== "investor" && role !== "syndicate") {
        console.warn("⚠️ Invalid role:", role);
        setError(`Invalid role: ${tempUserData.role}. Role must be "investor" or "syndicate".`);
        return;
      }
      
      console.log("✅ Role validation passed:", role);
      
      // Complete payload with SignUp data + Password - using correct endpoint format
      const payload = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        role: role,
      };
      
      // Update localStorage with complete user data including role
      localStorage.setItem("tempUserData", JSON.stringify({
        ...tempUserData,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: role
      }));
      
      console.log("=== Registration Debug ===");
      console.log("Raw tempUserData:", tempUserData);
      console.log("Role from localStorage:", tempUserData.role);
      console.log("Normalized role:", role);
      console.log("✅ ROLE IS INCLUDED IN PAYLOAD:", role);
      console.log("Full payload:", payload);
      console.log("📤 PAYLOAD WITH ROLE:", JSON.stringify(payload, null, 2));

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      // Match the curl command endpoint: /api/registration-flow/register/
      const finalUrl = `${API_URL.replace(/\/$/, "")}/registration-flow/register/`;
      
      console.log("🔗 Calling registration API:", finalUrl);
      console.log("📦 Final payload being sent (includes role):", {
        email: payload.email,
        full_name: payload.full_name,
        phone_number: payload.phone_number,
        role: payload.role, // ✅ Role is here!
        password: "***hidden***",
        confirm_password: "***hidden***"
      });
      
      const response = await axios.post(finalUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Account created successfully:", response.data);
      console.log("Full response structure:", JSON.stringify(response.data, null, 2));

      // Save tokens if returned - check multiple possible response formats
      let accessToken = null;
      let refreshToken = null;
      
      if (response.data?.tokens) {
        accessToken = response.data.tokens.access;
        refreshToken = response.data.tokens.refresh;
      } else if (response.data?.access) {
        accessToken = response.data.access;
        refreshToken = response.data.refresh;
      } else if (response.data?.access_token) {
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
      }
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        console.log("✅ Access token saved to localStorage");
      } else {
        console.warn("⚠️ No access token found in registration response");
      }
      
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        console.log("✅ Refresh token saved to localStorage");
      }
        
      // Save complete user data
      const userData = {
        user_id: response.data.user_id || response.data.id,
        email: response.data.email,
        phone_number: response.data.phone_number,
        full_name: response.data.full_name,
        role: response.data.role,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("✅ User data saved:", userData);

      // Clear temp data
      localStorage.removeItem("tempUserData");

      // Navigate to SecureAccount2FA after successful registration
      navigate("/secure-account-2fa");
    } catch (err) {
      console.error("Error creating account:", err);
      const backendData = err.response?.data;
      const message = backendData ? formatBackendError(backendData) : err.message;
      setError(message || "Failed to create account.");
    }
  };

  // Google OAuth signup handler
  const handleGoogleLogin = async () => {
    setError("");
    setShowRoleSelectModal(false);
    try {
      setLoading(true);
      
      // Check if role is selected before proceeding (for signup, role should be selected first)
      // Try to get role from localStorage - it should be saved from RoleSelect page
      let tempUserData = {};
      try {
        const storedData = localStorage.getItem("tempUserData");
        console.log("=== Google SignUp - Role Check ===");
        console.log("Raw localStorage tempUserData:", storedData);
        
        if (storedData) {
          tempUserData = JSON.parse(storedData);
        }
      } catch (e) {
        console.error("Error parsing tempUserData from localStorage:", e);
        tempUserData = {};
      }
      
      console.log("Parsed tempUserData:", tempUserData);
      console.log("Role value:", tempUserData.role);
      console.log("Role type:", typeof tempUserData.role);
      
      // Check if role exists and is valid
      const role = tempUserData?.role;
      if (!role || (typeof role === "string" && role.trim() === "")) {
        console.warn("⚠️ Role is missing or empty, showing modal");
        console.warn("This should not happen if user came from RoleSelect page");
        console.warn("Please check if RoleSelect.jsx is saving the role correctly");
        setShowRoleSelectModal(true);
        setError(""); // Clear inline error for this case
        setLoading(false);
        return;
      }
      
      // Validate role value
      const normalizedRole = String(role).toLowerCase().trim();
      if (normalizedRole !== "investor" && normalizedRole !== "syndicate") {
        console.warn("⚠️ Invalid role value:", normalizedRole);
        setShowRoleSelectModal(true);
        setError("");
        setLoading(false);
        return;
      }
      
      console.log("✅ Role found and validated:", normalizedRole);
      
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
      console.log("Selected Role:", tempUserData.role);
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
          
          // Get role from localStorage again (user selected it on role-select page)
          // We validated it exists earlier, but get it fresh here to ensure it's still there
          let roleToSend = normalizedRole; // Use the validated role from outer scope
          
          // Fallback: get from localStorage if normalizedRole is not available
          if (!roleToSend) {
            const currentTempData = JSON.parse(localStorage.getItem("tempUserData") || "{}");
            roleToSend = String(currentTempData.role || "").toLowerCase().trim();
          }
          
          if (!roleToSend || (roleToSend !== "investor" && roleToSend !== "syndicate")) {
            console.error("❌ Role is missing or invalid when sending to backend:", roleToSend);
            setError("Role is missing. Please select a role first.");
            setShowRoleSelectModal(true);
            setLoading(false);
            return;
          }
          
          console.log("📤 Sending role to backend:", roleToSend);
          
          // Prepare payload as per your curl example
          const payload = {
            access_token: accessToken,
            role: roleToSend
          };
          
          console.log("📤 Sending to backend:", url);
          console.log("Payload:", { access_token: "***", role: role });
          
          const response = await axios.post(url, payload, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          console.log("✅ Backend response:", response.data);

          // Save tokens if returned
          if (response.data?.tokens || response.data?.access) {
            const access = response.data?.tokens?.access || response.data?.access;
            const refresh = response.data?.tokens?.refresh || response.data?.refresh;
            if (access) localStorage.setItem("accessToken", access);
            if (refresh) localStorage.setItem("refreshToken", refresh);
          }

          // Save user data
          const userInfo = response.data?.user || response.data;
          const userRole = userInfo?.role;
          const userId = userInfo?.id || userInfo?.user_id;
          const username = userInfo?.username;
          const email = userInfo?.email;
          
          const userData = {
            user_id: userId,
            username: username,
            email: email,
            role: userRole
          };
          localStorage.setItem("userData", JSON.stringify(userData));
          
          // Clear temp data
          localStorage.removeItem("tempUserData");

          // Navigate to 2FA for all users (both Google and normal signup follow same flow)
          navigate("/secure-account-2fa");

        } catch (err) {
          console.error("Backend API error:", err);
          const backend = err.response?.data;
          
          // Check if error is about missing role (user hasn't selected role yet)
          // Handle multiple error formats:
          // 1. {"success":false,"detail":{"id_token":["This field is required."]}}
          // 2. {"success":false,"detail":"Role is required for signup. Provide \"investor\" or \"syndicate\"."}
          const detail = backend?.detail;
          const detailString = typeof detail === "string" ? detail : JSON.stringify(detail || {});
          
          const isMissingRoleError = 
            backend?.detail?.id_token || // Old format: id_token field error
            (typeof detail === "string" && (
              detail.toLowerCase().includes("role is required") ||
              detail.toLowerCase().includes("provide \"investor\" or \"syndicate\"") ||
              detail.toLowerCase().includes("role is required for signup")
            )) || // New format: role required message
            (typeof backend === "object" && backend.detail && 
              (detailString.includes("id_token") || 
               detailString.includes("This field is required") ||
               detailString.includes("Role is required")));
          
          console.log("Error check - isMissingRoleError:", isMissingRoleError);
          console.log("Backend error detail:", detail);
          
          if (isMissingRoleError) {
            setShowRoleSelectModal(true);
            setError(""); // Clear inline error for this case
          } else {
            setError(backend ? (typeof backend === "object" ? JSON.stringify(backend) : String(backend)) : err.message || "Google signup failed");
            setShowRoleSelectModal(false);
          }
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
      console.error("Google signup flow error:", e);
      setError(String(e));
      setLoading(false);
    }
  };

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
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[650px] bg-white rounded-3xl overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center relative h-64 md:h-full">
        <div className="w-full flex relative p-6 md:p-4 h-64 md:h-full">
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
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-3 sm:p-4 md:p-3">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-2 sm:mb-3 text-center md:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl text-[#001D21] mb-0.5 sm:mb-1 font-semibold">Create Account</h1>
              <p className="text-xs sm:text-sm text-[#0A2A2E]">Join our investment platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div>
                <label htmlFor="fullName" className="block text-[10px] sm:text-xs text-[#0A2A2E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] sm:text-xs text-[#0A2A2E] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-[10px] sm:text-xs text-[#0A2A2E] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] sm:text-xs text-[#0A2A2E] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="w-full px-3 py-2 pr-10 text-xs sm:text-sm border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs text-gray-400 hover:text-gray-600 px-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] sm:text-xs text-[#0A2A2E] mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="w-full px-3 py-2 pr-10 text-xs sm:text-sm border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg outline-none focus:border-[#00F0C3] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs text-gray-400 hover:text-gray-600 px-1"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex flex-row items-start justify-start mt-1.5 gap-1.5">
                <input
                    type="checkbox"
                    id="termsAndConditions"
                    name="termsAndConditions"
                    checked={formData.termsAndConditions}
                    onChange={handleInputChange}
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-0.5 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2] flex-shrink-0"
                  />
                  <label htmlFor="termsAndConditions" className="block text-[9px] sm:text-[10px] text-[#0A2A2E] font-poppins-custom leading-tight">I want to enable 2-Factor Authentication automatically</label>
                  </div>
              </div>


              {error && <div className="text-red-500 text-[10px] sm:text-xs bg-red-50 p-1.5 sm:p-2 rounded-lg">{error}</div>}

               <button
                 type="submit"
                 disabled={loading}
                 className="w-full bg-[#0A3A38] text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? "Creating..." : "Create Account"}
               </button>
              
              <div className="flex items-center my-2 sm:my-3">
                <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
                <span className="text-xs sm:text-sm text-[#0A2A2E] mx-2 sm:mx-4 font-poppins-custom whitespace-nowrap">or</span>
                <div className="w-full h-[1px] bg-[#0A2A2E]"></div>
              </div>

              <div className="flex flex-row items-center justify-center mb-1 sm:mb-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex flex-row items-center justify-center gap-1 w-full bg-white text-[#0A2A2E] text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg border-2 border-[#0A2A2E] hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                      <g clip-path="url(#clip0_3034_1961)">
                        <path d="M5.57386 0.526248C3.97522 1.08083 2.59654 2.13346 1.64035 3.5295C0.684163 4.92554 0.200854 6.59143 0.261418 8.28245C0.321982 9.97348 0.923226 11.6005 1.97684 12.9246C3.03045 14.2486 4.48089 15.1999 6.11511 15.6387C7.44002 15.9806 8.82813 15.9956 10.1601 15.6825C11.3668 15.4115 12.4823 14.8317 13.3976 14C14.3502 13.1079 15.0417 11.9731 15.3976 10.7175C15.7845 9.35208 15.8534 7.91616 15.5989 6.52H8.15886V9.60625H12.4676C12.3815 10.0985 12.197 10.5683 11.9251 10.9875C11.6531 11.4068 11.2994 11.7669 10.8851 12.0462C10.359 12.3943 9.76586 12.6285 9.14387 12.7337C8.52005 12.8497 7.88019 12.8497 7.25636 12.7337C6.6241 12.603 6.02599 12.3421 5.50011 11.9675C4.6553 11.3695 4.02096 10.5199 3.68762 9.54C3.34863 8.54174 3.34863 7.45951 3.68762 6.46125C3.9249 5.76152 4.31716 5.12442 4.83511 4.5975C5.42785 3.98343 6.17828 3.54449 7.00406 3.32884C7.82984 3.11319 8.69906 3.12916 9.51637 3.375C10.1548 3.57099 10.7387 3.91342 11.2214 4.375C11.7072 3.89166 12.1922 3.40708 12.6764 2.92125C12.9264 2.66 13.1989 2.41125 13.4451 2.14375C12.7083 1.45809 11.8435 0.924569 10.9001 0.573748C9.18225 -0.0500151 7.30259 -0.0667781 5.57386 0.526248Z" fill="white"/>
                        <path d="M5.57397 0.526245C7.30254 -0.067184 9.1822 -0.0508623 10.9002 0.572495C11.8437 0.925699 12.7082 1.46179 13.444 2.14999C13.194 2.41749 12.9302 2.66749 12.6752 2.92749C12.1902 3.41166 11.7056 3.89416 11.2215 4.37499C10.7388 3.91342 10.1549 3.57098 9.51646 3.37499C8.69943 3.1283 7.83024 3.1114 7.00424 3.32617C6.17824 3.54094 5.42735 3.97907 4.83396 4.59249C4.31601 5.11941 3.92375 5.75652 3.68646 6.45624L1.09521 4.44999C2.02273 2.6107 3.62865 1.20377 5.57397 0.526245Z" fill="#E33629"/>
                        <path d="M0.407438 6.43745C0.546714 5.74719 0.777942 5.07873 1.09494 4.44995L3.68619 6.4612C3.34721 7.45946 3.34721 8.54169 3.68619 9.53995C2.82285 10.2066 1.9591 10.8766 1.09494 11.55C0.301376 9.97035 0.0593537 8.17058 0.407438 6.43745Z" fill="#F8BD00"/>
                        <path d="M8.15876 6.5188H15.5988C15.8533 7.91496 15.7844 9.35088 15.3975 10.7163C15.0416 11.9719 14.3501 13.1067 13.3975 13.9988C12.5613 13.3463 11.7213 12.6988 10.885 12.0463C11.2996 11.7666 11.6535 11.4062 11.9254 10.9865C12.1973 10.5668 12.3817 10.0965 12.4675 9.6038H8.15876C8.15751 8.5763 8.15876 7.54755 8.15876 6.5188Z" fill="#587DBD"/>
                        <path d="M1.09375 11.55C1.95792 10.8834 2.82167 10.2134 3.685 9.54004C4.01901 10.5203 4.65426 11.3699 5.5 11.9675C6.02751 12.3404 6.62691 12.5992 7.26 12.7275C7.88382 12.8435 8.52368 12.8435 9.1475 12.7275C9.76949 12.6223 10.3626 12.3881 10.8888 12.04C11.725 12.6925 12.565 13.34 13.4012 13.9925C12.4861 14.8247 11.3705 15.4049 10.1637 15.6763C8.83176 15.9894 7.44365 15.9744 6.11875 15.6325C5.07088 15.3528 4.09209 14.8595 3.24375 14.1838C2.34583 13.4709 1.61244 12.5725 1.09375 11.55Z" fill="#319F43"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_3034_1961">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Sign in with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelectModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#001D21] mb-2">
                Role Selection Required
              </h3>
              <p className="text-sm text-[#0A2A2E] mb-6 font-poppins-custom">
                You didn't sign in. Please select a role first before signing in with Google.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowRoleSelectModal(false);
                    navigate("/role-select");
                  }}
                  className="flex-1 bg-[#0A3A38] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200"
                >
                  Go to Role Selection
                </button>
                <button
                  onClick={() => setShowRoleSelectModal(false)}
                  className="flex-1 bg-gray-200 text-[#0A2A2E] font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
