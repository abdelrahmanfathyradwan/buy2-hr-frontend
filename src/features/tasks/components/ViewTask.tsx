import React, { useState } from "react";
import { ArrowLeft, Edit2, Trash2, Paperclip, Eye, MessageSquare } from "lucide-react";
import { Task } from "./TaskCard";
import { TaskComments } from "./TaskComments";
import styles from "./ViewTask.module.css";

interface ViewTaskProps {
  task: Task;
  onBack: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

interface Subtask {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "completed";
}

interface Attachment {
  id: string;
  name: string;
  size: string;
}

const subtasks: Subtask[] = [
  { id: "s1", title: "Change the icons to font awesome icons.", status: "todo" },
  { id: "s2", title: "Adjust the size to responsive mobile.", status: "completed" },
  { id: "s3", title: "Activate the navigation buttons to direct the users.", status: "todo" },
  { id: "s4", title: "Adjust the size to responsive mobile.", status: "completed" },
];

const attachments: Attachment[] = [
  { id: "a1", name: "Devs Presentation.pdf", size: "1.8 MB" },
  { id: "a2", name: "Devs Presentation.pdf", size: "1.8 MB" },
  { id: "a3", name: "Devs Presentation.pdf", size: "1.8 MB" },
  { id: "a4", name: "Devs Presentation.pdf", size: "1.8 MB" },
];

export const ViewTask: React.FC<ViewTaskProps> = ({ task, onBack, onEdit, onDelete }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const completedCount = subtasks.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedCount / subtasks.length) * 100);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return "To-do";
      case "in-progress": return "In progress";
      case "completed": return "Completed";
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h2 className={styles.title}>View Task</h2>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={() => setIsCommentsOpen(true)}>
            <MessageSquare size={16} />
          </button>
          <button className={styles.iconBtn} onClick={() => onEdit(task)}>
            <Edit2 size={16} />
          </button>
          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => onDelete(task.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          {/* Task Title + Progress */}
          <div className={styles.taskTitleSection}>
            <div className={styles.taskTitleRow}>
              <h3 className={styles.taskName}>{task.title}</h3>
              <span className={styles.progressLabel}>{progressPercent}%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className={styles.subtasksList}>
            {subtasks.map((sub) => (
              <div key={sub.id} className={styles.subtaskItem}>
                <div
                  className={`${styles.subtaskRadio} ${
                    sub.status === "completed" ? styles.subtaskRadioCompleted : ""
                  }`}
                />
                <span
                  className={`${styles.subtaskText} ${
                    sub.status === "completed" ? styles.subtaskTextCompleted : ""
                  }`}
                >
                  {sub.title}
                </span>
                <span
                  className={`${styles.subtaskBadge} ${styles[`subtaskBadge--${sub.status}`]}`}
                >
                  {getStatusLabel(sub.status)}
                </span>
              </div>
            ))}
          </div>

          {/* Task Description */}
          <div className={styles.descriptionSection}>
            <h4 className={styles.sectionLabel}>Task Description</h4>
            <p className={styles.descriptionText}>
              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor
              sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem
              ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit
              amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem
              ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit
              amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem
              ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit
              amet, Lorem ipsum dolor sit amet.
            </p>
          </div>

          {/* Attachments */}
          <div className={styles.attachmentsSection}>
            <h4 className={styles.sectionLabel}>Attachments</h4>
            <div className={styles.attachmentsList}>
              <button className={styles.uploadBtn}>
                <Paperclip size={14} />
                <span>+ upload more items</span>
              </button>
              {attachments.map((file) => (
                <div key={file.id} className={styles.attachmentCard}>
                  <div className={styles.attachmentIcon}>PDF</div>
                  <div className={styles.attachmentInfo}>
                    <span className={styles.attachmentName}>{file.name}</span>
                    <span className={styles.attachmentSize}>{file.size}</span>
                  </div>
                  <div className={styles.attachmentActions}>
                    <button className={styles.attachmentActionBtn}>
                      <Trash2 size={12} />
                    </button>
                    <button className={styles.attachmentActionBtn}>
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Meta Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>List Name</label>
            <div className={styles.metaValue}>{task.listName || "Backend bugs team"}</div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Status</label>
            <span className={`${styles.statusPill} ${styles[`statusPill--${task.status}`]}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Due Date</label>
            <div className={styles.metaValue}>{task.deadline}</div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Assigned to</label>
            <div className={styles.assigneeRow}>
              <div className={styles.assigneeAvatar}>
                {task.assignee?.name.charAt(0) || "M"}
              </div>
              <span className={styles.metaValue}>{task.assignee?.name || "Mohamed Ahmed"}</span>
            </div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Priority</label>
            <div className={styles.metaValue}>
              <span className={styles.priorityDot} />
              {task.priority}
            </div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Remind Me</label>
            <div className={styles.metaValue}>Every two hours</div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Repeat</label>
            <div className={styles.metaValue}>Week days (Sun, Mon, Tue)</div>
          </div>
        </div>
      </div>

      <TaskComments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        taskId={task.id}
      />
    </div>
  );
};
