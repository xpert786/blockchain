// import React, { useRef } from "react";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { ErroIcon } from "../../components/Icons";

// const SolutionsCards = () => {
//   const scrollRef = useRef(null);

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = 400;
//       scrollRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   const cards = [
//     {
//       id: 1,
//       title: "Venture Funds",
//       desc: "Raise capital, close deals, and manage your portfolio — all from a single platform.",
//       img: "/image1.png",
//       border: "from-[#B9A7FF] to-[#E0D7FF]",
//     },
//     {
//       id: 2,
//       title: "Syndicates",
//       desc: "Raise capital, close deals, and manage your portfolio — all from a single platform.",
//       img: "/image2.png",
//       border: "from-[#C5F2C7] to-[#E9FAEA]",
//     },
//     {
//       id: 3,
//       title: "Document Handling",
//       desc: "Manage investor documents securely with a single organized workflow.",
//       img: "/image3.png",
//       border: "from-[#FFD9C0] to-[#FFEFE6]",
//     },
//     {
//       id: 4,
//       title: "Compliance",
//       desc: "Automate compliance tasks and ensure every deal meets regulatory standards.",
//       img: "/image4.png",
//       border: "from-[#B9D3FF] to-[#E3EEFF]",
//     },
//   ];

//   return (
//     <section className="">
//       {/* Top Section */}
//       <div className="flex justify-between items-center mb-6">
//         <span className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
//           Core Features
//         </span>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => scroll("left")}
//             className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition"
//           >
//             <FaArrowLeft size={16} />
//           </button>
//           <button
//             onClick={() => scroll("right")}
//             className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition"
//           >
//             <FaArrowRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Heading */}
//       <h2 className="text-center md:text-left text-3xl md:text-4xl font-semibold text-[#001D21] mb-10">
//         Everything You{" "}
//         <span className="bg-[#B36DA2] bg-clip-text text-transparent">Need</span>
//         , Nothing You Don’t
//       </h2>

//       {/* Cards */}
//       <div className="relative">
//         <div
//           ref={scrollRef}
//           className="
//             flex gap-6 
//             overflow-x-auto scroll-smooth no-scrollbar 
//             pb-4 
//             snap-x snap-mandatory 
//             pl-1
//           "
//         >
//    {cards.map((card) => (
//   <div
//     key={card.id}
//     onClick={() => navigate(`/our-solutions/${card.title.toLowerCase().replace(/\s+/g, "-")}`)}
//     className={`cursor-pointer snap-start flex-shrink-0 w-[31%] min-w-[31%] md:w-[31%] lg:w-[31%] h-[492px] bg-gradient-to-b ${card.border} p-[3px] rounded-[28px] hover:scale-[1.02] transition-transform duration-300`}
//   >
//     <div className="relative bg-white rounded-[26px] overflow-hidden h-full shadow-md flex flex-col justify-end">
//       {/* Image */}
//       <div className="absolute inset-0">
//         <img
//           src={card.img}
//           alt={card.title}
//           className="w-full h-full object-cover object-center"
//         />
//       </div>

//       {/* White overlay box */}
//       <div className="relative z-10 mx-4 mb-4 bg-white rounded-[20px] p-5 shadow-md">
//         <h3 className="font-semibold text-lg text-[#001D21] mb-2">
//           {card.title}
//         </h3>
//         <p className="text-[#001D21] text-sm leading-relaxed mb-4">
//           {card.desc}
//         </p>
//         <button className="w-8 h-8 flex items-center justify-center bg-[#0A2A2E] text-white rounded-full hover:bg-[#00393F] transition">
//           <ErroIcon />
//         </button>
//       </div>

//       {/* Gradient fade */}
//       <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
//     </div>
//   </div>
// ))}

//         </div>
//       </div>

    
//     </section>
//   );
// };

// export default SolutionsCards;


import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { cards } from "../../data/solutionsData"; // central data
import { ErroIcon } from "../../components/Icons"; // agar nahi hai toh hata do

const SolutionsCards = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
          Core Features
        </span>

        <div className="flex items-center gap-3">
          <button onClick={() => scroll("left")} className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer">
            <FaArrowLeft size={16} />
          </button>
          <button onClick={() => scroll("right")} className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer">
            <FaArrowRight size={16} />
          </button>
        </div>
      </div>

      <h2 className="text-center md:text-left text-3xl md:text-4xl font-semibold text-[#001D21] mb-10">
        Everything You <span className="bg-[#B36DA2] bg-clip-text text-transparent">Need</span>, Nothing You Don’t
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4 snap-x snap-mandatory pl-1"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(`/our-solutions/${card.slug}`)}
              className={`cursor-pointer snap-start flex-shrink-0 w-[31%] min-w-[31%] md:w-[31%] lg:w-[31%] h-[492px] bg-gradient-to-b ${card.border} p-[3px] rounded-[28px]`}
            >
              <div className="relative bg-white rounded-[26px] overflow-hidden h-full shadow-md flex flex-col justify-end">
                <div className="absolute inset-0">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover object-center" />
                </div>

                <div className="relative z-10 mx-4 mb-4 bg-white rounded-[20px] p-5 shadow-md">
                  <h3 className="font-semibold text-lg text-[#001D21] mb-2">{card.title}</h3>
                  <p className="text-[#001D21] text-sm leading-relaxed mb-4">{card.desc}</p>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#0A2A2E] text-white rounded-full hover:bg-[#00393F] transition cursor-pointer">
                    <ErroIcon />
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsCards;
