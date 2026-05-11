# NutriLog — Personal Meal Tracker PRD

## Overview

A minimal, personal web app to log meals, track macros (protein-first), monitor water intake, and visualise nutrition trends. Built for personal use, hosted free, designed to actually be enjoyable to open every day.

**Audience:** Solo user (me). Maybe shown to 2–3 people.  
**Stack:** React (Vite) + local browser storage (localStorage / IndexedDB). No backend needed initially.  
**Hosting:** Netlify (recommended — connect GitHub repo once, auto-deploys on every push, zero maintenance, free forever tier, custom domain optional).  
**Alternatives:** Vercel (identical experience), Cloudflare Pages (slightly more config, equally free).

---

## Design Direction

**Inspiration:**

- Image 1: Clean black-on-cream illustration aesthetic, bold sans-serif character names, RPG card feel, satisfying progress bars, icon-heavy bottom nav.
- Image 2: Dark theme, rich donut/pie charts with vivid accent colours (neon green, coral, blue-violet), card-based layout, clean data-first hierarchy.

**Resulting aesthetic:** Dark base (#0f0f0f or similar), cream/off-white text, neon-green as primary accent (for protein/calories), coral/salmon for warnings or fat, soft blue for water, bold display font for numbers and headings, clean icon set (Lucide or Phosphor). Think: "RPG character sheet meets fitness tracker."

---

## Pages & Features

### 1. Dashboard (`/`)

- Today's macro ring (prominent, protein highlighted)
- Water intake tracker (tap to +250ml)
- Quick-log button → opens meal log modal
- Recent meals list (today only)
- Streak counter (days logged)
- BMI badge (calculated from stored height/weight)

### 2. Log Meal (`/log` or modal)

- Create new meal (name it + add items)
- Add items individually: name, quantity (g or ml), and macros auto-filled from library
- Add from history (recently logged meals, sorted by frequency)
- Save as template (named, reusable)
- Meal types: Breakfast / Lunch / Dinner / Snack

### 3. Food Library (`/library`)

- Searchable list of food items
- Each item: name, calories/100g, protein/100g, carbs/100g, fat/100g, fibre/100g
- Pre-seeded with ~50 common Indian foods (dal, rice, roti, paneer, curd, eggs, chicken, etc.)
- User can add/edit/delete items
- Import via CSV optional (v2)

### 4. Insights (`/insights`)

- Weekly macro bar chart (daily breakdown)
- All-time trend line (weight, calories, protein)
- Protein vs target heatmap (calendar view)
- Best/worst days summary
- Water intake trend

### 5. Settings (`/settings`)

- Personal: Name, height (cm), weight log (date-stamped entries), target weight
- Macro targets: calories, protein (g), carbs (g), fat (g), fibre (g), water (ml)
- Display: theme toggle (optional), units
- Data: export all data as JSON, clear data

---

## Macros Tracked (per meal item and daily total)

| Macro             | Priority          | Display                    |
| ----------------- | ----------------- | -------------------------- |
| Protein (g)       | ⭐⭐⭐ Ultra high | Always prominent, own ring |
| Calories (kcal)   | ⭐⭐⭐ High       | Main number on dashboard   |
| Fibre (g)         | ⭐⭐ High         | Shown in detail view       |
| Carbohydrates (g) | ⭐⭐ Medium       | Shown in detail view       |
| Fat (g)           | ⭐⭐ Medium       | Shown in detail view       |
| Water (ml)        | ⭐⭐⭐ Ultra High | Separate tracker widget    |

---

## Data Model (localStorage)

```json
// foods[] — library
{ "id": "uuid", "name": "Paneer", "per100": { "kcal": 265, "protein": 18.3, "carbs": 1.2, "fat": 20.8, "fibre": 0 } }

// meals[] — log entries
{ "id": "uuid", "date": "2025-05-11", "type": "lunch", "name": "Dal Chawal", "items": [{ "foodId": "...", "qty": 150 }], "totals": { "kcal": 320, "protein": 14 } }

// templates[] — saved meals
{ "id": "uuid", "name": "Post Gym", "items": [...] }

// settings{}
{ "targets": { "kcal": 2200, "protein": 160, "fibre": 30, "water": 3000 }, "profile": { "height": 175, "weightLog": [{ "date": "...", "kg": 70 }] } }
```

---

## Tech Stack

| Layer     | Choice                                    | Reason                      |
| --------- | ----------------------------------------- | --------------------------- |
| Framework | React + Vite                              | Fast dev, easy deploy       |
| Storage   | localStorage (+ IndexedDB for large data) | Zero backend, works offline |
| Charts    | Recharts                                  | Simple, composable          |
| Icons     | Phosphor Icons                            | Clean, consistent           |
| Styling   | Tailwind CSS                              | Rapid, consistent           |
| Routing   | React Router v6                           | Lightweight                 |
| Hosting   | Netlify                                   | One-time setup, auto-deploy |

---

## Phased Scope

### MVP (build this first)

- Dashboard with today's macros + water tracker
- Meal log (manual entry, library search)
- Food library (pre-seeded Indian foods, add/edit)
- Settings (macro targets, height/weight)
- Data persists in localStorage

### V2 (after MVP works)

- Insights page with charts
- Meal templates + history quick-add
- Weight trend graph + BMI over time
- CSV export

### V3 (if you want to expand)

- PWA (installable on phone)
- Barcode scanner (Open Food Facts API)
- Sync via GitHub Gist or Supabase free tier

---

## Hosting Setup (Netlify)

1. Push repo to GitHub
2. Go to netlify.com → "Add new site" → "Import from Git"
3. Select repo, build command: `npm run build`, publish dir: `dist`
4. Done. Every `git push` auto-deploys. Free, zero maintenance.

_PRD version: 1.0 — May 2025_
