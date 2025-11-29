import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import { HomeIcon, InvitesIcon, PortfolioIcon, TaxesIcon, MessagesIcon, SettingsIcon, AlertsIcon } from "./icon.jsx";

const Wishlist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const investDropdownRef = useRef(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value || value === 0) return "$0";
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return "1 Day Ago";
      if (diffDays < 7) return `${diffDays} Days Ago`;
      if (diffDays < 14) return "1 Week Ago";
      if (diffDays < 21) return "2 Weeks Ago";
      if (diffDays < 30) return "3 Weeks Ago";
      if (diffDays < 60) return "1 Month Ago";
      if (diffDays < 90) return "2 Months Ago";
      return `${Math.floor(diffDays / 30)} Months Ago`;
    } catch (e) {
      return dateString;
    }
  };

  // Delete item from wishlist
  const deleteWishlistItem = async (spvId) => {
    if (!spvId) {
      console.error("No SPV ID provided for wishlist deletion");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        console.error("No access token found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/dashboard/delete_wishlist/?spv_id=${spvId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Wishlist item deleted successfully");
        // Remove item from local state
        setWishlistItems(prev => prev.filter(item => (item.id !== spvId && item.spvId !== spvId)));
      } else {
        const errorText = await response.text();
        console.error("Failed to delete wishlist item:", response.status, errorText);
        // Optionally show error message to user
      }
    } catch (err) {
      console.error("Error deleting wishlist item:", err);
      // Optionally show error message to user
    }
  };

  // Fetch wishlist from API
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/dashboard/wishlist/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Wishlist API response:", data);
        
        // Map API response to component data structure
        const mappedItems = data.results?.map(item => ({
          id: item.id || item.spv_id,
          spvId: item.spv_id,
          name: item.syndicate_name || item.company_name || "Unnamed Deal",
          estimatedMin: formatCurrency(item.min_investment),
          updates: item.updates || "0 New",
          added: formatDate(item.added_at || item.created_at),
          tags: [
            ...(item.tags || []),
            item.sector,
            item.stage
          ].filter(Boolean),
          statusTag: item.status === "Active" ? "Watching" : item.status === "Pending" ? "Available Soon" : "Invite Only",
          statusTagColor: item.status === "Active" ? "purple" : item.status === "Pending" ? "blue" : "dark",
          rawData: item // Keep raw data for navigation
        })) || [];

        setWishlistItems(mappedItems);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch wishlist:", response.status, errorText);
        setError("Failed to load wishlist. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message || "Network error loading wishlist.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (investDropdownRef.current && !investDropdownRef.current.contains(event.target)) {
        setShowInvestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pendingCount = wishlistItems.filter(item => item.statusTag === "Watching" || item.statusTag === "Available Soon").length;

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">


      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 bg-white rounded-lg p-4 sm:p-6">
          <div>
            <h1 className="text-3xl sm:text-4xl text-[#0A2A2E] font-poppins-custom mb-2">
              Investment <span className="text-[#9889FF]">Wishlist</span>
            </h1>
            <p className="text-sm sm:text-base text-[#748A91] font-poppins-custom">
              Track companies and deals you're interested in
            </p>
          </div>
          <div className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-[#0A2A2E] rounded-lg font-medium font-poppins-custom text-center"
          style={{border: "1px solid #D1D5DB"}}
          >
            {pendingCount} Pending
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No items in your wishlist yet.</p>
            </div>
          ) : (
            wishlistItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              {/* Top Row: Company Name and Tags */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A2A2E] font-poppins-custom">
                  {item.name}
                </h3>
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 rounded-full text-xs font-medium font-poppins-custom bg-gray-100 text-[#0A2A2E] border border-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom text-white ${
                      item.statusTagColor === "purple"
                        ? "bg-[#9889FF]"
                        : item.statusTagColor === "blue"
                        ? "bg-blue-500"
                        : "bg-gray-800"
                    }`}
                  >
                    {item.statusTag}
                  </span>
                </div>
              </div>

              {/* Details Row: Estimated Min, Updates, Added */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Estimated Min</p>
                  <p className="text-sm sm:text-base font-semibold text-[#0A2A2E] font-poppins-custom">{item.estimatedMin}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Updates</p>
                  <p className="text-sm sm:text-base font-medium text-[#0A2A2E] font-poppins-custom">{item.updates}</p>
                </div>
                <div className="bg-[#F9F8FF] rounded-lg p-3 sm:p-2 flex flex-row items-center justify-between"
                style={{border: "0.5px solid #E2E2FB"}}
                >
                  <p className="text-xs text-[#748A91] font-poppins-custom">Added</p>
                  <p className="text-sm sm:text-base font-medium text-[#0A2A2E] font-poppins-custom">{item.added}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2.5 bg-[#00F0C3] text-[#0A2A2E] rounded-lg hover:bg-[#00d4a8] transition-colors font-medium font-poppins-custom flex items-center gap-2 text-sm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.725 15.75C7.85054 15.9783 8.03509 16.1688 8.25937 16.3014C8.48365 16.434 8.73943 16.504 9 16.504C9.26057 16.504 9.51635 16.434 9.74063 16.3014C9.96491 16.1688 10.1495 15.9783 10.275 15.75M4.5 6C4.5 4.80653 4.97411 3.66193 5.81802 2.81802C6.66193 1.97411 7.80653 1.5 9 1.5C10.1935 1.5 11.3381 1.97411 12.182 2.81802C13.0259 3.66193 13.5 4.80653 13.5 6C13.5 11.25 15.75 12.75 15.75 12.75H2.25C2.25 12.75 4.5 11.25 4.5 6Z" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                  Set Alert
                </button>
                <button className="px-4 py-2.5 bg-[#F4F6F5] text-[#0A2A2E]  rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins-custom text-sm"
                 style={{border: "0.5px solid #01373D"}}>
                  View Updates
                </button >
                <button 
                  onClick={() => deleteWishlistItem(item.id || item.spvId)}
                  className="w-10 h-10 bg-[#F4F6F5] text-[#0A2A2E] rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                  style={{border: "0.5px solid #01373D"}}
                  title="Remove from wishlist"
                >
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 3H11.75M10.5 3V11.75C10.5 12.375 9.875 13 9.25 13H3C2.375 13 1.75 12.375 1.75 11.75V3M3.625 3V1.75C3.625 1.125 4.25 0.5 4.875 0.5H7.375C8 0.5 8.625 1.125 8.625 1.75V3M4.875 6.125V9.875M7.375 6.125V9.875" stroke="#001D21" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;

