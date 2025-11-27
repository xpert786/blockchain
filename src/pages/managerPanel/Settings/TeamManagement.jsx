import React, { useState, useEffect } from "react";
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

        const response = await axios.get(`${API_URL}/team-members/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Team members fetched:", response.data);
        
        // Handle different response formats
        let membersData = [];
        if (response.data?.results && Array.isArray(response.data.results)) {
          membersData = response.data.results;
        } else if (Array.isArray(response.data)) {
          membersData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          membersData = response.data.data;
        }

        setTeamMembers(membersData);
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
  }, []);

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
      
      // Add new member to list
      const newMember = response.data;
      setTeamMembers(prev => [...prev, newMember]);
      
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
    setMemberChanges(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
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

  const handleSave = () => {
    console.log("Team management changes saved");
    // TODO: Implement PATCH for each changed member
    console.log("Changes to save:", memberChanges);
  };

  // Filter members based on search
  const filteredMembers = teamMembers.filter(member => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.role?.toLowerCase().includes(query)
    );
  });

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
                    const memberId = member.id;
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
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                      <EyeIcon />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                      <DotsVerticalIcon />
                    </button>
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
          <button className="p-2 text-[#01373D] hover:text-gray-700 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-[#01373D] font-poppins-custom cursor-pointer">1</button>
          <button className="px-3 py-1 text-[#01373D] hover:text-black font-poppins-custom cursor-pointer">2</button>
          <button className="px-3 py-1 text-[#01373D] hover:text-black font-poppins-custom cursor-pointer">3</button>
          <button className="px-3 py-1 text-[#01373D] hover:text-black font-poppins-custom cursor-pointer">4</button>
          <button className="p-2 text-[#01373D] hover:text-gray-700 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        <button
          onClick={handleSave}
              disabled={Object.keys(memberChanges).length === 0}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors font-poppins-custom font-medium cursor-pointer ${
                Object.keys(memberChanges).length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#00F0C3] text-black hover:bg-[#00D4A8]"
              }`}
        >
          <SaveIcon />
          <span>Save changes</span>
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
    </div>
  );
};

export default TeamManagement;
