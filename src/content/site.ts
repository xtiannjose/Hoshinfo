// Everything about the owner lives here, so a name or link changes in one place.
// Facts below come from the owner's CV. Phone, home address, email and references stay off the site.
export const site = {
  brand: "Hoshinfo",
  name: "Christian Jose",
  role: "Full-stack developer",
  github: "https://github.com/xtiannjose",
  linkedin: "https://www.linkedin.com/in/xtianjose/",
  url: "https://hoshinfo.vercel.app",
};

/** The About section, one string per paragraph. */
export const about = [
  "I'm Christian, a full-stack developer in the Philippines. I build web apps for the parts of a business that hurt when they break: orders, stock, payments and support tickets.",
  "At iOne Resources I build the company website and the help desk it runs with its clients, plus the monitoring and automation behind its field projects: live dashboards for a satellite internet rollout across more than 3,000 DepEd schools, and tooling for the devices used in the 2025 national and 2026 BARMM elections.",
  "I studied Computer Science at STI College Ortigas-Cainta. In my own time I design and build complete products test-first, and I write down the business rules and every hard-to-reverse choice before the code.",
];

export type Role = {
  /** Shown in the date column, e.g. "Nov 2025 - Now". */
  period: string;
  title: string;
  org: string;
  /** Where the entry leads, if anywhere: a section of this page or an outside link. */
  href?: string;
  summary: string;
  highlights?: string[];
  stack: string[];
};

// Newest first.
export const experience: Role[] = [
  {
    period: "Nov 2025 - Now",
    title: "Software Developer",
    org: "iOne Resources",
    href: "#work",
    summary:
      "Web apps for the company, and monitoring and automation for its connectivity and election projects with DepEd and COMELEC.",
    highlights: [
      "Building the iOne Helpdesk (client and staff portals, SLA tracking, escalation, audit logging) and the new company website.",
      "Built live dashboards and a real-time monitoring system for the LeoXSolar satellite internet rollout across 3,000+ DepEd school sites, with Google Apps Script keeping site data current.",
      "Built network monitoring on the Omada API that tracks device status and data use per site, in support of the project's SLA.",
      "Configured and checked election transmission devices for the 2025 national and 2026 BARMM elections, with standby support during field testing and mock elections.",
      "Wrote a Selenium tool that configures election transmission devices, cutting setup from 10 to 5 minutes per device and reducing manual errors.",
    ],
    stack: ["Next.js", "TypeScript", "Laravel", "PostgreSQL", "Google Apps Script", "Omada API", "Selenium"],
  },
  {
    period: "Feb - May 2025",
    title: "Network Operations and Software Developer Intern",
    org: "iOne Resources",
    summary:
      "Configured and deployed Teltonika routers for nationwide connectivity during the 2025 COMELEC elections, and handled firmware updates, configuration backups and inventory for a fleet of 2,000+ routers.",
    highlights: ["Built a web automation tool and scripts with PRTG and XPath to speed up router setup, and trained fellow interns to use it."],
    stack: ["Teltonika", "PRTG", "XPath"],
  },
  {
    period: "May - Aug 2022",
    title: "Software Research and Development Intern",
    org: "Cyware Inc.",
    summary:
      "Designed Figma wireframes for a point-of-sale system (inventory, sales tracking and payments), revised them with the developers as they built the features, and tested web and mobile apps before release.",
    stack: ["Figma"],
  },
];

export const education = {
  period: "2021 - 2025",
  school: "STI College Ortigas-Cainta",
  degree: "BS Computer Science",
  thesis:
    "Thesis: a Messenger chatbot that answers school questions on admissions, enrollment, schedules and requirements, trained with Rasa to understand English and Filipino, with a fallback to admin staff.",
  stack: ["Python", "Rasa", "Facebook Messenger"],
};

// Newest first, names as issued.
export const certifications = [
  { date: "Oct 2026", name: "TP-Link Omada OCI for OCNA Wireless" },
  { date: "Jan 2026", name: "TP-Link Omada OCNA Routing & Switching" },
  { date: "Jan 2026", name: "TP-Link Omada OCNA Wireless" },
  { date: "Dec 2025", name: "Akamai Brand Protector Basic Services & Support Certification for Partners" },
  { date: "Dec 2025", name: "Akamai Content Protector Basic Services & Support Certification for Partners" },
  { date: "Dec 2025", name: "Peplink Certified Engineer (PCE) 4.0" },
  { date: "Nov 2025", name: "Akamai Bot Manager & Account Protector Basic APP Enablement Certification for Partner Support Engineer" },
  { date: "Nov 2025", name: "freeCodeCamp Legacy Responsive Web Design V8" },
];
