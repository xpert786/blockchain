import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeadIcon, RightsIcon } from "../../components/Icons";

const EntityProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firmName: "",
    description: "",
    logo: null,
    enablePlatformLpAccess: false,
    sectorFocus: [],
    geographyFocus: [],
    existingLpNetwork: "No"
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showGeographyDropdown, setShowGeographyDropdown] = useState(false);
  const sectorDropdownRef = useRef(null);
  const geographyDropdownRef = useRef(null);

  const [sectors, setSectors] = useState([
    { id: 1, name: "AI / Machine Learning" },
    { id: 2, name: "Fintech" },
    { id: 3, name: "SaaS / Cloud Software" },
    { id: 4, name: "Healthcare / Digital Health" },
    { id: 5, name: "Life Sciences / Biotech" },
    { id: 6, name: "Deep Tech / Frontier Tech" },
    { id: 7, name: "Web3 / Blockchain / Crypto" },
    { id: 8, name: "Climate Tech / CleanTech" }
  ]);
  const [geographies, setGeographies] = useState([
    { id: 1, name: "Global", region: "Worldwide" },
    { id: 2, name: "North America", region: "US, Canada" },
    { id: 3, name: "Latin America", region: "Mexico, Brazil" },
    { id: 4, name: "Europe", region: "EU, UK" },
    { id: 5, name: "Asia Pacific", region: "Singapore, Hong Kong" },
    { id: 6, name: "Middle East", region: "UAE, Saudi Arabia" },
    { id: 7, name: "Africa", region: "South Africa, Nigeria" },
    { id: 8, name: "Oceania", region: "Australia, New Zealand" }
  ]);

  const [teamData, setTeamData] = useState({
    name: "",
    email: "",
    role: "",
    leadPartner: "",
    coLeadDealPartner: "",
    operationsManager: "",
    complianceOfficer: "",
    analystDealScout: "",
    viewer: "Read-Only",
    permissions: {
      // Deal Permissions
      createSPVs: false,
      uploadDealMaterials: false,
      publishSPVs: false,
      editDealTerms: false,
      // Investor Permissions
      inviteLPs: false,
      viewLPCommitments: false,
      viewLPList: false,
      communicateWithLPs: false,
      // Operations & Finance
      manageCapitalCalls: false,
      manageBankAccounts: false,
      sendTaxDocuments: false,
      updatePaymentStatuses: false,
      // Compliance
      reviewKYCKYB: false,
      viewJurisdictionEligibilityFlags: false,
      approveRejectInvestors: false,
      accessAuditLogs: false,
      // Team Management
      addRemoveTeamMembers: false,
      editRolesPermissions: false
    },
    enableRoleBasedAccess: false
  });
  const [teamModalError, setTeamModalError] = useState("");
  const [teamModalLoading, setTeamModalLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);


  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectorAdd = useCallback((sectorId) => {
    setFormData(prev => prev.sectorFocus.includes(sectorId) ? prev : {
      ...prev,
      sectorFocus: [...prev.sectorFocus, sectorId]
    });
    setShowSectorDropdown(false);
  }, []);

  const handleSectorRemove = useCallback((sectorId) => {
    setFormData(prev => ({
      ...prev,
      sectorFocus: prev.sectorFocus.filter(id => id !== sectorId)
    }));
  }, []);

  const handleGeographyAdd = useCallback((geographyId) => {
    setFormData(prev => prev.geographyFocus.includes(geographyId) ? prev : {
      ...prev,
      geographyFocus: [...prev.geographyFocus, geographyId]
    });
    setShowGeographyDropdown(false);
  }, []);

  const handleGeographyRemove = useCallback((geographyId) => {
    setFormData(prev => ({
      ...prev,
      geographyFocus: prev.geographyFocus.filter(id => id !== geographyId)
    }));
  }, []);

  // Memoized helper functions
  const sectorOptions = sectors.filter(s => !formData.sectorFocus.includes(s.id));
  const geographyOptions = geographies.filter(g => !formData.geographyFocus.includes(g.id));
  const getSectorName = useCallback((id) => sectors.find(s => s.id === id)?.name ?? `Sector ${id}`, [sectors]);
  const getGeographyName = useCallback((id) => geographies.find(g => g.id === id)?.name ?? `Geography ${id}`, [geographies]);

  // === OUTSIDE CLICK HANDLERS FOR DROPDOWNS ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setShowSectorDropdown(false);
      }
      if (geographyDropdownRef.current && !geographyDropdownRef.current.contains(event.target)) {
        setShowGeographyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch existing step2 data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const step2Url = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;

        console.log("=== Fetching Step2 Data ===");
        console.log("API URL:", step2Url);

        const response = await axios.get(step2Url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Step2 response:", response.data);

        if (response.data && response.status === 200) {
          const data = response.data;
          const profile = data.profile || {};
          const stepData = data.step_data || {};

          // Use step_data if available, otherwise use profile
          const sourceData = Object.keys(stepData).length > 0 ? stepData : profile;

          // Map API response to form data
          setFormData(prev => ({
            ...prev,
            firmName: sourceData.firm_name || prev.firmName,
            description: sourceData.description || prev.description,
            sectorFocus: sourceData.sector_ids || sourceData.sectors?.map(s => s.id || s) || prev.sectorFocus,
            geographyFocus: sourceData.geography_ids || sourceData.geographies?.map(g => g.id || g) || prev.geographyFocus,
            existingLpNetwork: sourceData.existing_lp_count ? "Yes" : prev.existingLpNetwork,
            enablePlatformLpAccess: sourceData.enable_platform_lp_access !== undefined
              ? sourceData.enable_platform_lp_access
              : prev.enablePlatformLpAccess
          }));

          // Handle logo if available
          if (sourceData.logo) {
            let logoUrl;
            if (sourceData.logo.startsWith('http://') || sourceData.logo.startsWith('https://')) {
              logoUrl = sourceData.logo;
            } else if (sourceData.logo.startsWith('/blockchain-backend/')) {
              // If it already includes /blockchain-backend/, use as is with base domain
              logoUrl = `http://168.231.121.7${sourceData.logo}`;
            } else if (sourceData.logo.startsWith('/media/')) {
              // If it starts with /media/, prepend the base URL (no duplicate blockchain-backend)
              logoUrl = `http://72.61.251.114/blockchain-backend${sourceData.logo}`;
            } else if (sourceData.logo.startsWith('media/')) {
              // If it starts with media/ (no leading slash), add the slash
              logoUrl = `http://72.61.251.114/blockchain-backend/${sourceData.logo}`;
            } else {
              // For other paths, construct properly
              const cleanPath = sourceData.logo.startsWith('/') ? sourceData.logo : `/${sourceData.logo}`;
              // Check if path already contains blockchain-backend
              if (cleanPath.includes('/blockchain-backend/')) {
                logoUrl = `http://168.231.121.7${cleanPath}`;
              } else {
                logoUrl = `http://72.61.251.114/blockchain-backend${cleanPath}`;
              }
            }
            setLogoPreview(logoUrl);
          }

          console.log("✅ Form populated with existing Step2 data");
        }
      } catch (err) {
        // If 404, no existing data - that's fine
        if (err.response?.status === 404) {
          console.log("No existing Step2 data found - will create new");
        } else {
          console.error("Error fetching existing Step2 data:", err);
        }
      }
    };

    fetchExistingData();
  }, []);

  // Fetch team members list on mount and when modal closes
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("No access token found, skipping team members fetch");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
        const teamManagementUrl = `${API_URL.replace(/\/$/, "")}/syndicate/settings/team-management/`;

        console.log("=== Fetching Team Members ===");
        console.log("API URL:", teamManagementUrl);

        const response = await axios.get(teamManagementUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Team members response:", response.data);
        console.log("Response status:", response.status);

        if (response.data && response.status === 200) {
          // API response structure: { success: true, data: { team_members: [...], team_members_count: 3 } }
          const responseData = response.data;
          let membersList = [];

          // Check different possible response structures
          if (Array.isArray(responseData)) {
            membersList = responseData;
          } else if (responseData.data && responseData.data.team_members) {
            // Structure: { success: true, data: { team_members: [...] } }
            membersList = Array.isArray(responseData.data.team_members) ? responseData.data.team_members : [];
          } else if (responseData.team_members) {
            // Structure: { team_members: [...] }
            membersList = Array.isArray(responseData.team_members) ? responseData.team_members : [];
          } else if (responseData.results) {
            // Structure: { results: [...] }
            membersList = Array.isArray(responseData.results) ? responseData.results : [];
          } else if (responseData.data && Array.isArray(responseData.data)) {
            // Structure: { data: [...] }
            membersList = responseData.data;
          }

          console.log("✅ Team members loaded:", membersList.length, "members");
          console.log("Team members data:", membersList);
          setTeamMembers(membersList);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("No team members found (404)");
          setTeamMembers([]);
        } else {
          console.error("Error fetching team members:", err);
          console.error("Error response:", err.response?.data);
          setTeamMembers([]);
        }
      }
    };

    fetchTeamMembers();
  }, []); // Fetch on mount

  // Refetch team members when modal closes
  useEffect(() => {
    if (!showTeamModal) {
      const fetchTeamMembers = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            return;
          }

          const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
          const teamManagementUrl = `${API_URL.replace(/\/$/, "")}/syndicate/settings/team-management/`;

          const response = await axios.get(teamManagementUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          if (response.data && response.status === 200) {
            const responseData = response.data;
            let membersList = [];

            // Check different possible response structures
            if (Array.isArray(responseData)) {
              membersList = responseData;
            } else if (responseData.data && responseData.data.team_members) {
              membersList = Array.isArray(responseData.data.team_members) ? responseData.data.team_members : [];
            } else if (responseData.team_members) {
              membersList = Array.isArray(responseData.team_members) ? responseData.team_members : [];
            } else if (responseData.results) {
              membersList = Array.isArray(responseData.results) ? responseData.results : [];
            } else if (responseData.data && Array.isArray(responseData.data)) {
              membersList = responseData.data;
            }

            setTeamMembers(membersList);
            console.log("✅ Team members refreshed after modal close:", membersList.length);
          }
        } catch (err) {
          console.error("Error refreshing team members:", err);
        }
      };

      fetchTeamMembers();
    }
  }, [showTeamModal]);

  const handleNext = async () => {
    setError("");
    setLoading(true);

    // Validation
    if (!formData.firmName.trim()) {
      setError("Firm / Syndicate Name is required.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const step2Url = `${API_URL.replace(/\/$/, "")}/syndicate/step2/`;

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("firm_name", formData.firmName);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("existing_lp_count", formData.existingLpNetwork === "Yes" ? "11-25" : "");
      formDataToSend.append("enable_platform_lp_access", formData.enablePlatformLpAccess);

      // Add arrays (sector_ids and geography_ids)
      formData.sectorFocus.forEach(id => {
        formDataToSend.append("sector_ids", id);
      });
      formData.geographyFocus.forEach(id => {
        formDataToSend.append("geography_ids", id);
      });

      // Add logo file if exists
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
        console.log("Logo file will be uploaded:", formData.logo.name);
      }

      console.log("=== PATCH Step2 Data ===");
      console.log("API URL:", step2Url);
      console.log("Form Data:", {
        firm_name: formData.firmName,
        description: formData.description,
        sector_ids: formData.sectorFocus,
        geography_ids: formData.geographyFocus,
        existing_lp_count: formData.existingLpNetwork === "Yes" ? "11-25" : "",
        enable_platform_lp_access: formData.enablePlatformLpAccess,
        hasLogo: !!formData.logo
      });

      const response = await axios.patch(step2Url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
          // Note: Don't set Content-Type header - axios will set it automatically with boundary for FormData
        }
      });

      console.log("✅ Step2 updated successfully:", response.data);

      // Navigate to next step on success
      navigate("/syndicate-creation/kyb-verification");
    } catch (err) {
      console.error("Error updating Step2:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          // Handle specific field errors
          const errorMessages = Object.values(backendData).flat();
          setError(errorMessages.join(", ") || "Failed to update entity profile.");
        } else {
          setError(String(backendData));
        }
      } else {
        setError(err.message || "Failed to update entity profile. Please try again.");
      }
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    navigate("/syndicate-creation/lead-info");
  };

  const handleTeamInputChange = (field, value) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionChange = (permission, value) => {
    setTeamData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handleSendInvitation = async () => {
    setTeamModalError("");
    setTeamModalLoading(true);

    // Validation
    if (!teamData.name.trim()) {
      setTeamModalError("Name is required.");
      setTeamModalLoading(false);
      return;
    }
    if (!teamData.email.trim()) {
      setTeamModalError("Email is required.");
      setTeamModalLoading(false);
      return;
    }
    if (!teamData.role) {
      setTeamModalError("Role is required.");
      setTeamModalLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://72.61.251.114/blockchain-backend";
      const teamManagementUrl = `${API_URL.replace(/\/$/, "")}/syndicate/settings/team-management/`;

      // Convert role to snake_case format
      const roleMapping = {
        "lead-partner": "lead_partner",
        "co-lead": "co_lead",
        "operations-manager": "operations_manager",
        "compliance-officer": "compliance_officer",
        "analyst": "analyst",
        "viewer": "viewer"
      };
      const apiRole = roleMapping[teamData.role] || teamData.role.replace(/-/g, "_");

      // Prepare request data with all permissions
      const requestData = {
        name: teamData.name,
        email: teamData.email,
        role: apiRole,
        // Deal Permissions
        can_create_spvs: teamData.permissions.createSPVs,
        can_publish_spvs: teamData.permissions.publishSPVs,
        can_upload_deal_materials: teamData.permissions.uploadDealMaterials,
        can_edit_deal_terms: teamData.permissions.editDealTerms,
        // Investor Permissions
        can_invite_lps: teamData.permissions.inviteLPs,
        can_view_lp_list: teamData.permissions.viewLPList,
        can_view_lp_commitments: teamData.permissions.viewLPCommitments,
        can_communicate_with_lps: teamData.permissions.communicateWithLPs,
        // Operations & Finance Permissions
        can_manage_capital_calls: teamData.permissions.manageCapitalCalls,
        can_update_payment_statuses: teamData.permissions.updatePaymentStatuses,
        can_manage_bank_accounts: teamData.permissions.manageBankAccounts,
        can_send_tax_documents: teamData.permissions.sendTaxDocuments,
        // Compliance Permissions
        can_review_kyc_kyb: teamData.permissions.reviewKYCKYB,
        can_approve_reject_investors: teamData.permissions.approveRejectInvestors,
        can_view_jurisdiction_flags: teamData.permissions.viewJurisdictionEligibilityFlags,
        can_access_audit_logs: teamData.permissions.accessAuditLogs,
        // Team Management Permissions
        can_add_remove_team_members: teamData.permissions.addRemoveTeamMembers,
        can_edit_roles_permissions: teamData.permissions.editRolesPermissions
      };

      console.log("=== POST Team Member ===");
      console.log("API URL:", teamManagementUrl);
      console.log("Request Data:", requestData);

      const response = await axios.post(teamManagementUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("✅ Team member added successfully:", response.data);

      // Refresh team members list
      const refreshUrl = `${API_URL.replace(/\/$/, "")}/syndicate/settings/team-management/`;
      const membersResponse = await axios.get(refreshUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const membersData = membersResponse.data;
      let membersList = [];

      // Check different possible response structures
      if (Array.isArray(membersData)) {
        membersList = membersData;
      } else if (membersData.data && membersData.data.team_members) {
        membersList = Array.isArray(membersData.data.team_members) ? membersData.data.team_members : [];
      } else if (membersData.team_members) {
        membersList = Array.isArray(membersData.team_members) ? membersData.team_members : [];
      } else if (membersData.results) {
        membersList = Array.isArray(membersData.results) ? membersData.results : [];
      } else if (membersData.data && Array.isArray(membersData.data)) {
        membersList = membersData.data;
      }

      setTeamMembers(membersList);

      // Close modal and reset form on success
      setShowTeamModal(false);
      setTeamData({
        name: "",
        email: "",
        role: "",
        leadPartner: "",
        coLeadDealPartner: "",
        operationsManager: "",
        complianceOfficer: "",
        analystDealScout: "",
        viewer: "Read-Only",
        permissions: {
          createSPVs: false,
          uploadDealMaterials: false,
          publishSPVs: false,
          editDealTerms: false,
          inviteLPs: false,
          viewLPCommitments: false,
          viewLPList: false,
          communicateWithLPs: false,
          manageCapitalCalls: false,
          manageBankAccounts: false,
          sendTaxDocuments: false,
          updatePaymentStatuses: false,
          reviewKYCKYB: false,
          viewJurisdictionEligibilityFlags: false,
          approveRejectInvestors: false,
          accessAuditLogs: false,
          addRemoveTeamMembers: false,
          editRolesPermissions: false
        },
        enableRoleBasedAccess: false
      });
    } catch (err) {
      console.error("Error adding team member:", err);
      const backendData = err.response?.data;
      if (backendData) {
        if (typeof backendData === "object") {
          const errorMessages = Object.values(backendData).flat();
          setTeamModalError(errorMessages.join(", ") || "Failed to add team member.");
        } else {
          setTeamModalError(String(backendData));
        }
      } else {
        setTeamModalError(err.message || "Failed to add team member. Please try again.");
      }
    } finally {
      setTeamModalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl  text-[#001D21] mb-2">Step 2: Entity Profile</h1>
        <p className="text-gray-600">Company information and structure</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Firm / Syndicate Name */}
        <div>
          <label className="block text-sm  text-[#0A2A2E] mb-2">
            Firm / Syndicate Name *
          </label>
          <input
            type="text"
            value={formData.firmName}
            onChange={(e) => handleInputChange("firmName", e.target.value)}
            className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium  text-[#0A2A2E] mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Write here..."
          />
        </div>

        {/* Syndicate Logo */}
        <div>
          <label className="block text-sm font-medium  text-[#0A2A2E] mb-4">
            Syndicate Logo
          </label>
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            <div className="w-24 h-24 bg-[#F4F6F5] rounded-lg flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <LeadIcon />
              )}
            </div>

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 !border border-[#01373D] bg-[#F4F6F5] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer inline-block"
              >
                {formData.logo ? "Change File" : "Choose File"}
              </label>
              {formData.logo && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: null }));
                    setLogoPreview(null);
                    const fileInput = document.getElementById("logo-upload");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="ml-2 px-3 py-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Team Members */}
        <div>
          <button
            type="button"
            onClick={() => setShowTeamModal(true)}
            className="bg-[#CEC6FF] ver:bg-purple-600 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Team Members
          </button>

          {/* Team Members List - Show directly after button */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#0A2A2E] mb-3">
              Team Members {teamMembers.length > 0 && `(${teamMembers.length})`}
            </h3>
            {teamMembers.length > 0 ? (
              <div className="space-y-3 flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <div key={member.id || member.email} className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-fit">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{member.name || "N/A"}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {member.email && <span>Email: {member.email}</span>}
                          {member.role && (
                            <span className="ml-4">
                              Role: {member.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          )}
                        </p>
                        {(member.can_create_spvs || member.can_publish_spvs || member.can_upload_deal_materials ||
                          member.can_edit_deal_terms || member.can_invite_lps || member.can_view_lp_list ||
                          member.can_view_lp_commitments || member.can_communicate_with_lps ||
                          member.can_manage_capital_calls || member.can_update_payment_statuses ||
                          member.can_manage_bank_accounts || member.can_send_tax_documents ||
                          member.can_review_kyc_kyb || member.can_approve_reject_investors ||
                          member.can_view_jurisdiction_flags || member.can_access_audit_logs ||
                          member.can_add_remove_team_members || member.can_edit_roles_permissions) ? (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-600">Permissions: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {member.can_create_spvs && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Create SPVs</span>
                              )}
                              {member.can_publish_spvs && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Publish SPVs</span>
                              )}
                              {member.can_upload_deal_materials && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Upload Deal Materials</span>
                              )}
                              {member.can_edit_deal_terms && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Edit Deal Terms</span>
                              )}
                              {member.can_invite_lps && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Invite LPs</span>
                              )}
                              {member.can_view_lp_list && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View LP List</span>
                              )}
                              {member.can_view_lp_commitments && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View LP Commitments</span>
                              )}
                              {member.can_communicate_with_lps && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Communicate with LPs</span>
                              )}
                              {member.can_manage_capital_calls && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Manage Capital Calls</span>
                              )}
                              {member.can_update_payment_statuses && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Update Payment Statuses</span>
                              )}
                              {member.can_manage_bank_accounts && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Manage Bank Accounts</span>
                              )}
                              {member.can_send_tax_documents && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Send Tax Documents</span>
                              )}
                              {member.can_review_kyc_kyb && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Review KYC/KYB</span>
                              )}
                              {member.can_approve_reject_investors && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approve/Reject Investors</span>
                              )}
                              {member.can_view_jurisdiction_flags && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View Jurisdiction Flags</span>
                              )}
                              {member.can_access_audit_logs && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Access Audit Logs</span>
                              )}
                              {member.can_add_remove_team_members && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Add/Remove Team Members</span>
                              )}
                              {member.can_edit_roles_permissions && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Edit Roles & Permissions</span>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic py-2">
                No team members added yet. Click "Add Team Members" to invite team members.
              </div>
            )}
          </div>
        </div>

        {/* Enable Platform LP Access */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.enablePlatformLpAccess}
              onChange={e => handleInputChange("enablePlatformLpAccess", e.target.checked)}
              className="h-5 w-5 text-purple-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable Platform LP Access
            </span>
          </label>
        </div>

        {/* Geography Focus */}
        <div className="space-y-4">
          <h2 className="text-xl text-[#0A2A2E]">Geography Focus</h2>
          <div className="relative" ref={geographyDropdownRef}>
            <div
              className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
              onClick={() => setShowGeographyDropdown(g => !g)}
            >
              {formData.geographyFocus.length > 0 ? formData.geographyFocus.map((geographyId) => (
                <span
                  key={geographyId}
                  className="bg-white px-3 py-1 rounded-lg border border-[#748A91] text-sm flex items-center gap-2 text-[#0A2A2E]"
                  onClick={e => e.stopPropagation()}
                >
                  {getGeographyName(geographyId)}
                  <button
                    onClick={e => { e.stopPropagation(); handleGeographyRemove(geographyId); }}
                    className="text-gray-500 hover:text-gray-700 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-300"
                    aria-label="Remove geography"
                    tabIndex={-1}
                    type="button"
                  >×</button>
                </span>
              )) : (
                <span className="text-gray-400 text-sm">Select geographies...</span>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showGeographyDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showGeographyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-2 space-y-2">
                  {geographies.map(geography => {
                    const isSelected = formData.geographyFocus.includes(geography.id);
                    return (
                      <button
                        key={geography.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            handleGeographyRemove(geography.id);
                          } else {
                            handleGeographyAdd(geography.id);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${isSelected
                            ? 'bg-[#0A3A38] text-white'
                            : 'bg-white text-[#0A2A2E] border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="font-medium">{geography.name}</div>
                        {geography.region && (
                          <div className={`text-xs mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                            {geography.region}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sector Focus */}
        <div className="space-y-4">
          <h2 className="text-xl text-[#0A2A2E]">Sector Focus</h2>
          <div className="relative" ref={sectorDropdownRef}>
            <div
              className="border border-[#0A2A2E] rounded-lg p-3 min-h-[50px] flex flex-wrap items-center gap-2 bg-[#F4F6F5] cursor-pointer"
              onClick={() => setShowSectorDropdown(s => !s)}
            >
              {formData.sectorFocus.length > 0 ? formData.sectorFocus.map((sectorId) => (
                <span
                  key={sectorId}
                  className="bg-white px-3 py-1 rounded-lg border border-[#748A91] text-sm flex items-center gap-2 text-[#0A2A2E]"
                  onClick={e => e.stopPropagation()}
                >
                  {getSectorName(sectorId)}
                  <button
                    onClick={e => { e.stopPropagation(); handleSectorRemove(sectorId); }}
                    className="text-gray-500 hover:text-gray-700 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-300"
                    aria-label="Remove sector"
                    tabIndex={-1}
                    type="button"
                  >×</button>
                </span>
              )) : (
                <span className="text-gray-400 text-sm">Select sectors...</span>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${showSectorDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {showSectorDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-2 space-y-2">
                  {sectors.map(sector => {
                    const isSelected = formData.sectorFocus.includes(sector.id);
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            handleSectorRemove(sector.id);
                          } else {
                            handleSectorAdd(sector.id);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${isSelected
                            ? 'bg-[#0A3A38] text-white'
                            : 'bg-white text-[#0A2A2E] border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="font-medium">{sector.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing LP Network */}
        <div className="space-y-4">
          <h2 className="text-xl text-[#0A2A2E]">Existing LP Network</h2>
          <p className="text-gray-600">How many LPs do you have to invest in your deals?</p>
          <div className="border border-[#0A2A2E] rounded-lg p-3 w-full sm:max-w-xs bg-[#F4F6F5]">
            <select
              value={formData.existingLpNetwork}
              onChange={e => handleInputChange("existingLpNetwork", e.target.value)}
              className="w-full bg-transparent outline-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {formData.existingLpNetwork === "No" && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Don't Worry, You Can Still Leverage Platform LPs To Raise Funds</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
        <button
          onClick={handlePrevious}
          className="bg-[#F4F6F5] !border border-[#01373D] hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Next"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Team & Roles Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 h-auto max-h-[90vh] flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 p-7">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Team & Roles</h2>
                  <p className="text-gray-600 text-sm">Add team members and configure their roles and permissions.</p>
                </div>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.25" y="0.25" width="22.5" height="22.5" rx="5.75" fill="#F4F6F5" />
                    <rect x="0.25" y="0.25" width="22.5" height="22.5" rx="5.75" stroke="#E8EAED" stroke-width="0.5" />
                    <path d="M15 8L8 15M8 8L15 15" stroke="#01373D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </button>
              </div>

              {/* Error Message */}
              {teamModalError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{teamModalError}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={teamData.name}
                    onChange={(e) => handleTeamInputChange("name", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={teamData.email}
                    onChange={(e) => handleTeamInputChange("email", e.target.value)}
                    className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter email Address"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <div className="relative">
                    <select
                      value={teamData.role}
                      onChange={(e) => handleTeamInputChange("role", e.target.value)}
                      className="w-full border border-[#0A2A2E] rounded-lg p-3 bg-[#F4F6F5] focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                    >
                      <option value="">Select Role</option>
                      <option value="lead-partner">Lead Partner</option>
                      <option value="co-lead">Co-Lead / Deal Partner</option>
                      <option value="operations-manager">Operations Manager</option>
                      <option value="compliance-officer">Compliance Officer</option>
                      <option value="analyst">Analyst / Deal Scout</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Role-specific Fields */}
                <div className="space-y-4">
                </div>

                {/* Permissions Sections */}
                <div className="space-y-6">
                  {/* Deal Permissions */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Deal Permissions</h3>
                    <div className="space-y-2 grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.createSPVs}
                          onChange={(e) => handlePermissionChange("createSPVs", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Create SPVs</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.uploadDealMaterials}
                          onChange={(e) => handlePermissionChange("uploadDealMaterials", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Upload deal materials</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.publishSPVs}
                          onChange={(e) => handlePermissionChange("publishSPVs", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Publish SPVs</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.editDealTerms}
                          onChange={(e) => handlePermissionChange("editDealTerms", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Edit deal terms</span>
                      </label>
                    </div>
                  </div>

                  {/* Investor Permissions */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Investor Permissions</h3>
                    <div className="space-y-2 grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.inviteLPs}
                          onChange={(e) => handlePermissionChange("inviteLPs", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Invite LPs</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.viewLPCommitments}
                          onChange={(e) => handlePermissionChange("viewLPCommitments", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">View LP commitments</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.viewLPList}
                          onChange={(e) => handlePermissionChange("viewLPList", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">View LP list</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.communicateWithLPs}
                          onChange={(e) => handlePermissionChange("communicateWithLPs", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Communicate with LPs</span>
                      </label>
                    </div>
                  </div>

                  {/* Operations & Finance */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Operations & Finance</h3>
                    <div className="space-y-2 grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.manageCapitalCalls}
                          onChange={(e) => handlePermissionChange("manageCapitalCalls", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Manage capital calls</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.manageBankAccounts}
                          onChange={(e) => handlePermissionChange("manageBankAccounts", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Manage bank accounts</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.sendTaxDocuments}
                          onChange={(e) => handlePermissionChange("sendTaxDocuments", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Send tax documents</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.updatePaymentStatuses}
                          onChange={(e) => handlePermissionChange("updatePaymentStatuses", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Update payment statuses</span>
                      </label>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Compliance</h3>
                    <div className="space-y-2 grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.reviewKYCKYB}
                          onChange={(e) => handlePermissionChange("reviewKYCKYB", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Review KYC/KYB</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.viewJurisdictionEligibilityFlags}
                          onChange={(e) => handlePermissionChange("viewJurisdictionEligibilityFlags", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">View jurisdiction/eligibility flags</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.approveRejectInvestors}
                          onChange={(e) => handlePermissionChange("approveRejectInvestors", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Approve/reject investors</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.accessAuditLogs}
                          onChange={(e) => handlePermissionChange("accessAuditLogs", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Access audit logs</span>
                      </label>
                    </div>
                  </div>

                  {/* Team Management */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Team Management</h3>
                    <div className="space-y-2 grid grid-cols-2 gap-2  ">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.addRemoveTeamMembers}
                          onChange={(e) => handlePermissionChange("addRemoveTeamMembers", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Add/remove team members</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={teamData.permissions.editRolesPermissions}
                          onChange={(e) => handlePermissionChange("editRolesPermissions", e.target.checked)}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Edit roles & permissions</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Role-based Access Controls */}
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={teamData.enableRoleBasedAccess}
                      onChange={(e) => handleTeamInputChange("enableRoleBasedAccess", e.target.checked)}
                      className="mr-2 mt-1 h-4 w-4 text-purple-600 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable Role-based Access Controls</span>
                      <p className="text-xs text-gray-500 mt-1">
                        When enabled, permissions will be automatically assigned based on team member roles and can be overridden individually.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Send Invitation Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSendInvitation}
                  disabled={teamModalLoading}
                  className="bg-[#00F0C3] hover:bg-teal-600 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {teamModalLoading ? "Sending..." : "Send Invitation"}
                  {!teamModalLoading && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.4547 0.172306C13.3745 0.0928875 13.2733 0.0379113 13.163 0.0137808C13.0526 -0.0103498 12.9378 -0.00264136 12.8317 0.0360083L0.0973069 4.70731L0.000109537 5.81828L4.95802 8.32283L7.80995 13.6812L8.92115 13.7785L13.595 0.794602C13.633 0.688247 13.64 0.573284 13.6151 0.463108C13.5903 0.352932 13.5347 0.252081 13.4547 0.172306ZM8.32779 12.6588L5.87643 8.05292L10.653 3.66008L10.0185 2.97003L5.20447 7.39711L1.11666 5.33208L12.4633 1.16967L8.32779 12.6588Z" fill="#001D21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityProfile;
