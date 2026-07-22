/** Wealth Academy one-year curriculum blueprint. Safe to add: not imported yet. */
export type WealthAccessTier = "free" | "foundation" | "premium" | "professional";
export type WealthAssessment = "quiz" | "case-study" | "project" | "term-assessment";
export interface WealthModulePlan { id:string; moduleNumber:number; title:string; outcome:string; estimatedMinutes:number; accessTier:WealthAccessTier; assessment?:WealthAssessment; }
export interface WealthUnitPlan { id:string; unitNumber:number; title:string; description:string; modules:WealthModulePlan[]; }
export interface WealthTermPlan { id:string; termNumber:number; title:string; theme:string; certificateTitle:string; units:WealthUnitPlan[]; }
export interface WealthYearPlan { id:string; academyId:"wealth"; title:string; subtitle:string; durationMonths:number; terms:WealthTermPlan[]; capstone:{ title:string; description:string; deliverables:string[]; }; }

export const wealthAcademyYearPlan: WealthYearPlan = {
  "id": "wealth-academy-year-one",
  "academyId": "wealth",
  "title": "Wealth Foundations and Asset Building",
  "subtitle": "A one-year practical journey from money confidence to long-term wealth strategy.",
  "durationMonths": 12,
  "terms": [
    {
      "id": "wealth-term-1",
      "termNumber": 1,
      "title": "Money Foundations",
      "theme": "Money Foundations",
      "certificateTitle": "Certificate in Money Foundations",
      "units": [
        {
          "id": "wealth-unit-1",
          "unitNumber": 1,
          "title": "Money, Value and Choice",
          "description": "Develop practical knowledge and decision-making in money, value and choice.",
          "modules": [
            {
              "id": "wealth-1-1",
              "moduleNumber": 1,
              "title": "What Money Really Is",
              "outcome": "Demonstrate practical understanding of what money really is.",
              "estimatedMinutes": 20,
              "accessTier": "free"
            },
            {
              "id": "wealth-1-2",
              "moduleNumber": 2,
              "title": "Needs, Wants and Trade-offs",
              "outcome": "Demonstrate practical understanding of needs, wants and trade-offs.",
              "estimatedMinutes": 20,
              "accessTier": "free"
            },
            {
              "id": "wealth-1-3",
              "moduleNumber": 3,
              "title": "Values and Financial Identity",
              "outcome": "Demonstrate practical understanding of values and financial identity.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-1-4",
              "moduleNumber": 4,
              "title": "Decision Frameworks",
              "outcome": "Demonstrate practical understanding of decision frameworks.",
              "estimatedMinutes": 35,
              "accessTier": "foundation"
            }
          ]
        },
        {
          "id": "wealth-unit-2",
          "unitNumber": 2,
          "title": "Cash Flow and Budgeting",
          "description": "Develop practical knowledge and decision-making in cash flow and budgeting.",
          "modules": [
            {
              "id": "wealth-2-1",
              "moduleNumber": 5,
              "title": "Income and Cash Flow",
              "outcome": "Demonstrate practical understanding of income and cash flow.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-2-2",
              "moduleNumber": 6,
              "title": "Build a Working Budget",
              "outcome": "Demonstrate practical understanding of build a working budget.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-2-3",
              "moduleNumber": 7,
              "title": "Pay Yourself First",
              "outcome": "Demonstrate practical understanding of pay yourself first.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-2-4",
              "moduleNumber": 8,
              "title": "Budget Repair Case Study",
              "outcome": "Demonstrate practical understanding of budget repair case study.",
              "estimatedMinutes": 35,
              "accessTier": "foundation",
              "assessment": "case-study"
            }
          ]
        },
        {
          "id": "wealth-unit-3",
          "unitNumber": 3,
          "title": "Safety, Debt and Financial Resilience",
          "description": "Develop practical knowledge and decision-making in safety, debt and financial resilience.",
          "modules": [
            {
              "id": "wealth-3-1",
              "moduleNumber": 9,
              "title": "Emergency Funds",
              "outcome": "Demonstrate practical understanding of emergency funds.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-3-2",
              "moduleNumber": 10,
              "title": "Interest and the Cost of Borrowing",
              "outcome": "Demonstrate practical understanding of interest and the cost of borrowing.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-3-3",
              "moduleNumber": 11,
              "title": "Debt Repayment Strategies",
              "outcome": "Demonstrate practical understanding of debt repayment strategies.",
              "estimatedMinutes": 20,
              "accessTier": "foundation"
            },
            {
              "id": "wealth-3-4",
              "moduleNumber": 12,
              "title": "Term One Financial Reset",
              "outcome": "Demonstrate practical understanding of term one financial reset.",
              "estimatedMinutes": 35,
              "accessTier": "foundation",
              "assessment": "term-assessment"
            }
          ]
        }
      ]
    },
    {
      "id": "wealth-term-2",
      "termNumber": 2,
      "title": "Income and Asset Creation",
      "theme": "Income and Asset Creation",
      "certificateTitle": "Certificate in Income and Asset Creation",
      "units": [
        {
          "id": "wealth-unit-4",
          "unitNumber": 4,
          "title": "Skills and Human Capital",
          "description": "Develop practical knowledge and decision-making in skills and human capital.",
          "modules": [
            {
              "id": "wealth-4-1",
              "moduleNumber": 13,
              "title": "Your First Asset Is You",
              "outcome": "Demonstrate practical understanding of your first asset is you.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-4-2",
              "moduleNumber": 14,
              "title": "High-Value Skills",
              "outcome": "Demonstrate practical understanding of high-value skills.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-4-3",
              "moduleNumber": 15,
              "title": "Learning Return on Investment",
              "outcome": "Demonstrate practical understanding of learning return on investment.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-4-4",
              "moduleNumber": 16,
              "title": "Personal Capability Plan",
              "outcome": "Demonstrate practical understanding of personal capability plan.",
              "estimatedMinutes": 35,
              "accessTier": "premium",
              "assessment": "project"
            }
          ]
        },
        {
          "id": "wealth-unit-5",
          "unitNumber": 5,
          "title": "Entrepreneurship and Business Systems",
          "description": "Develop practical knowledge and decision-making in entrepreneurship and business systems.",
          "modules": [
            {
              "id": "wealth-5-1",
              "moduleNumber": 17,
              "title": "Problems, Customers and Value",
              "outcome": "Demonstrate practical understanding of problems, customers and value.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-5-2",
              "moduleNumber": 18,
              "title": "Revenue, Cost and Profit",
              "outcome": "Demonstrate practical understanding of revenue, cost and profit.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-5-3",
              "moduleNumber": 19,
              "title": "Systems That Work Without You",
              "outcome": "Demonstrate practical understanding of systems that work without you.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-5-4",
              "moduleNumber": 20,
              "title": "Founder-Independent Business Case",
              "outcome": "Demonstrate practical understanding of founder-independent business case.",
              "estimatedMinutes": 35,
              "accessTier": "premium",
              "assessment": "case-study"
            }
          ]
        },
        {
          "id": "wealth-unit-6",
          "unitNumber": 6,
          "title": "Intellectual Property and Personal Brand",
          "description": "Develop practical knowledge and decision-making in intellectual property and personal brand.",
          "modules": [
            {
              "id": "wealth-6-1",
              "moduleNumber": 21,
              "title": "Ideas as Assets",
              "outcome": "Demonstrate practical understanding of ideas as assets.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-6-2",
              "moduleNumber": 22,
              "title": "Personal Brand and Reputation",
              "outcome": "Demonstrate practical understanding of personal brand and reputation.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-6-3",
              "moduleNumber": 23,
              "title": "Audience and Distribution",
              "outcome": "Demonstrate practical understanding of audience and distribution.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-6-4",
              "moduleNumber": 24,
              "title": "Term Two Asset Map",
              "outcome": "Demonstrate practical understanding of term two asset map.",
              "estimatedMinutes": 35,
              "accessTier": "premium",
              "assessment": "term-assessment"
            }
          ]
        }
      ]
    },
    {
      "id": "wealth-term-3",
      "termNumber": 3,
      "title": "Investing and Portfolio Building",
      "theme": "Investing and Portfolio Building",
      "certificateTitle": "Certificate in Investing and Portfolio Building",
      "units": [
        {
          "id": "wealth-unit-7",
          "unitNumber": 7,
          "title": "Investment Principles",
          "description": "Develop practical knowledge and decision-making in investment principles.",
          "modules": [
            {
              "id": "wealth-7-1",
              "moduleNumber": 25,
              "title": "Risk, Return and Time",
              "outcome": "Demonstrate practical understanding of risk, return and time.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-7-2",
              "moduleNumber": 26,
              "title": "Compounding and Inflation",
              "outcome": "Demonstrate practical understanding of compounding and inflation.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-7-3",
              "moduleNumber": 27,
              "title": "Liquidity and Volatility",
              "outcome": "Demonstrate practical understanding of liquidity and volatility.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-7-4",
              "moduleNumber": 28,
              "title": "Investment Suitability Quiz",
              "outcome": "Demonstrate practical understanding of investment suitability quiz.",
              "estimatedMinutes": 35,
              "accessTier": "premium"
            }
          ]
        },
        {
          "id": "wealth-unit-8",
          "unitNumber": 8,
          "title": "Cash, Bills and Bonds",
          "description": "Develop practical knowledge and decision-making in cash, bills and bonds.",
          "modules": [
            {
              "id": "wealth-8-1",
              "moduleNumber": 29,
              "title": "Cash and Money Markets",
              "outcome": "Demonstrate practical understanding of cash and money markets.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-8-2",
              "moduleNumber": 30,
              "title": "Treasury Bills",
              "outcome": "Demonstrate practical understanding of treasury bills.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-8-3",
              "moduleNumber": 31,
              "title": "Government and Corporate Bonds",
              "outcome": "Demonstrate practical understanding of government and corporate bonds.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-8-4",
              "moduleNumber": 32,
              "title": "Fixed-Income Allocation Case",
              "outcome": "Demonstrate practical understanding of fixed-income allocation case.",
              "estimatedMinutes": 35,
              "accessTier": "premium",
              "assessment": "case-study"
            }
          ]
        },
        {
          "id": "wealth-unit-9",
          "unitNumber": 9,
          "title": "Equities, Funds and Property",
          "description": "Develop practical knowledge and decision-making in equities, funds and property.",
          "modules": [
            {
              "id": "wealth-9-1",
              "moduleNumber": 33,
              "title": "How Shares Create Wealth",
              "outcome": "Demonstrate practical understanding of how shares create wealth.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-9-2",
              "moduleNumber": 34,
              "title": "Index Funds and ETFs",
              "outcome": "Demonstrate practical understanding of index funds and etfs.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-9-3",
              "moduleNumber": 35,
              "title": "Property and REITs",
              "outcome": "Demonstrate practical understanding of property and reits.",
              "estimatedMinutes": 20,
              "accessTier": "premium"
            },
            {
              "id": "wealth-9-4",
              "moduleNumber": 36,
              "title": "Term Three Model Portfolio",
              "outcome": "Demonstrate practical understanding of term three model portfolio.",
              "estimatedMinutes": 35,
              "accessTier": "premium",
              "assessment": "term-assessment"
            }
          ]
        }
      ]
    },
    {
      "id": "wealth-term-4",
      "termNumber": 4,
      "title": "Long-Term Wealth Strategy",
      "theme": "Long-Term Wealth Strategy",
      "certificateTitle": "Certificate in Long-Term Wealth Strategy",
      "units": [
        {
          "id": "wealth-unit-10",
          "unitNumber": 10,
          "title": "Portfolio Strategy and Behaviour",
          "description": "Develop practical knowledge and decision-making in portfolio strategy and behaviour.",
          "modules": [
            {
              "id": "wealth-10-1",
              "moduleNumber": 37,
              "title": "Asset Allocation",
              "outcome": "Demonstrate practical understanding of asset allocation.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-10-2",
              "moduleNumber": 38,
              "title": "Diversification and Rebalancing",
              "outcome": "Demonstrate practical understanding of diversification and rebalancing.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-10-3",
              "moduleNumber": 39,
              "title": "Investor Psychology",
              "outcome": "Demonstrate practical understanding of investor psychology.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-10-4",
              "moduleNumber": 40,
              "title": "Investment Policy Statement",
              "outcome": "Demonstrate practical understanding of investment policy statement.",
              "estimatedMinutes": 35,
              "accessTier": "professional",
              "assessment": "project"
            }
          ]
        },
        {
          "id": "wealth-unit-11",
          "unitNumber": 11,
          "title": "Protection, Tax and Retirement",
          "description": "Develop practical knowledge and decision-making in protection, tax and retirement.",
          "modules": [
            {
              "id": "wealth-11-1",
              "moduleNumber": 41,
              "title": "Insurance and Risk Transfer",
              "outcome": "Demonstrate practical understanding of insurance and risk transfer.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-11-2",
              "moduleNumber": 42,
              "title": "Tax Principles",
              "outcome": "Demonstrate practical understanding of tax principles.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-11-3",
              "moduleNumber": 43,
              "title": "Retirement Planning",
              "outcome": "Demonstrate practical understanding of retirement planning.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-11-4",
              "moduleNumber": 44,
              "title": "Protection and Retirement Case",
              "outcome": "Demonstrate practical understanding of protection and retirement case.",
              "estimatedMinutes": 35,
              "accessTier": "professional",
              "assessment": "case-study"
            }
          ]
        },
        {
          "id": "wealth-unit-12",
          "unitNumber": 12,
          "title": "Family Wealth, Legacy and Stewardship",
          "description": "Develop practical knowledge and decision-making in family wealth, legacy and stewardship.",
          "modules": [
            {
              "id": "wealth-12-1",
              "moduleNumber": 45,
              "title": "Estate and Succession Principles",
              "outcome": "Demonstrate practical understanding of estate and succession principles.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-12-2",
              "moduleNumber": 46,
              "title": "Family Wealth Governance",
              "outcome": "Demonstrate practical understanding of family wealth governance.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-12-3",
              "moduleNumber": 47,
              "title": "Ethical Wealth and Giving",
              "outcome": "Demonstrate practical understanding of ethical wealth and giving.",
              "estimatedMinutes": 20,
              "accessTier": "professional"
            },
            {
              "id": "wealth-12-4",
              "moduleNumber": 48,
              "title": "Final Capstone Presentation",
              "outcome": "Demonstrate practical understanding of final capstone presentation.",
              "estimatedMinutes": 35,
              "accessTier": "professional",
              "assessment": "term-assessment"
            }
          ]
        }
      ]
    }
  ],
  "capstone": {
    "title": "My Five-Year Wealth and Asset Strategy",
    "description": "A practical final project joining cash flow, skills, business systems, investing, protection and legacy planning.",
    "deliverables": [
      "Financial position and cash-flow summary",
      "Emergency-fund and debt strategy",
      "Twelve-month earning and skills plan",
      "Personal asset and intellectual-property map",
      "Founder-independent income-system concept",
      "Goal-based model investment portfolio",
      "Risk, insurance and retirement overview",
      "Five-year milestones and review schedule"
    ]
  }
};
