import React, { useState } from "react";
import { FreeIcon, Upload2Icon, CloseIcon,SavechangesIcon } from "../../../components/Icons";
import { useNavigate } from "react-router-dom";

const AddFeeRecipient = () => {
    const [recipientType, setRecipientType] = useState("Individual");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [jurisdiction, setJurisdiction] = useState("");
    const [file, setFile] = useState(null);
    const [referenceCode, setReferenceCode] = useState("");
    const navigate = useNavigate();

    const handleSave = () => {
        navigate("../FeeRecipientSetup");
    };

    const handleCancel = () => {
        navigate("../FeeRecipientSetup");
    };

    return (
        <div className="bg-[#F4F6F5] min-h-screen px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-4">
                <div className="flex items-center justify-center sm:justify-start">
                    <FreeIcon />
                </div>
                <div>
                    <h4 className="text-base sm:text-[18px] text-[#001D21] font-semibold">
                        Fee Recipient Setup
                    </h4>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 w-full space-y-8">
                {/* Recipient Type */}
                <div className="mb-6 flex flex-col items-start w-full md:w-2/5">
                    <label className="block text-sm text-[#001D21] font-medium mb-2">
                        Recipient Type
                    </label>
                    <select
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 outline-none text-[#001D21]"
                    >
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                        <option value="Trust">Trust</option>
                    </select>
                </div>

                {/* First and Last Name, side by side, both fill half each, together full width */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="w-full">
                        <label className="block text-sm text-[#001D21] font-medium mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <input
                                className="w-full !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-2 pr-8 outline-none"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                                    <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm text-[#001D21] font-medium mb-2 ">
                            Last Name
                        </label>
                        <div className="relative">
                            <input
                                className="w-full !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-2 pr-8 outline-none"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                                    <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" stroke="#0A2A2E" strokeWidth="1.5" fill="none"/>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Jurisdiction - tight inline row */}
                <div className="mb-6 mt-10 flex flex-col md:flex-row md:items-center gap-2">
                    <label className="block text-sm text-[#001D21] font-medium mb-2 md:mb-0 md:mr-2 whitespace-nowrap">
                        Select Jurisdiction
                    </label>
                    <select
                        value={jurisdiction}
                        onChange={(e) => setJurisdiction(e.target.value)}
                        className="!border border-[#E2E2FB] rounded-lg p-2 outline-none w-full md:w-2/5 text-[#001D21]"
                    >
                        <option value="">Jurisdiction</option>
                        <option value="delaware">Delaware</option>
                        <option value="bvi">BVI</option>
                        <option value="adgm">ADGM</option>
                    </select>
                </div>

                {/* Upload Section - fixed design */}
                <div className="mb-6 mt-10">
                    <label className="block text-sm text-[#001D21] font-medium mb-2">
                        Upload ID Or Incorporation Documents
                    </label>
                    <div className="border border-dashed border-[#E2E2FB] rounded-lg p-6 sm:p-8 bg-[#F8FAFE] w-full md:w-1/2 mt-3">
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            className="hidden"
                            id="fileUpload"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label
                            htmlFor="fileUpload"
                            className="flex items-center cursor-pointer text-[#2F595C] font-medium"
                        >
                            <span className="mr-2"><Upload2Icon/></span>
                            <span className="text-[13px]">Upload Documents File</span>
                            <span className="text-[#748A91] underline ml-2 text-[13px]">choose file</span>
                        </label>
                        {file && (
                            <p className="text-sm text-gray-500 mt-2">{file.name}</p>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between w-full md:w-1/2 mt-2 text-xs text-gray-400 gap-1 sm:gap-0">
                        <span>Supported file type: .pdf, .docx</span>
                        <span className="sm:text-right">Maximum Size: 25MB</span>
                    </div>
                </div>

                {/* Reference Code */}
                <div className="mb-6 mt-10">
                    <label className="block text-sm text-[#001D21] font-medium mb-2">
                        Tax ID Or Entity Reference Code (Optional)
                    </label>
                    <input
                        className="w-full md:w-1/3 !border border-[#0A2A2E] bg-[#F4F6F5] rounded-lg p-2 outline-none"
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        placeholder="Enter Tax ID Or Reference Code"
                    />
                </div>

              
                {/* Note Section - fixed design */}
                <div className="bg-[#FFFDD080] !border border-[#FFC65B] rounded-xl p-6 w-full md:w-1/2">
                    <div className="text-[13px] font-semibold text-[#FFC65B] mb-2">Note*</div>
                    <ul className="list-disc pl-5 m-0">
                        <li className="text-[13px] text-[#748A91]">IRA And Fund-Based Options Can Be Added In Future Phases.</li>
                    </ul>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-[#FDECEC] border border-[#FFCFCF] text-[#01373D] text-base rounded-lg font-semibold cursor-pointer"
                    >
                        <CloseIcon />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-medium cursor-pointer"
                    >
                        <SavechangesIcon />
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFeeRecipient;
