import { ThumbsUp } from "lucide-react";
import styles from "./RecognitionCard.module.css";

export interface RecognitionCardProps {
  badge: string;
  name: string;
  points: string;
  date: string;
  avatarUrl?: string;
}

export function RecognitionCard({ badge, name, points, date, avatarUrl }: RecognitionCardProps) {
  // Get initials for avatar placeholder
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.badgeTitle}>{badge}</div>
      
      <div className={styles.avatarSection}>
        <div className={styles.badgeRibbon}>
          <div className={styles.avatarRing}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initials}</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.name}>{name}</div>

      <div className={styles.footer}>
        <div className={styles.points}>
          <ThumbsUp size={16} className={styles.likeIcon} />
          <span>{points}</span>
        </div>
        <div className={styles.date}>{date}</div>
      </div>
    </div>
  );
}
