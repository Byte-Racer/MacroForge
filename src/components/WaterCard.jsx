import React from "react";
import { Drop } from "@phosphor-icons/react";

export default function WaterCard({ water, target, onAdd }) {
  const pct = Math.min(100, Math.round((water / Math.max(target, 1)) * 100));

  return (
    <div className="card-shell p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Water</p>
          <p className="mt-2 font-display text-5xl font-bold leading-none text-water">{water}</p>
          <p className="mt-1 text-sm text-muted">Target {target} ml</p>
        </div>
        <Drop size={34} weight="duotone" className="text-water" />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1f1f1f]">
        <div className="h-full rounded-full bg-water transition-all" style={{ width: `${pct}%` }} />
      </div>
      <button
        type="button"
        onClick={() => onAdd(250)}
        className="mt-4 w-full rounded-xl border border-line bg-[#1b1b1b] px-3 py-2 text-base font-semibold text-water transition hover:bg-[#222]"
      >
        +250 ml
      </button>
    </div>
  );
}