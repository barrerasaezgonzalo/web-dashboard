# Personal Dashboard – Senior React Developer

## Description

This project is a **personal dashboard** built with **React 18 and Next.js 13**. It is designed to be highly interactive, efficient, and modular, displaying **tasks, notes, news, financial indicators, motivational phrases, and AI-generated predictions**.

The main goal is to showcase **advanced React skills**, including performance optimization, complex state management, lazy loading, memoization, API integrations, and real-time database persistence.

---

## Technologies

- **React 18 + Next.js 13 (App Router)**
- **TypeScript** for strict and safe typing
- **Supabase** for backend and real-time database
- **Recharts** for data visualization
- **react-masonry-css** for dynamic layouts
- **next/dynamic** + **Skeleton components** for lazy loading and performance
- **ErrorBoundary** for robust error handling
- **Web Vitals & PerformanceObserver** for measuring LCP and TBT
- **Tailwind CSS** for responsive design and styled components
- **Context API + Custom Hooks** for centralized state management

---

## Key Features

### Dashboard

- **Responsive masonry layout** with dynamic columns.
- Fixed background image using `next/image`.
- Lazy loading of heavy components with placeholders (`Skeleton`).

### Advanced To-do

- Drag & drop tasks with persisted order in **Supabase**.
- Automatic order update when adding or deleting tasks.
- Optimized rendering using **React.memo**.
- Chart of completed vs pending tasks using **Recharts**.

### Notes

- Auto-resizing textarea for quick notes.
- Debounced save with persistence in Supabase.
- Correct handling of empty notes.

### Financial Indicators

- Real-time external data (USD, UTM, BTC, ETH).
- Displays numeric values and total indicators.

### News & Motivational Phrases

- Dynamic news list with array validation.
- Random motivational phrases based on the day.

### AI & Prompts

- Integration with **GPT** for personalized prompts.
- Real-time predictions and suggestions in the dashboard.

### Performance

- Measures **LCP** and approximate **TBT** using `web-vitals` and `PerformanceObserver`.
- Shows total tasks, news, and financial indicators.
- Tracks render times per component for performance analysis.
- **ErrorBoundary** captures errors for each component individually.

## Best Practices Demonstrated

- Strict **TypeScript typing**.
- **Lazy loading with Skeletons** for performance optimization.
- **Memoization and render optimization**.
- Centralized state management using **Context API + custom hooks**.
- Real-time persistence with **Supabase**.
- Robust **error handling** with `ErrorBoundary`.
- Performance metrics tracking (LCP, TBT) and component render timing.
- **Responsive design** and smooth user experience.
