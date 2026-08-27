import Link from "next/link";
import styles from "./NewsListItem.module.css";
import { Image as ImageIcon } from "lucide-react";

export interface NewsItemProps {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
}

export function NewsListItem({ id, title, date, excerpt, imageUrl }: NewsItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imagePlaceholder}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className={styles.image} />
        ) : (
          <ImageIcon className={styles.icon} size={32} />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Link href={`/news/${id}`} className={styles.viewDetails}>
            View details
          </Link>
        </div>
        <p className={styles.date}>{date}</p>
        <p className={styles.excerpt}>{excerpt}</p>
      </div>
    </div>
  );
}
