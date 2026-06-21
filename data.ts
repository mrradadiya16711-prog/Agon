import {
  PenLine, Activity, Instagram, Facebook, BrainCircuit, KeyRound,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Overview", href: "#overview" },
  { label: "Live data", href: "#analytics" },
  { label: "Connect", href: "#connect" },
  { label: "FAQ", href: "#faq" },
];

export interface AgentBrief {
  tag: string;
  name: string;
  oneLiner: string;
  icon: LucideIcon;
  accent: string;
}

export const AGENTS: AgentBrief[] = [
  {
    tag: "AI #1",
    name: "Creator",
    oneLiner: "Writes & posts your content.",
    icon: PenLine,
    accent: "var(--color-terracotta)",
  },
  {
    tag: "AI #2",
    name: "Optimizer",
    oneLiner: "Reads the data & makes AI #1 smarter.",
    icon: Activity,
    accent: "var(--color-olive)",
  },
];

export interface ConnectCard {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: string;
  placeholder: string;
  hint: string;
  connectedLabel: string;
}

export const CONNECT_CARDS: ConnectCard[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    accent: "#C13584",
    placeholder: "Paste Meta access token for Instagram",
    hint: "From Meta Business → Graph API token with instagram_basic + instagram_content_publish.",
    connectedLabel: "Instagram connected",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: Facebook,
    accent: "#1877F2",
    placeholder: "Paste Meta access token for Facebook Page",
    hint: "Page access token with pages_manage_posts + pages_read_engagement.",
    connectedLabel: "Facebook connected",
  },
  {
    id: "nvidia",
    name: "NVIDIA API Key",
    icon: BrainCircuit,
    accent: "#76b900",
    placeholder: "Paste your NVIDIA NIM API key (nvapi-...)",
    hint: "Powers both AI agents. Stored encrypted — rotate or delete anytime.",
    connectedLabel: "NVIDIA key saved",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Where do I put my API keys?",
    a: "Scroll to the Connect section. Three fields: Instagram token, Facebook token, and your NVIDIA API key. Paste each one, click Save, done. They're stored encrypted in the database — your two NVIDIA keys can also go directly in Vercel environment variables.",
  },
  {
    q: "Where does the graph data come from?",
    a: "Your backend (Vercel API routes). An uptime bot pings /api/tick every minute, which pulls real views, saves, and clicks from Meta's Insights API using your saved tokens. The graph shows demo data until your database and Meta tokens are connected, then it switches to live data automatically.",
  },
  {
    q: "How does the system stay running on Vercel?",
    a: "Vercel serverless functions don't stay running on their own — so an uptime bot (like UptimeRobot, free) pings /api/tick every minute and /api/optimize every 15 minutes. Each ping triggers the analytics pull, post publishing, and AI #2's optimization. The uptime bot IS the cron — no persistent server needed.",
  },
  {
    q: "Is this sold to one restaurant?",
    a: "Yes. One system, one restaurant. Your Vercel project, your Neon database, your NVIDIA keys, your data. No shared tenants.",
  },
];
