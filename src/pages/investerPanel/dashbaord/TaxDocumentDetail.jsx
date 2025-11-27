import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import logoImage from "../../../assets/img/logo.png";
import profileImage from "../../../assets/img/profile.png";
import {
  HomeIcon,
  InvitesIcon,
  PortfolioIcon,
  TaxesIcon,
  MessagesIcon,
  SettingsIcon,
  InvestmentDocumentsIcon,
  TaxDocumentsDownloadIcon,
  AlertsIcon
} from "./icon.jsx";
import { taxDocumentsList } from "./taxDocumentsData";

const documentsMap = taxDocumentsList.reduce((acc, document) => {
  acc[document.id] = document;
  return acc;
}, {});

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const tabButtonClasses = (isActive) =>
  `px-4 py-2.5 rounded-lg text-sm font-medium font-poppins-custom transition-colors ${
    isActive ? "bg-[#00F0C3] text-[#001D21]" : "bg-[#F9F8FF] text-black hover:bg-gray-50 border border-[#E5E7EB]"
  }`;

const keyKpis = [
  { label: "ARR", value: "$42.0M" },
  { label: "MRR", value: "$3.50M" },
  { label: "Gross Margin", value: "82%" },
  { label: "Monthly Burn", value: "$800,000" }
];

const financialSummary = [
  { year: 2022, revenue: "$12M", ebitda: "$1.2M", cash: "$5M" },
  { year: 2023, revenue: "$15M", ebitda: "$1.5M", cash: "$6M" },
  { year: 2024, revenue: "$18M", ebitda: "$1.8M", cash: "$7M" },
  { year: 2025, revenue: "$20M", ebitda: "$2.0M", cash: "$8M" },
  { year: 2026, revenue: "$24M", ebitda: "$2.4M", cash: "$9M" },
  { year: 2027, revenue: "$28M", ebitda: "$3.1M", cash: "$10M" },
  { year: 2028, revenue: "$33M", ebitda: "$3.8M", cash: "$11M" },
  { year: 2029, revenue: "$37M", ebitda: "$4.4M", cash: "$12M" },
  { year: 2030, revenue: "$42M", ebitda: "$5.0M", cash: "$13M" }
];

const TaxDocumentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("taxes");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [investmentAmount, setInvestmentAmount] = useState("50,000");
  const [financialPage, setFinancialPage] = useState(1);

  const documentFromState = location.state?.document;
  const documentInfo = documentFromState || documentsMap[documentId] || taxDocumentsList[0];
  const investmentDocuments = documentInfo.documents ?? [];

  const rowsPerPage = 4;
  const totalPages = Math.ceil(financialSummary.length / rowsPerPage);
  const paginatedSummary = financialSummary.slice(
    (financialPage - 1) * rowsPerPage,
    financialPage * rowsPerPage
  );

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

  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">


      <main className="w-full px-4 sm:px-6 py-8">
        <div className="bg-white p-4 sm:p-8 rounded-2xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-[#748A91] font-poppins-custom mb-1">{documentInfo.taxYear}</p>
              <h1 className="text-2xl sm:text-3xl text-[#0A2A2E] font-poppins-custom">
                {documentInfo.investmentName} <span className="text-[#9889FF]">Document</span>
              </h1>
              <p className="mt-3 text-sm text-[#748A91] font-poppins-custom max-w-2xl">
                {documentInfo.company}
              </p>
            </div>
            <div className="flex items-center gap-2 text-left sm:text-right text-sm text-[#748A91] font-poppins-custom">
              <span>{documentInfo.issueDate}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${documentInfo.status === "Available" ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF3C7] text-[#B45309]"}`}>
                {documentInfo.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mt-7">
            <div>
              <section className="bg-[#F9F8FF] rounded-2xl border border-[#E5E7EB] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-lg text-black font-poppins-custom mb-1">Investment Overview</p>
                    <p className="mt-3 text-sm text-[#748A91] font-poppins-custom max-w-2xl">
                      Snapshot of the underlying investment details and performance.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl p-4">
                    <p className="text-xs text-[#748A91] font-poppins-custom uppercase tracking-wide">Stage</p>
                    <p className="mt-2 text-lg font-medium text-[#0A2A2E] font-poppins-custom">{documentInfo.stage}</p>
                  </div>
                  <div className="rounded-xl p-4">
                    <p className="text-xs text-[#748A91] font-poppins-custom uppercase tracking-wide">Valuation</p>
                    <p className="mt-2 text-lg font-medium text-[#0A2A2E] font-poppins-custom">{documentInfo.valuation}</p>
                  </div>
                  <div className="rounded-xl p-4">
                    <p className="text-xs text-[#748A91] font-poppins-custom uppercase tracking-wide">Expected Returns</p>
                    <p className="mt-2 text-lg font-medium text-[#0A2A2E] font-poppins-custom">{documentInfo.expectedReturns}</p>
                  </div>
                  <div className="rounded-xl p-4">
                    <p className="text-xs text-[#748A91] font-poppins-custom uppercase tracking-wide">Timeline</p>
                    <p className="mt-2 text-lg font-medium text-[#0A2A2E] font-poppins-custom">{documentInfo.timeline}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#748A91] font-poppins-custom">Funding Progress</p>
                    <span className="text-sm text-[#0A2A2E] font-medium font-poppins-custom">
                      {documentInfo.fundingProgress}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#CEC6FF] overflow-hidden">
                    <div className="h-full bg-[#00F0C3]" style={{ width: `${documentInfo.fundingProgress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#748A91] font-poppins-custom">
                    <span>{documentInfo.fundingRaised} raised</span>
                    <span>{documentInfo.fundingTarget} target</span>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-wrap gap-3 mt-7 mb-7">
                {["details", "financials", "team", "documents"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={tabButtonClasses(activeTab === tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </section>

              {activeTab === "details" && (
                <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                  <h2 className="text-xl font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Company Details</h2>
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                        Business Model
                      </h3>
                      <p className="text-base text-[#748A91] font-poppins-custom">
                        SaaS platform with enterprise clients, recurring revenue model with 95% retention rate.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                        Market Opportunity
                      </h3>
                      <p className="text-base text-[#748A91] font-poppins-custom">
                        $50B+ addressable market in enterprise automation, growing at 25% CAGR.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                        Competitive Advantage
                      </h3>
                      <p className="text-base text-[#748A91] font-poppins-custom">
                        Proprietary AI technology with 3+ years R&amp;D lead over competitors.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "financials" && (
                <section className="space-y-6">
                  <div className="bg-white text-[#001D21] rounded-3xl p-6 md:p-8" style={{ border: "1px solid #D1D5DB80" }}>
                    <div className="mb-6">
                      <p className="text-lg uppercase tracking-widest text-[#001D21] font-poppins-custom">
                        Key KPIs
                      </p>
                      <h3 className="text-sm text-[#748A91] font-poppins-custom mt-2">
                        Snapshot of current financial performance
                      </h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {keyKpis.map((item) => (
                        <div key={item.label} className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-widest text-[#748A91] font-poppins-custom">
                            {item.label}
                          </span>
                          <span className="text-2xl font-medium text-[#001D21] font-poppins-custom">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white text-[#001D21] rounded-3xl overflow-hidden" style={{ border: "1px solid #D1D5DB80" }}>
                    <div className="px-6 md:px-8 pt-6">
                      <p className="text-sm uppercase tracking-widest text-[#001D21] font-poppins-custom mb-1">
                        NextGen AI Syndicate
                      </p>
                      <h3 className="text-xl font-medium font-poppins-custom">Financial Summary</h3>
                      <p className="text-sm text-[#748A91] font-poppins-custom mb-6">
                        Yearly revenue, EBITDA, and cash balance
                      </p>
                    </div>
                    <div className="bg-white text-[#00171C] rounded-3xl mx-4 mb-6 border border-[#D1D5DB80]">
                      <div className="px-6 md:px-8 py-4">
                        <div className="grid grid-cols-4 text-sm font-medium text-[#6A7A80] font-poppins-custom border-b border-[#E5E7EB] pb-3">
                          <span>Year</span>
                          <span>Revenue</span>
                          <span>EBITDA</span>
                          <span>Cash</span>
                        </div>
                        <div className="divide-y divide-[#EEF1F2]">
                          {paginatedSummary.map((row) => (
                            <div
                              key={row.year}
                              className="grid grid-cols-4 text-sm font-poppins-custom text-[#00171C] p-4 mb-4 mt-2 rounded-lg border border-[#E5E7EB]"
                            >
                              <span className="font-medium">{row.year}</span>
                              <span className="font-medium">{row.revenue}</span>
                              <span className="font-medium">{row.ebitda}</span>
                              <span className="font-medium">{row.cash}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 pb-6">
                        <button
                          onClick={() => setFinancialPage((prev) => Math.max(prev - 1, 1))}
                          className="text-xs text-[#6A7A80] font-poppins-custom hover:text-[#00171C] transition-colors disabled:opacity-30"
                          disabled={financialPage === 1}
                        >
                          ‹
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => {
                          const page = index + 1;
                          const isActive = page === financialPage;
                          return (
                            <button
                              key={page}
                              onClick={() => setFinancialPage(page)}
                              className={`w-8 h-8 rounded-full text-xs font-poppins-custom transition-all ${
                                isActive ? "bg-[#00171C] text-white" : "text-[#6A7A80] hover:text-[#00171C]"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setFinancialPage((prev) => Math.min(prev + 1, totalPages))}
                          className="text-xs text-[#6A7A80] font-poppins-custom hover:text-[#00171C] transition-colors disabled:opacity-30"
                          disabled={financialPage === totalPages}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "team" && (
                <section className="space-y-6">
                  <div className="bg-white text-black rounded-3xl p-6 md:p-8" style={{ border: "1px solid #D1D5DB80" }}>
                    <div className="mb-6">
                      <p className="text-sm uppercase tracking-widest text-[#001D21]">
                        Leadership Team
                      </p>
                      <p className="text-sm text-[#748A91] font-medium mt-2 font-poppins-custom">
                        Core executives and functional leaders
                      </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {["Alex Morgan", "Priya Shah", "Jordan Lee"].map((name) => (
                        <div
                          key={name}
                          className="bg-white text-[#00171C] rounded-2xl p-6 flex flex-col gap-4"
                          style={{ border: "1px solid #D1D5DB80" }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={
                                  name === "Alex Morgan"
                                    ? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&h=200&fit=crop"
                                    : name === "Priya Shah"
                                    ? "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&h=200&fit=crop"
                                    : "https://images.unsplash.com/photo-1544723795-3fb27298f5b3?q=80&w=200&h=200&fit=crop"
                                }
                                alt={name}
                                className="w-13 h-13 rounded-full object-cover border border-[#E5E7EB]"
                              />
                              <div className="flex flex-col gap-1">
                                <h4 className="text-lg font-semibold font-poppins-custom text-[#00171C]">{name}</h4>
                                <p className="text-xs text-[#748A91] font-poppins-custom">
                                  {name === "Alex Morgan"
                                    ? "CEO & Co-Founder"
                                    : name === "Priya Shah"
                                    ? "CTO & Co-Founder"
                                    : "CFO"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#4B5C63] font-poppins-custom leading-relaxed">
                            {name === "Alex Morgan"
                              ? "Former product lead at a top SaaS unicorn. 10+ years in enterprise AI."
                              : name === "Priya Shah"
                              ? "Built ML platforms at FAANG. PhD in Computer Science (AI)."
                              : "Ex-investment banker with multiple growth-stage finance leadership roles."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "documents" && (
                <section className="bg-white rounded-3xl p-6 md:p-8 space-y-6" style={{ border: "1px solid #D1D5DB80" }}>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#00171C] font-poppins-custom">Investment Documents</h3>
                    <p className="text-sm text-[#748A91] font-poppins-custom mt-2">
                      Review all relevant documents before investing
                    </p>
                  </div>
                  <div className="space-y-4">
                    {investmentDocuments.map((doc) => (
                      <div
                        key={doc.title}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5"
                        style={{ border: "1px solid #E5E7EB" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center">
                            <InvestmentDocumentsIcon />
                          </div>
                          <div>
                            <p className="text-base font-medium text-[#00171C] font-poppins-custom">{doc.title}</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom mt-1">{doc.size}</p>
                          </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00F0C3] text-[#00171C] rounded-xl font-medium text-sm font-poppins-custom hover:bg-[#00D9B0] transition-colors">
                          <TaxDocumentsDownloadIcon />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Document Details</h2>
                <div className="space-y-3 text-sm font-poppins-custom">
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Document</span>
                    <span className="text-[#0A2A2E] font-medium text-right">{documentInfo.documentTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Tax Year</span>
                    <span className="text-[#0A2A2E] font-medium">{documentInfo.taxYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Status</span>
                    <span className={`font-medium ${documentInfo.status === "Available" ? "text-[#15803D]" : "text-[#B45309]"}`}>
                      {documentInfo.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">File Size</span>
                    <span className="text-[#0A2A2E] font-medium">{documentInfo.size}</span>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Make Investment</h2>
                <label className="block text-sm text-[#748A91] font-poppins-custom mb-2" htmlFor="investment-amount">
                  Investment Amount
                </label>
                <div className="flex items-center gap-2">
                  <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.53816 8.35725C6.53816 8.80525 6.42616 9.23458 6.20216 9.64525C5.97816 10.0466 5.64682 10.3826 5.20816 10.6532C4.77882 10.9239 4.26082 11.0779 3.65416 11.1153V12.2493H2.89816V11.1153C2.04882 11.0406 1.35816 10.7699 0.826156 10.3032C0.294156 9.82725 0.0234896 9.22525 0.0141563 8.49725H1.37216C1.40949 8.88925 1.55416 9.22992 1.80616 9.51925C2.06749 9.80858 2.43149 9.99058 2.89816 10.0652V6.56525C2.27282 6.40658 1.76882 6.24325 1.38616 6.07525C1.00349 5.90725 0.676823 5.64592 0.406156 5.29125C0.13549 4.93658 0.000156283 4.46058 0.000156283 3.86325C0.000156283 3.10725 0.26149 2.48192 0.784156 1.98725C1.31616 1.49258 2.02082 1.21725 2.89816 1.16125V-0.000750661H3.65416V1.16125C4.44749 1.22658 5.08682 1.48325 5.57216 1.93125C6.05749 2.36992 6.33749 2.94392 6.41216 3.65325H5.05416C5.00749 3.32658 4.86282 3.03258 4.62016 2.77125C4.37749 2.50058 4.05549 2.32325 3.65416 2.23925V5.65525C4.27016 5.81392 4.76949 5.97725 5.15216 6.14525C5.54416 6.30392 5.87082 6.56058 6.13216 6.91525C6.40282 7.26992 6.53816 7.75058 6.53816 8.35725ZM1.30216 3.79325C1.30216 4.25058 1.43749 4.60058 1.70816 4.84325C1.97882 5.08592 2.37549 5.28658 2.89816 5.44525V2.21125C2.41282 2.25792 2.02549 2.41658 1.73616 2.68725C1.44682 2.94858 1.30216 3.31725 1.30216 3.79325ZM3.65416 10.0792C4.15816 10.0232 4.55016 9.84125 4.83016 9.53325C5.11949 9.22525 5.26416 8.85658 5.26416 8.42725C5.26416 7.96992 5.12416 7.61992 4.84416 7.37725C4.56416 7.12525 4.16749 6.92458 3.65416 6.77525V10.0792Z" fill="#748A91" />
                  </svg>
                  <input
                    id="investment-amount"
                    type="text"
                    value={investmentAmount}
                    onChange={(event) => setInvestmentAmount(event.target.value)}
                    className="flex-1 bg-[#F4F6F5] border border-gray-300 rounded-lg px-4 py-2 text-base text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#9889FF]"
                  />
                </div>
                <p className="mt-2 text-xs text-[#748A91] font-poppins-custom">Min: $25,000 · Max: $500,000</p>
                <button className="mt-5 w-full bg-[#00F0C3] text-[#001D21] rounded-lg py-3 font-medium text-sm font-poppins-custom hover:bg-[#00C4B3] transition-colors">
                  Invest Now
                </button>
              </section>

              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Investment Stats</h2>
                <div className="space-y-3 text-sm font-poppins-custom">
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Investors</span>
                    <span className="text-[#0A2A2E] font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Days Remaining</span>
                    <span className="text-[#0A2A2E] font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Expected Returns</span>
                    <span className="text-[#0A2A2E] font-medium">3-5x</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaxDocumentDetail;

