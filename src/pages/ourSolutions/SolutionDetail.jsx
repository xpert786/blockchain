
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { cardDetails } from "../../data/solutionsData";

const SolutionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = cardDetails[slug];

  if (!data) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <Link
          to="/our-solutions"
          className="text-blue-600 underline mt-4 block"
        >
          Back to Our Solutions
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#02121B] text-white px-6 py-28 sm:py-32 md:py-40 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
        {/* LEFT CONTENT */}
        <div className="flex-1 max-w-xl">
          <span className="inline-block text-[10px] sm:text-[11px] tracking-wide text-[#DCF3E2] bg-[#072028] px-3 py-1 rounded-full mb-5">
            {data.tag}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-snug mb-4">
            {data.title.split(" ")[0]}{" "}
            <span className="text-[#B5A7FF]">
              {data.title.split(" ")[1] || ""}
            </span>
          </h1>

          <p className="text-white text-sm sm:text-base mb-8 leading-relaxed">
            {data.desc}
          </p>

          <button
            onClick={() => navigate("/our-solutions/contact-sales")}
            className="w-full sm:w-auto bg-[#00F0C3] hover:bg-[#00af95] transition text-[#0A2A2E] font-medium text-sm px-6 py-3 rounded-md cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT SIDE (Animation Box Placeholder) */}
        <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] bg-[#072028] flex justify-center items-center rounded-lg">
          <p className="text-[#FFFFFF] font-semibold text-2xl sm:text-[30px]">
            Animations Box
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionDetail;
