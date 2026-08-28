"use client";

import { Plus } from "lucide-react";
import styles from "./RequestsCard.module.css";

interface RequestItem {
  day: string;
  month: string;
  status: string;
  title: string;
  time: string;
  excerpt: string;
}

const requests: RequestItem[] = [
  {
    day: "12",
    month: "Nov",
    status: "Pending",
    title: "Sick Leave",
    time: "10:00 AM - 11:00 AM",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing...",
  },
  {
    day: "12",
    month: "Nov",
    status: "Pending",
    title: "Sick Leave",
    time: "10:00 AM - 11:00 AM",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing...",
  },
];

export function RequestsCard() {
  return (
    <div className={styles.card} id="requests-widget">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Requests</h3>
          <p className={styles.subtitle}>Your requests and pending requests</p>
        </div>
        <button className={styles.createBtn}>
          <Plus size={14} />
          <span>Create Request</span>
        </button>
      </div>

      <div className={styles.requestsList}>
        {requests.map((req, i) => (
          <div className={styles.requestItem} key={i}>
            <div className={styles.dateBadge}>
              <span className={styles.dateDay}>{req.day}</span>
              <span className={styles.dateMonth}>{req.month}</span>
            </div>
            <div className={styles.requestInfo}>
              <div className={styles.requestTop}>
                <span className={styles.statusBadge}>{req.status}</span>
              </div>
              <h4 className={styles.requestTitle}>{req.title}</h4>
              <p className={styles.requestExcerpt}>{req.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
