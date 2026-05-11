import React from "react";

export default function MacroForgeLogo() {
  return (
    <div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Personal Nutrition Ledger</p>
        <h1 className="mt-1 flex items-center gap-2 leading-none">
          <span className="font-brand text-5xl font-bold tracking-wide text-frost">Macro</span>
          <span className="inline-flex h-10 w-6 items-center justify-center">
            <svg viewBox="0 0 30 72" className="h-10 w-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4v50" stroke="#dfc88c" strokeWidth="4" />
              <path d="M8 20h14" stroke="#9fd7c9" strokeWidth="4" />
              <path d="M9 56l6 12 6-12z" fill="#dfc88c" />
            </svg>
          </span>
          <span className="font-brand text-5xl font-bold tracking-wide text-protein">Forge</span>
          <span className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm text-calorie">✦</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm text-water">◍</span>
        </h1>
      </div>
    </div>
  );
}
