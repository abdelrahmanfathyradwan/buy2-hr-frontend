import React, { useState, useRef, useEffect } from "react";
import { Clock, AlertCircle, MoreHorizontal } from "lucide-react";
import styles from "./TaskCard.module.css";

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  listName: string;
  status: "todo" | "in-progress" | "completed" | "overdue";
  assignee?: {
    name: string;
    avatar?: string;
  };
  isSelected?: boolean;
}

interface TaskCardProps {
  task: Task;
  viewMode?: "board" | "grid";
  onClick?: () => void;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  viewMode = "board",
  onClick,
  onStatusChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isPriorityHigh = task.priority === "High";
  const isGridView = viewMode === "grid";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleStatusClick = (e: React.MouseEvent, status: Task["status"]) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    if (onStatusChange) {
      onStatusChange(task.id, status);
    }
  };

  // Build card CSS classes
  const cardClassName = [
    styles.taskCard,
    task.isSelected ? styles.taskCardSelected : "",
    isGridView ? styles.taskCardGrid : styles.taskCardBoard,
    isGridView ? styles[`taskCardStripe--${task.status}`] : "",
  ].filter(Boolean).join(" ");

  // Dropdown menu content
  const renderDropdown = () => (
    <div className={styles.dropdownMenu} ref={dropdownRef}>
      <div className={styles.dropdownHeader}>Change Status</div>
      <button
        className={`${styles.dropdownItem} ${task.status === "todo" ? styles.dropdownItemActive : ""}`}
        onClick={(e) => handleStatusClick(e, "todo")}
      >
        To-do
      </button>
      <button
        className={`${styles.dropdownItem} ${task.status === "in-progress" ? styles.dropdownItemActive : ""}`}
        onClick={(e) => handleStatusClick(e, "in-progress")}
      >
        In progress
      </button>
      <button
        className={`${styles.dropdownItem} ${task.status === "completed" ? styles.dropdownItemActive : ""}`}
        onClick={(e) => handleStatusClick(e, "completed")}
      >
        Completed
      </button>
      <button
        className={`${styles.dropdownItem} ${task.status === "overdue" ? styles.dropdownItemActive : ""}`}
        onClick={(e) => handleStatusClick(e, "overdue")}
      >
        Overdue
      </button>
    </div>
  );

  // Render for Board View
  if (!isGridView) {
    return (
      <div className={cardClassName} onClick={onClick}>
        <div className={styles.taskCardHeader}>
          <span className={styles.taskCardBadge}>{task.listName}</span>
          <div className={styles.headerRightActions}>
            <span
              className={`${styles.taskCardPriority} ${
                isPriorityHigh ? styles.taskCardPriorityHigh : ""
              }`}
            >
              {isPriorityHigh && <AlertCircle size={12} />}
              {task.priority}
            </span>
            <div className={styles.optionsWrapper}>
              <button
                className={styles.optionsBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <MoreHorizontal size={16} />
              </button>
              {isDropdownOpen && renderDropdown()}
            </div>
          </div>
        </div>

        <h4 className={styles.taskCardTitle}>{task.title}</h4>

        <div className={styles.taskCardFooter}>
          <div className={styles.taskCardDeadline}>
            <Clock size={14} className={styles.taskCardDeadlineIcon} />
            <span>Deadline : <span className={styles.taskCardDate}>{task.deadline}</span></span>
          </div>

          {task.assignee && (
            <div className={styles.taskCardAssignee} title={task.assignee.name}>
              {task.assignee.avatar ? (
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className={styles.taskCardAvatar}
                />
              ) : (
                <div className={styles.taskCardAvatarPlaceholder}>
                  {task.assignee.name.charAt(0)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render for Grid View
  return (
    <div className={cardClassName} onClick={onClick}>
      <div className={styles.taskCardHeader}>
        <span className={`${styles.statusBadge} ${styles[`statusBadge--${task.status}`]}`}>
          {task.status === "todo" && "To-do"}
          {task.status === "in-progress" && "In progress"}
          {task.status === "completed" && "Completed"}
          {task.status === "overdue" && "Overdue"}
        </span>
        <div className={styles.optionsWrapper}>
          <button
            className={styles.optionsBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          {isDropdownOpen && renderDropdown()}
        </div>
      </div>

      <h4 className={styles.taskCardTitle}>{task.title}</h4>

      <div className={styles.taskCardFooter}>
        <div className={styles.taskCardMetaLeft}>
          <div className={styles.taskCardDeadline}>
            <Clock size={14} className={styles.taskCardDeadlineIcon} />
            <span>Deadline : <span className={styles.taskCardDate}>{task.deadline}</span></span>
          </div>
          <span
            className={`${styles.taskCardPriority} ${
              isPriorityHigh ? styles.taskCardPriorityHigh : ""
            }`}
          >
            {task.priority}
          </span>
        </div>

        <span className={styles.taskCardBadge}>{task.listName}</span>
      </div>
    </div>
  );
};
