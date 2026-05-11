import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMacroForge } from "../hooks/useMacroForge";

const label = (iso) => iso.slice(5);

export default function InsightsPage() {
  const { weeklySeries, settings } = useMacroForge();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
        <h2 className="mb-3 font-display text-2xl text-frost">Weekly Macros</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" tickFormatter={label} stroke="#9f9b95" />
              <YAxis stroke="#9f9b95" />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #303030" }} />
              <Legend />
              <Bar dataKey="protein" fill="#8df4be" name="Protein" />
              <Bar dataKey="carbs" fill="#f5d67a" name="Carbs" />
              <Bar dataKey="fat" fill="#ff7f73" name="Fat" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
          <h3 className="mb-3 text-sm text-muted">Daily Protein vs Target</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tickFormatter={label} stroke="#9f9b95" />
                <YAxis stroke="#9f9b95" />
                <Tooltip contentStyle={{ background: "#181818", border: "1px solid #303030" }} />
                <Line dataKey="protein" stroke="#8df4be" strokeWidth={3} dot={false} />
                <Line dataKey={() => settings.targets.protein} stroke="#f3f0ea" strokeDasharray="5 5" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-glow">
          <h3 className="mb-3 text-sm text-muted">Water Trend (ml)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tickFormatter={label} stroke="#9f9b95" />
                <YAxis stroke="#9f9b95" />
                <Tooltip contentStyle={{ background: "#181818", border: "1px solid #303030" }} />
                <Line dataKey="water" stroke="#8ec8ff" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
