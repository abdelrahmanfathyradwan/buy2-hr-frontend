"use client";

import React, { useState } from "react";
import { ArrowLeft, Trash2, Plus, Paperclip, Calendar, Eye } from "lucide-react";
import styles from "./EditTask.module.css";
import { Task } from "./TaskCard";

interface EditTaskProps {
  task: Task | null;
  onBack: () => void;
  onSave: (updatedTask: Task) => void;
  onOpenDatePicker: (currentDate: string, onSelect: (newDate: string) => void) => void;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
}

export const EditTask: React.FC<EditTaskProps> = ({
  task,
  onBack,
  onSave,
  onOpenDatePicker,
}) => {
  const [title, setTitle] = useState(task?.title || "Revision 1: Fixing Navbar at Dashboard Page");
  const [description, setDescription] = useState(
    task?.title ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit...` : ""
  );
  const [listName, setListName] = useState(task?.listName || "Backend bugs team");
  const [status, setStatus] = useState<Task["status"]>(task?.status || "todo");
  const [dueDate, setDueDate] = useState(task?.deadline || "20-02-2024");
  const [assignee, setAssignee] = useState(task?.assignee?.name || "Mohamed Ahmed");
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority || "Low");
  const [remindMe, setRemindMe] = useState("Select Date");
  const [repeat, setRepeat] = useState("Select");

  // Inline subtask input state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "s1", title: "Change the icons to font awesome icons.", completed: false },
    { id: "s2", title: "Adjust the size to responsive mobile.", completed: false },
    { id: "s3", title: "Activate the navigation buttons to direct the users.", completed: false },
    { id: "s4", title: "Activate the navigation buttons to direct the users.", completed: false },
  ]);

  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "a1", name: "Devs Presentation.pdf", size: "1.8 MB" },
    { id: "a2", name: "Devs Presentation.pdf", size: "1.8 MB" },
    { id: "a3", name: "Devs Presentation.pdf", size: "1.8 MB" },
  ]);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, { id: Date.now().toString(), title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle("");
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleAddAttachment = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setAttachments([
          ...attachments,
          { id: Date.now().toString(), name: file.name, size: `${sizeMB} MB` },
        ]);
      }
    };
    input.click();
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSaveClick = () => {
    onSave({
      id: task?.id || Date.now().toString(),
      title,
      deadline: dueDate,
      priority,
      listName,
      status,
      assignee: { name: assignee },
    });
  };

  return (
    <div className={styles.container}>
      {/* Header bar */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h2 className={styles.title}>Edit Task</h2>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.discardBtn} onClick={onBack}>
            Discard
          </button>
          <button className={styles.saveBtn} onClick={handleSaveClick}>
            Save Task
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left main form panel */}
        <div className={styles.leftPanel}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <button
              className={styles.addSubtaskBtn}
              onClick={() => setIsAddingSubtask(true)}
            >
              <Plus size={14} />
              <span>Add Subtask</span>
            </button>
          </div>

          {/* Inline subtask input */}
          {isAddingSubtask && (
            <div className={styles.subtaskItem}>
              <input
                type="text"
                placeholder="Enter subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubtask();
                  if (e.key === "Escape") { setIsAddingSubtask(false); setNewSubtaskTitle(""); }
                }}
                className={styles.subtaskInlineInput}
                autoFocus
              />
              <button className={styles.addSubtaskBtn} onClick={handleAddSubtask}>
                Add
              </button>
            </div>
          )}

          {/* Subtasks checklist */}
          <div className={styles.subtasksList}>
            {subtasks.map((sub) => (
              <div key={sub.id} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => handleToggleSubtask(sub.id)}
                  className={styles.subtaskCheckbox}
                />
                <span
                  className={`${styles.subtaskText} ${
                    sub.completed ? styles.subtaskTextCompleted : ""
                  }`}
                >
                  {sub.title}
                </span>
                <button
                  className={styles.removeSubtaskBtn}
                  onClick={() => handleRemoveSubtask(sub.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <h4 className={styles.label}>Task Description</h4>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
            />
          </div>

          {/* Attachments */}
          <div className={styles.attachmentsSection}>
            <h4 className={styles.label}>Attachments</h4>
            <div className={styles.attachmentsList}>
              <button className={styles.addAttachmentCard} onClick={handleAddAttachment}>
                <Paperclip size={16} />
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
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleRemoveAttachment(file.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                    <button className={styles.actionBtn}>
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right meta settings panel */}
        <div className={styles.rightPanel}>
          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>List Name</label>
            <select value={listName} onChange={(e) => setListName(e.target.value)} className={styles.metaSelect}>
              <option>Backend bugs team</option>
              <option>Design team</option>
              <option>Frontend team</option>
            </select>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])} className={styles.metaSelect}>
              <option value="todo">To-do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Due date</label>
            <div className={styles.metaDatePickerTrigger} onClick={() => onOpenDatePicker(dueDate, setDueDate)}>
              <span>{dueDate}</span>
              <Calendar size={14} />
            </div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Assigned To</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={styles.metaSelect}>
              <option>Mohamed Ahmed</option>
              <option>Ahmed Mohamed</option>
              <option>Sara Ali</option>
            </select>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className={styles.metaSelect}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Remind Me</label>
            <div className={styles.metaDatePickerTrigger} onClick={() => onOpenDatePicker(remindMe, setRemindMe)}>
              <span>{remindMe}</span>
              <Calendar size={14} />
            </div>
          </div>

          <div className={styles.metaGroup}>
            <label className={styles.metaLabel}>Repeat</label>
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className={styles.metaSelect}>
              <option>Select</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
