"use client";

import React, { useState } from "react";
import { ArrowLeft, Edit2, Trash2, Eye, Calendar, ChevronDown, Search } from "lucide-react";
import styles from "./TaskForm.module.css";
import { Task } from "./TaskCard";

interface TaskFormProps {
  onBack: () => void;
  onSelectTemplate: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onBack, onSelectTemplate }) => {
  const [search, setSearch] = useState("");

  const templates: Task[] = [
    {
      id: "t1",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "Set due date",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
    {
      id: "t2",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "Set due date",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
    {
      id: "t3",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "Set due date",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
    {
      id: "t4",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "Set due date",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
    {
      id: "t5",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "20-02-2024",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
    {
      id: "t6",
      title: "Revision 1: Fixing Navbar at Dashboard...",
      deadline: "Set due date",
      priority: "Low",
      listName: "List Name",
      status: "todo",
      assignee: { name: "Ahmed Mohamed" },
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h2 className={styles.title}>Add Task</h2>
      </div>

      {/* Action Subbar */}
      <div className={styles.searchBar}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter task name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
          />
        </div>
        <button className={styles.selectBtn}>Select from lists</button>
      </div>

      {/* Grid of cards */}
      <div className={styles.grid}>
        {templates
          .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
          .map((tmpl) => (
          <div key={tmpl.id} className={styles.card} onClick={() => onSelectTemplate(tmpl)}>
            <div className={styles.cardHeader}>
              <span className={styles.categoryBadge}>{tmpl.listName}</span>
              <div className={styles.cardActions}>
                <button className={styles.iconBtn} onClick={(e) => e.stopPropagation()}>
                  <Edit2 size={13} />
                </button>
                <button className={styles.iconBtn} onClick={(e) => e.stopPropagation()}>
                  <Trash2 size={13} />
                </button>
                <button className={styles.iconBtn} onClick={(e) => e.stopPropagation()}>
                  <Eye size={13} />
                </button>
              </div>
            </div>

            <p className={styles.cardTitle}>{tmpl.title}</p>

            <div className={styles.metaRow}>
              <div className={styles.dueDateBtn}>
                <Calendar size={13} />
                <span>{tmpl.deadline}</span>
              </div>
              <div className={styles.priorityBtn}>
                <span>{tmpl.priority}</span>
                <ChevronDown size={12} />
              </div>
            </div>

            <div className={styles.assigneeRow}>
              <div className={styles.avatarPlaceholder}>
                {tmpl.assignee?.name.charAt(0)}
              </div>
              <span className={styles.assigneeName}>{tmpl.assignee?.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
