import React, { useState } from "react";

const InviteLPsModal = ({ isOpen, onClose }) => {
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
    console.log('Form submitted:', formData);
    // Handle form submission here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#01373DB2] bg-opacity-50 flex items-center justify-center z-50 p-4 font-poppins-custom">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 font-poppins-custom">Email Invite</h2>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins-custom">Invite Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  LP Emails
                </label>
                <input
                  type="email"
                  name="emails"
                  value={formData.emails}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  Email Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                />
              </div>
            </div>
          </div>

          {/* LP Defaults Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins-custom">LP Defaults</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  Lead Carry %
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="leadCarry"
                    value={formData.leadCarry}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  Investment And Fund Valuations
                </label>
                <select
                  name="investmentVisibility"
                  value={formData.investmentVisibility}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                >
                  <option value="Hidden">Hidden</option>
                  <option value="Visible">Visible</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              
               <div className="bg-[#E2E2FB] rounded-lg p-4">
                 <div className="flex items-start space-x-3">
                   <input
                     type="checkbox"
                     name="anyRaisingSPV"
                     checked={formData.anyRaisingSPV}
                     onChange={handleInputChange}
                     className="mt-1 h-4 w-4 text-[#00F0C3] focus:ring-[#00F0C3] border-gray-300 rounded"
                   />
                   <div>
                     <label className="text-sm font-medium text-gray-700 font-poppins-custom">
                       Any Raising SPV
                     </label>
                     <p className="text-xs text-gray-500 mt-1 font-poppins-custom">
                       Automatic Invites to All Currents SPV
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Invite To Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-poppins-custom">Invite To</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  Private Note
                </label>
                <input
                  type="text"
                  name="privateNote"
                  value={formData.privateNote}
                  onChange={handleInputChange}
                  placeholder="Private Note"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent font-poppins-custom"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-start space-x-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-6 py-2 rounded-lg font-medium transition-colors font-poppins-custom"
            >
              Invite team member 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteLPsModal;
