import React, { useState } from "react";
import { UsersIcon, SearchIcon, PlusIcon, SaveIcon, EyeIcon, DotsVerticalIcon } from "../../../components/Icons";

const TeamManagement = () => {
  const [teamMembers] = useState([
    { id: 1, name: "Mason Harper", role: "Manager", permissions: "Access Dashboard" },
    { id: 2, name: "Carter Jack", role: "Select Roles", permissions: "Select Permissions" },
    { id: 3, name: "Grayson Mason", role: "Select Roles", permissions: "Select Permissions" },
    { id: 4, name: "Lizza Reon", role: "Select Roles", permissions: "Select Permissions" },
    { id: 5, name: "Avery Jackoz", role: "Select Roles", permissions: "Select Permissions" },
    { id: 6, name: "Mason Harper", role: "Select Roles", permissions: "Select Permissions" }
  ]);

  const handleSave = () => {
    console.log("Team management changes saved");
  };

  const handleAddMembers = () => {
    console.log("Add new members clicked");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <UsersIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Team Management</h2>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white font-poppins-custom placeholder:text-gray-400 text-gray-700"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleAddMembers}
          className="flex items-center space-x-2 px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <PlusIcon />
          <span>Add New Members</span>
        </button>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Team Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Manage Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 font-poppins-custom">
                        {member.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#00F0C3] font-poppins-custom">
                    <option>{member.role}</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#00F0C3] font-poppins-custom">
                    <option>{member.permissions}</option>
                    <option value="full-access">Full Access</option>
                    <option value="dashboard-only">Dashboard Only</option>
                    <option value="read-only">Read Only</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <DotsVerticalIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1 bg-[#00F0C3] text-black rounded font-poppins-custom">1</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-800 font-poppins-custom">2</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-800 font-poppins-custom">3</button>
          <button className="px-3 py-1 text-gray-600 hover:text-gray-800 font-poppins-custom">4</button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
        >
          <SaveIcon />
          <span>Save changes</span>
        </button>
      </div>
    </div>
  );
};

export default TeamManagement;
