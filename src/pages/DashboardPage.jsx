import React from "react";
import { ClockCounterClockwise, Sparkle } from "@phosphor-icons/react";
import CharacterCard from "../components/CharacterCard";
import MacroRing from "../components/MacroRing";
import QuickLogButton from "../components/QuickLogButton";
import StatsStrip from "../components/StatsStrip";
import WaterCard from "../components/WaterCard";
import { useMacroForge } from "../hooks/useMacroForge";

export default function DashboardPage() {
  const { dailyTotals, settings, waterToday, addWater, todayMeals, streak, bmi, hero } = useMacroForge();

  return (
    <section className="space-y-4">
      <div className="card-shell p-4">
        <p className="font-display text-3xl">Hello, Chocchip</p>
        <p className="text-sm text-muted">Ready to forge another strong day?</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <CharacterCard hero={hero} />

        <div className="card-shell p-5">
          <div className="mb-3 flex items-center gap-2 text-calorie">
            <Sparkle size={18} weight="duotone" />
            <p className="font-mono text-xs uppercase tracking-[0.18em]">Progress Engine</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line p-3">
              <p className="font-mono text-xs uppercase tracking-[0.13em] text-muted">Perfect Days</p>
              <p className="mt-2 font-display text-3xl">{hero.perfectDays}</p>
            </div>
            <div className="rounded-2xl border border-line p-3">
              <p className="font-mono text-xs uppercase tracking-[0.13em] text-muted">Streak XP</p>
              <p className="mt-2 font-display text-3xl">{hero.streakXp}</p>
            </div>
            <div className="rounded-2xl border border-line p-3">
              <p className="font-mono text-xs uppercase tracking-[0.13em] text-muted">Nutrition XP</p>
              <p className="mt-2 font-display text-3xl">{hero.nutritionXp}</p>
            </div>
          </div>
          {hero.canEvolve ? (
            <p className="mt-3 rounded-xl border border-water/40 bg-water/10 px-3 py-2 text-sm text-water">
              Evolution unlocked. Next class: {hero.nextClass?.name}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">Hit class level 8 with consistency to evolve into the next archetype.</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MacroRing label="Protein" value={dailyTotals.protein} target={settings.targets.protein} color="#9fd7c9" unit="g" />
        <MacroRing label="Calories" value={dailyTotals.kcal} target={settings.targets.kcal} color="#dfc88c" unit="kcal" />
        <MacroRing label="Fibre" value={dailyTotals.fibre} target={settings.targets.fibre} color="#95b9df" unit="g" />
      </div>

      <QuickLogButton />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <StatsStrip streak={streak} bmi={bmi} />
          <div className="card-shell p-4">
            <div className="mb-3 flex items-center gap-2 text-muted">
              <ClockCounterClockwise size={18} />
              <h2 className="font-mono text-xs uppercase tracking-[0.16em]">Recent Meals (Today)</h2>
            </div>
            {todayMeals.length === 0 ? (
              <p className="text-sm text-muted">No meals logged yet. Forge your first entry.</p>
            ) : (
              <ul className="space-y-2">
                {todayMeals.slice(0, 5).map((meal) => (
                  <li key={meal.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                    <div>
                      <p className="font-medium text-frost">{meal.name}</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{meal.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-protein">{Math.round(meal.totals.protein)}g P</p>
                      <p className="text-xs text-muted">{Math.round(meal.totals.kcal)} kcal</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <WaterCard water={waterToday} target={settings.targets.water} onAdd={addWater} />
      </div>
    </section>
  );
}
