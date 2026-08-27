"use client";

import { TasksProvider } from "@/features/tasks/TasksContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TasksProvider>{children}</TasksProvider>;
}
