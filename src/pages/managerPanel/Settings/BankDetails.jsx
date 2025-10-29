import React, { useState } from "react";
import { BanknotesIcon, SaveIcon, PlusIcon } from "../../../components/Icons";

const BankDetails = () => {
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankName: "Chase Bank",
      accountNumber: "****1234",
      routingNumber: "021000021",
      accountType: "Business Checking",
      isPrimary: true
    }
  ]);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    isPrimary: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAccount = () => {
    if (formData.bankName && formData.accountNumber && formData.routingNumber) {
      const newAccount = {
        id: Date.now(),
        ...formData,
        accountNumber: `****${formData.accountNumber.slice(-4)}`
      };
      setBankAccounts([...bankAccounts, newAccount]);
      setFormData({
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountType: "",
        isPrimary: false
      });
    }
  };

  const handleSave = () => {
    console.log("Bank details saved:", bankAccounts);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <BanknotesIcon />
        <div>
          <h2 className="text-2xl font-bold text-[#01373D]">Bank Details</h2>
          <p className="text-gray-600 font-poppins-custom">Manage your bank account information for transactions and payments.</p>
        </div>
      </div>

      {/* Existing Bank Accounts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Current Bank Accounts</h3>
        <div className="space-y-4">
          {bankAccounts.map((account) => (
            <div key={account.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 font-poppins-custom">{account.bankName}</h4>
                    {account.isPrimary && (
                      <span className="px-2 py-1 bg-[#00F0C3] text-black text-xs font-medium rounded-full font-poppins-custom">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-poppins-custom">Account Number:</span>
                      <span className="ml-2 font-medium text-gray-900 font-poppins-custom">{account.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-poppins-custom">Routing Number:</span>
                      <span className="ml-2 font-medium text-gray-900 font-poppins-custom">{account.routingNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-poppins-custom">Account Type:</span>
                      <span className="ml-2 font-medium text-gray-900 font-poppins-custom">{account.accountType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Bank Account Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Add New Bank Account</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Routing Number</label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleInputChange}
                placeholder="Enter routing number"
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] bg-[#F4F6F5] font-poppins-custom"
              >
                <option value="">Select account type</option>
                <option value="checking">Business Checking</option>
                <option value="savings">Business Savings</option>
                <option value="money-market">Money Market</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-6">
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#00F0C3] border-gray-300 rounded focus:ring-[#00F0C3]"
            />
            <label className="text-sm text-gray-700 font-poppins-custom">Set as primary account</label>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddAccount}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
            >
              <PlusIcon />
              <span>Add Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
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

export default BankDetails;
