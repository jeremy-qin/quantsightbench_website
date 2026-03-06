// PIBench Leaderboard Data — Default V3 models (one per family, default reasoning)
const LEADERBOARD_DATA = [
  { model: "Kimi K2.5",       provider: "Moonshot",  coverage: 0.6993, mean_log_is: 6.327, median_is: 81.0, invalid: 82 },
  { model: "Opus 4.5",        provider: "Anthropic", coverage: 0.7252, mean_log_is: 6.736, median_is: 70.0, invalid: 72 },
  { model: "GPT-5.1",         provider: "OpenAI",    coverage: 0.784,  mean_log_is: 6.916, median_is: 75.0, invalid: 74 },
  { model: "Grok 4",          provider: "xAI",       coverage: 0.7524, mean_log_is: 7.27,  median_is: 70.0, invalid: 79 },
  { model: "Kimi K2 Thinking",provider: "Moonshot",  coverage: 0.6259, mean_log_is: 7.619, median_is: 80.0, invalid: 198 },
  { model: "Sonnet 4.5",      provider: "Anthropic", coverage: 0.7274, mean_log_is: 7.74,  median_is: 75.0, invalid: 72 },
  { model: "GLM-5",           provider: "Z.ai",      coverage: 0.6576, mean_log_is: 7.955, median_is: 78.0, invalid: 153 },
  { model: "Gemini 3 Pro",    provider: "Google",    coverage: 0.6497, mean_log_is: 8.25,  median_is: 50.0, invalid: 75 },
  { model: "DeepSeek v3.2",   provider: "DeepSeek",  coverage: 0.554,  mean_log_is: 9.283, median_is: 98.0, invalid: 74 },
  { model: "GLM-4.7",         provider: "Z.ai",      coverage: 0.5569, mean_log_is: 9.41,  median_is: 98.0, invalid: 86 },
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
const REASONING_DATA = {
  labels: ["low", "medium", "high"],
  models: [
    { name: "GPT-5.1",      color: "#10b981", coverage: [77.2, 78.4, 76.0], logIS: [7.38, 6.92, 7.36] },
    { name: "Opus 4.5",     color: "#d97706", coverage: [65.4, 69.7, 72.5], logIS: [7.41, 7.05, 6.74] },
    { name: "Sonnet 4.5",   color: "#ffbb78", coverage: [69.9, 71.4, 72.7], logIS: [8.29, 8.05, 7.74] },
    { name: "Gemini 3 Pro", color: "#3b82f6", coverage: [63.1, null, 65.0], logIS: [8.60, null, 8.25] },
  ],
};

// Settings comparison: zero-shot / informed / agentic for each model
const SETTINGS_DATA = {
  models: ["GPT-5.1", "Sonnet 4.5", "Gemini 3 Pro", "Grok 4", "GLM-4.7", "DeepSeek v3.2", "Kimi K2 Thinking"],
  settings: {
    "Zero-Shot": {
      color: "#636363",
      coverage: [76.3, 70.7, 63.9, 70.5, 51.6, 57.3, 60.5],
      logIS:    [7.96, 7.93, 8.69, 7.33, 10.90, 9.79, 9.45],
    },
    "Informed": {
      color: "#6366f1",
      coverage: [78.4, 71.4, 65.0, 75.2, 55.7, 55.4, 62.6],
      logIS:    [6.92, 8.05, 8.25, 7.27, 9.41, 9.28, 7.62],
    },
    "Agentic": {
      color: "#ef4444",
      coverage: [74.0, 67.2, 65.4, 76.4, 62.7, 61.5, 65.8],
      logIS:    [7.22, 8.47, 7.52, 7.44, 7.49, 8.58, 6.81],
    },
  },
};

// Calibration: target coverage vs actual coverage & interval width
const CALIBRATION_DATA = {
  targets: [80, 90, 95],
  models: [
    {
      name: "GPT-5.1", color: "#10b981",
      actual:   [66.1, 78.4, 80.1],
      logWidth: [4.55, 4.97, 5.05],
      logIS:    [8.24, 6.92, 6.68],
    },
    {
      name: "Opus 4.5", color: "#d97706",
      actual:   [66.3, 69.7, 76.2],
      logWidth: [4.49, 4.58, 4.83],
      logIS:    [7.44, 7.05, 6.26],
    },
    {
      name: "Gemini 3 Pro", color: "#3b82f6",
      actual:   [61.7, 65.0, 67.4],
      logWidth: [4.06, 4.14, 4.25],
      logIS:    [9.31, 8.25, 7.92],
    },
  ],
};
