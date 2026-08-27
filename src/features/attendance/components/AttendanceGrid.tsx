"use client";

import React from "react";
import type { AttendanceRecord } from "../attendanceData";
import { AttendanceDayCard } from "./AttendanceDayCard";
import styles from "./AttendancePage.module.css";

interface AttendanceGridProps {
  records: AttendanceRecord[];
  selectedRecord: AttendanceRecord | null;
  onSelectRecord: (record: AttendanceRecord) => void;
  hideWeekends: boolean;
}

export const AttendanceGrid: React.FC<AttendanceGridProps> = ({
  records,
  selectedRecord,
  onSelectRecord,
  hideWeekends,
}) => {
  const filteredRecords = hideWeekends
    ? records.filter((r) => r.status !== "weekend")
    : records;

  return (
    <div className={styles.gridSection}>
      <div
        className={`${styles.dayGrid} ${
          hideWeekends ? styles.dayGridHideWeekends : ""
        }`}
      >
        {filteredRecords.map((record) => (
          <AttendanceDayCard
            key={record.date}
            record={record}
            isSelected={selectedRecord?.date === record.date}
            onClick={() => onSelectRecord(record)}
          />
        ))}
      </div>
    </div>
  );
};
