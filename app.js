
// Minimal helpers
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];
const onVisible = (sel, cb) => {
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ cb(e.target); io.unobserve(e.target);} }),{threshold:.12});
  $$(sel).forEach(el=>io.observe(el));
};

// Parse helpers
const parseTOV = (str) => {
  if (!str) return [];
  return str.split(";").map(s=>s.trim()).filter(Boolean).map(line=>{
    const [axis, rest] = line.split(":");
    const v = Number((rest||"").match(/\d+/)?.[0]||0);
    return { axis: (axis||"Axis").trim(), value: v };
  });
};
const parseBAM = (str) => {
  if (!str) return [];
  const out=[]; const re=/([A-Za-z ]+)\s\((\d+)%\)/g; let m;
  while((m=re.exec(str))) out.push({ name:m[1].trim(), value:Number(m[2]) });
  return out;
};

// Tabs
function setupTabs(panel){
  $("#tabs").addEventListener("click",(e)=>{
    if(e.target.classList.contains("tab")){
      $$("#tabs .tab").forEach(b=>b.classList.toggle("active", b===e.target));
      renderTab(panel, e.target.dataset.tab);
      window.scrollTo({top:0, behavior:"smooth"});
    }
  });
}

// UI bits
const chip = (t, cls="") => { const s=document.createElement("span"); s.className="chip "+cls; s.textContent=t; return s; };
function errorBox(panel, msg){
  const b=document.createElement("div");
  b.style.cssText="margin:10px 0;padding:10px;border:1px solid #fecaca;background:#fff1f2;color:#7f1d1d;border-radius:10px";
  b.textContent="Error: "+msg; panel.prepend(b);
}

// Renderers
function renderKSP(panel, r){
  const wrap=document.createElement("div"); wrap.className="grid two reveal";
  const copy=document.createElement("div"); copy.className="card";
  copy.innerHTML=`<div class="section-title">Difference Summary</div><p class="muted">${r.key_selling_points||""}</p>`;

  const targetKSP=["Designed for specific skin tones","Accessible price point","Gradual tan","Moisturizing","Ease of use"];
  const pdpKSP=["Dermatologist Recommended","Gradual tan","Moisturizing","Ease of use"];
  const missing=targetKSP.filter(k=>!pdpKSP.includes(k));
  const extra=pdpKSP.filter(k=>!targetKSP.includes(k));
  const shared=pdpKSP.filter(k=>targetKSP.includes(k));

  const blocks=document.createElement("div"); blocks.className="grid two";
  blocks.innerHTML=`
    <div class="card"><div class="small">Missing in PDP</div><div class="row" id="miss"></div></div>
    <div class="card"><div class="small">Extra in PDP</div><div class="row" id="extra"></div></div>
    <div class="card"><div class="small">Shared</div><div class="row" id="shared"></div></div>`;
  missing.forEach(t=>$("#miss",blocks).append(chip(t,"badge-miss")));
  extra.forEach(t=>$("#extra",blocks).append(chip(t,"badge-extra")));
  shared.forEach(t=>$("#shared",blocks).append(chip(t)));

  const chart=document.createElement("div"); chart.className="card reveal";
  chart.innerHTML=`<div class="section-title">Counts</div><div class="canvas-wrap"><canvas id="kspBar"></canvas></div>`;

  wrap.append(copy, blocks, chart);
  panel.replaceChildren(wrap);
  onVisible(".reveal", el=>el.classList.add("visible"));

  setTimeout(()=>{
    const ctx=$("#kspBar").getContext("2d");
    new Chart(ctx,{ type:"bar", data:{ labels:["Missing","Extra","Shared"],
      datasets:[{ data:[missing.length, extra.length, shared.length], backgroundColor:["#fee2e2","#dcfce7","#e5e7eb"] }] },
      options:{ plugins:{legend:{display:false}}, animation:{duration:800}, scales:{ y:{beginAtZero:true,ticks:{precision:0}} } }
    });
  },60);
}

function makeSlider(axis, tVal, pVal){
  const row=document.createElement("div");
  row.innerHTML=`<div class="kv"><div class="section-title">${axis}</div><div class="small">Target: ${tVal} • PDP: ${pVal}</div></div>
  <div class="slider"><div class="fill"></div><div class="dot t"></div><div class="dot p"></div></div>`;
  const toPct=v=>((v-1)*100/3);
  const l=Math.min(tVal,pVal), r=Math.max(tVal,pVal);
  $(".fill",row).style.left=toPct(l)+"%"; $(".fill",row).style.width=(toPct(r)-toPct(l))+"%";
  $(".dot.t",row).style.left=toPct(tVal)+"%"; $(".dot.p",row).style.left=toPct(pVal)+"%";
  return row;
}

function renderTOV(panel, r){
  const card=document.createElement("div"); card.className="card reveal";
  card.innerHTML=`<div class="section-title">Tone of Voice</div>
  <p class="muted">${r.tone_of_voice_evaluation?.gap||""}</p>`;
  const t=parseTOV(r.tone_of_voice_evaluation?.target_tov);
  const p=parseTOV(r.tone_of_voice_evaluation?.actual_pdp_tov);
  t.forEach((row,i)=>card.appendChild(makeSlider(row.axis,row.value,p[i]?.value||0)));
  const legend=document.createElement("div"); legend.className="legend"; legend.innerHTML=`<span><i class="sw t"></i>Target</span><span><i class="sw p"></i>PDP</span>`;
  card.appendChild(legend);
  panel.replaceChildren(card);
  onVisible(".reveal", el=>el.classList.add("visible"));
}

