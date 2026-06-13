const GROUPS = {
  "group-cb": [
    ["deuteranopia", "Deuteranopia", "Realça vermelho-verde"],
    ["protanopia",   "Protanopia",   "Compensa vermelho fraco"],
    ["tritanopia",   "Tritanopia",   "Reforça azul-amarelo"],
    ["none",         "Desativar",    "Sem ajuste"]
  ],
  "group-asd": [
    ["low_stimulation", "Baixa estimulação", "Pausa animações, suaviza cores"],
    ["calm_reading",    "Leitura calma",     "Fundo creme, texto grafite"],
    ["high_contrast",   "Alto contraste",    "Preto / branco / amarelo"],
    ["inverted",        "Cores invertidas",  "Preserva fotos"]
  ],
  "group-sim": [
    ["sim_deuteranopia", "Sim. deuteranopia", "Como uma pessoa deuteranópica vê"],
    ["sim_protanopia",   "Sim. protanopia",   "Como uma pessoa protanópica vê"],
    ["sim_tritanopia",   "Sim. tritanopia",   "Como uma pessoa tritanópica vê"]
  ]
};

const $ = (id) => document.getElementById(id);
let currentTab = null;
let domain = "_global";
let state = { profile: "none", intensity: 1, perDomain: false };

function render() {
  for (const [groupId, items] of Object.entries(GROUPS)) {
    const el = $(groupId);
    el.innerHTML = "";
    for (const [key, label, desc] of items) {
      const b = document.createElement("button");
      b.className = "opt" + (state.profile === key ? " active" : "");
      b.innerHTML = `<strong></strong><span></span>`;
      b.querySelector("strong").textContent = label;
      b.querySelector("span").textContent = desc;
      b.addEventListener("click", () => {
        state.profile = key;
        save();
      });
      el.appendChild(b);
    }
  }
  $("intensity").value = Math.round(state.intensity * 100);
  $("intensityVal").textContent = Math.round(state.intensity * 100) + "%";
  $("perDomain").checked = state.perDomain;
  $("scope").textContent = state.perDomain ? domain : "Aplicado a todos os sites";
}

function save() {
  chrome.storage.local.get(["global", "domains"], (data) => {
    const domains = data.domains || {};
    const payload = { profile: state.profile, intensity: state.intensity, extraCss: "" };
    if (state.perDomain) {
      domains[domain] = payload;
      chrome.storage.local.set({ domains });
    } else {
      // Salva como global e remove override de domínio
      delete domains[domain];
      chrome.storage.local.set({ global: payload, domains });
    }
    render();
  });
}

function load() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTab = tabs[0];
    try { domain = new URL(currentTab.url).hostname || "_global"; } catch { domain = "_global"; }
    chrome.storage.local.get(["global", "domains"], (data) => {
      const domains = data.domains || {};
      const global = data.global || { profile: "none", intensity: 1 };
      if (domains[domain]) {
        state = { ...domains[domain], perDomain: true };
      } else {
        state = { ...global, perDomain: false };
      }
      if (typeof state.intensity !== "number") state.intensity = 1;
      render();
    });
  });
}

$("intensity").addEventListener("input", (e) => {
  state.intensity = Number(e.target.value) / 100;
  $("intensityVal").textContent = e.target.value + "%";
});
$("intensity").addEventListener("change", save);

$("perDomain").addEventListener("change", (e) => {
  state.perDomain = e.target.checked;
  save();
});

$("reset").addEventListener("click", () => {
  chrome.storage.local.get(["domains"], (data) => {
    const domains = data.domains || {};
    delete domains[domain];
    chrome.storage.local.set({ domains }, () => {
      state.perDomain = false;
      state.profile = "none";
      state.intensity = 1;
      save();
    });
  });
});

load();
