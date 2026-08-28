import { ExternalLink } from "lucide-react";
import styles from "./RewardCard.module.css";

export interface RewardCardProps {
  id: string;
  brand: string;
  title: string;
  pointsText: string;
  color: string;
  onClick?: () => void;
}

export function RewardCard({ brand, title, pointsText, color, onClick }: RewardCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div 
        className={styles.brandSection} 
        style={{ backgroundColor: color }}
      >
        <span className={styles.logoText}>{brand.toLowerCase()}</span>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.detailsSection}>
        <div className={styles.header}>
          <span className={styles.brandName}>{brand}</span>
          <ExternalLink size={16} className={styles.openIcon} />
        </div>
        <h4 className={styles.title}>{title}</h4>
        <span className={styles.points}>{pointsText}</span>
      </div>
    </div>
  );
}