function renderVisual(panel, r){
  const card=document.createElement("div"); card.className="card reveal";
  card.innerHTML=`<div class="section-title">Visual Identity</div><p class="muted">${r.visual_identity_evaluation||""}</p>`;
  panel.replaceChildren(card); onVisible(".reveal", el=>el.classList.add("visible"));
}

function renderArche(panel, r){
  const wrap=document.createElement("div"); wrap.className="grid two";
  const left=document.createElement("div"); left.className="card reveal";
  const right=document.createElement("div"); right.className="card reveal";
  left.innerHTML=`<div class="section-title">Archetype Radar</div><div class="canvas-wrap"><canvas id="archRadar"></canvas></div>`;
  right.innerHTML=`<div class="section-title">Raw Mix</div><div id="archT" class="row" style="margin-bottom:10px"></div><div id="archP" class="row"></div>`;
  wrap.append(left,right); panel.replaceChildren(wrap);

  const t=parseBAM(r.brand_archetypes_mix_evaluation?.target_bam);
  const p=parseBAM(r.brand_archetypes_mix_evaluation?.actual_pdp_bam);
  t.forEach(x=>$("#archT",right).append(chip(`${x.name} ${x.value}%`)));
  p.forEach(x=>$("#archP",right).append(chip(`${x.name} ${x.value}%`)));
  onVisible(".reveal", el=>el.classList.add("visible"));

  setTimeout(()=>{
    const labels=[...new Set([...t.map(x=>x.name),...p.map(x=>x.name)])];
    const tMap=Object.fromEntries(t.map(x=>[x.name,x.value]));
    const pMap=Object.fromEntries(p.map(x=>[x.name,x.value]));
    new Chart($("#archRadar").getContext("2d"),{
      type:"radar",
      data:{ labels, datasets:[
        { label:"Target", data:labels.map(k=>tMap[k]||0), borderColor:"#f59e0b", backgroundColor:"rgba(245,158,11,.22)", pointRadius:3 },
        { label:"PDP", data:labels.map(k=>pMap[k]||0), borderColor:"#111827", backgroundColor:"rgba(17,24,39,.18)", pointRadius:3 }
      ]},
      options:{ animation:{duration:900}, scales:{ r:{ suggestedMin:0, suggestedMax:100, ticks:{display:false} } } }
    });
  },70);
}

function renderOverall(panel, r){
  const card=document.createElement("div"); card.className="card reveal";
  card.innerHTML=`<div class="section-title">Overall Perception</div>
  <p class="muted">Positioning map — relatable vs authoritative and playful vs serious.</p>
  <div class="canvas-wrap"><canvas id="scatter"></canvas></div>
  <p class="small muted">${r["overall_brand_perception-gaps"]||""}</p>`;
  panel.replaceChildren(card); onVisible(".reveal", el=>el.classList.add("visible"));

  setTimeout(()=>{
    new Chart($("#scatter").getContext("2d"),{
      type:"scatter",
      data:{ datasets:[
        { label:"Target", data:[{x:-0.4,y:0.1}], pointBackgroundColor:"#f59e0b", pointRadius:6 },
        { label:"PDP", data:[{x:0.5,y:-0.3}], pointBackgroundColor:"#111827", pointRadius:6 }
      ]},
      options:{ animation:{duration:800}, scales:{
        x:{ min:-1,max:1, title:{display:true,text:"Relatable  ↔  Authoritative"} },
        y:{ min:-1,max:1, title:{display:true,text:"Playful  ↔  Serious"} }
      }, plugins:{ legend:{position:"bottom"} } }
    });
  },60);
}

function renderTab(panel, id){
  const r=window.__REPORT__;
  if(id==="ksp") return renderKSP(panel, r);
  if(id==="tov") return renderTOV(panel, r);
  if(id==="visual") return renderVisual(panel, r);
  if(id==="arch") return renderArche(panel, r);
  return renderOverall(panel, r);
}

// Boot
(async function start(){
  const panel=$("#panel");
  document.getElementById("tabs").addEventListener("click",()=>{});
  try{
    const res=await fetch("data.json",{cache:"no-store"});
    if(!res.ok) throw new Error("data.json HTTP "+res.status);
    const json=await res.json();
    const r=json?.Brand_Perception_Gaps_Analysis;
    if(!r) return errorBox(panel,"Missing Brand_Perception_Gaps_Analysis key in data.json");
    window.__REPORT__=r;
    $("#intro").textContent=r.intro||"";
    setupTabs(panel);
    renderTab(panel,"ksp");
    onVisible(".reveal", el=>el.classList.add("visible"));
  }catch(e){
    errorBox(panel,"Cannot load data.json. Ensure .nojekyll exists and hard refresh (Cmd/Ctrl+Shift+R).");
    console.error(e);
  }
})();
