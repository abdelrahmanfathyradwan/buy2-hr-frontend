"use client";

import { NewsListItem } from "./NewsListItem";
import styles from "./NewsList.module.css";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const MOCK_NEWS = [
  {
    id: "1",
    title: "How to Write a Business Plan",
    date: "Added June 27, 2023 | 12:00 PM",
    excerpt: "The executive summary provides a snapshot of your business and its plans. This section should include your business's name, location, products or services, mission statement, and the purpose of the plan. It should be concise yet compelling enough to capture the reader's interest. Aim for clarity and brevity, as this section often determines whether investors will read the rest of the plan...",
  },
  {
    id: "2",
    title: "How to Write a Business Plan",
    date: "Added June 22, 2023 | 12:00 PM",
    excerpt: "The executive summary provides a snapshot of your business and its plans. This section should include your business's name, location, products or services, mission statement, and the purpose of the plan. It should be concise yet compelling enough to capture the reader's interest. Aim for clarity and brevity, as this section often determines whether investors will read the rest of the plan...",
  },
  {
    id: "3",
    title: "How to Write a Business Plan",
    date: "Added June 22, 2023 | 12:00 PM",
    excerpt: "The executive summary provides a snapshot of your business and its plans. This section should include your business's name, location, products or services, mission statement, and the purpose of the plan. It should be concise yet compelling enough to capture the reader's interest. Aim for clarity and brevity, as this section often determines whether investors will read the rest of the plan...",
  },
  {
    id: "4",
    title: "How to Write a Business Plan",
    date: "Added June 22, 2023 | 12:00 PM",
    excerpt: "The executive summary provides a snapshot of your business and its plans. This section should include your business's name, location, products or services, mission statement, and the purpose of the plan. It should be concise yet compelling enough to capture the reader's interest. Aim for clarity and brevity, as this section often determines whether investors will read the rest of the plan...",
  }
];

export function NewsList() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className={styles.title}>News</h1>
      </div>
      <div className={styles.list}>
        {MOCK_NEWS.map((news) => (
          <NewsListItem key={news.id} {...news} />
        ))}
      </div>
    </div>
  );
}
