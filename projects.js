// Project content, sourced from each repository's README.
const RAW = "https://raw.githubusercontent.com/yashikagarg16";

window.PROJECTS = [
  {
    id: "algo-trade",
    name: "Algo Trade Simulator",
    tagline: "Paper trading & honest backtesting",
    summary:
      "A full-stack paper-trading and backtesting platform. Pick a stock and a strategy and see how it would really have traded over the last two years — fees and slippage included — next to buy & hold and the S&P 500. Includes walk-forward testing, a machine-learning strategy written from scratch, and a Gemini copilot that runs backtests for you.",
    demo: "https://algo-trade-mu.vercel.app",
    repo: "https://github.com/yashikagarg16/Algo-Trade",
    cover: `${RAW}/Algo-Trade/main/docs/screenshots/dashboard.png`,
    stack: ["React", "TypeScript", "FastAPI", "MongoDB", "Gemini", "Docker"],
    stats: [
      ["4", "trading strategies"],
      ["10 bps", "fee on every trade"],
      ["8", "ML price features"],
      ["5 yrs", "walk-forward window"],
    ],
    problem:
      "Most backtests look great because they quietly cheat: they ignore fees, peek at future data, or tune parameters on the same period they report. This project is built to show what a strategy would honestly have done.",
    features: [
      ["Honest backtesting", "SMA crossover, Bollinger mean reversion, Donchian breakout and an ML model, simulated trade by trade. Decisions use only past data; every entry and exit pays fees plus adjustable slippage."],
      ["Risk analytics", "Return, volatility, Sharpe, Sortino, max drawdown, Calmar, beta and alpha vs the S&P 500, win rate and a growth-of-$1 chart."],
      ["Walk-forward testing", "Each quarter, parameters are tuned on the previous year and traded on the next unseen quarter — revealing how much edge was curve fitting."],
      ["ML strategy from scratch", "Logistic regression on 8 price features, refit monthly on a rolling window, reporting out-of-sample accuracy and ROC-AUC. No numpy or scikit-learn."],
      ["Trading copilot", "Gemini function calling runs the app's own backtester: “Compare strategies on NVDA” runs for real and answers with result cards. Works offline when rate-limited."],
      ["Strategy Builder & portfolio", "Compose rules like “RSI(14) below 30”, add stop-loss/take-profit, then invest paper money and track live P&L."],
    ],
    architecture: [
      "React + TypeScript (Vite) client",
      "FastAPI routes: auth · market · simulations · analytics · chat",
      "Backtester → risk metrics · ML model · walk-forward",
      "Copilot tools via Gemini function calling",
      "Store interface → MongoDB or in-memory",
      "Yahoo Finance chart API for market data",
    ],
    gallery: [
      ["strategy-lab.png", "Strategy lab: risk vs buy & hold and the S&P 500"],
      ["walk-forward.png", "Walk-forward test, fold by fold"],
      ["ml-strategy.png", "Machine-learning strategy"],
      ["copilot-actions.png", "Copilot running real backtests"],
      ["portfolio.png", "Paper-trading portfolio"],
      ["builder.png", "Strategy Builder"],
    ].map(([f, c]) => [`${RAW}/Algo-Trade/main/docs/screenshots/${f}`, c]),
  },
  {
    id: "campus-inbox-agent",
    name: "Campus Inbox Agent",
    tagline: "Placement emails → verified eligibility",
    summary:
      "Reads placement and internship emails, extracts the key facts (company, role, deadline, eligibility, form link) and checks eligibility against your profile in plain code — showing the exact sentence behind every decision. When it can't be sure it says “needs review” instead of guessing, and it never submits anything for you.",
    demo: "https://campus-inbox-agent.vercel.app",
    repo: "https://github.com/yashikagarg16/Campus-Inbox-Agent",
    cover: null,
    stack: ["FastAPI", "React", "TypeScript", "PostgreSQL", "Gemini", "Vercel"],
    stats: [
      ["35/38", "verdicts correct (synthetic)"],
      ["0", "confidently wrong"],
      ["174", "backend + frontend tests"],
      ["7", "pipeline stages"],
    ],
    problem:
      "Students get dozens of placement emails with eligibility rules buried in prose. An LLM alone will happily invent a deadline or misread a CGPA cutoff. Here the LLM only reads and writes — “Is 8.4 ≥ 8.5?” is an if statement, not a prompt.",
    features: [
      ["Evidence guard", "Every extracted value must come with a quote that actually exists in the email and contains the value. Failed fields are retried, then blanked — turning the verdict into “needs review”."],
      ["Rule engine, no LLM", "Eligible / Not eligible / Needs review decided in code. Hedges like “may be relaxed”, unknown branches or scale mismatches abstain instead of guessing."],
      ["Digest splitting", "One email listing several companies becomes several opportunities, each with its own criteria and verdict."],
      ["Drafted form answers", "Answers drafted only from your profile; missing facts become [NEEDS INPUT] and can't be approved until filled."],
      ["Read-only inbox sync", "Outlook via Microsoft Graph (Mail.Read) or IMAP with readonly + BODY.PEEK — mail is never changed or marked read."],
      ["Private accounts", "Per-user data scoping, PBKDF2 passwords, HMAC sessions, rate limits and daily LLM usage caps."],
    ],
    architecture: [
      "Email in: paste · .eml upload · read-only IMAP / Graph",
      "Parse, clean & de-duplicate",
      "LLM extracts fields + supporting quotes",
      "Pydantic validation with retry",
      "Evidence guard rejects unsupported values",
      "Rule engine → eligible / not eligible / needs review",
      "Dashboard, evidence viewer & full audit log",
    ],
    gallery: [],
  },
  {
    id: "revenueguard",
    name: "RevenueGuard AI",
    tagline: "Autonomous payment-recovery agent",
    summary:
      "A permission-gated merchant agent built for the Razorpay hackathon (Track 01: AI Growth & Agentic Commerce). It detects payment and checkout leaks with deterministic metrics, diagnoses root causes from grounded telemetry, and executes approved recovery actions through Razorpay Test Mode — behind a safety engine and a SHA-256 hash-chained audit ledger.",
    demo: "https://revenue-guard-rho.vercel.app",
    repo: "https://github.com/yashikagarg16/RevenueGuard",
    cover: `${RAW}/RevenueGuard/main/docs/screenshots/01_growth_overview.png`,
    stack: ["Python", "FastAPI", "Razorpay SDK", "SQLite", "JavaScript", "Vercel"],
    stats: [
      ["₹2.37L", "revenue at risk found"],
      ["₹1.42L", "expected recovery"],
      ["+8.9%", "top-line GMV lift"],
      ["5", "safety checks per action"],
    ],
    problem:
      "Merchants lose 15–20% of GMV to gateway timeouts, 3DS friction and abandoned checkouts — not lack of intent. Letting an AI touch money is risky, so the agent can only inspect and propose; deterministic code and a human approve every rupee.",
    features: [
      ["Deterministic leak detection", "High-value failures, abandoned orders and repeat-customer friction, reconciling to exactly 100% of revenue at risk — no LLM arithmetic."],
      ["Grounded AI investigation", "Evidence → Known facts → Inference → Unknowns → Confidence → Action & ROI, without hallucinating unobserved causes."],
      ["Least-privilege tools", "The agent only has inspection tools and a request_recovery tool that routes proposals to the safety engine."],
      ["Safety engine", "Record integrity, exact amount match, ₹50k ceiling, SHA-256 idempotency lock and a circuit breaker on provider timeouts."],
      ["Hash-chained audit ledger", "Every analysis, approval and API dispatch is a tamper-evident block with a built-in chain verifier."],
      ["Failure simulations", "Live scenarios for API timeouts, duplicate requests and amount-tampering attacks — each provably blocked."],
    ],
    architecture: [
      "Merchant dashboard (growth · leaks · AI · approval · audit)",
      "FastAPI application core",
      "Analytics layer — deterministic math",
      "AI agent — grounded reasoning with controlled tools",
      "Safety engine → human approval gate",
      "Provider layer: Razorpay Test Mode or demo sandbox",
      "SHA-256 audit ledger records every step",
    ],
    gallery: [
      ["02_revenue_leaks.png", "Revenue leaks & opportunities"],
      ["03_agentic_investigation.png", "Agentic investigation"],
      ["04_approval_center.png", "Approval & commerce dispatch"],
      ["05_audit_resilience.png", "Audit ledger & resilience"],
    ].map(([f, c]) => [`${RAW}/RevenueGuard/main/docs/screenshots/${f}`, c]),
  },
];
