/* ─────────────── Attendance Types & Mock Data ─────────────── */

export type AttendanceStatus = "completed" | "partial" | "absent" | "weekend" | "holiday";

export interface TimeEntry {
  type: "clock_in" | "clock_out" | "break_in" | "break_out";
  time: string; // "HH:mm" 24h format
}

export interface AttendanceRecord {
  date: string; // "YYYY-MM-DD"
  dayNumber: number;
  dayName: string; // "Mon", "Tue", etc.
  monthName: string;
  year: number;
  status: AttendanceStatus;
  entries: TimeEntry[];
  checkIn: string | null;
  checkOut: string | null;
  breakIn: string | null;
  breakOut: string | null;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  totalOvertimeMinutes: number;
  requiredMinutes: number; // typically 480 (8h)
  approved: boolean;
  note: string;
}

export interface AttendanceSummary {
  totalWorkingHours: string;       // "28:23:56"
  averageCheckInTime: string;      // "09:15"
  totalSalary: number;             // 205
  totalRemainingHours: string;     // "21:05"
}

/* ─────────────── Date Utilities ─────────────── */

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function minutesToHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

/* ─────────────── Mock Data Generator ─────────────── */

function generateMockRecord(date: Date): AttendanceRecord {
  const dow = date.getDay(); // 0=Sun, 6=Sat
  const isWeekend = dow === 0 || dow === 6;

  if (isWeekend) {
    return {
      date: formatDateStr(date),
      dayNumber: date.getDate(),
      dayName: dayNames[dow],
      monthName: monthNames[date.getMonth()],
      year: date.getFullYear(),
      status: "weekend",
      entries: [],
      checkIn: null,
      checkOut: null,
      breakIn: null,
      breakOut: null,
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      totalOvertimeMinutes: 0,
      requiredMinutes: 0,
      approved: false,
      note: "",
    };
  }

  // Randomize attendance for weekdays
  const rand = Math.random();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateNoTime = new Date(date);
  dateNoTime.setHours(0, 0, 0, 0);

  // Future dates have no data
  if (dateNoTime > today) {
    return {
      date: formatDateStr(date),
      dayNumber: date.getDate(),
      dayName: dayNames[dow],
      monthName: monthNames[date.getMonth()],
      year: date.getFullYear(),
      status: "absent",
      entries: [],
      checkIn: null,
      checkOut: null,
      breakIn: null,
      breakOut: null,
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      totalOvertimeMinutes: 0,
      requiredMinutes: 480,
      approved: false,
      note: "",
    };
  }

  if (rand < 0.1) {
    // 10% absent
    return {
      date: formatDateStr(date),
      dayNumber: date.getDate(),
      dayName: dayNames[dow],
      monthName: monthNames[date.getMonth()],
      year: date.getFullYear(),
      status: "absent",
      entries: [],
      checkIn: null,
      checkOut: null,
      breakIn: null,
      breakOut: null,
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      totalOvertimeMinutes: 0,
      requiredMinutes: 480,
      approved: false,
      note: "",
    };
  }

  // Generate check-in time (8:00-9:30 range)
  const checkInHour = 8 + Math.floor(Math.random() * 1.5);
  const checkInMin = Math.floor(Math.random() * 60);
  const checkIn = `${pad2(checkInHour)}:${pad2(checkInMin)}`;

  // Break time (12:00-13:30 range)
  const breakInHour = 12 + Math.floor(Math.random() * 1);
  const breakInMin = Math.floor(Math.random() * 30);
  const breakIn = `${pad2(breakInHour)}:${pad2(breakInMin)}`;

  const breakDuration = 30 + Math.floor(Math.random() * 30); // 30-60 min
  const breakOutTotalMin = breakInHour * 60 + breakInMin + breakDuration;
  const breakOutHour = Math.floor(breakOutTotalMin / 60);
  const breakOutMin = breakOutTotalMin % 60;
  const breakOut = `${pad2(breakOutHour)}:${pad2(breakOutMin)}`;

  // Check-out time (16:30-18:30 range)
  const checkOutHour = 16 + Math.floor(Math.random() * 2.5);
  const checkOutMin = Math.floor(Math.random() * 60);
  const checkOut = `${pad2(checkOutHour)}:${pad2(checkOutMin)}`;

  const totalWorkMinutes =
    (checkOutHour * 60 + checkOutMin) -
    (checkInHour * 60 + checkInMin) -
    breakDuration;

  const overtimeMinutes = Math.max(0, totalWorkMinutes - 480);
  const isCompleted = totalWorkMinutes >= 450; // at least 7.5h counts as completed

  const notes = [
    "I'm feeling about well",
    "Regular working day",
    "Had a productive meeting",
    "Worked on project deadline",
    "Training session today",
    "",
  ];

  return {
    date: formatDateStr(date),
    dayNumber: date.getDate(),
    dayName: dayNames[dow],
    monthName: monthNames[date.getMonth()],
    year: date.getFullYear(),
    status: isCompleted ? "completed" : "partial",
    entries: [
      { type: "clock_in", time: checkIn },
      { type: "break_in", time: breakIn },
      { type: "break_out", time: breakOut },
      { type: "clock_out", time: checkOut },
    ],
    checkIn,
    checkOut,
    breakIn,
    breakOut,
    totalWorkMinutes,
    totalBreakMinutes: breakDuration,
    totalOvertimeMinutes: overtimeMinutes,
    requiredMinutes: 480,
    approved: isCompleted && Math.random() > 0.3,
    note: notes[Math.floor(Math.random() * notes.length)],
  };
}

