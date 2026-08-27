import { useState } from "react";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import styles from "./NewsComments.module.css";

interface CommentProps {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  timeAgo: string;
  likes: string;
  replies: string;
}

const MOCK_COMMENTS: CommentProps[] = [
  {
    id: "1",
    author: "Ahmed Mahmoud",
    content: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    timeAgo: "3m ago",
    likes: "7.5M",
    replies: "1 Reply"
  },
  {
    id: "2",
    author: "Ahmed Mahmoud",
    content: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    timeAgo: "3m ago",
    likes: "7.5M",
    replies: "1 Reply"
  },
  {
    id: "3",
    author: "Ahmed Mahmoud",
    content: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    timeAgo: "3m ago",
    likes: "7.5M",
    replies: "1 Reply"
  },
  {
    id: "4",
    author: "Ahmed Mahmoud",
    content: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    timeAgo: "3m ago",
    likes: "7.5M",
    replies: "1 Reply"
  }
];

export function NewsComments() {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // Add comment logic here
    setCommentText("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.commentsList}>
        {MOCK_COMMENTS.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.avatar}>
              {comment.avatarUrl ? (
                <img src={comment.avatarUrl} alt={comment.author} />
              ) : (
                <div className={styles.avatarPlaceholder} />
              )}
            </div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.author}>{comment.author}</span>
                <span className={styles.timeAgo}>{comment.timeAgo}</span>
              </div>
              <p className={styles.text}>{comment.content}</p>
              <div className={styles.commentActions}>
                <button className={styles.actionButton}>
                  <ThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
                <button className={styles.actionButton}>
                  <MessageCircle size={14} />
                  <span>{comment.replies}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.addCommentForm}>
        <input
          type="text"
          placeholder="Add comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
