import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {  SubmitsIcon } from "../../../components/Icons";

const RequestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const request = location.state?.request || null;

  const [formData, setFormData] = useState({
    requestType: "",
    priority: "Medium",
    requestTitle: "",
    relatedEntity: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] px-4 py-6 sm:px-6 lg:px-0 lg:mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              <span className="text-gray-900">New</span> <span className="text-[#9889FF]">Request</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-600">Submit a new request for approval</p>
          </div>
         
        </div>
      </div>

      {/* Request Details Form - Centered */}
      <div className="flex items-center justify-center">
        <div className="bg-white !rounded-[12px] p-4 sm:p-8 shadow-sm w-full max-w-4xl">
        <div className="mb-6 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Request Details</h2>
          <p className="text-sm text-gray-600 font-poppins-custom">Provide detailed information about your request</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Request Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] appearance-none font-poppins-custom"
                required
              >
                <option value="">Select request type</option>
                <option value="update-spv">Update SPV Investment Terms</option>
                <option value="update-contact">Update Contact Information</option>
                <option value="create-spv">Create New SPV</option>
                <option value="transfer-ownership">Transfer Ownership</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] appearance-none font-poppins-custom"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Request Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="requestTitle"
              value={formData.requestTitle}
              onChange={handleInputChange}
              placeholder="Brief summary of your request"
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              required
            />
          </div>

          {/* Related Entity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Related Entity (Optional)
            </label>
            <input
              type="text"
              name="relatedEntity"
              value={formData.relatedEntity}
              onChange={handleInputChange}
              placeholder="e.g., SPV-001, User ID, etc."
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide detailed information about your request....."
              className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] resize-none font-poppins-custom"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-[#01373D] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-poppins-custom"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-black bg-[#00F0C3] rounded-lg hover:bg-[#00D4A8] transition-colors cursor-pointer font-poppins-custom"
            >
              <SubmitsIcon />
              <span>Submit</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
