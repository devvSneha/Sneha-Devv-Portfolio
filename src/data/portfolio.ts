/**
 * ─────────────────────────────────────────────────────────────
 *  ALL site content lives in this one file.
 *  Replace the placeholders with your details — the page,
 *  the SEO tags and the AI assistant all update automatically.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  /** Your live website address (used for SEO + share previews). */
  url: "https://your-domain.com",
  name: "Sneha",
  fullName: "Sneha Sharma",
  role: "Full Stack Developer | Specialized in Frontend Development",
  location: "Solan, Himachal Pradesh, India",
  /** Short line used in search results and share previews. */
  description:
    "Full Stack Developer specializing in frontend development with React.js, Next.js, TypeScript, Redux and Node.js.",
  /** Shown as the green badge in the hero. Set to "" to hide. */
  availability: "",
  /** Put your PDF in the /public folder (e.g. /public/resume.pdf) and write "/resume.pdf" here. "" hides the buttons. */
  resumeUrl: "",
  keywords: ["Full Stack Developer", "Frontend Developer", "React.js", "Next.js", "TypeScript", "Redux Toolkit", "Node.js", "MERN Stack", "Portfolio"],
};

export type Tone = "accent" | "accent2";
export type HeroPart = { text: string; tone?: Tone };

export const hero = {
  /** Big headline. Parts with a `tone` are highlighted. */
  headline: [
    { text: "I build " },
    { text: "modern, scalable", tone: "accent" },
    { text: " web applications that are " },
    { text: "fast, reliable and built to last", tone: "accent" },
    { text: "." },
  ] satisfies HeroPart[],
  /** Rotating titles typed out next to your name. One entry = static, no rotation. */
  roles: ["Full Stack Developer"],
  /** 2–3 sentences about you. */
  intro:
    "I'm a Full Stack Developer specializing in frontend development, with a strong focus on React.js, Next.js and TypeScript. I build responsive, scalable and user-friendly web applications, work with REST APIs and modern state management, and collaborate across frontend and backend workflows to deliver production-ready products.",
};

/** Keep it to the skills you'd happily be interviewed on. */
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Tech Stack",
    items: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Redux Toolkit",
      "Redux-Saga",
      "Tailwind CSS",
      "Framer Motion",
      "HTML",
      "Node.js",
      "Express.js",
      "REST APIs",
      "API Integration",
      "MongoDB",
      "Git",
      "GitHub",
      "MERN Stack",
    ],
  },
];

