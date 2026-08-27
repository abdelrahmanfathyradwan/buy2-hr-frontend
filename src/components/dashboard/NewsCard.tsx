"use client";

import Link from "next/link";
import styles from "./NewsCard.module.css";

interface NewsItem {
  title: string;
  date: string;
  excerpt: string;
}

const news: NewsItem[] = [
  {
    title: "How to Write a Business Plan",
    date: "Added June 27, 2023 | 12:00 PM",
    excerpt:
      "The executive summary provides a snapshot of your business and its plans. This section should include your business's name, location, products or services, mission statement, and the purpose of the plan. It should be concise yet compelling enough t...",
  },
  {
    title: "How to Write a Business Plan",
    date: "Added Jul 01, 2023 | 10:01 PM",
    excerpt:
      "The executive summary provides a snapshot of your business...",
  },
];

export function NewsCard() {
  return (
    <div className={styles.card} id="news-widget">
      <div className={styles.header}>
        <h3 className={styles.title}>News</h3>
        <Link href="/news" className={styles.viewAll}>View All</Link>
      </div>

      <div className={styles.list}>
        {news.map((item, i) => (
          <div className={styles.item} key={i}>
            <h4 className={styles.newsTitle}>{item.title}</h4>
            <p className={styles.newsDate}>{item.date}</p>
            <p className={styles.newsExcerpt}>{item.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
