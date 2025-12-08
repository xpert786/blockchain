import React, { useEffect, useRef, useState } from "react";
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
  AlertsIcon
} from "./icon.jsx";

const navButtonClasses = (isActive) =>
  `px-4 py-4 font-medium font-poppins-custom flex items-center gap-2 rounded-lg transition-colors ${
    isActive ? "bg-[#FFFFFF1A] text-white" : "text-gray-300 hover:text-white"
  }`;

const settingsTabs = [
  "Identity",
  "Accreditation",
  "Tax & Compliance",
  "Eligibility",
  "Financial",
  "Portfolio",
  "Security & Privacy",
  "Communication"
];

// --- Mock/Static Data ---

const ACCREDITATION_METHODS = [
    { value: "income_method", label: "Income Method" },
    { value: "net_worth_method", label: "Net Worth Method" },
    { value: "series_7_65_82", label: "Series 7, 65, or 82 Holder" },
    { value: "entity_accreditation", label: "Accredited Entity" },
    { value: "none", label: "Not Accredited" },
];

const ACCREDITATION_TYPES = [
    { value: "U.S.: Reg D Rule 501(a)", label: "U.S.: Reg D Rule 501(a)" },
    { value: "Non-U.S. Investor", label: "Non-U.S. Investor" },
];

const getIdentityFields = (formData, handleChange) => [
  {
    label: "Full Legal Name (as per ID)",
    name: "full_legal_name",
    value: formData.full_legal_name,
    onChange: (e) => handleChange(e, 'identity'),
    fullWidth: true
  },
  {
    label: "Country of Residence",
    name: "country_of_residence",
    value: formData.country_of_residence,
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "Tax Domicile",
    name: "tax_domicile",
    value: formData.tax_domicile,
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "National ID / Passport Number",
    name: "national_id", 
    value: formData.national_id, 
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "Date of Birth",
    name: "date_of_birth",
    value: formData.date_of_birth,
    onChange: (e) => handleChange(e, 'identity'),
    type: "date"
  },
  {
    label: "Street Address",
    name: "street_address",
    value: formData.street_address,
    onChange: (e) => handleChange(e, 'identity'),
    fullWidth: true
  },
  {
    label: "City",
    name: "city",
    value: formData.city,
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "State/Province",
    name: "state_province",
    value: formData.state_province,
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "Zip/Postal Code",
    name: "zip_postal_code",
    value: formData.zip_postal_code,
    onChange: (e) => handleChange(e, 'identity'),
  },
  {
    label: "Country",
    name: "country",
    value: formData.country,
    onChange: (e) => handleChange(e, 'identity'),
  }
];

// Removed static eligibilityRules, financialSettings, portfolioSettings, securitySettings, and privacySettings - now using state


// --- Utility Render Functions ---

// UPDATED: Now ensures the handler is always called with the correct (name, nextCheckedValue) regardless of original event type.
const renderToggle = (isOn, name, handler) => (
  <div
    className={`relative w-10 h-6 rounded-full transition-colors ${isOn ? "bg-[#0A2A2E]" : "bg-[#E5E7EB]"} p-1 cursor-pointer`}
    aria-checked={isOn}
    role="switch"
    onClick={() => {
      if (typeof handler === 'function') {
        handler(name, !isOn);
      }
    }}
  >
    <span
      className={`block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
          isOn ? "translate-x-full bg-[#00F0C3]" : "translate-x-0 bg-[#0A2A2E] bg-opacity-70"
      }`}
    />
  </div>
);

const renderCheckbox = (checked) => (
  <input
    type="checkbox"
    readOnly
    checked={checked}
    className="h-4 w-4 rounded border-[#0A2A2E] text-[#00F0C3] focus:ring-[#00F0C3]"
  />
);

// --- Main Component ---

const InvestorSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investDropdownRef = useRef(null);

  const [activeNav, setActiveNav] = useState("settings");
  const [showInvestDropdown, setShowInvestDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("Tax & Compliance"); // Set to Tax & Compliance for immediate testing
  const [showTabsDropdown, setShowTabsDropdown] = useState(false);
  const tabsDropdownRef = useRef(null);

  // --- Identity State ---
  const [identityData, setIdentityData] = useState(null);
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(false);
  const [identityError, setIdentityError] = useState(null);
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    full_legal_name: "",
    country_of_residence: "",
    tax_domicile: "",
    national_id: "",
    date_of_birth: "",
    street_address: "",
    city: "",
    state_province: "",
    zip_postal_code: "",
    country: ""
  });

  // --- Accreditation State ---
  const [accreditationData, setAccreditationData] = useState(null);
  const [isLoadingAccreditation, setIsLoadingAccreditation] = useState(false);
  const [accreditationError, setAccreditationError] = useState(null);
  const [isSavingAccreditation, setIsSavingAccreditation] = useState(false);
  const [accreditationForm, setAccreditationForm] = useState({
    accreditation_method: "",
    accreditation_type: "",
    accreditation_expiry_date: "",
    is_accredited_investor: false,
    meets_local_investment_thresholds: false
  });
  
  // --- Tax Compliance State ---
  const [taxData, setTaxData] = useState(null);
  const [isLoadingTax, setIsLoadingTax] = useState(false);
  const [taxError, setTaxError] = useState(null);
  const [isSavingTax, setIsSavingTax] = useState(false);
  const [taxForm, setTaxForm] = useState({
    tax_identification_number: "",
    us_person_status: false,
    w9_form_submitted: false,
    k1_acceptance: false,
    tax_reporting_consent: false
  });

  // --- Eligibility State ---
  const [eligibilityData, setEligibilityData] = useState(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false);
  const [eligibilityError, setEligibilityError] = useState(null);
  const [isSavingEligibility, setIsSavingEligibility] = useState(false);
  const [eligibilityForm, setEligibilityForm] = useState({
    delaware_spvs_allowed: true,
    bvi_spvs_allowed: false,
    auto_reroute_consent: true,
    max_annual_commitment: "",
    deal_stage_preferences: []
  });

  // --- Financial State ---
  const [financialData, setFinancialData] = useState(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [financialError, setFinancialError] = useState(null);
  const [isSavingFinancial, setIsSavingFinancial] = useState(false);
  const [financialForm, setFinancialForm] = useState({
    preferred_investment_currency: "USD",
    escrow_partner_selection: "",
    capital_call_notification_preferences: {
      email: false,
      sms: true,
      in_app: false
    },
    carry_fees_display_preference: "detailed_breakdown"
  });

  // --- Portfolio State ---
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    portfolio_view_settings: "deal_by_deal",
    secondary_transfer_consent: true,
    liquidity_preference: "long_term",
    whitelist_secondary_trading: false
  });

  // --- Security & Privacy State ---
  const [securityPrivacyData, setSecurityPrivacyData] = useState(null);
  const [isLoadingSecurityPrivacy, setIsLoadingSecurityPrivacy] = useState(false);
  const [securityPrivacyError, setSecurityPrivacyError] = useState(null);
  const [isSavingSecurityPrivacy, setIsSavingSecurityPrivacy] = useState(false);
  const [securityPrivacyForm, setSecurityPrivacyForm] = useState({
    two_factor_authentication_enabled: false,
    session_timeout_minutes: 30,
    soft_wall_deal_preview: true,
    discovery_opt_in: false,
    anonymity_preference: false
  });

  // --- Password Change State ---
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- Simple Toast (in-component) ---
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const showToast = (message, type = "success", duration = 4000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration);
  };

  // --- Communication State ---
  const [communicationData, setCommunicationData] = useState(null);
  const [isLoadingCommunication, setIsLoadingCommunication] = useState(false);
  const [communicationError, setCommunicationError] = useState(null);
  const [isSavingCommunication, setIsSavingCommunication] = useState(false);
  const [communicationForm, setCommunicationForm] = useState({
    preferred_contact_method: "",
    update_frequency: "",
    event_alerts: {
      capital_calls: false,
      secondary_offers: false,
      portfolio_updates: false,
      distributions: false
    },
    marketing_consent: false
  });


  // --- Handlers ---
  // Consolidated change handler for text/select inputs
  const handleChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    
    let setter;
    if (formType === 'accreditation') {
        setter = setAccreditationForm;
    } else if (formType === 'tax') {
        setter = setTaxForm;
    } else if (formType === 'eligibility') {
        setter = setEligibilityForm;
    } else if (formType === 'financial') {
        setter = setFinancialForm;
    } else if (formType === 'portfolio') {
        setter = setPortfolioForm;
    } else if (formType === 'communication') {
      setter = setCommunicationForm;
    } else if (formType === 'security_privacy') {
        setter = setSecurityPrivacyForm;
    } else if (formType === 'password') {
        setter = setPasswordForm;
    } else {
        setter = setIdentityForm;
    }

    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for financial notification preferences
  const handleFinancialNotificationChange = (notifType, checked) => {
    setFinancialForm(prev => ({
      ...prev,
      capital_call_notification_preferences: {
        ...prev.capital_call_notification_preferences,
        [notifType]: checked
      }
    }));
  };

  // Dedicated change handler for toggle buttons (which pass name and boolean directly)
  const handleToggleChange = (name, checked, formType = 'tax') => {
    if (formType === 'eligibility') {
      setEligibilityForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (formType === 'portfolio') {
      setPortfolioForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (formType === 'security_privacy') {
      setSecurityPrivacyForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Default to TaxForm state
      setTaxForm(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  // Handler for deal stage preferences checkboxes
  const handleStagePreferenceChange = (stage) => {
    setEligibilityForm(prev => {
      const currentPrefs = prev.deal_stage_preferences || [];
      const isSelected = currentPrefs.includes(stage);
      
      return {
        ...prev,
        deal_stage_preferences: isSelected
          ? currentPrefs.filter(s => s !== stage)
          : [...currentPrefs, stage]
      };
    });
  };

  // Handler for communication toggles and event alerts
  const handleCommunicationToggle = (name, checked) => {
    if (name === 'marketing_consent') {
      setCommunicationForm(prev => ({ ...prev, marketing_consent: checked }));
      return;
    }

    // assume other names map to event_alerts keys
    setCommunicationForm(prev => ({
      ...prev,
      event_alerts: {
        ...prev.event_alerts,
        [name]: checked
      }
    }));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  useEffect(() => {
    if (location.pathname.includes("/investor-panel/invest")) {
        setActiveNav("invest");
    } else if (location.pathname.includes("/investor-panel/portfolio")) {
        setActiveNav("portfolio");
    } else if (location.pathname.includes("/investor-panel/tax-documents")) {
        setActiveNav("taxes");
    } else if (location.pathname.includes("/investor-panel/messages")) {
        setActiveNav("messages");
    } else {
        // Fallback or specific settings logic
        // This is primarily for the general layout, not the active tab within settings
        setActiveNav("settings");
    }
  }, [location.pathname]);


  useEffect(() => {
    // Logic to handle click outside dropdowns
    const handleClickOutside = (event) => {
        if (tabsDropdownRef.current && !tabsDropdownRef.current.contains(event.target)) {
            setShowTabsDropdown(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- API Functions & Constants ---

  const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
  const getToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');

  // 1. Identity Fetch/Save
  const fetchIdentityData = async () => {
    setIsLoadingIdentity(true);
    setIdentityError(null);
    const token = getToken();
    if (!token) {
      showToast("Session expired. Please login again.", 'error');
      return setIdentityError("No access token found. Please login again.");
    }

    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/identity/`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', }, });

      if (response.ok) {
        const data = await response.json();
        const identity = data.identity || data;
        let zipPostalCode = identity.zip_postal_code || "";
        if (!zipPostalCode && identity.full_address) {
          const addressParts = identity.full_address.split(',').map(part => part.trim());
          if (addressParts.length >= 2) { zipPostalCode = addressParts[1] || ""; }
        }
        const nationalId = identity.national_id ?? "";
        const formData = {
          full_legal_name: identity.full_legal_name || "", country_of_residence: identity.country_of_residence || "", tax_domicile: identity.tax_domicile || identity.country_of_residence || "", national_id: nationalId, date_of_birth: identity.date_of_birth_raw || identity.date_of_birth || "", street_address: identity.street_address || "", city: identity.city || "", state_province: identity.state_province || "", zip_postal_code: zipPostalCode, country: identity.country || ""
        };
        setIdentityData(data); setIdentityForm(formData);
      } else {
        const errorText = await response.text(); setIdentityError("Failed to load identity data."); console.error("Failed to fetch identity data:", response.status, errorText);
      }
    } catch (err) {
      setIdentityError(err.message || "Network error loading identity data."); console.error("Error fetching identity data:", err);
    } finally {
      setIsLoadingIdentity(false);
    }
  };
  const saveIdentityData = async () => {
    setIsSavingIdentity(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
      const payload = { full_legal_name: identityForm.full_legal_name || "", country_of_residence: identityForm.country_of_residence || "", tax_domicile: identityForm.tax_domicile || "", national_id: identityForm.national_id || "", date_of_birth: identityForm.date_of_birth || "", street_address: identityForm.street_address || "", city: identityForm.city || "", state_province: identityForm.state_province || "", zip_postal_code: identityForm.zip_postal_code || "", country: identityForm.country || "" };
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/identity/`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', }, body: JSON.stringify(payload), });
      if (response.ok) {
        await fetchIdentityData(); showToast("Identity information saved successfully!", 'success');
      } else {
        const errorText = await response.text(); console.error("Failed to update identity:", response.status, errorText); showToast(`Failed to save identity information. Please try again. Error: ${response.status}`, 'error');
      }
    } catch (err) {
      console.error("Error updating identity:", err); showToast("Network error saving identity information.", 'error');
    } finally {
      setIsSavingIdentity(false);
    }
  };

  // 2. Accreditation Fetch/Save 
  const fetchAccreditationData = async () => {
    setIsLoadingAccreditation(true);
    setAccreditationError(null);
    const token = getToken();
    if (!token) return setAccreditationError("No access token found. Please login again.");
    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/accreditation/`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', }, });
      if (response.ok) {
        const data = await response.json();
        const accreditation = data.accreditation || data;
        const formData = {
          accreditation_method: accreditation.accreditation_method || "", accreditation_type: accreditation.accreditation_type || "", accreditation_expiry_date: accreditation.accreditation_expiry_date_raw || accreditation.accreditation_expiry_date || "", is_accredited_investor: accreditation.is_accredited_investor ?? false, meets_local_investment_thresholds: accreditation.meets_local_investment_thresholds ?? false
        };
        setAccreditationData(data); setAccreditationForm(formData);
      } else {
        const errorText = await response.text(); setAccreditationError("Failed to load accreditation data."); console.error("Failed to fetch accreditation data:", response.status, errorText);
      }
    } catch (err) {
      setAccreditationError(err.message || "Network error loading accreditation data."); console.error("Error fetching accreditation data:", err);
    } finally {
      setIsLoadingAccreditation(false);
    }
  };
  const saveAccreditationData = async () => {
    setIsSavingAccreditation(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }
    try {
      const payload = { accreditation_method: accreditationForm.accreditation_method || "none", accreditation_type: accreditationForm.accreditation_type || "", accreditation_expiry_date: accreditationForm.accreditation_expiry_date || null, is_accredited_investor: accreditationForm.is_accredited_investor, meets_local_investment_thresholds: accreditationForm.meets_local_investment_thresholds, };
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/accreditation/`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', }, body: JSON.stringify(payload), });
      if (response.ok) {
        await fetchAccreditationData(); showToast("Accreditation information saved successfully!", 'success');
      } else {
        const errorText = await response.text(); console.error("Failed to update accreditation:", response.status, errorText); showToast(`Failed to save accreditation information. Please try again. Error: ${response.status}`, 'error');
      }
    } catch (err) {
      console.error("Error updating accreditation:", err); showToast("Network error saving accreditation information.", 'error');
    } finally {
      setIsSavingAccreditation(false);
    }
  };

  // 3. Tax Compliance Fetch 
  const fetchTaxData = async () => {
    setIsLoadingTax(true);
    setTaxError(null);
    const token = getToken();
    if (!token) return setTaxError("No access token found. Please login again.");

    try {
        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/tax-compliance/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            const data = await response.json();
            const taxCompliance = data.tax_compliance || data;
            
            const formData = {
                tax_identification_number: taxCompliance.tax_identification_number || "",
                us_person_status: taxCompliance.us_person_status ?? false,
                w9_form_submitted: taxCompliance.w9_form_submitted ?? false,
                k1_acceptance: taxCompliance.k1_acceptance ?? false,
                tax_reporting_consent: taxCompliance.tax_reporting_consent ?? false,
            };

            setTaxData(data);
            setTaxForm(formData);

        } else {
            const errorText = await response.text();
            setTaxError("Failed to load tax data.");
            console.error("Failed to fetch tax data:", response.status, errorText);
        }
    } catch (err) {
        setTaxError(err.message || "Network error loading tax data.");
        console.error("Error fetching tax data:", err);
    } finally {
        setIsLoadingTax(false);
    }
  };

  // 3. Tax Compliance Save
  const saveTaxData = async () => {
    setIsSavingTax(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
        const payload = {
            tax_identification_number: taxForm.tax_identification_number || "",
            us_person_status: taxForm.us_person_status,
            w9_form_submitted: taxForm.w9_form_submitted,
            k1_acceptance: taxForm.k1_acceptance,
            tax_reporting_consent: taxForm.tax_reporting_consent,
        };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/tax-compliance/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

      if (response.ok) {
        await fetchTaxData();
        showToast("Tax & Compliance information saved successfully! 💰", 'success');
      } else {
        const errorText = await response.text();
        console.error("Failed to update tax data:", response.status, errorText);
        showToast(`Failed to save tax information. Please try again. Error: ${response.status}`, 'error');
      }
    } catch (err) {
        console.error("Error updating tax data:", err);
        showToast("Network error saving tax information.", 'error');
    } finally {
        setIsSavingTax(false);
    }
  };

  // 4. Eligibility Fetch
  const fetchEligibilityData = async () => {
    setIsLoadingEligibility(true);
    setEligibilityError(null);
    const token = getToken();
    if (!token) return setEligibilityError("No access token found. Please login again.");

    try {
        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/eligibility/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            const data = await response.json();
            const eligibility = data.eligibility || data;
            
            const formData = {
                delaware_spvs_allowed: eligibility.jurisdiction_preferences?.delaware_spvs?.allowed ?? true,
                bvi_spvs_allowed: eligibility.jurisdiction_preferences?.bvi_spvs?.allowed ?? false,
                auto_reroute_consent: eligibility.jurisdiction_preferences?.auto_reroute_consent?.enabled ?? true,
                max_annual_commitment: eligibility.max_annual_commitment || "",
                deal_stage_preferences: eligibility.deal_stage_preferences || [],
            };

            setEligibilityData(data);
            setEligibilityForm(formData);

        } else {
            const errorText = await response.text();
            setEligibilityError("Failed to load eligibility data.");
            console.error("Failed to fetch eligibility data:", response.status, errorText);
        }
    } catch (err) {
        setEligibilityError(err.message || "Network error loading eligibility data.");
        console.error("Error fetching eligibility data:", err);
    } finally {
        setIsLoadingEligibility(false);
    }
  };

  // 4. Eligibility Save
  const saveEligibilityData = async () => {
    setIsSavingEligibility(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
        const payload = {
            delaware_spvs_allowed: eligibilityForm.delaware_spvs_allowed,
            bvi_spvs_allowed: eligibilityForm.bvi_spvs_allowed,
            auto_reroute_consent: eligibilityForm.auto_reroute_consent,
            max_annual_commitment: eligibilityForm.max_annual_commitment ? parseFloat(eligibilityForm.max_annual_commitment) : null,
            deal_stage_preferences: eligibilityForm.deal_stage_preferences,
        };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/eligibility/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchEligibilityData();
          showToast("Eligibility rules saved successfully! 🎯", 'success');
        } else {
          const errorText = await response.text();
          console.error("Failed to update eligibility data:", response.status, errorText);
          showToast(`Failed to save eligibility information. Please try again. Error: ${response.status}`, 'error');
        }
    } catch (err) {
        console.error("Error updating eligibility data:", err);
        showToast("Network error saving eligibility information.", 'error');
    } finally {
        setIsSavingEligibility(false);
    }
  };

  // 5. Financial Fetch
  const fetchFinancialData = async () => {
    setIsLoadingFinancial(true);
    setFinancialError(null);
    const token = getToken();
    if (!token) return setFinancialError("No access token found. Please login again.");

    try {
        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/financial/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            const data = await response.json();
            const financial = data.financial || data;
            
            const formData = {
                preferred_investment_currency: financial.preferred_investment_currency || "USD",
                escrow_partner_selection: financial.escrow_partner_selection || "",
                capital_call_notification_preferences: {
                    email: financial.capital_call_notification_preferences?.email ?? false,
                    sms: financial.capital_call_notification_preferences?.sms ?? true,
                    in_app: financial.capital_call_notification_preferences?.in_app ?? false,
                },
                carry_fees_display_preference: financial.carry_fees_display_preference || "detailed_breakdown",
            };

            setFinancialData(data);
            setFinancialForm(formData);

        } else {
            const errorText = await response.text();
            setFinancialError("Failed to load financial data.");
            console.error("Failed to fetch financial data:", response.status, errorText);
        }
    } catch (err) {
        setFinancialError(err.message || "Network error loading financial data.");
        console.error("Error fetching financial data:", err);
    } finally {
        setIsLoadingFinancial(false);
    }
  };

  // 5. Financial Save
  const saveFinancialData = async () => {
    setIsSavingFinancial(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
        const payload = {
            preferred_investment_currency: financialForm.preferred_investment_currency,
            escrow_partner_selection: financialForm.escrow_partner_selection,
            capital_call_notification_preferences: financialForm.capital_call_notification_preferences,
            carry_fees_display_preference: financialForm.carry_fees_display_preference,
        };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/financial/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchFinancialData();
          showToast("Financial settings saved successfully! 💰", 'success');
        } else {
          const errorText = await response.text();
          console.error("Failed to update financial data:", response.status, errorText);
          showToast(`Failed to save financial information. Please try again. Error: ${response.status}`, 'error');
        }
    } catch (err) {
        console.error("Error updating financial data:", err);
        showToast("Network error saving financial information.", 'error');
    } finally {
        setIsSavingFinancial(false);
    }
  };

  // 6. Portfolio Fetch
  const fetchPortfolioData = async () => {
    setIsLoadingPortfolio(true);
    setPortfolioError(null);
    const token = getToken();
    if (!token) return setPortfolioError("No access token found. Please login again.");

    try {
        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/portfolio/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            const data = await response.json();
            const portfolio = data.portfolio || data;
            
            const formData = {
                portfolio_view_settings: portfolio.portfolio_view_settings || "deal_by_deal",
                secondary_transfer_consent: portfolio.secondary_transfer_consent?.enabled ?? true,
                liquidity_preference: portfolio.liquidity_preference || "long_term",
                whitelist_secondary_trading: portfolio.whitelist_secondary_trading?.enabled ?? false,
            };

            setPortfolioData(data);
            setPortfolioForm(formData);

        } else {
            const errorText = await response.text();
            setPortfolioError("Failed to load portfolio data.");
            console.error("Failed to fetch portfolio data:", response.status, errorText);
        }
    } catch (err) {
        setPortfolioError(err.message || "Network error loading portfolio data.");
        console.error("Error fetching portfolio data:", err);
    } finally {
        setIsLoadingPortfolio(false);
    }
  };

  // 6. Portfolio Save
  const savePortfolioData = async () => {
    setIsSavingPortfolio(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
        const payload = {
            portfolio_view_settings: portfolioForm.portfolio_view_settings,
            secondary_transfer_consent: portfolioForm.secondary_transfer_consent,
            liquidity_preference: portfolioForm.liquidity_preference,
            whitelist_secondary_trading: portfolioForm.whitelist_secondary_trading,
        };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/portfolio/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchPortfolioData();
          showToast("Portfolio settings saved successfully! 📊", 'success');
        } else {
          const errorText = await response.text();
          console.error("Failed to update portfolio data:", response.status, errorText);
          showToast(`Failed to save portfolio information. Please try again. Error: ${response.status}`, 'error');
        }
    } catch (err) {
        console.error("Error updating portfolio data:", err);
        showToast("Network error saving portfolio information.", 'error');
    } finally {
        setIsSavingPortfolio(false);
    }
  };

  // 7. Security & Privacy Fetch
  const fetchSecurityPrivacyData = async () => {
    setIsLoadingSecurityPrivacy(true);
    setSecurityPrivacyError(null);
    const token = getToken();
    if (!token) return setSecurityPrivacyError("No access token found. Please login again.");

    try {
        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/security-privacy/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
        });

        if (response.ok) {
            const data = await response.json();
            const security = data.security || {};
            const privacy = data.privacy || {};
            
            const formData = {
                two_factor_authentication_enabled: security.two_factor_authentication?.enabled ?? false,
                session_timeout_minutes: security.session_timeout_minutes || 30,
                soft_wall_deal_preview: privacy.soft_wall_deal_preview?.enabled ?? true,
                discovery_opt_in: privacy.discovery_opt_in?.enabled ?? false,
                anonymity_preference: privacy.anonymity_preference?.enabled ?? false,
            };

            setSecurityPrivacyData(data);
            setSecurityPrivacyForm(formData);

        } else {
            const errorText = await response.text();
            setSecurityPrivacyError("Failed to load security & privacy data.");
            console.error("Failed to fetch security & privacy data:", response.status, errorText);
        }
    } catch (err) {
        setSecurityPrivacyError(err.message || "Network error loading security & privacy data.");
        console.error("Error fetching security & privacy data:", err);
    } finally {
        setIsLoadingSecurityPrivacy(false);
    }
  };

  // 7. Security & Privacy Save
  const saveSecurityPrivacyData = async () => {
    setIsSavingSecurityPrivacy(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
      // Ensure session_timeout_minutes is a valid integer and one of allowed choices
      const allowedTimeouts = [15, 30, 60, 120, 240];
      let timeout = parseInt(securityPrivacyForm.session_timeout_minutes, 10);
      if (isNaN(timeout) || !allowedTimeouts.includes(timeout)) {
        // fallback to 30 minutes if invalid
        timeout = 30;
      }

      const payload = {
        two_factor_authentication_enabled: !!securityPrivacyForm.two_factor_authentication_enabled,
        session_timeout_minutes: timeout,
        soft_wall_deal_preview: !!securityPrivacyForm.soft_wall_deal_preview,
        discovery_opt_in: !!securityPrivacyForm.discovery_opt_in,
        anonymity_preference: !!securityPrivacyForm.anonymity_preference,
      };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/security-privacy/`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchSecurityPrivacyData();
          showToast("Security & Privacy settings saved successfully! 🔒", 'success');
        } else {
          const errorText = await response.text();
          console.error("Failed to update security & privacy data:", response.status, errorText);
          showToast(`Failed to save security & privacy information. Please try again. Error: ${response.status}`, 'error');
        }
    } catch (err) {
        console.error("Error updating security & privacy data:", err);
        showToast("Network error saving security & privacy information.", 'error');
    } finally {
        setIsSavingSecurityPrivacy(false);
    }
  };

  // --- Communication Fetch/Save ---
  const fetchCommunicationData = async () => {
    setIsLoadingCommunication(true);
    setCommunicationError(null);
    const token = getToken();
    if (!token) return setCommunicationError("No access token found. Please login again.");

    try {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/communication/`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const comm = data.communication || data;
        const formData = {
          preferred_contact_method: comm.preferred_contact_method || "",
          update_frequency: comm.update_frequency || "",
          event_alerts: {
            capital_calls: comm.event_alerts?.capital_calls?.enabled ?? false,
            secondary_offers: comm.event_alerts?.secondary_offers?.enabled ?? false,
            portfolio_updates: comm.event_alerts?.portfolio_updates?.enabled ?? false,
            distributions: comm.event_alerts?.distributions?.enabled ?? false,
          },
          marketing_consent: comm.marketing_consent?.enabled ?? false
        };

        setCommunicationData(data);
        setCommunicationForm(formData);
      } else {
        const errorText = await response.text();
        setCommunicationError("Failed to load communication data.");
        console.error("Failed to fetch communication data:", response.status, errorText);
      }
    } catch (err) {
      setCommunicationError(err.message || "Network error loading communication data.");
      console.error("Error fetching communication data:", err);
    } finally {
      setIsLoadingCommunication(false);
    }
  };

  const saveCommunicationData = async () => {
    setIsSavingCommunication(true);
    const token = getToken();
    if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
      const payload = {
        preferred_contact_method: communicationForm.preferred_contact_method,
        update_frequency: communicationForm.update_frequency,
        event_alerts: {
          capital_calls: !!communicationForm.event_alerts.capital_calls,
          secondary_offers: !!communicationForm.event_alerts.secondary_offers,
          portfolio_updates: !!communicationForm.event_alerts.portfolio_updates,
          distributions: !!communicationForm.event_alerts.distributions,
        },
        marketing_consent: !!communicationForm.marketing_consent
      };

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/investors/settings/communication/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchCommunicationData();
        showToast("Communication settings saved successfully!", 'success');
      } else {
        const errorText = await response.text();
        console.error("Failed to update communication data:", response.status, errorText);
        showToast(`Failed to save communication information. Please try again. Error: ${response.status}`, 'error');
      }
    } catch (err) {
      console.error("Error updating communication data:", err);
      showToast("Network error saving communication information.", 'error');
    } finally {
      setIsSavingCommunication(false);
    }
  };

  // 8. Change Password
  const changePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      showToast("Please fill in all password fields.", 'error');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showToast("New password and confirm password do not match.", 'error');
      return;
    }

    setIsChangingPassword(true);
    const token = getToken()
  if (!token) { showToast("Session expired. Please login again.", 'error'); return; }

    try {
        const payload = {
            current_password: passwordForm.current_password,
            new_password: passwordForm.new_password,
            confirm_password: passwordForm.confirm_password,
        };

        const response = await fetch(`${API_URL.replace(/\/$/, "")}/settings/change-password/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
          setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
          showToast("Password changed successfully! 🔐", 'success');
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error || errorData.message || "Failed to change password.";
          console.error("Failed to change password:", response.status, errorData);
          showToast(`Failed to change password: ${errorMessage}`, 'error');
        }
    } catch (err) {
        console.error("Error changing password:", err);
        showToast("Network error changing password.", 'error');
    } finally {
        setIsChangingPassword(false);
    }
  };

  // --- useEffects to fetch data when tabs change ---

  useEffect(() => {
    if (activeTab === "Identity") {
      fetchIdentityData();
    } else if (activeTab === "Accreditation") {
      fetchAccreditationData();
    } else if (activeTab === "Tax & Compliance") {
      fetchTaxData();
    } else if (activeTab === "Eligibility") {
      fetchEligibilityData();
    } else if (activeTab === "Financial") {
      fetchFinancialData();
    } else if (activeTab === "Portfolio") {
      fetchPortfolioData();
    } else if (activeTab === "Security & Privacy") {
      fetchSecurityPrivacyData();
    } else if (activeTab === "Communication") {
      fetchCommunicationData();
    }
  }, [activeTab]);

  // --- Render Helpers for Accreditation ---

  const renderAccreditationStatusTag = (status) => {
    let colorClass = "bg-[#748A91]"; // Default gray
    if (status === "Verified" || status === "Passed" || status.toLowerCase() === "passed") {
      colorClass = "bg-[#22C55E]"; // Green
    } else if (status === "Pending" || status === "Not Uploaded" || status.toLowerCase() === "pending") {
      colorClass = "bg-[#F59E0B]"; // Amber/Yellow
    } else if (status === "Rejected") {
      colorClass = "bg-[#ED1C24]"; // Red
    }

    return (
        <span className={`inline-flex items-center justify-center px-4 py-1 ${colorClass} text-white text-xs rounded-md`}>
            {status}
        </span>
    );
  };


  const accreditationDocuments = accreditationData?.required_documents ? Object.values(accreditationData.required_documents) : [];
  const verificationStatus = accreditationData?.verification?.status_label || "Unknown";
  const isAccredited = accreditationForm.is_accredited_investor;


  // --- JSX Render Return ---
  return (
    <div className="min-h-screen bg-[#F4F6F5] overflow-x-hidden">
      
      <main className="w-full px-4 sm:px-6 py-8 space-y-6">
        <section className="p-4 sm:p-6 md:p-8">
          <div className="bg-white border border-[#E5E7EB] rounded-md p-4 sm:p-6 flex flex-col gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-medium font-poppins-custom">
              <span className="text-[#7A61EA]">Account</span> <span className="text-[#0A2A2E]">Settings</span>
            </h1>
            <p className="text-sm text-[#748A91] font-poppins-custom">
              Manage your comprehensive account preferences and compliance settings
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Tabs */}
            <aside className="w-full lg:w-1/4">
              {/* Mobile Dropdown */}
              <div className="lg:hidden relative" ref={tabsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowTabsDropdown(!showTabsDropdown)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-md px-4 py-3 flex items-center justify-between text-sm font-medium font-poppins-custom text-[#0A2A2E] hover:bg-[#F4F6F5] transition-colors"
                >
                  <span>{activeTab}</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${showTabsDropdown ? "rotate-180" : ""}`}
                  >
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {showTabsDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    {settingsTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setShowTabsDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium font-poppins-custom transition-colors border-b border-[#E5E7EB] last:border-b-0 ${
                          tab === activeTab
                            ? "bg-[#00F0C3] text-[#001D21]"
                            : "text-[#0A2A2E] hover:bg-[#F4F6F5]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                    <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-sm font-medium font-poppins-custom transition-colors bg-[#ED1C24] text-white hover:bg-[#D11A20]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Vertical Sidebar */}
              <div className="hidden lg:block bg-white border border-[#E5E7EB] rounded-md p-4 space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium font-poppins-custom transition-colors ${
                      tab === activeTab
                        ? "bg-[#00F0C3] text-[#001D21]"
                        : "text-[#0A2A2E] bg-[#F4F6F5] hover:bg-[#F3F4F6] border border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-4 py-3 rounded-md text-sm font-medium font-poppins-custom transition-colors bg-[#ED1C24] text-white hover:bg-[#D11A20]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
            
            {/* -------------------- IDENTITY SECTION -------------------- */}
            {activeTab === "Identity" && (
            <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
              <header className="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#00F0C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Identity & Jurisdiction</h2>
                  <p className="text-sm text-[#748A91] font-poppins-custom">
                    Legal identity and residency information
                  </p>
                </div>
              </header>

              {isLoadingIdentity ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : identityError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{identityError}</p>
                  <button
                    onClick={fetchIdentityData}
                    className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getIdentityFields(identityForm, handleChange).map((field) => {
                      return (
                        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                          <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                            {field.label}
                          </label>
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={field.value}
                            onChange={(e) => handleChange(e, 'identity')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                            placeholder={field.placeholder || ""}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-row items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 22V15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Jurisdiction Status</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">Auto-tagged based on residence</p>
                    </div>
                      
                    </div>
                      
                    <span className="inline-flex items-center justify-center px-4 py-1 bg-[#22C55E] text-white text-xs font-semibold rounded-md">
                      {identityData?.jurisdiction_status || identityData?.identity?.jurisdiction_status || "Approved"}
                    </span>
                  </div>

                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={saveIdentityData}
                      disabled={isSavingIdentity}
                      className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                        isSavingIdentity ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSavingIdentity ? "Saving..." : "Save Identity Information"}
                    </button>
                  </div>
                </>
              )}
            </section>
            )}

            {/* -------------------- ACCREDITATION SECTION -------------------- */}
            {activeTab === "Accreditation" && (
            <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
              <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 3L4 7V12C4 16.97 7.58 21.43 12 22C16.42 21.43 20 16.97 20 12V7L12 3Z"
                    stroke="#00F0C3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10.5 12L12 13.5L15 10.5" stroke="#00F0C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Accreditation Status</h2>
                  <p className="text-sm text-[#748A91] font-poppins-custom">
                    Investor accreditation verification and documentation
                  </p>
                </div>
              </header>

              {isLoadingAccreditation ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : accreditationError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{accreditationError}</p>
                  <button
                    onClick={fetchAccreditationData}
                    className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Accreditation Type */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                      Accreditation Type
                    </label>
                    <select
                      name="accreditation_type"
                      value={accreditationForm.accreditation_type}
                      onChange={(e) => handleChange(e, 'accreditation')}
                      className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                    >
                        <option value="">Select Type</option>
                        {ACCREDITATION_TYPES.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                  </div>

                  {/* Accreditation Method */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                      Accreditation Method
                    </label>
                    <select
                      name="accreditation_method"
                      value={accreditationForm.accreditation_method}
                      onChange={(e) => handleChange(e, 'accreditation')}
                      className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                    >
                        <option value="">Select Method</option>
                        {ACCREDITATION_METHODS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                  </div>

                  {/* Accreditation Expiry Date */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                      Accreditation Expiry/Review Date
                    </label>
                    <input
                      type="date"
                      name="accreditation_expiry_date"
                      value={accreditationForm.accreditation_expiry_date || ''}
                      onChange={(e) => handleChange(e, 'accreditation')}
                      className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                    />
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Is Accredited Investor?</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">Confirmed accredited status</p>
                        </div>
                        {/* Note: This toggle currently uses the original, less flexible implementation */}
                        <div onClick={() => handleChange({ target: { name: 'is_accredited_investor', type: 'checkbox', checked: !isAccredited } }, 'accreditation')} className="cursor-pointer">
                            {renderToggle(isAccredited)}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#E5E5FF] pt-3">
                        <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Meets Local Thresholds</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">Meets local regulatory investment minimums</p>
                        </div>
                         {/* Note: This toggle currently uses the original, less flexible implementation */}
                        <div onClick={() => handleChange({ target: { name: 'meets_local_investment_thresholds', type: 'checkbox', checked: !accreditationForm.meets_local_investment_thresholds } }, 'accreditation')} className="cursor-pointer">
                            {renderToggle(accreditationForm.meets_local_investment_thresholds)}
                        </div>
                    </div>
                </div>

                {/* Verification Status Banner */}
                <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Verification Status</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">
                                {accreditationData?.verification?.message || "Current accreditation verification"}
                            </p>
                        </div>
                    </div>
                    {renderAccreditationStatusTag(verificationStatus)}
                </div>

                {/* Required Documents List */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Required Documents</p>
                  {accreditationDocuments.length > 0 ? accreditationDocuments.map((document) => (
                    <div
                      key={document.name}
                      className="flex items-center justify-between gap-3 bg-[#F5F9F7] border border-[#D1DED8] rounded-md px-4 py-3"
                    >
                      <span className="text-sm text-[#0A2A2E] font-poppins-custom">{document.name}</span>
                      <span className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium text-[#0A2A2E] bg-white border border-[#C5D5CD] rounded-lg">
                        {document.status}
                      </span>
                      
                    </div>
                  )) : (
                    <p className="text-sm text-[#748A91]">No documents required at this time.</p>
                  )}
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={saveAccreditationData}
                    disabled={isSavingAccreditation}
                    className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                        isSavingAccreditation ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSavingAccreditation ? "Saving..." : "Save Accreditation Details"}
                  </button>
                </div>
                </>
              )}
            </section>
            )}

            {/* -------------------- TAX & COMPLIANCE SECTION (FIXED TOGGLES) -------------------- */}

            {activeTab === "Tax & Compliance" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="#00F0C3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Tax & Compliance</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Tax identification and compliance documentation
                    </p>
                  </div>
                </header>

                {isLoadingTax ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : taxError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{taxError}</p>
                        <button
                            onClick={fetchTaxData}
                            className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium mb-2 font-poppins-custom">
                                Tax Identification Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="tax_identification_number"
                                    value={taxForm.tax_identification_number}
                                    onChange={(e) => handleChange(e, 'tax')}
                                    className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                                    placeholder="Enter TIN"
                                />
                                <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91]">
                                    {taxForm.tax_identification_number ? '✅' : ''}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#E5E7EB] pt-4">
                            <div>
                                <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">U.S. Person Status</p>
                                <p className="text-xs text-[#748A91] font-poppins-custom">For tax reporting purposes</p>
                            </div>
                            {/* FIX: Pass the new handler which correctly updates state */}
                            {renderToggle(taxForm.us_person_status, 'us_person_status', handleToggleChange)}
                        </div>

                        <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">W-9 Form Submitted</p>
                                </div>
                                {/* FIX: Pass the new handler which correctly updates state */}
                                {renderToggle(taxForm.w9_form_submitted, 'w9_form_submitted', handleToggleChange)}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#E5E5FF] pt-3">
                                <div>
                                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">K-1 Acceptance</p>
                                    <p className="text-xs text-[#748A91] font-poppins-custom">Accept K-1 tax documents</p>
                                </div>
                                {/* FIX: Pass the new handler which correctly updates state */}
                                {renderToggle(taxForm.k1_acceptance, 'k1_acceptance', handleToggleChange)}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Tax Reporting Consent</p>
                                <p className="text-xs text-[#748A91] font-poppins-custom">Receive tax documents electronically</p>
                            </div>
                            {/* FIX: Pass the new handler which correctly updates state */}
                            {renderToggle(taxForm.tax_reporting_consent, 'tax_reporting_consent', handleToggleChange)}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#E5E7EB] pt-4">
                            <div>
                                <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">AML/KYC Status</p>
                                <p className="text-xs text-[#748A91] font-poppins-custom">Anti-money laundering verification</p>
                            </div>
                            {/* AML/KYC Status is display-only, based on fetched data */}
                            {renderAccreditationStatusTag(taxData?.aml_kyc?.status_label || "Unknown")}
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={saveTaxData}
                            disabled={isSavingTax}
                            className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                                isSavingTax ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isSavingTax ? "Saving..." : "Save Tax & Compliance"}
                        </button>
                    </div>
                    </>
                )}
              </section>
            )}

            {/* -------------------- OTHER SECTIONS (Unchanged Mock Data) -------------------- */}
            
            {activeTab === "Eligibility" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Investment Eligibility Rules</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Jurisdiction preferences and investment constraints
                    </p>
                  </div>
                </header>

                {isLoadingEligibility ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : eligibilityError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{eligibilityError}</p>
                    <button
                      onClick={fetchEligibilityData}
                      className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-base font-medium text-[#0A2A2E] font-poppins-custom">Jurisdiction Preferences</p>

                        {[
                          {
                            title: "Delaware SPVs",
                            description: "Allow investment in Delaware entities",
                            name: "delaware_spvs_allowed",
                            value: eligibilityForm.delaware_spvs_allowed
                          },
                          {
                            title: "BVI SPVs",
                            description: "Allow investment in British Virgin Islands entities",
                            name: "bvi_spvs_allowed",
                            value: eligibilityForm.bvi_spvs_allowed
                          },
                          {
                            title: "Auto-Reroute Consent",
                            description: "Offer alternative jurisdiction if ineligible",
                            name: "auto_reroute_consent",
                            value: eligibilityForm.auto_reroute_consent
                          }
                        ].map((item, index) => (
                          <div
                            key={item.title}
                            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                              index < 2 ? "border-b border-[#E5E7EB] pb-4" : ""
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                              <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                            </div>
                            {renderToggle(item.value, item.name, (name, checked) => handleToggleChange(name, checked, 'eligibility'))}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom">
                          Max Annual Commitment (Optional)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-[#0A2A2E] font-medium font-poppins-custom">
                            $
                          </span>
                          <input
                            type="number"
                            name="max_annual_commitment"
                            value={eligibilityForm.max_annual_commitment}
                            onChange={(e) => handleChange(e, 'eligibility')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md pl-8 pr-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                            placeholder="500000"
                          />
                        </div>
                        <p className="text-xs text-[#748A91] font-poppins-custom">Self-imposed annual investment limit</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Deal Stage Preferences</p>
                        <div className="flex flex-wrap gap-6">
                          {[
                            { label: "Early Stage", value: "early_stage" },
                            { label: "Growth", value: "growth" },
                            { label: "Late Stage", value: "late_stage" }
                          ].map((stage) => (
                            <label key={stage.value} className="flex items-center gap-2 text-sm text-[#0A2A2E] font-poppins-custom cursor-pointer">
                              <input
                                type="checkbox"
                                checked={eligibilityForm.deal_stage_preferences.includes(stage.value)}
                                onChange={() => handleStagePreferenceChange(stage.value)}
                                className="h-4 w-4 rounded border-[#0A2A2E] text-[#00F0C3] focus:ring-[#00F0C3] cursor-pointer"
                              />
                              {stage.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start pt-2">
                      <button
                        type="button"
                        onClick={saveEligibilityData}
                        disabled={isSavingEligibility}
                        className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                          isSavingEligibility ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSavingEligibility ? "Saving..." : "Save Eligibility Rules"}
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeTab === "Financial" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10H22" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Financial & Transaction Settings</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Currency preferences and banking information
                    </p>
                  </div>
                </header>

                {isLoadingFinancial ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : financialError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{financialError}</p>
                    <button
                      onClick={fetchFinancialData}
                      className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                          Preferred Investment Currency
                        </label>
                        <div className="relative">
                          <select
                            name="preferred_investment_currency"
                            value={financialForm.preferred_investment_currency}
                            onChange={(e) => handleChange(e, 'financial')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                          >
                            {financialData?.financial?.currency_choices?.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            )) || (
                              <>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="EUR">EUR (Euro)</option>
                                <option value="GBP">GBP (British Pound)</option>
                                <option value="JPY">JPY (Japanese Yen)</option>
                                <option value="CAD">CAD (Canadian Dollar)</option>
                              </>
                            )}
                          </select>
                          <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                        </div>
                      </div>

                      <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Linked Bank Accounts</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">For wires and distributions</p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-lg text-[#0A2A2E] font-poppins-custom flex justify-end gap-2">
                            {financialData?.financial?.linked_bank_accounts?.count || 0}
                          </span>
                          <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                            Manage
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                          Escrow Partner Selection
                        </label>
                        <input
                          type="text"
                          name="escrow_partner_selection"
                          value={financialForm.escrow_partner_selection}
                          onChange={(e) => handleChange(e, 'financial')}
                          className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                          placeholder="e.g., Silicon Valley Bank"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom mb-3">Capital Call Notification Preferences</p>
                        <div className="flex flex-wrap items-center gap-6">
                          {[
                            { label: "Email", key: "email" },
                            { label: "SMS", key: "sms" },
                            { label: "In App", key: "in_app" }
                          ].map((pref) => (
                            <label key={pref.key} className="flex items-center gap-2 text-sm text-[#0A2A2E] font-poppins-custom cursor-pointer">
                              <input
                                type="checkbox"
                                checked={financialForm.capital_call_notification_preferences[pref.key]}
                                onChange={(e) => handleFinancialNotificationChange(pref.key, e.target.checked)}
                                className="h-4 w-4 rounded border-[#0A2A2E] text-[#00F0C3] focus:ring-[#00F0C3] cursor-pointer"
                              />
                              {pref.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                          Carry/Fees Display Preference
                        </label>
                        <div className="relative">
                          <select
                            name="carry_fees_display_preference"
                            value={financialForm.carry_fees_display_preference}
                            onChange={(e) => handleChange(e, 'financial')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                          >
                            {financialData?.financial?.carry_fees_choices?.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            )) || (
                              <>
                                <option value="detailed_breakdown">Detailed Breakdown</option>
                                <option value="summary">Summary</option>
                                <option value="hidden">Hidden</option>
                              </>
                            )}
                          </select>
                          <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start pt-2">
                      <button
                        type="button"
                        onClick={saveFinancialData}
                        disabled={isSavingFinancial}
                        className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                          isSavingFinancial ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSavingFinancial ? "Saving..." : "Save Financial Settings"}
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeTab === "Portfolio" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 20V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V20" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Portfolio & Liquidity</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Portfolio display and secondary market preferences
                    </p>
                  </div>
                </header>

                {isLoadingPortfolio ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : portfolioError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{portfolioError}</p>
                    <button
                      onClick={fetchPortfolioData}
                      className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                          Portfolio View Settings
                        </label>
                        <div className="relative">
                          <select
                            name="portfolio_view_settings"
                            value={portfolioForm.portfolio_view_settings}
                            onChange={(e) => handleChange(e, 'portfolio')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                          >
                            {portfolioData?.portfolio?.portfolio_view_choices?.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            )) || (
                              <>
                                <option value="deal_by_deal">Deal-by-Deal</option>
                                <option value="aggregated">Aggregated</option>
                                <option value="performance">Performance View</option>
                              </>
                            )}
                          </select>
                          <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Secondary Transfer Consent</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">Allow listing holdings for resale</p>
                        </div>
                        {renderToggle(portfolioForm.secondary_transfer_consent, "secondary_transfer_consent", (name, checked) => handleToggleChange(name, checked, 'portfolio'))}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                          Liquidity Preference
                        </label>
                        <div className="relative">
                          <select
                            name="liquidity_preference"
                            value={portfolioForm.liquidity_preference}
                            onChange={(e) => handleChange(e, 'portfolio')}
                            className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                          >
                            {portfolioData?.portfolio?.liquidity_preference_choices?.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            )) || (
                              <>
                                <option value="long_term">Long-term Holdings</option>
                                <option value="medium_term">Medium-term Holdings</option>
                                <option value="short_term">Short-term Holdings</option>
                                <option value="flexible">Flexible</option>
                              </>
                            )}
                          </select>
                          <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                        </div>
                        <p className="text-xs text-[#748A91] font-poppins-custom mt-2">Your preferred investment holding period</p>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Whitelist For Secondary Trading</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">Pre-approved counterparties</p>
                        </div>
                        {renderToggle(portfolioForm.whitelist_secondary_trading, "whitelist_secondary_trading", (name, checked) => handleToggleChange(name, checked, 'portfolio'))}
                      </div>
                    </div>

                    <div className="flex justify-start pt-2">
                      <button
                        type="button"
                        onClick={savePortfolioData}
                        disabled={isSavingPortfolio}
                        className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                          isSavingPortfolio ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSavingPortfolio ? "Saving..." : "Save Portfolio Settings"}
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeTab === "Security & Privacy" && (
              <section className="space-y-6">
                {isLoadingSecurityPrivacy ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : securityPrivacyError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{securityPrivacyError}</p>
                    <button
                      onClick={fetchSecurityPrivacyData}
                      className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                      <header className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8C6 6.4087 6.63214 4.88258 7.75736 3.75736C8.88258 2.63214 10.4087 2 12 2C13.5913 2 15.1174 2.63214 16.2426 3.75736C17.3679 4.88258 18 6.4087 18 8C18 15 21 17 21 17H3C3 17 6 15 6 8Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.3008 21C10.4682 21.3044 10.7142 21.5583 11.0133 21.7352C11.3123 21.912 11.6534 22.0053 12.0008 22.0053C12.3482 22.0053 12.6892 21.912 12.9883 21.7352C13.2873 21.5583 13.5334 21.3044 13.7008 21" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <div>
                          <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Security & Access</h2>
                          <p className="text-sm text-[#748A91] font-poppins-custom">
                            Manage your account security and access controls
                          </p>
                        </div>
                      </header>

                      <div className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Two-Factor Authentication</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">Email, SMS, or authenticator app</p>
                          </div>
                          {renderToggle(securityPrivacyForm.two_factor_authentication_enabled, "two_factor_authentication_enabled", (name, checked) => handleToggleChange(name, checked, 'security_privacy'))}
                        </div>

                        {securityPrivacyForm.two_factor_authentication_enabled && (
                          <div className="bg-[#F8F6FF] border border-[#E5E5FF] rounded-2xl px-4 py-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.91602 1.16797H4.08268C3.43835 1.16797 2.91602 1.6903 2.91602 2.33464V11.668C2.91602 12.3123 3.43835 12.8346 4.08268 12.8346H9.91602C10.5603 12.8346 11.0827 12.3123 11.0827 11.668V2.33464C11.0827 1.6903 10.5603 1.16797 9.91602 1.16797Z" stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 10.5H7.00583" stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>

                              <p className="text-sm font-medium text-[#22C55E] font-poppins-custom">2FA Enabled</p>
                            </div>
                            <p className="text-xs text-[#748A91] font-poppins-custom">
                              {securityPrivacyData?.security?.two_factor_authentication?.status_message || "Two-factor authentication is active on your account."}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                            Session Timeout
                          </label>
                          <div className="relative">
                            <select
                              name="session_timeout_minutes"
                              value={securityPrivacyForm.session_timeout_minutes}
                              onChange={(e) => handleChange(e, 'security_privacy')}
                              className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                            >
                              {securityPrivacyData?.security?.session_timeout_choices?.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                  {choice.label}
                                </option>
                              )) || (
                                <>
                                  <option value={15}>15 minutes</option>
                                  <option value={30}>30 minutes</option>
                                  <option value={60}>60 minutes</option>
                                  <option value={120}>120 minutes</option>
                                  <option value={240}>240 minutes</option>
                                </>
                              )}
                            </select>
                            <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Device Management</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">View and remove logged-in devices</p>
                          </div>
                          <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                            Manage Devices
                          </button>
                        </div>

                        <div className="space-y-3">
                          <p className="text-lg font-medium text-[#0A2A2E] font-poppins-custom">Password Change</p>
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                name="current_password"
                                value={passwordForm.current_password}
                                onChange={(e) => handleChange(e, 'password')}
                                placeholder="Enter current password"
                                className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="new_password"
                                value={passwordForm.new_password}
                                onChange={(e) => handleChange(e, 'password')}
                                placeholder="Enter new password"
                                className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                name="confirm_password"
                                value={passwordForm.confirm_password}
                                onChange={(e) => handleChange(e, 'password')}
                                placeholder="Confirm new password"
                                className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3]"
                              />
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <button 
                              type="button"
                              onClick={changePassword}
                              disabled={isChangingPassword}
                              className={`px-4 py-2 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                                isChangingPassword ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {isChangingPassword ? "Updating..." : "Update Password"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={saveSecurityPrivacyData}
                          disabled={isSavingSecurityPrivacy}
                          className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                            isSavingSecurityPrivacy ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSavingSecurityPrivacy ? "Saving..." : "Save Security Settings"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                      <header className="flex items-start gap-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#00F0C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        <div>
                          <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Privacy & Visibility</h2>
                          <p className="text-sm text-[#748A91] font-poppins-custom">
                            Control your privacy settings and profile visibility
                          </p>
                        </div>
                      </header>

                      <div className="space-y-4 border-b border-[#E5E7EB] pb-4">
                        {[
                          {
                            title: "Soft-Wall Deal Preview",
                            description: "Show teaser info before full KYC",
                            name: "soft_wall_deal_preview",
                            value: securityPrivacyForm.soft_wall_deal_preview
                          },
                          {
                            title: "Discovery Opt-In",
                            description: "Allow syndicate leads outside network to invite you",
                            name: "discovery_opt_in",
                            value: securityPrivacyForm.discovery_opt_in
                          },
                          {
                            title: "Anonymity Preference",
                            description: "Hide name from other LPs in same SPV",
                            name: "anonymity_preference",
                            value: securityPrivacyForm.anonymity_preference
                          }
                        ].map((item) => (
                          <div key={item.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                              <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                            </div>
                            {renderToggle(item.value, item.name, (name, checked) => handleToggleChange(name, checked, 'security_privacy'))}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Data Export & Deletion</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <button className="px-4 py-2 bg-[#F4F6F5] border border-[#D1DED8] rounded-md text-xs font-medium text-[#0A2A2E] font-poppins-custom">
                            <div className="flex items-center gap-2">
                                <TaxDocumentsDownloadIcon />
                                <span>Export Data</span>
                            </div>
                          </button>
                          <button className="px-4 py-2 bg-[#ED1C24] border border-[#FCA5A5] rounded-md text-xs font-medium text-white font-poppins-custom">
                            Delete Account
                          </button>
                        </div>
                        <p className="text-xs text-[#748A91] font-poppins-custom">
                          Export your data or permanently delete your account and all associated data.
                        </p>
                      </div>

                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={saveSecurityPrivacyData}
                          disabled={isSavingSecurityPrivacy}
                          className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                            isSavingSecurityPrivacy ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSavingSecurityPrivacy ? "Saving..." : "Save Privacy Settings"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeTab === "Communication" && (
              <section className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 space-y-6">
                <header className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 11.5V12C21.0006 13.3072 20.6147 14.5872 19.8954 15.6884C19.1761 16.7897 18.1548 17.6621 16.9411 18.2057C15.7273 18.7492 14.3704 18.9407 13.0473 18.7561C11.7241 18.5715 10.496 18.0196 9.5 17.17L5 19L6.83001 14.5C6.11342 13.3652 5.72376 12.0311 5.71146 10.6615C5.69915 9.29189 6.06471 7.95244 6.76484 6.80429C7.46498 5.65614 8.47 4.74547 9.66463 4.18449C10.8593 3.62351 12.1907 3.4364 13.4934 3.64427C14.7961 3.85213 16.0124 4.44508 16.9642 5.34516C17.9159 6.24524 18.5586 7.40574 18.8065 8.67268"
                      stroke="#00F0C3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#0A2A2E] font-poppins-custom">Communication & Notifications</h2>
                    <p className="text-sm text-[#748A91] font-poppins-custom">
                      Manage how you receive updates and communications
                    </p>
                  </div>
                </header>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="relative">
                      <select
                        name="preferred_contact_method"
                        value={communicationForm.preferred_contact_method}
                        onChange={(e) => handleChange(e, 'communication')}
                        className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                      >
                        {(communicationData?.communication?.contact_method_choices || communicationData?.contact_method_choices || []).length > 0 ? (
                          (communicationData.communication?.contact_method_choices || communicationData.contact_method_choices || []).map(choice => (
                            <option key={choice.value} value={choice.value}>{choice.label}</option>
                          ))
                        ) : (
                          <>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="phone">Phone</option>
                            <option value="in_app">In App</option>
                          </>
                        )}
                      </select>
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-[#748A91] font-medium font-poppins-custom mb-2">
                      Update Frequency
                    </label>
                    <div className="relative">
                      <select
                        name="update_frequency"
                        value={communicationForm.update_frequency}
                        onChange={(e) => handleChange(e, 'communication')}
                        className="w-full bg-white border border-[#0A2A2E] rounded-md px-4 py-3 text-sm text-[#0A2A2E] font-poppins-custom focus:outline-none focus:ring-2 focus:ring-[#00F0C3] appearance-none"
                      >
                        {(communicationData?.communication?.update_frequency_choices || communicationData?.update_frequency_choices || []).length > 0 ? (
                          (communicationData.communication?.update_frequency_choices || communicationData.update_frequency_choices || []).map(choice => (
                            <option key={choice.value} value={choice.value}>{choice.label}</option>
                          ))
                        ) : (
                          <>
                            <option value="real_time">Real-time</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                            <option value="monthly">Monthly Digest</option>
                          </>
                        )}
                      </select>
                      <span className="absolute inset-y-0 right-0 px-3 flex items-center text-[#748A91] pointer-events-none">▼</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-[#E5E7EB] pt-4">
                    <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Event Alerts</p>
                    <div className="space-y-3">
                      {[
                        { key: 'capital_calls', title: "Capital Calls", description: "Investment funding requests" },
                        { key: 'secondary_offers', title: "Secondary Offers", description: "Secondary market opportunities" },
                        { key: 'portfolio_updates', title: "Portfolio Updates", description: "Performance and valuation changes" },
                        { key: 'distributions', title: "Distributions", description: "Dividend and return payments" },
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">{item.title}</p>
                            <p className="text-xs text-[#748A91] font-poppins-custom">{item.description}</p>
                          </div>
                          {renderToggle(communicationForm.event_alerts[item.key], item.key, (name, checked) => handleCommunicationToggle(name, checked))}
                        </div>
                      ))}

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[#E5E7EB] pt-3">
                        <div>
                          <p className="text-sm font-medium text-[#0A2A2E] font-poppins-custom">Marketing Consent</p>
                          <p className="text-xs text-[#748A91] font-poppins-custom">Product updates and partner offers</p>
                        </div>
                        {renderToggle(communicationForm.marketing_consent, 'marketing_consent', (name, checked) => handleCommunicationToggle(name, checked))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    type="button"
                    onClick={saveCommunicationData}
                    disabled={isSavingCommunication}
                    className={`px-6 py-3 bg-[#00F0C3] text-[#001D21] rounded-md text-sm font-medium font-poppins-custom hover:bg-[#00D9B0] transition-colors ${
                      isSavingCommunication ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSavingCommunication ? "Saving..." : "Save Communication Settings"}
                  </button>
                </div>
              </section>
            )}

            {/* Default/Empty Section */}
            {activeTab !== "Identity" &&
              activeTab !== "Accreditation" &&
              activeTab !== "Tax & Compliance" &&
              activeTab !== "Eligibility" &&
              activeTab !== "Financial" &&
              activeTab !== "Portfolio" &&
              activeTab !== "Security & Privacy" &&
              activeTab !== "Communication" && ( 
                <section className="bg-white border border-dashed border-[#D8DEE4] rounded-3xl p-6 text-center text-sm text-[#748A91] font-poppins-custom">
                  This section will be available soon.
                </section>
              )}
            </div>
          </div>
        </section>
      </main>
      {toast.visible && (
        <div className={`fixed right-6 bottom-6 z-50 px-4 py-3 rounded-md shadow-lg ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#00F0C3] text-[#001D21]'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default InvestorSettings;
