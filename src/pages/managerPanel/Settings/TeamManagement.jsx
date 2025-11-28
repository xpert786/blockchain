import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UsersIcon, SearchIcon, PlusIcon, SaveIcon, EyeIcon, DotsVerticalIcon,ThreeUsersIcon } from "../../../components/Icons";

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [memberChanges, setMemberChanges] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRefs = useRef({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  // Close dropdown when clicking outside and recalculate position
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-button')) {
        setOpenDropdown(null);
      }
    };

    const updateDropdownPosition = () => {
      if (openDropdown !== null) {
        const button = buttonRefs.current[openDropdown];
        if (button) {
          const rect = button.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right
          });
        }
      }
    };

    if (openDropdown !== null) {
      updateDropdownPosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [openDropdown]);

  // New member form state
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    role: "analyst",
    can_access_dashboard: false,
    can_manage_spvs: false,
    can_manage_documents: false,
    can_manage_investors: false,
    can_view_reports: false,
    can_manage_transfers: false,
    can_manage_team: false,
    can_manage_settings: false
  });

  // Get API URL
  const getApiUrl = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://168.231.121.7/blockchain-backend";
    return `${API_URL.replace(/\/$/, "")}`;
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Map role to display name
  const getRoleDisplayName = (role) => {
    const roleMap = {
      "manager": "Manager",
      "admin": "Admin",
      "analyst": "Analyst",
      "member": "Member"
    };
    return roleMap[role] || role || "Select Roles";
  };

  // Get permissions summary
  const getPermissionsSummary = (member) => {
    const permissions = [];
    if (member.can_access_dashboard) permissions.push("Dashboard");
    if (member.can_manage_spvs) permissions.push("SPVs");
    if (member.can_manage_documents) permissions.push("Documents");
    if (member.can_manage_investors) permissions.push("Investors");
    if (member.can_view_reports) permissions.push("Reports");
    if (member.can_manage_transfers) permissions.push("Transfers");
    if (member.can_manage_team) permissions.push("Team");
    if (member.can_manage_settings) permissions.push("Settings");
    
    return permissions.length > 0 ? permissions.join(", ") : "No Permissions";
  };

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError("");

      try {
        const API_URL = getApiUrl();
        const accessToken = getAccessToken();
        
        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        // Build URL with pagination and search parameters
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('page_size', pageSize.toString());
        if (searchQuery && searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }
        
        const response = await axios.get(`${API_URL}/team-members/?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Team members fetched:", response.data);
        
        // Handle different response formats
        let membersData = [];
        let paginationInfo = null;
        
        if (response.data?.results && Array.isArray(response.data.results)) {
          // Paginated response (Django REST Framework style)
          membersData = response.data.results;
          paginationInfo = {
            count: response.data.count || membersData.length,
            totalPages: Math.ceil((response.data.count || membersData.length) / pageSize),
            next: response.data.next,
            previous: response.data.previous
          };
        } else if (Array.isArray(response.data)) {
          // Simple array response - client-side pagination
          membersData = response.data;
          paginationInfo = {
            count: membersData.length,
            totalPages: Math.ceil(membersData.length / pageSize),
            next: null,
            previous: null
          };
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          membersData = response.data.data;
          paginationInfo = {
            count: response.data.total || membersData.length,
            totalPages: Math.ceil((response.data.total || membersData.length) / pageSize),
            next: response.data.next_page || null,
            previous: response.data.previous_page || null
          };
        }

        // Apply client-side pagination if API doesn't support it
        if (Array.isArray(response.data) && !response.data?.results) {
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          membersData = response.data.slice(startIndex, endIndex);
        }

        setTeamMembers(membersData);
        
        if (paginationInfo) {
          setTotalCount(paginationInfo.count);
          setTotalPages(paginationInfo.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load team members";
        setError(errorMessage);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [currentPage, pageSize, searchQuery]);

  const handleAddMembers = () => {
    setShowAddModal(true);
    setModalError("");
    // Reset form
    setNewMemberForm({
      name: "",
      email: "",
      role: "analyst",
      can_access_dashboard: false,
      can_manage_spvs: false,
      can_manage_documents: false,
      can_manage_investors: false,
      can_view_reports: false,
      can_manage_transfers: false,
      can_manage_team: false,
      can_manage_settings: false
    });
  };

  const handleNewMemberInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMemberForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (modalError) setModalError("");
  };

  const handleAddMemberSubmit = async () => {
    // Validate form
    if (!newMemberForm.name.trim()) {
      setModalError("Name is required");
      return;
    }
    if (!newMemberForm.email.trim()) {
      setModalError("Email is required");
      return;
    }
    if (!newMemberForm.email.includes("@")) {
      setModalError("Please enter a valid email address");
      return;
    }

    setAddingMember(true);
    setModalError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const payload = {
        name: newMemberForm.name.trim(),
        email: newMemberForm.email.trim(),
        role: newMemberForm.role,
        can_access_dashboard: newMemberForm.can_access_dashboard,
        can_manage_spvs: newMemberForm.can_manage_spvs,
        can_manage_documents: newMemberForm.can_manage_documents,
        can_manage_investors: newMemberForm.can_manage_investors,
        can_view_reports: newMemberForm.can_view_reports,
        can_manage_transfers: newMemberForm.can_manage_transfers,
        can_manage_team: newMemberForm.can_manage_team,
        can_manage_settings: newMemberForm.can_manage_settings
      };

      console.log("Adding team member:", payload);

      const response = await axios.post(`${API_URL}/team-members/`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Team member added:", response.data);
      
      // Merge payload with response to ensure all fields are present
      const newMember = {
        ...payload,
        ...response.data,
        name: response.data.name || payload.name,
        email: response.data.email || payload.email
      };
      
      // Add new member to list immediately with merged data
      setTeamMembers(prev => [...prev, newMember]);
      
      // Refetch team members in background to get complete server data
      try {
        const membersResponse = await axios.get(`${API_URL}/team-members/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Handle different response formats
        let membersData = [];
        if (membersResponse.data?.results && Array.isArray(membersResponse.data.results)) {
          membersData = membersResponse.data.results;
        } else if (Array.isArray(membersResponse.data)) {
          membersData = membersResponse.data;
        } else if (membersResponse.data?.data && Array.isArray(membersResponse.data.data)) {
          membersData = membersResponse.data.data;
        }

        // Update with complete server data
        setTeamMembers(membersData);
      } catch (refreshErr) {
        console.error("Error refreshing team members:", refreshErr);
        // If refresh fails, keep the merged data we already added
      }
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewMemberForm({
        name: "",
        email: "",
        role: "analyst",
        can_access_dashboard: false,
        can_manage_spvs: false,
        can_manage_documents: false,
        can_manage_investors: false,
        can_view_reports: false,
        can_manage_transfers: false,
        can_manage_team: false,
        can_manage_settings: false
      });
    } catch (err) {
      console.error("Error adding team member:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add team member";
      setModalError(errorMessage);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    const id = String(memberId);
    setMemberChanges(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        role: newRole
      }
    }));
  };

  const handlePermissionsChange = (memberId, permissionKey, value) => {
    setMemberChanges(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [permissionKey]: value
      }
    }));
  };

  const handleSave = async () => {
    if (Object.keys(memberChanges).length === 0) return;

    setSaving(true);
    setError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      // Process each changed member
      const updatePromises = Object.entries(memberChanges).map(async ([memberId, changes]) => {
        try {
          // If role changed, use update_role endpoint
          if (changes.role && changes.role !== teamMembers.find(m => m.id.toString() === memberId)?.role) {
            await axios.patch(
              `${API_URL}/team-members/${memberId}/update_role/`,
              {
                role: changes.role,
                apply_role_permissions: false
              },
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );
          }

          // Update permissions separately if they changed
          const permissionKeys = [
            'can_access_dashboard', 'can_manage_spvs', 'can_manage_documents',
            'can_manage_investors', 'can_view_reports', 'can_manage_transfers',
            'can_manage_team', 'can_manage_settings', 'is_active'
          ];
          
          const permissionChanges = {};
          permissionKeys.forEach(key => {
            if (key in changes) {
              permissionChanges[key] = changes[key];
            }
          });

          if (Object.keys(permissionChanges).length > 0) {
            await axios.patch(
              `${API_URL}/team-members/${memberId}/update_permissions/`,
              permissionChanges,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );
          }

          // Also update general fields using main endpoint
          const generalUpdate = { ...changes };
          delete generalUpdate.role; // Role already updated via update_role endpoint
          permissionKeys.forEach(key => delete generalUpdate[key]); // Permissions already updated

          if (Object.keys(generalUpdate).length > 0) {
            await axios.patch(
              `${API_URL}/team-members/${memberId}/`,
              generalUpdate,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );
          }
        } catch (err) {
          console.error(`Error updating member ${memberId}:`, err);
          throw err;
        }
      });

      await Promise.all(updatePromises);

      // Refresh team members list
      const response = await axios.get(`${API_URL}/team-members/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      let membersData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        membersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        membersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        membersData = response.data.data;
      }

      setTeamMembers(membersData);
      setMemberChanges({}); // Clear changes after successful save
    } catch (err) {
      console.error("Error saving changes:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save changes";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
    setOpenDropdown(null);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setEditForm({
      role: member.role || "analyst",
      can_access_dashboard: member.can_access_dashboard || false,
      can_manage_spvs: member.can_manage_spvs || false,
      can_manage_documents: member.can_manage_documents || false,
      can_manage_investors: member.can_manage_investors || false,
      can_view_reports: member.can_view_reports || false,
      can_manage_transfers: member.can_manage_transfers || false,
      can_manage_team: member.can_manage_team || false,
      can_manage_settings: member.can_manage_settings || false,
      is_active: member.is_active !== undefined ? member.is_active : true
    });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSave = async () => {
    if (!editingMember) return;

    setSaving(true);
    setError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      const memberId = editingMember.id;

      // Update role if changed
      if (editForm.role !== editingMember.role) {
        await axios.patch(
          `${API_URL}/team-members/${memberId}/update_role/`,
          {
            role: editForm.role,
            apply_role_permissions: false
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }

      // Update permissions
      const permissionChanges = {};
      const permissionKeys = [
        'can_access_dashboard', 'can_manage_spvs', 'can_manage_documents',
        'can_manage_investors', 'can_view_reports', 'can_manage_transfers',
        'can_manage_team', 'can_manage_settings', 'is_active'
      ];

      permissionKeys.forEach(key => {
        if (editForm[key] !== editingMember[key]) {
          permissionChanges[key] = editForm[key];
        }
      });

      if (Object.keys(permissionChanges).length > 0) {
        await axios.patch(
          `${API_URL}/team-members/${memberId}/update_permissions/`,
          permissionChanges,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }

      // Refresh team members list
      const response = await axios.get(`${API_URL}/team-members/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      let membersData = [];
      if (response.data?.results && Array.isArray(response.data.results)) {
        membersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        membersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        membersData = response.data.data;
      }

      setTeamMembers(membersData);
      setShowEditModal(false);
      setEditingMember(null);
      setEditForm({});
    } catch (err) {
      console.error("Error updating member:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to update team member";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setDeleting(true);
    setError("");

    try {
      const API_URL = getApiUrl();
      const accessToken = getAccessToken();

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      await axios.delete(
        `${API_URL}/team-members/${memberToDelete.id}/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Remove from list
      setTeamMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (err) {
      console.error("Error deleting member:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to delete team member";
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Filter members based on search (client-side filtering for current page)
  const filteredMembers = teamMembers.filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.role?.toLowerCase().includes(query)
    );
  });
  
  // Calculate pagination for filtered results
  const filteredTotalPages = searchQuery ? Math.ceil(filteredMembers.length / pageSize) : totalPages;
  const effectiveTotalPages = Math.max(1, filteredTotalPages);
  
  // Calculate display counts for pagination info
  const displayStart = filteredMembers.length > 0 && currentPage <= effectiveTotalPages ? ((currentPage - 1) * pageSize + 1) : 0;
  const displayEnd = searchQuery 
    ? Math.min(currentPage * pageSize, filteredMembers.length)
    : Math.min(currentPage * pageSize, totalCount);
  const displayTotal = searchQuery ? filteredMembers.length : totalCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0">
        <ThreeUsersIcon />
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#001D21]">Team Management</h2>
        </div>
      </div>

      
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative w-full lg:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white font-poppins-custom placeholder:text-gray-400 text-gray-700"
          />
        </div>
        <button
          onClick={handleAddMembers}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium whitespace-nowrap cursor-pointer"
        >
          <PlusIcon />
          <span>Add New Members</span>
        </button>
      </div>

      {/* Error Message */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0C3] mb-4"></div>
            <p className="text-sm text-gray-600">Loading team members...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Team Members Table */}
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 text-gray-400 mb-4">
                <ThreeUsersIcon />
              </div>
              <p className="text-lg font-medium text-gray-600">No team members found</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchQuery ? "Try adjusting your search query" : "Add your first team member"}
              </p>
            </div>
          ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Team Member
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Manage Roles
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Permissions
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => {
                    const memberId = String(member.id);
                    const currentRole = memberChanges[memberId]?.role || member.role;
                    const currentPermissions = memberChanges[memberId] || member;
                    const permissionsSummary = getPermissionsSummary(currentPermissions);
                    
                    return (
                      <tr key={memberId} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                                {member.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 font-poppins-custom">
                                {member.name || "Unknown"}
                              </div>
                              {member.email && (
                                <div className="text-xs text-gray-500 font-poppins-custom">
                                  {member.email}
                      </div>
                              )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                          <select 
                            value={currentRole || ""}
                            onChange={(e) => handleRoleChange(memberId, e.target.value)}
                            className="text-sm border-0 rounded-md px-3 py-1 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 active:ring-0 font-poppins-custom bg-transparent cursor-pointer"
                          >
                            <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-poppins-custom max-w-xs truncate">
                            {permissionsSummary}
                          </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium relative">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleViewMember(member);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                      title="View Details"
                    >
                      <EyeIcon />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        ref={(el) => (buttonRefs.current[memberId] = el)}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          
                          if (String(openDropdown) === String(memberId)) {
                            setOpenDropdown(null);
                          } else {
                            // Calculate dropdown position (fixed positioning uses viewport coordinates)
                            const button = buttonRefs.current[memberId];
                            if (button) {
                              const rect = button.getBoundingClientRect();
                              setDropdownPosition({
                                top: rect.bottom + 8,
                                right: window.innerWidth - rect.right
                              });
                            }
                            setOpenDropdown(String(memberId));
                          }
                        }}
                        className="dropdown-button text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                        title="More Actions"
                      >
                      <DotsVerticalIcon />
                      </button>
                      
                      {String(openDropdown) === String(memberId) && (
                        <>
                          <div
                            className="fixed inset-0 z-[100]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                          ></div>
                          <div
                            className="dropdown-menu fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-[101]"
                            style={{
                              top: `${dropdownPosition.top}px`,
                              right: `${dropdownPosition.right}px`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div className="py-1 flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleEditMember(member);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                Edit Member
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDeleteMember(member);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Delete Member
                    </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>
          )}

      {/* Pagination + Save (right aligned, stacked) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className={`p-2 text-[#01373D] hover:text-gray-700 transition-colors ${
              currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, effectiveTotalPages) }, (_, i) => {
            let pageNum;
            if (effectiveTotalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= effectiveTotalPages - 2) {
              pageNum = effectiveTotalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg font-poppins-custom transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#00F0C3] text-black'
                    : 'text-[#01373D] hover:bg-gray-100'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {effectiveTotalPages > 5 && currentPage < effectiveTotalPages - 2 && (
            <>
              <span className="px-2 text-[#01373D]">...</span>
              <button
                onClick={() => setCurrentPage(effectiveTotalPages)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg font-poppins-custom transition-colors text-[#01373D] hover:bg-gray-100 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {effectiveTotalPages}
              </button>
            </>
          )}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(effectiveTotalPages, prev + 1))}
            disabled={currentPage === effectiveTotalPages || loading}
            className={`p-2 text-[#01373D] hover:text-gray-700 transition-colors ${
              currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          
          {/* Results count */}
          <span className="ml-2 text-sm text-gray-600 font-poppins-custom">
            Showing {displayStart} - {displayEnd} of {displayTotal}
            {searchQuery && ` (filtered)`}
          </span>
          </div>
        <button
          onClick={handleSave}
              disabled={Object.keys(memberChanges).length === 0 || saving}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium cursor-pointer ${
                Object.keys(memberChanges).length === 0 || saving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
              }`}
        >
          {saving ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
          <SaveIcon />
          <span>Save changes</span>
            </>
          )}
        </button>
          </div>
        </>
      )}

      {/* Add New Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins-custom">Add New Team Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91] hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{modalError}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMemberForm.name}
                    onChange={handleNewMemberInputChange}
                    placeholder="Enter team member name"
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newMemberForm.email}
                    onChange={handleNewMemberInputChange}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newMemberForm.role}
                    onChange={handleNewMemberInputChange}
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                  >
                    <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 font-poppins-custom">Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "can_access_dashboard", label: "Access Dashboard" },
                    { key: "can_manage_spvs", label: "Manage SPVs" },
                    { key: "can_manage_documents", label: "Manage Documents" },
                    { key: "can_manage_investors", label: "Manage Investors" },
                    { key: "can_view_reports", label: "View Reports" },
                    { key: "can_manage_transfers", label: "Manage Transfers" },
                    { key: "can_manage_team", label: "Manage Team" },
                    { key: "can_manage_settings", label: "Manage Settings" }
                  ].map((permission) => (
                    <div key={permission.key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={permission.key}
                        name={permission.key}
                        checked={newMemberForm[permission.key]}
                        onChange={handleNewMemberInputChange}
                        className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                      />
                      <label htmlFor={permission.key} className="ml-2 text-sm text-gray-700 font-poppins-custom">
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
      </div>
      </div>
 
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setModalError("");
                }}
                disabled={addingMember}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-poppins-custom font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMemberSubmit}
                disabled={addingMember}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium ${
                  addingMember
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
                }`}
              >
                {addingMember ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    <span>Add Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowViewModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {selectedMember.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Team Member Details</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedMember.name}</p>
                  </div>
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
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedMember.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedMember.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Role</p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#00F0C3] text-black">
                          {getRoleDisplayName(selectedMember.role)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedMember.is_active !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {selectedMember.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="bg-[#F9F8FF] rounded-lg p-4 border border-[#E2E2FB]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: "can_access_dashboard", label: "Access Dashboard" },
                        { key: "can_manage_spvs", label: "Manage SPVs" },
                        { key: "can_manage_documents", label: "Manage Documents" },
                        { key: "can_manage_investors", label: "Manage Investors" },
                        { key: "can_view_reports", label: "View Reports" },
                        { key: "can_manage_transfers", label: "Manage Transfers" },
                        { key: "can_manage_team", label: "Manage Team" },
                        { key: "can_manage_settings", label: "Manage Settings" }
                      ].map((permission) => (
                        <div key={permission.key} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${selectedMember[permission.key] ? "bg-green-500" : "bg-gray-300"}`}></div>
                          <span className={`text-sm ${selectedMember[permission.key] ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                            {permission.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditMember(selectedMember);
                  }}
                  className="px-4 py-2 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg font-medium transition-colors"
                >
                  Edit Member
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins-custom">Edit Team Member</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91] hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingMember.name || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-poppins-custom cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingMember.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-poppins-custom cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                    Role
                  </label>
                  <select
                    name="role"
                    value={editForm.role || ""}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
                  >
                    <option value="analyst">Analyst</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editForm.is_active || false}
                      onChange={handleEditInputChange}
                      className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 font-poppins-custom">Active Member</span>
                  </label>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 font-poppins-custom">Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "can_access_dashboard", label: "Access Dashboard" },
                    { key: "can_manage_spvs", label: "Manage SPVs" },
                    { key: "can_manage_documents", label: "Manage Documents" },
                    { key: "can_manage_investors", label: "Manage Investors" },
                    { key: "can_view_reports", label: "View Reports" },
                    { key: "can_manage_transfers", label: "Manage Transfers" },
                    { key: "can_manage_team", label: "Manage Team" },
                    { key: "can_manage_settings", label: "Manage Settings" }
                  ].map((permission) => (
                    <div key={permission.key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-${permission.key}`}
                        name={permission.key}
                        checked={editForm[permission.key] || false}
                        onChange={handleEditInputChange}
                        className="h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                      />
                      <label htmlFor={`edit-${permission.key}`} className="ml-2 text-sm text-gray-700 font-poppins-custom">
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMember(null);
                  setEditForm({});
                  setError("");
                }}
                disabled={saving}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-poppins-custom font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                disabled={saving}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium ${
                  saving
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
                }`}
              >
                {saving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => !deleting && setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-md shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 font-poppins-custom">Delete Team Member</h2>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
              {!deleting && (
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91] hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-gray-700 font-poppins-custom">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">{memberToDelete.name}</span>?
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{memberToDelete.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-900">{getRoleDisplayName(memberToDelete.role)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> This will permanently remove this team member and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setShowDeleteModal(false);
                    setMemberToDelete(null);
                    setError("");
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-poppins-custom font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className={`px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium ${
                  deleting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </span>
                ) : (
                  "Delete Member"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
