import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

const Header = () => {
    const [activeTab, setActiveTab] = useState("syndicate");
    const navigate = useNavigate();



    return (
        <header
            className="
        fixed top-4 left-1/2 -translate-x-1/2
        w-[95%] sm:w-[94%] md:w-[93%] lg:w-[92%] xl:w-[95%] 2xl:w-[98%]
        bg-[#0A2A2E]/90 backdrop-blur-md
        px-6 py-3 flex justify-between items-center
        shadow-lg rounded-xl z-50
      "
        >
            {/* Left Logo + Tabs */}
            <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src={getImageUrl("/logo.png")}
                        alt="Unlocksley Logo"
                        className="h-15 w-15 md:h-16 md:w-15 lg:h-15 lg:w-15"
                    />
                </div>

                {/* Tabs Box */}
                <div className="flex border border-gray-400 rounded-lg p-1 bg-[#0A2A2E]">
                    <button
                        onClick={() => setActiveTab("syndicate")}
                        className={`px-4 py-1 font-medium rounded-md transition ${activeTab === "syndicate"
                            ? "bg-white text-black"
                            : "text-white"
                            }`}
                    >
                        Syndicate
                    </button>
                    <button
                        onClick={() => setActiveTab("invester")}
                        className={`px-4 py-1 font-medium rounded-md transition ${activeTab === "invester"
                            ? "bg-white text-black"
                            : "text-white"
                            }`}
                    >
                        Invester
                    </button>
                </div>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center gap-3">
                <Link
                    to="/login"
                    className="border border-white text-white px-4 py-1 rounded-lg text-sm md:text-base font-medium hover:bg-white/10 transition"
                >
                    Log In
                </Link>
                <Link
                    to="/demo"
                    className="bg-[#F2E0C9] text-black px-4 py-1 rounded-lg text-sm md:text-base font-medium hover:bg-[#d9c39f] transition"
                >
                    Request a Demo
                </Link>
            </div>
        </header>
    );
};

export default Header;

