import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpenText, ChartBar, ForkKnife, GearSix, House } from "@phosphor-icons/react";
import MacroForgeLogo from "../components/MacroForgeLogo";

const navItems = [
  { to: "/", label: "Dashboard", icon: House },
  { to: "/log", label: "Log", icon: ForkKnife },
  { to: "/library", label: "Library", icon: BookOpenText },
  { to: "/insights", label: "Insights", icon: ChartBar },
  { to: "/settings", label: "Settings", icon: GearSix },
];

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <header className="mb-7 flex items-center justify-between">
        <MacroForgeLogo />
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="fixed bottom-4 left-1/2 z-30 w-[min(760px,calc(100%-1.5rem))] -translate-x-1/2 rounded-3xl border border-line bg-card p-2 shadow-glow">
        <ul className="grid grid-cols-5 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-2xl py-2 text-xs transition ${
                    isActive ? "bg-protein/15 text-protein" : "text-muted hover:text-frost"
                  }`
                }
              >
                <Icon size={18} weight="duotone" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
