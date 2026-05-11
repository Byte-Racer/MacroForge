export const STORAGE_KEYS = {
  foods: "macroforge.foods",
  meals: "macroforge.meals",
  templates: "macroforge.templates",
  settings: "macroforge.settings",
  water: "macroforge.water",
};

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const readStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  return safeParse(localStorage.getItem(key), fallback);
};

export const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};