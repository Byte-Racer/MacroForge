import React from "react";
import { Link } from "react-router-dom";

export default function QuickLogButton() {
  return (
    <Link
      to="/log"
      className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-protein px-4 py-4 text-base font-bold text-black transition hover:opacity-90"
    >
      Forge Meal Entry
    </Link>
  );
}