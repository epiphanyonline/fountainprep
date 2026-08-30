export type BiographyRegion =
  | "Africa"
  | "North America"
  | "Europe"
  | "Asia";

export type BiographyStatus =
  | "available"
  | "in-development"
  | "coming-soon";

export type BiographyLibraryEntry = {
  id: string;

  subject:
    string;

  country:
    string;

  countryCode:
    string;

  region:
    BiographyRegion;

  title:
    string;

  subtitle:
    string;

  wealthEngine:
    string;

  themes:
    string[];

  assetFolder:
    string;

  lessonId:
    string;

  status:
    BiographyStatus;

  order:
    number;
};

export const biographyLibrary:
  BiographyLibraryEntry[] = [
  {
    id:
      "aliko-dangote",

    subject:
      "Aliko Dangote",

    country:
      "Nigeria",

    countryCode:
      "NG",

    region:
      "Africa",

    title:
      "Aliko Dangote",

    subtitle:
      "From Trading to Industrial Ownership",

    wealthEngine:
      "Trading, manufacturing and industrial ownership",

    themes: [
      "Trading",
      "Manufacturing",
      "Ownership",
      "Industrial Scale",
      "Capital Allocation",
      "Concentration",
      "Risk",
    ],

    assetFolder:
      "dangote",

    lessonId:
      "greatness-foundation-dangote",

    status:
      "available",

    order: 1,
  },

  {
    id:
      "warren-buffett",

    subject:
      "Warren Buffett",

    country:
      "United States",

    countryCode:
      "US",

    region:
      "North America",

    title:
      "Warren Buffett",

    subtitle:
      "Compounding, Ownership and Capital Allocation",

    wealthEngine:
      "Business ownership, insurance float and long-term investing",

    themes: [
      "Early Enterprise",
      "Value Investing",
      "Partnership Capital",
      "Insurance Float",
      "Business Quality",
      "Compounding",
      "Capital Allocation",
      "Succession",
    ],

    assetFolder:
      "buffett",

    lessonId:
      "greatness-foundation-buffett",

    status:
      "in-development",

    order: 2,
  },

  {
    id:
      "jeff-bezos",

    subject:
      "Jeff Bezos",

    country:
      "United States",

    countryCode:
      "US",

    region:
      "North America",

    title:
      "Jeff Bezos",

    subtitle:
      "Reinvestment, Scale and Long-Term Ownership",

    wealthEngine:
      "Founder equity and long-duration business building",

    themes: [
      "Entrepreneurship",
      "Founder Equity",
      "Reinvestment",
      "Customer Focus",
      "Scale",
      "Technology",
      "Long-Term Ownership",
      "Diversification",
    ],

    assetFolder:
      "bezos",

    lessonId:
      "greatness-foundation-bezos",

    status:
      "in-development",

    order: 3,
  },

  {
    id:
      "bernard-arnault",

    subject:
      "Bernard Arnault",

    country:
      "France",

    countryCode:
      "FR",

    region:
      "Europe",

    title:
      "Bernard Arnault",

    subtitle:
      "Luxury, Brands and Controlling Equity",

    wealthEngine:
      "Brand ownership, acquisitions and controlling stakes",

    themes: [
      "Luxury",
      "Brands",
      "Acquisitions",
      "Control",
      "Portfolio Building",
      "Pricing Power",
      "Ownership",
      "Succession",
    ],

    assetFolder:
      "arnault",

    lessonId:
      "greatness-foundation-arnault",

    status:
      "in-development",

    order: 4,
  },

  {
    id:
      "mukesh-ambani",

    subject:
      "Mukesh Ambani",

    country:
      "India",

    countryCode:
      "IN",

    region:
      "Asia",

    title:
      "Mukesh Ambani",

    subtitle:
      "Family Enterprise, Infrastructure and Scale",

    wealthEngine:
      "Controlling business ownership across major industries",

    themes: [
      "Family Enterprise",
      "Energy",
      "Telecommunications",
      "Retail",
      "Infrastructure",
      "Capital Expenditure",
      "Ownership",
      "Succession",
    ],

    assetFolder:
      "ambani",

    lessonId:
      "greatness-foundation-ambani",

    status:
      "in-development",

    order: 5,
  },

  {
    id:
      "amancio-ortega",

    subject:
      "Amancio Ortega",

    country:
      "Spain",

    countryCode:
      "ES",

    region:
      "Europe",

    title:
      "Amancio Ortega",

    subtitle:
      "Retail, Ownership and Real Estate",

    wealthEngine:
      "Retail ownership combined with significant property investment",

    themes: [
      "Retail",
      "Operations",
      "Supply Chain",
      "Founder Equity",
      "Scale",
      "Real Estate",
      "Diversification",
      "Ownership",
    ],

    assetFolder:
      "ortega",

    lessonId:
      "greatness-foundation-ortega",

    status:
      "in-development",

    order: 6,
  },

  {
    id:
      "jensen-huang",

    subject:
      "Jensen Huang",

    country:
      "United States",

    countryCode:
      "US",

    region:
      "North America",

    title:
      "Jensen Huang",

    subtitle:
      "Technology, Founder Equity and Long-Term Company Building",

    wealthEngine:
      "Founder ownership in a technology company built over decades",

    themes: [
      "Semiconductors",
      "Founder Equity",
      "Technology",
      "Innovation",
      "Long-Term Ownership",
      "Concentration",
      "Scale",
      "Risk",
    ],

    assetFolder:
      "huang",

    lessonId:
      "greatness-foundation-huang",

    status:
      "in-development",

    order: 7,
  },

  {
    id:
      "carlos-slim",

    subject:
      "Carlos Slim",

    country:
      "Mexico",

    countryCode:
      "MX",

    region:
      "North America",

    title:
      "Carlos Slim",

    subtitle:
      "Acquisitions, Telecom and Diversified Ownership",

    wealthEngine:
      "Business acquisitions and concentrated corporate ownership",

    themes: [
      "Acquisitions",
      "Telecommunications",
      "Distressed Assets",
      "Conglomerates",
      "Ownership",
      "Cash Flow",
      "Capital Allocation",
      "Diversification",
    ],

    assetFolder:
      "slim",

    lessonId:
      "greatness-foundation-slim",

    status:
      "in-development",

    order: 8,
  },

  {
    id:
      "zhang-yiming",

    subject:
      "Zhang Yiming",

    country:
      "China",

    countryCode:
      "CN",

    region:
      "Asia",

    title:
      "Zhang Yiming",

    subtitle:
      "Technology, Private Equity and Global Scale",

    wealthEngine:
      "Founder ownership in a large private technology company",

    themes: [
      "Technology",
      "Founder Equity",
      "Private Companies",
      "Algorithms",
      "Scale",
      "Global Markets",
      "Concentration",
      "Governance",
    ],

    assetFolder:
      "zhang",

    lessonId:
      "greatness-foundation-zhang",

    status:
      "in-development",

    order: 9,
  },

  {
    id:
      "patrice-motsepe",

    subject:
      "Patrice Motsepe",

    country:
      "South Africa",

    countryCode:
      "ZA",

    region:
      "Africa",

    title:
      "Patrice Motsepe",

    subtitle:
      "Mining, Resources and Ownership",

    wealthEngine:
      "Resource businesses, mining ownership and investment",

    themes: [
      "Mining",
      "Natural Resources",
      "Ownership",
      "Acquisitions",
      "Commodity Cycles",
      "Risk",
      "Diversification",
      "Philanthropy",
    ],

    assetFolder:
      "motsepe",

    lessonId:
      "greatness-foundation-motsepe",

    status:
      "in-development",

    order: 10,
  },

  {
    id:
      "james-dyson",

    subject:
      "James Dyson",

    country:
      "United Kingdom",

    countryCode:
      "GB",

    region:
      "Europe",

    title:
      "James Dyson",

    subtitle:
      "Invention, Intellectual Property and Private Ownership",

    wealthEngine:
      "Product innovation, intellectual property and private business ownership",

    themes: [
      "Invention",
      "Prototyping",
      "Failure",
      "Intellectual Property",
      "Manufacturing",
      "Private Ownership",
      "Persistence",
      "Capital at Risk",
    ],

    assetFolder:
      "dyson",

    lessonId:
      "greatness-foundation-dyson",

    status:
      "in-development",

    order: 11,
  },
];

export function getBiographyById(
  id: string,
) {
  return biographyLibrary.find(
    (entry) =>
      entry.id === id,
  );
}

export function getBiographiesByRegion(
  region: BiographyRegion,
) {
  return biographyLibrary
    .filter(
      (entry) =>
        entry.region === region,
    )
    .sort(
      (a, b) =>
        a.order - b.order,
    );
}

export const availableBiographies =
  biographyLibrary.filter(
    (entry) =>
      entry.status === "available",
  );

export const developingBiographies =
  biographyLibrary.filter(
    (entry) =>
      entry.status ===
      "in-development",
  );