/* ─────────────── Public API ─────────────── */

export function generateAttendanceRecords(
  startDate: Date,
  endDate: Date
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    records.push(generateMockRecord(new Date(current)));
    current.setDate(current.getDate() + 1);
  }

  return records;
}

export function computeSummary(records: AttendanceRecord[]): AttendanceSummary {
  const workRecords = records.filter(
    (r) => r.status === "completed" || r.status === "partial"
  );

  // Total working minutes
  const totalWorkMin = workRecords.reduce((sum, r) => sum + r.totalWorkMinutes, 0);
  const totalH = Math.floor(totalWorkMin / 60);
  const totalM = totalWorkMin % 60;
  const totalS = Math.floor(Math.random() * 60); // mock seconds
  const totalWorkingHours = `${pad2(totalH)}:${pad2(totalM)}:${pad2(totalS)}`;

  // Average check-in time
  const checkInRecords = workRecords.filter((r) => r.checkIn);
  let avgCheckInMin = 0;
  if (checkInRecords.length > 0) {
    const totalCheckInMin = checkInRecords.reduce((sum, r) => {
      const parts = r.checkIn!.split(":");
      return sum + parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }, 0);
    avgCheckInMin = Math.round(totalCheckInMin / checkInRecords.length);
  }
  const averageCheckInTime = minutesToHHMM(avgCheckInMin);

  // Total salary (mock: $25/hour)
  const totalSalary = Math.round((totalWorkMin / 60) * 25);

  // Remaining hours (required - worked for all work days)
  const totalRequiredMin = records
    .filter((r) => r.status !== "weekend" && r.status !== "holiday")
    .reduce((sum, r) => sum + r.requiredMinutes, 0);
  const remainingMin = Math.max(0, totalRequiredMin - totalWorkMin);
  const totalRemainingHours = minutesToHHMM(remainingMin);

  return {
    totalWorkingHours,
    averageCheckInTime,
    totalSalary,
    totalRemainingHours,
  };
}

/* ─────────────── Date Range Presets ─────────────── */

export interface DateRangePreset {
  label: string;
  key: string;
  getRange: () => [Date, Date];
  isDefault?: boolean;
}

function startOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday start
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const result = new Date(start);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

export const dateRangePresets: DateRangePreset[] = [
  {
    label: "Today",
    key: "today",
    getRange: () => {
      const today = new Date();
      return [today, today];
    },
  },
  {
    label: "Yesterday",
    key: "yesterday",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return [d, d];
    },
  },
  {
    label: "This week",
    key: "this_week",
    isDefault: true,
    getRange: () => {
      const today = new Date();
      return [startOfWeek(today), endOfWeek(today)];
    },
  },
  {
    label: "Last week",
    key: "last_week",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return [startOfWeek(d), endOfWeek(d)];
    },
  },
  {
    label: "Last two weeks",
    key: "last_two_weeks",
    getRange: () => {
      const today = new Date();
      const d = new Date();
      d.setDate(d.getDate() - 14);
      return [startOfWeek(d), endOfWeek(today)];
    },
  },
  {
    label: "This month",
    key: "this_month",
    getRange: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return [start, end];
    },
  },
  {
    label: "Last month",
    key: "last_month",
    getRange: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return [start, end];
    },
  },
  {
    label: "Last 30 days",
    key: "last_30_days",
    getRange: () => {
      const today = new Date();
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return [d, today];
    },
  },
  {
    label: "Last 90 days",
    key: "last_90_days",
    getRange: () => {
      const today = new Date();
      const d = new Date();
      d.setDate(d.getDate() - 90);
      return [d, today];
    },
  },
  {
    label: "Last 12 months",
    key: "last_12_months",
    getRange: () => {
      const today = new Date();
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      return [d, today];
    },
  },
];

export { monthNames, dayNames };
