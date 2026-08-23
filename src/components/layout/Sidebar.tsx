"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Image
            src="/buy2logo.png"
            alt="Buy2 Logo"
            width={120}
            height={40}
            priority
            style={{ objectFit: "contain", width: "auto", height: "auto", maxHeight: "40px" }}
          />
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

