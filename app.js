// === app.js — Vanilla JS (no React) ===
// Requires in index.html: <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

function errorBox(msg) {
  const box = document.createElement("div");
  box.style.cssText = "margin:16px;padding:12px;border:1px solid #fecaca;background:#fff1f2;color:#7f1d1d;border-radius:8px";
  box.textContent = "Error: " + msg;
  (document.querySelector(".tab-content.active") || document.body).prepend(box);
}

function parseTOV(str) {
  if (!str) return {};
  const out = {};
  str.split(";").map(s => s.trim()).filter(Boolean).forEach(line => {
    const [label, rest] = line.split(":");
    const num = rest ? Number((rest.match(/\d+/) || [0])[0]) : 0;
    out[(label || "Axis").trim()] = num;
  });
  return out;
}

function parseBAM(str) {
  if (!str) return {};
  const out = {};
  (str.match(/([A-Za-z ]+)\s\((\d+)%\)/g) || []).forEach(m => {
    const name = m.replace(/\s\(\d+%\)/, "").trim();
    const val = Number((m.match(/\((\d+)%\)/) || [])[1]) || 0;
    out[name] = val;
  });
  return out;
}

// Tabs
document.addEventListener("DOMContentLoaded", () => {
  $$(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $(".tab-btn.active")?.classList.remove("active");
      btn.classList.add("active");
      $(".tab-content.active")?.classList.remove("active");
      document.getElementById(btn.dataset.tab)?.classList.add("active");
    });
  });

  // Load JSON
  fetch("data.json", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(`data.json HTTP ${r.status}`); return r.json(); })
    .then(json => {
      const r = json?.Brand_Perception_Gaps_Analysis;
      if (!r) { errorBox("Missing key: Brand_Perception_Gaps_Analysis in data.json"); return; }
      renderAll(r);
    })
    .catch(e => errorBox("Cannot load data.json. Ensure .nojekyll exists and hard-refresh (Cmd/Ctrl+Shift+R)."));
});

function renderAll(r) {
  renderKSP(r);
  renderTOV(r);
  renderArchetypes(r);
  renderOverall(r);
}

/* ---------- KSP ---------- */
function renderKSP(r) {
  const kspDiv = $("#ksp-list");
  if (kspDiv) kspDiv.innerHTML = r.key_selling_points ? `<p>${r.key_selling_points}</p>` : "<p>No KSP narrative.</p>";

  const ctx = $("#ksp-chart")?.getContext("2d");
  if (!ctx || !window.Chart) return;

  // Simple count proxy so something is visual immediately
  const targetKSP = ["Designed for specific skin tones","Accessible price point","Gradual tan","Moisturizing","Ease of use"];
  const pdpKSP    = ["Dermatologist Recommended","Gradual tan","Moisturizing","Ease of use"];
  const missing = targetKSP.filter(k=>!pdpKSP.includes(k)).length;
  const extra   = pdpKSP.filter(k=>!targetKSP.includes(k)).length;
  const shared  = pdpKSP.filter(k=>targetKSP.includes(k)).length;

  new Chart(ctx, {
    type: "bar",
    data: { labels: ["Missing","Extra","Shared"], datasets: [{ data: [missing,extra,shared], backgroundColor: ["#fecaca","#bbf7d0","#e5e7eb"] }] },
    options: { plugins:{ legend:{ display:false } }, animation:{ duration:800 }, scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } } }
  });
}

/* ---------- Tone of Voice (sliders with dots) ---------- */
function renderTOV(r) {
  const wrap = $("#tov-sliders"); if (!wrap) return;
  wrap.innerHTML = "";

  const t = parseTOV(r.tone_of_voice_evaluation?.target_tov);
  const p = parseTOV(r.tone_of_voice_evaluation?.actual_pdp_tov);
  const axes = Object.keys(t).length ? Object.keys(t) : Object.keys(p);
  if (!axes.length) { wrap.innerHTML = "<p>No tone-of-voice scales.</p>"; return; }

  axes.forEach(axis => {
    const tVal = t[axis] ?? 0, pVal = p[axis] ?? 0;
    const row = document.createElement("div");
    row.className = "slider-wrap";
    row.innerHTML = `
      <div class="slider-label">
        <span>${axis}</span><span>Target: ${tVal} | PDP: ${pVal}</span>
      </div>
      <input type="range" min="0" max="4" value="${pVal}" disabled />
    `;
    wrap.appendChild(row);
  });
}

/* ---------- Archetypes (radar) ---------- */
function renderArchetypes(r) {
  const ctx = $("#archetype-chart")?.getContext("2d"); if (!ctx) return;

  const t = parseBAM(r.brand_archetypes_mix_evaluation?.target_bam);
  const a = parseBAM(r.brand_archetypes_mix_evaluation?.actual_pdp_bam);
  const labels = [...new Set([...Object.keys(t), ...Object.keys(a)])];
  if (!labels.length) { ctx.canvas.insertAdjacentHTML("afterend","<p>No archetype mix.</p>"); return; }

  new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        { label:"Target", data: labels.map(k=>t[k]||0), borderColor:"#ff7e5f", backgroundColor:"rgba(255,126,95,.25)", pointRadius:3 },
        { label:"PDP",    data: labels.map(k=>a[k]||0), borderColor:"#feb47b", backgroundColor:"rgba(254,180,123,.25)", pointRadius:3 }
      ]
    },
    options: { animation:{ duration:900 }, scales:{ r:{ suggestedMin:0, suggestedMax:100, ticks:{ display:false } } } }
  });
}

/* ---------- Overall (scatter) ---------- */
function renderOverall(r) {
  const ctx = $("#overall-chart")?.getContext("2d"); if (!ctx) return;

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        { label:"Target", data:[{ x:-0.4, y: 0.1 }], pointBackgroundColor:"#ff7e5f", pointRadius:6 },
        { label:"PDP",    data:[{ x: 0.5, y:-0.3 }], pointBackgroundColor:"#111827", pointRadius:6 }
      ]
    },
    options: {
      animation:{ duration:700 },
      scales:{
        x:{ min:-1, max:1, title:{ display:true, text:"Relatable  ↔  Authoritative" } },
        y:{ min:-1, max:1, title:{ display:true, text:"Playful  ↔  Serious" } }
      },
      plugins:{ legend:{ position:"bottom" } }
    }
  });
}
