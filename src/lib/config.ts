export const THEMES = ["dark", "light"] as const;
export type ThemeId = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeId = "dark";
export const THEME_BG: Record<ThemeId, string> = { dark: "#181818", light: "#f8f8f8" };
export const THEME_LABEL: Record<ThemeId, string> = { dark: "Dark Modern", light: "Light Modern" };
export const isTheme = (v: unknown): v is ThemeId => THEMES.includes(v as ThemeId);

/** Model used by the "Ask me anything" assistant. */
export const CHAT_MODEL = "claude-opus-5";

/** Inline script run before paint so the saved theme never flashes. Dark is the default look. */
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");d.dataset.theme=(t==="light"||t==="dark")?t:"${DEFAULT_THEME}";}catch(e){d.dataset.theme="${DEFAULT_THEME}";}})();`;
