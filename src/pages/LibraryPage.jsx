import React from "react";
import { useMemo, useState } from "react";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useMacroForge } from "../hooks/useMacroForge";

const blank = { name: "", per100: { kcal: "", protein: "", carbs: "", fat: "", fibre: "" } };

export default function LibraryPage() {
  const { foods, addFood, updateFood, deleteFood } = useMacroForge();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(blank);
  const [editingId, setEditingId] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((food) => food.name.toLowerCase().includes(q));
  }, [foods, query]);

  const onDraftMacro = (key, value) => {
    setDraft((prev) => ({ ...prev, per100: { ...prev.per100, [key]: value } }));
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setDraft({
      name: food.name,
      per100: {
        kcal: food.per100.kcal,
        protein: food.per100.protein,
        carbs: food.per100.carbs,
        fat: food.per100.fat,
        fibre: food.per100.fibre,
      },
    });
  };

  const clearForm = () => {
    setEditingId("");
    setDraft(blank);
  };

  const submit = () => {
    if (!draft.name.trim()) return;
    const payload = {
      name: draft.name,
      per100: {
        kcal: Number(draft.per100.kcal) || 0,
        protein: Number(draft.per100.protein) || 0,
        carbs: Number(draft.per100.carbs) || 0,
        fat: Number(draft.per100.fat) || 0,
        fibre: Number(draft.per100.fibre) || 0,
      },
    };

    if (editingId) {
      updateFood(editingId, payload);
    } else {
      addFood(payload);
    }

    clearForm();
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
        <div className="grid gap-2 md:grid-cols-6">
          <input
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            placeholder="Food name"
            className="rounded-xl border-white/10 bg-ink/70 md:col-span-2"
          />
          {[
            ["kcal", "kcal"],
            ["protein", "protein"],
            ["carbs", "carbs"],
            ["fat", "fat"],
            ["fibre", "fibre"],
          ].map(([key, label]) => (
            <input
              key={key}
              type="number"
              value={draft.per100[key]}
              onChange={(e) => onDraftMacro(key, e.target.value)}
              placeholder={label}
              className="rounded-xl border-white/10 bg-ink/70"
            />
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={submit} className="rounded-xl bg-protein/90 px-3 py-2 text-sm font-semibold text-ink">
            <Plus className="mr-1 inline" size={14} /> {editingId ? "Update" : "Add"} Food
          </button>
          {editingId ? (
            <button onClick={clearForm} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-muted">
              Cancel Edit
            </button>
          ) : null}
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search foods..."
        className="w-full rounded-xl border-white/10 bg-card text-frost placeholder:text-muted"
      />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-glow">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="px-3 py-2 text-left">Food</th>
              <th className="px-3 py-2 text-right">Kcal</th>
              <th className="px-3 py-2 text-right">P</th>
              <th className="px-3 py-2 text-right">C</th>
              <th className="px-3 py-2 text-right">F</th>
              <th className="px-3 py-2 text-right">Fi</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((food) => (
              <tr key={food.id} className="border-t border-white/5">
                <td className="px-3 py-2">{food.name}</td>
                <td className="px-3 py-2 text-right">{food.per100.kcal}</td>
                <td className="px-3 py-2 text-right">{food.per100.protein}</td>
                <td className="px-3 py-2 text-right">{food.per100.carbs}</td>
                <td className="px-3 py-2 text-right">{food.per100.fat}</td>
                <td className="px-3 py-2 text-right">{food.per100.fibre}</td>
                <td className="px-3 py-2 text-right">
                  <button className="mr-2 rounded p-1 text-water hover:bg-water/10" onClick={() => startEdit(food)}>
                    <PencilSimple size={16} />
                  </button>
                  <button className="rounded p-1 text-coral hover:bg-coral/10" onClick={() => deleteFood(food.id)}>
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
