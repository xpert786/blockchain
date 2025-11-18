import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SPVStep7 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    legalReviewConfirmed: false,
    termsAccepted: false,
    electronicSignature: false
  });
  const [spvData, setSpvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [spvId, setSpvId] = useState(null);

  // Helper function to construct file URL from API response
  const constructFileUrl = (filePath) => {
    if (!filePath) return null;
    
    const baseDomain = "http://168.231.121.7";
    
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    } else if (filePath.startsWith('/')) {
      if (filePath.startsWith('/api/blockchain-backend/')) {
        return `${baseDomain}${filePath.replace(/^\/api/, '')}`;
      } else if (filePath.startsWith('/blockchain-backend/')) {
        return `${baseDomain}${filePath}`;
      } else if (filePath.startsWith('/media/')) {
        return `${baseDomain}/blockchain-backend${filePath}`;
      } else {
        return `${baseDomain}/blockchain-backend${filePath}`;
      }
    } else {
      return `${baseDomain}/blockchain-backend/${filePath}`;
    }
  };

  // Fetch SPV final review data
  useEffect(() => {
    const fetchFinalReviewData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No access token found. Please login again.");
          setIsLoading(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        let currentSpvId = null;

        // Try to get SPV ID from SPV list
        try {
          const spvListUrl = `${API_URL.replace(/\/$/, "")}/spv/`;
          const spvListResponse = await axios.get(spvListUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          const spvData = spvListResponse.data?.results || spvListResponse.data;

          if (Array.isArray(spvData) && spvData.length > 0) {
            const sortedSpvs = [...spvData].sort((a, b) => {
              if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return (b.id || 0) - (a.id || 0);
            });
            currentSpvId = sortedSpvs[0].id;
          } else if (spvData && spvData.id) {
            currentSpvId = spvData.id;
          }
        } catch (spvListError) {
          console.log("⚠️ Could not get SPV list:", spvListError.response?.status);
        }

        // If still no SPV ID, use 1 as default
        if (!currentSpvId) {
          currentSpvId = 1;
        }

        setSpvId(currentSpvId);

        // Fetch final review data
        const finalReviewUrl = `${API_URL.replace(/\/$/, "")}/spv/${currentSpvId}/final_review/`;
        console.log("🔍 Fetching final review data from:", finalReviewUrl);

        const response = await axios.get(finalReviewUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("✅ Final review response:", response.data);

        if (response.data && response.status === 200) {
          setSpvData(response.data);
        }
      } catch (err) {
        console.error("Error fetching final review data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load SPV data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinalReviewData();
  }, [location.pathname]);
  

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/spv-creation/step6");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      if (!spvId) {
        throw new Error("SPV ID not found. Please try again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      // API endpoint: /api/spv/{id}/final_submit/
      const finalSubmitUrl = `${API_URL.replace(/\/$/, "")}/spv/${spvId}/final_submit/`;

      console.log("=== SPV Final Submit API Call ===");
      console.log("SPV ID:", spvId);
      console.log("API URL:", finalSubmitUrl);
      console.log("Form Data:", formData);

      // Payload structure matching the API requirements
      const dataToSend = {
        legal_review_confirmed: formData.legalReviewConfirmed,
        terms_accepted: formData.termsAccepted,
        electronic_signature_confirmed: formData.electronicSignature
      };

      console.log("Request payload:", JSON.stringify(dataToSend, null, 2));

      const response = await axios.post(finalSubmitUrl, dataToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("✅ SPV final submit successful:", response.data);

      // Navigate to success page on success
      if (response.data && response.status >= 200 && response.status < 300) {
        navigate("/syndicate-creation/success");
      }
    } catch (err) {
      console.error("SPV final submit error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);

      const backendData = err.response?.data;

      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          let errorMessages = [];

          Object.keys(backendData).forEach(key => {
            if (Array.isArray(backendData[key])) {
              errorMessages.push(...backendData[key]);
            } else if (backendData[key]) {
              errorMessages.push(`${key}: ${backendData[key]}`);
            }
          });

          if (errorMessages.length > 0) {
            setError(errorMessages.join(" "));
          } else {
            setError("Failed to submit SPV for review. Please check your input.");
          }
        } else {
          setError(String(backendData));
        }
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 404) {
        setError("SPV not found. Please start from step 1.");
      } else {
        setError(err.message || "Failed to submit SPV for review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = (documentType) => {
    console.log(`Preview ${documentType} clicked`);
    // TODO: Implement document preview functionality
  };

  // Helper functions to format data for display
  const formatCurrency = (value) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatPercentage = (value) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `${num}%`;
  };

  // Get data from full_spv_data or steps
  const getData = () => {
    if (!spvData) return null;
    return spvData.full_spv_data || spvData;
  };

  const data = getData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading SPV data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Final Summary & Review</h1>
        <p className="text-gray-600">Review and approve the automatically generated legal documents for your SPV.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Documents Generated Successfully Banner */}
      <div className="bg-green-50 rounded-lg p-4"
      style={{ border: "0.5px solid #00CC9933" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 gap-3">
          <div className="flex-shrink-0">
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.0834 10.6193V11.5009C21.0822 13.5675 20.4131 15.5783 19.1757 17.2335C17.9383 18.8887 16.1991 20.0996 14.2173 20.6855C12.2355 21.2714 10.1175 21.2011 8.17895 20.4849C6.24044 19.7687 4.58538 18.4451 3.46059 16.7115C2.3358 14.9778 1.80155 12.927 1.93752 10.8649C2.0735 8.8028 2.8724 6.83991 4.2151 5.26896C5.55779 3.69801 7.37233 2.60317 9.3881 2.14773C11.4039 1.6923 13.5128 1.90067 15.4005 2.74176M8.62509 10.5426L11.5001 13.4176L21.0834 3.83426" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center sm:text-left">Documents Generated Successfully</h3>
            <p className="text-gray-700 text-center sm:text-left">We've automatically generated the necessary legal documents for your SPV based on the information provided. Please review them before proceeding.</p>
          </div>
        </div>
      </div>

      {/* Lead Information Section */}
      <div className="mb-8">
       
        
        <div className="bg-white rounded-lg p-4" 
        style={{ border:  "0.5px solid #0A2A2E" }}
        >
        <div className="flex items-center space-x-2 mb-4">

          <h3 className="text-xl font-medium text-gray-800">Lead Information</h3>
        </div>
          {/* Operating Agreement */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 bg-[#F9F8FF] rounded-lg p-3 ">
            <div className="flex items-center space-x-3 ">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8334 1.83301V5.49967C12.8334 5.9859 13.0266 6.45222 13.3704 6.79604C13.7142 7.13985 14.1805 7.33301 14.6667 7.33301H18.3334M9.16675 8.24967H7.33341M14.6667 11.9163H7.33341M14.6667 15.583H7.33341M13.7501 1.83301H5.50008C5.01385 1.83301 4.54754 2.02616 4.20372 2.36998C3.8599 2.7138 3.66675 3.18011 3.66675 3.66634V18.333C3.66675 18.8192 3.8599 19.2856 4.20372 19.6294C4.54754 19.9732 5.01385 20.1663 5.50008 20.1663H16.5001C16.9863 20.1663 17.4526 19.9732 17.7964 19.6294C18.1403 19.2856 18.3334 18.8192 18.3334 18.333V6.41634L13.7501 1.83301Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              <span className="text-gray-800 font-medium">Operating Agreement</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[#22C55E] text-sm font-medium">Generated</span>
              <button
                onClick={() => handlePreview("Operating Agreement")}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                style={{border: "0.5px solid #01373D" }}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Subscription Agreement */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 bg-[#F9F8FF] rounded-lg p-3 ">
            <div className="flex items-center space-x-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8334 1.83301V5.49967C12.8334 5.9859 13.0266 6.45222 13.3704 6.79604C13.7142 7.13985 14.1805 7.33301 14.6667 7.33301H18.3334M9.16675 8.24967H7.33341M14.6667 11.9163H7.33341M14.6667 15.583H7.33341M13.7501 1.83301H5.50008C5.01385 1.83301 4.54754 2.02616 4.20372 2.36998C3.8599 2.7138 3.66675 3.18011 3.66675 3.66634V18.333C3.66675 18.8192 3.8599 19.2856 4.20372 19.6294C4.54754 19.9732 5.01385 20.1663 5.50008 20.1663H16.5001C16.9863 20.1663 17.4526 19.9732 17.7964 19.6294C18.1403 19.2856 18.3334 18.8192 18.3334 18.333V6.41634L13.7501 1.83301Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              <span className="text-gray-800 font-medium">Subscription Agreement</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[#22C55E] text-sm font-medium">Generated</span>
              <button
                onClick={() => handlePreview("Subscription Agreement")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                style={{border: "0.5px solid #01373D" }}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Side Letter */}
          <div className="flex items-center justify-between py-3 bg-[#F9F8FF] rounded-lg p-3 ">
            <div className="flex items-center space-x-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.8334 1.83301V5.49967C12.8334 5.9859 13.0266 6.45222 13.3704 6.79604C13.7142 7.13985 14.1805 7.33301 14.6667 7.33301H18.3334M9.16675 8.24967H7.33341M14.6667 11.9163H7.33341M14.6667 15.583H7.33341M13.7501 1.83301H5.50008C5.01385 1.83301 4.54754 2.02616 4.20372 2.36998C3.8599 2.7138 3.66675 3.18011 3.66675 3.66634V18.333C3.66675 18.8192 3.8599 19.2856 4.20372 19.6294C4.54754 19.9732 5.01385 20.1663 5.50008 20.1663H16.5001C16.9863 20.1663 17.4526 19.9732 17.7964 19.6294C18.1403 19.2856 18.3334 18.8192 18.3334 18.333V6.41634L13.7501 1.83301Z" stroke="#01373D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              <span className="text-gray-800 font-medium">Side Letter</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[#E9BB30] text-sm font-medium">Pending</span>
              <button
                onClick={() => handlePreview("Side Letter")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                style={{border: "0.5px solid #01373D" }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Review Required Banner */}
      <div className="bg-[#FDECEC] rounded-lg p-4" 
      style={{ border: "1px solid #FACACA" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 gap-3">
          <div className="flex-shrink-0">
            <div  className="mt-2">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_853_7107)">
                <path d="M7.99992 5.33301V7.99967M7.99992 10.6663H8.00617M14.6666 7.99967C14.6666 11.6816 11.6818 14.6663 7.99992 14.6663C4.31802 14.6663 1.33325 11.6816 1.33325 7.99967C1.33325 4.31778 4.31802 1.33301 7.99992 1.33301C11.6818 1.33301 14.6666 4.31778 14.6666 7.99967Z" stroke="#ED1C24" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_853_7107">
                <rect width="16" height="16" fill="white"/>
                </clipPath>
            </defs>
            </svg>
            </div>
       
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 ">Legal Review Required</h3>
            <p className="text-gray-700">Before proceeding, please confirm that you've reviewed all generated documents and understand that they will be submitted for legal review.</p>
          </div>
        </div>
      </div>

      {/* Legal Review Confirmation Checkbox */}
      <div className="mb-8">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.legalReviewConfirmed}
            onChange={() => handleCheckboxChange("legalReviewConfirmed")}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700 text-lg font-medium">
            I confirm that I have reviewed all generated documents and am ready to submit them for legal review. I understand that changes may be required after legal review.
          </span>
        </label>
      </div>

      {/* Deal Summary Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

            <h2 className="text-xl font-medium text-gray-800">Deal Summary</h2>
        </div>
        
        <div className="bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Deal Name:</span>
                <span className="text-gray-800 font-medium">{data?.deal_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction Type:</span>
                <span className="text-gray-800 font-medium capitalize">{data?.transaction_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Check Size:</span>
                <span className="text-gray-800 font-medium">{formatCurrency(data?.minimum_lp_investment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Round Size:</span>
                <span className="text-gray-800 font-medium">{formatCurrency(data?.round_size)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Target Company:</span>
                <span className="text-gray-800 font-medium">{data?.portfolio_company_name || data?.company_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Instrument Type:</span>
                <span className="text-gray-800 font-medium">{data?.instrument_type_detail?.name || data?.instrument_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carry:</span>
                <span className="text-gray-800 font-medium">{formatPercentage(data?.total_carry_percentage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Close Date:</span>
                <span className="text-gray-800 font-medium">{formatDate(data?.target_closing_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Structure Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

          <h2 className="text-xl font-medium text-gray-800">Legal Structure</h2>
        </div>
        
        <div className="bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Adviser Entity:</span>
                <span className="text-gray-800 font-medium">
                  {data?.adviser_entity === "platform_advisers" ? "Platform Advisers LLC" : 
                   data?.adviser_entity === "self_advised" ? "Self-Advised Entity" : 
                   data?.adviser_entity || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jurisdiction:</span>
                <span className="text-gray-800 font-medium">{data?.jurisdiction || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Master Partnership:</span>
                <span className="text-gray-800 font-medium">
                  {data?.master_partnership_entity_detail?.name || 
                   data?.master_partnership_entity || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entity Type:</span>
                <span className="text-gray-800 font-medium">{data?.entity_type || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Metadata Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

          <h2 className="text-xl font-medium text-gray-800">Deal Metadata</h2>
        </div>
        
        <div className="bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Access Mode:</span>
                <span className="text-gray-800 font-medium capitalize">
                  {data?.access_mode === "private" ? "Private" : 
                   data?.access_mode === "public" ? "Public" : 
                   data?.access_mode || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tags:</span>
                <span className="text-gray-800 font-medium">
                  {data?.deal_tags && Array.isArray(data.deal_tags) 
                    ? data.deal_tags.join(", ") 
                    : data?.deal_tags || "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Deal Stage:</span>
                <span className="text-gray-800 font-medium">
                  {data?.company_stage_detail?.name || 
                   data?.round_detail?.name || 
                   "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country of Incorporation:</span>
                <span className="text-gray-800 font-medium uppercase">{data?.country_of_incorporation || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Electronic Signature & Confirmation Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 3.75L11.25 1.5H4.5C4.10218 1.5 3.72064 1.65804 3.43934 1.93934C3.15804 2.22064 3 2.60218 3 3V15C3 15.3978 3.15804 15.7794 3.43934 16.0607C3.72064 16.342 4.10218 16.5 4.5 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15M6 13.5H6.75M13.8 7.2C14.0984 6.90163 14.503 6.73401 14.925 6.73401C15.347 6.73401 15.7516 6.90163 16.05 7.2C16.3484 7.49837 16.516 7.90304 16.516 8.325C16.516 8.74696 16.3484 9.15163 16.05 9.45L12.75 12.75L9.75 13.5L10.5 10.5L13.8 7.2Z" stroke="#22C55E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>


          <h2 className="text-xl font-medium text-gray-800">Electronic Signature & Confirmation</h2>
        </div>
        
        <div className="bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={() => handleCheckboxChange("termsAccepted")}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              I agree to the terms and conditions, privacy policy, and understand that this SPV will be subject to compliance review before activation. I acknowledge that all information provided is accurate and complete.
            </span>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.electronicSignature}
              onChange={() => handleCheckboxChange("electronicSignature")}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              By checking this box, I electronically sign this document and confirm my identity as the authorized representative of the syndicate. This electronic signature has the same legal effect as a handwritten signature.
            </span>
          </label>
        </div>
      </div>

      {/* What happens next? Section */}
      <div className="mb-8">
        <div className="bg-[#F9F8FF] rounded-lg p-4" style={{ border: "0.5px solid #E2E2FB" }}>
        <div className="flex items-center space-x-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 8.31039V9.00039C16.4991 10.6177 15.9754 12.1914 15.007 13.4868C14.0386 14.7821 12.6775 15.7297 11.1265 16.1883C9.57557 16.6469 7.91794 16.5918 6.40085 16.0313C4.88376 15.4708 3.58849 14.435 2.70822 13.0782C1.82795 11.7214 1.40984 10.1164 1.51626 8.50262C1.62267 6.88881 2.24791 5.35263 3.29871 4.12319C4.34951 2.89375 5.76959 2.03692 7.34714 1.6805C8.92469 1.32407 10.5752 1.48714 12.0525 2.14539M6.75 8.25039L9 10.5004L16.5 3.00039" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

          <h2 className="text-xl font-medium text-gray-800">What happens next?</h2>
        </div>
        
        <div className="  rounded-lg p-4">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-400 font-medium">Your SPV will be submitted to our compliance team for review</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-400 font-medium">You'll receive an email confirmation within 24 hours</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-400 font-medium">Legal documents will be finalized and made available for download</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-400 font-medium">Once approved, you can begin inviting investors to your deal</span>
            </li>
          </ul>
        </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 "
          style={{ border: "0.5px solid #01373D" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.legalReviewConfirmed || !formData.termsAccepted || !formData.electronicSignature || isSubmitting}
          className="bg-[#00F0C3] hover:scale-102 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit for Review
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SPVStep7;
