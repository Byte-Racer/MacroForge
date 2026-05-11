import React from "react";
import { useMemo, useState } from "react";
import { ArrowsClockwise, FloppyDiskBack, PlusCircle, Trash } from "@phosphor-icons/react";
import { useMacroForge } from "../hooks/useMacroForge";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
const macroLabels = [
  ["kcal", "kcal"],
  ["protein", "P"],
  ["carbs", "C"],
  ["fat", "F"],
  ["fibre", "Fi"],
];

export default function LogMealPage() {
  const { today, foods, addMeal, templates, saveTemplate, recentMealPatterns, addMealFromExisting } = useMacroForge();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("lunch");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [status, setStatus] = useState("");

  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return foods.slice(0, 8);
    return foods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 10);
  }, [foods, search]);

  const rows = useMemo(() => {
    return items
      .map((item) => {
        const food = foods.find((f) => f.id === item.foodId);
        if (!food) return null;
        const factor = Number(item.qty || 0) / 100;
        return {
          ...item,
          name: food.name,
          kcal: +(food.per100.kcal * factor).toFixed(1),
          protein: +(food.per100.protein * factor).toFixed(1),
          carbs: +(food.per100.carbs * factor).toFixed(1),
          fat: +(food.per100.fat * factor).toFixed(1),
          fibre: +(food.per100.fibre * factor).toFixed(1),
        };
      })
      .filter(Boolean);
  }, [items, foods]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          kcal: acc.kcal + row.kcal,
          protein: acc.protein + row.protein,
          carbs: acc.carbs + row.carbs,
          fat: acc.fat + row.fat,
          fibre: acc.fibre + row.fibre,
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
      ),
    [rows]
  );

  const addFoodRow = (foodId) => {
    setItems((prev) => {
      const existing = prev.find((row) => row.foodId === foodId);
      if (existing) return prev.map((row) => (row.foodId === foodId ? { ...row, qty: row.qty + 50 } : row));
      return [...prev, { foodId, qty: 100 }];
    });
  };

  const updateQty = (foodId, qty) => {
    setItems((prev) => prev.map((row) => (row.foodId === foodId ? { ...row, qty: Number(qty) || 0 } : row)));
  };

  const removeRow = (foodId) => {
    setItems((prev) => prev.filter((row) => row.foodId !== foodId));
  };

  const resetForm = () => {
    setMealName("");
    setMealType("lunch");
    setItems([]);
    setSearch("");
  };

  const handleSaveMeal = () => {
    const created = addMeal({ date: today, type: mealType, name: mealName, items });
    if (!created) {
      setStatus("Add meal name and at least one valid item.");
      return;
    }
    setStatus("Meal logged.");
    resetForm();
  };

  const handleSaveTemplate = () => {
    const created = saveTemplate({ name: templateName || mealName || "Quick Template", items });
    if (!created) {
      setStatus("Template needs a name and at least one item.");
      return;
    }
    setTemplateName("");
    setStatus("Template saved.");
  };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-card p-5 shadow-glow lg:col-span-2">
        <h2 className="font-display text-2xl text-frost">Log Meal</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Meal name (e.g., Post Workout Bowl)"
            className="rounded-xl border-white/10 bg-ink/70 text-frost"
          />
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="rounded-xl border-white/10 bg-ink/70 text-frost">
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-white/10 p-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food library and tap to add..."
            className="mb-3 w-full rounded-xl border-white/10 bg-ink/70 text-frost"
          />
          <div className="flex flex-wrap gap-2">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => addFoodRow(food.id)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-frost hover:border-protein"
              >
                + {food.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted">No items added yet.</p>
          ) : (
            rows.map((row) => (
              <div key={row.foodId} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-white/10 p-2">
                <div>
                  <p className="text-sm font-medium">{row.name}</p>
                  <p className="text-xs text-muted">{row.protein}g protein, {row.kcal} kcal</p>
                </div>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={row.qty}
                  onChange={(e) => updateQty(row.foodId, e.target.value)}
                  className="w-24 rounded-lg border-white/10 bg-ink/70 px-2 py-1 text-right"
                />
                <button type="button" onClick={() => removeRow(row.foodId)} className="rounded-lg p-1 text-coral hover:bg-coral/10">
                  <Trash size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-ink/50 p-3">
          <div className="flex flex-wrap gap-3 text-sm">
            {macroLabels.map(([key, label]) => (
              <p key={key} className="rounded-lg bg-white/5 px-2 py-1">
                <span className="font-display text-protein">{totals[key].toFixed(1)}</span> {label}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button onClick={handleSaveMeal} className="rounded-xl bg-protein/90 px-3 py-2 font-semibold text-ink">
            <PlusCircle className="mr-1 inline" size={16} /> Save Meal
          </button>
          <button onClick={resetForm} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-muted">
            <ArrowsClockwise className="mr-1 inline" size={16} /> Reset
          </button>
          <button onClick={handleSaveTemplate} className="rounded-xl border border-calorie/40 bg-calorie/15 px-3 py-2 text-sm text-calorie">
            <FloppyDiskBack className="mr-1 inline" size={16} /> Save Template
          </button>
        </div>
        <input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Optional template name"
          className="w-full rounded-xl border-white/10 bg-ink/70 text-frost"
        />
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
          <h3 className="mb-2 text-sm text-muted">Add From Templates</h3>
          <div className="space-y-2">
            {templates.length === 0 ? (
              <p className="text-sm text-muted">No templates yet.</p>
            ) : (
              templates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setItems(template.items)}
                  className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm hover:border-protein"
                >
                  {template.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
          <h3 className="mb-2 text-sm text-muted">Add From Recent</h3>
          <div className="space-y-2">
            {recentMealPatterns.length === 0 ? (
              <p className="text-sm text-muted">No history yet.</p>
            ) : (
              recentMealPatterns.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => addMealFromExisting(meal)}
                  className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm hover:border-protein"
                >
                  {meal.name} <span className="text-xs text-muted">({meal.uses}x)</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
