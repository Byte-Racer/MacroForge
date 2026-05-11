export const HERO_PATH = [
  { name: "Forage Wisp", title: "Initiate", vibe: "A tiny spark learning the rhythm of discipline." },
  { name: "Iron Squire", title: "Vanguard", vibe: "Basic form, stable stance, macros under watch." },
  { name: "Shade Rogue", title: "Skirmisher", vibe: "Fast, precise, protein-focused striker." },
  { name: "Dawn Ranger", title: "Pathfinder", vibe: "Balanced hunter with steady fibre and hydration." },
  { name: "Aegis Paladin", title: "Bulwark", vibe: "Heavy guardian sustained by elite consistency." },
  { name: "Rune Spellblade", title: "Mythic", vibe: "Master form. High compliance, high streak, high power." },
];

export const LEVELS_PER_CLASS = 8;
export const XP_PER_LEVEL = 140;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const kcalScore = (kcal, target) => {
  if (!target) return 0;
  const ratio = kcal / target;
  const closeness = 1 - Math.abs(1 - ratio);
  return clamp(closeness, 0, 1) * 100;
};

const metricScore = (value, target) => {
  if (!target) return 0;
  return clamp(value / target, 0, 1) * 100;
};

export const buildHeroProgress = ({ days, streak, targets }) => {
  const dayScores = days.map((day) => {
    const protein = metricScore(day.protein, targets.protein);
    const fibre = metricScore(day.fibre, targets.fibre);
    const water = metricScore(day.water, targets.water);
    const kcal = kcalScore(day.kcal, targets.kcal);

    const score = (protein + fibre + water + kcal) / 4;
    const perfect =
      day.protein >= targets.protein &&
      day.fibre >= targets.fibre &&
      day.water >= targets.water &&
      day.kcal >= targets.kcal * 0.85 &&
      day.kcal <= targets.kcal * 1.15;

    return { score, perfect };
  });

  const perfectDays = dayScores.filter((d) => d.perfect).length;
  const nutritionXp = Math.round(dayScores.reduce((acc, d) => acc + d.score, 0));
  const streakXp = streak * 40;
  const perfectXp = perfectDays * 60;
  const totalXp = nutritionXp + streakXp + perfectXp;

  const totalLevel = Math.max(1, Math.floor(totalXp / XP_PER_LEVEL) + 1);
  const classIndex = clamp(Math.floor((totalLevel - 1) / LEVELS_PER_CLASS), 0, HERO_PATH.length - 1);
  const levelInClass = clamp(((totalLevel - 1) % LEVELS_PER_CLASS) + 1, 1, LEVELS_PER_CLASS);

  const nextLevelXp = totalLevel * XP_PER_LEVEL;
  const prevLevelXp = (totalLevel - 1) * XP_PER_LEVEL;
  const xpIntoLevel = totalXp - prevLevelXp;
  const xpNeeded = nextLevelXp - prevLevelXp;
  const progressPct = Math.round((xpIntoLevel / xpNeeded) * 100);

  return {
    classIndex,
    currentClass: HERO_PATH[classIndex],
    levelInClass,
    totalLevel,
    totalXp,
    progressPct,
    xpIntoLevel,
    xpNeeded,
    perfectDays,
    nutritionXp,
    streakXp,
    perfectXp,
    canEvolve: levelInClass === LEVELS_PER_CLASS && classIndex < HERO_PATH.length - 1,
    nextClass: HERO_PATH[classIndex + 1] ?? null,
  };
};