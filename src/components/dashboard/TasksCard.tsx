"use client";

import Link from "next/link";
import { useTasks } from "@/features/tasks/TasksContext";
import styles from "./TasksCard.module.css";

interface TaskGauge {
  label: string;
  percentage: number;
  count: number;
  color: string;
}

function CircularGauge({ label, percentage, count, color }: TaskGauge) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.gaugeItem}>
      <div className={styles.gaugeRing}>
        <svg className={styles.gaugeSvg} viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            className={styles.gaugeProgress}
          />
        </svg>
        <div className={styles.gaugeInner}>
          <span className={styles.gaugePercent} style={{ color }}>{percentage}%</span>
        </div>
      </div>
      <span className={styles.gaugeLabel}>{label}</span>
      <span className={styles.gaugeCount}>{count}</span>
    </div>
  );
}

export function TasksCard() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  // "My Day" = all tasks, percentage = overall completion rate
  const myDayPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Individual category percentages relative to total
  const completedPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const todoPercentage = total > 0 ? Math.round((todoCount / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;

  const gauges: TaskGauge[] = [
    { label: "My Day", percentage: myDayPercentage, count: total, color: "#2A41A7" },
    { label: "Completed", percentage: completedPercentage, count: completedCount, color: "#22c55e" },
    { label: "To Do", percentage: todoPercentage, count: todoCount, color: "#ef4444" },
    { label: "In Progress", percentage: inProgressPercentage, count: inProgressCount, color: "#f59e0b" },
  ];

  return (
    <div className={styles.card} id="tasks-widget">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Tasks</h3>
          <p className={styles.subtitle}>Follow up with your tasks progress</p>
        </div>
        <Link href="/tasks" className={styles.viewAll}>View All</Link>
      </div>

      <div className={styles.gaugesRow}>
        {gauges.map((g) => (
          <CircularGauge key={g.label} {...g} />
        ))}
      </div>
    </div>
  );
}
