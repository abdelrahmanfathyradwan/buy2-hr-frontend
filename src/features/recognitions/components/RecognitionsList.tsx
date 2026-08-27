"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RecognitionCard, RecognitionCardProps } from "./RecognitionCard";
import styles from "./RecognitionsList.module.css";

const MOCK_RECOGNITIONS: RecognitionCardProps[] = [
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
  {
    badge: "Mr. Punctuality",
    name: "Darrell Steward",
    points: "+20",
    date: "Tue 27 Aug 2024",
  },
];

export function RecognitionsList() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className={styles.title}>Recognitions</h1>
      </div>
      <div className={styles.grid}>
        {MOCK_RECOGNITIONS.map((rec, index) => (
          <RecognitionCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
}
