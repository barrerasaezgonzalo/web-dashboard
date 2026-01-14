import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CalendarProvider } from "@/context/CalendarContext";
import { PersonalFinanceProvider } from "@/context/PersonalFinanceContext";
import { TasksProvider } from "@/context/TasksContext";

// components/providers/MainProvider.tsx
export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <TasksProvider>
        <PersonalFinanceProvider>
          <CalendarProvider>{children}</CalendarProvider>
        </PersonalFinanceProvider>
      </TasksProvider>
    </ErrorBoundary>
  );
};
