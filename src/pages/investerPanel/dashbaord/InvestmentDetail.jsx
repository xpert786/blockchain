import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const InvestmentDetail = () => {
  const navigate = useNavigate();
  const { investmentId } = useParams();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestmentDetail = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        if (!investmentId) {
          setError("Investment ID is missing");
          setLoading(false);
          return;
        }

        console.log("Fetching investment detail for ID:", investmentId);
        const response = await axios.get(
          `${API_URL.replace(/\/$/, "")}/portfolio/${investmentId}/investment-detail/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Investment detail response:", response.data);
        console.log("Response data structure:", {
          hasData: !!response.data,
          hasSuccess: !!response.data?.success,
          hasDataField: !!response.data?.data,
          fullResponse: response.data
        });

        if (response.data) {
          // Check if data is nested in response.data.data
          if (response.data.success && response.data.data) {
            console.log("Setting investment from response.data.data");
            setInvestment(response.data.data);
          }
          // Check if data is directly in response.data
          else if (response.data.id || response.data.spv_id) {
            console.log("Setting investment from response.data directly");
            setInvestment(response.data);
          }
          // Check if data is in response.data.data without success field
          else if (response.data.data) {
            console.log("Setting investment from response.data.data (no success field)");
            setInvestment(response.data.data);
          }
          else {
            console.error("No investment data found in response structure");
            setError("No investment data found in response");
          }
        } else {
          console.error("No response data");
          setError("No response data received");
        }
      } catch (err) {
        console.error("Error fetching investment detail:", err);
        setError(err.response?.data?.detail || err.message || "Failed to fetch investment details");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentDetail();
  }, [investmentId]);

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

  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "active") {
      return "bg-green-500 text-white";
    } else if (statusLower.includes("pending")) {
      return "bg-yellow-500 text-white";
    } else if (statusLower.includes("closed")) {
      return "bg-gray-500 text-white";
    }
    return "bg-blue-500 text-white";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#748A91] font-poppins-custom">Loading investment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-poppins-custom mb-4">{error}</p>
        <button
          onClick={() => navigate("/investor-panel/portfolio")}
          className="px-4 py-2 bg-[#00F0C3] text-[#0A2A2E] rounded-lg font-medium font-poppins-custom hover:bg-green-600 transition-colors"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-[#748A91] font-poppins-custom mb-4">No investment data available</p>
        <button
          onClick={() => navigate("/investor-panel/portfolio")}
          className="px-4 py-2 bg-[#00F0C3] text-[#0A2A2E] rounded-lg font-medium font-poppins-custom hover:bg-green-600 transition-colors"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  console.log("Rendering InvestmentDetail with investment:", investment);

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/investor-panel/portfolio")}
            className="flex items-center gap-2 text-[#748A91] font-poppins-custom mb-4 hover:text-[#0A2A2E] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Portfolio
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
                {investment.spv_display_name || investment.spv_company_name || investment.syndicate_name || "Investment Details"}
              </h1>
              <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
                Complete investment information and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {investment.status && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium font-poppins-custom ${getStatusBadge(investment.status)}`}>
                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                </span>
              )}
              {investment.sector && (
                <span className="px-4 py-2 rounded-full text-sm font-medium font-poppins-custom bg-gray-100 text-[#0A2A2E] border border-gray-300">
                  {investment.sector.charAt(0).toUpperCase() + investment.sector.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Invested Amount</p>
            <p className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom">
              {investment.invested_amount_formatted || "$0"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Current Value</p>
            <p className="text-2xl font-semibold text-[#0A2A2E] font-poppins-custom">
              {investment.current_value_formatted || "$0"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Gain/Loss</p>
            <p className={`text-2xl font-semibold font-poppins-custom ${(investment.gain_loss_percentage || 0) >= 0 ? "text-[#22C55E]" : "text-[#ED1C24]"
              }`}>
              {investment.gain_loss_formatted || "$0 (0%)"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-[#748A91] font-poppins-custom mb-2">Return Percentage</p>
            <p className={`text-2xl font-semibold font-poppins-custom ${(investment.gain_loss_percentage || 0) >= 0 ? "text-[#22C55E]" : "text-[#ED1C24]"
              }`}>
              {investment.gain_loss_percentage ? `${investment.gain_loss_percentage >= 0 ? "+" : ""}${investment.gain_loss_percentage.toFixed(2)}%` : "0%"}
            </p>
          </div>
        </div>

        {/* Investment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">SPV Display Name</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.spv_display_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Company Name</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.spv_company_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Syndicate Name</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.syndicate_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Sector</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.sector ? investment.sector.charAt(0).toUpperCase() + investment.sector.slice(1) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Stage</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.stage ? investment.stage.charAt(0).toUpperCase() + investment.stage.slice(1) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Investment Type</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.investment_type ? investment.investment_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Status & Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Status</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.status ? investment.status.charAt(0).toUpperCase() + investment.status.slice(1) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">SPV Status</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.spv_status ? investment.spv_status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Is Active</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.is_active ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Created At</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {formatDate(investment.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Updated At</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {formatDate(investment.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Invested At</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.invested_at ? formatDate(investment.invested_at) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#748A91] font-poppins-custom mb-1">Last Updated</p>
                <p className="text-base text-[#0A2A2E] font-poppins-custom">
                  {investment.updated_ago || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
              <p className="text-xs text-[#748A91] font-poppins-custom mb-2">Invested Amount</p>
              <p className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">
                {investment.invested_amount_formatted || "$0"}
              </p>
              <p className="text-xs text-[#748A91] font-poppins-custom mt-1">
                {investment.invested_amount ? `$${parseFloat(investment.invested_amount).toLocaleString()}` : "$0"}
              </p>
            </div>
            <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
              <p className="text-xs text-[#748A91] font-poppins-custom mb-2">Current Value</p>
              <p className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom">
                {investment.current_value_formatted || "$0"}
              </p>
              <p className="text-xs text-[#748A91] font-poppins-custom mt-1">
                {investment.current_value ? `$${parseFloat(investment.current_value).toLocaleString()}` : "$0"}
              </p>
            </div>
            <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
              <p className="text-xs text-[#748A91] font-poppins-custom mb-2">Gain/Loss</p>
              <p className={`text-lg font-semibold font-poppins-custom ${(investment.gain_loss_percentage || 0) >= 0 ? "text-[#22C55E]" : "text-[#ED1C24]"
                }`}>
                {investment.gain_loss_formatted || "$0 (0%)"}
              </p>
              <p className="text-xs text-[#748A91] font-poppins-custom mt-1">
                {investment.gain_loss ? `$${parseFloat(investment.gain_loss).toLocaleString()}` : "$0"}
              </p>
            </div>
            <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
              <p className="text-xs text-[#748A91] font-poppins-custom mb-2">Return %</p>
              <p className={`text-lg font-semibold font-poppins-custom ${(investment.gain_loss_percentage || 0) >= 0 ? "text-[#22C55E]" : "text-[#ED1C24]"
                }`}>
                {investment.gain_loss_percentage ? `${investment.gain_loss_percentage >= 0 ? "+" : ""}${investment.gain_loss_percentage.toFixed(2)}%` : "0%"}
              </p>
              <p className="text-xs text-[#748A91] font-poppins-custom mt-1">
                {investment.gain_loss_percentage ? `${investment.gain_loss_percentage >= 0 ? "+" : ""}${investment.gain_loss_percentage.toFixed(2)}%` : "0%"}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default InvestmentDetail;

