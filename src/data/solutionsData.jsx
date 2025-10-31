// src/data/solutionsData.js
import image1 from "../assets/img/image1.png";
import image2 from "../assets/img/image2.png";
import image3 from "../assets/img/image3.png";
import image4 from "../assets/img/image4.png";

export const cards = [
  {
    id: 1,
    slug: "venture-funds",
    title: "Venture Funds",
    desc: "Raise capital, close deals, and manage your portfolio — all from a single platform.",
    img: image1,
    border: "from-[#B9A7FF] to-[#E0D7FF]",
  },
  {
    id: 2,
    slug: "syndicated",
    title: "Syndicates",
    desc: "Manage syndicates, investors and pooled investments efficiently.",
    img: image2,
    border: "from-[#C5F2C7] to-[#E9FAEA]",
  },
  {
    id: 3,
    slug: "document-handling",
    title: "Document Handling",
    desc: "Manage investor documents securely with a single organized workflow.",
    img: image3,
    border: "from-[#FFD9C0] to-[#FFEFE6]",
  },
  {
    id: 4,
    slug: "compliance",
    title: "Compliance",
    desc: "Automate compliance tasks and ensure every deal meets regulatory standards.",
    img: image4,
    border: "from-[#B9D3FF] to-[#E3EEFF]",
  },
];

export const cardDetails = {
  "venture-funds": {
    tag: "Fund Manager",
    title: "Venture Funds",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque consequat purus ut erat pellentesque, eget volutpat dolor imperdiet.",
  },
  "syndicated": {
    tag: "Fund Manager",
    title: "Syndicates",
    desc:
      "Collaborative fund management tools built for teams. Pellentesque consequat purus ut erat pellentesque.",
  },
  "document-handling": {
    tag: "Admin",
    title: "Document Handling",
    desc:
      "Secure, organized document workflows for investors and founders. Manage files, signatures and access.",
  },
  "compliance": {
    tag: "Compliance",
    title: "Compliance",
    desc:
      "Automate compliance tasks and ensure every deal meets regulatory standards.",
  },
};
