export const taxSummaryCards = [
  {
    id: "total-income",
    title: "Total Income",
    value: "$45,750",
    caption: "From investments",
    captionColor: "#22C55E",
    background: "#CAE6FF",
    border: "0.5px solid #AED9FF"
  },
  {
    id: "total-deductions",
    title: "Total Deductions",
    value: "$8,200",
    caption: "Investment expenses",
    captionColor: "#001D21",
    background: "#D7F8F0",
    border: "0.5px solid #AEFFEB"
  },
  {
    id: "net-taxable-income",
    title: "Net Taxable Income",
    value: "$37,550",
    caption: "After deductions",
    captionColor: "#001D21",
    background: "#E2E2FB",
    border: "0.5px solid #CFCFFF"
  },
  {
    id: "estimated-tax",
    title: "Estimated Tax",
    value: "$11,265",
    caption: "Approximate liability",
    captionColor: "#001D21",
    background: "#FFEFE8",
    border: "0.5px solid #FFDFD0"
  }
];

export const taxDocumentsList = [
  {
    id: "techck-1",
    documentTitle: "TechCK-1 - TechCorp Series C SPVorp Series C",
    taxYear: "Tax Year 2023",
    issueDate: "2024-03-15",
    status: "Available",
    size: "2.4 MB",
    investmentName: "TechCorp Series C SPV",
    company: "TechCorp Inc. • Enterprise Software",
    stage: "Series C",
    valuation: "$250M",
    expectedReturns: "3-5x",
    timeline: "5-7 Years",
    fundingProgress: 65,
    fundingRaised: "$32.5M",
    fundingTarget: "$50M",
    documents: [
      { title: "Investment Memorandum", size: "PDF • 2.4 MB" },
      { title: "Financial Statements", size: "PDF • 2.4 MB" },
      { title: "Due Diligence Report", size: "PDF • 3.2 MB" }
    ]
  },
  {
    id: "1099-div-greenenergy",
    documentTitle: "1099-DIV - GreenEnergy Fund III",
    taxYear: "Tax Year 2023",
    issueDate: "2024-02-28",
    status: "Available",
    size: "1.8 MB",
    investmentName: "GreenEnergy Fund III",
    company: "GreenEnergy Partners • Renewable Energy",
    stage: "Series B",
    valuation: "$180M",
    expectedReturns: "2-4x",
    timeline: "4-6 Years",
    fundingProgress: 58,
    fundingRaised: "$18M",
    fundingTarget: "$30M",
    documents: [
      { title: "Distribution Summary", size: "PDF • 1.4 MB" },
      { title: "Fund Performance Overview", size: "PDF • 2.1 MB" }
    ]
  },
  {
    id: "k1-healthtech",
    documentTitle: "K-1 - HealthTech Syndicate",
    taxYear: "Tax Year 2023",
    issueDate: "Expected 2024-04-15",
    status: "Pending",
    size: "—",
    investmentName: "HealthTech Syndicate",
    company: "HealthTech Labs • Digital Health",
    stage: "Series A",
    valuation: "$120M",
    expectedReturns: "4-7x",
    timeline: "6-8 Years",
    fundingProgress: 47,
    fundingRaised: "$9.4M",
    fundingTarget: "$20M",
    documents: [
      { title: "Projected K-1 Tax Package", size: "Expected 2024-04-15" },
      { title: "Syndicate Overview", size: "PDF • 1.9 MB" }
    ]
  }
];

export const incomeBreakdown = {
  title: "Income Breakdown",
  totalLabel: "Total Income",
  totalValue: "$45,750",
  items: [
    { label: "Dividend Income", value: "$28,500" },
    { label: "Capital Gains", value: "$15,750" },
    { label: "Interest Income", value: "$1,500" }
  ]
};

export const deductionsBreakdown = {
  title: "Deductions Breakdown",
  totalLabel: "Total Deductions",
  totalValue: "$8,200",
  items: [
    { label: "Management Fees", value: "$4,800" },
    { label: "Professional Services", value: "$2,200" },
    { label: "Other Expenses", value: "$1,200" }
  ]
};

export const taxPlanningTips = [
  {
    title: "Harvest Tax Losses",
    description: "Consider selling underperforming investments to offset gains.",
    background: "#EFF6FF",
    border: "1px solid #D1D5DB80",
    textColor: "#1C398E",
    descriptionColor: "#1447E6"
  },
  {
    title: "Maximize Deductions",
    description: "Track all investment-related expenses for deductions.",
    background: "#F0FDF4",
    border: "1px solid #D1FADF",
    textColor: "#0D542B",
    descriptionColor: "#008236"
  },
  {
    title: "Retirement Accounts",
    description: "Consider tax-advantaged retirement account investments.",
    background: "#FEFCE8",
    border: "1px solid #D1D5DB809",
    textColor: "#733E0A",
    descriptionColor: "#A65F00"
  }
];

export const taxImportantDates = [
  { title: "Q1 Estimated Tax Due", date: "April 15, 2024" },
  { title: "K-1 Deadline", date: "March 15, 2024" },
  { title: "Tax Filing Deadline", date: "April 15, 2024" }
];

export const taxCenterTabs = ["Tax Document", "Tax Summary", "Tax Planning"];

