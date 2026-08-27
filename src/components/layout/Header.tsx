"use client";

import { Bell, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";

const HEADER_NOTIFICATIONS = [
  {
    id: "1",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "2",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "3",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "4",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
  {
    id: "5",
    title: "UI Task less than 5 days",
    body: "Philip, your assignment is less than 5 days away from reaching",
  },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchIconWrapper}>
          <Search size={16} className={styles.searchIcon} />
        </div>
        <input
          id="header-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      {/* Right Section */}
      <div className={styles.rightSection} ref={dropdownRef}>
        {/* Notification Bell */}
        <button 
          className={styles.notificationBtn} 
          aria-label="Notifications" 
          id="notifications-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} strokeWidth={1.75} />
          <span className={styles.notificationBadge} />
        </button>

        {/* Dropdown Panel */}
        {showNotifications && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownList}>
              {HEADER_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} onClick={() => setShowNotifications(false)}>
                  <NotificationItem {...notif} />
                </div>
              ))}
            </div>
            <Link 
              href="/notifications" 
              className={styles.viewMore}
              onClick={() => setShowNotifications(false)}
            >
              View more notifications
            </Link>
          </div>
        )}

        {/* User Profile */}
        <Link href="/profile" className={styles.userInfoContainer}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>MA</span>
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Mohamed Ahmed</span>
            <span className={styles.userRole}>Flutter Developer</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
