import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/img/bg-images.png";
import loginLogo from "../../assets/img/loginlogo.png";
import logo from "/src/assets/img/logo.png";
import createaccount from "/src/assets/img/createaccount.svg";

import loginimg from "/src/assets/img/loginimg1.svg"; // Corrected typo: lgoinimg1 -> loginimg1
import loginimg2 from "/src/assets/img/loginimg2.svg";
import loginimg3 from "/src/assets/img/loginimg3.svg";
import bgLogo from "/src/assets/img/bg-logo.svg";

const RoleSelect = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Role selected:", selectedRole);
    
    // Save role to localStorage for SignUp page
    localStorage.setItem("tempUserData", JSON.stringify({
      role: selectedRole
    }));
    
    // Navigate to signup page
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-auto md:h-[600px] bg-white rounded-3xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex relative p-6 md:p-4 h-64 md:h-full bg-[#00000080]"
        style={{ backgroundImage: `url(${createaccount})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "#00000080" }}
        >
          {/* Purple background and content layout */}
          <div className=" w-full h-full rounded-2xl flex flex-col justify-between relative overflow-hidden p-8 ">

            {/* Logo/Branding (Top) */}
            <img src={bgLogo} alt="Login Logo" className="w-1/3 max-w-[150px] h-auto object-contain" />
            
            {/* Main Text Content (Middle - Takes up remaining space) */}
            <div className="flex flex-col items-center justify-center flex-grow ">
                <h1 className="text-[30px] font-semibold text-white font-poppins-custom">Invest Globally. <br />
                Compliantly. Confidently.</h1>
                <p className="text-white font-poppins-custom leading-tight mr-16 mt-2">Built for global accredited investors and <br />
                syndicate leads.</p>
            </div>
            

            {/* Image Content (Bottom - MOVED HERE) */}
            <div className="flex justify-start items-end w-full space-x-3 mt-7">
              <img src={loginimg} alt="Login Asset 1" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg2} alt="Login Asset 2" className="w-1/3 max-w-[50px] h-auto object-contain" />
              <img src={loginimg3} alt="Login Asset 3" className="w-1/3 max-w-[50px] h-auto object-contain" />
            </div>
            
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-6 ">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl text-[#001D21] text-semibold mb-2">Welcome to Unlocksley </h1>
              <p className="text-[#6C6C6C] text-thin text-sm font-poppins-custom">A global platform for accredited investors and syndicates. Jurisdiction-aware. Secure. Compliance-first.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
          
              <div>
                <p className="text-lg text-[#001D21] text-semibold mb-2">
                How would you like to begin?
                </p>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-row items-center w-full h-16 bg-[#F4F6F5] rounded-lg p-3 border border-[#0A2A2E]">
                    <input
                    type="radio"
                    id="investor"
                    name="role"
                    value="investor"
                    checked={selectedRole === "investor"}
                    onChange={() => handleRoleChange("investor")}
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                    <div className="flex flex-col items-start justify-center ml-3">
                                    <p className=" text-[#001D21] ">
                                        Investor
                                    </p>
                                    <p className="text-sm text-[#6C6C6C] font-poppins-custom">
                                    Access global investment opportunities
                                    </p>
                                </div>
                    </div>
                    <div className="flex flex-row items-center  w-full h-16 bg-[#F4F6F5] rounded-lg p-3 border border-[#0A2A2E]">
                    <input
                    type="radio"
                    id="syndicateLead"
                    name="role"
                    value="syndicate"
                    checked={selectedRole === "syndicate"}
                    onChange={() => handleRoleChange("syndicate")}
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                        <div className="flex flex-col items-start justify-center ml-3">
                            <p>
                                Syndicate Lead
                            </p>
                            <p className="text-sm text-[#6C6C6C] font-poppins-custom">
                            Create and manage Global oppertunities
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center opacity-50  w-full h-16 bg-[#F4F6F5] rounded-lg p-3 border border-[#0A2A2E]">
                        <input
                    type="radio"
                    id="founder"
                    name="role"
                    value="founder"
                    checked={selectedRole === "founder"}
                    onChange={() => handleRoleChange("founder")}
                    className="h-4 w-4 text-[#00FFC2] border-gray-300 rounded focus:ring-[#00FFC2]"
                  />
                  <div className="flex flex-col items-start justify-center ml-3">
                            <p className=" text-[#0A2A2E] ">
                            Founder (Coming Soon)
                            </p>
                            <p className="text-sm text-[#6C6C6C] font-poppins-custom">
                            Raise capital from global investors
                            </p>
                        </div>
                    </div>

                </div>
               
              </div>

              <button
                type="submit"
                className="w-full  bg-[#0A3A38] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#00E6B0] transition-colors duration-200 cursor-pointer"
                disabled={!selectedRole}
              >
                Continue
              </button>
              
            </form>

            {/* Resend Code Link */}
            <div className="mt-6 text-center md:text-start">
            <p className="text-[#6C6C6C] text-thin text-sm font-poppins-custom">By continuing, you accept our <Link to="/privacy-policy" className="text-[#9889FF] hover:text-[#00E6B0]  underline">Privacy Policy</Link> and <Link to="/terms-of-service" className="text-[#9889FF] hover:text-[#00E6B0]  underline">Terms of Service</Link>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
