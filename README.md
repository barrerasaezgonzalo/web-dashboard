# Personal Dashboard

## Description

This project is a **personal dashboard** built with **React 18 and Next.js 13**. It is designed to be highly interactive, efficient, and modular, displaying **google search, , financial indicators, tasks, notes, news, AI-generated predictions, AI prompts and more**.

The main goal is to showcase **React skills**, including performance optimization, complex state management, lazy loading, memoization, API integrations, and real-time database persistence.

---

## Technologies

- **React 18 + Next.js 13 (App Router)**
- **TypeScript** for strict and safe typing
- **Supabase** for backend and real-time database
- **Recharts** for data visualization
- **next/dynamic** + **Skeleton components** for lazy loading and performance
- **ErrorBoundary** for robust error handling
- **Web Vitals & PerformanceObserver** for measuring LCP and TBT
- **Tailwind CSS** for responsive design and styled components
- **Context API + Custom Hooks** for centralized state management
- **Jest + React Testing Library** for unit and integration testing

---

## Key Features

### Dashboard

- **Responsive layout** with dynamic columns.
- Fixed background image using `next/image`.
- Lazy loading of heavy components with placeholders (`Skeleton`).

### Advanced To-do

- Drag & drop tasks with persisted order in **Supabase**.
- Automatic order update when adding or deleting tasks.
- Optimized rendering using **React.memo**.
- Chart of in progress vs pending tasks using **Recharts**.

### Notes

- Auto-resizing textarea for quick notes.
- Debounced save with persistence in Supabase.
- Correct handling of empty notes.

### Financial Indicators

- Real-time external data (USD, UTM, BTC, ETH).
- Persists historical values in **Supabase** for trend analysis.
- Displays numeric values with **up/down arrows** for changes.
- Shows **sparkline charts** for each indicator’s recent trend.

### News

- Dynamic news list with array validation.
- LocalStorage Cache

### AI & Prompts

- Integration with **GPT** for personalized prompts.
- Real-time predictions and suggestions in the dashboard.
- Generation of optimized prompts

### Performance

- Tracks render times per component for performance analysis.
- **ErrorBoundary** captures errors for each component individually.

## Best Practices

- Strict **TypeScript typing**.
- **Lazy loading with Skeletons** for performance optimization.
- **Memoization and render optimization**.
- Centralized state management using **Context API + custom hooks**.
- Real-time persistence with **Supabase**.
- Robust **error handling** with `ErrorBoundary`.
- **Responsive design** and smooth user experience.
- Comprehensive **unit and integration testing** with Jest and React Testing Library.
