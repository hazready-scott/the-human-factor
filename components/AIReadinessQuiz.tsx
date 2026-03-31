"use client";

import { useState, useEffect, useRef } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

// ─── API Submission ──────────────────────────────────────────────
const submitToAPI = async (data: Record<string, unknown>) => {
  try {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error("Quiz submission error:", err);
    return false;
  }
};

// ─── Brand & Config ────────────────────────────────────────────────
const BRAND = {
  name: "The Human Factor",
  tagline: "Understanding the AI-Human Interface",
  subtitle: "Grounded in Human Factors & Systems Design Engineering",
  colors: {
    primary: "#1a365d",
    secondary: "#2b6cb0",
    accent: "#ed8936",
    success: "#38a169",
    warning: "#d69e2e",
    danger: "#e53e3e",
    light: "#f7fafc",
    muted: "#718096",
    text: "#2d3748",
  },
};

// ─── Assessment Dimensions ───────────────────────────────────────
const DIMENSIONS = [
  { key: "leadership", label: "Leadership & Vision", icon: "🎯", short: "Leadership" },
  { key: "process", label: "Process Understanding", icon: "⚙️", short: "Process" },
  { key: "data", label: "Data Foundation", icon: "📊", short: "Data" },
  { key: "technical", label: "Technical Infrastructure", icon: "🔧", short: "Technical" },
  { key: "people", label: "People & Workflow", icon: "👥", short: "People" },
  { key: "governance", label: "Governance & Risk", icon: "🛡️", short: "Governance" },
];

