import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {
  HomeIcon,
  InvitesIcon,
  PortfolioIcon,
  TaxesIcon,
  MessagesIcon,
  SettingsIcon,
  TaxDocumentsDownloadIcon,
  TaxDocumentsTickIcon,
  TaxDocumentsPendingIcon,
  CalendarIcon,
  DocumentCardIcon,
  AlertsIcon,
  ShareIcon,
  SendIcon,
  EyeIcon
} from "./icon.jsx";
import {
  taxSummaryCards,
  taxDocumentsList,
  taxCenterTabs,
  incomeBreakdown,
  deductionsBreakdown,
  taxPlanningTips,
  taxImportantDates,
  documentCenterTabs,
  documentCenterDocuments
} from "./taxDocumentsData";

const DOCUMENT_STATUS_FILTERS = [
  { id: "all", label: "All Statuses" },
  { id: "Approved", label: "Approved" },
  { id: "Pending", label: "Pending" }
];

const DOCUMENT_CATEGORY_COUNTS = documentCenterDocuments.reduce(
  (counts, doc) => {
    counts.all = (counts.all || 0) + 1;
    counts[doc.category] = (counts[doc.category] || 0) + 1;
    return counts;
  },
  { all: 0 }
);

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const topTabClasses = (isActive) =>
  `px-4 py-2 text-sm font-medium font-poppins-custom rounded-xl  transition-colors ${
    isActive ? "bg-[#00F0C3] text-black" : "bg-[#F4F6F5] text-[#01373D] hover:bg-[#E2E8F0]"
  }`;

const centerTabClasses = (isActive) =>
  `px-4 py-2 text-sm font-medium font-poppins-custom rounded-xl transition-colors ${
    isActive ? "bg-[#00F0C3] text-[#001D21]" : "bg-[#F4F6F5] text-[#001D21] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
  }`;

const TaxDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("taxes");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState("Taxes");
  const [activeCenterTab, setActiveCenterTab] = useState(taxCenterTabs[0]);
  const [activeDocumentCategory, setActiveDocumentCategory] = useState("all");
  const [documentStatusFilter, setDocumentStatusFilter] = useState("all");
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");
  const [taxOverview, setTaxOverview] = useState({
    total_income_formatted: "$0",
    total_income_label: "From Investments",
    total_deductions_formatted: "$0",
    total_deductions_label: "Investment Expenses",
    net_taxable_income_formatted: "$0",
    net_taxable_income_label: "After Deductions",
    estimated_tax_formatted: "$0",
    estimated_tax_label: "Approximate Liability"
  });
  const [taxOverviewLoading, setTaxOverviewLoading] = useState(true);
  const [taxDocuments, setTaxDocuments] = useState([]);
  const [taxDocumentsLoading, setTaxDocumentsLoading] = useState(true);

  const filteredDocuments = useMemo(() => {
    const searchTerm = documentSearchTerm.trim().toLowerCase();
    return documentCenterDocuments.filter((doc) => {
      const matchesCategory = activeDocumentCategory === "all" || doc.category === activeDocumentCategory;
      const matchesStatus = documentStatusFilter === "all" || doc.status.toLowerCase() === documentStatusFilter.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        doc.title.toLowerCase().includes(searchTerm) ||
        (doc.fund && doc.fund.toLowerCase().includes(searchTerm));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeDocumentCategory, documentStatusFilter, documentSearchTerm, documentCenterDocuments]);

  useEffect(() => {
    if (location.pathname.includes("/investor-panel/invest")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/portfolio")) {
      setActiveNav("portfolio");
    } else if (location.pathname.includes("/investor-panel/top-syndicates")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/wishlist")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/invites")) {
      setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/notifications")) {
      setActiveNav("messages");
    } else {
      setActiveNav("taxes");
    }
  }, [location.pathname]);

  // Fetch tax overview data
  useEffect(() => {
    const fetchTaxOverview = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          console.error("No access token found");
          setTaxOverviewLoading(false);
          return;
        }

        const currentYear = new Date().getFullYear();
        const response = await axios.get(
          `${API_URL.replace(/\/$/, "")}/tax/overview/?year=${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          setTaxOverview({
            total_income_formatted: response.data.total_income_formatted || "$0",
            total_income_label: response.data.total_income_label || "From Investments",
            total_deductions_formatted: response.data.total_deductions_formatted || "$0",
            total_deductions_label: response.data.total_deductions_label || "Investment Expenses",
            net_taxable_income_formatted: response.data.net_taxable_income_formatted || "$0",
            net_taxable_income_label: response.data.net_taxable_income_label || "After Deductions",
            estimated_tax_formatted: response.data.estimated_tax_formatted || "$0",
            estimated_tax_label: response.data.estimated_tax_label || "Approximate Liability"
          });
        }
      } catch (error) {
        console.error("Error fetching tax overview:", error);
      } finally {
        setTaxOverviewLoading(false);
      }
    };

    fetchTaxOverview();
  }, []);

  // Fetch tax documents
  useEffect(() => {
    const fetchTaxDocuments = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          console.error("No access token found");
          setTaxDocumentsLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL.replace(/\/$/, "")}/tax/documents/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.results) {
          setTaxDocuments(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching tax documents:", error);
      } finally {
        setTaxDocumentsLoading(false);
      }
    };

    fetchTaxDocuments();
  }, []);

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

  const handleDocumentClick = (document) => {
    navigate(`/investor-panel/tax-documents/${document.id}`, { state: { document } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderBreakdownCard = (data) => (
    <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6">
      <h3 className="text-lg font-medium text-[#0A2A2E] font-poppins-custom mb-4">{data.title}</h3>
      <div className="space-y-3 text-sm font-poppins-custom text-[#0A2A2E]">
        {data.items.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-[#748A91]">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
        <hr className="my-4 border-[#E5E7EB]" />
        <div className="flex justify-between font-medium">
          <span>{data.totalLabel}</span>
          <span>{data.totalValue}</span>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
   

      <main className="w-full px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 w-full sm:w-fit">
          {["Taxes", "Documents"].map((tab) => (
            <button key={tab} onClick={() => setActiveTopTab(tab)} className={topTabClasses(activeTopTab === tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTopTab === "Taxes" ? (
          <>
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 md:p-8 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-medium text-[#0A2A2E] font-poppins-custom">
                    Tax <span className="text-[#9889FF]">Center</span>
                  </h1>
                  <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                    Manage your investment tax documents and reporting
                  </p>
                </div>
                <button className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-xl font-medium text-sm font-poppins-custom hover:bg-[#00D9B0] transition-colors">
                  <TaxDocumentsDownloadIcon />
                  Download All
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Total Income Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "#CAE6FF", border: "0.5px solid #AED9FF" }}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#374151] font-poppins-custom mb-2">Total Income</p>
                    <DocumentCardIcon />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-2xl font-medium font-poppins-custom text-[#0A2A2E]">
                      {taxOverviewLoading ? "Loading..." : taxOverview.total_income_formatted}
                    </p>
                    <p className="text-xs text-[#748A91] font-poppins-custom mt-1" style={{ color: "#22C55E" }}>
                      {taxOverview.total_income_label}
                    </p>
                  </div>
                </div>

                {/* Total Deductions Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "#D7F8F0", border: "0.5px solid #AEFFEB" }}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#374151] font-poppins-custom mb-2">Total Deductions</p>
                    <DocumentCardIcon />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-2xl font-medium font-poppins-custom text-[#0A2A2E]">
                      {taxOverviewLoading ? "Loading..." : taxOverview.total_deductions_formatted}
                    </p>
                    <p className="text-xs text-[#748A91] font-poppins-custom mt-1" style={{ color: "#001D21" }}>
                      {taxOverview.total_deductions_label}
                    </p>
                  </div>
                </div>

                {/* Net Taxable Income Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "#E2E2FB", border: "0.5px solid #CFCFFF" }}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#374151] font-poppins-custom mb-2">Net Taxable Income</p>
                    <DocumentCardIcon />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-2xl font-medium font-poppins-custom text-[#0A2A2E]">
                      {taxOverviewLoading ? "Loading..." : taxOverview.net_taxable_income_formatted}
                    </p>
                    <p className="text-xs text-[#748A91] font-poppins-custom mt-1" style={{ color: "#001D21" }}>
                      {taxOverview.net_taxable_income_label}
                    </p>
                  </div>
                </div>

                {/* Estimated Tax Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "#FFEFE8", border: "0.5px solid #FFDFD0" }}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-sm text-[#374151] font-poppins-custom mb-2">Estimated Tax</p>
                    <DocumentCardIcon />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="text-2xl font-medium font-poppins-custom text-[#0A2A2E]">
                      {taxOverviewLoading ? "Loading..." : taxOverview.estimated_tax_formatted}
                    </p>
                    <p className="text-xs text-[#748A91] font-poppins-custom mt-1" style={{ color: "#001D21" }}>
                      {taxOverview.estimated_tax_label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 w-full sm:w-fit">
              {taxCenterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCenterTab(tab)}
                  className={centerTabClasses(activeCenterTab === tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeCenterTab === "Tax Summary" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {renderBreakdownCard(incomeBreakdown)}
                  {renderBreakdownCard(deductionsBreakdown)}
                </div>
              ) : activeCenterTab === "Tax Document" ? (
                <>
                  <div>
                    <h2 className="text-xl font-medium text-[#0A2A2E] font-poppins-custom">Tax Documents</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">Your tax documents and reports</p>
                  </div>

                  {taxDocumentsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-[#748A91] font-poppins-custom">Loading tax documents...</p>
                    </div>
                  ) : taxDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-6 py-10 text-center">
                      <p className="text-sm font-poppins-custom text-[#748A91]">No tax documents available.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {taxDocuments.map((document) => (
                        <div
                          key={document.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleDocumentClick(document)}
                          onKeyPress={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              handleDocumentClick(document);
                            }
                          }}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-2xl px-6 py-5 hover:border-[#00F0C3] hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {document.status === "pending" || document.status_display === "Pending" ? (
                                <TaxDocumentsPendingIcon />
                              ) : (
                                <TaxDocumentsTickIcon />
                              )}
                            </div>
                            <div>
                              <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">
                                {document.document_name || document.document_type_display || "Tax Document"}
                              </p>
                              <p className="text-xs text-[#10B981] font-medium font-poppins-custom mt-1">
                                Tax Year {document.tax_year}
                              </p>
                              {document.investment_name && (
                                <p className="text-xs text-[#748A91] font-poppins-custom mt-1">
                                  {document.investment_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm font-poppins-custom">
                            <div className="text-right text-[#4B5563]">
                              <p>{formatDate(document.issue_date)}</p>
                              <p className="text-xs text-[#9CA3AF]">{document.file_size_display || "N/A"}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                document.status === "available" || document.status_display === "Available"
                                  ? "bg-[#22C55E] text-white"
                                  : "bg-[#F9F8FF] text-black border border-[#748A91]"
                              }`}
                            >
                              {document.status_display || document.status}
                            </span>
                            {(document.status !== "pending" && document.status_display !== "Pending" && document.download_url) && (
                              <a
                                href={document.download_url}
                                download
                                className="flex items-center gap-2 px-4 py-2 bg-[#F9F8FF] text-[#001D21] rounded-xl text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors border border-[#748A91]"
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                              >
                                <TaxDocumentsDownloadIcon />
                                Download
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4">
                    <h3 className="text-lg font-medium text-[#0A2A2E] font-poppins-custom">Tax Planning Tips</h3>
                    <div className="space-y-3">
                      {taxPlanningTips.map((tip) => (
                        <div
                          key={tip.title}
                          className="rounded-2xl px-4 py-4"
                          style={{ backgroundColor: tip.background, border: tip.border }}
                        >
                          <p className="text-sm font-medium font-poppins-custom" style={{ color: tip.textColor }}>
                            {tip.title}
                          </p>
                          <p className="text-xs font-poppins-custom mt-1" style={{ color: tip.descriptionColor }}>
                            {tip.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4">
                    <h3 className="text-lg font-medium text-[#0A2A2E] font-poppins-custom">Important Dates</h3>
                    <div className="space-y-3">
                      {taxImportantDates.map((item) => (
                        <div key={item.title} className="flex items-center gap-3 text-sm font-poppins-custom text-[#0A2A2E]">
                          <CalendarIcon />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-[#748A91]">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </>
        ) : (
          <section className="   p-6 md:p-8 space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 md:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-medium text-[#0A2A2E] font-poppins-custom">
                  Document Center
                </h1>
                <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                  Manage your investment documents and reports
                </p>
              </div>
              <button className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#00F0C3] text-[#001D21] rounded-xl font-medium text-sm font-poppins-custom hover:bg-[#00D9B0] transition-colors">
                Upload Document
              </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  value={documentSearchTerm}
                  onChange={(event) => setDocumentSearchTerm(event.target.value)}
                  placeholder="Search documents..."
                  className="w-full bg-[#F4F6F5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                />
              </div>
              <select
                value={documentStatusFilter}
                onChange={(event) => setDocumentStatusFilter(event.target.value)}
                className="w-full md:w-auto bg-[#F4F6F5] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
              >
                {DOCUMENT_STATUS_FILTERS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            </div>
           

            <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-[#E5E7EB] py-6 md:py-4 px-6 md:px-3 w-full sm:w-fit">
              {documentCenterTabs.map((tab) => {
                const isActive = activeDocumentCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocumentCategory(tab.id)}
                    className={`px-4 py-2 text-sm font-medium font-poppins-custom rounded-xl transition-colors ${
                      isActive ? "bg-[#00F0C3] text-[#001D21]" : "bg-[#F4F6F5] text-[#01373D] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {`${tab.label} (${DOCUMENT_CATEGORY_COUNTS[tab.id] || 0})`}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-2xl px-6 py-5 hover:border-[#00F0C3] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 10.3711V19.5C19.5 20.0967 19.2629 20.669 18.841 21.091C18.419 21.5129 17.8467 21.75 17.25 21.75H6.75C6.15326 21.75 5.58097 21.5129 5.15901 21.091C4.73705 20.669 4.5 20.0967 4.5 19.5V4.5C4.5 3.90326 4.73705 3.33097 5.15901 2.90901C5.58097 2.48705 6.15326 2.25 6.75 2.25H11.3789C11.7766 2.25006 12.158 2.40804 12.4392 2.68922L19.0608 9.31078C19.342 9.59202 19.4999 9.97341 19.5 10.3711Z" stroke="#001D21" stroke-linejoin="round"/>
                      <path d="M12 2.625V8.25C12 8.64782 12.158 9.02936 12.4393 9.31066C12.7206 9.59196 13.1022 9.75 13.5 9.75H19.125" stroke="#001D21" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>

                      </div>
                      <div>
                        <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">{document.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#748A91] font-poppins-custom">
                          <span>{document.type}</span>
                          <span>{document.size}</span>
                          <span>•</span>
                          <span>{document.uploadedLabel}</span>
                          {document.fund && (
                            <>
                              <span>•</span>
                              <span>{document.fund}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium font-poppins-custom ${
                          document.status === "Approved"
                            ? "bg-[#22C55E] text-white"
                            : "bg-[#F9F8FF] text-[#001D21] border border-[#E5E7EB]"
                        }`}
                      >
                        {document.status}
                      </span>
                      <button
                        type="button"
                        className=""
                        aria-label="Download document"
                      >
                        <EyeIcon />
                      </button>
                                          <button
                        type="button"
                        className=""
                        aria-label="Download document"
                      >
                        <TaxDocumentsDownloadIcon />
                      </button>
                    
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-6 py-10 text-center">
                  <p className="text-sm font-poppins-custom text-[#748A91]">No documents match your search criteria.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TaxDocuments;

