import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "Hedge Fund Partner",
    image: "/profile.png",
    text: "Creating SPVs and managing investors used to take weeks. With this platform, I launched a deal in just hours — fully tokenized, transparent, and compliant.",
  },
  {
    id: 2,
    name: "John D.",
    role: "Angel Investor",
    image: "/profile.png",
    text: "This platform streamlined my investment process and gave me confidence with compliance handled seamlessly.",
  },
  {
    id: 3,
    name: "Emily R.",
    role: "VC Partner",
    image: "/profile.png",
    text: "Super easy to onboard investors and manage funds. Love how quick everything is compared to traditional methods.",
  },
  {
    id: 4,
    name: "Michael B.",
    role: "Private Investor",
    image: "/profile.png",
    text: "Finally, a platform that combines speed with compliance. I can close deals much faster now.",
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 380;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    // ✅ Full width background wrapper
    <section>
      {/* ✅ Centered container */}
      
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <span className="bg-[#0A2A2E] text-white text-sm px-4 py-1 rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl text-[#001D21] mt-4 font-semibold">
              What Our <span className="text-[#9889FF]">Users</span> Say...
            </h2>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A2A2E] text-[#00F0C3] hover:bg-[#123b40] transition"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A2A2E] text-[#00F0C3] hover:bg-[#123b40] transition"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden scroll-smooth flex-nowrap"
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="w-[360px] flex-shrink-0 bg-white rounded-2xl min-h-[380px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full mb-4 object-cover"
                />
                <p className="text-gray-700 text-base leading-relaxed">
                  “{item.text}”
                </p>
              </div>
              <div className="mt-6">
                <p className="text-[#C07A2A] font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
     
    </section>
  );
};

export default Testimonials;
