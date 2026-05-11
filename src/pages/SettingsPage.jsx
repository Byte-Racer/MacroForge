import React from "react";
import { useMemo, useState } from "react";
import { useMacroForge } from "../hooks/useMacroForge";

export default function SettingsPage() {
  const { settings, setSettings } = useMacroForge();
  const [status, setStatus] = useState("");
  const [newWeightKg, setNewWeightKg] = useState("");
  const [newWeightDate, setNewWeightDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [form, setForm] = useState(() => ({
    targets: { ...settings.targets },
    profile: {
      heightCm: settings.profile.heightCm,
      targetWeightKg: settings.profile.targetWeightKg,
      weightLog: [...settings.profile.weightLog],
    },
  }));

  const latestWeight = useMemo(() => form.profile.weightLog[form.profile.weightLog.length - 1]?.kg ?? "-", [form.profile.weightLog]);

  const updateTarget = (key, value) => {
    setForm((prev) => ({ ...prev, targets: { ...prev.targets, [key]: Number(value) || 0 } }));
  };

  const updateProfile = (key, value) => {
    setForm((prev) => ({ ...prev, profile: { ...prev.profile, [key]: Number(value) || 0 } }));
  };

  const addWeightEntry = () => {
    if (!newWeightDate || !newWeightKg) return;
    setForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        weightLog: [...prev.profile.weightLog, { date: newWeightDate, kg: Number(newWeightKg) }].sort((a, b) =>
          a.date > b.date ? 1 : -1
        ),
      },
    }));
    setNewWeightKg("");
  };

  const removeWeightEntry = (index) => {
    setForm((prev) => ({
      ...prev,
      profile: { ...prev.profile, weightLog: prev.profile.weightLog.filter((_, i) => i !== index) },
    }));
  };

  const saveAll = () => {
    setSettings(form);
    setStatus("Settings saved.");
    setTimeout(() => setStatus(""), 1500);
  };

  const exportJson = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        settings: form,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `macroforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("Backup exported.");
      setTimeout(() => setStatus(""), 1600);
    } catch {
      setStatus("Export failed.");
    }
  };

  const importJson = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = parsed?.settings ?? parsed;
      if (!incoming?.targets || !incoming?.profile) {
        setStatus("Invalid backup format.");
        return;
      }

      const safe = {
        targets: {
          kcal: Number(incoming.targets.kcal) || 0,
          protein: Number(incoming.targets.protein) || 0,
          carbs: Number(incoming.targets.carbs) || 0,
          fat: Number(incoming.targets.fat) || 0,
          fibre: Number(incoming.targets.fibre) || 0,
          water: Number(incoming.targets.water) || 0,
        },
        profile: {
          heightCm: Number(incoming.profile.heightCm) || 0,
          targetWeightKg: Number(incoming.profile.targetWeightKg) || 0,
          weightLog: Array.isArray(incoming.profile.weightLog)
            ? incoming.profile.weightLog
                .filter((item) => item?.date && Number.isFinite(Number(item.kg)))
                .map((item) => ({ date: item.date, kg: Number(item.kg) }))
            : [],
        },
      };

      setForm(safe);
      setSettings(safe);
      setStatus("Backup imported.");
      setTimeout(() => setStatus(""), 1600);
    } catch {
      setStatus("Import failed. Invalid JSON file.");
    }
  };

  const Field = ({ label, hint, children }) => (
    <label className="block">
      <p className="mb-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </label>
  );

  return (
    <section className="space-y-4">
      <div className="card-shell p-6">
        <h2 className="font-display text-2xl text-frost">Targets</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Calories Target" hint="kcal/day">
            <input type="number" value={form.targets.kcal} onChange={(e) => updateTarget("kcal", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Protein Target" hint="grams/day">
            <input type="number" value={form.targets.protein} onChange={(e) => updateTarget("protein", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Carbs Target" hint="grams/day">
            <input type="number" value={form.targets.carbs} onChange={(e) => updateTarget("carbs", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Fat Target" hint="grams/day">
            <input type="number" value={form.targets.fat} onChange={(e) => updateTarget("fat", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Fibre Target" hint="grams/day">
            <input type="number" value={form.targets.fibre} onChange={(e) => updateTarget("fibre", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Water Target" hint="ml/day">
            <input type="number" value={form.targets.water} onChange={(e) => updateTarget("water", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
        </div>
      </div>

      <div className="card-shell p-6">
        <h2 className="font-display text-2xl text-frost">Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Height" hint="centimeters">
            <input type="number" value={form.profile.heightCm} onChange={(e) => updateProfile("heightCm", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Target Weight" hint="kilograms">
            <input type="number" value={form.profile.targetWeightKg} onChange={(e) => updateProfile("targetWeightKg", e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
        </div>
        <p className="mt-2 text-sm text-muted">Latest logged weight: {latestWeight} kg</p>
      </div>

      <div className="card-shell p-6">
        <h2 className="font-display text-2xl text-frost">Weight Log</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field label="Log Date">
            <input type="date" value={newWeightDate} onChange={(e) => setNewWeightDate(e.target.value)} className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <Field label="Weight Entry" hint="kilograms">
            <input type="number" value={newWeightKg} onChange={(e) => setNewWeightKg(e.target.value)} placeholder="weight kg" className="w-full rounded-xl border-line bg-[#0f0f0f]" />
          </Field>
          <button onClick={addWeightEntry} className="rounded-xl border border-line bg-protein px-4 py-2 font-semibold text-black">
            Add
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {form.profile.weightLog.map((entry, i) => (
            <div key={`${entry.date}-${i}`} className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
              <p className="text-sm">
                {entry.date} - <span className="font-semibold">{entry.kg} kg</span>
              </p>
              <button onClick={() => removeWeightEntry(i)} className="text-xs text-coral">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={saveAll} className="rounded-xl border border-line bg-calorie px-4 py-2 font-semibold text-black">
          Save Settings
        </button>
        <button onClick={exportJson} className="rounded-xl border border-line px-4 py-2 font-semibold text-frost">
          Export Backup
        </button>
        <label className="rounded-xl border border-line px-4 py-2 font-semibold text-frost">
          Import Backup
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => importJson(e.target.files?.[0])}
          />
        </label>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </section>
  );
}
