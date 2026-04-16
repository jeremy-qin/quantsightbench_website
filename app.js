// ===== State =====
let currentSort = "coverage";
let sortAscending = true;

// ===== Helpers =====
function getCoverageColor(coverage) {
  if (coverage >= 0.80) return "#10b981";
  if (coverage >= 0.70) return "#3b82f6";
  if (coverage >= 0.60) return "#f59e0b";
  return "#ef4444";
}

function sortData(data, col, ascending) {
  const sorted = [...data];
  sorted.sort((a, b) => {
    const va = a[col], vb = b[col];
    if (col === "coverage") {
      // Higher coverage is better
      return ascending ? vb - va : va - vb;
    }
    return ascending ? va - vb : vb - va;
  });
  return sorted;
}

// ===== Render Table =====
function renderTable() {
  const sorted = sortData(LEADERBOARD_DATA, currentSort, sortAscending);
  const tbody = document.getElementById("leaderboardBody");

  tbody.innerHTML = sorted.map((entry, i) => {
    const rank = i + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : "";
    const rankHtml = rank <= 3
      ? `<span class="rank-badge ${rankClass}">${rank}</span>`
      : `<span style="color: var(--text-muted)">${rank}</span>`;

    const coverageColor = getCoverageColor(entry.coverage);
    const coveragePct = (entry.coverage * 100).toFixed(1);
    const coverageWidth = Math.min(100, (entry.coverage / 0.9) * 100);

    return `<tr>
      <td class="col-rank">${rankHtml}</td>
      <td class="col-model">
        <span class="model-name">${entry.model}</span>
      </td>
      <td class="col-provider">
        <span class="provider-badge">
          <span class="provider-dot" style="background:${PROVIDER_COLORS[entry.provider]}"></span>
          ${entry.provider}
        </span>
      </td>
      <td class="metric-value">
        <div class="coverage-bar">
          <div class="coverage-fill">
            <div class="coverage-fill-inner" style="width:${coverageWidth}%;background:${coverageColor}"></div>
          </div>
          <span style="color:${coverageColor}">${coveragePct}%</span>
        </div>
      </td>
      <td class="metric-value">${entry.mean_log_is.toFixed(3)}</td>
    </tr>`;
  }).join("");
}

// ===== Sort Arrows =====
function updateSortArrows() {
  document.querySelectorAll(".sort-arrow").forEach(el => {
    el.classList.remove("active-sort");
    el.innerHTML = "&#9650;";
  });
  const activeCol = document.querySelector(`[data-col="${currentSort}"] .sort-arrow`);
  if (activeCol) {
    activeCol.classList.add("active-sort");
    activeCol.innerHTML = sortAscending ? "&#9650;" : "&#9660;";
  }
}

// ===== Event Listeners =====
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  sortAscending = true;
  updateSortArrows();
  renderTable();
});

document.querySelectorAll(".sortable").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.col;
    if (currentSort === col) {
      sortAscending = !sortAscending;
    } else {
      currentSort = col;
      sortAscending = true;
    }
    document.getElementById("sortSelect").value = currentSort;
    updateSortArrows();
    renderTable();
  });
});

