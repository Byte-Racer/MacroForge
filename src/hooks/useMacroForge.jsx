import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSettings, seedFoods, seedMeals, seedTemplates } from "../data/defaults";
import { buildHeroProgress } from "../data/heroPath";
import { daysAgoIso, isSameDay } from "../utils/date";
import { readStorage, STORAGE_KEYS, todayKey, writeStorage } from "../utils/storage";

const MacroForgeContext = createContext(null);

const round = (n) => Math.round((n + Number.EPSILON) * 10) / 10;
const macroKeys = ["kcal", "protein", "carbs", "fat", "fibre"];

const emptyMacros = () => ({ kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 });
const asArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const normalizeSettings = (input) => {
  const raw = input && typeof input === "object" ? input : {};
  const profile = raw.profile && typeof raw.profile === "object" ? raw.profile : {};
  const targets = raw.targets && typeof raw.targets === "object" ? raw.targets : {};

  return {
    targets: {
      kcal: Number(targets.kcal ?? defaultSettings.targets.kcal),
      protein: Number(targets.protein ?? defaultSettings.targets.protein),
      carbs: Number(targets.carbs ?? defaultSettings.targets.carbs),
      fat: Number(targets.fat ?? defaultSettings.targets.fat),
      fibre: Number(targets.fibre ?? defaultSettings.targets.fibre),
      water: Number(targets.water ?? defaultSettings.targets.water),
    },
    profile: {
      heightCm: Number(profile.heightCm ?? defaultSettings.profile.heightCm),
      targetWeightKg: Number(profile.targetWeightKg ?? defaultSettings.profile.targetWeightKg),
      weightLog: asArray(profile.weightLog, defaultSettings.profile.weightLog).filter(
        (entry) => entry && entry.date && Number.isFinite(Number(entry.kg))
      ),
    },
  };
};

const normalizeMeals = (list) => asArray(list).filter((meal) => meal && meal.date && meal.name && meal.totals && Array.isArray(meal.items));
const normalizeTemplates = (list) => asArray(list).filter((template) => template && template.name && Array.isArray(template.items));
const normalizeFoods = (list) =>
  asArray(list)
    .filter((food) => food && food.id && food.name && food.per100)
    .map((food) => ({
      id: food.id,
      name: String(food.name),
      per100: {
        kcal: Number(food.per100.kcal ?? 0),
        protein: Number(food.per100.protein ?? 0),
        carbs: Number(food.per100.carbs ?? 0),
        fat: Number(food.per100.fat ?? 0),
        fibre: Number(food.per100.fibre ?? 0),
      },
    }));

const normalizeWater = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const safe = {};
  Object.entries(value).forEach(([key, ml]) => {
    if (key && Number.isFinite(Number(ml))) safe[key] = Number(ml);
  });
  return safe;
};

const multiplyPer100 = (per100, qty) => {
  const factor = qty / 100;
  return {
    kcal: round(per100.kcal * factor),
    protein: round(per100.protein * factor),
    carbs: round(per100.carbs * factor),
    fat: round(per100.fat * factor),
    fibre: round(per100.fibre * factor),
  };
};

const sumMacros = (entries) =>
  entries.reduce((acc, row) => {
    macroKeys.forEach((key) => {
      acc[key] += Number(row[key] ?? 0);
    });
    return acc;
  }, emptyMacros());

const sanitizeFood = (food) => ({
  id: food.id,
  name: food.name.trim(),
  per100: {
    kcal: Number(food.per100.kcal),
    protein: Number(food.per100.protein),
    carbs: Number(food.per100.carbs),
    fat: Number(food.per100.fat),
    fibre: Number(food.per100.fibre),
  },
});

