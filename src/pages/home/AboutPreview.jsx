// import React from "react";

// const steps = [
//     { id: 1, title: "SIGN UP" },
//     { id: 2, title: "VERIFY IDENTITY" },
//     { id: 3, title: "FUND OR CREATE" },
//     { id: 4, title: "TRACK & TRADE" },
// ];

// const AboutPreview = () => {
//     return (
//         <section className="py-20 px-6 flex justify-center">
//             <div className="max-w-6xl w-full bg-[#F9F8FF] backdrop-blur-sm rounded-3xl shadow-md p-10">
//                 {/* Badge */}
//                 <span className="inline-block border border-gray-500 text-gray-800 text-sm px-4 py-1 rounded-full mb-4">
//                     Process
//                 </span>

//                 {/* Heading */}
//                 <h2 className="text-3xl md:text-4xl  text-[#001D21]">
//                     How It <span className="text-[#9889FF]">Works</span>
//                 </h2>

//                 {/* Steps Container */}
//                 <div className="mt-10 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black rounded-2xl overflow-hidden bg-white shadow-sm">
//                     {steps.map((step) => (
//                         <div
//                             key={step.id}
//                             className="p-6 flex flex-col items-center justify-center"
//                         >
//                             {/* Number */}
//                             <div className="bg-teal-400 text-black font-bold w-8 h-8 flex items-center justify-center rounded-md mb-4">
//                                 {step.id}
//                             </div>

//                             {/* Title */}
//                             <p className="font-semibold text-gray-900">{step.title}</p>
//                         </div>
//                     ))}
//                 </div>

//             </div>
//         </section>
//     );
// };

// export default AboutPreview;


import React from "react";

const steps = [
  { id: 1, title: "SIGN UP" },
  { id: 2, title: "VERIFY IDENTITY" },
  { id: 3, title: "FUND OR CREATE" },
  { id: 4, title: "TRACK & TRADE" },
];

const AboutPreview = () => {
  return (
    <section className="py-20 flex justify-center">
      <div className="w-full bg-[#F9F8FF] backdrop-blur-sm rounded-3xl shadow-md p-10">
        {/* Badge */}
        <span className="inline-block border border-gray-400 text-gray-800 text-sm px-4 py-1 rounded-full mb-4">
          Process
        </span>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl text-[#001D21]">
          How It <span className="text-[#9889FF]">Works</span>
        </h2>

        {/* Steps Container */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black rounded-2xl overflow-hidden bg-white shadow-sm">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-6 flex flex-col items-center justify-center"
            >
              {/* Number */}
              <div className="bg-[#00F0C3] text-black font-bold w-8 h-8 flex items-center justify-center rounded-md mb-4">
                {step.id}
              </div>

              {/* Title */}
              <p className="font-semibold text-gray-900">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
