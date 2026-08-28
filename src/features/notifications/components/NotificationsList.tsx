"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NotificationItem, NotificationItemProps } from "./NotificationItem";
import styles from "./NotificationsList.module.css";

export const MOCK_NOTIFICATIONS: NotificationItemProps[] = [
  {
    id: "1",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "2",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "3",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "4",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "5",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "6",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "7",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "8",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "9",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "10",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
];

export function NotificationsList() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className={styles.title}>Notifications</h1>
      </div>

      <div className={styles.list}>
        {MOCK_NOTIFICATIONS.map((notif) => (
          <NotificationItem key={notif.id} {...notif} />
        ))}
      </div>
    </div>
  );
}
