const id = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const seedFoods = [
  ["Cooked Rice", 130, 2.7, 28.2, 0.3, 0.4],
  ["Whole Wheat Roti", 297, 9.8, 55.8, 3.7, 7.1],
  ["Paneer", 265, 18.3, 1.2, 20.8, 0],
  ["Curd", 98, 3.1, 3.4, 4.3, 0],
  ["Chicken Breast", 165, 31, 0, 3.6, 0],
  ["Egg Whole", 155, 13, 1.1, 11, 0],
  ["Egg White", 52, 11, 0.7, 0.2, 0],
  ["Moong Dal Cooked", 105, 7, 18, 0.4, 7.6],
  ["Toor Dal Cooked", 116, 7.2, 20, 1.1, 6.8],
  ["Chana Dal Cooked", 139, 8.8, 24, 1.5, 8],
  ["Rajma Cooked", 127, 8.7, 22.8, 0.5, 6.4],
  ["Chole Cooked", 164, 8.9, 27.4, 2.6, 7.6],
  ["Oats", 389, 16.9, 66.3, 6.9, 10.6],
  ["Poha", 130, 2.6, 28.6, 0.2, 1],
  ["Upma", 143, 3.4, 23, 4.4, 2.4],
  ["Idli", 146, 4.5, 28.5, 0.7, 1.5],
  ["Dosa", 184, 4.2, 29.6, 5.6, 1.9],
  ["Sambar", 75, 3.5, 10.1, 2.1, 2.6],
  ["Peanut Butter", 588, 25, 20, 50, 6],
  ["Almonds", 579, 21.2, 21.6, 49.9, 12.5],
  ["Banana", 89, 1.1, 22.8, 0.3, 2.6],
  ["Apple", 52, 0.3, 13.8, 0.2, 2.4],
  ["Milk 2%", 50, 3.4, 4.8, 1.9, 0],
  ["Whey Protein", 400, 80, 8, 6, 1],
  ["Tofu", 76, 8, 1.9, 4.8, 0.3],
  ["Sweet Potato", 86, 1.6, 20.1, 0.1, 3],
  ["Boiled Potato", 87, 1.9, 20.1, 0.1, 1.8],
  ["Olive Oil", 884, 0, 0, 100, 0],
  ["Ghee", 900, 0, 0, 100, 0],
  ["Mixed Veg Sabzi", 95, 2.8, 10.3, 4.5, 3.5],
].map(([name, kcal, protein, carbs, fat, fibre]) => ({
  id: id(name),
  name,
  per100: { kcal, protein, carbs, fat, fibre },
}));

export const defaultSettings = {
  targets: {
    kcal: 2200,
    protein: 160,
    carbs: 250,
    fat: 70,
    fibre: 30,
    water: 3000,
  },
  profile: {
    heightCm: 175,
    targetWeightKg: 70,
    weightLog: [{ date: new Date().toISOString().slice(0, 10), kg: 74 }],
  },
};

export const seedMeals = [];
export const seedTemplates = [];