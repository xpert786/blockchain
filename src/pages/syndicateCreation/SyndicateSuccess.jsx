import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import unlockLogo from "../../assets/img/unlocklogo.png";

const SyndicateSuccess = () => {
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [userData, setUserData] = useState(null);
  const [syndicateData, setSyndicateData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoToDashboard = () => {
    navigate("/manager-panel/dashboard");
  };

  const handleCreateDeal = async () => {
    setIsCheckingAccess(true);
    setAccessError("");

    try {
      // Get user ID from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const userDataStr = localStorage.getItem("userData");

      if (!accessToken) {
        setAccessError("No access token found. Please login again.");
        setIsCheckingAccess(false);
        return;
      }

      if (!userDataStr) {
        setAccessError("User data not found. Please login again.");
        setIsCheckingAccess(false);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userId = userData?.user_id || userData?.id;

      if (!userId) {
        setAccessError("User ID not found. Please login again.");
        setIsCheckingAccess(false);
        return;
      }

      // Check user status from API
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const userUrl = `${API_URL.replace(/\/$/, "")}/users/${userId}/`;

      console.log("=== Checking User Status for SPV Creation Access ===");
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
          // Allow access - navigate to SPV creation
          navigate("/syndicate-creation/spv-creation/step1");
        } else {
          // Deny access - show error message
          let errorMsg = "Access denied. ";
          if (!isActive && !isStaff) {
            errorMsg += "Your account is not active and you are not a staff member. Please contact support.";
          } else if (!isActive) {
            errorMsg += "Your account is not active. Please contact support to activate your account.";
          } else if (!isStaff) {
            errorMsg += "You are not authorized to create deals. Please contact support to get staff access.";
          }
          setAccessError(errorMsg);
          console.log("❌ Access denied:", errorMsg);
        }
      } else {
        setAccessError("Failed to verify user status. Please try again.");
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      const errorMsg = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to verify access. Please try again.";
      setAccessError(errorMsg);
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile
    console.log("Edit profile clicked");
  };

  // Fetch user and syndicate data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const userDataStr = localStorage.getItem("userData");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";

        // Parse user data from localStorage
        let localUserData = {};
        if (userDataStr) {
          try {
            localUserData = JSON.parse(userDataStr);
          } catch (e) {
            console.error("Error parsing userData from localStorage:", e);
          }
        }

        // Fetch full user data from API
        const userId = localUserData?.user_id || localUserData?.id;
        if (userId) {
          try {
            const userUrl = `${API_URL.replace(/\/$/, "")}/users/${userId}/`;
            const userResponse = await axios.get(userUrl, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });

            if (userResponse.data) {
              setUserData(userResponse.data);
            }
          } catch (err) {
            console.error("Error fetching user data:", err);
            // Fallback to localStorage data
            setUserData(localUserData);
          }
        } else {
          setUserData(localUserData);
        }

        // Fetch syndicate/entity data
        try {
          const step4Url = `${API_URL.replace(/\/$/, "")}/syndicate/step4/`;
          const syndicateResponse = await axios.get(step4Url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          if (syndicateResponse.data) {
            const reviewSummary = syndicateResponse.data.review_summary || {};
            const entityKyb = reviewSummary.entity_kyb || {};

            setSyndicateData({
              entityLegalName: entityKyb.entity_legal_name || "",
              entityType: entityKyb.entity_type || "",
              registrationNumber: entityKyb.registration_number || ""
            });
          }
        } catch (err) {
          console.error("Error fetching syndicate data:", err);
          // Try to fetch from step2 (entity profile)
          try {
            const step2Url = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;
            const step2Response = await axios.get(step2Url, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });

            if (step2Response.data) {
              const step2Data = step2Response.data.step_data || step2Response.data.data || step2Response.data;
              setSyndicateData({
                entityLegalName: step2Data.firm_name || step2Data.entity_name || "",
                entityType: step2Data.entity_type || "",
                registrationNumber: step2Data.registration_number || ""
              });
            }
          } catch (step2Err) {
            console.error("Error fetching step2 data:", step2Err);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!userData) return "User";

    // Try different name fields in order of preference
    if (userData.full_name) return userData.full_name;
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    if (userData.first_name) return userData.first_name;
    if (userData.username) return userData.username;
    if (userData.email) return userData.email.split('@')[0];
    return "User";
  };

  // Helper function to get syndicate display name
  const getSyndicateDisplayName = () => {
    if (syndicateData?.entityLegalName) {
      return syndicateData.entityLegalName;
    }
    return `${getUserDisplayName()} Syndicate`;
  };

  // Helper function to construct syndicate URL
  const getSyndicateUrl = () => {
    const entityName = syndicateData?.entityLegalName || getUserDisplayName();
    // Convert to URL-friendly format
    const urlSlug = entityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `https://unlocksley.${urlSlug}`;
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
              <span className="text-[#001D21]">Creation Flow</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 pt-28">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left">
            <svg className="w-6 h-6 text-green-500 mx-auto sm:mx-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Your Syndicate Was Created Successfully</span>
          </div>
        </div>

        {/* Syndicate Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
          {/* Top Section - Syndicate Information */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-4 sm:gap-6">
              {/* Syndicate Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>

              {/* Syndicate Details */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">
                  {loading ? "Loading..." : getSyndicateDisplayName()}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-center sm:text-left gap-1 sm:gap-2">
                  <span className="text-sm">{loading ? "Loading..." : getSyndicateUrl()}</span>
                  <a
                    href={loading ? "#" : getSyndicateUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <svg className="w-4 h-4 text-teal-500 self-center sm:self-auto mx-auto sm:mx-0 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                {/* User Information */}
                {userData && (
                  <div className="mt-2 text-sm text-gray-500 text-center sm:text-left">
                    <span>Created by: {getUserDisplayName()}</span>
                    {userData.email && (
                      <span className="ml-2">({userData.email})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={handleEditProfile}
              className="self-center lg:self-auto flex items-center space-x-2 bg-gray-100 hover:scale-102 text-gray-700 px-4 py-2 rounded-lg border border-[#01373D] transition-transform transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-[16px] font-semibold">Edit Profile</span>
            </button>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* User Information Section */}
          {userData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{getUserDisplayName()}</span>
                </div>
                {userData.email && (
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-800">{userData.email}</span>
                  </div>
                )}
                {userData.username && (
                  <div>
                    <span className="font-medium text-gray-600">Username:</span>
                    <span className="ml-2 text-gray-800">{userData.username}</span>
                  </div>
                )}
                {userData.role && (
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <span className="ml-2 text-gray-800 capitalize">{userData.role}</span>
                  </div>
                )}
                {syndicateData?.entityType && (
                  <div>
                    <span className="font-medium text-gray-600">Entity Type:</span>
                    <span className="ml-2 text-gray-800">{syndicateData.entityType}</span>
                  </div>
                )}
                {syndicateData?.registrationNumber && (
                  <div>
                    <span className="font-medium text-gray-600">Registration Number:</span>
                    <span className="ml-2 text-gray-800">{syndicateData.registrationNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {accessError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 text-sm">{accessError}</p>
              </div>
            </div>
          )}

          {/* Bottom Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleGoToDashboard}
              className="bg-[#00F0C3] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm text-center w-full sm:w-auto"
            >
              Go To Dashboard
            </button>
            <button
              onClick={handleCreateDeal}
              disabled={isCheckingAccess}
              className="bg-[#CEC6FF] hover:scale-102 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingAccess ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Checking Access...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create a Deal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicateSuccess;