import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// --- Sub-Components ---

const InviteLPsModal = ({ isOpen, onClose, spvId, investorList = [] }) => {
  if (!isOpen) return null;

  // Form State
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [leadCarry, setLeadCarry] = useState("");
  const [visibility, setVisibility] = useState("hidden");
  const [autoInvite, setAutoInvite] = useState(false);
  const [privateNote, setPrivateNote] = useState("");
  const [tags, setTags] = useState("");

  // UI State
  const [isSending, setIsSending] = useState(false);

  // Constants (Ideally passed from parent or config, kept local for self-containment)
  const API_BASE_URL = "http://72.61.251.114/blockchain-backend/api/spv";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzQ4NjIzLCJpYXQiOjE3NjQzMzA2MjMsImp0aSI6IjFmZmIwMTUwN2U4YjQzN2I4NWYyYTE5ZDEwNWI2ZmQ5IiwidXNlcl9pZCI6IjY0In0.x0zZ-aZ3kqrbqw9vvhLU1JGoGhtINSu2TG7mVefvUDs";

  const handleSendInvite = async () => {
    setIsSending(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    // Parse emails - backend will handle validation
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e !== "");

    if (emailList.length === 0) {
      alert("Please enter at least one email address.");
      setIsSending(false);
      return;
    }

    // Prepare payload - send all emails, backend will validate
    const payload = {
      emails: emailList,
      message: message,
      lead_carry_percentage: parseFloat(leadCarry) || 0,
      investment_visibility: visibility, // "hidden" or "visible"
      auto_invite_active_spvs: autoInvite,
      private_note: privateNote,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== "") // Split CSV to array
    };

    try {
      const url = `${API_BASE_URL}/${spvId}/invite-lps/`;
      console.log("Sending invite request to:", url);
      console.log("Payload:", payload);
      console.log("SPV ID being used:", spvId);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("Invite response:", result);
        alert(`Invites sent successfully!`);
        // Reset form
        setEmails("");
        setMessage("");
        setLeadCarry("");
        setPrivateNote("");
        setTags("");
        onClose();
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || response.statusText };
        }
        console.error("Error response:", errorData);
        alert(`Failed to send invites: ${errorData.message || errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending invites:", error);
      alert(`Network error occurred while sending invites: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01373DB2] p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Email Invite</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">

          {/* Section: Invite Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Invite Details</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">LP Emails (Comma separated)</label>
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="investor@example.com, another@example.com"
                className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Message</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="You are invited to invest..."
                className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Section: LP Defaults */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">LP Defaults</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Carry %</label>
              <input
                type="number"
                value={leadCarry}
                onChange={(e) => setLeadCarry(e.target.value)}
                placeholder="5.0"
                className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment And Fund Valuations</label>
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="hidden">Hidden</option>
                  <option value="visible">Visible</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="p-4 bg-[#F9F8FF] border border-[#E2E2FB] rounded-lg flex items-start gap-3 transition-colors cursor-pointer group"
              onClick={() => setAutoInvite(!autoInvite)}
            >
              <div className="flex items-center h-5 mt-1">
                <input
                  id="raising-spv"
                  type="checkbox"
                  checked={autoInvite}
                  onChange={(e) => setAutoInvite(e.target.checked)}
                  className="w-5 h-5 border-[#F4F6F5] rounded text-[#00F0C3] focus:ring-[#00F0C3] cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="raising-spv" className="text-base font-medium text-gray-900 block cursor-pointer group-hover:text-black">Any Raising SPV</label>
                <p className="text-sm text-gray-500 mt-0.5">Automatic invites to All Currents SPV</p>
              </div>
            </div>
          </div>

          {/* Section: Invite To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Internal Notes</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Private Note</label>
              <input
                type="text"
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="Internal note about these investors"
                className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="accredited, tech-investors"
                className="w-full px-4 py-3 bg-[#F4F6F5] border border-[#0A2A2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent text-gray-900 transition-all"
              />
            </div>
          </div>

          {/* Footer Action */}
          <div>
            <button
              onClick={handleSendInvite}
              disabled={isSending}
              className={`px-6 py-3 bg-[#00F0C3] hover:bg-[#00D4A3] text-black rounded-lg transition-all shadow-sm hover:shadow-md transform active:scale-[0.98] flex items-center justify-center w-full sm:w-auto ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Invite team member"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const SPVDocuments = ({ spvId }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://72.61.251.114/blockchain-backend/api/spv";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzQ4NjIzLCJpYXQiOjE3NjQzMzA2MjMsImp0aSI6IjFmZmIwMTUwN2U4YjQzN2I4NWYyYTE5ZDEwNWI2ZmQ5IiwidXNlcl9pZCI6IjY0In0.x0zZ-aZ3kqrbqw9vvhLU1JGoGhtINSu2TG7mVefvUDs";

  useEffect(() => {
    if (spvId) {
      fetchDocuments();
    }
  }, [spvId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    try {
      const response = await fetch(`${API_BASE_URL}/${spvId}/documents/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.documents) {
          setDocuments(result.data.documents);
        } else {
          setDocuments([]);
        }
      } else {
        setError("Failed to load documents.");
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Network error loading documents.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-100 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <p className="text-gray-500 mt-1">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <span className="text-sm text-gray-500">{documents.length} File(s)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{doc.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploaded_by}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(doc.uploaded_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size_mb} MB</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00F0C3] hover:text-[#00D4A3] flex justify-end"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SPVActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-[#00F0C3]"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.title || activity.type}</p>
              {activity.date && <p className="text-xs text-gray-500">{activity.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---

const SPVDetails = () => {
  const [activeTab, setActiveTab] = useState("investors");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [spvData, setSpvData] = useState(null);
  const [investorList, setInvestorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [spvNumericId, setSpvNumericId] = useState(null); // Store the actual numeric SPV ID from API

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Get SPV ID from multiple sources (priority order):
  // 1. URL parameter (if route has :id)
  // 2. Location state (passed from navigation)
  // 3. Default to "13" only if nothing is available (shouldn't happen in normal flow)
  const getSpvId = () => {
    // Try URL param first
    if (id) {
      console.log("Using SPV ID from URL params:", id);
      return String(id);
    }

    // Try location state
    const stateSpv = location.state?.spv;
    if (stateSpv) {
      // Prioritize numeric ID over code
      const spvId = stateSpv.id || stateSpv.spv_id || stateSpv.write_id;
      if (spvId) {
        console.log("Using SPV ID from location state:", spvId, "Full state:", stateSpv);
        return String(spvId);
      }
      // Fallback to code if no numeric ID
      if (stateSpv.code) {
        console.log("Using SPV code from location state:", stateSpv.code);
        return String(stateSpv.code);
      }
    }

    // Last resort: default (shouldn't happen)
    console.warn("No SPV ID found in URL or state, defaulting to 13. Location state:", location.state);
    return "13";
  };

  const displayId = getSpvId();

  // --- Configuration ---
  const API_BASE_URL = "http://72.61.251.114/blockchain-backend/api/spv";
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzQ4NjIzLCJpYXQiOjE3NjQzMzA2MjMsImp0aSI6IjFmZmIwMTUwN2U4YjQzN2I4NWYyYTE5ZDEwNWI2ZmQ5IiwidXNlcl9pZCI6IjY0In0.x0zZ-aZ3kqrbqw9vvhLU1JGoGhtINSu2TG7mVefvUDs";

  // --- Helpers ---
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatPercent = (value) => {
    if (value === undefined || value === null) return "0%";
    return `${value}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    // Check if format is MM/DD/YYYY to avoid timezone issues or just pass to Date
    return new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    if (displayId) {
      fetchSPVDetails();
      fetchInvestorsList();
    }
  }, [displayId]);

  const fetchSPVDetails = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    try {
      console.log("Fetching SPV details with ID:", displayId);
      const response = await fetch(`${API_BASE_URL}/${displayId}/details/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("SPV Details API response:", result);
        if (result.success) {
          transformAndSetData(result.data);
        } else {
          // If we can't get details, we might still be able to show the list, but usually we need context
          console.warn("SPV Details success flag was false", result);
        }
      } else {
        const errorText = await response.text();
        console.error(`Error fetching SPV details: ${response.status} ${response.statusText}`, errorText);
        setError(`Failed to load SPV details: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching SPV details:", err);
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestorsList = async () => {
    await fetchInvestorsListWithId(displayId);
  };

  const fetchInvestorsListWithId = async (spvIdToUse) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    try {
      console.log("Fetching investors with SPV ID:", spvIdToUse);
      // Hit the exact endpoint requested for the investor list
      const response = await fetch(`${API_BASE_URL}/${spvIdToUse}/investors/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Investors API response:", result);
        // Check based on the provided JSON structure
        if (result.success && result.data && result.data.investors) {
          const mappedInvestors = result.data.investors.map(inv => ({
            id: inv.id || inv.investor_id || inv.write_id, // Include investor ID
            name: inv.name,
            email: inv.email,
            // Map API 'amount' (e.g., 50000) to formatted currency
            amount: formatCurrency(inv.amount),
            // Map API 'percentage' (e.g., 25) to string
            ownership: `${inv.percentage}%`,
            // Map API 'date' (e.g., "11/28/2025")
            date: inv.date,
            status: inv.status,
            // Determine styling based on status
            statusColor: inv.status === "Active" ? "bg-[#22C55E] text-white" : "bg-gray-200 text-gray-700"
          }));
          setInvestorList(mappedInvestors);
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch investor list:", response.status, errorText);
      }
    } catch (err) {
      console.error("Error fetching investor list:", err);
    }
  };

  const transformAndSetData = (apiData) => {
    // Store the numeric SPV ID for API calls (not the code)
    const numericId = apiData.id || apiData.spv_id || apiData.write_id;
    if (numericId) {
      setSpvNumericId(String(numericId));
      console.log("Stored SPV numeric ID for API calls:", numericId);
    }

    // 1. Map API data to UI structure
    const mappedData = {
      name: apiData.display_name || apiData.spv_code,
      id: apiData.spv_code,
      raised: formatCurrency(apiData.fundraising_progress?.total_raised),
      target: formatCurrency(apiData.fundraising_progress?.target),
      progress: apiData.fundraising_progress?.progress_percent || 0,
      daysLeft: apiData.fundraising_progress?.days_to_close ? `${apiData.fundraising_progress.days_to_close} Days Left` : null,
      status: apiData.status_label || null,
      statusColor: apiData.status === "raising" || apiData.status === "active" ? "bg-[#22C55E] text-white" : "bg-gray-200 text-gray-700",
      totalValue: formatCurrency(apiData.financial_metrics?.total_value),
      unrealizedGain: formatCurrency(apiData.financial_metrics?.uninvested_sum),
      irr: formatPercent(apiData.financial_metrics?.irr),
      multiple: `${apiData.financial_metrics?.multiple || 0}x`,
      jurisdiction: `${apiData.spv_details?.jurisdiction}, ${apiData.spv_details?.country?.toUpperCase()}`,
      created: formatDate(apiData.created_at),
      focus: apiData.portfolio_company?.sector || null,
      vintage: apiData.spv_details?.year,
      fundTerm: `${apiData.spv_details?.term_length_years} Year(s)`,
      closingDate: formatDate(apiData.fundraising_progress?.target_closing_date),
      description: apiData.description || (apiData.portfolio_company?.sector ? `An SPV targeting ${apiData.portfolio_company?.stage || ''} stage companies in ${apiData.portfolio_company?.sector}.` : null),
      minInvestment: formatCurrency(apiData.investment_terms?.minimum_investment),
      managementFee: apiData.investment_terms?.management_fee ? formatPercent(apiData.investment_terms.management_fee) : null,
      investmentPeriod: apiData.investment_terms?.investment_period || null,
      maxCap: formatCurrency(apiData.fundraising_progress?.target),
      carriedInterest: formatPercent(apiData.carry_fees?.total_carry_percentage),
      investorCount: apiData.investors?.count || 0,
      activities: apiData.activities || apiData.activity_log || []
    };

    setSpvData(mappedData);
  };

  // Filter investors based on search query
  const filteredInvestors = investorList.filter(investor =>
    (investor.name && investor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (investor.email && investor.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: "investors", label: "Investors" },
    { id: "documents", label: "Documents" },
    { id: "activity", label: "Activity" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#00F0C3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !spvData) {
    return (
      <div className="min-h-screen bg-[#F4F6F5] p-6 pt-10">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error || "Data not found"}
        </div>
        <button onClick={() => navigate(-1)} className="mt-4 text-gray-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] p-6 pt-10">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm">
          <button
            onClick={() => navigate('/manager-panel/spv-management')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            SPV Management
          </button>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-900">{spvData.name}</span>
        </nav>
      </div>

      {/* Main SPV Card */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{spvData.name}</h1>
            <p className="text-lg text-gray-600">{spvData.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Raised</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.raised}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Investors</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.investorCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Min Investment</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.minInvestment}</p>
          </div>
          {spvData.daysLeft && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Days to Close</p>
              <p className="text-2xl font-bold text-gray-900">{spvData.daysLeft}</p>
            </div>
          )}
          {spvData.status && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${spvData.statusColor}`}>
                  {spvData.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fundraising Progress Card */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fundraising Progress</h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Target: {spvData.target}</span>
            <span className="text-sm font-medium text-gray-900">{spvData.raised} of {spvData.target}</span>
          </div>
          <div className="w-full bg-[#CEC6FF] rounded-full h-3">
            <div
              className="h-3 rounded-full bg-[#00F0C3]"
              style={{ width: `${Math.min(spvData.progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-2">
            <span className="text-sm font-medium text-gray-900">{Number(spvData.progress).toFixed(2)}% Complete</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics Card */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.totalValue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Uninvested Sum</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.unrealizedGain}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">IRR</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.irr}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Multiple</p>
            <p className="text-2xl font-bold text-gray-900">{spvData.multiple}</p>
          </div>
        </div>
      </div>

      {/* SPV Details and Investment Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* SPV Details Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SPV Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">SPV ID:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Jurisdiction:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.jurisdiction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Created:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.created}</span>
            </div>
            {spvData.focus && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Investment Focus:</span>
                <span className="text-sm font-medium text-gray-900">{spvData.focus}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Vintage:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.vintage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fund Term:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.fundTerm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Closing Date:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.closingDate}</span>
            </div>
          </div>
          {spvData.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-sm text-gray-900">{spvData.description}</p>
            </div>
          )}
        </div>

        {/* Investment Terms Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Terms</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Minimum Investment:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.minInvestment}</span>
            </div>
            {spvData.managementFee && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Management Fee:</span>
                <span className="text-sm font-medium text-gray-900">{spvData.managementFee}</span>
              </div>
            )}
            {spvData.investmentPeriod && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Investment Period:</span>
                <span className="text-sm font-medium text-gray-900">{spvData.investmentPeriod}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Maximum Cap.:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.maxCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Carried Interest:</span>
              <span className="text-sm font-medium text-gray-900">{spvData.carriedInterest}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-3 w-fit mb-6 shadow-sm border border-gray-100">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                  ? "bg-[#00F0C3] text-black"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "investors" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Investor List</h2>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#00F0C3] hover:bg-[#00D4A3] text-black px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Invite LPs
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search investors by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Investor Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">
                      No investors found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredInvestors.map((investor, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{investor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.ownership}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investor.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${investor.statusColor}`}>
                          {investor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate('/manager-panel/investor-details', { state: { investor } })}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4 text-[#01373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-[#01373D]" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredInvestors.length > 0 && (
            <div className="flex items-center justify-end mt-6">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">←</button>
                <button className="px-3 py-1 text-sm bg-[#00F0C3] text-black rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">→</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "documents" && <SPVDocuments spvId={displayId} />}
      {activeTab === "activity" && <SPVActivity activities={spvData.activities} />}

      {/* Invite LPs Modal */}
      <InviteLPsModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        spvId={spvNumericId || displayId}
        investorList={investorList}
      />
    </div>
  );
};

export default SPVDetails;