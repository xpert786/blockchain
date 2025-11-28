import React, { useState, useEffect } from "react";

// --- Inline Icons ---
const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 1 1-4 0v11M19 21v-8a2 2 0 0 0-4 0v8" />
  </svg>
);

const PluIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ICIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="16" y1="21" x2="16" y2="11"></line>
    <line x1="12" y1="21" x2="12" y2="11"></line>
    <line x1="8" y1="21" x2="8" y2="11"></line>
    <line x1="2" y1="11" x2="22" y2="11"></line>
    <path d="M12 2L2 7h20L12 2z"></path>
  </svg>
);

const ClosIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// --- Reusable UI Components ---

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#001D21]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-xl p-6 space-y-4 shadow-xl animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[18px] font-semibold text-[#001D21] flex items-center gap-2">{title}</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
            <ClosIcon />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-6 pt-2 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, readOnly = false, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent transition-shadow ${readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#00F0C3] bg-white transition-shadow"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// --- Main Component ---

const BankDetails = () => {
  // --- Constants ---
  const API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/bank-details/";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzIyMjg0LCJpYXQiOjE3NjQzMDQyODQsImp0aSI6IjkyMDRhMGY3ODhjNDRlMDQ5MWE4NjkzZWY3NzlmYTljIiwidXNlcl9pZCI6IjIifQ.6h81mnprtOjPpn2-_mkasbrXSwKwbr7wHkhEC-j6_ag";

  // --- State ---
  const [cards, setCards] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Modals state
  const [modals, setModals] = useState({
    addCard: false,
    editCard: false,
    addBank: false,
    editBank: false,
    bankDetails: false,
    deleteConfirm: false,
  });

  const [currentEditId, setCurrentEditId] = useState(null);
  const [deleteData, setDeleteData] = useState({ type: null, id: null });
  const [selectedBank, setSelectedBank] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // Forms
  const [cardForm, setCardForm] = useState({ mode: "debit", cardType: "", cardNumber: "", expiry: "", cvv: "", holder: "" });
  const [editCardForm, setEditCardForm] = useState({ cardNumber: "", expiry: "", cvv: "", holder: "" });
  const [bankForm, setBankForm] = useState({ bankName: "", accountType: "", accountName: "", bankCountry: "", accountNumber: "", routingNumber: "" });

  // --- Helpers ---
  const toggleModal = (modalName, isOpen) => setModals((prev) => ({ ...prev, [modalName]: isOpen }));
  
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const capitalizeFirst = (str) => (!str ? "" : str.charAt(0).toUpperCase() + str.slice(1));

  // --- API Helper ---
  const apiCall = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
    const config = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    if (body) config.body = JSON.stringify(body);

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json().catch(() => ({}));
      return { ok: response.ok, data, status: response.status };
    } catch (err) {
      console.error("API Error:", err);
      return { ok: false, error: err };
    }
  };

  // --- Fetch Data ---
  const fetchDetails = async () => {
    setIsLoadingData(true);
    const { ok, data } = await apiCall(API_URL);
    if (ok && data.data) {
      setCards(data.data.credit_cards || []);
      setBankAccounts(data.data.bank_accounts || []);
    } else {
      console.error("Failed to fetch bank details");
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // --- Handlers ---

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (url, method, payload, modalToClose, successMsg, resetFormSetter, resetData) => {
    setIsSubmitting(true);
    setError(null);
    
    const { ok, data } = await apiCall(url, method, payload);
    
    if (ok) {
      showNotification(successMsg);
      toggleModal(modalToClose, false);
      if (resetFormSetter && resetData) resetFormSetter(resetData);
      fetchDetails();
    } else {
      setError(data.message || data.detail || "Operation failed.");
      showNotification("Operation failed", "error");
    }
    setIsSubmitting(false);
  };

  // -- Card Handlers --
  const onAddCard = () => {
    const payload = {
      type: cardForm.mode === "credit" ? "credit_card" : "debit_card",
      card_type: cardForm.cardType,
      card_number: cardForm.cardNumber,
      card_holder_name: cardForm.holder,
      expiry_date: cardForm.expiry,
      cvv: cardForm.cvv,
      status: "active",
      is_primary: false,
    };
    handleSave(API_URL, 'POST', payload, 'addCard', "Card added successfully!", setCardForm, { mode: "debit", cardType: "", cardNumber: "", expiry: "", cvv: "", holder: "" });
  };

  const onUpdateCard = () => {
    const payload = {
      card_number: editCardForm.cardNumber,
      expiry_date: editCardForm.expiry,
      card_holder_name: editCardForm.holder,
      cvv: editCardForm.cvv,
    };
    handleSave(`${API_URL}card/${currentEditId}/`, 'PATCH', payload, 'editCard', "Card updated successfully!", null, null);
  };

  const openEditCardModal = async (card) => {
    setCurrentEditId(card.id);
    // Optimistic UI
    setEditCardForm({ cardNumber: card.card_number, expiry: card.expiry_date, cvv: "***", holder: card.card_holder_name });
    toggleModal('editCard', true);
    
    // Fetch fresh details
    const { ok, data } = await apiCall(`${API_URL}card/${card.id}/`);
    if (ok && data.data) {
      setEditCardForm({
        cardNumber: data.data.card_number,
        expiry: data.data.expiry_date,
        cvv: data.data.cvv,
        holder: data.data.card_holder_name,
      });
    }
  };

  // -- Bank Handlers --
  const onAddBank = () => {
    const payload = {
      type: "bank_account",
      bank_name: bankForm.bankName,
      account_type: bankForm.accountType.toLowerCase(),
      account_number: bankForm.accountNumber,
      routing_number: bankForm.routingNumber,
      account_holder_name: bankForm.accountName,
      status: "active",
      is_primary: false,
    };
    handleSave(API_URL, 'POST', payload, 'addBank', "Bank account added successfully!", setBankForm, { bankName: "", accountType: "", accountName: "", bankCountry: "", accountNumber: "", routingNumber: "" });
  };

  const onUpdateBank = () => {
    const payload = {
      bank_name: bankForm.bankName,
      account_type: bankForm.accountType.toLowerCase(),
      account_number: bankForm.accountNumber,
      routing_number: bankForm.routingNumber,
      account_holder_name: bankForm.accountName,
    };
    handleSave(`${API_URL}account/${currentEditId}/`, 'PATCH', payload, 'editBank', "Bank account updated successfully!", null, null);
  };

  const openEditBankModal = async (bank) => {
    setCurrentEditId(bank.id);
    setBankForm({
      bankName: bank.bank_name,
      accountType: capitalizeFirst(bank.account_type),
      accountName: bank.account_holder_name,
      bankCountry: "U.S.A",
      accountNumber: bank.account_number,
      routingNumber: bank.routing_number || "",
    });
    toggleModal('editBank', true);

    const { ok, data } = await apiCall(`${API_URL}account/${bank.id}/`);
    if (ok && data.data) {
      setBankForm({
        bankName: data.data.bank_name,
        accountType: capitalizeFirst(data.data.account_type),
        accountName: data.data.account_holder_name,
        bankCountry: "U.S.A",
        accountNumber: data.data.account_number,
        routingNumber: data.data.routing_number || "",
      });
    }
  };

  const openBankDetailsModal = async (bank) => {
    setSelectedBank(bank);
    toggleModal('bankDetails', true);
    const { ok, data } = await apiCall(`${API_URL}account/${bank.id}/`);
    if (ok && data.data) setSelectedBank(data.data);
  };

  // -- Delete Handlers --
  const initiateDelete = (type, id) => {
    setDeleteData({ type, id });
    toggleModal('deleteConfirm', true);
  };

  const onConfirmDelete = async () => {
    const { type, id } = deleteData;
    const endpoint = type === 'card' ? `${API_URL}card/${id}/` : `${API_URL}account/${id}/`;
    const payload = { status: type === 'card' ? "suspended" : "inactive", is_primary: false };
    
    // We reuse handleSave logic partially but simpler here
    setIsSubmitting(true);
    const { ok } = await apiCall(endpoint, 'DELETE', payload);
    
    if (ok) {
      showNotification(`${type === 'card' ? 'Card' : 'Account'} deleted successfully!`);
      fetchDetails();
    } else {
      showNotification("Failed to delete.", "error");
    }
    setIsSubmitting(false);
    toggleModal('deleteConfirm', false);
  };

  // --- Render ---
  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans relative">
      
      {/* Notifications */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in ${notification.type === 'error' ? 'bg-white border-l-4 border-red-500 text-red-600' : 'bg-[#001D21] text-[#00F0C3]'}`}>
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-4 sm:space-y-0 w-full shadow-sm border border-gray-100">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="p-2 bg-[#F4F6F5] rounded-full"><BankIcon /></div>
        </div>
        <div>
          <h4 className="text-base sm:text-[18px] text-[#001D21] font-semibold">Bank Details</h4>
          <p className="text-sm text-[#748A91] mt-1">Manage cards and bank accounts used for transactions and payouts.</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-white rounded-xl p-6 mb-8 w-full space-y-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-[#001D21]">Credit Or Debit Cards</h3>
        {isLoadingData ? (
          <div className="flex items-center justify-center h-[160px] text-gray-400">Loading cards...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div key={card.id || idx} className={`group relative overflow-hidden rounded-xl p-4 flex flex-col justify-between min-h-[160px] shadow-sm transition-all ${idx % 2 === 0 ? 'bg-[#00F0C3] text-black' : 'bg-[#2F3136] text-white'}`}>
                <div className="text-xs opacity-90 font-medium font-mono">XXXX-XXXX-XXXX-{card.card_number ? card.card_number.slice(-4) : 'XXXX'}</div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <div>
                    <div className="uppercase tracking-wide opacity-80 text-[10px] font-bold">VALID DATE</div>
                    <div className="mt-1 font-medium">{card.expiry_date}</div>
                  </div>
                  {card.is_primary && <span className="bg-white/90 text-[#001D21] px-2 py-0.5 rounded text-[10px] font-bold">Primary</span>}
                </div>
                <div className="flex items-center justify-between mt-6 text-xs">
                  <span className="opacity-90 font-bold tracking-wide uppercase">{card.card_holder_name}</span>
                  <span className="bg-white/90 px-2 py-1 rounded text-[#001D21] font-bold capitalize">{card.card_type_display || card.card_type}</span>
                </div>
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-[#001D21]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
                  <button onClick={() => openEditCardModal(card)} className="flex items-center gap-2 text-white hover:text-[#00F0C3] transition-colors text-sm font-medium"><EditIcon /> Edit</button>
                  <button onClick={() => initiateDelete('card', card.id)} className="flex items-center gap-2 text-white hover:text-red-400 transition-colors text-sm font-medium"><TrashIcon /> Delete</button>
                </div>
              </div>
            ))}
            {/* Add Card Button */}
            <div onClick={() => { setCardForm({ mode: "debit", cardType: "", cardNumber: "", expiry: "", cvv: "", holder: "" }); toggleModal('addCard', true); }} className="rounded-xl p-4 bg-gray-50 text-gray-500 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#00F0C3] hover:text-[#00A38A] transition-all min-h-[160px] group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform"><PluIcon /></span>
              <span className="font-medium">Add New Card</span>
            </div>
          </div>
        )}
      </div>

      {/* Bank Accounts Section */}
      <div className="bg-white rounded-xl p-6 w-full space-y-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-[#001D21]">Bank Accounts</h3>
        {isLoadingData ? (
          <div className="flex items-center justify-center h-[140px] text-gray-400">Loading accounts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((acc, idx) => (
              <div key={acc.id || idx} className="group relative overflow-hidden rounded-xl p-4 bg-white border border-gray-200 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all">
                <div className="text-sm font-semibold flex items-center gap-2 text-[#001D21]">
                  <div className={`p-1.5 rounded-lg ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}><ICIcon /></div>
                  {acc.bank_name}
                </div>
                <div className="text-xs mt-3 text-gray-500 font-mono">xxxx-xxxx-xxxx-{acc.account_number ? acc.account_number.slice(-4) : 'XXXX'}</div>
                <div className="mt-4 flex items-center gap-4 text-xs">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium capitalize">{acc.account_type_display || acc.account_type}</span>
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {acc.status_display || acc.status}
                  </span>
                </div>
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-[#001D21]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
                  <button onClick={() => openBankDetailsModal(acc)} className="flex items-center gap-2 text-white hover:text-[#00F0C3] transition-colors text-sm font-medium"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg> Details</button>
                  <button onClick={() => openEditBankModal(acc)} className="flex items-center gap-2 text-white hover:text-[#00F0C3] transition-colors text-sm font-medium"><EditIcon /> Edit</button>
                  <button onClick={() => initiateDelete('bank', acc.id)} className="flex items-center gap-2 text-white hover:text-red-400 transition-colors text-sm font-medium"><TrashIcon /> Delete</button>
                </div>
              </div>
            ))}
            {/* Add Bank Button */}
            <div onClick={() => { setBankForm({ bankName: "", accountType: "", accountName: "", bankCountry: "", accountNumber: "", routingNumber: "" }); toggleModal('addBank', true); }} className="rounded-xl p-4 bg-gray-50 text-gray-500 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#00F0C3] hover:text-[#00A38A] transition-all min-h-[140px] group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform"><PluIcon /></span>
              <span className="font-medium">Add Bank Account</span>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Add Card */}
      <Modal isOpen={modals.addCard} onClose={() => toggleModal('addCard', false)} title="Add New Card" 
        footer={
          <>
            <button onClick={() => toggleModal('addCard', false)} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium">Cancel</button>
            <button onClick={onAddCard} disabled={isSubmitting} className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg font-medium shadow-sm hover:bg-[#00D4A8] disabled:opacity-70 flex items-center">{isSubmitting ? "Adding..." : "Add Card"}</button>
          </>
        }>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <div className="flex gap-2 mb-2">
          {['debit', 'credit'].map(mode => (
            <button key={mode} onClick={() => setCardForm(p => ({...p, mode}))} className={`px-4 py-1.5 rounded-lg text-sm capitalize font-medium transition-all ${cardForm.mode === mode ? 'bg-[#00F0C3] text-black shadow-sm' : 'bg-gray-100 text-gray-500'}`}>{mode} Card</button>
          ))}
        </div>
        <InputField label="Card Type" name="cardType" value={cardForm.cardType} onChange={handleInputChange(setCardForm)} placeholder="Visa, Mastercard" />
        <InputField label="Card Number" name="cardNumber" value={cardForm.cardNumber} onChange={handleInputChange(setCardForm)} placeholder="XXXX XXXX XXXX XXXX" />
        <div className="flex gap-3">
          <InputField className="flex-1" label="Expiry Date" name="expiry" value={cardForm.expiry} onChange={handleInputChange(setCardForm)} placeholder="MM/YY" />
          <InputField className="flex-1" label="CVV" name="cvv" value={cardForm.cvv} onChange={handleInputChange(setCardForm)} placeholder="123" />
        </div>
        <InputField label="Card Holder Name" name="holder" value={cardForm.holder} onChange={handleInputChange(setCardForm)} placeholder="NAME ON CARD" />
      </Modal>

      {/* Edit Card */}
      <Modal isOpen={modals.editCard} onClose={() => toggleModal('editCard', false)} title="Edit Card"
        footer={
          <>
            <button onClick={() => toggleModal('editCard', false)} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium">Cancel</button>
            <button onClick={onUpdateCard} disabled={isSubmitting} className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg font-medium shadow-sm hover:bg-[#00D4A8] disabled:opacity-70">{isSubmitting ? "Saving..." : "Save Changes"}</button>
          </>
        }>
        <InputField label="Card Number" name="cardNumber" value={editCardForm.cardNumber} onChange={handleInputChange(setEditCardForm)} />
        <div className="flex gap-3">
          <InputField className="flex-1" label="Expiry Date" name="expiry" value={editCardForm.expiry} onChange={handleInputChange(setEditCardForm)} placeholder="MM/YY" />
          <InputField className="flex-1" label="CVV" name="cvv" value={editCardForm.cvv} onChange={handleInputChange(setEditCardForm)} placeholder="***" />
        </div>
        <InputField label="Card Holder Name" name="holder" value={editCardForm.holder} onChange={handleInputChange(setEditCardForm)} />
      </Modal>

      {/* Add Bank */}
      <Modal isOpen={modals.addBank} onClose={() => toggleModal('addBank', false)} title="Add New Bank"
        footer={
          <>
            <button onClick={() => toggleModal('addBank', false)} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium">Cancel</button>
            <button onClick={onAddBank} disabled={isSubmitting} className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg font-medium shadow-sm hover:bg-[#00D4A8] disabled:opacity-70">{isSubmitting ? "Adding..." : "Add Bank"}</button>
          </>
        }>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <SelectField label="Bank Name" name="bankName" value={bankForm.bankName} onChange={handleInputChange(setBankForm)} options={[{value: "Chase Bank", label: "Chase Bank"}, {value: "HDFC", label: "HDFC Bank"}, {value: "ICICI", label: "ICICI Bank"}, {value: "SBI", label: "SBI"}, {value: "BoA", label: "Bank of America"}]} />
        <SelectField label="Account Type" name="accountType" value={bankForm.accountType} onChange={handleInputChange(setBankForm)} options={[{value: "Personal", label: "Personal"}, {value: "Business", label: "Business"}, {value: "Savings", label: "Savings"}, {value: "Checking", label: "Checking"}]} />
        <InputField label="Account Number" name="accountNumber" value={bankForm.accountNumber} onChange={handleInputChange(setBankForm)} placeholder="1234567890" />
        <InputField label="Routing Number" name="routingNumber" value={bankForm.routingNumber} onChange={handleInputChange(setBankForm)} placeholder="021000021" />
        <InputField label="Account Holder Name" name="accountName" value={bankForm.accountName} onChange={handleInputChange(setBankForm)} placeholder="e.g. John Doe" />
        <SelectField label="Bank Country" name="bankCountry" value={bankForm.bankCountry} onChange={handleInputChange(setBankForm)} options={[{value: "U.S.A", label: "U.S.A"}, {value: "India", label: "India"}, {value: "UK", label: "United Kingdom"}, {value: "Singapore", label: "Singapore"}]} />
      </Modal>

      {/* Edit Bank */}
      <Modal isOpen={modals.editBank} onClose={() => toggleModal('editBank', false)} title="Edit Bank"
        footer={
          <>
            <button onClick={() => toggleModal('editBank', false)} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium">Cancel</button>
            <button onClick={onUpdateBank} disabled={isSubmitting} className="px-5 py-2.5 bg-[#00F0C3] text-black rounded-lg font-medium shadow-sm hover:bg-[#00D4A8] disabled:opacity-70">{isSubmitting ? "Saving..." : "Save Changes"}</button>
          </>
        }>
        {/* Reusing same form fields as Add Bank, could be extracted further if needed */}
        <SelectField label="Bank Name" name="bankName" value={bankForm.bankName} onChange={handleInputChange(setBankForm)} options={[{value: "Chase Bank", label: "Chase Bank"}, {value: "HDFC", label: "HDFC Bank"}, {value: "ICICI", label: "ICICI Bank"}, {value: "SBI", label: "SBI"}, {value: "BoA", label: "Bank of America"}]} />
        <SelectField label="Account Type" name="accountType" value={bankForm.accountType} onChange={handleInputChange(setBankForm)} options={[{value: "Personal", label: "Personal"}, {value: "Business", label: "Business"}, {value: "Savings", label: "Savings"}, {value: "Checking", label: "Checking"}]} />
        <InputField label="Account Number" name="accountNumber" value={bankForm.accountNumber} onChange={handleInputChange(setBankForm)} placeholder="1234567890" />
        <InputField label="Routing Number" name="routingNumber" value={bankForm.routingNumber} onChange={handleInputChange(setBankForm)} placeholder="021000021" />
        <InputField label="Account Holder Name" name="accountName" value={bankForm.accountName} onChange={handleInputChange(setBankForm)} placeholder="e.g. John Doe" />
        <SelectField label="Bank Country" name="bankCountry" value={bankForm.bankCountry} onChange={handleInputChange(setBankForm)} options={[{value: "U.S.A", label: "U.S.A"}, {value: "India", label: "India"}, {value: "UK", label: "United Kingdom"}, {value: "Singapore", label: "Singapore"}]} />
      </Modal>

      {/* Bank Details View */}
      <Modal isOpen={modals.bankDetails} onClose={() => toggleModal('bankDetails', false)} title="Bank Account Details"
        footer={<button onClick={() => toggleModal('bankDetails', false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Close</button>}>
        {selectedBank && (
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Bank Name", value: selectedBank.bank_name },
              { label: "Account Type", value: selectedBank.account_type_display || selectedBank.account_type, capitalize: true },
              { label: "Status", value: selectedBank.status_display || selectedBank.status, isStatus: true },
              { label: "Account Holder", value: selectedBank.account_holder_name, full: true },
              { label: "Account Number", value: selectedBank.account_number, full: true, mono: true },
              { label: "Routing Number", value: selectedBank.routing_number, mono: true }
            ].map((item, idx) => item.value ? (
              <div key={idx} className={item.full ? "col-span-2" : ""}>
                <div className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">{item.label}</div>
                {item.isStatus ? (
                  <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${item.value.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span><span className="font-medium text-gray-900 capitalize">{item.value}</span></div>
                ) : (
                  <div className={`font-medium text-gray-900 ${item.capitalize ? 'capitalize' : ''} ${item.mono ? 'font-mono bg-white border border-gray-200 rounded px-2 py-1 inline-block' : ''}`}>{item.value}</div>
                )}
              </div>
            ) : null)}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={modals.deleteConfirm} onClose={() => toggleModal('deleteConfirm', false)} title="Confirm Deletion"
        footer={
          <>
            <button onClick={() => toggleModal('deleteConfirm', false)} className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100">Cancel</button>
            <button onClick={onConfirmDelete} disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow-sm disabled:opacity-70">{isSubmitting ? 'Deleting...' : 'Delete'}</button>
          </>
        }>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500"><TrashIcon /></div>
          <p className="text-sm text-gray-500">Are you sure you want to delete this? This action cannot be undone.</p>
        </div>
      </Modal>

    </div>
  );
};

export default BankDetails;