"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  dateRangePresets,
  monthNames,
  dayNames,
  type DateRangePreset,
} from "../attendanceData";
import styles from "./AttendancePage.module.css";

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onApply: (start: Date, end: Date) => void;
  onClose: () => void;
  hideWeekends: boolean;
  onToggleWeekends: () => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onApply,
  onClose,
  hideWeekends,
  onToggleWeekends,
}) => {
  // We keep track of current selection
  const [selectedStart, setSelectedStart] = useState<Date>(startDate);
  const [selectedEnd, setSelectedEnd] = useState<Date>(endDate);

  // Month navigation state
  const [navDate, setNavDate] = useState<Date>(new Date(startDate));

  const [activePreset, setActivePreset] = useState<string>("this_week");

  // Helper to format date string
  const formatDateStr = (d: Date) => {
    return d.toISOString().split("T")[0];
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    const [start, end] = preset.getRange();
    setSelectedStart(start);
    setSelectedEnd(end);
    setActivePreset(preset.key);
    onApply(start, end);
  };

  const handlePrevMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
  };

  const handleDayClick = (dayDate: Date) => {
    // If no start date or both selected, select start date
    if (!selectedStart || (selectedStart && selectedEnd && selectedStart !== selectedEnd)) {
      setSelectedStart(dayDate);
      setSelectedEnd(dayDate);
      setActivePreset("custom");
    } else if (selectedStart && !selectedEnd) {
      if (dayDate < selectedStart) {
        setSelectedStart(dayDate);
        setSelectedEnd(dayDate);
      } else {
        setSelectedEnd(dayDate);
        onApply(selectedStart, dayDate);
      }
      setActivePreset("custom");
    } else {
      // Toggle
      if (dayDate.getTime() === selectedStart.getTime()) {
        // clicked the same day
        return;
      }
      if (dayDate < selectedStart) {
        setSelectedStart(dayDate);
        setSelectedEnd(dayDate);
      } else {
        setSelectedEnd(dayDate);
        onApply(selectedStart, dayDate);
      }
      setActivePreset("custom");
    }
  };

  // Render a single calendar grid
  const renderCalendar = (monthOffset: number) => {
    const targetDate = new Date(navDate.getFullYear(), navDate.getMonth() + monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

    const days: React.ReactNode[] = [];

    // Empty spots before the first day
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty} />);
    }

    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(year, month, day);
      const currentDayTime = currentDayDate.getTime();
      const startTime = selectedStart ? selectedStart.getTime() : 0;
      const endTime = selectedEnd ? selectedEnd.getTime() : 0;

      const isStart = selectedStart && formatDateStr(currentDayDate) === formatDateStr(selectedStart);
      const isEnd = selectedEnd && formatDateStr(currentDayDate) === formatDateStr(selectedEnd);
      const isInRange = selectedStart && selectedEnd && currentDayTime > startTime && currentDayTime < endTime;

      let classes = styles.calendarDay;
      if (isStart) classes += ` ${styles.calendarDayRangeStart}`;
      else if (isEnd) classes += ` ${styles.calendarDayRangeEnd}`;
      else if (isInRange) classes += ` ${styles.calendarDayInRange}`;

      days.push(
        <div
          key={`day-${day}`}
          className={classes}
          onClick={() => handleDayClick(currentDayDate)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className={styles.calendarMonth}>
        <div className={styles.calendarNav}>
          {monthOffset === 0 && (
            <button className={styles.calendarNavBtn} onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
          )}
          <span className={styles.calendarMonthTitle}>
            {monthNames[month]} {year}
          </span>
          {monthOffset === 1 && (
            <button className={styles.calendarNavBtn} onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        <div className={styles.calendarGrid}>
          {dayNames.map((d) => (
            <div key={d} className={styles.calendarDayHeader}>
              {d[0]}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.dateFilterBackdrop} onClick={onClose} />
      <div className={styles.dateFilterDropdown}>
        {/* Presets Sidebar */}
        <div className={styles.dateFilterPresets}>
          {dateRangePresets.map((preset) => (
            <button
              key={preset.key}
              className={`${styles.presetBtn} ${
                activePreset === preset.key ? styles.presetBtnActive : ""
              }`}
              onClick={() => handlePresetClick(preset)}
            >
              <span>{preset.label}</span>
              {preset.isDefault && (
                <span className={styles.presetDefault}>Default</span>
              )}
            </button>
          ))}

          {/* Hide Weekends toggle */}
          <label className={styles.hideWeekendsRow} onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={hideWeekends}
              onChange={onToggleWeekends}
            />
            <span>Hide weekends</span>
          </label>
        </div>

        {/* Dual Calendar Views */}
        <div className={styles.dateFilterCalendars}>
          {renderCalendar(0)}
          {renderCalendar(1)}
        </div>
      </div>
    </>
  );
};
