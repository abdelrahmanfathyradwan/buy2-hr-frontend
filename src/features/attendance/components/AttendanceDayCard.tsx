"use client";

import React from "react";
import type { AttendanceRecord } from "../attendanceData";
import styles from "./AttendancePage.module.css";

interface AttendanceDayCardProps {
  record: AttendanceRecord;
  isSelected: boolean;
  onClick: () => void;
}

export const AttendanceDayCard: React.FC<AttendanceDayCardProps> = ({
  record,
  isSelected,
  onClick,
}) => {
  const isWeekend = record.status === "weekend";
  const isAbsent = record.status === "absent";

  // Expanded circle path parameters to give text more space inside
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const percentage = isWeekend
    ? 0
    : isAbsent
    ? 0
    : Math.min(100, Math.round((record.totalWorkMinutes / record.requiredMinutes) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  let progressColor = "#22c55e"; // Completed - green
  let badgeClass = styles.statusCompleted;
  let statusText = "Completed";

  if (record.status === "partial") {
    progressColor = "#f59e0b"; // Incomplete - yellow/orange
    badgeClass = styles.statusPartial;
    statusText = "Incomplete";
  } else if (isAbsent) {
    progressColor = "#ef4444"; // Absent - red
    badgeClass = styles.statusAbsent;
    statusText = "No attendance";
  } else if (isWeekend) {
    badgeClass = styles.statusWeekend;
    statusText = "Weekend";
  }

  return (
    <div
      className={`${styles.dayCard} ${isWeekend ? styles.dayCardWeekend : ""} ${
        isAbsent ? styles.dayCardAbsent : ""
      } ${isSelected ? styles.dayCardSelected : ""}`}
      onClick={isWeekend ? undefined : onClick}
    >
      {/* Top Row: Left Side contains the Circle Progress with date, Right Side contains Badge & Clock-in/Clock-out entries */}
      <div className={styles.dayCardTopRowGrid}>
        {/* Left: Circle progress with date */}
        <div className={styles.dayCardDateCircleContainer}>
          <div className={styles.dayRingWrapper}>
            <svg className={styles.dayRingSvg} viewBox="0 0 76 76">
              <defs>
                <linearGradient id="gradCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gradPartial" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <circle
                cx="38"
                cy="38"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4.5"
              />
              {!isWeekend && !isAbsent && (
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  fill="none"
                  stroke={record.status === "completed" ? "url(#gradCompleted)" : "url(#gradPartial)"}
                  strokeWidth="4.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 38 38)"
                  className={styles.dayRingProgress}
                />
              )}
            </svg>
            <div className={styles.dayRingInner}>
              <span className={styles.dayNumber}>{record.dayNumber}</span>
              <span className={styles.dayCardMonthNameMini}>{record.monthName.substring(0, 3)}</span>
            </div>
          </div>
        </div>

        {/* Right: Status badge & Clock In / Out times */}
        <div className={styles.dayCardTopRightContent}>
          <div className={styles.badgeWrapper}>
            <span className={`${styles.dayStatusBadge} ${badgeClass}`}>
              {statusText}
            </span>
          </div>

          {!isWeekend && (
            <div className={styles.dayCardTimesCol}>
              <div className={styles.dayTimeRow}>
                <span className={`${styles.entryDot} ${styles.dotGreen}`} />
                <span className={styles.timeLabel}>Clock in</span>
                <span className={styles.timeValueGreen}>{record.checkIn || "--"}</span>
              </div>
              <div className={styles.dayTimeRow}>
                <span className={`${styles.entryDot} ${styles.dotRed}`} />
                <span className={styles.timeLabel}>Clock out</span>
                <span className={styles.timeValueRed}>{record.checkOut || "--"}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.daySeparator} />

      {/* Bottom Row: Working, Break and Late hours breakdown */}
      {!isWeekend && (
        <div className={styles.dayEntriesBottom}>
          {/* Working hrs */}
          <div className={styles.dayEntryRowSub}>
            <div className={styles.bottomLabelWithDot}>
              <span className={`${styles.entryDot} ${styles.dotGreen}`} />
              <span className={styles.entryLabelSub}>Working hrs</span>
            </div>
            <span className={styles.entryTimeValueSub}>
              {isAbsent ? "00:00" : `${String(Math.floor(record.totalWorkMinutes / 60)).padStart(2, "0")}:${String(record.totalWorkMinutes % 60).padStart(2, "0")}`}
            </span>
          </div>
          {/* Break hrs */}
          <div className={styles.dayEntryRowSub}>
            <div className={styles.bottomLabelWithDot}>
              <span className={`${styles.entryDot} ${styles.dotBlue}`} />
              <span className={styles.entryLabelSub}>Break hrs</span>
            </div>
            <span className={styles.entryTimeValueSub}>
              {isAbsent ? "00:00" : `${String(Math.floor(record.totalBreakMinutes / 60)).padStart(2, "0")}:${String(record.totalBreakMinutes % 60).padStart(2, "0")}`}
            </span>
          </div>
          {/* Late hrs */}
          <div className={styles.dayEntryRowSub}>
            <div className={styles.bottomLabelWithDot}>
              <span className={`${styles.entryDot} ${styles.dotOrange}`} />
              <span className={styles.entryLabelSub}>Late hrs</span>
            </div>
            <span className={styles.entryTimeValueSub}>
              {isAbsent ? "00:00" : `${String(Math.floor(record.totalOvertimeMinutes / 60)).padStart(2, "0")}:${String(record.totalOvertimeMinutes % 60).padStart(2, "0")}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
