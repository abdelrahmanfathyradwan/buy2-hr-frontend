"use client";

import React, { useState, useMemo } from "react";
import { Filter, Calendar } from "lucide-react";
import {
  generateAttendanceRecords,
  computeSummary,
  type AttendanceRecord,
} from "../attendanceData";
import { AttendanceStats } from "./AttendanceStats";
import { AttendanceGrid } from "./AttendanceGrid";
import { AttendanceOverview } from "./AttendanceOverview";
import { DateRangeFilter } from "./DateRangeFilter";
import styles from "./AttendancePage.module.css";

export const AttendancePage: React.FC = () => {
  // Default range: This Week
  const today = new Date();
  const getStartOfWeek = (d: Date) => {
    const result = new Date(d);
    const day = result.getDay();
    const diff = day === 0 ? 6 : day - 1; // Mon-start
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };
  const getEndOfWeek = (d: Date) => {
    const start = getStartOfWeek(d);
    const result = new Date(start);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  const [startDate, setStartDate] = useState<Date>(getStartOfWeek(today));
  const [endDate, setEndDate] = useState<Date>(getEndOfWeek(today));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hideWeekends, setHideWeekends] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Generate records based on dates
  const records = useMemo(() => {
    return generateAttendanceRecords(startDate, endDate);
  }, [startDate, endDate]);

  // Compute live summaries
  const summary = useMemo(() => {
    return computeSummary(records);
  }, [records]);

  // Formatted date string for button
  const formattedRange = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const format = (d: Date) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
    return `This Week : ${format(startDate)} - ${format(endDate)}`;
  }, [startDate, endDate]);

  const handleApplyDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    // Reset selected day details to keep things clean
    setSelectedRecord(null);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Attendance</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.filterBtn}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>

          <button
            className={styles.dateRangeBtn}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className={styles.calendarIcon}>
              <Calendar size={16} />
            </span>
            <span>{formattedRange}</span>

            {/* Date range selection picker dropdown overlay */}
            {isFilterOpen && (
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onApply={handleApplyDateRange}
                onClose={() => setIsFilterOpen(false)}
                hideWeekends={hideWeekends}
                onToggleWeekends={() => setHideWeekends(!hideWeekends)}
              />
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceStats summary={summary} />

      {/* Attendance Grid */}
      <AttendanceGrid
        records={records}
        selectedRecord={selectedRecord}
        onSelectRecord={setSelectedRecord}
        hideWeekends={hideWeekends}
      />

      {/* Overview Detail Side Drawer / Modal */}
      {selectedRecord && (
        <AttendanceOverview
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};