// ===== Charts =====
function initCharts() {
  // Chart.js defaults for dark theme
  Chart.defaults.color = "#9d9db0";
  Chart.defaults.borderColor = "#232330";
  Chart.defaults.font.family = "'Inter', sans-serif";

  // --- Scatter: Coverage vs Mean Log IS ---
  const scatterCtx = document.getElementById("scatterChart").getContext("2d");
  new Chart(scatterCtx, {
    type: "scatter",
    data: {
      datasets: Object.keys(PROVIDER_COLORS).map(provider => {
        const providerData = LEADERBOARD_DATA.filter(d => d.provider === provider);
        return {
          label: provider,
          data: providerData.map(d => ({
            x: d.mean_log_is,
            y: d.coverage * 100,
            label: d.model,
          })),
          backgroundColor: PROVIDER_COLORS[provider] + "cc",
          borderColor: PROVIDER_COLORS[provider],
          borderWidth: 1.5,
          pointRadius: 8,
          pointHoverRadius: 11,
        };
      }).filter(ds => ds.data.length > 0),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const pt = ctx.raw;
              return `${pt.label}: Mean Log IS ${pt.x.toFixed(3)}, Coverage ${pt.y.toFixed(1)}%`;
            },
          },
          backgroundColor: "#1c1c28",
          titleColor: "#e8e8ed",
          bodyColor: "#9d9db0",
          borderColor: "#232330",
          borderWidth: 1,
          padding: 12,
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
            font: { size: 11 },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Mean Log Interval Score (lower = better)", font: { size: 12 } },
          grid: { color: "#1a1a28" },
        },
        y: {
          title: { display: true, text: "Coverage (%)", font: { size: 12 } },
          grid: { color: "#1a1a28" },
        },
      },
    },
    plugins: [{
      id: "targetLine",
      afterDraw(chart) {
        const yScale = chart.scales.y;
        const ctx = chart.ctx;
        const y = yScale.getPixelForValue(90);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "#ef444488";
        ctx.lineWidth = 2;
        ctx.moveTo(chart.chartArea.left, y);
        ctx.lineTo(chart.chartArea.right, y);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.font = "11px Inter";
        ctx.fillText("90% target", chart.chartArea.left + 4, y - 6);
        ctx.restore();
      },
    }],
  });

  // --- Bar: Coverage by model (highest to lowest coverage) ---
  const sortedByScore = [...LEADERBOARD_DATA].sort((a, b) => b.coverage - a.coverage);

  const coverageCtx = document.getElementById("coverageChart").getContext("2d");
  new Chart(coverageCtx, {
    type: "bar",
    data: {
      labels: sortedByScore.map(d => d.model),
      datasets: [{
        data: sortedByScore.map(d => d.coverage * 100),
        backgroundColor: sortedByScore.map(d => PROVIDER_COLORS[d.provider] + "cc"),
        borderColor: sortedByScore.map(d => PROVIDER_COLORS[d.provider]),
        borderWidth: 1.5,
        borderRadius: 6,
        maxBarThickness: 40,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Coverage: ${ctx.raw.toFixed(1)}%`,
          },
          backgroundColor: "#1c1c28",
          titleColor: "#e8e8ed",
          bodyColor: "#9d9db0",
          borderColor: "#232330",
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Coverage (%)", font: { size: 12 } },
          min: 0,
          max: 100,
          grid: { color: "#1a1a28" },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
    plugins: [{
      id: "targetLine",
      afterDraw(chart) {
        const xScale = chart.scales.x;
        const ctx = chart.ctx;
        const x = xScale.getPixelForValue(90);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "#ef444488";
        ctx.lineWidth = 2;
        ctx.moveTo(x, chart.chartArea.top);
        ctx.lineTo(x, chart.chartArea.bottom);
        ctx.stroke();
        ctx.fillStyle = "#ef4444";
        ctx.font = "11px Inter";
        ctx.fillText("90% target", x + 4, chart.chartArea.top + 14);
        ctx.restore();
      },
    }],
  });
}

// ===== Analysis Charts =====
function initAnalysisCharts() {
  const tooltipStyle = {
    backgroundColor: "#1c1c28",
    titleColor: "#e8e8ed",
    bodyColor: "#9d9db0",
    borderColor: "#232330",
    borderWidth: 1,
    padding: 12,
  };
  const gridColor = "#1a1a28";

  // --- Shared helper: 90% target line (horizontal) ---
  const targetLinePlugin = (targetVal) => ({
    id: "targetLine_" + Math.random(),
    afterDraw(chart) {
      const yScale = chart.scales.y;
      const ctx = chart.ctx;
      const y = yScale.getPixelForValue(targetVal);
      if (y < chart.chartArea.top || y > chart.chartArea.bottom) return;
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = "#ef444466";
      ctx.lineWidth = 1.5;
      ctx.moveTo(chart.chartArea.left, y);
      ctx.lineTo(chart.chartArea.right, y);
      ctx.stroke();
      ctx.fillStyle = "#ef444499";
      ctx.font = "11px Inter";
      ctx.fillText("90% target", chart.chartArea.right - 70, y - 6);
      ctx.restore();
    },
  });

  // ========== 1. Reasoning Effort ==========
  const reasoningLineOpts = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom", labels: { usePointStyle: true, padding: 14, font: { size: 11 } } }, tooltip: { ...tooltipStyle } },
    scales: {
      x: { grid: { color: gridColor } },
      y: { title: { display: true, text: yLabel, font: { size: 12 } }, grid: { color: gridColor } },
    },
  });

  // Coverage
  new Chart(document.getElementById("reasoningCoverage"), {
    type: "line",
    data: {
      labels: REASONING_DATA.labels,
      datasets: REASONING_DATA.models.map(m => ({
        label: m.name,
        data: m.coverage,
        borderColor: m.color,
        backgroundColor: m.color + "33",
        pointBackgroundColor: m.color,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 2.5,
        tension: 0.2,
        spanGaps: true,
      })),
    },
    options: reasoningLineOpts("Coverage (%)"),
    plugins: [targetLinePlugin(90)],
  });

  // Mean Log IS
  new Chart(document.getElementById("reasoningLogIS"), {
    type: "line",
    data: {
      labels: REASONING_DATA.labels,
      datasets: REASONING_DATA.models.map(m => ({
        label: m.name,
        data: m.logIS,
        borderColor: m.color,
        backgroundColor: m.color + "33",
        pointBackgroundColor: m.color,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 2.5,
        tension: 0.2,
        spanGaps: true,
      })),
    },
    options: reasoningLineOpts("Mean Log IS"),
  });

  // ========== 2. Settings Comparison ==========
  const settingsBarOpts = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom", labels: { padding: 14, font: { size: 11 } } },
      tooltip: { ...tooltipStyle },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 30 } },
      y: { title: { display: true, text: yLabel, font: { size: 12 } }, grid: { color: gridColor } },
    },
  });

  const settingsNames = Object.keys(SETTINGS_DATA.settings);

  // Coverage
  new Chart(document.getElementById("settingsCoverage"), {
    type: "bar",
    data: {
      labels: SETTINGS_DATA.models,
      datasets: settingsNames.map(s => ({
        label: s,
        data: SETTINGS_DATA.settings[s].coverage,
        backgroundColor: SETTINGS_DATA.settings[s].color + "cc",
        borderColor: SETTINGS_DATA.settings[s].color,
        borderWidth: 1.5,
        borderRadius: 4,
      })),
    },
    options: { ...settingsBarOpts("Coverage (%)"), scales: { ...settingsBarOpts("Coverage (%)").scales, y: { ...settingsBarOpts("Coverage (%)").scales.y, min: 40, max: 85 } } },
    plugins: [targetLinePlugin(90)],
  });

  // Mean Log IS
  new Chart(document.getElementById("settingsLogIS"), {
    type: "bar",
    data: {
      labels: SETTINGS_DATA.models,
      datasets: settingsNames.map(s => ({
        label: s,
        data: SETTINGS_DATA.settings[s].logIS,
        backgroundColor: SETTINGS_DATA.settings[s].color + "cc",
        borderColor: SETTINGS_DATA.settings[s].color,
        borderWidth: 1.5,
        borderRadius: 4,
      })),
    },
    options: settingsBarOpts("Mean Log IS"),
  });

  // ========== 3. Calibration ==========
  // Target vs Actual Coverage
  const calibCtx = document.getElementById("calibrationCoverage");
  new Chart(calibCtx, {
    type: "line",
    data: {
      labels: CALIBRATION_DATA.targets.map(t => t + "%"),
      datasets: CALIBRATION_DATA.models.map(m => ({
        label: m.name,
        data: m.actual,
        borderColor: m.color,
        backgroundColor: m.color + "33",
        pointBackgroundColor: m.color,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 2.5,
        tension: 0.2,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "bottom", labels: { usePointStyle: true, padding: 14, font: { size: 11 } } },
        tooltip: { ...tooltipStyle },
      },
      scales: {
        x: { title: { display: true, text: "Target Coverage", font: { size: 12 } }, grid: { color: gridColor } },
        y: { title: { display: true, text: "Actual Coverage (%)", font: { size: 12 } }, grid: { color: gridColor }, min: 55, max: 100 },
      },
    },
    plugins: [{
      id: "perfectCalibLine",
      afterDraw(chart) {
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = "#9d9db044";
        ctx.lineWidth = 1.5;
        // Draw diagonal from (80,80) to (95,95) mapped to pixel coords
        const targets = [80, 90, 95];
        const xPositions = targets.map((_, i) => xScale.getPixelForValue(i));
        const yPositions = targets.map(t => yScale.getPixelForValue(t));
        ctx.moveTo(xPositions[0], yPositions[0]);
        ctx.lineTo(xPositions[1], yPositions[1]);
        ctx.lineTo(xPositions[2], yPositions[2]);
        ctx.stroke();
        ctx.fillStyle = "#9d9db066";
        ctx.font = "10px Inter";
        ctx.fillText("Perfect calibration", xPositions[0] + 4, yPositions[0] - 8);
        ctx.restore();
      },
    }],
  });

  // Mean Log IS by Target Coverage
  new Chart(document.getElementById("calibrationLogIS"), {
    type: "line",
    data: {
      labels: CALIBRATION_DATA.targets.map(t => t + "%"),
      datasets: CALIBRATION_DATA.models.map(m => ({
        label: m.name,
        data: m.logIS,
        borderColor: m.color,
        backgroundColor: m.color + "33",
        pointBackgroundColor: m.color,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 2.5,
        tension: 0.2,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "bottom", labels: { usePointStyle: true, padding: 14, font: { size: 11 } } },
        tooltip: { ...tooltipStyle },
      },
      scales: {
        x: { title: { display: true, text: "Target Coverage", font: { size: 12 } }, grid: { color: gridColor } },
        y: { title: { display: true, text: "Mean Log IS (lower = better)", font: { size: 12 } }, grid: { color: gridColor } },
      },
    },
  });
}

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== Navbar scroll effect =====
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 20) {
    nav.style.borderBottomColor = "var(--border-light)";
  } else {
    nav.style.borderBottomColor = "var(--border)";
  }
});

// ===== Init =====
renderTable();
initCharts();
initAnalysisCharts();
