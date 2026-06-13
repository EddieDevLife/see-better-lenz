// Inicializa storage com defaults na instalação
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["global", "domains"], (data) => {
    const patch = {};
    if (!data.global) patch.global = { profile: "none", intensity: 1, extraCss: "" };
    if (!data.domains) patch.domains = {};
    if (Object.keys(patch).length) chrome.storage.local.set(patch);
  });
});
