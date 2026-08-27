"use client";

import React from "react";
import { X, Clock, Coffee, Sparkles } from "lucide-react";
import type { AttendanceRecord } from "../attendanceData";
import styles from "./AttendancePage.module.css";

interface AttendanceOverviewProps {
  record: AttendanceRecord | null;
  onClose: () => void;
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const isAbsent = record.status === "absent";
  const formattedWorkHrs = `${String(Math.floor(record.totalWorkMinutes / 60)).padStart(2, "0")}:${String(
    record.totalWorkMinutes % 60
  ).padStart(2, "0")}`;
  const formattedBreakHrs = `${String(Math.floor(record.totalBreakMinutes / 60)).padStart(2, "0")}:${String(
    record.totalBreakMinutes % 60
  ).padStart(2, "0")}`;
  const formattedOvertimeHrs = `${String(Math.floor(record.totalOvertimeMinutes / 60)).padStart(2, "0")}:${String(
    record.totalOvertimeMinutes % 60
  ).padStart(2, "0")}`;

  let badgeClass = styles.badgeCompleted;
  let badgeText = "Completed";

  if (record.status === "partial") {
    badgeClass = styles.badgePartial;
    badgeText = "Incomplete";
  } else if (isAbsent) {
    badgeClass = styles.statusAbsent;
    badgeText = "No attendance";
  }

  return (
    <div className={styles.overviewBackdrop} onClick={onClose}>
      <div className={styles.overviewPanel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.overviewHeader}>
          <span className={styles.overviewTitle}>Overview</span>
          <button className={styles.overviewCloseBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.overviewBody}>
          {/* Main Info Box matching Figma Exactly */}
          <div className={styles.figmaOverviewInfoBox}>
            <div className={styles.figmaOverviewDateRow}>
              <span className={styles.figmaOverviewDayNum}>{record.dayNumber}</span>
              <div className={styles.figmaOverviewDateMeta}>
                <span className={styles.figmaOverviewMonth}>{record.monthName}</span>
                <span className={styles.figmaOverviewYear}>{record.year}</span>
              </div>
              <span className={`${styles.overviewBadge} ${badgeClass}`}>
                {badgeText}
              </span>
            </div>

            <div className={styles.figmaTimelineBox}>
              <div className={styles.figmaTimelineRow}>
                <span className={`${styles.entryDot} ${styles.dotGreen}`} />
                <span className={styles.figmaLabel}>Clock in</span>
                <span className={styles.figmaTimeValueGreen}>{record.checkIn || "--"}</span>
              </div>
              <div className={styles.figmaTimelineRow}>
                <span className={`${styles.entryDot} ${styles.dotRed}`} />
                <span className={styles.figmaLabel}>Clock out</span>
                <span className={styles.figmaTimeValueRed}>{record.checkOut || "--"}</span>
              </div>
            </div>

            <div className={styles.figmaDetailGrid}>
              <div className={styles.figmaDetailRow}>
                <span className={styles.figmaDetailLabel}>Leave Type</span>
                <span className={styles.figmaDetailBadgeBlue}>Partial</span>
              </div>
              <div className={styles.figmaDetailRow}>
                <span className={styles.figmaDetailLabel}>Status</span>
                <span className={styles.figmaDetailBadgeGreen}>Approved</span>
              </div>
              <div className={styles.figmaDetailRow}>
                <span className={styles.figmaDetailLabel}>Reason</span>
                <span className={styles.figmaDetailReasonText}>I'm having a fever cold.</span>
              </div>
            </div>
          </div>

          {/* Three Summary Statistics Cards at the bottom exactly as in Figma design */}
          <div className={styles.figmaOverviewStatsContainer}>
            {/* Working Hours */}
            <div className={styles.figmaOverviewStatCard}>
              <div className={`${styles.figmaOverviewStatIcon} ${styles.figmaOverviewStatIconBlue}`}>
                <Clock size={18} style={{ color: "#3b82f6" }} />
              </div>
              <div className={styles.figmaOverviewStatContent}>
                <span className={styles.figmaOverviewStatValue}>{isAbsent ? "00:00" : formattedWorkHrs}</span>
                <span className={styles.figmaOverviewStatLabel}>Total working hours</span>
              </div>
            </div>

            {/* Break Time */}
            <div className={styles.figmaOverviewStatCard}>
              <div className={`${styles.figmaOverviewStatIcon} ${styles.figmaOverviewStatIconPurple}`}>
                <Coffee size={18} style={{ color: "#7c3aed" }} />
              </div>
              <div className={styles.figmaOverviewStatContent}>
                <span className={styles.figmaOverviewStatValue}>{isAbsent ? "00:00" : formattedBreakHrs}</span>
                <span className={styles.figmaOverviewStatLabel}>Total break time</span>
              </div>
            </div>

            {/* Hours Late */}
            <div className={styles.figmaOverviewStatCard}>
              <div className={`${styles.figmaOverviewStatIcon} ${styles.figmaOverviewStatIconOrange}`}>
                <Sparkles size={18} style={{ color: "#f97316" }} />
              </div>
              <div className={styles.figmaOverviewStatContent}>
                <span className={styles.figmaOverviewStatValue}>{isAbsent ? "00:00" : formattedOvertimeHrs}</span>
                <span className={styles.figmaOverviewStatLabel}>Total hours late</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
