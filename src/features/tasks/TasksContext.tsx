"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Task } from "./components/TaskCard";

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  changeStatus: (taskId: string, newStatus: Task["status"]) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "todo",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "2",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "todo",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "3",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "todo",
    assignee: { name: "Ahmed Mohamed" },
    isSelected: true,
  },
  {
    id: "4",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "in-progress",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "5",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "in-progress",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "6",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "completed",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "7",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "completed",
    assignee: { name: "Ahmed Mohamed" },
  },
  {
    id: "8",
    title: "Revision 1: Fixing Navbar at Dashboard Page",
    deadline: "20/2/2021",
    priority: "Low",
    listName: "List Name",
    status: "overdue",
    assignee: { name: "Ahmed Mohamed" },
  },
];

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const changeStatus = useCallback(
    (taskId: string, newStatus: Task["status"]) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    },
    []
  );

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, addTask, updateTask, deleteTask, changeStatus }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
