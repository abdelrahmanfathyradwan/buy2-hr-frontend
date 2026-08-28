import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buy2 - HR Frontend",
  description: "Buy2 Human Resources Dashboard",
  icons: {
    icon: "/buy2logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${styles.appWrapper}`}>
        <Providers>
          <Sidebar />
          <div className={styles.mainWrapper}>
            <Header />
            <main className={styles.contentArea}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

