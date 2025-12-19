import React, { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "$0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000).toFixed(1)}K`;
  return `${value < 0 ? "-" : ""}$${abs.toFixed(0)}`;
};

const formatNumber = (value, fallback = "0") => {
  if (value === undefined || value === null) return fallback;
  return value.toLocaleString();
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const getStatusBadgeColor = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("draft")) return "bg-gray-200 text-gray-800";
  if (normalized.includes("raising")) return "bg-[#22C55E] text-white";
  if (normalized.includes("ready")) return "bg-[#FFD97A] text-white";
  if (normalized.includes("closing")) return "bg-[#ED1C24] text-white";
  return "bg-gray-200 text-gray-800";
};

const getPendingStatusDot = (status = "") => {
  const normalized = status.toLowerCase();
  if (normalized.includes("KYB")) return "bg-[#9FD2FF]";
  if (normalized.includes("closing")) return "bg-[#82EEAA]";
  if (normalized.includes("document")) return "bg-[#FFD97A]";
  return "bg-[#E2E2FB]";
};

const getBreakdownColor = (index) => {
  const palette = ["bg-[#9FD2FF]", "bg-[#FFD97A]", "bg-[#82EEAA]", "bg-[#FFB6C1]", "bg-[#D1FADF]"];
  return palette[index % palette.length];
};

