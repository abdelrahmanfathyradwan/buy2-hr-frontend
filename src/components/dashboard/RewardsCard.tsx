"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, X } from "lucide-react";
import styles from "./RewardsCard.module.css";

interface DashboardReward {
  id: string;
  brand: string;
  discount: string;
  pointsText: string;
  isActive: boolean;
  color: string;
}

const DASHBOARD_REWARDS: DashboardReward[] = [
  {
    id: "1",
    brand: "NOON",
    discount: "50% off",
    pointsText: "Redeem now for 200 points",
    isActive: true,
    color: "#ffd600", // Bright yellow
  },
  {
    id: "2",
    brand: "NOON",
    discount: "50% off",
    pointsText: "200 POINTS TO REDEEM",
    isActive: false,
    color: "#ffd600",
  },
  {
    id: "3",
    brand: "NOON",
    discount: "50% off",
    pointsText: "200 POINTS TO REDEEM",
    isActive: false,
    color: "#ffd600",
  },
];

export function RewardsCard() {
  const [selectedReward, setSelectedReward] = useState<DashboardReward | null>(null);
  const [redeemState, setRedeemState] = useState<"confirm" | "success">("confirm");
  const [copied, setCopied] = useState(false);
  const voucherCode = "CODE50Noon123";

  const handleRedeemClick = (reward: DashboardReward) => {
    if (!reward.isActive) return;
    setSelectedReward(reward);
    setRedeemState("confirm");
  };

  const handleConfirmRedeem = () => {
    setRedeemState("success");
  };

  const handleClose = () => {
    setSelectedReward(null);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card} id="rewards-widget">
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Rewards</h3>
          <p className={styles.subtitle}>Recently what you have received as reward</p>
        </div>
        <Link href="/rewards" className={styles.viewAll}>
          View All
        </Link>
      </div>

      <div className={styles.list}>
        {DASHBOARD_REWARDS.map((reward) => (
          <div className={styles.item} key={reward.id}>
            <div 
              className={styles.brandBox} 
              style={{ backgroundColor: reward.color }}
            >
              <span className={styles.noonText}>noon</span>
            </div>
            
            <div className={styles.info}>
              <span className={styles.brandName}>{reward.brand}</span>
              <span className={styles.discount}>{reward.discount}</span>
              <span className={styles.pointsText}>{reward.pointsText}</span>
            </div>

            <button
              onClick={() => handleRedeemClick(reward)}
              className={`${styles.redeemBtn} ${reward.isActive ? styles.active : styles.disabled}`}
              disabled={!reward.isActive}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>

      {/* Redeem Modal Popup */}
      {selectedReward && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>Redeem voucher</h4>
              <button className={styles.closeBtn} onClick={handleClose}>
                <X size={20} />
              </button>
            </div>
            
            <p className={styles.modalSubtitle}>
              {redeemState === "confirm" 
                ? "Congratulations, you can now redeem your voucher and use it to get discounts."
                : "Congratulations, you have successfully redeemed your voucher!"}
            </p>

            <div className={styles.modalVoucher}>
              <div 
                className={styles.modalBrandBox} 
                style={{ backgroundColor: selectedReward.color }}
              >
                <span className={styles.noonText}>noon</span>
              </div>
              <div className={styles.modalVoucherInfo}>
                <span className={styles.modalBrandName}>{selectedReward.brand}</span>
                <span className={styles.modalDiscount}>{selectedReward.discount}</span>
                <span className={styles.modalPointsText}>200 POINTS TO REDEEM</span>
              </div>
            </div>

            {redeemState === "confirm" ? (
              <div className={styles.modalActions}>
                <button 
                  onClick={handleConfirmRedeem}
                  className={styles.primaryBtn}
                >
                  Redeem now
                </button>
                <button 
                  onClick={handleClose}
                  className={styles.secondaryBtn}
                >
                  Redeem later
                </button>
              </div>
            ) : (
              <div className={styles.successActions}>
                <div className={styles.codeBoxContainer}>
                  <div className={styles.codeBox}>{voucherCode}</div>
                  <button onClick={handleCopy} className={styles.copyBtn}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <button 
                  onClick={handleClose}
                  className={styles.closePopupBtn}
                >
                  Close popup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
