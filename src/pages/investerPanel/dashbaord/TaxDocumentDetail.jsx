import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
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
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const tabButtonClasses = (isActive) =>
  `px-4 py-2.5 rounded-lg text-sm font-medium font-poppins-custom transition-colors ${isActive ? "bg-[#00F0C3] text-[#001D21]" : "bg-[#F9F8FF] text-black hover:bg-gray-50 border border-[#E5E7EB]"
  }`;


const TaxDocumentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentId } = useParams();
  const investDropdownRef = useRef(null);

  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [investmentAmount, setInvestmentAmount] = useState("50,000");
  const [financialPage, setFinancialPage] = useState(1);
  const [opportunityData, setOpportunityData] = useState(null);
  const [isLoadingOpportunity, setIsLoadingOpportunity] = useState(false);
  const [opportunityError, setOpportunityError] = useState(null);
  const [financialsData, setFinancialsData] = useState(null);
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(false);
  const [financialsError, setFinancialsError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentError, setInvestmentError] = useState(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [elementsInstance, setElementsInstance] = useState(null);
  const [paymentElement, setPaymentElement] = useState(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [investmentStatus, setInvestmentStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const documentFromState = location.state?.document;

  // Use API data if available, otherwise fall back to state or static data
  const documentInfo = opportunityData ? {
    id: opportunityData.spv_id,
    investmentName: opportunityData.overview?.display_name || opportunityData.overview?.company_name,
    company: opportunityData.overview?.company_name,
    taxYear: new Date().getFullYear().toString(),
    issueDate: new Date().toLocaleDateString('en-GB'),
    status: opportunityData.details?.status_label === "Pending Review" ? "Pending" : "Available",
    stage: opportunityData.overview?.stage,
    valuation: opportunityData.overview?.valuation || "N/A",
    expectedReturns: opportunityData.overview?.expected_returns,
    timeline: opportunityData.overview?.timeline || `${opportunityData.details?.days_left || 0} days`,
    fundingProgress: opportunityData.funding?.percentage || 0,
    fundingRaised: opportunityData.funding?.raised_formatted || "$0",
    fundingTarget: opportunityData.funding?.target_formatted || "$0",
    documentTitle: `${opportunityData.overview?.display_name || opportunityData.overview?.company_name} Investment Document`,
    size: "2.5 MB",
    documents: opportunityData.documents ? [
      ...(opportunityData.documents.pitch_deck ? [{ title: "Pitch Deck", size: "2.5 MB" }] : []),
      ...(opportunityData.documents.supporting_document ? [{ title: "Supporting Document", size: "1.8 MB" }] : [])
    ] : [],
    rawData: opportunityData
  } : (documentFromState || documentsMap[documentId] || taxDocumentsList[0]);

  const investmentDocuments = documentInfo.documents ?? [];

  // Use API financials data if available, otherwise use empty arrays
  const keyKpis = financialsData?.key_kpis ? [
    { label: "ARR", value: financialsData.key_kpis.arr_formatted || "$0" },
    { label: "MRR", value: financialsData.key_kpis.mrr_formatted || "$0" },
    { label: "Gross Margin", value: financialsData.key_kpis.gross_margin_formatted || "0%" },
    { label: "Monthly Burn", value: financialsData.key_kpis.monthly_burn_formatted || "$0" }
  ] : [
    { label: "ARR", value: "$0" },
    { label: "MRR", value: "$0" },
    { label: "Gross Margin", value: "0%" },
    { label: "Monthly Burn", value: "$0" }
  ];

  const financialSummary = financialsData?.financial_summary?.data || [];
  const rowsPerPage = 4;
  const totalPages = Math.ceil(financialSummary.length / rowsPerPage);
  const paginatedSummary = financialSummary.slice(
    (financialPage - 1) * rowsPerPage,
    financialPage * rowsPerPage
  );

  // Scroll to top when component mounts or documentId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [documentId]);

  // Fetch investment status
  const fetchInvestmentStatus = async () => {
    if (!documentId) return;

    setIsLoadingStatus(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        setIsLoadingStatus(false);
        return;
      }

      const spvId = parseInt(documentId);
      if (isNaN(spvId)) {
        setIsLoadingStatus(false);
        return;
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/invest/check-status/${spvId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Investment status response:", data);
        setInvestmentStatus(data);
      } else {
        console.warn("Failed to fetch investment status:", response.status);
        setInvestmentStatus(null);
      }
    } catch (err) {
      console.error("Error fetching investment status:", err);
      setInvestmentStatus(null);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Fetch investment opportunity data from API
  useEffect(() => {
    if (documentId) {
      fetchInvestmentOpportunity();
      fetchFinancials();
      fetchTeam();
      fetchInvestmentStatus();
    }
  }, [documentId]);

  const fetchInvestmentOpportunity = async () => {
    setIsLoadingOpportunity(true);
    setOpportunityError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        console.warn("No access token found for investment opportunity API.");
        setIsLoadingOpportunity(false);
        return;
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-opportunity/${documentId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Investment opportunity API response:", data);
        setOpportunityData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch investment opportunity:", response.status, errorText);
        setOpportunityError("Failed to load investment details.");
      }
    } catch (err) {
      console.error("Error fetching investment opportunity:", err);
      setOpportunityError(err.message || "Network error loading investment details.");
    } finally {
      setIsLoadingOpportunity(false);
    }
  };

  const fetchFinancials = async () => {
    setIsLoadingFinancials(true);
    setFinancialsError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        console.warn("No access token found for financials API.");
        setIsLoadingFinancials(false);
        return;
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-opportunity/${documentId}/financials/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Financials API response:", data);
        setFinancialsData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch financials:", response.status, errorText);
        setFinancialsError("Failed to load financial data.");
      }
    } catch (err) {
      console.error("Error fetching financials:", err);
      setFinancialsError(err.message || "Network error loading financial data.");
    } finally {
      setIsLoadingFinancials(false);
    }
  };

  const fetchTeam = async () => {
    setIsLoadingTeam(true);
    setTeamError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        console.warn("No access token found for team API.");
        setIsLoadingTeam(false);
        return;
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investment-opportunity/${documentId}/team/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Team API response:", data);
        setTeamData(data);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch team:", response.status, errorText);
        setTeamError("Failed to load team data.");
      }
    } catch (err) {
      console.error("Error fetching team:", err);
      setTeamError(err.message || "Network error loading team data.");
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleInvestNow = async () => {
    setIsInvesting(true);
    setInvestmentError(null);
    setInvestmentSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      // Parse investment amount - remove commas and convert to number
      const amountString = investmentAmount.replace(/,/g, '');
      const amount = parseFloat(amountString);

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid investment amount.");
      }

      // Validate min/max investment if available
      if (opportunityData?.details?.min_investment && amount < opportunityData.details.min_investment) {
        throw new Error(`Minimum investment amount is $${opportunityData.details.min_investment.toLocaleString()}`);
      }

      if (opportunityData?.details?.max_investment && amount > opportunityData.details.max_investment) {
        throw new Error(`Maximum investment amount is $${opportunityData.details.max_investment.toLocaleString()}`);
      }

      // Use documentId as spv_id
      const spvId = parseInt(documentId);
      if (isNaN(spvId)) {
        throw new Error("Invalid investment opportunity ID.");
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/invest/initiate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spv_id: spvId,
          amount: amount
        }),
      });

      // Parse response regardless of status
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        try {
          const errorText = await response.text();
          responseData = { message: errorText };
        } catch {
          responseData = { message: `Failed to initiate investment. Status: ${response.status}` };
        }
      }

      // Check for "Investment request already send." message in response
      const responseMessage = responseData.message || responseData.error || responseData.msg || responseData.detail || "";
      const messageLower = responseMessage.toLowerCase();

      // Check if message contains "investment request already send" or similar
      if (messageLower.includes("investment request already send") ||
        messageLower.includes("investment request already sent") ||
        messageLower.includes("already send") ||
        messageLower.includes("already sent")) {
        setInvestmentError("Investment request already send.");
        return;
      }

      if (response.ok) {
        console.log("Investment initiated successfully:", responseData);
        setInvestmentSuccess(true);
        // Refresh investment status after creating investment
        await fetchInvestmentStatus();
        // Optionally navigate or show success message
        alert("Request sent successfully!");
      } else {
        const errorMessage = responseMessage || `Failed to initiate investment. Status: ${response.status}`;
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error initiating investment:", err);
      setInvestmentError(err.message || "Failed to initiate investment. Please try again.");
    } finally {
      setIsInvesting(false);
    }
  };

  const handleCommitPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No access token found. Please login again.");
      }

      // Step 1: Fetch my investments to get the investment ID
      const spvId = parseInt(documentId);
      if (isNaN(spvId)) {
        throw new Error("Invalid investment opportunity ID.");
      }

      console.log("Fetching my investments for SPV:", spvId);
      const investmentsResponse = await fetch(`${API_URL.replace(/\/$/, "")}/invest/my-investments/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!investmentsResponse.ok) {
        throw new Error("Failed to fetch your investments. Please try again.");
      }

      const investmentsData = await investmentsResponse.json();
      console.log("My investments response:", investmentsData);

      // Extract investments array
      const investments = investmentsData.investments || investmentsData.results || investmentsData.data || [];

      // Find investment matching current SPV
      const matchingInvestment = investments.find(inv =>
        inv.spv_id === spvId ||
        inv.spv?.id === spvId ||
        inv.spv === spvId
      );

      if (!matchingInvestment) {
        throw new Error("No approved investment found for this SPV. Please ensure your investment request has been approved.");
      }

      const investmentId = matchingInvestment.id;
      console.log("Found investment ID:", investmentId);

      // Step 2: Create payment intent with the investment ID
      console.log("Creating payment intent for investment:", investmentId);
      const paymentResponse = await fetch(`${API_URL.replace(/\/$/, "")}/payments/create_payment_for_investment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          investment_id: investmentId
        }),
      });

      // Parse response
      let paymentData;
      try {
        paymentData = await paymentResponse.json();
      } catch {
        try {
          const errorText = await paymentResponse.text();
          paymentData = { message: errorText };
        } catch {
          paymentData = { message: `Failed to create payment. Status: ${paymentResponse.status}` };
        }
      }

      if (paymentResponse.ok) {
        console.log("Payment intent created successfully:", paymentData);

        // If client_secret is returned, initialize Stripe Elements
        if (paymentData.client_secret) {
          console.log("Client secret received:", paymentData.client_secret);

          // Get Stripe publishable key from env or use default
          const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51SeVq7FyAsgGnfxjkQ4iOx4wjenlMJaT1jHyBC2NxJIcoEJayvJiDugzLKEWJiYEUAVYY5ymAr3shqxRlwvKxqEU00uYsWVart";

          try {
            // Load Stripe
            const stripe = await loadStripe(stripePublishableKey);

            if (!stripe) {
              throw new Error("Failed to load Stripe. Please refresh the page and try again.");
            }

            // Initialize Stripe Elements with client_secret
            const elements = stripe.elements({
              clientSecret: paymentData.client_secret
            });

            // Create Payment Element
            const paymentElement = elements.create('payment');

            // Store instances
            setStripeInstance(stripe);
            setElementsInstance(elements);
            setPaymentElement(paymentElement);
            setClientSecret(paymentData.client_secret);

            // Show payment modal (useEffect will handle mounting)
            setShowPaymentModal(true);
            setIsProcessingPayment(false);

          } catch (stripeError) {
            console.error("Error initializing Stripe:", stripeError);
            throw new Error(stripeError.message || "Failed to initialize payment. Please try again.");
          }
        } else {
          setPaymentSuccess(true);
          alert("Payment intent created successfully!");
        }
      } else {
        const errorMessage = paymentData.message || paymentData.error || paymentData.detail || `Failed to create payment. Status: ${paymentResponse.status}`;
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error committing payment:", err);
      setPaymentError(err.message || "Failed to commit payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!stripeInstance || !elementsInstance) {
      setPaymentError("Payment system not initialized. Please try again.");
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError(null);

    try {
      // Confirm payment with elements (this includes the payment method)
      const { error, paymentIntent } = await stripeInstance.confirmPayment({
        elements: elementsInstance,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required', // Only redirect if required by payment method
      });

      if (error) {
        console.error("Stripe payment error:", error);
        setPaymentError(error.message || "Payment failed. Please try again.");
        setIsSubmittingPayment(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setShowPaymentModal(false);
        // Refresh investment status after successful payment
        await fetchInvestmentStatus();
        alert("Payment completed successfully!");
        // Cleanup
        if (paymentElement) {
          paymentElement.unmount();
        }
        setPaymentElement(null);
        setElementsInstance(null);
        setStripeInstance(null);
        setClientSecret(null);
      } else {
        // Payment requires additional action or is processing
        console.log("Payment status:", paymentIntent?.status);
      }
    } catch (err) {
      console.error("Error submitting payment:", err);
      setPaymentError(err.message || "Failed to process payment. Please try again.");
      setIsSubmittingPayment(false);
    }
  };

  const handleClosePaymentModal = () => {
    // Cleanup Stripe Elements
    if (paymentElement) {
      paymentElement.unmount();
    }
    setPaymentElement(null);
    setElementsInstance(null);
    setStripeInstance(null);
    setClientSecret(null);
    setShowPaymentModal(false);
    setPaymentError(null);
  };

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

  // Mount payment element when modal opens and element is ready
  useEffect(() => {
    if (showPaymentModal && paymentElement) {
      const paymentElementContainer = document.getElementById('payment-element');
      if (paymentElementContainer) {
        // Clear any existing content
        paymentElementContainer.innerHTML = '';
        // Mount the payment element
        paymentElement.mount('#payment-element');
      }
    }

    // Cleanup on unmount
    return () => {
      if (paymentElement) {
        try {
          paymentElement.unmount();
        } catch (e) {
          // Element might already be unmounted
        }
      }
    };
  }, [showPaymentModal, paymentElement]);

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
                      {opportunityData?.overview?.description || "Snapshot of the underlying investment details and performance."}
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
                  {isLoadingOpportunity ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : opportunityError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{opportunityError}</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {opportunityData?.company_details?.business_model && (
                        <div>
                          <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                            Business Model
                          </h3>
                          <p className="text-base text-[#748A91] font-poppins-custom">
                            {opportunityData.company_details.business_model}
                          </p>
                        </div>
                      )}
                      {opportunityData?.company_details?.market_opportunity && (
                        <div>
                          <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                            Market Opportunity
                          </h3>
                          <p className="text-base text-[#748A91] font-poppins-custom">
                            {opportunityData.company_details.market_opportunity}
                          </p>
                        </div>
                      )}
                      {opportunityData?.company_details?.competitive_advantage && (
                        <div>
                          <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                            Competitive Advantage
                          </h3>
                          <p className="text-base text-[#748A91] font-poppins-custom">
                            {opportunityData.company_details.competitive_advantage}
                          </p>
                        </div>
                      )}
                      {opportunityData?.overview?.description && (
                        <div>
                          <h3 className="text-lg text-[#001D21] font-poppins-custom uppercase tracking-wide mb-2">
                            Description
                          </h3>
                          <p className="text-base text-[#748A91] font-poppins-custom">
                            {opportunityData.overview.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

              {activeTab === "financials" && (
                <section className="space-y-6">
                  {isLoadingFinancials ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : financialsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{financialsError}</p>
                      <button
                        onClick={fetchFinancials}
                        className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
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
                            {financialsData?.financial_summary?.title || financialsData?.spv_name || "Financial Summary"}
                          </p>
                          <h3 className="text-xl font-medium font-poppins-custom">Financial Summary</h3>
                          <p className="text-sm text-[#748A91] font-poppins-custom mb-6">
                            {financialsData?.financial_summary?.subtitle || "Yearly revenue, EBITDA, and cash balance"}
                          </p>
                        </div>
                        {financialSummary.length === 0 ? (
                          <div className="px-6 md:px-8 py-12 text-center">
                            <p className="text-gray-500">No financial data available.</p>
                          </div>
                        ) : (
                          <div className="bg-white text-[#00171C] rounded-3xl mx-4 mb-6 border border-[#D1D5DB80]">
                            <div className="px-6 md:px-8 py-4">
                              <div className="grid grid-cols-4 text-sm font-medium text-[#6A7A80] font-poppins-custom border-b border-[#E5E7EB] pb-3">
                                <span>Year</span>
                                <span>Revenue</span>
                                <span>EBITDA</span>
                                <span>Cash</span>
                              </div>
                              <div className="divide-y divide-[#EEF1F2]">
                                {paginatedSummary.map((row, index) => (
                                  <div
                                    key={row.year || index}
                                    className="grid grid-cols-4 text-sm font-poppins-custom text-[#00171C] p-4 mb-4 mt-2 rounded-lg border border-[#E5E7EB]"
                                  >
                                    <span className="font-medium">{row.year || "N/A"}</span>
                                    <span className="font-medium">{row.revenue_formatted || row.revenue || "$0"}</span>
                                    <span className="font-medium">{row.ebitda_formatted || row.ebitda || "$0"}</span>
                                    <span className="font-medium">{row.cash_formatted || row.cash || "$0"}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {totalPages > 1 && (
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
                                      className={`w-8 h-8 rounded-full text-xs font-poppins-custom transition-all ${isActive ? "bg-[#00171C] text-white" : "text-[#6A7A80] hover:text-[#00171C]"
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
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </section>
              )}

              {activeTab === "team" && (
                <section className="space-y-6">
                  {isLoadingTeam ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : teamError ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{teamError}</p>
                      <button
                        onClick={fetchTeam}
                        className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white text-black rounded-3xl p-6 md:p-8" style={{ border: "1px solid #D1D5DB80" }}>
                      <div className="mb-6">
                        <p className="text-sm uppercase tracking-widest text-[#001D21] font-poppins-custom">
                          {teamData?.team?.title || "Leadership Team"}
                        </p>
                        <p className="text-sm text-[#748A91] font-medium mt-2 font-poppins-custom">
                          {teamData?.team?.subtitle || "Core executives and functional leaders"}
                        </p>
                      </div>
                      {!teamData?.team?.members || teamData.team.members.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No team members available.</p>
                        </div>
                      ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {teamData.team.members.map((member) => (
                            <div
                              key={member.id}
                              className="bg-white text-[#00171C] rounded-2xl p-6 flex flex-col gap-4"
                              style={{ border: "1px solid #D1D5DB80" }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                  {member.avatar ? (
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-13 h-13 rounded-full object-cover border border-[#E5E7EB]"
                                    />
                                  ) : (
                                    <div className="w-13 h-13 rounded-full bg-[#F4F6F5] border border-[#E5E7EB] flex items-center justify-center">
                                      <span className="text-lg font-semibold text-[#748A91] font-poppins-custom">
                                        {member.name?.charAt(0)?.toUpperCase() || "?"}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-1">
                                    <h4 className="text-lg font-semibold font-poppins-custom text-[#00171C]">
                                      {member.name}
                                    </h4>
                                    <p className="text-xs text-[#748A91] font-poppins-custom">
                                      {member.title || member.role_display || member.role || "Team Member"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {member.email && (
                                <p className="text-xs text-[#748A91] font-poppins-custom">
                                  {member.email}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                <p className="mt-2 text-xs text-[#748A91] font-poppins-custom">
                  Min: ${opportunityData?.details?.min_investment ? opportunityData.details.min_investment.toLocaleString() : '25,000'} · Max: ${opportunityData?.details?.max_investment ? opportunityData.details.max_investment.toLocaleString() : '500,000'}
                </p>
                {investmentError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-poppins-custom">{investmentError}</p>
                  </div>
                )}
                {investmentSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600 font-poppins-custom">Investment initiated successfully!</p>
                  </div>
                )}
                {paymentError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-poppins-custom">{paymentError}</p>
                  </div>
                )}
                {paymentSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600 font-poppins-custom">Payment intent created successfully!</p>
                  </div>
                )}
                {/* Show investment status if available */}
                {investmentStatus && investmentStatus.has_request && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-600 font-poppins-custom">
                      Status: <span className="font-semibold">{investmentStatus.status_display || investmentStatus.status}</span>
                      {investmentStatus.approval_status?.is_approved && (
                        <span className="ml-2 text-green-600">✓ Approved</span>
                      )}
                    </p>
                  </div>
                )}
                {/* Invest Now Button - Only enabled if NOT approved */}
                <button
                  onClick={handleInvestNow}
                  disabled={
                    isInvesting ||
                    (investmentStatus?.approval_status?.is_approved === true) ||
                    (investmentStatus?.has_request && investmentStatus?.approval_status?.is_approved === true)
                  }
                  className="mt-5 w-full bg-[#00F0C3] text-[#001D21] rounded-lg py-3 font-medium text-sm font-poppins-custom hover:bg-[#00C4B3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInvesting ? "Processing..." : "Invest Now"}
                </button>
                {/* Commit Payment Button - Only enabled if approved */}
                <button
                  onClick={handleCommitPayment}
                  disabled={
                    isProcessingPayment ||
                    paymentSuccess ||
                    !investmentStatus?.approval_status?.is_approved ||
                    !investmentStatus?.approval_status?.can_proceed_to_payment
                  }
                  className="mt-3 w-full bg-[#9889FF] text-white rounded-lg py-3 font-medium text-sm font-poppins-custom hover:bg-[#7B6FE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : paymentSuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Payment Committed</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Commit Payment</span>
                    </>
                  )}
                </button>
              </section>

              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h2 className="text-lg font-semibold text-[#0A2A2E] font-poppins-custom mb-4">Investment Stats</h2>
                <div className="space-y-3 text-sm font-poppins-custom">
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Investors</span>
                    <span className="text-[#0A2A2E] font-medium">
                      {isLoadingOpportunity ? "..." : (opportunityData?.stats?.total_investors || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Days Remaining</span>
                    <span className="text-[#0A2A2E] font-medium">
                      {isLoadingOpportunity ? "..." : (opportunityData?.details?.days_left || opportunityData?.stats?.days_remaining || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#748A91]">Expected Returns</span>
                    <span className="text-[#0A2A2E] font-medium">
                      {isLoadingOpportunity ? "..." : (opportunityData?.overview?.expected_returns || opportunityData?.stats?.expected_returns || "N/A")}
                    </span>
                  </div>
                  {opportunityData?.details?.min_investment && (
                    <div className="flex justify-between">
                      <span className="text-[#748A91]">Min. Investment</span>
                      <span className="text-[#0A2A2E] font-medium">
                        ${opportunityData.details.min_investment.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {opportunityData?.details?.max_investment && (
                    <div className="flex justify-between">
                      <span className="text-[#748A91]">Max. Investment</span>
                      <span className="text-[#0A2A2E] font-medium">
                        ${opportunityData.details.max_investment.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
                <button
                  onClick={handleClosePaymentModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitPayment} className="p-6">
              {/* Payment Element Container */}
              <div id="payment-element" className="mb-6">
                {/* Stripe Elements will mount here */}
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{paymentError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#9889FF] rounded-lg hover:bg-[#7B6FE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay Now</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxDocumentDetail;

