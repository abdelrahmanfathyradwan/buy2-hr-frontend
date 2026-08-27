"use client";

import Link from "next/link";
import styles from "./RecognitionsCard.module.css";

interface Recognition {
  badge: string;
  name: string;
  points: string;
  date: string;
}

const recognitions: Recognition[] = [
  {
    badge: "Mr. Punctuality",
    name: "Darrell Steward",
    points: "+20",
    date: "Tue 27 Aug 2024",
  },
  {
    badge: "Mr. Punctuality",
    name: "Darrell Steward",
    points: "+20",
    date: "Tue 27 Aug 2024",
  },
];

export function RecognitionsCard() {
  return (
    <div className={styles.card} id="recognitions-widget">
      <div className={styles.header}>
        <h3 className={styles.title}>Recognitions</h3>
        <Link href="/recognitions" className={styles.viewAll}>View All</Link>
      </div>

      <div className={styles.list}>
        {recognitions.map((rec, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.badgeIcon}>
              <div className={styles.ribbonShape}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="13" r="10" fill="#f59e0b" opacity="0.2"/>
                  <circle cx="16" cy="13" r="6" fill="#f59e0b"/>
                  <path d="M12 22l4-3 4 3v6l-4-2-4 2v-6z" fill="#f59e0b" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.badgeName}>{rec.badge}</span>
              <div className={styles.personRow}>
                <div className={styles.personAvatar}>
                  <span>DS</span>
                </div>
                <span className={styles.personName}>{rec.name}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.points}>⭐ {rec.points}</span>
                <span className={styles.date}>{rec.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
