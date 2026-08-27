"use client";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./UpcomingMeetings.module.css";

interface Meeting {
  day: string;
  month: string;
  title: string;
  time: string;
  attendees: number;
  daysLeft: string;
}

const meetings: Meeting[] = [
  {
    day: "12",
    month: "Nov",
    title: "Design review",
    time: "10:00 AM - 11:00 AM",
    attendees: 20,
    daysLeft: "3 days left",
  },
  {
    day: "12",
    month: "Nov",
    title: "Design review",
    time: "10:00 AM - 11:00 AM",
    attendees: 20,
    daysLeft: "3 days left",
  },
];

export function UpcomingMeetings() {
  return (
    <div className={styles.card} id="meetings-widget">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Upcoming meetings</h3>
        </div>
        <button className={styles.createBtn}>
          <Plus size={14} />
          <span>Create Meeting</span>
        </button>
      </div>

      <div className={styles.carouselWrapper}>
        <button className={styles.navBtn} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
        
        <div className={styles.cardsRow}>
          {meetings.map((meeting, i) => (
            <div className={styles.meetingCard} key={i}>
              <div className={styles.dateBadge}>
                <span className={styles.dateDay}>{meeting.day}</span>
                <span className={styles.dateMonth}>{meeting.month}</span>
              </div>
              <div className={styles.meetingInfo}>
                <h4 className={styles.meetingTitle}>{meeting.title}</h4>
                <p className={styles.meetingTime}>{meeting.time}</p>
                <div className={styles.meetingMeta}>
                  <div className={styles.avatarGroup}>
                    <div className={styles.miniAvatar} style={{ backgroundColor: "#a78bfa" }} />
                    <div className={styles.miniAvatar} style={{ backgroundColor: "#fb923c", marginLeft: "-6px" }} />
                    <div className={styles.miniAvatar} style={{ backgroundColor: "#60a5fa", marginLeft: "-6px" }} />
                    <span className={styles.avatarCount}>+{meeting.attendees} attending</span>
                  </div>
                  <span className={styles.daysLeft}>{meeting.daysLeft}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.navBtn} aria-label="Next">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
