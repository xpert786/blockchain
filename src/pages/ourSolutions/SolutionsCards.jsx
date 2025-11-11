
import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { cards } from "../../data/solutionsData"; 
import { ErroIcon } from "../../components/Icons"; 

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
    <section className="sm:px-0">
      <div className="flex flex-col gap-4 ml-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <span className="w-fit text-xs sm:text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
          Core Features
        </span>

        <div className="flex items-center mr-3 gap-3 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer"
          >
            <FaArrowLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer"
          >
            <FaArrowRight size={16} />
          </button>
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer"
              aria-label="Scroll left"
            >
              <FaArrowLeft size={14} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-[#0A2A2E] text-[#00F0C3] p-2 rounded-full hover:opacity-80 transition cursor-pointer"
              aria-label="Scroll right"
            >
              <FaArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-center md:text-left text-3xl md:text-4xl font-semibold text-[#001D21] mb-10">
        Everything You <span className="bg-[#B36DA2] bg-clip-text text-transparent">Need</span>, Nothing You Don’t
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(`/our-solutions/${card.slug}`)}
              className={`cursor-pointer snap-start flex-shrink-0 w-[85%] sm:w-[320px] md:w-[31%] lg:w-[31%] h-[460px] sm:h-[492px] bg-gradient-to-b ${card.border} p-[3px] rounded-[28px]`}
            >
              <div className="relative bg-white rounded-[26px] overflow-hidden h-full flex flex-col justify-end">
                <div className="absolute inset-0">
                  <img src={card.img} alt={card.title} className="h-full w-full object-cover object-center" />
                </div>

                <div className="relative z-10 mx-4 mb-4 bg-white rounded-[20px] p-5 shadow-md">
                  <h3 className="font-semibold text-base sm:text-lg text-[#001D21] mb-2">{card.title}</h3>
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
