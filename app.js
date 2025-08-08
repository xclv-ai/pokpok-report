(() => {
  const { createElement: h, useState, useEffect } = React;
  const { createRoot } = ReactDOM;

  // Slider row for tone‑of‑voice scores
  function SliderRow({ label, targetValue, pdpValue }) {
    const toPercent = (val) => ((val - 1) * 100) / 3;
    return h("div", { className: "my-4" }, [
      h("div", { className: "flex justify-between mb-1" }, [
        h("span", { className: "text-sm font-semibold text-gray-800" }, label),
        h("span", { className: "text-xs text-gray-500" }, `Target: ${targetValue}, PDP: ${pdpValue}`),
      ]),
      h("div", {
        className: "relative h-3 rounded-full bg-gray-200",
        style: { overflow: "hidden" },
      }, [
        // Highlight range between two values
        (() => {
          const minVal = Math.min(targetValue, pdpValue);
          const maxVal = Math.max(targetValue, pdpValue);
          const left  = `${toPercent(minVal)}%`;
          const width = `${toPercent(maxVal) - toPercent(minVal)}%`;
          return h("div", {
            className: "absolute top-0 h-full bg-blue-100",
            style: { left, width },
          });
        })(),
        // Target dot
        h("div",
          { className: "absolute top-1/2 -translate-y-1/2", style: { left: `${toPercent(targetValue)}%` } },
          h("div", { className: "w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500" })
        ),
        // PDP dot
        h("div",
          { className: "absolute top-1/2 -translate-y-1/2", style: { left: `${toPercent(pdpValue)}%` } },
          h("div", { className: "w-4 h-4 rounded-full border-2 border-purple-500 bg-purple-500" })
        ),
      ]),
    ]);
  }

  function App() {
    const [report, setReport] = useState(null);
    useEffect(() => {
      fetch("./data.json")
        .then((res) => res.json())
        .then((json) => setReport(json.Brand_Perception_Gaps_Analysis))
        .catch((err) => console.error(err));
    }, []);

    if (!report) return h("div", { className: "p-6 text-gray-700" }, "Loading analysis...");

    // define KSP differences directly (extracted from narrative)
    const missing = ["Designed for specific skin tones", "Accessible price point"];
    const extra   = ["Dermatologist Recommended"];
    const shared  = ["Gradual tan", "Moisturizing", "Ease of use"];

    // tone-of-voice scores
    const targetTOV = {
      "Formal vs. Casual": 4,
      "Serious vs. Funny": 3,
      "Respectful vs. Irreverent": 2,
      "Matter-of-fact vs. Enthusiastic": 4,
    };
    const pdpTOV = {
      "Formal vs. Casual": 3,
      "Serious vs. Funny": 1,
      "Respectful vs. Irreverent": 1,
      "Matter-of-fact vs. Enthusiastic": 4,
    };

    return h("div", { className: "max-w-4xl mx-auto p-6 space-y-8" }, [
      // Header
      h("header", { className: "text-center space-y-2" }, [
        h("h1", { className: "text-3xl font-extrabold text-gray-900" }, "Brand Perception Gap Analysis"),
        h("p", { className: "text-gray-600" }, "Comparing aspirational target perception against actual e‑commerce PDP content."),
      ]),

      // Overview
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Overview"),
        h("p", { className: "text-gray-700" }, report.intro),
      ]),

      // Key Selling Points
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Key Selling Points"),
        h("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700" }, [
          h("div", { className: "p-4 bg-white rounded-lg shadow-sm" }, [
            h("h3", { className: "font-semibold mb-1" }, "Missing in PDP"),
            ...missing.map((i) => h("p", { className: "text-sm" }, i)),
          ]),
          h("div", { className: "p-4 bg-white rounded-lg shadow-sm" }, [
            h("h3", { className: "font-semibold mb-1" }, "Extra in PDP"),
            ...extra.map((i) => h("p", { className: "text-sm" }, i)),
          ]),
          h("div", { className: "p-4 bg-white rounded-lg shadow-sm" }, [
            h("h3", { className: "font-semibold mb-1" }, "Shared"),
            ...shared.map((i) => h("p", { className: "text-sm" }, i)),
          ]),
        ]),
      ]),

      // Tone of Voice sliders
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Tone of Voice"),
        ...Object.keys(targetTOV).map((key) =>
          h(SliderRow, { key, label: key, targetValue: targetTOV[key], pdpValue: pdpTOV[key] })
        ),
        h("div", { className: "flex justify-between text-xs mt-2 text-gray-500" }, [
          h("span", null, "1 = Formal/Serious/Respectful/Matter‑of‑fact"),
          h("span", null, "4 = Casual/Funny/Irreverent/Enthusiastic"),
        ]),
      ]),

      // Visual Identity
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Visual Identity"),
        h("p", { className: "text-gray-700 whitespace-pre-wrap" }, report.visual_identity_evaluation),
      ]),

      // Brand Archetypes
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Brand Archetypes"),
        h("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
          h("div", { className: "p-4 bg-white rounded-lg shadow-sm" }, [
            h("h3", { className: "font-semibold mb-1" }, "Target Mix"),
            h("p", { className: "text-sm" }, report.brand_archetypes_mix_evaluation.target_bam),
          ]),
          h("div", { className: "p-4 bg-white rounded-lg shadow-sm" }, [
            h("h3", { className: "font-semibold mb-1" }, "PDP Mix"),
            h("p", { className: "text-sm" }, report.brand_archetypes_mix_evaluation.actual_pdp_bam),
          ]),
        ]),
      ]),

      // Overall perception
      h("section", { className: "space-y-2" }, [
        h("h2", { className: "text-2xl font-bold text-gray-800" }, "Overall Perception"),
        h("p", { className: "text-gray-700 whitespace-pre-wrap" }, report["overall_brand_perception-gaps"]),
      ]),
    ]);
  }

  //createRoot(document.getElementById("root")).app(happApp));
  createRoot(document.getElementById("app")).render(h(App));
})();