export type Project = {
  /** Short id, lowercase, no spaces (used by `/open <slug>` in the chat). */
  slug: string;
  title: string;
  /** One line shown on the card. */
  tagline: string;
  /** 2–3 sentences shown in the details popup. */
  description: string;
  tags: string[];
  /** Screenshot in /public/images, e.g. "/images/project-one.png". A generated cover is used if empty. */
  image?: string;
  /** Brand/product logo in /public/images, shown centered on the generated gradient cover when there's no screenshot. */
  logo?: string;
  liveUrl?: string;
  repoUrl?: string;
  /** YouTube link to a demo video (optional). */
  videoUrl?: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "perix-backoffice",
    title: "Perix Backoffice",
    tagline: "Enterprise multi-tenant CMMS/CAFM platform for facilities, assets & maintenance operations.",
    description:
      "Perix is a multi-tenant, cloud-based Computerized Maintenance Management System (CMMS) & Facility Asset Management Platform (CAFM). It is built to streamline building operations, manage thousands of physical assets across multi-level property hierarchies, automate preventive maintenance workflows, and manage real-time work order dispatch for field technicians and vendors. I build and maintain the frontend modules for Assets, Work Orders, Maintenance Plans, Vendors, Locations and Technicians — including Hebrew/RTL support.",
    tags: ["React 19", "TypeScript", "Vite", "Redux Toolkit", "Redux-Saga", "Tailwind CSS", "Axios", "Recharts"],
    image: "/images/perix-screenshot.png",
    logo: "/images/perix-logo.png",
    liveUrl: "https://perix.dev.zangula.net/",
    highlights: [
      "Built asset lifecycle management with QR codes, service history, warranty details and operational status.",
      "Implemented Kanban and table-based work order management with filtering, sorting, pagination and dispatch workflows.",
      "Added multi-language / Hebrew RTL support across the module UI.",
      "Built KPI dashboards with Recharts and Chart.js, plus Excel/PDF export and rich-text editing.",
      "Optimized large tables and lists with TanStack Virtual for performance.",
    ],
  },
  {
    slug: "zangula-website",
    title: "Zangula Website",
    tagline: "Corporate technology website with an SEO-focused blog & article experience.",
    description:
      "Worked on the frontend of Zangula's corporate website, including the blog and article experience, service pages and case-study content. Built and refined responsive UI sections and article pages, integrated API-driven content, and worked on reusable frontend structures across a large blog covering software development, UX/UI, AI, automation, QA and DevOps.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "API Integration", "i18n"],
    image: "/images/zangula-screenshot.png",
    logo: "/images/zangula-logo.png",
    liveUrl: "https://www.zangula.com/en",
    highlights: [
      "Developed the blog and article frontend, including SEO-oriented content pages and structured layouts.",
      "Built responsive website sections and reusable UI components.",
      "Integrated API-driven content across a multilingual website structure.",
    ],
  },
  {
    slug: "digipharm",
    title: "DigiPharm",
    tagline: "Hebrew-language SEO link-building & content marketplace.",
    description:
      "DigiPharm is a Hebrew-language link-building and content marketplace connecting website owners with SEO publishing opportunities across 1,000+ partner sites. I worked on the frontend — building and refactoring pricing/package sections and tabs, the fully Hebrew/RTL interface, and integrating APIs for dynamic website functionality.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Hebrew RTL", "API Integration", "Node.js", "Express.js"],
    image: "/images/digipharm-screenshot.png",
    logo: "/images/digipharm-logo.png",
    liveUrl: "https://www.digipharm.co.il/",
    highlights: [
      "Built and refactored multiple website sections and tabs, including pricing packages and testimonials.",
      "Developed the fully Hebrew / RTL interface with responsive, reusable UI components.",
      "Integrated APIs for dynamic content and functionality.",
    ],
  },
  {
    slug: "trendora",
    title: "TrendOra",
    tagline: "AI-powered shopping platform with personalized recommendations.",
    description:
      "TrendOra is a smart shopping platform built for a personalized, seamless online retail experience. It combines insight-driven product recommendations across categories like footwear, wearables, apparel and electronics with New Arrivals, Trending Now and Deals of the Week sections, fast delivery, exclusive discounts and secure checkout.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "E-commerce"],
    image: "/images/trendora-screenshot.png",
    logo: "/images/trendora-logo.png",
    liveUrl: "https://trend-ora.vercel.app/",
    highlights: [
      "Personalized, insight-driven product recommendations across categories like footwear, wearables and electronics.",
      "New Arrivals, Trending Now and Deals of the Week sections with time-limited offers.",
      "Secure checkout with fast delivery and exclusive discounts.",
    ],
  },
  {
    slug: "kavix",
    title: "Kavix",
    tagline: 'Financial insights & investing platform — "Every market has a story."',
    description:
      "Kavix is a financial insights and investment content platform that helps users understand markets, businesses and long-term investing. It offers expert research and educational articles, free access to market insights, and lets users publish and share their own investing perspectives.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vue"],
    image: "/images/kavix-screenshot.png",
    logo: "/images/kavix-logo.png",
    liveUrl: "https://kavix-two.vercel.app/",
    highlights: [
      "Expert research and educational articles on markets and long-term investing.",
      "Free, open access to market insights and analysis.",
      "Lets users publish and share their own investing perspectives.",
    ],
  },
];

