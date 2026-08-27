"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./DatePickerModal.module.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dateStr: string) => void;
  initialValue?: string;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialValue,
}) => {
  const [selectedDay, setSelectedDay] = useState(20);
  const [hour, setHour] = useState("11");
  const [minute, setMinute] = useState("00");
  const [amPm, setAmPm] = useState("AM");

  if (!isOpen) return null;

  const handleSave = () => {
    onSelect(`${selectedDay}-02-2024 ${hour}:${minute} ${amPm}`);
    onClose();
  };

  const daysInMonth = Array.from({ length: 29 }, (_, i) => i + 1); // February 2024
  const startEmptyCells = Array.from({ length: 4 }); // Calendar offset for start of month

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>Set due date</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Date Section */}
        <div className={styles.datePickerSection}>
          <div className={styles.monthHeader}>
            <button className={styles.monthNav}>
              <ChevronLeft size={16} />
            </button>
            <span className={styles.monthName}>February 2024</span>
            <button className={styles.monthNav}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.weekdays}>
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          <div className={styles.daysGrid}>
            {startEmptyCells.map((_, i) => (
              <span key={`empty-${i}`} className={styles.emptyDay} />
            ))}
            {daysInMonth.map((day) => {
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  className={`${styles.dayBtn} ${isSelected ? styles.dayBtnActive : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Section */}
        <div className={styles.timePickerSection}>
          <label className={styles.timeLabel}>Time</label>
          <div className={styles.timeInputs}>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className={styles.timeInput}
            />
            <span className={styles.timeColon}>:</span>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className={styles.timeInput}
            />
            <div className={styles.amPmToggle}>
              <button
                className={`${styles.amPmBtn} ${amPm === "AM" ? styles.amPmBtnActive : ""}`}
                onClick={() => setAmPm("AM")}
              >
                AM
              </button>
              <button
                className={`${styles.amPmBtn} ${amPm === "PM" ? styles.amPmBtnActive : ""}`}
                onClick={() => setAmPm("PM")}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.okBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
