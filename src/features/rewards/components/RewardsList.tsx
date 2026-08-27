"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RewardCard, RewardCardProps } from "./RewardCard";
import { RewardDetailModal } from "./RewardDetailModal";
import styles from "./RewardsList.module.css";

const MOCK_REWARDS: RewardCardProps[] = [
  {
    id: "1",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea", // Soft talabat orange
  },
  {
    id: "2",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600", // Noon yellow
  },
  {
    id: "3",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea",
  },
  {
    id: "4",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600",
  },
  {
    id: "5",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea",
  },
  {
    id: "6",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600",
  },
  {
    id: "7",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea",
  },
  {
    id: "8",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600",
  },
  {
    id: "9",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea",
  },
  {
    id: "10",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600",
  },
  {
    id: "11",
    brand: "talabat",
    title: "$10 Gift Card",
    pointsText: "Redeem for 200 points",
    color: "#fff0ea",
  },
  {
    id: "12",
    brand: "noon",
    title: "5% Discount",
    pointsText: "Redeem for 200 points",
    color: "#ffd600",
  },
];

export function RewardsList() {
  const [selectedReward, setSelectedReward] = useState<RewardCardProps | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className={styles.title}>Rewards</h1>
      </div>

      <div className={styles.grid}>
        {MOCK_REWARDS.map((reward) => (
          <RewardCard 
            key={reward.id} 
            {...reward} 
            onClick={() => setSelectedReward(reward)}
          />
        ))}
      </div>

      {selectedReward && (
        <RewardDetailModal 
          reward={selectedReward} 
          onClose={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
}
