import React from "react";

export default function MacroRing({ label, value, target, color, unit }) {
  const pct = Math.min(100, Math.round((value / Math.max(target, 1)) * 100));

  return (
    <div className="card-shell p-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
          <p className="mt-2 font-display text-5xl font-bold leading-none" style={{ color }}>
            {Math.round(value)}
          </p>
          <p className="mt-1 text-sm text-muted">
            / {target} {unit}
          </p>
        </div>
        <p className="font-mono text-sm" style={{ color }}>
          {pct}%
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1e1e1e]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}