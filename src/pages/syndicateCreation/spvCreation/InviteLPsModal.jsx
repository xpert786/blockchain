import React, { useState } from "react";

const InviteLPsModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    emails: "",
    message: "",
    leadCarry: "",
    investmentVisibility: "Hidden",
    anyRaisingSPV: false,
    privateNote: "",
    tags: ""
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Invite LPs form submitted:", formData);
    // Call the onSubmit handler passed from parent
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Fallback if no onSubmit handler
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Email Invite</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invite Details Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LP Emails
                </label>
                <textarea
                  name="emails"
                  value={formData.emails}
                  onChange={handleInputChange}
                  placeholder="Email address (separate multiple emails with commas or new lines)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter multiple email addresses separated by commas or new lines
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5]"
                />
              </div>
            </div>
          </div>

          {/* LP Defaults Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">LP Defaults</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Carry %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="leadCarry"
                    value={formData.leadCarry}
                    onChange={handleInputChange}
                    placeholder="%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment And Fund Valuations
                </label>
                <div className="relative">
                  <select
                    name="investmentVisibility"
                    value={formData.investmentVisibility}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5] appearance-none"
                  >
                    <option value="Hidden">Hidden</option>
                    <option value="Visible">Visible</option>
                    <option value="Limited">Limited</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="anyRaisingSPV"
                  checked={formData.anyRaisingSPV}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Any Raising SPV
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatic invites to All Currents SPV
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invite To Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invite To</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private Note
                </label>
                <input
                  type="text"
                  name="privateNote"
                  value={formData.privateNote}
                  onChange={handleInputChange}
                  placeholder="Private Note"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Tags (separate multiple tags with commas)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter multiple tags separated by commas (e.g., top_lp, priority)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-start space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inviting...
                </>
              ) : (
                "Invite team member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteLPsModal;