// Icon components for metrics
const MetricIcons = {
  spvs: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22M6 22H18M6 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V14C2 13.4696 2.21071 12.9609 2.58579 12.5858C2.96086 12.2107 3.46957 12 4 12H6M18 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H18M10 6H14M10 10H14M10 14H14M10 18H14" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  aum: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#01373D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  investors: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  investment: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 7L13.5 15.5L8.5 10.5L2 17M22 7H16M22 7V13" stroke="#01373D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("my-spvs");
  const [viewMode, setViewMode] = useState("grid");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSpv, setSelectedSpv] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Please log in to view your dashboard.");
        }
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const finalUrl = `${API_URL.replace(/\/$/, "")}/spv/dashboard/`;
        const response = await fetch(finalUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary;

  const metrics = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "My SPVs",
        value: formatNumber(summary.my_spvs_count || 0),
        change: `Target ${formatCurrency(summary.total_target || 0)}`,
        icon: MetricIcons.spvs,
        bgColor: "bg-[#D6EEF9]",
        iconColor: "text-[#01373D]"
      },
      {
        title: "Total AUM",
        value: formatCurrency(summary.total_aum || 0),
        change: `Goal ${formatCurrency(summary.total_target || 0)}`,
        icon: MetricIcons.aum,
        bgColor: "bg-[#D7F8F0]",
        iconColor: "text-[#01373D]"
      },
      {
        title: "Active Investors",
        value: formatNumber(summary.active_investors || 0),
        change: "Active investors",
        icon: MetricIcons.investors,
        bgColor: "bg-[#E2E2FB]",
        iconColor: "text-[#01373D]"
      },
      {
        title: "Avg. Investment",
        value: formatCurrency(summary.average_investment || 0),
        change: summary.last_updated
          ? `Updated ${new Date(summary.last_updated).toLocaleDateString()}`
          : "No data",
        icon: MetricIcons.investment,
        bgColor: "bg-[#FFEFE8]",
        iconColor: "text-[#01373D]"
      }
    ];
  }, [summary]);

  const allSpvs =
    dashboardData?.sections?.my_spvs?.map((spv) => ({
      id: spv.code || spv.id || "SPV",
      name: spv.name,
      created: spv.created_at ? new Date(spv.created_at).toLocaleDateString() : spv.created,
      current: formatCurrency(spv.my_commitment ?? spv.current ?? 0),
      target: `${formatCurrency(spv.target_amount ?? spv.target ?? 0)}${spv.target_currency ? ` ${spv.target_currency}` : ""}`,
      investors: spv.investor_count ?? spv.investors ?? 0,
      progress: Math.round(spv.progress_percent ?? spv.progress ?? 0),
      status: spv.status_label || spv.status,
      statusColor: getStatusBadgeColor(spv.status_label || spv.status)
    })) ?? [];

  // Filter SPVs based on search query and status filter
  const spvs = useMemo(() => {
    if (!allSpvs) return [];
    
    let filtered = allSpvs;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((spv) => {
        return (
          spv.name?.toLowerCase().includes(query) ||
          spv.id?.toLowerCase().includes(query) ||
          spv.status?.toLowerCase().includes(query)
        );
      });
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((spv) => {
        const status = (spv.status || "").toLowerCase();
        if (filterStatus === "raising") return status.includes("raising");
        if (filterStatus === "ready") return status.includes("ready");
        if (filterStatus === "closing") return status.includes("closing");
        if (filterStatus === "draft") return status.includes("draft");
        return true;
      });
    }

    return filtered;
  }, [allSpvs, searchQuery, filterStatus]);

  const pendingActions =
    dashboardData?.sections?.pending_actions?.map((action) => ({
      id: action.id,
      type: action.title,
      user: action.user || action.action_required?.replace(/_/g, " "),
      project: action.spv_id ? `SPV-${action.spv_id}` : "",
      amount: action.description,
      description: action.description,
      timeAgo: formatRelativeTime(action.updated_at),
      statusDot: getPendingStatusDot(action.status)
    })) ?? [];

  const analyticsData = dashboardData?.sections?.analytics ?? null;
  const totalFundsRaised = analyticsData?.performance_overview?.total_funds_raised ?? 0;
  const totalTargetAmount = analyticsData?.performance_overview?.total_target ?? 0;
  const averageProgressPercent = analyticsData?.performance_overview?.average_progress_percent ?? 0;
  const successRatePercent = analyticsData?.performance_overview?.success_rate_percent ?? 0;
  const statusBreakdown = analyticsData?.status_breakdown ?? [];
  const analyticsActiveInvestors = analyticsData?.active_investors ?? 0;
  const progressCircumference = 2 * Math.PI * 40;
  // Calculate progress percentage: funds raised vs target
  const fundsRaisedPercent = totalTargetAmount > 0 
    ? Math.min((totalFundsRaised / totalTargetAmount) * 100, 100)
    : 0;
  const progressOffset =
    progressCircumference * (1 - Math.min(Math.max(fundsRaisedPercent, 0), 100) / 100);

  const getProgressColor = (status = "") => {
    const normalized = status.toLowerCase();
    if (normalized.includes("draft")) return "bg-gray-400";
    if (normalized.includes("raising")) return "bg-[#22C55E]";
    if (normalized.includes("ready")) return "bg-[#FFD97A]";
    if (normalized.includes("closing")) return "bg-[#ED1C24]";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading latest dashboard data...
        </div>
      )}
      {/* Business Verification Banner */}
      <div className="bg-[#D7F8F0] border border-green-200 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#01373D"/>
            <g clip-path="url(#clip0_1485_395)">
            <path d="M29.7563 25.9106C30.5219 24.8686 30.9724 23.5816 30.966 22.1918C30.9501 18.7416 28.1402 15.9575 24.69 15.9736C21.2559 15.9896 18.4879 18.7577 18.4721 22.1918C18.4561 25.6418 21.24 28.4515 24.69 28.4675C26.7662 28.4772 28.6127 27.4671 29.7563 25.9106ZM29.7563 25.9106L32.1864 28.5256M12.8353 14.7532H20.4479M12.8353 18.5304H16.7287M12.8353 22.2496H15.5084M21.8425 21.9299L23.8764 23.4699L27.5084 20.6805M27.1307 16.3803V12.1672C27.1307 10.8835 26.09 9.84277 24.8062 9.84277H12.1379C10.8542 9.84277 9.81348 10.8835 9.81348 12.1672V29.8331C9.81348 31.1168 10.8542 32.1575 12.1379 32.1575H24.8062C26.09 32.1575 27.1307 31.1168 27.1307 29.8331V28.0607" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_1485_395">
            <rect width="24" height="24" fill="white" transform="translate(9 9)"/>
            </clipPath>
            </defs>
         </svg>

            <div>
              <h3 className="text-lg font-semibold text-black">Complete Your Business Verification (KYB)</h3>
              <p className="text-[#748A91]">To Continue Creating SPVs And Managing Investors, Please Verify Your Business Details.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-2 rounded-lg font-medium transition-colors text-center">
              Complete Verification
            </button>
            <button className="bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-lg font-medium transition-colors text-center"
                style={{border: "0.5px solid #01373D"}}>
              Remind Later
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
    <div>
        <h1 className="text-3xl font-medium text-[#9889FF] mb-2">Syndicate Manager  <span className="text-black">Dashboard</span></h1>
        <p className="text-gray-600 mb-6">Manage your SPVs and investor relationships</p>
      </div>
      {/* Metrics Cards */}
      {metrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className={`${metric.bgColor} rounded-lg p-4 sm:p-6 min-h-[140px] flex flex-col justify-between`}>
              {/* Top Row - Title and Icon */}
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-gray-600 font-medium">{metric.title}</p>
                <div className={`${metric.iconColor} flex-shrink-0`}>
                  {typeof metric.icon === 'function' ? metric.icon() : null}
                </div>
              </div>
              
              {/* Bottom Row - Large Number and Change */}
              <div className="flex flex-col gap-2">
                <p className="text-2xl sm:text-3xl font-bold text-[#01373D] break-words">{metric.value}</p>
                <p className="text-xs sm:text-sm text-[#34D399] font-medium break-words">{metric.change}</p>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-8 text-gray-500">
          No metrics data available
        </div>
      )}
      </div> 

      <div className="bg-white rounded-lg p-3 sm:p-4 w-fit">
                       {/* Tab Navigation */}
        <div className="flex items-center justify-between w-fit">
          <div className="flex flex-wrap gap-2 w-fit">
            <button
              onClick={() => setActiveTab("my-spvs")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "my-spvs"
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-50"
              }`}
            >
              My SPVs
            </button>
            <button
              onClick={() => setActiveTab("pending-actions")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "pending-actions"
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pending Actions
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "analytics"
                  ? "bg-[#00F0C3] text-black"
                  : "bg-[#F4F6F5] text-gray-700 hover:bg-gray-50"
              }`}
            >
              Analytics
            </button>
          </div>

         
        </div>
      </div>
       

        {/* Search and Controls - Only show for My SPVs tab */}
        {activeTab === "my-spvs" && (
          <div className="flex flex-col gap-4">
            {/* Results Count */}
            {(searchQuery || filterStatus !== "all") && (
              <div className="text-sm text-gray-600">
                Found {spvs.length} {spvs.length === 1 ? "SPV" : "SPVs"}
                {searchQuery && ` matching "${searchQuery}"`}
                {filterStatus !== "all" && ` with status "${filterStatus}"`}
              </div>
            )}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search SPVs by name, ID, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                    filterStatus !== "all"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  <span>Filter</span>
                  {filterStatus !== "all" && (
                    <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </button>
                {showFilterMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 mb-1">
                          Filter by Status
                        </div>
                        {["all", "raising", "ready", "closing", "draft"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              filterStatus === status
                                ? "bg-purple-50 text-purple-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {status === "all"
                              ? "All Statuses"
                              : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                        {filterStatus !== "all" && (
                          <button
                            onClick={() => {
                              setFilterStatus("all");
                              setShowFilterMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 mt-1 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg border transition-colors ${
                    viewMode === "grid" ? "bg-[#01373D] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  {viewMode === "grid" ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 1H1V4H17V1ZM1 0C0.734784 0 0.480429 0.105357 0.292892 0.292893C0.105356 0.48043 0 0.734784 0 1V4C0 4.26522 0.105356 4.51957 0.292892 4.70711C0.480429 4.89464 0.734784 5 1 5H17C17.2653 5 17.5196 4.89464 17.7072 4.70711C17.8947 4.51957 18 4.26522 18 4V1C18 0.734784 17.8947 0.48043 17.7072 0.292893C17.5196 0.105357 17.2653 0 17 0H1Z" fill="white"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 7.5H1V10.5H17V7.5ZM1 6.5C0.734784 6.5 0.480429 6.60536 0.292892 6.79289C0.105356 6.98043 0 7.23478 0 7.5V10.5C0 10.7652 0.105356 11.0196 0.292892 11.2071C0.480429 11.3946 0.734784 11.5 1 11.5H17C17.2653 11.5 17.5196 11.3946 17.7072 11.2071C17.8947 11.0196 18 10.7652 18 10.5V7.5C18 7.23478 17.8947 6.98043 17.7072 6.79289C17.5196 6.60536 17.2653 6.5 17 6.5H1Z" fill="white"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 14H1V17H17V14ZM1 13C0.734784 13 0.480429 13.1054 0.292892 13.2929C0.105356 13.4804 0 13.7348 0 14V17C0 17.2652 0.105356 17.5196 0.292892 17.7071C0.480429 17.8946 0.734784 18 1 18H17C17.2653 18 17.5196 17.8946 17.7072 17.7071C17.8947 17.5196 18 17.2652 18 17V14C18 13.7348 17.8947 13.4804 17.7072 13.2929C17.5196 13.1054 17.2653 13 17 13H1Z" fill="white"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 1H1V4H17V1ZM1 0C0.734784 0 0.480429 0.105357 0.292892 0.292893C0.105356 0.48043 0 0.734784 0 1V4C0 4.26522 0.105356 4.51957 0.292892 4.70711C0.480429 4.89464 0.734784 5 1 5H17C17.2653 5 17.5196 4.89464 17.7072 4.70711C17.8947 4.51957 18 4.26522 18 4V1C18 0.734784 17.8947 0.48043 17.7072 0.292893C17.5196 0.105357 17.2653 0 17 0H1Z" fill="#748A91"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 7.5H1V10.5H17V7.5ZM1 6.5C0.734784 6.5 0.480429 6.60536 0.292892 6.79289C0.105356 6.98043 0 7.23478 0 7.5V10.5C0 10.7652 0.105356 11.0196 0.292892 11.2071C0.480429 11.3946 0.734784 11.5 1 11.5H17C17.2653 11.5 17.5196 11.3946 17.7072 11.2071C17.8947 11.0196 18 10.7652 18 10.5V7.5C18 7.23478 17.8947 6.98043 17.7072 6.79289C17.5196 6.60536 17.2653 6.5 17 6.5H1Z" fill="#748A91"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M17 14H1V17H17V14ZM1 13C0.734784 13 0.480429 13.1054 0.292892 13.2929C0.105356 13.4804 0 13.7348 0 14V17C0 17.2652 0.105356 17.5196 0.292892 17.7071C0.480429 17.8946 0.734784 18 1 18H17C17.2653 18 17.5196 17.8946 17.7072 17.7071C17.8947 17.5196 18 17.2652 18 17V14C18 13.7348 17.8947 13.4804 17.7072 13.2929C17.5196 13.1054 17.2653 13 17 13H1Z" fill="#748A91"/>
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg border transition-colors ${
                    viewMode === "list" ? "bg-[#01373D] border-transparent text-[#01373D]" : "bg-white border-gray-200 text-gray-600"
                  }`}
                >
                  {viewMode === "list" ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M7 4H4V7H7V4ZM4 3C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H7C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7V4C8 3.73478 7.89464 3.48043 7.70711 3.29289C7.51957 3.10536 7.26522 3 7 3H4ZM7 10.5H4V13.5H7V10.5ZM4 9.5C3.73478 9.5 3.48043 9.60536 3.29289 9.79289C3.10536 9.98043 3 10.2348 3 10.5V13.5C3 13.7652 3.10536 14.0196 3.29289 14.2071C3.48043 14.3946 3.73478 14.5 4 14.5H7C7.26522 14.5 7.51957 14.3946 7.70711 14.2071C7.89464 14.0196 8 13.7652 8 13.5V10.5C8 10.2348 7.89464 9.98043 7.70711 9.79289C7.51957 9.60536 7.26522 9.5 7 9.5H4ZM7 17H4V20H7V17ZM4 16C3.73478 16 3.48043 16.1054 3.29289 16.2929C3.10536 16.4804 3 16.7348 3 17V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.4804 20.8946 3.7348 21 4 21H7C7.2652 21 7.5196 20.8946 7.7071 20.7071C7.8946 20.5196 8 20.2652 8 20V17C8 16.7348 7.8946 16.4804 7.7071 16.2929C7.5196 16.1054 7.2652 16 7 16H4ZM13.5 4H10.5V7H13.5V4ZM10.5 3C10.2348 3 9.98043 3.10536 9.79289 3.29289C9.60536 3.48043 9.5 3.73478 9.5 4V7C9.5 7.26522 9.60536 7.51957 9.79289 7.70711C9.98043 7.89464 10.2348 8 10.5 8H13.5C13.7652 8 14.0196 7.89464 14.2071 7.70711C14.3946 7.51957 14.5 7.26522 14.5 7V4C14.5 3.73478 14.3946 3.48043 14.2071 3.29289C14.0196 3.10536 13.7652 3 13.5 3H10.5ZM13.5 10.5H10.5V13.5H13.5V10.5ZM10.5 9.5C10.2348 9.5 9.98043 9.60536 9.79289 9.79289C9.60536 9.98043 9.5 10.2348 9.5 10.5V13.5C9.5 13.7652 9.60536 14.0196 9.79289 14.2071C9.98043 14.3946 10.2348 14.5 10.5 14.5H13.5C13.7652 14.5 14.0196 14.3946 14.2071 14.2071C14.3946 14.0196 14.5 13.7652 14.5 13.5V10.5C14.5 10.2348 14.3946 9.98043 14.2071 9.79289C14.0196 9.60536 13.7652 9.5 13.5 9.5H10.5ZM13.5 17H10.5V20H13.5V17ZM10.5 16C10.2348 16 9.98043 16.1054 9.79289 16.2929C9.60536 16.4804 9.5 16.7348 9.5 17V20C9.5 20.2652 9.60536 20.5196 9.79289 20.7071C9.98043 20.8946 10.2348 21 10.5 21H13.5C13.7652 21 14.0196 20.8946 14.2071 20.7071C14.3946 20.5196 14.5 20.2652 14.5 20V17C14.5 16.7348 14.3946 16.4804 14.2071 16.2929C14.0196 16.1054 13.7652 16 13.5 16H10.5ZM20 4H17V7H20V4ZM17 3C16.7348 3 16.4804 3.10536 16.2929 3.29289C16.1054 3.48043 16 3.73478 16 4V7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H17ZM20 10.5H17V13.5H20V10.5ZM17 9.5C16.7348 9.5 16.4804 9.60536 16.2929 9.79289C16.1054 9.98043 16 10.2348 16 10.5V13.5C16 13.7652 16.1054 14.0196 16.2929 14.2071C16.4804 14.3946 16.7348 14.5 17 14.5H20C20.2652 14.5 20.5196 14.3946 20.7071 14.2071C20.8946 14.0196 21 13.7652 21 13.5V10.5C21 10.2348 20.8946 9.98043 20.7071 9.79289C20.5196 9.60536 20.2652 9.5 20 9.5H17ZM20 17H17V20H20V17ZM17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17V20C16 20.2652 16.1054 20.5196 16.2929 20.7071C16.4804 20.8946 16.7348 21 17 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V17C21 16.7348 20.8946 16.4804 20.7071 16.2929C20.5196 16.1054 20.2652 16 20 16H17Z" fill="#FFFFFF"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M7 4H4V7H7V4ZM4 3C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H7C7.26522 8 7.51957 7.89464 7.70711 7.70711C7.89464 7.51957 8 7.26522 8 7V4C8 3.73478 7.89464 3.48043 7.70711 3.29289C7.51957 3.10536 7.26522 3 7 3H4ZM7 10.5H4V13.5H7V10.5ZM4 9.5C3.73478 9.5 3.48043 9.60536 3.29289 9.79289C3.10536 9.98043 3 10.2348 3 10.5V13.5C3 13.7652 3.10536 14.0196 3.29289 14.2071C3.48043 14.3946 3.73478 14.5 4 14.5H7C7.26522 14.5 7.51957 14.3946 7.70711 14.2071C7.89464 14.0196 8 13.7652 8 13.5V10.5C8 10.2348 7.89464 9.98043 7.70711 9.79289C7.51957 9.60536 7.26522 9.5 7 9.5H4ZM7 17H4V20H7V17ZM4 16C3.73478 16 3.48043 16.1054 3.29289 16.2929C3.10536 16.4804 3 16.7348 3 17V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.4804 20.8946 3.7348 21 4 21H7C7.2652 21 7.5196 20.8946 7.7071 20.7071C7.8946 20.5196 8 20.2652 8 20V17C8 16.7348 7.8946 16.4804 7.7071 16.2929C7.5196 16.1054 7.2652 16 7 16H4ZM13.5 4H10.5V7H13.5V4ZM10.5 3C10.2348 3 9.98043 3.10536 9.79289 3.29289C9.60536 3.48043 9.5 3.73478 9.5 4V7C9.5 7.26522 9.60536 7.51957 9.79289 7.70711C9.98043 7.89464 10.2348 8 10.5 8H13.5C13.7652 8 14.0196 7.89464 14.2071 7.70711C14.3946 7.51957 14.5 7.26522 14.5 7V4C14.5 3.73478 14.3946 3.48043 14.2071 3.29289C14.0196 3.10536 13.7652 3 13.5 3H10.5ZM13.5 10.5H10.5V13.5H13.5V10.5ZM10.5 9.5C10.2348 9.5 9.98043 9.60536 9.79289 9.79289C9.60536 9.98043 9.5 10.2348 9.5 10.5V13.5C9.5 13.7652 9.60536 14.0196 9.79289 14.2071C9.98043 14.3946 10.2348 14.5 10.5 14.5H13.5C13.7652 14.5 14.0196 14.3946 14.2071 14.2071C14.3946 14.0196 14.5 13.7652 14.5 13.5V10.5C14.5 10.2348 14.3946 9.98043 14.2071 9.79289C14.0196 9.60536 13.7652 9.5 13.5 9.5H10.5ZM13.5 17H10.5V20H13.5V17ZM10.5 16C10.2348 16 9.98043 16.1054 9.79289 16.2929C9.60536 16.4804 9.5 16.7348 9.5 17V20C9.5 20.2652 9.60536 20.5196 9.79289 20.7071C9.98043 20.8946 10.2348 21 10.5 21H13.5C13.7652 21 14.0196 20.8946 14.2071 20.7071C14.3946 20.5196 14.5 20.2652 14.5 20V17C14.5 16.7348 14.3946 16.4804 14.2071 16.2929C14.0196 16.1054 13.7652 16 13.5 16H10.5ZM20 4H17V7H20V4ZM17 3C16.7348 3 16.4804 3.10536 16.2929 3.29289C16.1054 3.48043 16 3.73478 16 4V7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H17ZM20 10.5H17V13.5H20V10.5ZM17 9.5C16.7348 9.5 16.4804 9.60536 16.2929 9.79289C16.1054 9.98043 16 10.2348 16 10.5V13.5C16 13.7652 16.1054 14.0196 16.2929 14.2071C16.4804 14.3946 16.7348 14.5 17 14.5H20C20.2652 14.5 20.5196 14.3946 20.7071 14.2071C20.8946 14.0196 21 13.7652 21 13.5V10.5C21 10.2348 20.8946 9.98043 20.7071 9.79289C20.5196 9.60536 20.2652 9.5 20 9.5H17ZM20 17H17V20H20V17ZM17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17V20C16 20.2652 16.1054 20.5196 16.2929 20.7071C16.4804 20.8946 16.7348 21 17 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V17C21 16.7348 20.8946 16.4804 20.7071 16.2929C20.5196 16.1054 20.2652 16 20 16H17Z" fill="#748A91"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            </div>
          </div>
        )}
     
      {/* Content Area - Different content based on active tab */}
      <div className="rounded-lg py-2">
        {activeTab === "my-spvs" ? (
          /* SPV Content - Grid or List View */
          spvs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No SPVs found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You don't have any SPVs yet."}
              </p>
              {(searchQuery || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
          <div className="space-y-2">
            {spvs.map((spv, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{spv.name}</h3>
                    <p className="text-sm text-gray-500">{spv.id} • Created {spv.created}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${spv.statusColor}`}>
                      {spv.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSpv(spv);
                        setShowViewModal(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Key Metrics Section */}
                <div className="bg-[#F9F8FF] rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">My SPVs</p>
                      <p className="text-lg font-semibold text-gray-800">{spv.current}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target</p>
                      <p className="text-xs text-gray-800">{spv.target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investors</p>
                      <p className="text-lg font-semibold text-gray-800">{spv.investors}</p>
                    </div>
                  </div>
                </div>

                {/* Funding Progress Section */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Funding Progress</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-[#CEC6FF] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(spv.status)}`}
                          style={{ width: `${spv.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{spv.progress}%</span>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
                  <button className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span>Manage Investors</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSpv(spv);
                      setShowDocumentsModal(true);
                    }}
                    className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Documents</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closing</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spvs.map((spv, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{spv.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${spv.statusColor}`}>
                          {spv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spv.created}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spv.progress}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spv.current}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spv.investors}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spv.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )
        ) : activeTab === "pending-actions" ? (
          /* Pending Actions Content */
          <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Pending Actions</h2>
              <p className="text-gray-600">Items requiring your review and approval</p>
            </div>

            {/* Pending Actions List */}
            {pendingActions.length > 0 ? (
              <div className="space-y-3">
                {pendingActions.map((action, index) => (
                  <div key={index} className="bg-[#F9F8FF] border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left Side - Status and Details */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${action.statusDot}`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.type}</h3>
                        <p className="text-sm text-gray-600">
                          {[action.user, action.project, action.amount].filter(Boolean).join(" • ") ||
                            action.description ||
                            "Pending action"}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-gray-500">{action.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex items-center space-x-2 justify-end">
                      <button className="px-4 py-2 border bg-[#F4F6F5] border-[#01373D] text-black rounded-lg transition-colors">
                        View
                      </button>
                      <button className="px-4 py-2 bg-[#ED1C2429] text-[#ED1C24] border border-[#ED1C24] rounded-lg hover:bg-red-600 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Actions</h3>
                <p className="text-gray-600">You're all caught up! There are no items requiring your review at this time.</p>
              </div>
            )}
          </div>
        ) : (
          /* Analytics Content */
          <div className="w-full">
            {analyticsData ? (
              /* Performance Overview Card */
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">Performance Overview</h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-8 gap-6">
                  {/* Circular Progress Chart */}
                  <div className="relative flex-shrink-0 mx-auto sm:mx-0 w-48 h-48 sm:w-64 sm:h-64">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#00F0C3"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={progressCircumference}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {formatCurrency(totalFundsRaised)}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          of {formatCurrency(totalTargetAmount)} target
                        </p>
                        <p className="text-sm font-semibold text-[#00F0C3]">
                          {fundsRaisedPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics List */}
                  <div className="flex-1 space-y-3 max-w-md">
                    {statusBreakdown.length > 0 ? (
                      statusBreakdown.map((item, index) => (
                        <div
                          key={`${item.status}-${index}`}
                          className="flex items-center space-x-3 bg-[#F9F8FF] rounded-lg p-3 border border-[#E2E2FB]"
                        >
                          <div className={`w-3 h-3 rounded-full ${getBreakdownColor(index)}`}></div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium capitalize">{item.label || item.status}</span>
                            <p className="text-xs text-gray-500">
                              {formatNumber(item.count || 0)} SPVs • {formatCurrency(item.total_allocation || 0)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : null}
                    <div className="rounded-lg border border-[#E2E2FB] p-3 text-sm text-gray-700 bg-[#F9F8FF]">
                      Success Rate: <span className="font-semibold">{successRatePercent}%</span>
                    </div>
                    <div className="rounded-lg border border-[#E2E2FB] p-3 text-sm text-gray-700 bg-[#F9F8FF]">
                      Active Investors: <span className="font-semibold">{formatNumber(analyticsActiveInvestors)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
                  <p className="text-gray-600">Analytics data will appear here once you have SPVs and activity.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDocumentsModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
                  {selectedSpv && (
                    <p className="text-sm text-gray-600 mt-1">{selectedSpv.name}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md">
                    There are no documents uploaded for this SPV yet. Documents will appear here once they are added.
                  </p>
                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View SPV Details Modal */}
      {showViewModal && selectedSpv && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowViewModal(false)}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">SPV Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedSpv.name}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">SPV ID</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedSpv.statusColor}`}>
                          {selectedSpv.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Created Date</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.created}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Progress</p>
                        <p className="text-sm font-medium text-gray-900">{selectedSpv.progress}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Raised</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.current}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Target Amount</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.target}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Number of Investors</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedSpv.investors}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Progress</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{selectedSpv.progress}%</span>
                      </div>
                      <div className="w-full bg-[#CEC6FF] rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getProgressColor(selectedSpv.status)}`}
                          style={{ width: `${selectedSpv.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowDocumentsModal(true);
                  }}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  View Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
