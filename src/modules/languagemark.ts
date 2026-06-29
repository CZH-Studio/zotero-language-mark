import { getPref } from "../utils/prefs";
import { getString } from "../utils/locale";

export async function setItemLanguage(item: Zotero.Item, language: string) {
  item.setField("language", language);
  await item.save();
}

export async function batchSetAll(language: string, force: boolean) {
  const s = new Zotero.Search();
  const ids = await s.search();
  if (!ids) return;

  let changed = 0;
  let skipped = 0;
  const total = ids.length;

  const progress = new ztoolkit.ProgressWindow(addon.data.config.addonName, {
    closeOnClick: false,
  })
    .createLine({
      text: getString("pref-batch-progress"),
      type: "default",
      progress: 0,
    })
    .show();

  for (let i = 0; i < ids.length; i++) {
    try {
      const item = (await Zotero.Items.getAsync(ids[i])) as Zotero.Item;
      if (!item?.isRegularItem || !item.isRegularItem()) {
        continue;
      }
      const currentLang = item.getField("language");
      if (force || !currentLang) {
        item.setField("language", language);
        await item.save();
        changed++;
      } else {
        skipped++;
      }
    } catch {
      // skip errors silently
    }
    if (i % 50 === 0 || i === ids.length - 1) {
      progress.changeLine({
        progress: Math.round((i / total) * 100),
        text: getString("pref-batch-progress-detail", {
          args: { changed, total, skipped },
        }),
      });
      await Zotero.Promise.delay(1);
    }
  }

  progress.changeLine({
    progress: 100,
    text: getString("pref-batch-complete", {
      args: { changed, skipped, total },
    }),
    type: "success",
  });
  progress.startCloseTimer(5000);
}

export function registerAutoSetNotifier() {
  const notifierID = Zotero.Notifier.registerObserver(
    {
      notify: async (event: string, type: string, ids: number[] | string[]) => {
        if (event !== "add" || type !== "item") return;
        if (!getPref("autoSetOnImport")) return;

        const language = getPref("targetLanguage") as string;
        if (!language) return;

        for (const id of ids) {
          try {
            const item = (await Zotero.Items.getAsync(
              id as number,
            )) as Zotero.Item;
            if (!item?.isRegularItem || !item.isRegularItem()) continue;
            item.setField("language", language);
            await item.save();
          } catch {
            // skip errors
          }
        }
      },
    },
    ["item"],
  );

  Zotero.Plugins.addObserver({
    shutdown: ({ id }) => {
      if (id === addon.data.config.addonID) {
        Zotero.Notifier.unregisterObserver(notifierID);
      }
    },
  });
}
