import React, { useState } from "react";
import { BanknotesIcon, PluIcon,ICIcon, ClosIcon,BankIcon } from "../../../components/Icons";

const BankDetails = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);

  const [cardForm, setCardForm] = useState({
    mode: "debit",
    cardType: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    holder: "",
  });

  // Edit card modal state
  const [showEditCard, setShowEditCard] = useState(false);
  const [editForm, setEditForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    holder: "",
  });

  // Bank details modal state
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  // Add bank form state
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountType: "",
    accountName: "",
    bankCountry: "",
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm((p) => ({ ...p, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm((p) => ({ ...p, [name]: value }));
  };

  const openEditCard = (prefill) => {
    setEditForm(prefill);
    setShowEditCard(true);
  };

  const handleAddCardSubmit = () => {
    // Persist card if needed; for now just close
    setShowAddCard(false);
  };

  const handleUpdateCardSubmit = () => {
    setShowEditCard(false);
  };
  const handleEditClick = (card) => {
    setEditCardData(card);
    setShowEditCard(true);
  };

  const handleAddBankSubmit = () => {
    // Persist bank if needed; for now just close and reset
    setShowAddBank(false);
    setBankForm({ bankName: "", accountType: "", accountName: "", bankCountry: "" });
  };

  const openBankDetails = (bank) => {
    setSelectedBank(bank);
    setShowBankDetails(true);
  };

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header - White Card */}
      <div className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full">
        <div className="flex items-center justify-center sm:justify-start">
          <BankIcon />
        </div>
        <div>
          <h4 className="text-base sm:text-[18px] text-[#001D21]">Bank Details</h4>
          <p className="text-sm text-[#748A91] font-poppins-custom">Manage cards and bank accounts used for transactions and payouts.</p>
        </div>
      </div>

      {/* Credit/Debit Cards - White Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-8 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg  text-[#001D21]">Credit Or Debit Cards</h3>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Card 1 */}
          <div className="group relative overflow-hidden flex-1 min-w-0 rounded-xl p-4 bg-[#00F0C3] text-white flex flex-col justify-between min-h-[140px] transition">
            <div className="text-xs opacity-90">XXXX-XXXX-XXXX-4155</div>
            <div className="flex items-center justify-between mt-6 text-xs">
              <div>
                <div className="uppercase tracking-wide opacity-80">VALID DATE</div>
                <div className="mt-1">07/24</div>
              </div>
              <span className="bg-white/80 text-[#2F595C] px-3 py-1 rounded-full text-[11px]">Primary</span>
            </div>
            <div className="flex items-center justify-between mt-6 text-xs">
              <span className="opacity-90">SMITH RHODES</span>
              <span className="bg-white/90 px-2 py-1 rounded text-[#2F595C]">VISA</span>
            </div>
            {/* Hover overlay actions */}
            <div className="pointer-events-none absolute inset-0 bg-[#01373D]/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-8 text-white text-base">
              <button onClick={() => openEditCard({ cardNumber: "XXXX-XXXX-XXXX-4155", expiry: "07/24", cvv: "", holder: "SMITH RHODES" })} className="flex items-center gap-2 pointer-events-auto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                Edit
              </button>
              <div className="flex items-center gap-2 pointer-events-auto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="group relative overflow-hidden flex-1 min-w-0 rounded-xl p-4 bg-[#7E7E7C] text-white   flex flex-col justify-between min-h-[140px] transition">
            <div className="text-xs opacity-90">XXXX-XXXX-XXXX-6296</div>
            <div className="mt-6 text-[10px]">
              <div className="uppercase tracking-wide opacity-80">VALID DATE</div>
              <div className="mt-1">07/23</div>
            </div>
            <div className="flex items-center justify-between mt-6 text-xs">
              <span className="opacity-90">SMITH RHODES</span>
              <span className="bg-white/90 px-2 py-1 rounded text-[#2F595C]">Mastercard</span>
            </div>
            {/* Hover overlay actions */}
            <div className="pointer-events-none absolute inset-0 bg-[#01373D]/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-8 text-white text-base">
              <button onClick={() => openEditCard({ cardNumber: "XXXX-XXXX-XXXX-6296", expiry: "07/23", cvv: "", holder: "SMITH RHODES" })} className="flex items-center gap-2 pointer-events-auto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                Edit
              </button>
              <div className="flex items-center gap-2 pointer-events-auto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </div>
            </div>
          </div>
          {/* Add New Card */}
          <div onClick={() => setShowAddCard(true)} className="flex-1 min-w-0 rounded-xl p-4 bg-[#E8EAED] text-[#2F595C] !border-2 border-[#E2E2FB] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EBFCF6] min-h-[140px] transition">
            <span className="text-2xl mb-2 text-[#00A38A]"><PluIcon /></span>
            <span className="font-medium">Add New Card</span>
          </div>
        </div>
      </div>

      {/* Bank Accounts - White Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-8 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg  text-[#001D21]">Bank Accounts</h3>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Bank Account 1 */}
          <div className="group relative overflow-hidden flex-1 min-w-0 rounded-xl p-4  text-white flex flex-col justify-between min-h-[120px] bg-[#00F0C3] transition">
            {/* Bank name row with icon */}
            <div className="text-sm font-semibold flex items-center gap-2">
              <ICIcon /> HDFC Bank
            </div>
            {/* Account number row with arrow */}
            <div className="text-xs mt-1 opacity-90 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10c0-3.314 2.686-6 6-6h2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M13 4l3 2-3 2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              xxxx-xxxx-xxxx-4025
            </div>
            {/* Badges row */}
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="bg-white/20 rounded px-3 py-1">Primary</span>
              <span className="flex items-center gap-2">
                Approved
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.8" fill="none"/>
                  <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {/* Hover overlay actions */}
            <div className="pointer-events-none absolute inset-0 bg-[#01373D]/60  opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white text-base">
              <button onClick={() => openBankDetails({
                accountType: "Personal",
                accountName: "Smith Rhodes",
                accountNumber: "XXXX-XXXX-XXXX-4025",
                bankCountry: "U.S.A",
                status: "Approved"
              })} className="flex items-center gap-2 pointer-events-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                More Details
              </button>
              <div className="flex items-center gap-2 pointer-events-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </div>
            </div>
          </div>
          {/* Bank Account 2 */}
          <div className="group relative overflow-hidden flex-1 min-w-0 rounded-xl p-4  text-white flex flex-col justify-between min-h-[120px] bg-[#00F0C3] transition">
            {/* Bank name row with icon */}
            <div className="text-sm font-semibold flex items-center gap-2"><ICIcon /> ICICI Bank</div>
            {/* Account number row with arrow */}
            <div className="text-xs mt-1 opacity-90 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10c0-3.314 2.686-6 6-6h2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M13 4l3 2-3 2" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              xxxx-xxxx-xxxx-9025
            </div>
            {/* Badges row */}
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="bg-white/20 rounded px-3 py-1">Primary</span>
              <span className="flex items-center gap-2">
                Approved
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.8" fill="none"/>
                  <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {/* Hover overlay actions */}
            <div className="pointer-events-none absolute inset-0 bg-[#01373D]/60  opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white text-base">
              <button onClick={() => openBankDetails({
                accountType: "Personal",
                accountName: "Smith Rhodes",
                accountNumber: "XXXX-XXXX-XXXX-9025",
                bankCountry: "U.S.A",
                status: "Approved"
              })} className="flex items-center gap-2 pointer-events-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
                More Details
              </button>
              <div className="flex items-center gap-2 pointer-events-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M3 6h18"/><path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                Delete
              </div>
            </div>
          </div>
          {/* Add Bank Account */}
          <div onClick={() => setShowAddBank(true)} className="flex-1 min-w-0 rounded-xl p-4 bg-[#E8EAED] text-[#2F595C] border-2 border-[#E2E2FB] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EBFCF6] min-h-[100px] transition">
            <span className="text-2xl mb-2 text-[#00A38A]"><PluIcon /></span>
            <span className="font-medium">Add Bank Account</span>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowAddCard(false)} />
          <div className="relative bg-white rounded-xl  w-full max-w-xl mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[16px] font-medium text-[#001D21]">Add New Card</div>
              <button onClick={() => setShowAddCard(false)} className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91]"><ClosIcon /></button>
            </div>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setCardForm((p)=>({...p, mode:'debit'}))} className={`px-4 py-1 rounded ${cardForm.mode==='debit' ? 'bg-[#00F0C3] text-black' : 'bg-[#F4F6F5] text-[#2F595C] border border-[#E2E2FB]'}`}>Debit</button>
              <button onClick={() => setCardForm((p)=>({...p, mode:'credit'}))} className={`px-4 py-1 rounded ${cardForm.mode==='credit' ? 'bg-[#00F0C3] text-black' : 'bg-[#F4F6F5] text-[#2F595C] border border-[#E2E2FB]'}`}>Credit</button>
            </div>
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Card Type</label>
                <input name="cardType" value={cardForm.cardType} onChange={handleCardChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="Card Type" />
              </div>
              <div>
                <label className="block text-sm mb-1">Card Number</label>
                <input name="cardNumber" value={cardForm.cardNumber} onChange={handleCardChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="Card Number" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Expiry Date</label>
                  <input name="expiry" value={cardForm.expiry} onChange={handleCardChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">CVV</label>
                  <input name="cvv" value={cardForm.cvv} onChange={handleCardChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="CVV (3 digits)" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Card Holder Name</label>
                <input name="holder" value={cardForm.holder} onChange={handleCardChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="Card Holder Name" />
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
              <button onClick={() => setShowAddCard(false)} className="px-4 py-2 bg-[#F7F7F8] text-[#2F595C] rounded-lg border border-[#01373D]">Cancel</button>
              <button onClick={handleAddCardSubmit} className="px-4 py-2 bg-[#00F0C3] textblack rounded-lg">Add card</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {showEditCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowEditCard(false)} />
          <div className="relative bg-white rounded-xl  w-full max-w-xl mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[16px] font-medium text-[#001D21] flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#01373D" strokeWidth="1.5" fill="none"/>
                  <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" stroke="#01373D" strokeWidth="1.5" fill="none"/>
                </svg>
                Edit Card
              </div>
              <button onClick={() => setShowEditCard(false)} className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91]"><ClosIcon /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Card Number</label>
                <input name="cardNumber" value={editForm.cardNumber} onChange={handleEditChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="XXXX-XXXX-XXXX-0000" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Expiry Date</label>
                  <input name="expiry" value={editForm.expiry} onChange={handleEditChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">CVV</label>
                  <input name="cvv" value={editForm.cvv} onChange={handleEditChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="CVV (3 digits)" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Card Holder Name</label>
                <input name="holder" value={editForm.holder} onChange={handleEditChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="Card Holder Name" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
              <button onClick={() => setShowEditCard(false)} className="px-4 py-2 bg-[#F7F7F8] text-[#2F595C] rounded-lg border border-[#01373D]">Cancel</button>
              <button onClick={handleUpdateCardSubmit} className="px-4 py-2 bg-[#00F0C3] text-black rounded-lg">Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Details Modal */}
      {showBankDetails && selectedBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowBankDetails(false)} />
          <div className="relative bg-white rounded-xl  w-full max-w-xl mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[16px] font-medium text-[#001D21]">Bank Account Details</div>
              <button onClick={() => setShowBankDetails(false)} className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91]"><ClosIcon /></button>
            </div>
            <div className="space-y-4 text-sm text-[#001D21]">
              <div>
                <div className="text-[#748A91]">Account Type:</div>
                <div className="mt-0.5">{selectedBank.accountType}</div>
              </div>
              <div>
                <div className="text-[#748A91]">Account Name:</div>
                <div className="mt-0.5">{selectedBank.accountName}</div>
              </div>
              <div>
                <div className="text-[#748A91]">Account Number:</div>
                <div className="mt-0.5">{selectedBank.accountNumber}</div>
              </div>
              <div>
                <div className="text-[#748A91]">Bank Country:</div>
                <div className="mt-0.5">{selectedBank.bankCountry}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[#748A91]">Status</div>
                <div className="mt-0.5 flex items-center gap-2">
                  {selectedBank.status}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="7" stroke="#00A38A" strokeWidth="1.8" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="#00A38A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
              <button onClick={() => setShowBankDetails(false)} className="px-4 py-2 bg-[#F7F7F8] text-[#2F595C] rounded-lg border border-[#01373D]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#01373DB2]/80" onClick={() => setShowAddBank(false)} />
          <div className="relative bg-white rounded-xl  w-full max-w-xl mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[16px] font-medium text-[#001D21]">Add New Bank</div>
              <button onClick={() => setShowAddBank(false)} className="w-7 h-7 rounded-full flex items-center justify-center border border-[#E2E2FB] text-[#748A91]"><ClosIcon /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Bank Name</label>
                <select name="bankName" value={bankForm.bankName} onChange={handleBankChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 bg-[#F4F6F5] text-[#748A91] font-poppins-custom outline-none">
                  <option value="">Bank Name</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="SBI">SBI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Account Type</label>
                <select name="accountType" value={bankForm.accountType} onChange={handleBankChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 bg-[#F4F6F5] text-[#748A91] font-poppins-custom outline-none">
                  <option value="">Account Type</option>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Account Name</label>
                <input name="accountName" value={bankForm.accountName} onChange={handleBankChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 outline-none bg-[#F4F6F5] text-[#748A91] font-poppins-custom" placeholder="Account Name" />
              </div>
              <div>
                <label className="block text-sm mb-1">Bank Country</label>
                <select name="bankCountry" value={bankForm.bankCountry} onChange={handleBankChange} className="w-full !border-[0.5px] border-[#0A2A2E] rounded-lg p-2 bg-[#F4F6F5] text-[#748A91] font-poppins-custom outline-none">
                  <option value="">Bank Country</option>
                  <option value="U.S.A">U.S.A</option>
                  <option value="India">India</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6">
              <button onClick={() => setShowAddBank(false)} className="px-4 py-2 bg-[#F7F7F8] text-[#2F595C] rounded-lg border border-[#01373D]">Cancel</button>
              <button onClick={handleAddBankSubmit} className="px-4 py-2 bg-[#00F0C3] text-black rounded-lg">Add bank</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDetails;
