
import React from "react";

const SolutionsScrollView = () => {
    const cards = [
        {
            title: "Admin Dashboard",
            desc: "Oversee the platform and ensure compliance.",
            color: "bg-[#CAE6FF]",
            features: [
                "System-Wide Activity View",
                "KYC Management",
                "Lorem Ipsum",
                "Export & Reporting Tools",
            ],
        },
        {
            title: "Syndicate Manager Dashboard",
            desc: "Manage deals, investors, and token issuance efficiently.",
            color: "bg-[#E2F0DC]",
            features: [
                "View & Manage SPVs",
                "Investor Participation",
                "Trigger Token Minting",
                "Approve Transfers",
            ],
        },
        {
            title: "Investor Dashboard",
            desc: "Track your investments and stay informed.",
            color: "bg-[#D7F8F0]",
            features: [
                "Browse Available SPVs",
                "Investment Status",
                "KYC Completion",
                "Notifications & Documents",
            ],
        },
        {
            title: "Compliance Dashboard",
            desc: "Ensure all activities follow regulations.",
            color: "bg-[#FFE8CC]",
            features: [
                "Audit Trail Review",
                "Document Verification",
                "AML Reports",
                "System Alerts",
            ],
        },
    ];

    return (
        <section className="flex justify-center">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 w-full max-w-7xl px-6">


                <div className="md:w-1/2 lg:w-2/5">
                    <span className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
                        Our Dashboards
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold leading-snug mb-3">
                        A <span className="text-[#9889FF]">Unified </span><br />
                        <span className="text-[#9889FF]">Dashboard</span> Experience <br /> For Every Role
                    </h2>
                    <p className="leading-relaxed text-[#0A2A2E]">
                        Our tailored dashboards empower Admins, Syndicated Managers, and Investors
                        with the tools they need to operate efficiently and stay informed.
                    </p>
                </div>


                {/* RIGHT SIDE: SCROLLABLE CARDS */}
                <div
                    className="
            md:w-1/2 lg:w-3/5 
            h-[85vh] 
            overflow-y-auto 
            scroll-smooth 
            pr-2 md:pr-4 
            custom-scrollbar
          "
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#BDBDBD transparent",
                    }}
                >
                    <div className="flex flex-col gap-8 pb-[10vh]">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`
                  rounded-2xl shadow-md ${card.color} 
                  p-6 md:p-10 
                  transition-all hover:shadow-lg
                  flex-shrink-0
                `}
                            >
                                <h3 className="text-2xl font-semibold mb-2">{card.title}</h3>
                                <p className="text-gray-600 mb-6">{card.desc}</p>

                                <div className="bg-white rounded-2xl shadow-inner p-5 md:p-6">
                                    <ul className="space-y-4">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-700 font-medium">
                                                <span className="bg-[#00F0C3] text-[#0A2A2E] w-7 h-7 flex items-center justify-center rounded-[10px] text-sm font-semibold mr-3">
                                                    {i + 1}
                                                </span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <button className="bg-[#00F0C3] text-[#0A2A2E] px-6 py-2 rounded-lg font-medium hover:opacity-80 transition cursor-pointer">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SolutionsScrollView;


