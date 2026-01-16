import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CalendarProvider } from "@/context/CalendarContext";
import { PersonalFinanceProvider } from "@/context/PersonalFinanceContext";
import { TasksProvider } from "@/context/TasksContext";
import { ToastProvider } from "@/context/ToastProvider";

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <TasksProvider>
          <PersonalFinanceProvider>
            <CalendarProvider>{children}</CalendarProvider>
          </PersonalFinanceProvider>
        </TasksProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};
