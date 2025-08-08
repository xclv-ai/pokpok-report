async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    renderTOV(data.Brand_Perception_Gaps_Analysis);
    renderArchetypes(data.Brand_Perception_Gaps_Analysis);
    renderKSP(data.Brand_Perception_Gaps_Analysis);
  } catch (err) {
    console.error('Error loading data:', err);
    document.body.innerHTML = '<h2 style="color:red;text-align:center">Error loading data.json</h2>';
  }
}

function renderTOV(analysis) {
  document.getElementById('tovNarrative').innerText = analysis.tone_of_voice_evaluation.gap;
  const labels = ['Formal vs. Casual', 'Serious vs. Funny', 'Respectful vs. Irreverent', 'Matter-of-fact vs. Enthusiastic'];
  const target = [4, 3, 2, 4];
  const pdp = [3, 1, 1, 4];
  new Chart(document.getElementById('tovRadar'), {
    type: 'radar',
    data: {
      labels,
      datasets: [
        { label: 'Target', data: target, fill: true, backgroundColor: 'rgba(0, 123, 255, 0.2)', borderColor: '#007bff' },
        { label: 'PDP', data: pdp, fill: true, backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: '#ff6384' }
      ]
    },
    options: { responsive: true, scales: { r: { suggestedMin: 0, suggestedMax: 5 } } }
  });
}

function renderArchetypes(analysis) {
  const labels = ['Everyman', 'Lover', 'Innocent', 'Caregiver', 'Sage'];
  const target = [70, 15, 15, 0, 0];
  const pdp = [0, 0, 70, 15, 15];
  new Chart(document.getElementById('archetypeRadar'), {
    type: 'radar',
    data: {
      labels,
      datasets: [
        { label: 'Target', data: target, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: '#36a2eb' },
        { label: 'PDP', data: pdp, backgroundColor: 'rgba(255, 206, 86, 0.2)', borderColor: '#ffce56' }
      ]
    },
    options: { responsive: true, scales: { r: { suggestedMin: 0, suggestedMax: 100 } } }
  });
}

function renderKSP(analysis) {
  const div = document.getElementById('kspContent');
  div.innerHTML = `<p>${analysis.key_selling_points}</p>`;
}

loadData();
