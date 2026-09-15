const KEY = 'markdown-workspace-preferences';
const defaults = { wrap: false, vim: true, sync: true, darkPreview: false };

/** Preference storage is optional: privacy mode or quota errors must not block editing. */
export function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return {
      ...Object.fromEntries(
        Object.entries(defaults).map(([key, value]) => [
          key,
          typeof saved?.[key] === 'boolean' ? saved[key] : value,
        ]),
      ),
      split:
        typeof saved?.split === 'number' && Number.isFinite(saved.split)
          ? Math.min(80, Math.max(20, saved.split))
          : 50,
    };
  } catch {
    return { ...defaults, split: 50 };
  }
}

export function savePreferences(preferences) {
  try {
    localStorage.setItem(KEY, JSON.stringify(preferences));
  } catch {
    /* Best effort. */
  }
}
