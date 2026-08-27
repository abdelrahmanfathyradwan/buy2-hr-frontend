"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import styles from "./ProfilePage.module.css";
import { ProfileModals, ModalType } from "./ProfileModals";
import Link from "next/link";
import { useTasks } from "@/features/tasks/TasksContext";
import { generateAttendanceRecords } from "@/features/attendance/attendanceData";

export const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { tasks } = useTasks();
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // 1. Calculate Real Task Productivity Metrics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const overdue = tasks.filter((t) => t.status === "overdue").length;

    const taskCompletionRate = total > 0 ? Math.round((completed / total) * 100) : 56;
    const deadlineCompliance = completed + overdue > 0 ? Math.round((completed / (completed + overdue)) * 100) : 78;

    // Calculate Average Tasks Delay (in days)
    const overdueTasks = tasks.filter((t) => t.status === "overdue");
    let avgDelayDays = 2; // Default realistic fallback
    if (overdueTasks.length > 0) {
      const today = new Date();
      const totalDelay = overdueTasks.reduce((sum, t) => {
        const parts = t.deadline.split("/");
        if (parts.length === 3) {
          const deadlineDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          const diffTime = Math.abs(today.getTime() - deadlineDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }
        return sum + 5;
      }, 0);
      avgDelayDays = Math.round(totalDelay / overdueTasks.length);
    }

    return {
      taskCompletionRate,
      deadlineCompliance,
      avgDelayDays,
    };
  }, [tasks]);

  // 2. Calculate Real Attendance Metrics
  const attendanceStats = useMemo(() => {
    // Generate records for the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const today = new Date();
    const records = generateAttendanceRecords(startOfMonth, today);

    const activeWorkDays = records.filter(
      (r) => r.status !== "weekend" && r.status !== "holiday"
    );
    const completedOrPartial = activeWorkDays.filter(
      (r) => r.status === "completed" || r.status === "partial"
    );

    const attendanceRate = activeWorkDays.length > 0
      ? Math.round((completedOrPartial.length / activeWorkDays.length) * 100)
      : 85;

    const recordedHours = Math.round(
      records.reduce((sum, r) => sum + r.totalWorkMinutes, 0) / 60
    );

    // Calculate Average Lateness (check-in after 9:00 AM)
    const checkInRecords = completedOrPartial.filter((r) => r.checkIn);
    let totalLateness = 0;
    let lateCount = 0;
    checkInRecords.forEach((r) => {
      const parts = r.checkIn!.split(":");
      const min = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      const targetMin = 9 * 60; // 9:00 AM
      if (min > targetMin) {
        totalLateness += min - targetMin;
        lateCount++;
      }
    });
    const avgLateness = lateCount > 0 ? Math.round(totalLateness / lateCount) : 15; // default fallback 15 mins
    const punctualityScore = Math.max(40, 100 - avgLateness);

    return {
      attendanceRate,
      recordedHours,
      avgLateness,
      punctualityScore,
    };
  }, []);

  // 3. Calculate Performance Metrics
  const performanceStats = useMemo(() => {
    // 5 Metrics for the gauge slices
    const m1 = attendanceStats.attendanceRate; // Attendance Rate
    const m2 = taskStats.taskCompletionRate;   // Task Completion Rate
    const m3 = taskStats.deadlineCompliance;   // Deadline Compliance
    const m4 = attendanceStats.punctualityScore; // Punctuality Score
    const m5 = Math.round((attendanceStats.attendanceRate + taskStats.taskCompletionRate) / 2); // General Productivity

    const performanceScore = Math.round((m1 + m2 + m3 + m4 + m5) / 5);

    // Dynamic SVG Pie Slice generation
    const total = m1 + m2 + m3 + m4 + m5;
    const p1 = Math.max(5, Math.round((m1 / total) * 100));
    const p2 = Math.max(5, Math.round((m2 / total) * 100));
    const p3 = Math.max(5, Math.round((m3 / total) * 100));
    const p4 = Math.max(5, Math.round((m4 / total) * 100));
    const p5 = 100 - (p1 + p2 + p3 + p4); // ensure it sums up to exactly 100

    // Slice configurations with 1% spacing gap
    const s1 = p1 - 1;
    const s2 = p2 - 1;
    const s3 = p3 - 1;
    const s4 = p4 - 1;
    const s5 = p5 - 1;

    const offset1 = 0;
    const offset2 = 100 - p1;
    const offset3 = offset2 - p2;
    const offset4 = offset3 - p3;
    const offset5 = offset4 - p4;

    return {
      m1, m2, m3, m4, m5,
      performanceScore,
      slices: {
        s1, s2, s3, s4, s5,
        offset1, offset2, offset3, offset4, offset5,
      },
    };
  }, [attendanceStats, taskStats]);

  // Mock data matching Figma design
  const user = {
    name: "Mohamed Ahmed",
    role: "Flutter developer",
    phone: "(+965) 099943232555",
    email: "mohamedahmed@grandtech.io",
    points: 2580,
  };

  const rewards = [
    {
      name: "Waffarha",
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ color: '#F36F21', fontWeight: 900, fontSize: '13px' }}>%</span>
          <span style={{ color: '#F36F21', fontWeight: 700, fontSize: '12px', letterSpacing: '-0.3px', marginTop: '1px' }}>waffarha</span>
        </div>
      ),
    },
    {
      name: "Amazon",
      logo: (
        <div style={{ background: '#333333', borderRadius: '6px', width: '48px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, marginTop: '-6px' }}>a</span>
          <svg style={{ position: 'absolute', bottom: '6px' }} width="20" height="8" viewBox="0 0 20 8">
            <path d="M2,3 Q10,10 18,3" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18,3 L15,1 L16,6 Z" fill="#FF9900" />
          </svg>
        </div>
      ),
    },
    {
      name: "Spotify",
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1DB954" />
            <path d="M17.5,16.5 C17,16.5 13.5,15 8,16 C7.5,16 7,15.5 7,15 C7,14.5 7.5,14 8,14 C14,13 18,14.5 18.5,15 C19,15.5 18.5,16.5 17.5,16.5 Z M18,13.5 C17.5,13.5 13.5,11.5 7.5,13 C7,13 6.5,12.5 6.5,12 C6.5,11.5 7,11 7.5,11 C14.5,9.5 19,11.5 19.5,12 C20,12.5 19.5,13.5 18,13.5 Z M19,10 C18.5,10 13.5,7.5 7,9.5 C6.5,9.5 6,9 6,8.5 C6,8 6.5,7.5 7,7.5 C14.5,5.5 20,8 20.5,8.5 C21,9 20.5,10 19,10 Z" fill="#fff" />
          </svg>
          <span style={{ color: '#1DB954', fontWeight: 700, fontSize: '11px', letterSpacing: '-0.3px', marginTop: '1px' }}>Spotify</span>
        </div>
      ),
    },
    {
      name: "Netflix",
      logo: (
        <span style={{ color: '#E50914', fontWeight: 900, fontFamily: 'Arial Black, Impact, sans-serif', fontSize: '13px', letterSpacing: '-0.2px', transform: 'scaleY(1.2)', display: 'inline-block' }}>
          NETFLIX
        </span>
      ),
    },
    {
      name: "Waffarha2",
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ color: '#F36F21', fontWeight: 900, fontSize: '13px' }}>%</span>
          <span style={{ color: '#F36F21', fontWeight: 700, fontSize: '12px', letterSpacing: '-0.3px', marginTop: '1px' }}>waffarha</span>
        </div>
      ),
    },
    {
      name: "Amazon2",
      logo: (
        <div style={{ background: '#333333', borderRadius: '6px', width: '48px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, marginTop: '-6px' }}>a</span>
          <svg style={{ position: 'absolute', bottom: '6px' }} width="20" height="8" viewBox="0 0 20 8">
            <path d="M2,3 Q10,10 18,3" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18,3 L15,1 L16,6 Z" fill="#FF9900" />
          </svg>
        </div>
      ),
    },
    {
      name: "Spotify2",
      logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1DB954" />
            <path d="M17.5,16.5 C17,16.5 13.5,15 8,16 C7.5,16 7,15.5 7,15 C7,14.5 7.5,14 8,14 C14,13 18,14.5 18.5,15 C19,15.5 18.5,16.5 17.5,16.5 Z M18,13.5 C17.5,13.5 13.5,11.5 7.5,13 C7,13 6.5,12.5 6.5,12 C6.5,11.5 7,11 7.5,11 C14.5,9.5 19,11.5 19.5,12 C20,12.5 19.5,13.5 18,13.5 Z M19,10 C18.5,10 13.5,7.5 7,9.5 C6.5,9.5 6,9 6,8.5 C6,8 6.5,7.5 7,7.5 C14.5,5.5 20,8 20.5,8.5 C21,9 20.5,10 19,10 Z" fill="#fff" />
          </svg>
          <span style={{ color: '#1DB954', fontWeight: 700, fontSize: '11px', letterSpacing: '-0.3px', marginTop: '1px' }}>Spotify</span>
        </div>
      ),
    },
    {
      name: "Netflix2",
      logo: (
        <span style={{ color: '#E50914', fontWeight: 900, fontFamily: 'Arial Black, Impact, sans-serif', fontSize: '13px', letterSpacing: '-0.2px', transform: 'scaleY(1.2)', display: 'inline-block' }}>
          NETFLIX
        </span>
      ),
    }
  ];

  return (
    <div className={styles.profileContainer}>
      {/* 1. Header Info Card */}
      <div className={styles.infoCard}>
        <div className={styles.avatarLarge} style={{ overflow: "hidden" }}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="User Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "MA"
          )}
        </div>
        <div className={styles.userCardDetails}>
          <div className={styles.nameRow}>
            <h2 className={styles.userNameLarge}>{user.name}</h2>
            <span
              className={styles.fullInfoBadge}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveModal("more-details")}
            >
              Full info
            </span>
          </div>
          <div className={styles.userMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Role</span>
              <span className={styles.metaValue}>{user.role}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Phone number</span>
              <span className={styles.metaValue}>{user.phone}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Email address</span>
              <span className={styles.metaValue}>{user.email}</span>
            </div>
          </div>
        </div>
        <div
          className={styles.pointsCard}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/points-history")}
        >
          <span className={styles.pointsIcon}>
            <Award size={24} />
          </span>
          <div className={styles.pointsInfo}>
            <span className={styles.pointsLabel}>Total Points</span>
            <span className={styles.pointsValue}>{user.points}</span>
          </div>
        </div>
      </div>

      {/* 2. Rewards Section */}
      <div className={styles.rewardsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Rewards</h3>
            <span className={styles.sectionSubtitle}>Purchase these rewards at the store</span>
          </div>
          <Link href={"/rewards"}><span className={styles.viewAllLink}>View all</span></Link>
        </div>
        <div className={styles.rewardsLogoRow}>
          {rewards.map((r, i) => (
            <div key={i} className={styles.rewardLogoWrapper}>
              <span style={{ fontWeight: 800, fontSize: "11px" }}>
                {r.logo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Dashboard Widgets Grid */}
      <div className={styles.mainGrid}>
        {/* Performance Card */}
        <div className={styles.dashboardWidget}>
          <h3 className={styles.sectionTitle}>Performance</h3>
          <span className={styles.sectionSubtitle} style={{ marginTop: "-8px" }}>Your monthly analyzed performance</span>
          <div className={styles.performanceChartArea}>
            <div className={styles.donutWrapper}>
              {/* Exact SVG Pie Chart matching image */}
              <svg width="180" height="180" viewBox="0 0 63.662 63.662" className={styles.donutSvg}>
                {/* Magenta (Metric 3) */}
                <circle cx="31.831" cy="31.831" r="15.9155" fill="transparent" stroke="#CA2D83" strokeWidth="31.831"
                  strokeDasharray={`${performanceStats.slices.s3} ${100 - performanceStats.slices.s3}`} strokeDashoffset={performanceStats.slices.offset3} />
                  
                {/* Red (Metric 2) */}
                <circle cx="31.831" cy="31.831" r="15.9155" fill="transparent" stroke="#F62B00" strokeWidth="31.831"
                  strokeDasharray={`${performanceStats.slices.s2} ${100 - performanceStats.slices.s2}`} strokeDashoffset={performanceStats.slices.offset2} />
                  
                {/* Orange (Metric 1) */}
                <circle cx="31.831" cy="31.831" r="15.9155" fill="transparent" stroke="#F26222" strokeWidth="31.831"
                  strokeDasharray={`${performanceStats.slices.s1} ${100 - performanceStats.slices.s1}`} strokeDashoffset={performanceStats.slices.offset1} />
                  
                {/* Light Orange (Metric 4) */}
                <circle cx="31.831" cy="31.831" r="15.9155" fill="transparent" stroke="#F8961E" strokeWidth="31.831"
                  strokeDasharray={`${performanceStats.slices.s4} ${100 - performanceStats.slices.s4}`} strokeDashoffset={performanceStats.slices.offset4} />
                  
                {/* Yellow (Metric 5) */}
                <circle cx="31.831" cy="31.831" r="15.9155" fill="transparent" stroke="#FFCB05" strokeWidth="31.831"
                  strokeDasharray={`${performanceStats.slices.s5} ${100 - performanceStats.slices.s5}`} strokeDashoffset={performanceStats.slices.offset5} />
              </svg>
            </div>
            <div className={styles.chartLegendGrid}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#F26222" }} />
                <span className={styles.legendDotLabel}>Metric 1</span>
                <span className={styles.legendValue}>{performanceStats.m1}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#F62B00" }} />
                <span className={styles.legendDotLabel}>Metric 2</span>
                <span className={styles.legendValue}>{performanceStats.m2}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#CA2D83" }} />
                <span className={styles.legendDotLabel}>Metric 3</span>
                <span className={styles.legendValue}>{performanceStats.m3}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#F8961E" }} />
                <span className={styles.legendDotLabel}>Metric 4</span>
                <span className={styles.legendValue}>{performanceStats.m4}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#FFCB05" }} />
                <span className={styles.legendDotLabel}>Metric 5</span>
                <span className={styles.legendValue}>{performanceStats.m5}</span>
              </div>
            </div>
          </div>
          <div className={styles.performanceScoreRow}>
            <div className={styles.scoreMeta}>
              <span className={styles.scoreLabel}>Performance Score</span>
              <span className={styles.scoreValue} style={{ color: performanceStats.performanceScore >= 80 ? "#22c55e" : performanceStats.performanceScore >= 60 ? "#eab308" : "#ef4444" }}>
                {performanceStats.performanceScore}
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBarFill} style={{ width: `${performanceStats.performanceScore}%`, backgroundColor: performanceStats.performanceScore >= 80 ? "#22c55e" : performanceStats.performanceScore >= 60 ? "#eab308" : "#ef4444" }}>
                <div className={styles.progressBarPin} style={{ backgroundColor: performanceStats.performanceScore >= 80 ? "#22c55e" : performanceStats.performanceScore >= 60 ? "#eab308" : "#ef4444" }} />
              </div>
            </div>
            <div className={styles.scoreMarkers}>
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
            <div className={styles.scoreBadgeContainer}>
              <span className={styles.performanceGoodBadge} style={{
                backgroundColor: performanceStats.performanceScore >= 80 ? "#dcfce7" : performanceStats.performanceScore >= 60 ? "#fef9c3" : "#fee2e2",
                color: performanceStats.performanceScore >= 80 ? "#16a34a" : performanceStats.performanceScore >= 60 ? "#ca8a04" : "#ef4444"
              }}>
                {performanceStats.performanceScore >= 80 ? "Good Performance" : performanceStats.performanceScore >= 60 ? "Average Performance" : "Needs Improvement"}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Attendance & Productivity widgets stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Attendance Widget */}
          <div className={styles.dashboardWidget}>
            <div className={styles.timeframeHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Attendance</h3>
                <span className={styles.sectionSubtitle}>Attendance history analyzed during the month</span>
              </div>
              <div className={styles.timeframeTabs}>
                <span className={`${styles.timeframeTab} ${styles.timeframeTabActive}`}>All time</span>
                <span className={styles.timeframeTab}>30 days</span>
                <span className={styles.timeframeTab}>90 days</span>
              </div>
            </div>
            <div className={styles.statRowSplit}>
              <div className={styles.statProgressCol}>
                <div className={styles.statProgressItem}>
                  <div className={styles.progressLabelRow}>
                    <span className={styles.progressLabel}>Attendance Rate</span>
                    <span className={styles.progressValueText}>{attendanceStats.attendanceRate}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressBarInner} style={{ width: `${attendanceStats.attendanceRate}%`, backgroundColor: "#22c55e" }} />
                  </div>
                </div>
                <div className={styles.statProgressItem}>
                  <div className={styles.progressLabelRow}>
                    <span className={styles.progressLabel}>Punctuality Score</span>
                    <span className={styles.progressValueText}>{attendanceStats.punctualityScore}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressBarInner} style={{ width: `${attendanceStats.punctualityScore}%`, backgroundColor: "#f97316" }} />
                  </div>
                </div>
              </div>
              <div className={styles.statNumberCol}>
                <div className={styles.numberStatItem}>
                  <span className={styles.numberStatLabel}>Recorded Hours</span>
                  <span className={styles.numberStatValue}>{attendanceStats.recordedHours}</span>
                </div>
                <div className={styles.numberStatItem}>
                  <span className={styles.numberStatLabel}>Average Lateness</span>
                  <span className={styles.numberStatValue}>{attendanceStats.avgLateness}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Productivity Widget */}
          <div className={styles.dashboardWidget}>
            <div className={styles.timeframeHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Task Productivity</h3>
                <span className={styles.sectionSubtitle}>Task productivity analyzed during the month</span>
              </div>
              <div className={styles.timeframeTabs}>
                <span className={`${styles.timeframeTab} ${styles.timeframeTabActive}`}>All time</span>
                <span className={styles.timeframeTab}>30 days</span>
                <span className={styles.timeframeTab}>90 days</span>
              </div>
            </div>
            <div className={styles.statRowSplit}>
              <div className={styles.statProgressCol}>
                <div className={styles.statProgressItem}>
                  <div className={styles.progressLabelRow}>
                    <span className={styles.progressLabel}>Deadline compliance</span>
                    <span className={styles.progressValueText}>{taskStats.deadlineCompliance}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressBarInner} style={{ width: `${taskStats.deadlineCompliance}%`, backgroundColor: "#ef4444" }} />
                  </div>
                </div>
                <div className={styles.statProgressItem}>
                  <div className={styles.progressLabelRow}>
                    <span className={styles.progressLabel}>Task Completion Rate</span>
                    <span className={styles.progressValueText}>{taskStats.taskCompletionRate}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressBarInner} style={{ width: `${taskStats.taskCompletionRate}%`, backgroundColor: "#22c55e" }} />
                  </div>
                </div>
              </div>
              <div className={styles.statNumberCol}>
                <div className={styles.numberStatItem}>
                  <span className={styles.numberStatLabel}>Average Tasks Delay (in days)</span>
                  <span className={styles.numberStatValue}>{taskStats.avgDelayDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Full Info / Upload Photo / Confirmation */}
      <ProfileModals
        activeModal={activeModal}
        onClose={() => setActiveModal("none")}
        onOpenModal={(modal) => setActiveModal(modal)}
        currentPhoto={profilePhoto}
        onUpdatePhoto={(newPhoto) => setProfilePhoto(newPhoto)}
      />
    </div>
  );
};
