export type ProjectDetail = {
  slug: string;
  title: string;
  tag: string;
  blurb: string;
  overview: string;
  role: string;
  year: string;
  stack: string[];
  features: string[];
  highlights: { k: string; v: string }[];
  repo: string;
  demo?: string;
  accent: string;
};

export const projects: ProjectDetail[] = [
  {
    slug: "geoswipe",
    title: "GeoSwipe",
    tag: "Heritage · Gesture · 3D",
    blurb:
      "Interactive heritage & geography explorer with 3D Earth, gesture navigation and Llama-powered guidance.",
    overview:
      "GeoSwipe is a full-stack heritage exploration platform. Users navigate a Three.js-powered 3D Earth, dive into UNESCO sites, forts, temples and monuments, and drive the whole experience with hand gestures via MediaPipe. Real-time multiplayer rooms let visitors explore together, and a Groq Llama 3.3 assistant answers cultural questions in-context. Showcased nationally at CIIA-5, Nehru Science Centre.",
    role: "Full-stack lead — architecture, 3D, gesture layer, multiplayer",
    year: "2025",
    stack: ["React", "Express", "MongoDB", "Three.js", "Socket.IO", "MediaPipe", "Groq Llama 3.3"],
    features: [
      "3D Earth globe with smooth country selection at 60 FPS",
      "Hand-gesture navigation using MediaPipe + OpenCV",
      "Interactive heritage map with satellite / street / terrain / dark styles",
      "Real-time multiplayer rooms over Socket.IO",
      "AI cultural assistant powered by Groq Llama 3.3",
      "Rich detail panels with imagery, history and category icons",
    ],
    highlights: [
      { k: "Award", v: "Runner-up · AI-Robo Festival 2026" },
      { k: "Showcase", v: "CIIA-5, Nehru Science Centre" },
      { k: "Focus", v: "Immersive learning · UX at booth scale" },
    ],
    repo: "https://github.com/Interior-Gardener/Geoswipe",
    demo: "https://drive.google.com/file/d/1NzUjonejcssivGZTnOTxkJuZuxzxwtFT/view",
    accent: "01",
  },
  {
    slug: "industrial-asset-management",
    title: "Industrial Asset Management",
    tag: "JSW · Flask · Oracle",
    blurb:
      "Roll Shop management platform digitising asset lifecycle across grinding, inspection, assembly and reporting at JSW Steel.",
    overview:
      "Built during my on-site internship at JSW Steel, this Flask + Oracle DB application replaces spreadsheets and paper logs for the Roll Shop. It tracks the full lifecycle of rolls, bearings, chocks, stands and wheels — from arrival to disposal — with transactional workflows for grinding, inspection and assembly, plus Excel ingestion and 15+ production reports the floor uses every morning.",
    role: "Software Developer Intern · JSW Steel (on-site)",
    year: "2025",
    stack: ["Flask", "Oracle DB", "SQL", "Pandas", "Jinja", "Bootstrap"],
    features: [
      "Roll & component master data with full lifecycle events",
      "Transactional workflows: grinding, inspection, assembly, disposal",
      "Excel ingestion pipeline for legacy shop records",
      "15+ production reports used by shop-floor staff",
      "Role-based access for operators, engineers and supervisors",
    ],
    highlights: [
      { k: "Impact", v: "Digitised end-to-end Roll Shop workflow" },
      { k: "Scale", v: "Live at JSW Steel production plant" },
      { k: "Stack", v: "Enterprise Oracle + Python web layer" },
    ],
    repo: "https://github.com/Interior-Gardener/Industrial_Asset_Management_System-JSW-Steel",
    accent: "02",
  },
  {
    slug: "skill-verse",
    title: "Skill_Verse",
    tag: "Gamified learning · Realtime",
    blurb:
      "Full-stack skill-sharing platform with JWT auth, RBAC, Redis caching, Razorpay payments and Socket.IO learning rooms.",
    overview:
      "Skill_Verse is a course-sharing platform where users discover new skills, work through interactive modules, and collaborate in real time. It combines a hardened Node/Express backend with Redis cache-aside, Razorpay for paid course access, and Socket.IO for live study rooms.",
    role: "Full-stack engineer",
    year: "2025",
    stack: ["Node.js", "Express", "MongoDB", "Redis", "Socket.IO", "Razorpay", "JWT"],
    features: [
      "JWT authentication with refresh tokens and RBAC",
      "Redis cache-aside layer for hot content",
      "Razorpay checkout for paid courses",
      "Real-time collaborative learning rooms",
      "Progress tracking, resource library, personalised profiles",
    ],
    highlights: [
      { k: "Focus", v: "Production-shape backend patterns" },
      { k: "Payments", v: "Razorpay orders + signature verification" },
      { k: "Realtime", v: "Socket.IO rooms for co-learning" },
    ],
    repo: "https://github.com/Interior-Gardener/Skill_Verse",
    accent: "03",
  },
  {
    slug: "studyhub-ai",
    title: "StudyHub AI",
    tag: "Student productivity · Gemini",
    blurb:
      "AI-powered student companion for notes, tasks, attendance, GPA and study planning — with a Gemini academic assistant.",
    overview:
      "StudyHub AI is a modern student productivity platform that replaces the usual patchwork of note-apps, planners and calculators. React 19 on the front, Express + MongoDB on the back, and Google Gemini stitched in for contextual academic help.",
    role: "Full-stack engineer",
    year: "2026",
    stack: ["React 19", "TypeScript", "Node.js", "Express", "MongoDB", "Google Gemini"],
    features: [
      "Notes, tasks and calendar in one workspace",
      "Attendance tracker and GPA calculator",
      "Study session planner",
      "Gemini-powered academic Q&A on your own notes",
    ],
    highlights: [
      { k: "AI", v: "Google Gemini for contextual help" },
      { k: "Stack", v: "React 19 + TypeScript + Mongo" },
    ],
    repo: "https://github.com/Interior-Gardener/StudyHub_with_AI",
    accent: "04",
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Information System",
    tag: "Healthcare · Node · EJS",
    blurb:
      "Unified HIS digitising end-to-end hospital ops — OPD, IPD, OT, pharmacy, billing, EMR and analytics.",
    overview:
      "A comprehensive Hospital Information System built on Node.js + EJS. It covers clinical workflows (OPD, IPD, ED, OT), diagnostics (lab, radiology), pharmacy and billing, HR and inventory, plus a real-time analytics dashboard for bed occupancy and revenue.",
    role: "Full-stack engineer",
    year: "2025",
    stack: ["Node.js", "Express", "EJS", "MongoDB"],
    features: [
      "Patient registration with demographics and history",
      "OPD / IPD / ED / OT workflows",
      "Lab and radiology order management",
      "Pharmacy dispensing, billing and insurance claims",
      "EMR, HR, inventory and analytics dashboard",
    ],
    highlights: [
      { k: "Scope", v: "End-to-end hospital operations" },
      { k: "Dashboard", v: "Live bed occupancy & revenue" },
    ],
    repo: "https://github.com/Interior-Gardener/Hospital-Management-System",
    accent: "05",
  },
  {
    slug: "hospital-readmission-predictor",
    title: "Hospital Readmission Predictor",
    tag: "ML · XGBoost · SHAP",
    blurb:
      "AI web app that predicts diabetic-patient readmission risk with 85.2% accuracy and explains itself via SHAP.",
    overview:
      "A Streamlit app that turns a trained XGBoost model into a usable clinical tool. Clinicians enter patient features and get a risk score, interactive gauges, SHAP explanations and downloadable prediction reports — no data persisted.",
    role: "ML engineer",
    year: "2025",
    stack: ["Python", "Streamlit", "XGBoost", "SHAP", "Pandas", "Plotly"],
    features: [
      "XGBoost model, 85.2% validation accuracy",
      "Interactive risk gauges and analytics dashboard",
      "SHAP explanations for every prediction",
      "Patient history tracking during the session",
      "PDF / CSV report export",
    ],
    highlights: [
      { k: "Accuracy", v: "85.2% on held-out data" },
      { k: "Explainability", v: "SHAP for every prediction" },
    ],
    repo: "https://github.com/Interior-Gardener/Hospital-Readmission-Predictor-by-Kartik-Verma",
    accent: "06",
  },
  {
    slug: "sponsor-connector",
    title: "Sponsor Connect",
    tag: "Marketplace · Next.js · Razorpay",
    blurb:
      "Two-sided sponsorship marketplace — Next.js 14 + Express monorepo with Razorpay subscriptions and realtime alerts.",
    overview:
      "Sponsor Connect (SPONSR) is a production-shape marketplace connecting event organisers with sponsors. Monorepo with a Next.js 14 App Router frontend, an Express + Mongo backend, JWT auth with refresh tokens, Cloudinary uploads, Razorpay subscriptions, and Socket.io for realtime alerts.",
    role: "Full-stack engineer",
    year: "2026",
    stack: ["Next.js 14", "Tailwind", "Framer Motion", "Zustand", "TanStack Query", "Express", "MongoDB", "Socket.io", "Razorpay", "Cloudinary", "Redis"],
    features: [
      "Two-sided marketplace: organisers + sponsors",
      "JWT auth with refresh-token rotation",
      "Razorpay subscriptions and Cloudinary proposal uploads",
      "Realtime alerts over Socket.io",
      "Helmet, rate limiting, sanitisation, Zod validation",
    ],
    highlights: [
      { k: "Shape", v: "Production-oriented monorepo" },
      { k: "Security", v: "Helmet + rate limits + Zod" },
    ],
    repo: "https://github.com/Interior-Gardener/Sponsor-Connector",
    accent: "07",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);