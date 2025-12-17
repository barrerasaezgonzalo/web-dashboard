# Personal Dashboard

## Description

This project is a **personal dashboard** built with **React 18 and Next.js 13**.  
It is designed to be **highly interactive, efficient, accessible, and modular**, displaying **Google search, financial indicators, tasks, notes, news, AI-generated predictions, AI prompts, and more**.

The main goal is to showcase **React skills**, including performance optimization, complex state management, lazy loading, memoization, accessibility, API integrations, real-time database persistence, and maintainable code.

---

## Technologies

- **React 18 + Next.js 13 (App Router)**
- **TypeScript** for strict and safe typing
- **Supabase** for backend and real-time database
- **Recharts** for data visualization
- **next/dynamic** + **Skeleton components** for lazy loading and performance
- **ErrorBoundary** for robust error handling
- **Web Vitals & PerformanceObserver** for measuring LCP, FCP, TTFB, CLS
- **Tailwind CSS** for responsive and accessible design
- **Context API + Custom Hooks** for centralized state management
- **Jest + React Testing Library** for unit and integration testing
- **ARIA attributes** and semantic HTML for accessibility compliance

---

## Key Features

### Dashboard

- **Responsive layout** with dynamic columns for different screen sizes.
- Fixed background image using `next/image`.
- Lazy loading of heavy components with placeholders (`Skeleton`).
- Tracks render times and performance metrics for optimization.

### Advanced To-do

- Drag & drop tasks with persisted order in **Supabase**.
- Automatic order update when adding or deleting tasks.
- Optimized rendering using **React.memo**.
- Checkbox and edit actions with **accessible labels**.

### Notes

- Auto-resizing textarea for quick notes.
- Debounced save with persistence in Supabase.
- Correct handling of empty notes.
- Fully **accessible labels** and keyboard navigation.

### Financial Indicators

- Real-time external data (USD, UTM, BTC, ETH).
- Persists historical values in **Supabase** for trend analysis.
- Displays numeric values with **trend indicators** (up/down arrows).
- **Sparkline charts** for each indicator’s recent trend.
- Semantic headings and ARIA attributes for screen readers.

### News

- Dynamic news list with array validation.
- LocalStorage cache for improved UX.
- Semantic HTML and ARIA labels for accessibility.

### AI & Prompts

- Integration with **GPT** for personalized prompts.
- Real-time predictions and suggestions in the dashboard.
- Generation of optimized prompts with accessible forms and labels.

### Performance

- Tracks render times per component for performance analysis.
- **ErrorBoundary** captures errors for each component individually.
- Memoization and render optimization applied throughout components.

---

## Best Practices

- Strict **TypeScript typing** for safety and maintainability.
- **Lazy loading with Skeletons** for performance optimization.
- **Memoization** and render optimization to avoid unnecessary re-renders.
- Centralized state management using **Context API + custom hooks**.
- Real-time persistence with **Supabase**.
- Robust **error handling** with `ErrorBoundary`.
- **Responsive design** and smooth user experience on all devices.
- Full **accessibility compliance** with ARIA attributes, semantic HTML, and keyboard navigation.
- Comprehensive **unit and integration testing** with Jest and React Testing Library.
- Maintainable, modular code for long-term extensibility.

---

## Testing & Quality

- 100% **unit and integration coverage** for main features.
- Coverage includes **state updates, fetches, callbacks, error handling, and conditional rendering**.
- Performance and accessibility audited with **Lighthouse**.

<img width="1920" height="1080" alt="screenshot" src="https://github.com/user-attachments/assets/ae70e4fe-3d1a-46c9-96a5-327b34ad5007" />
