import { AttendanceCard } from "@/components/dashboard/AttendanceCard";
import { TasksCard } from "@/components/dashboard/TasksCard";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { RequestsCard } from "@/components/dashboard/RequestsCard";
import { RecognitionsCard } from "@/components/dashboard/RecognitionsCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { RewardsCard } from "@/components/dashboard/RewardsCard";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <h1 className={styles.greetingTitle}>Hello Mohamed 👋</h1>
        <p className={styles.greetingSubtitle}>Good Morning</p>
      </div>

      {/* Main 2-column Grid */}
      <div className={styles.grid}>
        {/* Row 1 */}
        <AttendanceCard />
        <TasksCard />

        {/* Row 2 */}
        <UpcomingMeetings />
        <RequestsCard />

        {/* Row 3 */}
        <RecognitionsCard />
        <div className={styles.newsWrapper}>
          <NewsCard />
        </div>

        {/* Row 4 */}
        <RewardsCard />
      </div>
    </div>
  );
}
