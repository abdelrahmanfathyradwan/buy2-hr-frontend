"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ThumbsUp, Eye, X } from "lucide-react";
import styles from "./NewsDetail.module.css";
import { NewsComments } from "./NewsComments";

interface NewsDetailProps {
  id: string;
}

export function NewsDetail({ id }: NewsDetailProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/news" className={styles.backButton}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 className={styles.title}>The start of the Al-Ahly</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.heroImageContainer}>
          <img 
            src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop" 
            alt="UN Flags" 
            className={styles.heroImage} 
          />
        </div>

        <div className={styles.articleBody}>
          <p>Get inspired by this revived W.H. Auden's Hymn to the United Nations. "Let music for peace Be the paradigm, For peace means to change At the right time, As the World-Clock, Goes Tick and Tock. So may the story Of our human city Presently move...</p>
          <p>Get inspired by this revived W.H. Auden's Hymn to the United Nations. "Let music for peace Be the paradigm, For peace means to change At the right time, As the World-Clock, Goes Tick and Tock. So may the story Of our human city Presently move...</p>
          <p>Get inspired by this revived W.H. Auden's Hymn to the United Nations. "Let music for peace Be the paradigm, For peace means to change At the right time, As the World-Clock, Goes Tick and Tock. So may the story Of our human city Presently move...</p>
          <p>Get inspired by this revived W.H. Auden's Hymn to the United Nations. "Let music for peace Be the paradigm, For peace means to change At the right time, As the World-Clock, Goes Tick and Tock. So may the story Of our human city Presently move...</p>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <button className={styles.statButton}>
            <ThumbsUp size={18} />
            <span>7.5M</span>
          </button>
          <div className={styles.statInfo}>
            <Eye size={18} />
            <span>155.6K</span>
          </div>
        </div>
        
        <button 
          className={styles.toggleComments}
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? (
            <>
              <X size={16} />
              <span>Close Comments</span>
            </>
          ) : (
            <span>Open Comments</span>
          )}
        </button>
      </div>

      {showComments && <NewsComments />}
    </div>
  );
}