export type Role = {
  period: string;
  title: string;
  company: string;
  location: string;
  current?: boolean;
  /** 2–3 short bullet points. Start with a verb, include a number where you can. */
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    period: "Mar 2026 — Present",
    title: "Full Stack Developer | Specialized in Frontend Development",
    company: "Zangula",
    location: "Remote",
    current: true,
    points: [
      "Develop and maintain production web applications using React, Next.js and TypeScript.",
      "Build responsive, reusable and scalable frontend components across multiple business modules.",
      "Work with Redux Toolkit and Redux-Saga for state management, plus Hebrew/RTL interfaces.",
      "Collaborate with backend developers to integrate and troubleshoot REST APIs.",
    ],
    tags: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Redux-Saga", "Tailwind CSS", "Node.js", "Express.js", "REST APIs", "MongoDB", "Git", "GitHub"],
  },
  {
    period: "2024 — Feb 2026",
    title: "Full Stack Developer",
    company: "Upwork / Freelance",
    location: "Remote",
    points: [
      "Built responsive and scalable web applications using React.",
      "Delivered smooth UI designs and integrated APIs for dynamic content.",
      "Collaborated with backend developers to ensure cohesive project delivery.",
    ],
    tags: ["React.js", "JavaScript", "TypeScript", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "REST APIs"],
  },
];

export const education: { period: string; degree: string; school: string }[] = [
  { period: "2024 — 2026", degree: "Master of Computer Applications", school: "Shoolini University" },
  { period: "2021 — 2024", degree: "Bachelor of Computer Applications", school: "Himachal Pradesh University" },
  { period: "2021", degree: "Senior Secondary (12th), ICSE Board", school: "Dayanand Adarsh Vidyalaya, Solan" },
];

/** Certifications, awards, hackathons… (optional — empty list hides the block). */
export const achievements: { text: string; href?: string }[] = [
  { text: "Gen-AI for Everyone — Shoolini University (May 2026)" },
  {
    text: "Web Development Fundamentals — IBM (Jul 2026)",
    href: "https://www.credly.com/badges/d3ae04cd-8f1f-4e09-85f7-b5e009ffe73b/linked_in_profile",
  },
  { text: "Production experience across frontend and full-stack web development." },
  { text: "Experience working on multiple real-world production applications." },
  { text: "Strong experience with React, Next.js and TypeScript." },
  { text: "Experience with Redux Toolkit, Redux-Saga and API-driven architecture." },
  { text: "Experience building responsive and multilingual web interfaces." },
  { text: "Freelance development experience through Upwork." },
];

export type ContactLink = { label: string; value: string; href: string };

export const contact = {
  email: "sharmasneha58991@gmail.com",
  /** Shown as plain text right next to the email, not as its own button. */
  phone: "+91 93175 02004",
  /** Line under the contact heading. */
  note: "Open to interesting frontend and full-stack projects, collaborations and professional opportunities.",
  links: [
    { label: "GitHub", value: "@snehafreelance04-crypto", href: "https://github.com/snehafreelance04-crypto" },
    { label: "LinkedIn", value: "in/sneha-sharma-8158ba355", href: "https://www.linkedin.com/in/sneha-sharma-8158ba355" },
  ] satisfies ContactLink[],
};

/**
 * Extra facts ONLY the AI assistant uses (not shown on the page): notice period,
 * relocation, languages, hobbies… The assistant says "I don't know" for anything not in this file.
 */
export const aiFacts: string[] = [
  "Speaks English (Advanced C1) and Hindi (Advanced C1).",
  "Currently working full-time, remotely, at Zangula.",
  "Open to remote work.",
];

/** Hobbies/interests — used by the "what are your hobbies" chat answer. */
export const hobbies: string[] = ["Singing", "Dancing", "Watching movies", "Building new things", "Continuous learning and growth"];

/** Shown only when the chat is asked about salary/compensation expectations. Set to "" to hide. */
export const salaryExpectation = "$10k–15k per year";

/** Starter questions shown in the chat. */
export const suggestedQuestions = [
  "What technologies does Sneha work with?",
  "Tell me about Sneha's projects.",
  "Tell me about Sneha's experience at Zangula.",
  "What did Sneha work on in the Perix project?",
  "Tell me about Sneha's frontend expertise.",
];

/** Top navigation. `id` must match a section id on the page. */
export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
