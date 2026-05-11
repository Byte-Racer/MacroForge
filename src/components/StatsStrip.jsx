import React from "react";
import { Fire, PersonSimpleRun } from "@phosphor-icons/react";

export default function StatsStrip({ streak, bmi }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="card-shell p-4">
        <div className="mb-2 flex items-center gap-2 text-coral">
          <Fire size={18} weight="duotone" />
          <span className="font-mono text-xs uppercase tracking-[0.14em]">Streak</span>
        </div>
        <p className="font-display text-4xl font-bold text-frost">{streak}</p>
      </div>
      <div className="card-shell p-4">
        <div className="mb-2 flex items-center gap-2 text-calorie">
          <PersonSimpleRun size={18} weight="duotone" />
          <span className="font-mono text-xs uppercase tracking-[0.14em]">BMI</span>
        </div>
        <p className="font-display text-4xl font-bold text-frost">{bmi || "--"}</p>
      </div>
    </div>
  );
}