// ─── Questions ─────────────────────────────────────────────────────
const INTAKE_QUESTIONS = [
  {
    id: "industry",
    section: "about",
    text: "What industry does your organization operate in?",
    type: "select",
    options: [
      { value: "emergency_services", label: "Emergency Services (Fire, EMS, Emergency Management)" },
      { value: "healthcare", label: "Healthcare" },
      { value: "professional_services", label: "Professional Services" },
      { value: "construction_trades", label: "Construction & Trades" },
      { value: "retail_hospitality", label: "Retail & Hospitality" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "nonprofit", label: "Non-Profit / Government" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "org_size",
    section: "about",
    text: "How many people work in your organization?",
    type: "select",
    options: [
      { value: "1-10", label: "1–10 employees" },
      { value: "11-50", label: "11–50 employees" },
      { value: "51-150", label: "51–150 employees" },
      { value: "151-250", label: "151–250 employees" },
      { value: "250+", label: "250+ employees" },
    ],
  },
  {
    id: "role",
    section: "about",
    text: "What best describes your role?",
    type: "select",
    options: [
      { value: "owner", label: "Owner / Founder" },
      { value: "executive", label: "Executive / C-Suite" },
      { value: "operations", label: "Operations / Department Lead" },
      { value: "it", label: "IT / Technology" },
      { value: "chief_officer", label: "Chief Officer (Fire/EMS)", condition: "emergency_services" },
      { value: "em_coordinator", label: "Emergency Management Coordinator", condition: "emergency_services" },
      { value: "other", label: "Other" },
    ],
  },
];

const GENERAL_QUESTIONS = [
  // Leadership & Vision
  {
    id: "tech_approach",
    dimension: "leadership",
    text: "How would you describe your organization's approach to new technology?",
    options: [
      { label: "We experiment early and adopt what works", score: 3 },
      { label: "We wait for proven solutions, then move", score: 2 },
      { label: "We prefer established methods and change slowly", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "ai_experience",
    dimension: "leadership",
    text: "Has your organization used any AI tools (ChatGPT, Copilot, automated scheduling, etc.)?",
    options: [
      { label: "Yes, AI tools are part of regular operations", score: 3 },
      { label: "We have experimented, but nothing has stuck", score: 2 },
      { label: "No, this would be entirely new territory", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "leadership_champion",
    dimension: "leadership",
    text: "Does leadership actively drive technology adoption in your organization?",
    options: [
      { label: "Yes, leadership initiates and champions tech changes", score: 3 },
      { label: "Leadership is supportive but doesn't drive it", score: 2 },
      { label: "Leadership is cautious or skeptical about new tech", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  // Process Understanding
  {
    id: "process_documented",
    dimension: "process",
    text: "Are your core business processes documented?",
    options: [
      { label: "Yes, we have clear SOPs and workflow documentation", score: 3 },
      { label: "Partially. Some things are documented, others are tribal knowledge", score: 2 },
      { label: "Very little is documented. Most knowledge lives in people's heads", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "process_consistency",
    dimension: "process",
    text: "How consistently do your core processes run day to day?",
    options: [
      { label: "Very consistently. The same inputs produce the same outputs", score: 3 },
      { label: "Mostly consistent, with some variation by person or situation", score: 2 },
      { label: "Highly variable. It depends on who is doing it and when", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "bottleneck_awareness",
    dimension: "process",
    text: "Can you identify where your biggest operational bottlenecks are?",
    options: [
      { label: "Yes, we know exactly where time and effort get stuck", score: 3 },
      { label: "We have a general sense but haven't mapped it precisely", score: 2 },
      { label: "Not really. We would need to investigate", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  // Data Foundation
  {
    id: "data_state",
    dimension: "data",
    text: "Where does your critical business data currently live?",
    options: [
      { label: "Digital systems, organized, and accessible to the people who need it", score: 3 },
      { label: "A mix of digital tools, spreadsheets, and some paper processes", score: 2 },
      { label: "Mostly paper, disconnected spreadsheets, or siloed in individual tools", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "data_quality",
    dimension: "data",
    text: "How confident are you in the quality and reliability of your data?",
    options: [
      { label: "High confidence. Our data is clean, current, and trustworthy", score: 3 },
      { label: "Moderate. There are gaps, but it is generally usable", score: 2 },
      { label: "Low confidence. Data quality is a known problem", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "data_compliance",
    dimension: "data",
    text: "Does your organization handle sensitive or regulated data (personal info, health records, financial data)?",
    options: [
      { label: "Yes, and we have established compliance processes in place", score: 3 },
      { label: "Yes, and our compliance processes need improvement", score: 2 },
      { label: "Yes, and we are not confident in our current handling", score: 1 },
      { label: "No significant sensitive data concerns", score: 3 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  // Technical Infrastructure
  {
    id: "tech_stack",
    dimension: "technical",
    text: "How would you describe your current technology tools and systems?",
    options: [
      { label: "Modern, cloud-based, and reasonably well integrated", score: 3 },
      { label: "A mix of modern and older tools with some integration between them", score: 2 },
      { label: "Mostly older systems with limited ability to connect to new tools", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "tech_support",
    dimension: "technical",
    text: "Who manages technology in your organization?",
    options: [
      { label: "A dedicated IT person, team, or managed service provider", score: 3 },
      { label: "Someone handles it alongside other responsibilities", score: 2 },
      { label: "No one is specifically responsible for technology", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "integration_capability",
    dimension: "technical",
    text: "Can your current systems connect with other tools (APIs, data sharing, integrations)?",
    options: [
      { label: "Yes, most of our systems offer integrations and we use them", score: 3 },
      { label: "Some can connect, but we have not explored this much", score: 2 },
      { label: "Unsure, or our systems are mostly standalone", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  // People & Workflow
  {
    id: "team_reaction",
    dimension: "people",
    text: "How would your team likely react to AI being introduced into their daily work?",
    options: [
      { label: "Enthusiastic. Some have already been asking about it", score: 3 },
      { label: "Open but cautious. They would need to see the value first", score: 2 },
      { label: "Resistant. There would be significant pushback or anxiety", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "training_capacity",
    dimension: "people",
    text: "Does your organization invest in training when new tools or processes are introduced?",
    options: [
      { label: "Yes, we prioritize training and skill development", score: 3 },
      { label: "Sometimes, when time and budget allow", score: 2 },
      { label: "Rarely. Everyone is already stretched thin", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "change_track_record",
    dimension: "people",
    text: "When your organization has made changes in the past, how well did they stick?",
    options: [
      { label: "Changes generally stick. We adapt and move forward", score: 3 },
      { label: "Mixed results. Some changes stuck, others quietly faded away", score: 2 },
      { label: "Poorly. New initiatives tend to lose momentum quickly", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  // Governance & Risk
  {
    id: "risk_awareness",
    dimension: "governance",
    text: "Has your organization considered the risks of AI (accuracy, bias, data privacy)?",
    options: [
      { label: "Yes, we have discussed risks and have a framework for thinking about them", score: 3 },
      { label: "Somewhat. We are aware of risks but have not formalized our approach", score: 2 },
      { label: "Not yet. We have not explored AI risks in any detail", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "error_handling",
    dimension: "governance",
    text: "What happens in your organization when a process or tool produces an error?",
    options: [
      { label: "We have clear escalation paths and learn from errors systematically", score: 3 },
      { label: "We fix the immediate problem, but root cause analysis is inconsistent", score: 2 },
      { label: "We tend to work around problems rather than solve them", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "accountability",
    dimension: "governance",
    text: "If an AI tool made a consequential mistake in your operations, who would be responsible?",
    options: [
      { label: "We could clearly define accountability, even for AI-assisted decisions", score: 3 },
      { label: "We would figure it out, but it is not currently clear", score: 2 },
      { label: "We have not thought about this at all", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
];

// ─── Emergency Services Additional/Replacement Questions ─────────
const EMERGENCY_QUESTIONS = [
  {
    id: "es_dispatch",
    dimension: "process",
    text: "How are calls dispatched and resources allocated in your organization?",
    replaces: "process_documented",
    options: [
      { label: "CAD system with established protocols and automated routing", score: 3 },
      { label: "CAD system with significant manual intervention or workarounds", score: 2 },
      { label: "Primarily manual dispatch or basic phone/radio coordination", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "es_reporting",
    dimension: "data",
    text: "How does your organization handle incident reporting and records management?",
    replaces: "data_state",
    options: [
      { label: "Electronic RMS with consistent data entry and reporting", score: 3 },
      { label: "Electronic system but data entry is inconsistent or incomplete", score: 2 },
      { label: "Primarily paper-based or disconnected systems", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "es_compliance",
    dimension: "governance",
    text: "How does your organization manage compliance (NFPA standards, provincial/state regulations, accreditation)?",
    replaces: "risk_awareness",
    options: [
      { label: "Active compliance tracking with regular review cycles", score: 3 },
      { label: "We meet requirements but tracking is manual and ad hoc", score: 2 },
      { label: "Compliance is reactive. We address issues as they come up", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "es_staffing",
    dimension: "people",
    text: "How do you manage shift scheduling, overtime, and resource deployment?",
    replaces: "training_capacity",
    options: [
      { label: "Scheduling software with data-driven staffing decisions", score: 3 },
      { label: "Digital scheduling but lots of manual adjustment and phone calls", score: 2 },
      { label: "Mostly manual scheduling, spreadsheets, or paper-based systems", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
  {
    id: "es_mutual_aid",
    dimension: "technical",
    text: "How does your organization coordinate mutual aid and inter-agency communication?",
    replaces: "integration_capability",
    options: [
      { label: "Integrated systems with neighboring agencies and clear protocols", score: 3 },
      { label: "Established agreements but communication relies on manual processes", score: 2 },
      { label: "Limited coordination infrastructure. Mostly phone and radio", score: 1 },
      { label: "I'm not sure / I don't know", score: 0 },
    ],
  },
];

// ─── Readiness Levels ────────────────────────────────────────────
const READINESS_LEVELS = [
  {
    min: 0,
    max: 33,
    level: "Foundation Building",
    color: "#e53e3e",
    headline: "Your organization needs groundwork before AI implementation.",
    summary:
      "This is not a failing grade. It is a clear signal that investing in AI tools right now would likely produce frustration, not results. The good news: the foundational work that would make AI successful (process documentation, data hygiene, change readiness) will improve your operations regardless of whether AI ever enters the picture.",
    cta: "A Human Factor Assessment can help you identify exactly where to start.",
  },
  {
    min: 34,
    max: 55,
    level: "Getting Ready",
    color: "#d69e2e",
    headline:
      "You have some foundations in place, but targeted preparation would dramatically improve your odds.",
    summary:
      "Organizations at this stage often have pockets of readiness alongside real gaps. The risk is jumping into AI implementation in the areas that feel ready while ignoring the gaps that will eventually undermine the whole effort. A structured readiness assessment would help you prioritize the right preparation work.",
    cta: "An ARIA Orient & Assess engagement can map your specific path forward.",
  },
  {
    min: 56,
    max: 77,
    level: "Ready for Assessment",
    color: "#2b6cb0",
    headline:
      "Your organization has solid foundations. You are a strong candidate for a structured AI implementation.",
    summary:
      "You have the leadership support, process maturity, and technical infrastructure to make AI implementation work. The key now is choosing the right opportunities. Not every process benefits from AI, and the highest-impact interventions are rarely the most obvious ones. A structured assessment would identify where AI will create the most value with the least risk.",
    cta: "A full ARIA Assessment would identify your highest-value AI opportunities.",
  },
  {
    min: 78,
    max: 100,
    level: "Implementation Ready",
    color: "#38a169",
    headline: "Your organization is well-positioned to implement AI effectively.",
    summary:
      "Strong scores across the board suggest an organization with the process maturity, data readiness, technical infrastructure, and cultural openness to benefit from AI implementation. The priority now is not whether to implement, but where to start for maximum impact while managing risk thoughtfully.",
    cta: "Let's talk about designing your AI implementation blueprint.",
  },
];

// ─── Dimension Recommendations ───────────────────────────────────
const DIM_RECOMMENDATIONS: Record<string, Record<string, string>> = {
  leadership: {
    low: "Leadership engagement is the single biggest predictor of AI implementation success. Before investing in tools, invest in building leadership understanding of what AI can and cannot do. Consider a focused executive briefing on AI capabilities relevant to your industry.",
    mid: "Your leadership is open to AI but may not be actively driving the conversation. The gap between \"supportive\" and \"championing\" matters more than most organizations realize. AI implementations without visible executive sponsorship have significantly lower adoption rates.",
    high: "Strong leadership engagement on technology. This is your biggest asset. The key now is ensuring leadership expectations are calibrated to realistic timelines and outcomes.",
  },
  process: {
    low: "This is your most critical gap. AI cannot improve processes that are not understood. Before any AI work, invest in mapping your core workflows. Document who does what, when, and why. This work has enormous standalone value and is a prerequisite for effective AI implementation.",
    mid: "You have partial process documentation but gaps remain. Focus on documenting your highest-volume and highest-impact workflows first. Pay special attention to decision points: where does someone use judgment, and what information do they rely on?",
    high: "Well-documented, consistent processes are the foundation AI implementations build on. Your organization is well-positioned to identify exactly where AI can reduce friction without disrupting what already works.",
  },
  data: {
    low: "Data readiness is a significant barrier. AI systems need accessible, reasonably clean data to function. The first step is not buying AI tools. It is getting your data organized, digital, and accessible. This might mean digitizing paper processes, consolidating spreadsheets, or implementing a proper records management system.",
    mid: "Your data is partially ready. Focus on the data that would feed your highest-priority AI use cases. You do not need perfect data everywhere. You need good enough data in the right places.",
    high: "Strong data foundation. Your organization has the information infrastructure to support AI implementation. Focus on ensuring data access and permissions are structured so AI tools can reach what they need without exposing what they should not.",
  },
  technical: {
    low: "Limited technical infrastructure will constrain your AI options but does not eliminate them. Many effective AI implementations use cloud-based tools that require minimal on-premise infrastructure. The key is having someone who can manage integrations and troubleshoot technical issues.",
    mid: "Your technical foundation can support AI, but integration will need attention. Identify the systems that would need to share data with AI tools and assess their connectivity options before committing to a specific AI approach.",
    high: "Solid technical infrastructure. Your organization can support a wide range of AI implementation approaches. This gives you options and flexibility in tool selection.",
  },
  people: {
    low: "People resistance is the most common reason AI implementations fail, regardless of how good the technology is. Before introducing any AI tools, invest in change management. Address fears directly. Frame AI as reducing low-value work, not replacing people. Build psychological safety around questioning AI outputs.",
    mid: "Your team is cautious but open. This is actually a healthy starting point. The key is demonstrating value early with quick wins that make their daily work noticeably better. Pilot with willing volunteers and let peer influence do the heavy lifting.",
    high: "Strong people readiness. Your team's openness to AI is a significant advantage. Channel this enthusiasm into structured pilot programs rather than uncoordinated tool adoption. Eager teams sometimes need guidance on which AI tools are worth their time.",
  },
  governance: {
    low: "Every AI implementation creates new risk pathways. Without governance structures, you will not know when AI is helping and when it is creating problems. Start simple: define who is responsible for AI outputs, what happens when the AI is wrong, and how errors are reported and corrected.",
    mid: "You have some awareness of AI governance needs but have not formalized your approach. This is common and correctable. A lightweight governance framework covering ownership, monitoring, escalation, and review cadence can be established quickly.",
    high: "Strong governance awareness positions your organization to implement AI responsibly. Your ability to think about accountability, error handling, and risk suggests a mature organization that will use AI thoughtfully rather than recklessly.",
  },
};

// ─── Components ──────────────────────────────────────────────────

const ProgressBar = ({
  current,
  total,
  section,
}: {
  current: number;
  total: number;
  section: string;
}) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, color: BRAND.colors.muted, fontWeight: 500 }}>
          {section}
        </span>
        <span style={{ fontSize: 13, color: BRAND.colors.muted }}>
          {current} of {total}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 6,
          backgroundColor: "#e2e8f0",
          borderRadius: 3,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: BRAND.colors.secondary,
            borderRadius: 3,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
};

const QuestionCard = ({
  question,
  selectedValue,
  onSelect,
  questionNumber,
  total,
  sectionLabel,
}: {
  question: {
    text: string;
    options: Array<{ value?: string; label: string; score?: number }>;
  };
  selectedValue: string | undefined;
  onSelect: (value: string, score?: number) => void;
  questionNumber: number;
  total: number;
  sectionLabel: string;
}) => {
  const filteredOptions = question.options || [];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <ProgressBar current={questionNumber} total={total} section={sectionLabel} />
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: BRAND.colors.text,
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        {question.text}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredOptions.map((opt, i) => {
          const val = opt.value || opt.label;
          const isSelected = selectedValue === val;
          return (
            <button
              key={i}
              onClick={() => onSelect(val, opt.score)}
              style={{
                padding: "16px 20px",
                border: `2px solid ${isSelected ? BRAND.colors.secondary : "#e2e8f0"}`,
                borderRadius: 10,
                backgroundColor: isSelected ? "#ebf4ff" : "white",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 15,
                lineHeight: 1.5,
                color: BRAND.colors.text,
                fontWeight: isSelected ? 600 : 400,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) (e.target as HTMLElement).style.borderColor = "#cbd5e0";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.target as HTMLElement).style.borderColor = "#e2e8f0";
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EmailCapture = ({
  email,
  setEmail,
  name,
  setName,
  orgName,
  setOrgName,
  onSubmit,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  orgName: string;
  setOrgName: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) => (
  <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
    <h2
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: BRAND.colors.primary,
        marginBottom: 12,
      }}
    >
      Your Assessment is Complete
    </h2>
    <p
      style={{
        color: BRAND.colors.muted,
        fontSize: 15,
        marginBottom: 32,
        lineHeight: 1.6,
      }}
    >
      Enter your details below to see your full AI Readiness Report with
      personalized recommendations for each dimension.
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "14px 18px",
          border: "2px solid #e2e8f0",
          borderRadius: 10,
          fontSize: 15,
          outline: "none",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
        onFocus={(e) => ((e.target as HTMLElement).style.borderColor = BRAND.colors.secondary)}
        onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "#e2e8f0")}
      />
      <input
        type="text"
        placeholder="Organization name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        style={{
          padding: "14px 18px",
          border: "2px solid #e2e8f0",
          borderRadius: 10,
          fontSize: 15,
          outline: "none",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
        onFocus={(e) => ((e.target as HTMLElement).style.borderColor = BRAND.colors.secondary)}
        onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "#e2e8f0")}
      />
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "14px 18px",
          border: "2px solid #e2e8f0",
          borderRadius: 10,
          fontSize: 15,
          outline: "none",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
        onFocus={(e) => ((e.target as HTMLElement).style.borderColor = BRAND.colors.secondary)}
        onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "#e2e8f0")}
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={!email || !name || loading}
      style={{
        width: "100%",
        padding: "16px",
        backgroundColor: !email || !name ? "#cbd5e0" : BRAND.colors.primary,
        color: "white",
        border: "none",
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 600,
        cursor: !email || !name ? "not-allowed" : "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      {loading ? "Generating your report..." : "See My Results"}
    </button>
    <p style={{ fontSize: 12, color: BRAND.colors.muted, marginTop: 12 }}>
      We will send a copy of your report to this email. No spam, no sales pressure.
    </p>
  </div>
);

const ScoreGauge = ({ score }: { score: number }) => {
  const level = READINESS_LEVELS.find((l) => score >= l.min && score <= l.max)!;
  const angle = (score / 100) * 180;
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <svg viewBox="0 0 200 120" style={{ width: 280, height: 170 }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e53e3e" />
            <stop offset="33%" stopColor="#d69e2e" />
            <stop offset="66%" stopColor="#2b6cb0" />
            <stop offset="100%" stopColor="#38a169" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 65 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
          y2={100 - 65 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
          stroke={BRAND.colors.text}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="4" fill={BRAND.colors.text} />
        <text x="100" y="88" textAnchor="middle" fontSize="28" fontWeight="700" fill={level.color}>
          {score}
        </text>
        <text x="100" y="75" textAnchor="middle" fontSize="9" fill={BRAND.colors.muted}>
          out of 100
        </text>
      </svg>
      <div style={{ marginTop: -8 }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 20px",
            backgroundColor: level.color,
            color: "white",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {level.level}
        </span>
      </div>
    </div>
  );
};

const DimensionBreakdown = ({
  dimensionScores,
}: {
  dimensionScores: Record<string, { pct: number }>;
}) => {
  const radarData = DIMENSIONS.map((d) => ({
    dimension: d.short,
    score: dimensionScores[d.key]?.pct || 0,
    fullMark: 100,
  }));

  const barData = DIMENSIONS.map((d) => ({
    name: d.short,
    score: dimensionScores[d.key]?.pct || 0,
    icon: d.icon,
  }));

  const getBarColor = (score: number) => {
    if (score >= 78) return BRAND.colors.success;
    if (score >= 56) return BRAND.colors.secondary;
    if (score >= 34) return BRAND.colors.warning;
    return BRAND.colors.danger;
  };

  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: BRAND.colors.primary,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Dimension Breakdown
      </h3>
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 400, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 12, fill: BRAND.colors.muted }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke={BRAND.colors.secondary}
                fill={BRAND.colors.secondary}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 400, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Score"]} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dimension detail cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {DIMENSIONS.map((d) => {
          const ds = dimensionScores[d.key] || { pct: 0 };
          const recKey = ds.pct >= 78 ? "high" : ds.pct >= 45 ? "mid" : "low";
          const rec = DIM_RECOMMENDATIONS[d.key][recKey];
          const color =
            ds.pct >= 78
              ? BRAND.colors.success
              : ds.pct >= 56
                ? BRAND.colors.secondary
                : ds.pct >= 34
                  ? BRAND.colors.warning
                  : BRAND.colors.danger;
          return (
            <div
              key={d.key}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "20px 24px",
                borderLeft: `4px solid ${color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: BRAND.colors.text }}>
                  {d.icon} {d.label}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color }}>{ds.pct}%</span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: BRAND.colors.muted,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {rec}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResultsPage = ({
  overallScore,
  dimensionScores,
  intake,
}: {
  overallScore: number;
  dimensionScores: Record<string, { pct: number }>;
  intake: { name: string; email: string; orgName: string };
}) => {
  const level = READINESS_LEVELS.find((l) => overallScore >= l.min && overallScore <= l.max)!;
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: BRAND.colors.primary,
            marginBottom: 4,
          }}
        >
          Your AI Readiness Report
        </h2>
        <p style={{ color: BRAND.colors.muted, fontSize: 14 }}>
          {intake.orgName ? `Prepared for ${intake.orgName}` : ""}{" "}
          {intake.orgName ? "·" : ""}{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <ScoreGauge score={overallScore} />

      <div
        style={{
          backgroundColor: "#f7fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 28,
          marginBottom: 40,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: level.color, marginBottom: 8 }}>
          {level.headline}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: BRAND.colors.text,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {level.summary}
        </p>
      </div>

      <DimensionBreakdown dimensionScores={dimensionScores} />

      <div
        style={{
          marginTop: 40,
          padding: 32,
          background: `linear-gradient(135deg, ${BRAND.colors.primary}, ${BRAND.colors.secondary})`,
          borderRadius: 16,
          textAlign: "center",
          color: "white",
        }}
      >
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>What Comes Next?</h3>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 24,
            opacity: 0.9,
            maxWidth: 500,
            margin: "0 auto 24px",
          }}
        >
          {level.cta} Every engagement begins with understanding your specific context, not selling
          you a tool.
        </p>
        <a
          href="https://thehumanfactor.ca/contact"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            backgroundColor: BRAND.colors.accent,
            color: "white",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Book a Free Advisory Call
        </a>
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 16 }}>
          Powered by the ARIA Method — AI Readiness & Implementation Approach
        </p>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 32,
          padding: "24px 0",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p style={{ fontSize: 13, color: BRAND.colors.muted }}>
          This assessment is provided by <strong>The Human Factor</strong> — Human Factors & Systems
          Design Engineering advisory practice.
          <br />
          We help organizations implement AI that fits how people actually work.
        </p>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────
export default function AIReadinessQuiz() {
  const [stage, setStage] = useState("welcome");
  const [intakeIndex, setIntakeIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<
    Record<string, { value: string; score: number; dimension: string }>
  >({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isEmergency = intakeAnswers.industry === "emergency_services";

  const getQuestions = () => {
    if (!isEmergency) return GENERAL_QUESTIONS;
    const replacements: Record<string, (typeof EMERGENCY_QUESTIONS)[number]> = {};
    EMERGENCY_QUESTIONS.forEach((eq) => {
      replacements[eq.replaces] = eq;
    });
    return GENERAL_QUESTIONS.map((q) => replacements[q.id] || q);
  };

  const questions = getQuestions();

  const getFilteredIntakeOptions = (q: (typeof INTAKE_QUESTIONS)[number]) => {
    if (!q.options) return [];
    return q.options.filter((opt) => {
      if (!("condition" in opt) || !opt.condition) return true;
      return intakeAnswers.industry === opt.condition;
    });
  };

  const handleIntakeSelect = (value: string) => {
    const q = INTAKE_QUESTIONS[intakeIndex];
    setIntakeAnswers((prev) => ({ ...prev, [q.id]: value }));
    setTimeout(() => {
      if (intakeIndex < INTAKE_QUESTIONS.length - 1) {
        setIntakeIndex(intakeIndex + 1);
      } else {
        setStage("assessment");
        setQuestionIndex(0);
      }
    }, 300);
  };

  const handleScoreSelect = (value: string, score?: number) => {
    const q = questions[questionIndex];
    setScores((prev) => ({
      ...prev,
      [q.id]: { value, score: score || 0, dimension: q.dimension },
    }));
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setStage("email");
      }
    }, 300);
  };

  const calculateResults = () => {
    const dimTotals: Record<string, { total: number; max: number; count: number }> = {};
    DIMENSIONS.forEach((d) => {
      dimTotals[d.key] = { total: 0, max: 0, count: 0 };
    });

    Object.values(scores).forEach((s) => {
      if (dimTotals[s.dimension]) {
        dimTotals[s.dimension].total += s.score;
        dimTotals[s.dimension].max += 3;
        dimTotals[s.dimension].count += 1;
      }
    });

    const dimensionScores: Record<string, { total: number; max: number; pct: number }> = {};
    let overallTotal = 0;
    let overallMax = 0;

    DIMENSIONS.forEach((d) => {
      const dt = dimTotals[d.key];
      const pct = dt.max > 0 ? Math.round((dt.total / dt.max) * 100) : 0;
      dimensionScores[d.key] = { total: dt.total, max: dt.max, pct };
      overallTotal += dt.total;
      overallMax += dt.max;
    });

    const overallScore = overallMax > 0 ? Math.round((overallTotal / overallMax) * 100) : 0;
    return { overallScore, dimensionScores };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const results = calculateResults();

    const params = new URLSearchParams(window.location?.search || "");

    await submitToAPI({
      name,
      email,
      org_name: orgName || null,
      industry: intakeAnswers.industry,
      org_size: intakeAnswers.org_size || null,
      role: intakeAnswers.role || null,
      overall_score: results.overallScore,
      dimension_scores: results.dimensionScores,
      raw_intake: intakeAnswers,
      raw_answers: scores,
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });

    setLoading(false);
    setStage("results");
  };

  const handleBack = () => {
    if (stage === "assessment" && questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (stage === "assessment" && questionIndex === 0) {
      setStage("intake");
      setIntakeIndex(INTAKE_QUESTIONS.length - 1);
    } else if (stage === "intake" && intakeIndex > 0) {
      setIntakeIndex(intakeIndex - 1);
    } else if (stage === "email") {
      setStage("assessment");
      setQuestionIndex(questions.length - 1);
    }
  };

  const { overallScore, dimensionScores } =
    stage === "results" ? calculateResults() : { overallScore: 0, dimensionScores: {} };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stage, intakeIndex, questionIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f7fafc",
        overflowY: "auto",
      }}
    >
      <header
        style={{
          padding: "20px 32px",
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: BRAND.colors.primary,
              letterSpacing: "-0.3px",
            }}
          >
            The Human Factor
          </div>
          <div
            style={{
              fontSize: 11,
              color: BRAND.colors.muted,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Human Factors & Systems Design Engineering
          </div>
        </div>
        {stage !== "welcome" && stage !== "results" && (
          <button
            onClick={handleBack}
            style={{
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: 13,
              color: BRAND.colors.muted,
            }}
          >
            Back
          </button>
        )}
      </header>

      <main style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
        {stage === "welcome" && (
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🧠</div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: BRAND.colors.primary,
                marginBottom: 12,
                lineHeight: 1.3,
              }}
            >
              Is Your Organization Ready for AI?
            </h1>
            <p
              style={{
                fontSize: 17,
                color: BRAND.colors.muted,
                lineHeight: 1.7,
                marginBottom: 12,
              }}
            >
              Most AI implementations fail not because the technology does not work, but because the
              implementation ignores how people actually work.
            </p>
            <p
              style={{
                fontSize: 15,
                color: BRAND.colors.text,
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              This 5-minute assessment evaluates your organization across six dimensions that
              determine AI implementation success: leadership, process maturity, data readiness,
              technical infrastructure, people and culture, and governance.
            </p>
            <button
              onClick={() => setStage("intake")}
              style={{
                padding: "16px 48px",
                backgroundColor: BRAND.colors.primary,
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = BRAND.colors.secondary)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = BRAND.colors.primary)
              }
            >
              Start Assessment
            </button>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                justifyContent: "center",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "⏱️", label: "5 minutes" },
                { icon: "📊", label: "6 dimensions" },
                { icon: "📋", label: "Personalized report" },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, color: BRAND.colors.muted, marginTop: 4 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 40, fontSize: 12, color: BRAND.colors.muted }}>
              Based on the ARIA Method — grounded in Human Factors, Systems Design Engineering, and
              Naturalistic Decision Making research.
            </p>
          </div>
        )}

        {stage === "intake" && (
          <QuestionCard
            question={{
              ...INTAKE_QUESTIONS[intakeIndex],
              options: getFilteredIntakeOptions(INTAKE_QUESTIONS[intakeIndex]),
            }}
            selectedValue={intakeAnswers[INTAKE_QUESTIONS[intakeIndex].id]}
            onSelect={handleIntakeSelect}
            questionNumber={intakeIndex + 1}
            total={INTAKE_QUESTIONS.length + questions.length}
            sectionLabel="About Your Organization"
          />
        )}

        {stage === "assessment" && (
          <QuestionCard
            question={questions[questionIndex]}
            selectedValue={scores[questions[questionIndex].id]?.value}
            onSelect={handleScoreSelect}
            questionNumber={INTAKE_QUESTIONS.length + questionIndex + 1}
            total={INTAKE_QUESTIONS.length + questions.length}
            sectionLabel={`${DIMENSIONS.find((d) => d.key === questions[questionIndex].dimension)?.icon || ""} ${DIMENSIONS.find((d) => d.key === questions[questionIndex].dimension)?.label || ""}`}
          />
        )}

        {stage === "email" && (
          <EmailCapture
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            orgName={orgName}
            setOrgName={setOrgName}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        {stage === "results" && (
          <ResultsPage
            overallScore={overallScore}
            dimensionScores={dimensionScores}
            intake={{ name, email, orgName }}
          />
        )}
      </main>
    </div>
  );
}
