"use client";

import React from "react";
import { Clock, TrendingUp, DollarSign, Hourglass } from "lucide-react";
import type { AttendanceSummary } from "../attendanceData";
import styles from "./AttendancePage.module.css";

interface AttendanceStatsProps {
  summary: AttendanceSummary;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ summary }) => {
  return (
    <div className={styles.statsRow}>
      {/* Total Working Hours */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrapper} ${styles.statIconRed}`}>
          <Clock size={22} className="text-red-500" style={{ color: "#ef4444" }} />
        </div>
        <div className={styles.statContent}>
          <span className={styles.statValue}>{summary.totalWorkingHours}</span>
          <span className={styles.statLabel}>Total working hours</span>
        </div>
      </div>

      {/* Average Check-in Time */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrapper} ${styles.statIconBlue}`}>
          <TrendingUp size={22} className="text-blue-500" style={{ color: "#3b82f6" }} />
        </div>
        <div className={styles.statContent}>
          <span className={styles.statValue}>{summary.averageCheckInTime}</span>
          <span className={styles.statLabel}>Totalhours late</span>
        </div>
      </div>

      {/* Month Salary Deductions */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrapper} ${styles.statIconGreen}`}>
          <DollarSign size={22} className="text-green-500" style={{ color: "#22c55e" }} />
        </div>
        <div className={styles.statContent}>
          <span className={styles.statValue}>{summary.totalSalary} $</span>
          <span className={styles.statLabel}>Month salary deductions</span>
        </div>
      </div>

      {/* Remaining Hours */}
      <div className={styles.statCard}>
        <div className={`${styles.statIconWrapper} ${styles.statIconOrange}`}>
          <Hourglass size={22} className="text-amber-500" style={{ color: "#f59e0b" }} />
        </div>
        <div className={styles.statContent}>
          <span className={styles.statValue}>{summary.totalRemainingHours}</span>
          <span className={styles.statLabel}>Remaining hours</span>
        </div>
      </div>
    </div>
  );
};
