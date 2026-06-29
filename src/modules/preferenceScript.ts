import { config } from "../../package.json";
import { getPref, setPref } from "../utils/prefs";
import { getString } from "../utils/locale";
import { batchSetAll } from "./languagemark";

export async function registerPrefsScripts(_window: Window) {
  const doc = _window.document;

  const languageSelector = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-languageSelector`,
  ) as HTMLSelectElement | null;

  const customLanguage = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-customLanguage`,
  ) as HTMLInputElement | null;

  const batchButton = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-batchSet`,
  ) as HTMLButtonElement | null;

  if (languageSelector && customLanguage) {
    const presets = new Set(
      Array.from(languageSelector.options)
        .filter((opt) => (opt as HTMLOptionElement).value !== "__custom__")
        .map((opt) => (opt as HTMLOptionElement).value),
    );

    languageSelector.addEventListener("change", () => {
      const val = languageSelector.value;
      if (val === "__custom__") {
        setPref("targetLanguage", "");
        customLanguage.disabled = false;
        customLanguage.value = "";
      } else {
        setPref("targetLanguage", val as string);
        customLanguage.disabled = true;
        customLanguage.value = val;
      }
    });

    // Sync initial state
    const savedLang = getPref("targetLanguage") as string;
    if (savedLang && presets.has(savedLang)) {
      languageSelector.value = savedLang;
      customLanguage.value = savedLang;
      customLanguage.disabled = true;
    } else {
      languageSelector.value = "__custom__";
      customLanguage.value = savedLang || "";
      customLanguage.disabled = false;
    }
  }

  if (batchButton) {
    batchButton.addEventListener("click", async () => {
      const lang = getPref("targetLanguage") as string;
      const force = getPref("overwriteExisting") as boolean;
      if (!lang) {
        _window.alert(getString("pref-batch-no-language"));
        return;
      }
      batchButton.disabled = true;
      batchButton.textContent = getString("pref-batch-running");
      try {
        await batchSetAll(lang, force);
      } finally {
        batchButton.disabled = false;
        batchButton.textContent = getString("pref-batch-set-button");
      }
    });
  }
}
