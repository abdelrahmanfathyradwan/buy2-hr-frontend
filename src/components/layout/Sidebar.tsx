"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { navItems } from "@/config/navigation";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo Area */}
      <div className={styles.logoArea}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <span className={styles.logoIconText}>B2</span>
          </div>
          <span className={styles.logoText}>Buy2</span>
        </div>
      </div>

      {/* Navigation Area */}
      <div className={styles.navArea}>
        <nav className={styles.navList}>
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.75}
                    className={styles.navIcon}
                  />
                  <span>{item.label}</span>
                </Link>
                {item.isGroupEnd && index !== navItems.length - 1 && (
                  <div className={styles.navGroupSpacer} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Spacer to push Logout to bottom */}
        <div className={styles.spacer} />

        {/* Logout */}
        <div className={styles.logoutContainer}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} strokeWidth={1.75} className={styles.navIcon} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

