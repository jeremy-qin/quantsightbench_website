// QuantSightBench Leaderboard Data — Agentic setting, high reasoning effort (paper Table: tab:agentic-leaderboard)
const LEADERBOARD_DATA = [
  { model: "Gemini 3.1 Pro",   provider: "Google",    coverage: 0.7910, mean_log_is: 7.26 },
  { model: "Grok 4",           provider: "xAI",       coverage: 0.7638, mean_log_is: 7.44 },
  { model: "GPT-5.4",          provider: "OpenAI",    coverage: 0.7533, mean_log_is: 7.32 },
  { model: "GPT-5.1",          provider: "OpenAI",    coverage: 0.7459, mean_log_is: 6.70 },
  { model: "Opus 4.6",         provider: "Anthropic", coverage: 0.7360, mean_log_is: 7.00 },
  { model: "Opus 4.5",         provider: "Anthropic", coverage: 0.7166, mean_log_is: 7.07 },
  { model: "Sonnet 4.5",       provider: "Anthropic", coverage: 0.6796, mean_log_is: 7.97 },
  { model: "Kimi K2 Thinking", provider: "Moonshot",  coverage: 0.6579, mean_log_is: 6.81 },
  { model: "Gemini 3 Pro",     provider: "Google",    coverage: 0.6543, mean_log_is: 7.52 },
  { model: "GLM-4.7",          provider: "Z.ai",      coverage: 0.6269, mean_log_is: 7.49 },
  { model: "DeepSeek v3.2",    provider: "DeepSeek",  coverage: 0.6148, mean_log_is: 8.58 },
];

const PROVIDER_COLORS = {
  "Anthropic": "#d97706",
  "OpenAI":    "#10b981",
  "Google":    "#3b82f6",
  "Moonshot":  "#a855f7",
  "xAI":       "#ef4444",
  "Z.ai":      "#06b6d4",
  "DeepSeek":  "#ec4899",
};

// ===== Analysis Data =====

// Reasoning effort: coverage and mean_log_is at low / medium / high
// Source: paper Table tab:reasoning-effort (background-context setting)
const REASONING_DATA = {
  labels: ["low", "medium", "high"],
  models: [
    { name: "GPT-5.1",      color: "#10b981", coverage: [77.10, 78.38, 75.98], logIS: [7.43, 6.97, 7.42] },
    { name: "Opus 4.5",     color: "#d97706", coverage: [65.36, 69.72, 72.55], logIS: [7.45, 7.05, 6.74] },
    { name: "Sonnet 4.5",   color: "#ffbb78", coverage: [69.93, 71.35, 72.66], logIS: [8.35, 8.12, 7.80] },
    { name: "Gemini 3 Pro", color: "#3b82f6", coverage: [63.10, null, 65.03], logIS: [8.62, null, 8.29] },
  ],
};

// Settings comparison: zero-shot / background-context / agentic for each model
// Source: paper Table tab:settings-comparison
const SETTINGS_DATA = {
  models: ["GPT-5.1", "Sonnet 4.5", "Gemini 3 Pro", "Grok 4", "GLM-4.7", "DeepSeek v3.2", "Kimi K2 Thinking"],
  settings: {
    "Zero-Shot": {
      color: "#636363",
      coverage: [76.31, 70.74, 63.86, 70.52, 51.58, 57.33, 60.49],
      logIS:    [8.03, 7.95, 8.69, 7.33, 10.90, 9.79, 9.45],
    },
    "Background-Context": {
      color: "#6366f1",
      coverage: [79.24, 71.35, 65.03, 75.24, 55.69, 55.40, 62.59],
      logIS:    [6.65, 8.12, 8.29, 7.27, 9.40, 9.28, 7.61],
    },
    "Agentic": {
      color: "#ef4444",
      coverage: [75.62, 67.19, 65.43, 76.38, 62.69, 61.48, 65.79],
      logIS:    [7.16, 8.47, 7.52, 7.44, 7.49, 8.58, 6.81],
    },
  },
};

// Calibration: target coverage vs actual coverage, mean log width, and mean log IS
// Source: paper Table tab:calibration (background-context setting)
const CALIBRATION_DATA = {
  targets: [80, 90, 95],
  models: [
    {
      name: "GPT-5.1", color: "#10b981",
      actual:   [66.13, 76.03, 80.09],
      logWidth: [4.55, 4.84, 5.05],
      logIS:    [8.24, 7.36, 6.68],
    },
    {
      name: "Opus 4.5", color: "#d97706",
      actual:   [66.27, 72.52, 76.19],
      logWidth: [4.49, 4.69, 4.83],
      logIS:    [7.44, 6.74, 6.26],
    },
    {
      name: "Gemini 3 Pro", color: "#3b82f6",
      actual:   [61.73, 64.97, 67.44],
      logWidth: [4.06, 4.14, 4.25],
      logIS:    [9.31, 8.25, 7.92],
    },
  ],
};
