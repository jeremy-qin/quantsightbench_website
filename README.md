# QuantSightBench Website

Static landing page and leaderboard for the QuantSightBench benchmark.

## Running locally

No build step. Serve the directory over HTTP so relative script paths resolve:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` also works in most browsers.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Page markup: hero, leaderboard, findings, analysis, methodology, about. |
| `style.css` | Dark-theme styling. |
| `app.js` | Renders the leaderboard table and all Chart.js figures from `data.js`. |
| `data.js` | All numeric data (leaderboard, reasoning effort, settings, calibration). Single source of truth. |

## Updating numbers

All benchmark data lives in `data.js` and mirrors tables from the paper at `../quantsightbench_paper/`:

| Constant in `data.js` | Paper source |
|---|---|
| `LEADERBOARD_DATA` | `tab:agentic-leaderboard` (agentic setting, high reasoning effort) |
| `REASONING_DATA` | `tab:reasoning-effort` (background-context) |
| `SETTINGS_DATA` | `tab:settings-comparison` (zero-shot / background-context / agentic) |
| `CALIBRATION_DATA` | `tab:calibration` (80 / 90 / 95% target coverage) |

The no-confidence-specification ablation (`tab:no-conf-ablation`) is inlined as an HTML table in `index.html`.

After editing `data.js`, a hard refresh (`Cmd+Shift+R`) is enough — Chart.js re-renders from the new values.

## Adding a model to the leaderboard

1. Append a row to `LEADERBOARD_DATA` with `model`, `provider`, `coverage` (0–1), and `mean_log_is`.
2. If the provider is new, add a color to `PROVIDER_COLORS` and (optionally) update the hero `Providers` stat in `index.html`.
3. Update the hero `Models` stat in `index.html` if the count changed.
