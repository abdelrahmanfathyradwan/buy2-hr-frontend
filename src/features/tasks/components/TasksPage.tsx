"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { TaskCard, Task } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { EditTask } from "./EditTask";
import { ViewTask } from "./ViewTask";
import { DatePickerModal } from "./DatePickerModal";
import { FilterSortModal, FilterState, SortState } from "./FilterSortModal";
import { useTasks } from "../TasksContext";
import styles from "./TasksPage.module.css";

type ViewMode = "board" | "grid";
type StatusFilter = "all" | "todo" | "in-progress" | "completed" | "overdue";

export const TasksPage: React.FC = () => {
  const { tasks, setTasks, addTask, updateTask, deleteTask, changeStatus } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"board" | "add" | "edit" | "view">("board");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter & Sort modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterModalTab, setFilterModalTab] = useState<"filter" | "sort">("filter");

  const [filters, setFilters] = useState<FilterState>({
    listName: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
  });

  const [sort, setSort] = useState<SortState>({
    sortBy: "due",
    sortType: "desc",
  });

  // Date picker modal state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerCallback, setDatePickerCallback] = useState<((date: string) => void) | null>(null);
  const [datePickerVal, setDatePickerVal] = useState("");

  const handleOpenDatePicker = (currentVal: string, onSelect: (newDate: string) => void) => {
    setDatePickerVal(currentVal);
    setDatePickerCallback(() => onSelect);
    setIsDatePickerOpen(true);
  };

  const handleSelectDate = (date: string) => {
    if (datePickerCallback) {
      datePickerCallback(date);
    }
  };

  const handleSaveTask = (updatedTask: Task) => {
    if (tasks.find((t) => t.id === updatedTask.id)) {
      updateTask(updatedTask);
    } else {
      addTask(updatedTask);
    }
    setView("board");
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    changeStatus(taskId, newStatus);
  };

  const handleAddTaskClick = () => {
    setView("add");
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView("edit");
  };

  const handleViewTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView("view");
  };

  const handleSelectTemplate = (template: Task) => {
    setSelectedTask({
      ...template,
      id: Date.now().toString(),
    });
    setView("edit");
  };

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    // 1. Search term match
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. List Name match
    const matchesList = filters.listName ? task.listName === filters.listName : true;

    // 3. Assignee match
    const matchesAssignee = filters.assignedTo
      ? task.assignee?.name === filters.assignedTo
      : true;

    // 4. Priority match
    const matchesPriority = filters.priority
      ? task.priority.toLowerCase() === filters.priority.toLowerCase()
      : true;

    // 5. Due date match
    const matchesDueDate = filters.dueDate ? task.deadline === filters.dueDate : true;

    return matchesSearch && matchesList && matchesAssignee && matchesPriority && matchesDueDate;
  });

  // Sort logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valA = "";
    let valB = "";

    if (sort.sortBy === "name") {
      valA = a.title;
      valB = b.title;
    } else if (sort.sortBy === "due") {
      valA = a.deadline;
      valB = b.deadline;
    } else {
      // Creation or fallback
      valA = a.id;
      valB = b.id;
    }

    if (sort.sortType === "asc") {
      return valA.localeCompare(valB);
    } else {
      return valB.localeCompare(valA);
    }
  });

  // Status-filtered tasks for the Grid View
  const gridFilteredTasks = sortedTasks.filter((task) => {
    if (statusFilter === "all") return true;
    return task.status === statusFilter;
  });

  const todoTasks = sortedTasks.filter((t) => t.status === "todo");
  const inProgressTasks = sortedTasks.filter((t) => t.status === "in-progress");
  const completedTasks = sortedTasks.filter((t) => t.status === "completed");

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setView("board");
  };

  if (view === "view" && selectedTask) {
    return (
      <ViewTask
        task={selectedTask}
        onBack={() => setView("board")}
        onEdit={(task) => {
          setSelectedTask(task);
          setView("edit");
        }}
        onDelete={handleDeleteTask}
      />
    );
  }

  if (view === "add") {
    return (
      <TaskForm
        onBack={() => setView("board")}
        onSelectTemplate={handleSelectTemplate}
      />
    );
  }

  if (view === "edit") {
    return (
      <EditTask
        task={selectedTask}
        onBack={() => setView("board")}
        onSave={handleSaveTask}
        onOpenDatePicker={handleOpenDatePicker}
      />
    );
  }


  return (
    <div className={styles.tasksContainer}>
      {/* Top Header Action Bar */}
      <div className={styles.tasksHeader}>
        <div className={styles.tasksHeaderLeft}>
          <h2 className={styles.tasksTitle}>My Tasks</h2>
        </div>
        <button className={styles.addTaskBtn} onClick={handleAddTaskClick}>
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
          <button
            className={styles.actionBtn}
            onClick={() => {
              setFilterModalTab("filter");
              setIsFilterModalOpen(true);
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => {
              setFilterModalTab("sort");
              setIsFilterModalOpen(true);
            }}
          >
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>
          <div className={styles.divider} />
          {/* View Toggles */}
          <button
            className={`${styles.viewBtn} ${
              viewMode === "board" ? styles["viewBtn--active"] : ""
            }`}
            onClick={() => setViewMode("board")}
            title="Kanban Board View"
          >
            <List size={16} />
          </button>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "grid" ? styles["viewBtn--active"] : ""
            }`}
            onClick={() => setViewMode("grid")}
            title="Grid / Card List View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* View Mode Switching Container */}
      <div className={viewMode === "board" ? styles.tasksKanbanView : styles.tasksGridView}>
        {viewMode === "board" ? (
          /* Kanban Board Columns */
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
                    viewMode="board"
                    onClick={() => handleViewTaskClick(task)}
                    onStatusChange={handleStatusChange}
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
                    viewMode="board"
                    onClick={() => handleViewTaskClick(task)}
                    onStatusChange={handleStatusChange}
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
                    viewMode="board"
                    onClick={() => handleViewTaskClick(task)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View Layout */
          <div className={styles.gridViewContainer}>
            {/* Status Filter Tab Bar */}
            <div className={styles.statusFilterBar}>
              <button
                className={`${styles.statusTab} ${statusFilter === "all" ? styles.statusTabActive : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`${styles.statusTab} ${statusFilter === "todo" ? styles.statusTabActive : ""}`}
                onClick={() => setStatusFilter("todo")}
              >
                To-do
              </button>
              <button
                className={`${styles.statusTab} ${statusFilter === "in-progress" ? styles.statusTabActive : ""}`}
                onClick={() => setStatusFilter("in-progress")}
              >
                In progress
              </button>
              <button
                className={`${styles.statusTab} ${statusFilter === "completed" ? styles.statusTabActive : ""}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`${styles.statusTab} ${statusFilter === "overdue" ? styles.statusTabActive : ""}`}
                onClick={() => setStatusFilter("overdue")}
              >
                Overdue
              </button>
            </div>

            {/* CSS Grid cards */}
            <div className={styles.cardGrid}>
              {gridFilteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  viewMode="grid"
                  onClick={() => handleViewTaskClick(task)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleSelectDate}
        initialValue={datePickerVal}
      />

      <FilterSortModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialTab={filterModalTab}
        onApplyFilters={setFilters}
        onApplySort={setSort}
        currentFilters={filters}
        currentSort={sort}
      />
    </div>
  );
};
