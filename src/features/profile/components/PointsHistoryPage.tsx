"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Gift, ShoppingCart, Award } from "lucide-react";
import styles from "./PointsHistoryPage.module.css";

type TabType = "rewards" | "deductions";

interface PointEntry {
  id: string;
  amount: number;
  label: string;
  balance: number;
  date: string;
  month: number;
  year: number;
  day: number;
}

const REWARDS_DATA: PointEntry[] = [
  { id: "r1", amount: 20, label: "Commitment", balance: 320, date: "2024-12-07", month: 12, year: 2024, day: 7 },
  { id: "r2", amount: 20, label: "Commitment", balance: 300, date: "2024-12-07", month: 12, year: 2024, day: 7 },
  { id: "r3", amount: 20, label: "Commitment", balance: 260, date: "2024-12-06", month: 12, year: 2024, day: 6 },
  { id: "r4", amount: 20, label: "Commitment", balance: 260, date: "2024-12-06", month: 12, year: 2024, day: 6 },
  { id: "r5", amount: 20, label: "Commitment", balance: 240, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "r6", amount: 20, label: "Commitment", balance: 220, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "r7", amount: 20, label: "Commitment", balance: 200, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "r8", amount: 20, label: "Commitment", balance: 180, date: "2024-12-03", month: 12, year: 2024, day: 3 },
];

const DEDUCTIONS_DATA: PointEntry[] = [
  { id: "d1", amount: -20, label: "Noon Purchase", balance: 260, date: "2024-12-07", month: 12, year: 2024, day: 7 },
  { id: "d2", amount: -20, label: "Noon Purchase", balance: 290, date: "2024-12-07", month: 12, year: 2024, day: 7 },
  { id: "d3", amount: -20, label: "Noon Purchase", balance: 300, date: "2024-12-06", month: 12, year: 2024, day: 6 },
  { id: "d4", amount: -20, label: "Noon Purchase", balance: 320, date: "2024-12-06", month: 12, year: 2024, day: 6 },
  { id: "d5", amount: -20, label: "Noon Purchase", balance: 340, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "d6", amount: -20, label: "Noon Purchase", balance: 360, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "d7", amount: -20, label: "Noon Purchase", balance: 380, date: "2024-12-04", month: 12, year: 2024, day: 4 },
  { id: "d8", amount: -20, label: "Noon Purchase", balance: 400, date: "2024-12-03", month: 12, year: 2024, day: 3 },
];

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const FULL_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function groupByDay(entries: PointEntry[]): Map<number, PointEntry[]> {
  const map = new Map<number, PointEntry[]>();
  for (const e of entries) {
    const existing = map.get(e.day) || [];
    existing.push(e);
    map.set(e.day, existing);
  }
  return map;
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay();
}

