import { AlertCircle } from "lucide-react";
import styles from "./NotificationItem.module.css";

export interface NotificationItemProps {
  id: string;
  title: string;
  body: string;
  isRead?: boolean;
}

export function NotificationItem({ title, body }: NotificationItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <AlertCircle size={18} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.body}>{body}</p>
      </div>
    </div>
  );
}
