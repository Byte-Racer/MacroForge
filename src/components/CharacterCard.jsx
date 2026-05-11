import React from "react";

function HeroPortrait({ name }) {
  const tone = {
    "Forage Wisp": "#9fd7c9",
    "Iron Squire": "#dfc88c",
    "Shade Rogue": "#b9b3ff",
    "Dawn Ranger": "#95b9df",
    "Aegis Paladin": "#f2efe8",
    "Rune Spellblade": "#e99890",
  }[name];

  const glyph = {
    "Forage Wisp": "◌",
    "Iron Squire": "⚔",
    "Shade Rogue": "✶",
    "Dawn Ranger": "➹",
    "Aegis Paladin": "⛨",
    "Rune Spellblade": "✦",
  }[name];

  return (
    <svg viewBox="0 0 180 180" className="mx-auto mb-2 h-32 w-32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="80" fill="#090909" stroke="#2b2b2b" strokeWidth="2" />
      <circle cx="90" cy="74" r="23" fill="none" stroke={tone} strokeWidth="3" />
      <path d="M58 132c6-24 18-34 32-34s26 10 32 34" fill="none" stroke={tone} strokeWidth="3" />
      <path d="M42 57l10 3-7 8zM136 46l9 5-8 6zM127 128l10 2-6 8z" fill={tone} opacity="0.85" />
      <text x="90" y="84" textAnchor="middle" fontSize="24" fill={tone} style={{ fontFamily: "DM Mono, monospace" }}>
        {glyph}
      </text>
    </svg>
  );
}

export default function CharacterCard({ hero }) {
  return (
    <aside className="card-shell p-5">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Forge Avatar</p>
      <div className="mt-3 rounded-2xl border border-line bg-[#0b0b0b] p-4 text-center">
        <HeroPortrait name={hero.currentClass.name} />
        <p className="font-display text-3xl font-bold">{hero.currentClass.name}</p>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {hero.currentClass.title} | Lvl {hero.levelInClass}/{8}
        </p>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>XP {hero.xpIntoLevel}/{hero.xpNeeded}</span>
          <span>{hero.progressPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#1e1e1e]">
          <div className="h-full rounded-full bg-protein" style={{ width: `${hero.progressPct}%` }} />
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{hero.currentClass.vibe}</p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-calorie">Total Level {hero.totalLevel}</p>
      {hero.canEvolve ? (
        <p className="mt-2 text-sm text-water">Evolution ready: {hero.nextClass?.name}</p>
      ) : null}
    </aside>
  );
}
