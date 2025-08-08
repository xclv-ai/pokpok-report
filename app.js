
(() => {
  const { createElement: h, useEffect, useMemo, useState } = React;  const { createRoot } = ReactDOM;
  const { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Sankey, Tooltip } = Recharts;

  // Helpers
  const parseScale = (str) => {
    if (!str) return [];
    return str.split(";").map(s => s.trim()).filter(Boolean).map(line => {
      const [axisRaw, rest] = line.split(":");
      const axisLabel = (axisRaw || "Axis").trim();
      const valChar = (rest || "").trim().charAt(0);
      const value = Number(valChar) || 0;
      return { axis: axisLabel, value };
    });
  };

  const toArchetypes = (str) => {
    const res = [];
    const re = /([A-Za-z ]+)\s\((\d+)%\)/g;
    for (const m of str.matchAll(re)) {
      res.push({ name: m[1].trim(), value: Number(m[2]) });
    }
    return res;
  };

  function Chips({ title, items, tone }) {
    return h("div", null,
      h("div", { className: "small muted", style:{marginBottom:6}}, title),
      h("div", { className: "row" },
        items.map((t, i) => h("span", { key: i, className: `chip ${tone==='miss'?'badge-miss':''} ${tone==='extra'?'badge-extra':''}` }, t))
      )
    );
  }

  
  function KSP({ narrative }) {
    const targetKSP = ["Designed for specific skin tones","Accessible price point","Gradual tan","Moisturizing","Ease of use"];
    const pdpKSP = ["Dermatologist Recommended","Gradual tan","Moisturizing","Ease of use"];
    const missing = targetKSP.filter(k => !pdpKSP.includes(k));
    const extra = pdpKSP.filter(k => !targetKSP.includes(k));
    const shared = pdpKSP.filter(k => targetKSP.includes(k));

    const sankeyData = {
      nodes: [{name:"Target"},{name:"PDP"},{name:"Emotional Benefit"},{name:"Empowerment"},{name:"Derm. Recommended"},{name:"Ingredient Science"}],
      links: [
        { source:0, target:2, value:6 },
        { source:0, target:3, value:4 },
        { source:1, target:4, value:7 },
        { source:1, target:5, value:5 },
        { source:1, target:2, value:3 }
      ]
    };

    return h("div", { className: "grid two" },
      h("div", { className:"card" },
        h("div", { className: "section-title" }, "Difference Map"),
        h("p", { className:"muted small" }, narrative),
        h(Chips, { title:"Missing in PDP", items: missing, tone:"miss" }),
        h(Chips, { title:"Extra in PDP", items: extra, tone:"extra" }),
        h(Chips, { title:"Shared", items: shared })
      ),
      h("div", { className:"card" },
        h("div", { className: "section-title" }, "Target vs PDP Emphasis (Sankey)"),
        h("div", { className:"chart" },
          h(ResponsiveContainer, { width:"100%", height:"100%" },
            h(Sankey, { data: sankeyData, nodePadding: 40, linkCurvature: 0.5 },
              h(Tooltip, null)
            )
          )
        )
      )
    );
  }

  function TOV({ gap, target, pdp }) {
    const t = parseScale(target);
    const p = parseScale(pdp);
    const radar = t.map((row, i) => ({
      axis: row.axis,
      Target: row.value,
      PDP: p[i]?.value ?? 0
    }));
    return h("div", { className:"grid two" },
      h("div", { className:"card" },
        h("div", { className:"section-title" }, "Tone of Voice — Radar"),
        h("div", { className:"chart" },
          h(ResponsiveContainer, { width:"100%", height:"100%" },
            h(RadarChart, { data: radar, outerRadius:120 },
              h(PolarGrid, null),
              h(PolarAngleAxis, { dataKey:"axis" }),
              h(PolarRadiusAxis, { domain:[0,5], tickCount:6 }),
              h(Radar, { name:"Target", dataKey:"Target", stroke:"#f59e0b", fill:"#f59e0b", fillOpacity:0.3 }),
              h(Radar, { name:"PDP", dataKey:"PDP", stroke:"#111827", fill:"#111827", fillOpacity:0.15 }),
              h(Legend, null)
            )
          )
        )
      ),
      h("div", { className:"card" },
        h("div", { className:"section-title" }, "Gap Summary"),
        h("p", { className:"muted small" }, gap)
      )
    );
  }

  function Visual({ text }) {
    const target = ["Warm, sunny palette","Smooth, rounded shapes","Metallic/shiny accents","Optimistic mood"];
    const pdp = ["Bold promo badges","Gradient dotted pattern","Bold serif type","Colorful circles/badges","'Dermatologist recommended' badge"];
    return h("div", { className:"card" },
      h("div", { className:"section-title" }, "Visual Identity — Assets & Emphasis"),
      h("p", { className:"muted small" }, text),
      h("div", { className:"grid two" },
        h(Chips, { title:"Target Cues", items: target }),
        h(Chips, { title:"PDP Cues", items: pdp })
      )
    );
  }

  function Arch({ target, pdp }) {
    const t = toArchetypes(target);
    const p = toArchetypes(pdp);
    const Bar = ({ color, value }) => h("div",{style:{height:8, width:`${value}%`, background:color, borderRadius:6}});
    const Row = ({ name, value, color }) => h("div",{style:{display:"flex",alignItems:"center",gap:8}},
      h("div",{style:{width:160}} , h("span",{className:"small muted"}, name)),
      h("div",{style:{flex:1, background:"#fef3c7", borderRadius:6, height:8}}, h(Bar, { color, value })),
      h("div",{style:{width:40}, className:"small"}, `${value}%`)
    );
    return h("div", { className:"grid two" },
      h("div", { className:"card" },
        h("div", { className:"section-title" }, "Archetype Mix — Target"),
        ...t.map(a => h(Row, { key:a.name, name:a.name, value:a.value, color:"#f59e0b" }))
      ),
      h("div", { className:"card" },
        h("div", { className:"section-title" }, "Archetype Mix — PDP"),
        ...p.map(a => h(Row, { key:a.name, name:a.name, value:a.value, color:"#111827" }))
      )
    );
  }

  function Overall({ text }) {
    return h("div", { className:"card" },
      h("div", { className:"section-title" }, "Emotional Positioning Map"),
      h("p", { className:"muted small" }, "Target leans into everyday relatability (Everyman). PDP skews optimistic care + authority (Innocent/Caregiver/Sage)."),
      h("div", { className:"map" },
        h("div", { className:"cross-x" }),
        h("div", { className:"cross-y" }),
        h("div", { className:"axis-note", style:{left:8, top:8} }, "Playful"),
        h("div", { className:"axis-note", style:{left:8, bottom:8, position:'absolute'} }, "Serious"),
        h("div", { className:"axis-note", style:{left:8, top:"50%", transform:"translateY(-50%)"} }, "Relatable"),
        h("div", { className:"axis-note", style:{right:8, top:"50%", transform:"translateY(-50%)"} }, "Authoritative"),
        h("div", { className:"dot target", style:{ left:"30%", top:"42%" } }),
        h("div", { className:"axis-note", style:{ left:"30%", top:"42%", transform:"translate(-12px, 18px)" } }, "Target"),
        h("div", { className:"dot pdp", style:{ left:"62%", top:"65%" } }),
        h("div", { className:"axis-note", style:{ left:"62%", top:"65%", transform:"translate(-6px, 18px)" } }, "PDP")
      ),
      h("div", { className:"muted small", style:{marginTop:8} }, text)
    );
  }

  function Panel({ data }) {
    const [tab, setTab] = useState("ksp");
    useEffect(() => {
      const intro = document.getElementById("intro");
      intro.textContent = data.intro || "";
      const tabs = document.getElementById("tabs");
      const onClick = (e) => {
        if (e.target.tagName === "BUTTON") {
          const id = e.target.getAttribute("data-tab");
          setTab(id);
          [...tabs.children].forEach(btn => btn.classList.toggle("active", btn===e.target));
        }
      };
      tabs.addEventListener("click", onClick);
      return () => tabs.removeEventListener("click", onClick);
    }, [data]);

    if (tab === "ksp") return h(KSP, { narrative: data.key_selling_points });
    if (tab === "comm") return h("div", { className:"card" },
      h("div", { className:"section-title" }, "Communication Focus"),
      h("p", { className:"muted small" }, data.communication_focus)
    );
    if (tab === "tov") return h(TOV, { gap: data.tone_of_voice_evaluation.gap, target: data.tone_of_voice_evaluation.target_tov, pdp: data.tone_of_voice_evaluation.actual_pdp_tov });
    if (tab === "visual") return h(Visual, { text: data.visual_identity_evaluation });
    if (tab === "arch") return h(Arch, { target: data.brand_archetypes_mix_evaluation.target_bam, pdp: data.brand_archetypes_mix_evaluation.actual_pdp_bam });
    return h(Overall, { text: data["overall_brand_perception-gaps"] });
  }

  async function start() {
    const mount = document.getElementById("app");
    const root = createRoot(mount);
    try {
      const res = await fetch("data.json");
      const json = await res.json();
      root.render(h(Panel, { data: json.Brand_Perception_Gaps_Analysis }));
    } catch (e) {
      mount.innerHTML = "<p class='muted'>Failed to load data.json</p>";
      console.error(e);
    }
  }

  start();
})();
