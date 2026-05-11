import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LogMealPage from "./pages/LogMealPage";
import LibraryPage from "./pages/LibraryPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import { MacroForgeProvider } from "./hooks/useMacroForge";

export default function App() {
  return (
    <MacroForgeProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/log" element={<LogMealPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MacroForgeProvider>
  );
}
