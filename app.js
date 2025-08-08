document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-btn.active").classList.remove("active");
      btn.classList.add("active");
      document.querySelector(".tab-content.active").classList.remove("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  fetch("data.json")
    .then(res => res.json())
    .then(data => renderReport(data));
});

function renderReport(data) {
  renderKSP(data);
  renderTOV(data);
  renderArchetypes(data);
  renderOverall(data);
}

function renderKSP(data) {
  const kspDiv = document.getElementById("ksp-list");
  kspDiv.innerHTML = `<p>${data.Brand_Perception_Gaps_Analysis.key_selling_points}</p>`;

  const ctx = document.getElementById("ksp-chart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Target Missing", "PDP Emphasis"],
      datasets: [{
        label: "KSP Importance",
        data: [2, 4],
        backgroundColor: ['#ff7e5f', '#feb47b']
      }]
    }
  });
}

function renderTOV(data) {
  const target = parseTOV(data.Brand_Perception_Gaps_Analysis.tone_of_voice_evaluation.target_tov);
  const actual = parseTOV(data.Brand_Perception_Gaps_Analysis.tone_of_voice_evaluation.actual_pdp_tov);
  const wrapper = document.getElementById("tov-sliders");
  wrapper.innerHTML = "";

  Object.keys(target).forEach(key => {
    const div = document.createElement("div");
    div.className = "slider-wrap";
    div.innerHTML = `
      <div class="slider-label"><span>${key}</span><span>Target: ${target[key]} | PDP: ${actual[key]}</span></div>
      <input type="range" min="0" max="4" value="${actual[key]}" disabled />
    `;
    wrapper.appendChild(div);
  });
}

function parseTOV(str) {
  const regex = /: (\d)/g;
  let match, res = {};
  const lines = str.split(";");
  lines.forEach(line => {
    const [label, rest] = line.split(":");
    const num = rest ? rest.match(/\d+/) : null;
    if (label && num) res[label.trim()] = parseInt(num[0]);
  });
  return res;
}

function renderArchetypes(data) {
  const ctx = document.getElementById("archetype-chart").getContext("2d");
  const target = parseBAM(data.Brand_Perception_Gaps_Analysis.brand_archetypes_mix_evaluation.target_bam);
  const actual = parseBAM(data.Brand_Perception_Gaps_Analysis.brand_archetypes_mix_evaluation.actual_pdp_bam);
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(target),
      datasets: [
        { label: "Target", data: Object.values(target), backgroundColor: "rgba(255,126,95,0.2)", borderColor: "#ff7e5f" },
        { label: "PDP", data: Object.values(actual), backgroundColor: "rgba(254,180,123,0.2)", borderColor: "#feb47b" }
      ]
    }
  });
}

function parseBAM(str) {
  const regex = /(\w+): (\d+)%/g;
  let match, res = {};
  while ((match = regex.exec(str)) !== null) {
    res[match[1]] = parseInt(match[2]);
  }
  return res;
}

function renderOverall(data) {
  const ctx = document.getElementById("overall-chart").getContext("2d");
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Target vs PDP',
        data: [{x: 1, y: 3}, {x: 2, y: 4}],
        backgroundColor: "#ff7e5f"
      }]
    },
    options: { scales: { x: { min: 0, max: 5 }, y: { min: 0, max: 5 } } }
  });
}
