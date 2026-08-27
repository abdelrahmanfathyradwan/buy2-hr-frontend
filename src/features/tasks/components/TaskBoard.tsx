"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { TaskCard, Task } from "./TaskCard";
import styles from "./TaskBoard.module.css";

interface TaskBoardProps {
  tasks: Task[];
  onAddTaskClick: () => void;
  onEditTaskClick: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onAddTaskClick,
  onEditTaskClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  return (
    <div className={styles.taskBoardContainer}>
      {/* Top Header Action Bar */}
      <div className={styles.tasksHeader}>
        <div className={styles.tasksHeaderLeft}>
          <h2 className={styles.tasksTitle}>My Tasks</h2>
        </div>
        <button className={styles.addTaskBtn} onClick={onAddTaskClick}>
          + Add Task
        </button>
      </div>

      {/* Sub Header / Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterActions}>
          <button className={styles.actionBtn}>
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
          <button className={styles.actionBtn}>
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>
          <div className={styles.divider} />
          <button
            className={`${styles.viewToggle} ${
              viewType === "grid" ? styles.viewToggleActive : ""
            }`}
            onClick={() => setViewType("grid")}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`${styles.viewToggle} ${
              viewType === "list" ? styles.viewToggleActive : ""
            }`}
            onClick={() => setViewType("list")}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Board Columns Grid */}
      <div className={styles.boardGrid}>
        {/* Todo Column */}
        <div className={styles.boardColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitleWrapper}>
              <span className={`${styles.statusDot} ${styles.statusDotTodo}`} />
              <h3 className={styles.columnTitle}>To-do</h3>
            </div>
            <span className={styles.columnCount}>{todoTasks.length}</span>
          </div>
          <div className={styles.columnCardList}>
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTaskClick(task)}
              />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className={styles.boardColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitleWrapper}>
              <span className={`${styles.statusDot} ${styles.statusDotInProgress}`} />
              <h3 className={styles.columnTitle}>In Progress</h3>
            </div>
            <span className={styles.columnCount}>{inProgressTasks.length}</span>
          </div>
          <div className={styles.columnCardList}>
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTaskClick(task)}
              />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className={styles.boardColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.columnTitleWrapper}>
              <span className={`${styles.statusDot} ${styles.statusDotCompleted}`} />
              <h3 className={styles.columnTitle}>Completed</h3>
            </div>
            <span className={styles.columnCount}>{completedTasks.length}</span>
          </div>
          <div className={styles.columnCardList}>
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTaskClick(task)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
