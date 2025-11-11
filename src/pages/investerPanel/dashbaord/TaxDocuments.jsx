import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [activeTopTab, setActiveTopTab] = useState("Taxes");
  const [activeCenterTab, setActiveCenterTab] = useState(taxCenterTabs[0]);
  const [activeDocumentCategory, setActiveDocumentCategory] = useState("all");
  const [documentStatusFilter, setDocumentStatusFilter] = useState("all");
  const [documentSearchTerm, setDocumentSearchTerm] = useState("");

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
    <div className="min-h-screen bg-[#F4F6F5]">
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img src={logoImage} alt="Unlocksley Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-4">
            <div className="max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search SPVs, investors, documents..."
                  className="w-full bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => navigate("/investor-panel/notifications")}
                className="bg-[#01373D] p-2 rounded-lg hover:bg-[#014a54] transition-colors"
              >
                <AlertsIcon />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F2E0C9] rounded-full flex items-center justify-center">
                  <span className="text-[#01373D] text-xs font-bold">2</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <img src={profileImage} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              <button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#0A2A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#001D21] px-6">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => {
              navigate("/investor-panel/dashboard");
              setActiveNav("overview");
            }}
            className={navButtonClasses(activeNav === "overview")}
          >
            <HomeIcon />
            Overview
          </button>
          <div className="relative" ref={investDropdownRef}>
            <button
              onClick={() => setShowInvestDropdown(!showInvestDropdown)}
              className={navButtonClasses(activeNav === "invest")}
            >
              <InvitesIcon />
              Invest
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showInvestDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 min-w-[180px]" style={{ border: "1px solid #000" }}>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invest");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-t-lg hover:bg-gray-50 transition-colors"
                >
                  Discover
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/invites");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Invites
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/top-syndicates");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] hover:bg-gray-50 transition-colors"
                >
                  Top Syndicates
                </button>
                <button
                  onClick={() => {
                    navigate("/investor-panel/wishlist");
                    setShowInvestDropdown(false);
                    setActiveNav("invest");
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-poppins-custom text-[#0A2A2E] rounded-b-lg hover:bg-gray-50 transition-colors"
                >
                  Wishlist
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              navigate("/investor-panel/portfolio");
              setActiveNav("portfolio");
            }}
            className={navButtonClasses(activeNav === "portfolio")}
          >
            <PortfolioIcon />
            Your Portfolio
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/tax-documents");
              setActiveNav("taxes");
            }}
            className={navButtonClasses(activeNav === "taxes")}
          >
            <TaxesIcon />
            Taxes & Document
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/messages");
              setActiveNav("messages");
            }}
            className={navButtonClasses(activeNav === "messages")}
          >
            <MessagesIcon />
            Messages
          </button>
          <button
            onClick={() => {
              navigate("/investor-panel/settings");
              setActiveNav("settings");
            }}
            className={navButtonClasses(activeNav === "settings")}
          >
            <SettingsIcon />
            Investor Settings
          </button>
        </div>
      </nav>

      <main className="w-full px-6 py-8 space-y-8">
        <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 w-fit">
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
                {taxSummaryCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: card.background, border: card.border }}
                  >
                    <div className="flex flex-row items-center justify-between gap-2">
                      <p className="text-sm text-[#374151] font-poppins-custom mb-2">{card.title}</p>
                      <DocumentCardIcon />
                    </div>

                    <div className="flex flex-row items-center justify-between gap-2">
                      <p className="text-2xl font-medium font-poppins-custom text-[#0A2A2E]">{card.value}</p>
                      <p className="text-xs text-[#748A91] font-poppins-custom mt-1" style={{ color: card.captionColor }}>
                        {card.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 w-fit">
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
                    <h2 className="text-xl font-medium text-[#0A2A2E] font-poppins-custom">Your Investments</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">Detailed view of your portfolio holdings</p>
                  </div>

                  <div className="space-y-4">
                    {taxDocumentsList.map((document) => (
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
                            {document.status === "Pending" ? <TaxDocumentsPendingIcon /> : <TaxDocumentsTickIcon />}
                          </div>
                          <div>
                            <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">
                              {document.documentTitle}
                            </p>
                            <p className="text-xs text-[#10B981] font-medium font-poppins-custom mt-1">{document.taxYear}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-poppins-custom">
                          <div className="text-right text-[#4B5563]">
                            <p>{document.issueDate}</p>
                            <p className="text-xs text-[#9CA3AF]">{document.size}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              document.status === "Available"
                                ? "bg-[#22C55E] text-white"
                                : "bg-[#F9F8FF] text-black border border-[#748A91]"
                            }`}
                          >
                            {document.status}
                          </span>
                          {document.status !== "Pending" && (
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-[#F9F8FF] text-[#001D21] rounded-xl text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors border border-[#748A91]"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDocumentClick(document);
                              }}
                            >
                              <TaxDocumentsDownloadIcon />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
           

            <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-[#E5E7EB] py-6 md:py-4 px-6 md:px-3 w-fit">
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

