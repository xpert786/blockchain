import React, { useState, useEffect } from "react";

// --- Inline Icons ---
const GlobeAltIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const JusIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#001D21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18"/>
    <path d="M5 21V7l8-4 8 4v14"/>
    <path d="M9 10a2 2 0 1 1-4 0v11"/>
    <path d="M19 21v-8a2 2 0 0 0-4 0v8"/>
  </svg>
);

const JurisdictionalSettings = () => {
  // --- Configuration ---
  // Base URL for the jurisdictional settings
  const BASE_API_URL = "http://168.231.121.7/blockchain-backend/api/syndicate/settings/jurisdictional/";
  
  // Specific ID used for GET requests as per your curl
  const SETTING_ID = "1"; 

  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzIyMjg0LCJpYXQiOjE3NjQzMDQyODQsImp0aSI6IjkyMDRhMGY3ODhjNDRlMDQ5MWE4NjkzZWY3NzlmYTljIiwidXNlcl9pZCI6IjIifQ.6h81mnprtOjPpn2-_mkasbrXSwKwbr7wHkhEC-j6_ag";

  // Default fallback options
  const DEFAULT_OPTIONS = [
    { id: 1, name: "Delaware (USA)" },
    { id: 2, name: "Wyoming (USA)" },
    { id: 3, name: "Cayman Islands" },
    { id: 4, name: "British Virgin Islands" },
    { id: 5, name: "Singapore" }
  ];

  // --- State ---
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [initialJurisdiction, setInitialJurisdiction] = useState(""); // To track changes
  const [jurisdictionOptions, setJurisdictionOptions] = useState(DEFAULT_OPTIONS); // Start with defaults
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // --- Effects ---
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;
    setIsLoading(true);
    setError(null);

    // Endpoint to get the list of available geographies (Root URL)
    const listUrl = BASE_API_URL;
    // Endpoint to get the current selection (Specific ID)
    const selectionUrl = `${BASE_API_URL}${SETTING_ID}/`;

    try {
      // Execute both requests in parallel
      const [listResponse, selectionResponse] = await Promise.all([
        fetch(listUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
        fetch(selectionUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        })
      ]);

      // --- 1. Process List of Options ---
      if (listResponse.ok) {
        const listResult = await listResponse.json();
        const listData = listResult.data || listResult;
        console.log("Fetched Options List:", listData);

        // Extract geographies from the response data structure you provided
        const fetchedOptions = listData.geographies || listData.available_geographies || listData.jurisdictions;
        
        if (Array.isArray(fetchedOptions) && fetchedOptions.length > 0) {
          setJurisdictionOptions(fetchedOptions);
        }
      } else {
        console.warn("Failed to fetch options list:", listResponse.status);
      }

      // --- 2. Process Current Selection ---
      if (selectionResponse.ok) {
        const selectionResult = await selectionResponse.json();
        const selectionData = selectionResult.data || selectionResult;
        console.log("Fetched Selection:", selectionData);

        let foundId = null;

        // Determine the selected ID based on response format
        if (selectionData.geography_ids && Array.isArray(selectionData.geography_ids) && selectionData.geography_ids.length > 0) {
          foundId = selectionData.geography_ids[0].toString();
        } else if (selectionData.id) {
          foundId = selectionData.id.toString();
        }

        if (foundId) {
          setSelectedJurisdiction(foundId);
          setInitialJurisdiction(foundId);
        }
      } else {
        // If selection fetch fails, we might still want to show the list, so we don't throw immediately
        console.warn("Failed to fetch selection:", selectionResponse.status);
      }

    } catch (error) {
      console.error("Error fetching jurisdictional settings:", error);
      setError("Unable to load settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleJurisdictionChange = (e) => {
    setSelectedJurisdiction(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedJurisdiction) return;
    
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || TEST_TOKEN;

    const payload = {
      jurisdictional_compliance_acknowledged: true,
      geography_ids: [parseInt(selectedJurisdiction)]
    };

    // PATCH Request uses the base URL: .../jurisdictional/ (No ID)
    const patchUrl = BASE_API_URL;

    try {
      const response = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("Jurisdictional settings saved");
        setInitialJurisdiction(selectedJurisdiction);
      } else {
        const errorData = await response.json();
        console.error("Failed to save settings", errorData);
        // Handle specific backend error messages if available
        if (errorData.error) {
            setError(errorData.error);
        } else {
            setError("Failed to save settings. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Network error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if changes have been made
  const hasChanges = selectedJurisdiction !== initialJurisdiction;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-[#F4F6F5]">
        <div className="text-gray-500 font-poppins-custom animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Top header white card */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-start sm:gap-3 gap-4 border border-gray-100">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="p-2 bg-[#F4F6F5] rounded-full">
            <JusIcon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#001D21]">Jurisdictional Settings</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage Legal And Compliance Configurations For Your Selected Jurisdiction.</p>
        </div>
      </div>

      {/* Jurisdiction selection card */}
      <div className="bg-white rounded-xl shadow-sm px-5 md:px-6 py-6 w-full border border-gray-100">
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
            </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-3">
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-0 md:mr-3 min-w-fit">
            Jurisdiction:
          </label>
          <div className="relative w-full md:max-w-xs flex items-center">
            <div className="relative w-full">
              <select
                value={selectedJurisdiction}
                onChange={handleJurisdictionChange}
                className="w-full px-3 py-3.5 border border-[#E2E2FB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F0C3] focus:border-transparent bg-[#F4F6F5] text-gray-800 text-sm appearance-none cursor-pointer transition-shadow"
              >
                <option value="" disabled>Select SPV Jurisdiction</option>
                {jurisdictionOptions.length > 0 ? (
                  jurisdictionOptions.map((jurisdiction) => (
                    <option 
                      key={jurisdiction.id || jurisdiction.value} 
                      value={jurisdiction.id || jurisdiction.value}
                    >
                      {jurisdiction.name || jurisdiction.label}
                    </option>
                  ))
                ) : (
                  // Fallback if API returns no list but we need to show selected ID
                  selectedJurisdiction && <option value={selectedJurisdiction}>Selected ID: {selectedJurisdiction}</option>
                )}
              </select>
              {/* The dropdown caret (SVG) overlays select field */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Question mark button tightly after select */}
            <div className="flex items-center ml-4 sm:ml-6 relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-sm font-bold focus:outline-none cursor-help transition-transform hover:scale-105"
                style={{ lineHeight: 1, backgroundColor: "#000000", border: "1px solid #F5DE8A", color: "#FFFFFF" }}
                aria-label="More information"
              >
                ?
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-3 px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md shadow-lg z-10 min-w-[210px] whitespace-nowrap">
                  <div className="text-xs text-center leading-tight">
                    More jurisdiction and legal <br/>customizations coming soon
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-200"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button - Only visible when changes exist */}
        {hasChanges && (
          <div className="mt-8 flex justify-end animate-fade-in">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2.5 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-all font-medium shadow-sm hover:shadow-md active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <SaveIcon />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JurisdictionalSettings;