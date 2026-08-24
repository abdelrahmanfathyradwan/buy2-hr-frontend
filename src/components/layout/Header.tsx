"use client";

import { Bell, Search, SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/config/navigation";
import { useState } from "react";
import styles from "./Header.module.css";

// Conceptually defining page-specific configurations
type PageActionConfig = {
  showSearch?: boolean;
  showFilter?: boolean;
  primaryAction?: {
    label: string;
    onClick?: () => void;
  };
};

const pageConfigs: Record<string, PageActionConfig> = {
  "/attendance-profiles": {
    showSearch: true,
    showFilter: true,
    primaryAction: {
      label: "Create New Profile",
    },
  },
  // Add other routes here as they need toolbars
};

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const getActiveTitle = () => {
    if (pathname === "/") return "Dashboard";
    
    const sortedNavItems = [...navItems].sort((a, b) => b.href.length - a.href.length);
    
    const activeItem = sortedNavItems.find(item => 
      item.href !== "/" && pathname.startsWith(item.href)
    );
    
    return activeItem?.label || "Dashboard";
  };

  const title = getActiveTitle();
  
  const currentConfig = pageConfigs[pathname] || {};

  return (
    <div className={styles.headerWrapper}>
      {/* Top Header Row */}
      <header className={styles.topRow}>
        {/* Left Section: Page Title */}
        <div>
          <h1 className={styles.pageTitle}>
            {title}
          </h1>
        </div>

        {/* Right Section: User Controls */}
        <div className={styles.userControls}>
          {/* Notification Button */}
          <button className={styles.notificationBtn} aria-label="Notifications">
            <Bell size={18} strokeWidth={1.75} />
          </button>

          {/* User Avatar & Info */}
          <div className={styles.userInfoContainer}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>MA</span>
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>Mohamed Ahmed</span>
              <span className={styles.userRole}>HR Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Actions Toolbar (Conditionally Rendered) */}
      {(currentConfig.showSearch || currentConfig.showFilter || currentConfig.primaryAction) && (
        <div className={styles.toolbar}>
          
          {/* Search Bar */}
          {currentConfig.showSearch ? (
            <div className={styles.searchContainer}>
              <div className={styles.searchIconWrapper}>
                <Search size={15} className={styles.searchIcon} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>
          ) : <div className={styles.searchPlaceholder} />}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            {/* Filter Button */}
            {currentConfig.showFilter && (
              <button className={styles.filterBtn}>
                <SlidersHorizontal size={14} className={styles.filterIcon} />
                <span>Filter</span>
              </button>
            )}

            {/* Primary Action Button */}
            {currentConfig.primaryAction && (
              <button
                onClick={currentConfig.primaryAction.onClick}
                className={styles.primaryBtn}
              >
                <span>{currentConfig.primaryAction.label}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
