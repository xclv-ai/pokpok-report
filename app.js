// app.js — robust loader + visible error messages
const $ = (q, el = document) => el.querySelector(q);

function fail(msg, err) {
  const panel = $("#ksp") || document.body;
  const box = document.createElement("div");
  box.style.cssText = "margin:16px;padding:12px;border:1px solid #fecaca;background:#fff1f2;color:#7f1d1d;border-radius:8px;";
  box.textContent = "Error: " + msg;
  panel.prepend(box);
  console.error(msg, err || "");
}

document.addEventListener("DOMContentLoaded", () => {
  // Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const activeBtn = document.querySelector(".tab-btn.active");
      if (activeBtn) activeBtn.classList.remove("active");
      btn.classList.add("active");
      const activeTab = document.querySelector(".tab-content.active");
      if (activeTab) activeTab.classList.remove("active");
      const next = document.getElementById(btn.dataset.tab);
      if (next) next.classList.add("active");
    });
  });

  // Load JSON
  fetch("data.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error(`data.json HTTP ${r.status}`);
      return r.json();
    })
    .then(json => {
      const r = json && json.Brand_Perception_Gaps_Analysis;
      if (!r) {
        fail("Missing key: Brand_Perception_Gaps_Analysis in data.json");
        return;
      }
      try {
        renderKSP(r);
        renderTOV(r);
        renderArchetypes(r);
        renderOverall(r);
      } catch (e) {
        fail("Render failed. Likely field mismatch in data.json.", e);
      }
    })
    .catch(e => fail("Could not load data.json (path, caching, or .nojekyll). Hard refresh (Cmd/Ctrl+Shift+R).", e));
});

function renderKSP(r) {
  const kspDiv = $("#ksp-list");
  if (!kspDiv) return;
  kspDiv.innerHTML = r.key_selling_points ? `<p>${r.key_selling_points}</p>` : "<p>No KSP narrative provided.</p>";

  const ctx = document.getElementById("ksp-chart")?.getContext("2d");
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Missing", "Extra", "Shared"],
      datasets: [{ data: [2, 1, 3], backgroundColor: ["#fecaca", "#bbf7d0", "#e5e7eb"], borderWidth: 0 }]
    },
    options: { plugins: { legend: { display: false } }, animation: { duration: 700 } }
  });
}

function parseTOV(str) {
  if (!str) return {};
  const res = {};
  str.split(";").map(s => s.trim()).filter(Boolean).forEach(line => {
    const [label, rest] = line.split(":");
    const num = rest ? Number((rest.match(/\d+/) || [0])[0]) : 0;
    res[(label || "Axis").trim()] = num;
  });
  return res;
}

function renderTOV(r) {
  const wrap = document.getElementById("tov-sliders");
  if (!wrap) return;
  wrap.innerHTML = "";

  const t = parseTOV(r.tone_of_voice_evaluation?.target_tov);
  const p = parseTOV(r.tone_of_voice_evaluation?.actual_pdp_tov);

  const axes = Object.keys(t).length ? Object.keys(t) : Object.keys(p);
  if (!axes.length) {
    wrap.innerHTML = `<p class="small">No tone-of-voice scales found in data.json.</p>`;
    return;
  }

  axes.forEach(axis => {
    const tVal = t[axis] ?? 0, pVal = p[axis] ?? 0;
    const row = document.createElement("div");
    row.className = "slider-wrap";
    row.innerHTML = `
      <div class="slider-label"><span>${axis}</span><span>Target: ${tVal} | PDP: ${pVal}</span></div>
      <input type="range" min="0" max="4" value="${pVal}" disabled />
    `;
    wrap.appendChild(row);
  });
}

function parseBAM(str) {
  if (!str) return {};
  const out = {};
  (str.match(/([A-Za-z ]+)\s\((\d+)%\)/g) || []).forEach(m => {
    const name = m.replace(/\s\(\d+%\)/, "").trim();
    const num = Number((m.match(/\((\d+)%\)/) || [])[1]) || 0;
    out[name] = num;
  });
  return out;
}

function renderArchetypes(r) {
  const ctx = document.getElementById("archetype-chart")?.getContext("2d");
  if (!ctx || !window.Chart) return;

  const t = parseBAM(r.brand_archetypes_mix_evaluation?.target_bam);
  const a = parseBAM(r.brand_archetypes_mix_evaluation?.actual_pdp_bam);
  const labels = [...new Set([...Object.keys(t), ...Object.keys(a)])];
  if (!labels.length) {
    ctx.canvas.insertAdjacentHTML("afterend", `<p class="small">No archetype mix found in data.json.</p>`);
    return;
  }

  new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        { label: "Target", data: labels.map(k => t[k] || 0), borderColor: "#ff7e5f", backgroundColor: "rgba(255,126,95,0.25)", pointRadius: 3 },
        { label: "PDP", data: labels.map(k => a[k] || 0), borderColor: "#feb47b", backgroundColor: "rgba(254,180,123,0.25)", pointRadius: 3 }
      ]
    },
    options: { animation: { duration: 800 }, scales: { r: { suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } } }
  });
}

function renderOverall(r) {
  const ctx = document.getElementById("overall-chart")?.getContext("2d");
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        { label: "Target", data: [{ x: -0.4, y: 0.1 }], backgroundColor: "#ff7e5f", pointRadius: 6 },
        { label: "PDP", data: [{ x: 0.5, y: -0.3 }], backgroundColor: "#111827", pointRadius: 6 }
      ]
    },
    options: {
      animation: { duration: 700 },
      scales: {
        x: { min: -1, max: 1, title: { display: true, text: "Relatable  ↔  Authoritative" } },
        y: { min: -1, max: 1, title: { display: true, text: "Playful  ↔  Serious" } }
      },
      plugins: { legend: { position: "bottom" } }
    }
  });
}
