import React, { useState } from "react";
import { DocIcon, SavesIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon,ComsIcon,PdfIcon  } from "../../../components/Icons";

const ComplianceAccreditation = () => {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Attest.pdf", progress: 40, status: "uploading" },
    { name: "Tax.pdf", progress: 50, status: "uploading" }
  ]);

  const [documents] = useState([
    { name: "COI_2025.pdf", type: "COI", jurisdiction: "US (NY)", status: "OK" },
    { name: "W9_Form.pdf", type: "Tax", jurisdiction: "US (TX)", status: "Exp." },
    { name: "GDPR_Attest.", type: "Attest.", jurisdiction: "EU (DE)", status: "Missing" }
  ]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      setUploadedFiles(prev => [...prev, { name: file.name, progress: 0, status: "uploading" }]);
    });
  };

  const handleSave = () => {
    console.log("Compliance & Accreditation saved");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OK":
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case "Exp.":
        return <XMarkIcon className="w-4 h-4 text-red-500" />;
      case "Missing":
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 overflow-x-hidden">
      <div className="bg-white  p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <ComsIcon />
          <div>
            <h2 className="text-2xl font-bold text-[#01373D]">Compliance & Accreditation</h2>
          </div>
        </div>

        {/* Upload Area + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload Document File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins-custom">Upload Document File</label>
            <div className="!border-1 border-dashed border-violet-200 bg-[#F9F8FF] rounded-lg p-8 text-center hover:border-violet-300 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16  rounded-lg flex items-center justify-center mb-4">
                <DocIcon/>
                </div>
                <p className="text-sm text-gray-600 font-poppins-custom">
                  Drag and Drop file here or{" "}
                  <button
                    onClick={() => document.getElementById('file-upload').click()}
                    className="font-medium text-gray-600 hover:text-[#00D4A8]"
                  >
                    choose file
                  </button>
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-xs text-gray-500 font-poppins-custom">Supported file Type : .pdf, .docx, .jpg, .png</span>
              <span className="text-xs text-gray-500 font-poppins-custom">Maximum Size: 25MB</span>
            </div>
          </div>

          {/* Upload Progress */}
          <div>
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins-custom">Upload Progress</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#F9F8FF] rounded-lg border border-violet-100"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <PdfIcon />
                        <span className="text-sm font-medium text-gray-900 font-poppins-custom truncate">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="h-2 w-full bg-violet-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-[#9889FF] rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{file.progress}%</span>
                        <button className="text-gray-400 hover:text-gray-600 shrink-0">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document List Table */}
        <div className="mb-8">
         
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins-custom">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-poppins-custom">
                    <div className="flex items-center gap-2">
                      <PdfIcon />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins-custom">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins-custom">
                    {doc.jurisdiction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm text-gray-900 font-poppins-custom">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-[#00F0C3] text-black rounded-lg hover:bg-[#00D4A8] transition-colors font-poppins-custom font-medium"
          >
            <SavesIcon />
            <span>Save changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAccreditation;
