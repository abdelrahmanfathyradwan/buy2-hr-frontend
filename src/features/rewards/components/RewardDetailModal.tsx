import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import styles from "./RewardDetailModal.module.css";
import { RewardCardProps } from "./RewardCard";

interface RewardDetailModalProps {
  reward: RewardCardProps;
  onClose: () => void;
}

type TabType = "description" | "how_to_redeem" | "terms_of_use";

export function RewardDetailModal({ reward, onClose }: RewardDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [copied, setCopied] = useState(false);
  const voucherCode = "235726";

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Reward overview</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div 
            className={styles.brandHero}
            style={{ backgroundColor: reward.color }}
          >
            <span className={styles.logoText}>{reward.brand.toLowerCase()}</span>
          </div>

          <h4 className={styles.rewardTitle}>{reward.title}</h4>

          {/* Tab Headers */}
          <div className={styles.tabHeaders}>
            <button 
              className={`${styles.tabBtn} ${activeTab === "description" ? styles.active : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === "how_to_redeem" ? styles.active : ""}`}
              onClick={() => setActiveTab("how_to_redeem")}
            >
              How to redeem
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === "terms_of_use" ? styles.active : ""}`}
              onClick={() => setActiveTab("terms_of_use")}
            >
              Terms of use
            </button>
          </div>

          {/* Tab Contents */}
          <div className={styles.tabContent}>
            {activeTab === "description" && (
              <p className={styles.paragraph}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            )}

            {activeTab === "how_to_redeem" && (
              <ol className={styles.orderedList}>
                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                <li>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</li>
                <li>when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</li>
                <li>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</li>
                <li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li>
              </ol>
            )}

            {activeTab === "terms_of_use" && (
              <p className={styles.paragraph}>
                This voucher is valid for single use only. It cannot be combined with other offers or promotions. Points spent on this voucher are non-refundable. Please make sure to use it before the expiration date.
              </p>
            )}
          </div>
        </div>

        {/* Sticky Drawer Footer with Voucher Code */}
        <div className={styles.footer}>
          <div className={styles.codeBoxContainer}>
            <div className={styles.codeText}>{voucherCode}</div>
            <button onClick={handleCopy} className={styles.copyBtn}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
