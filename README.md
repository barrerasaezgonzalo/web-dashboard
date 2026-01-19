# Full-Stack Enterprise Dashboard

A high-performance ecosystem integrating Financial Intelligence, Productivity Systems, and Real-time Cloud Infrastructure.

React 18 TypeScript Supabase Next.js

## 💎 Advanced React Engineering

## 🪝 Custom Hooks: The Business Logic Layer

The application's "brain" is decentralized into specialized hooks, following the **Single Responsibility Principle**. This architecture ensures the UI remains declarative while the hooks handle side effects and state transitions.

**`authFetch`**

An orchestrated wrapper for the Supabase client that injects authentication headers and handles global error catching for secure API communication.

**`useCalendar`**

Encapsulates complex date-math, month-switching logic, and event mapping. It acts as the bridge between the UI grid and the persistent event store.

**`useNotes`**

Manages the lifecycle of user annotations, including cloud-syncing with Supabase and real-time filtering by category or priority.

**`useTask`**

Handles full CRUD operations for the To-Do ecosystem, managing optimistic UI updates for a seamless task-completion experience.

**`usePrivacyMode`**

A global toggle utility that manages the obfuscation state of financial figures across the entire dashboard via React Context.

**`useToast`**

A declarative notification system to provide immediate user feedback on actions like "Movement Saved" or "Auth Error".

**`useAutoResize`**

A utility hook for dynamic textareas and inputs that adapts the UI height in real-time based on content volume, preventing scrollbar clutter.

**`useWeather`**

Handles external API integration to fetch and cache local weather data, providing environmental context to the daily planner.

## 📊 Core Modules & Functionality

### 1\. Financial Intelligence Engine

A robust system for tracking and analyzing personal wealth:

- **Interactive Analytics**: Summary and Comparative bar charts powered by Recharts, transforming raw database movements into monthly performance insights.
- **Privacy Obfuscation**: A global toggle that instantly masks sensitive financial figures across the UI, using React Context for synchronized state.
- **Bulletproof Inputs**: Sanitized numeric fields using Regex-based filtering to block invalid characters (dots/commas) at the source.

PENDING, BALANCE,

### 2\. Productivity Ecosystem (Notes, Calendar & Tasks)

Beyond finance, the dashboard acts as a central hub for personal organization:

- **Smart Notes**: A cloud-synced system with priority levels. Features auto-save functionality and a clean "Dark Slate" interface.
- **Task Manager**: A specialized To-Do engine with status tracking (Pending/Delay/In Dev) and real-time updates.

- **Unified Event Calendar**: A custom-built scheduling interface for managing time-sensitive events with precision time-slot controls.

SUMARY

## 🌐 Backend & Cloud Architecture

### Supabase + Google Auth + Vercel

The platform is architected for security and scalability:

- **Identity Management**: Secure **Google OAuth 2.0** integration for seamless, passwordless authentication.
- **Row Level Security (RLS)**: Database-level policies ensuring total data isolation; users only access their own financial and personal records.
- **PostgreSQL Realtime**: Leveraging Supabase's realtime engine to sync tasks and notes across multiple devices instantly.
- **CI/CD Workflow**: Automated deployments via Vercel, optimized for the Next.js App Router and Edge environment.

## 🛠 Engineering Skillset Table

Category

Technical Implementation

**Type Safety**

Strict TypeScript interfaces, Omit/Partial utility types, and Polymorphic components.

**TypeScript**

Complex SVG rendering with Recharts, optimized for mobile responsiveness.

**UI/UX**

Tailwind CSS custom design system with "Dark Slate" aesthetic and Lucide icons.

**Business Logic**

Custom algorithms for financial summary, savings rates, and custom expense categorization.

---

## PRO Quality Assurance & Testing Suite

The application architecture is built with **Testability** as a first-class citizen. I implemented a comprehensive testing strategy to ensure the stability of core business logic and UI components.

#### 🧪 Unit & Integration Testing

Focused on validating complex financial calculations and data transformation hooks. Using **Jest** and **React Testing Library** to ensure that every state transition and numeric sanitization (Regex) behaves as expected.

#### 🛡️ Component Contract Testing

Verification of UI components under various props and edge cases. This guarantees that modals, inputs, and charts maintain their integrity even when data is missing or formatted incorrectly.

- **Mocking Strategy:** Professional use of mocks for Supabase Auth and external API calls to isolate testing environments.
- **Regression Safety:** Every refactor is backed by a suite that prevents breaking existing financial rules or productivity workflows.

### Engineered for Precision

Next.js • TypeScript • Supabase • Recharts • Tailwind

SOFTWARE ENGINEER PROJECT - 2026
