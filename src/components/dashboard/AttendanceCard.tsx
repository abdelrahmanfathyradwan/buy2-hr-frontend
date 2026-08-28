"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./AttendanceCard.module.css";

/* ─────────────── Types ─────────────── */
type ClockStatus = "idle" | "working" | "on_break" | "clocked_out";

type AlertType =
  | "clock_in_warning"
  | "shift_warning"
  | "clock_out_confirm"
  | "status_warning"
  | "happy_vacation"
  | null;

/* ─────────────── Helpers ─────────────── */
function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const FULL_DAY_SECONDS = 8 * 60 * 60; // 8-hour workday
const CIRCUMFERENCE = 2 * Math.PI * 52; // ~326.73

/* ─────────────── Alert Modal ─────────────── */
function AttendanceAlertModal({
  type,
  onClose,
  onPrimary,
  onSecondary,
}: {
  type: AlertType;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  if (!type) return null;

  const configs: Record<
    NonNullable<AlertType>,
    {
      title: string;
      desc: string;
      variant: "warning" | "info";
      primaryLabel: string;
      secondaryLabel?: string;
      primaryStyle: string;
      dark?: boolean;
    }
  > = {
    clock_in_warning: {
      title: "Clock In Warning!",
      desc: "Please arrive at assigned work location to clock in to work.",
      variant: "warning",
      primaryLabel: "Clock in",
      secondaryLabel: "Later",
      primaryStyle: styles.modalBtnDanger,
    },
    shift_warning: {
      title: "Shift Warning!",
      desc: "We noticed your shift has ended ! please don\u2019t forget to clock out.",
      variant: "warning",
      primaryLabel: "Clock out",
      secondaryLabel: "Later",
      primaryStyle: styles.modalBtnDanger,
    },
    clock_out_confirm: {
      title: "Clock out ?",
      desc: "Your shift has not finished yet, are you sure you want to clock out?",
      variant: "warning",
      primaryLabel: "Clock out",
      secondaryLabel: "Cancel",
      primaryStyle: styles.modalBtnDanger,
    },
    status_warning: {
      title: "Status Warning!",
      desc: "We noticed you are not at your assigned work location, please update your status.",
      variant: "warning",
      primaryLabel: "Clock out",
      secondaryLabel: "On break",
      primaryStyle: styles.modalBtnDanger,
    },
    happy_vacation: {
      title: "Happy Vacation !",
      desc: "You are not scheduled for work today, so enjoy your time off !",
      variant: "info",
      primaryLabel: "Got it",
      primaryStyle: styles.modalBtnDark,
      dark: true,
    },
  };

  const cfg = configs[type];
  const isDark = cfg.dark;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={isDark ? styles.modalCardDark : styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className={isDark ? styles.modalCloseDark : styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Icon */}
        <div
          className={`${styles.modalIconWrapper} ${
            cfg.variant === "warning" ? styles.modalIconWarning : styles.modalIconInfo
          }`}
        >
          <div className={styles.modalDots}>
            {cfg.variant === "warning" ? (
              <>
                <span className={`${styles.dot} ${styles.dot1}`} />
                <span className={`${styles.dot} ${styles.dot2}`} />
                <span className={`${styles.dot} ${styles.dot3}`} />
              </>
            ) : (
              <>
                <span className={`${styles.dot} ${styles.dotBlue1}`} />
                <span className={`${styles.dot} ${styles.dotBlue2}`} />
                <span className={`${styles.dot} ${styles.dotBlue3}`} />
              </>
            )}
          </div>

          {cfg.variant === "warning" ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="1.5" />
              <path d="M12 8v4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="#6366f1" />
            </svg>
          )}
        </div>

        {/* Text */}
        <h3 className={isDark ? styles.modalTitleDark : styles.modalTitle}>
          {cfg.title}
        </h3>
        <p className={isDark ? styles.modalDescDark : styles.modalDesc}>{cfg.desc}</p>

        {/* Actions */}
        <div className={styles.modalActions}>
          {cfg.secondaryLabel && onSecondary && (
            <button className={styles.modalBtnOutline} onClick={onSecondary}>
              {cfg.secondaryLabel}
            </button>
          )}
          <button className={cfg.primaryStyle} onClick={onPrimary}>
            {cfg.primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
export function AttendanceCard() {
  const [status, setStatus] = useState<ClockStatus>("idle");
  const [alert, setAlert] = useState<AlertType>(null);

  // Timers (in seconds)
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Timestamps
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  // Refs for interval cleanup
  const workIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Work timer ── */
  useEffect(() => {
    if (status === "working") {
      workIntervalRef.current = setInterval(() => {
        setWorkSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (workIntervalRef.current) clearInterval(workIntervalRef.current);
    };
  }, [status]);

  /* ── Break timer ── */
  useEffect(() => {
    if (status === "on_break") {
      breakIntervalRef.current = setInterval(() => {
        setBreakSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (breakIntervalRef.current) clearInterval(breakIntervalRef.current);
    };
  }, [status]);

  /* ── Actions ── */
  const handleClockIn = useCallback(() => {
    setStatus("working");
    setClockInTime(new Date());
    setWorkSeconds(0);
    setBreakSeconds(0);
    setClockOutTime(null);
    setAlert(null);
  }, []);

  const handleTakeBreak = useCallback(() => {
    setStatus("on_break");
    setBreakSeconds(0);
  }, []);

  const handleEndBreak = useCallback(() => {
    setStatus("working");
  }, []);

  const handleClockOut = useCallback(() => {
    setStatus("clocked_out");
    setClockOutTime(new Date());
    setAlert(null);
  }, []);

  const handleClockOutRequest = useCallback(() => {
    setAlert("clock_out_confirm");
  }, []);

  /* ── SVG ring progress ── */
  const progress = Math.min(workSeconds / FULL_DAY_SECONDS, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Ring stroke color based on state
  const ringColor =
    status === "on_break"
      ? "#f59e0b"
      : status === "clocked_out"
      ? "#9ca3af"
      : "var(--color-primary)";

  /* ── Alert subtitle text ── */
  const alertContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#6b7280" strokeWidth="1.5" />
                <path d="M8 5v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.75" fill="#6b7280" />
              </svg>
            </div>
            <p className={styles.alertText}>
              You&apos;re not marked yourself as present today
            </p>
          </div>
        );
      case "working":
        return (
          <div className={styles.alertBoxSuccess}>
            <div className={styles.alertIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#16a34a" strokeWidth="1.5" />
                <path d="M5.5 8l1.75 1.75L10.5 6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={styles.alertText}>
              Welcome to work, hope you have a good day.
            </p>
          </div>
        );
      case "on_break":
        return (
          <div className={styles.alertBoxBreak}>
            <div className={styles.alertIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#d97706" strokeWidth="1.5" />
                <path d="M6 6h4v2a2 2 0 01-2 2v0a2 2 0 01-2-2V6z" stroke="#d97706" strokeWidth="1.2" />
                <path d="M10 7h1a1 1 0 010 2h-1" stroke="#d97706" strokeWidth="1.2" />
                <path d="M6 11h4" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className={styles.alertText}>
              You&apos;re on a break, take your time.
            </p>
          </div>
        );
      case "clocked_out":
        return (
          <div className={styles.alertBox}>
            <div className={styles.alertIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#6b7280" strokeWidth="1.5" />
                <path d="M5.5 8l1.75 1.75L10.5 6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={styles.alertText}>
              You have clocked out. See you tomorrow!
            </p>
          </div>
        );
    }
  };

  /* ── Bottom buttons ── */
  const renderButtons = () => {
    switch (status) {
      case "idle":
        return (
          <button
            className={styles.clockInBtn}
            id="clock-in-btn"
            onClick={handleClockIn}
          >
            Clock In
          </button>
        );
      case "working":
        return (
          <div className={styles.buttonRow}>
            <button className={styles.takeBreakBtn} onClick={handleTakeBreak}>
              Take a break
            </button>
            <button className={styles.clockOutBtn} onClick={handleClockOutRequest}>
              Clock out
            </button>
          </div>
        );
      case "on_break":
        return (
          <div className={styles.buttonRow}>
            <div className={styles.breakTimerBtn}>
              <span className={styles.breakIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#92400e" strokeWidth="1.5" />
                  <path d="M8 5v3l2 1" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {formatTime(breakSeconds)}
            </div>
            <button className={styles.endBreakBtn} onClick={handleEndBreak}>
              End break
            </button>
          </div>
        );
      case "clocked_out":
        return (
          <button
            className={styles.clockInBtn}
            onClick={handleClockIn}
            style={{ opacity: 0.6, pointerEvents: "none" }}
            disabled
          >
            See you tomorrow
          </button>
        );
    }
  };

  return (
    <>
      <div className={styles.card} id="attendance-widget">
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>Attendance</h3>
          <p className={styles.subtitle}>
            Get to work, but don&apos;t forget to have a break
          </p>
        </div>

        {/* Alert + Timer Row */}
        <div className={styles.middleRow}>
          {alertContent()}

          {/* Circular Timer */}
          <div className={styles.timerSection}>
            <div className={styles.timerRing}>
              <svg className={styles.timerSvg} viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#EBF0FF"
                  strokeWidth="6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="6"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
                />
              </svg>
              <div className={styles.timerInner}>
                <span className={styles.timerValue}>{formatTime(workSeconds)}</span>
                <span className={styles.timerLabel}>Worked today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clock In / Clock Out Dots */}
        <div className={styles.clockRow}>
          <div className={styles.clockItem}>
            <span className={styles.clockDotGreen} />
            <span className={styles.clockLabel}>Clock In</span>
            <span className={styles.clockTime}>
              {clockInTime ? formatClockTime(clockInTime) : "--"}
            </span>
          </div>
          <span className={styles.clockSeparator} />
          <div className={styles.clockItem}>
            <span className={styles.clockDotRed} />
            <span className={styles.clockLabel}>Clock Out</span>
            <span className={styles.clockTime}>
              {clockOutTime ? formatClockTime(clockOutTime) : "--"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {renderButtons()}
      </div>

      {/* Alert Modals */}
      <AttendanceAlertModal
        type={alert}
        onClose={() => setAlert(null)}
        onPrimary={() => {
          switch (alert) {
            case "clock_in_warning":
              handleClockIn();
              break;
            case "shift_warning":
            case "clock_out_confirm":
              handleClockOut();
              break;
            case "status_warning":
              handleClockOut();
              break;
            case "happy_vacation":
              setAlert(null);
              break;
          }
        }}
        onSecondary={() => {
          switch (alert) {
            case "status_warning":
              handleTakeBreak();
              setAlert(null);
              break;
            default:
              setAlert(null);
              break;
          }
        }}
      />
    </>
  );
}