export function MacroForgeProvider({ children }) {
  const [foods, setFoods] = useState(() => {
    const stored = normalizeFoods(readStorage(STORAGE_KEYS.foods, seedFoods));
    return stored.length ? stored : seedFoods;
  });
  const [meals, setMeals] = useState(() => normalizeMeals(readStorage(STORAGE_KEYS.meals, seedMeals)));
  const [templates, setTemplates] = useState(() => normalizeTemplates(readStorage(STORAGE_KEYS.templates, seedTemplates)));
  const [settings, setSettings] = useState(() => normalizeSettings(readStorage(STORAGE_KEYS.settings, defaultSettings)));
  const [waterByDay, setWaterByDay] = useState(() => normalizeWater(readStorage(STORAGE_KEYS.water, {})));

  useEffect(() => writeStorage(STORAGE_KEYS.foods, foods), [foods]);
  useEffect(() => writeStorage(STORAGE_KEYS.meals, meals), [meals]);
  useEffect(() => writeStorage(STORAGE_KEYS.templates, templates), [templates]);
  useEffect(() => writeStorage(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => writeStorage(STORAGE_KEYS.water, waterByDay), [waterByDay]);

  const today = todayKey();
  const foodMap = useMemo(() => new Map(foods.map((food) => [food.id, food])), [foods]);
  const todayMeals = useMemo(() => meals.filter((meal) => isSameDay(meal.date, today)), [meals, today]);

  const dailyTotals = useMemo(() => {
    const total = sumMacros(todayMeals.map((meal) => meal.totals));
    return Object.fromEntries(macroKeys.map((key) => [key, round(total[key])]));
  }, [todayMeals]);

  const waterToday = waterByDay[today] ?? 0;

  const bmi = useMemo(() => {
    const weightLog = asArray(settings?.profile?.weightLog);
    const latest = weightLog[weightLog.length - 1]?.kg;
    const hM = Number(settings?.profile?.heightCm ?? 0) / 100;
    if (!latest || !hM) return 0;
    return round(latest / (hM * hM));
  }, [settings]);

  const streak = useMemo(() => {
    const dates = new Set(meals.map((m) => m.date.slice(0, 10)));
    let count = 0;
    const cursor = new Date();
    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [meals]);

  const recentMealPatterns = useMemo(() => {
    const byName = new Map();
    meals.forEach((meal) => {
      const key = `${meal.name.toLowerCase()}-${meal.type}`;
      if (!byName.has(key)) byName.set(key, { ...meal, uses: 0 });
      byName.get(key).uses += 1;
    });
    return [...byName.values()].sort((a, b) => b.uses - a.uses || (a.name > b.name ? 1 : -1)).slice(0, 6);
  }, [meals]);

  const weeklySeries = useMemo(
    () =>
      Array.from({ length: 7 }, (_, offset) => {
        const day = daysAgoIso(6 - offset);
        const dayMeals = meals.filter((meal) => meal.date.slice(0, 10) === day);
        const totals = sumMacros(dayMeals.map((meal) => meal.totals));
        return {
          date: day,
          kcal: round(totals.kcal),
          protein: round(totals.protein),
          carbs: round(totals.carbs),
          fat: round(totals.fat),
          fibre: round(totals.fibre),
          water: waterByDay[day] ?? 0,
        };
      }),
    [meals, waterByDay]
  );

  const allDaySeries = useMemo(() => {
    const bucket = new Map();

    meals.forEach((meal) => {
      const key = meal.date.slice(0, 10);
      const prev = bucket.get(key) ?? { date: key, ...emptyMacros(), water: 0 };
      bucket.set(key, {
        ...prev,
        kcal: prev.kcal + Number(meal.totals.kcal ?? 0),
        protein: prev.protein + Number(meal.totals.protein ?? 0),
        carbs: prev.carbs + Number(meal.totals.carbs ?? 0),
        fat: prev.fat + Number(meal.totals.fat ?? 0),
        fibre: prev.fibre + Number(meal.totals.fibre ?? 0),
      });
    });

    Object.entries(waterByDay).forEach(([date, water]) => {
      const prev = bucket.get(date) ?? { date, ...emptyMacros(), water: 0 };
      bucket.set(date, { ...prev, water: Number(water ?? 0) });
    });

    return [...bucket.values()].sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [meals, waterByDay]);

  const hero = useMemo(
    () =>
      buildHeroProgress({
        days: allDaySeries,
        streak,
        targets: settings.targets,
      }),
    [allDaySeries, settings.targets, streak]
  );

  const addWater = (ml = 250) => setWaterByDay((prev) => ({ ...prev, [today]: (prev[today] ?? 0) + ml }));

  const buildMeal = ({ date, type, name, items }) => {
    const resolvedItems = asArray(items)
      .map((item) => {
        const food = foodMap.get(item.foodId);
        if (!food) return null;
        const qty = Number(item.qty);
        if (!qty || qty <= 0) return null;
        return { foodId: food.id, qty, ...multiplyPer100(food.per100, qty) };
      })
      .filter(Boolean);

    const totals = sumMacros(resolvedItems);

    return {
      id: `meal-${crypto.randomUUID()}`,
      date,
      type,
      name: String(name ?? "").trim(),
      items: resolvedItems.map(({ foodId, qty }) => ({ foodId, qty })),
      totals: Object.fromEntries(macroKeys.map((key) => [key, round(totals[key])])),
    };
  };

  const addMeal = (payload) => {
    const newMeal = buildMeal(payload);
    if (!newMeal.name || newMeal.items.length === 0) return null;
    setMeals((prev) => [newMeal, ...prev]);
    return newMeal;
  };

  const addMealFromExisting = (meal, date = today) => addMeal({ date, type: meal.type, name: meal.name, items: meal.items });

  const saveTemplate = ({ name, items }) => {
    const cleanedItems = asArray(items).filter((item) => Number(item.qty) > 0);
    if (!name.trim() || cleanedItems.length === 0) return null;
    const template = { id: `template-${crypto.randomUUID()}`, name: name.trim(), items: cleanedItems };
    setTemplates((prev) => [template, ...prev]);
    return template;
  };

  const addFood = ({ name, per100 }) => {
    const item = sanitizeFood({ id: `food-${crypto.randomUUID()}`, name, per100 });
    setFoods((prev) => [item, ...prev]);
    return item;
  };

  const updateFood = (id, patch) => {
    setFoods((prev) =>
      prev.map((food) => {
        if (food.id !== id) return food;
        return sanitizeFood({ ...food, ...patch, per100: { ...food.per100, ...(patch.per100 ?? {}) } });
      })
    );
  };

  const deleteFood = (id) => setFoods((prev) => prev.filter((food) => food.id !== id));

  const value = {
    foods,
    meals,
    templates,
    settings,
    today,
    todayMeals,
    dailyTotals,
    waterToday,
    bmi,
    streak,
    weeklySeries,
    recentMealPatterns,
    hero,
    setSettings,
    addWater,
    addMeal,
    addMealFromExisting,
    saveTemplate,
    addFood,
    updateFood,
    deleteFood,
  };

  return <MacroForgeContext.Provider value={value}>{children}</MacroForgeContext.Provider>;
}

export const useMacroForge = () => {
  const ctx = useContext(MacroForgeContext);
  if (!ctx) throw new Error("useMacroForge must be used inside MacroForgeProvider");
  return ctx;
};