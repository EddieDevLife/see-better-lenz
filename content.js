// Lenz content script — injeta SVG de filtros, aplica perfil e CSS por domínio.
(() => {
  const STYLE_ID = "lenz-style";
  const SVG_ID = "lenz-svg-filters";
  const domain = location.hostname || "_global";

  const PROFILES = {
    none:               { filter: "", css: "" },
    deuteranopia:       { filter: "url(#lenz-deuteranopia-correct)", css: "" },
    protanopia:         { filter: "url(#lenz-protanopia-correct)",   css: "" },
    tritanopia:         { filter: "url(#lenz-tritanopia-correct)",   css: "" },
    sim_deuteranopia:   { filter: "url(#lenz-deuteranopia-sim)",     css: "" },
    sim_protanopia:     { filter: "url(#lenz-protanopia-sim)",       css: "" },
    sim_tritanopia:     { filter: "url(#lenz-tritanopia-sim)",       css: "" },
    low_stimulation: {
      filter: "saturate(0.65) contrast(0.95) brightness(0.97)",
      css: `*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
        img,video,picture{filter:saturate(.7) brightness(.95)!important}`
    },
    calm_reading: {
      filter: "saturate(0.5) contrast(0.92)",
      css: `html,body{background:#f5efe4!important;color:#2b2a28!important}
        *:not(img):not(video):not(svg):not(canvas){background-color:transparent!important;background-image:none!important;color:#2b2a28!important;text-shadow:none!important;box-shadow:none!important}
        a,a *{color:#5b3a1f!important;text-decoration:underline!important}
        *,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}
        p,li{line-height:1.7!important;letter-spacing:.01em!important}`
    },
    high_contrast: {
      filter: "contrast(1.15)",
      css: `html,body{background:#000!important;color:#fff!important}
        *:not(img):not(video):not(svg):not(canvas):not(picture){background-color:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important}
        a,a *{color:#ffeb3b!important;text-decoration:underline!important}
        button,input,select,textarea{background:#111!important;color:#fff!important;border:2px solid #fff!important}
        :focus,:focus-visible{outline:3px solid #ffeb3b!important;outline-offset:2px!important}`
    },
    inverted: {
      filter: "invert(1) hue-rotate(180deg)",
      css: `img,video,picture,svg,canvas,[style*="background-image"]{filter:invert(1) hue-rotate(180deg)!important}`
    }
  };

  function ensureSvg() {
    if (document.getElementById(SVG_ID)) return;
    const url = chrome.runtime.getURL("filters.svg");
    fetch(url).then(r => r.text()).then(svg => {
      const div = document.createElement("div");
      div.id = SVG_ID;
      div.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      div.setAttribute("aria-hidden", "true");
      div.innerHTML = svg;
      (document.body || document.documentElement).appendChild(div);
    }).catch(() => {});
  }

  function apply(state) {
    const profileKey = (state && state.profile) || "none";
    const intensity = (state && typeof state.intensity === "number") ? state.intensity : 1;
    const extraCss = (state && state.extraCss) || "";
    const p = PROFILES[profileKey] || PROFILES.none;

    // Filtro
    const root = document.documentElement;
    if (p.filter) {
      let f = p.filter;
      if (intensity !== 1 && !f.startsWith("url(")) {
        f = `${f} opacity(${intensity})`;
      }
      root.style.setProperty("filter", f, "important");
      root.style.setProperty("-webkit-filter", f, "important");
      ensureSvg();
    } else {
      root.style.removeProperty("filter");
      root.style.removeProperty("-webkit-filter");
    }

    // CSS injetado
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = (p.css || "") + "\n" + extraCss;
  }

  function load() {
    chrome.storage.local.get(["global", "domains"], (data) => {
      const domains = data.domains || {};
      const global = data.global || { profile: "none", intensity: 1, extraCss: "" };
      const perDomain = domains[domain];
      apply(perDomain || global);
    });
  }

  chrome.storage.onChanged.addListener(load);
  load();

  // Reaplicar caso o site limpe o style do <html>
  const obs = new MutationObserver(() => {
    if (!document.documentElement.style.filter && document.getElementById(STYLE_ID)) {
      load();
    }
  });
  if (document.documentElement) {
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
  }
})();