export const PointsHistoryPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("rewards");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "09/30/2024", end: "10/06/2024" });
  const [calendarBaseMonth, setCalendarBaseMonth] = useState(9); // September = 9
  const [calendarBaseYear, setCalendarBaseYear] = useState(2024);

  const data = activeTab === "rewards" ? REWARDS_DATA : DEDUCTIONS_DATA;
  const isRewards = activeTab === "rewards";

  const grouped = groupByDay(data);
  const sortedDays = Array.from(grouped.keys()).sort((a, b) => b - a);

  const renderCalendarMonth = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days: React.ReactNode[] = [];

    // Empty cells before start
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.calendarDayEmpty}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      // Simple highlight for range demo (days 17-23 in September for the selected range visual)
      const isInRange = month === 9 && year === 2024 && d >= 17 && d <= 23;
      const isStart = month === 9 && year === 2024 && d === 17;
      const isEnd = month === 9 && year === 2024 && d === 23;

      let dayClass = styles.calendarDay;
      if (isStart) dayClass += ` ${styles.calendarDayStart}`;
      else if (isEnd) dayClass += ` ${styles.calendarDayEnd}`;
      else if (isInRange) dayClass += ` ${styles.calendarDayInRange}`;

      days.push(
        <div key={d} className={dayClass}>
          {d}
        </div>
      );
    }

    return (
      <div className={styles.calendarMonth}>
        <div className={styles.calendarMonthTitle}>
          {FULL_MONTH_NAMES[month - 1]} {year}
        </div>
        <div className={styles.calendarGrid}>
          {DAY_HEADERS.map((dh) => (
            <div key={dh} className={styles.calendarDayHeader}>{dh}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const nextMonth = calendarBaseMonth === 12 ? 1 : calendarBaseMonth + 1;
  const nextYear = calendarBaseMonth === 12 ? calendarBaseYear + 1 : calendarBaseYear;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.push("/profile")}>
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className={styles.pageTitle}>Points History</h1>
        </div>

        <div className={styles.headerLeft}>
          {/* Tabs */}
          <div className={styles.tabsRow}>
            <button
              className={`${styles.tab} ${isRewards ? styles.tabRewardsActive : styles.tabRewards}`}
              onClick={() => setActiveTab("rewards")}
            >
              Rewards
            </button>
            <button
              className={`${styles.tab} ${!isRewards ? styles.tabDeductionsActive : styles.tabDeductions}`}
              onClick={() => setActiveTab("deductions")}
            >
              Deductions
            </button>
          </div>

          {/* Date Range Picker */}
          <div style={{ position: "relative" }}>
            <button
              className={styles.dateRangeBtn}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar size={14} className={styles.calendarIcon} />
              {dateRange.start} - {dateRange.end}
            </button>

            {showCalendar && (
              <>
                <div className={styles.calendarOverlay} onClick={() => setShowCalendar(false)} />
                <div className={styles.calendarPopup}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className={styles.calendarNavBtn}
                      onClick={() => {
                        if (calendarBaseMonth === 1) {
                          setCalendarBaseMonth(12);
                          setCalendarBaseYear(calendarBaseYear - 1);
                        } else {
                          setCalendarBaseMonth(calendarBaseMonth - 1);
                        }
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                  {renderCalendarMonth(calendarBaseMonth, calendarBaseYear)}
                  {renderCalendarMonth(nextMonth, nextYear)}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className={styles.calendarNavBtn}
                      onClick={() => {
                        if (calendarBaseMonth === 12) {
                          setCalendarBaseMonth(1);
                          setCalendarBaseYear(calendarBaseYear + 1);
                        } else {
                          setCalendarBaseMonth(calendarBaseMonth + 1);
                        }
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Award size={80} strokeWidth={1} />
          </div>
          <h3 className={styles.emptyTitle}>No Points history</h3>
          <p className={styles.emptyDesc}>
            You have no points history. Complete tasks and increase productivity to collect points rewards!
          </p>
        </div>
      ) : (
        sortedDays.map((day) => {
          const entries = grouped.get(day)!;
          return (
            <div key={day} className={styles.monthSection}>
              <div className={styles.monthLabel}>
                <span className={styles.monthDay}>{String(day).padStart(2, "0")}</span>
                <span className={styles.monthName}>{MONTH_NAMES[entries[0].month - 1]}.{entries[0].year}</span>
              </div>
              <div className={styles.entriesGrid}>
                {entries.map((entry) => (
                  <div key={entry.id} className={styles.entryCard}>
                    <div
                      className={`${styles.entryIconCircle} ${isRewards ? styles.rewardIcon : styles.deductionIcon}`}
                    >
                      {isRewards ? <Gift size={18} /> : <ShoppingCart size={18} />}
                    </div>
                    <div className={styles.entryInfo}>
                      <span
                        className={`${styles.entryAmount} ${isRewards ? styles.entryAmountPositive : styles.entryAmountNegative}`}
                      >
                        {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                      </span>
                      <span className={styles.entryLabel}>{entry.label}</span>
                    </div>
                    <span className={styles.entryBalance}>{entry.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
