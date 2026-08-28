"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  MessageSquare,
  ThumbsUp,
  MoreVertical,
  Send,
  ArrowLeft,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import styles from "./TaskComments.module.css";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  likes: string;
  replies?: Comment[];
}

interface TaskCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({ isOpen, onClose, taskId }) => {
  // Mock comments list
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Ahmed Mahmoud",
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
      time: "3m ago",
      likes: "7.9K",
      replies: [
        {
          id: "r1",
          author: "Ahmed Mahmoud",
          text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
          time: "3m ago",
          likes: "7.8K",
        },
        {
          id: "r2",
          author: "Ahmed Mahmoud",
          text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
          time: "3m ago",
          likes: "7.8K",
        },
      ],
    },
    {
      id: "c2",
      author: "Ahmed Mahmoud",
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
      time: "3m ago",
      likes: "7.9K",
    },
    {
      id: "c3",
      author: "Ahmed Mahmoud",
      text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
      time: "3m ago",
      likes: "7.9K",
    },
  ]);

  // View state tracking: "list" | "replies" | "edit"
  const [view, setView] = useState<"list" | "replies" | "edit">("list");
  
  // Selected comment for replies/edit views
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  
  // Text area inputs
  const [newCommentText, setNewCommentText] = useState("");
  const [editText, setEditText] = useState("");
  const [replyText, setReplyText] = useState("");

  // Comment action dropdown popup state
  const [activeDropdownCommentId, setActiveDropdownCommentId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownCommentId(null);
      }
    };
    if (activeDropdownCommentId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdownCommentId]);

  if (!isOpen) return null;

  // Add a new comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Ahmed Mahmoud",
      text: newCommentText,
      time: "Just now",
      likes: "0",
    };
    setComments([...comments, newComment]);
    setNewCommentText("");
  };

  // Add a new reply
  const handleAddReply = () => {
    if (!replyText.trim() || !activeComment) return;
    const newReply: Comment = {
      id: Date.now().toString(),
      author: "Ahmed Mahmoud",
      text: replyText,
      time: "Just now",
      likes: "0",
    };
    const updatedComments = comments.map((c) => {
      if (c.id === activeComment.id) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        };
      }
      return c;
    });
    setComments(updatedComments);
    setActiveComment({
      ...activeComment,
      replies: [...(activeComment.replies || []), newReply],
    });
    setReplyText("");
  };

  // Edit comment flow
  const handleOpenEdit = (comment: Comment) => {
    setActiveComment(comment);
    setEditText(comment.text);
    setView("edit");
    setActiveDropdownCommentId(null);
  };

  const handleUpdateComment = () => {
    if (!activeComment) return;
    const updatedComments = comments.map((c) => {
      if (c.id === activeComment.id) {
        return { ...c, text: editText };
      }
      // If it's a sub reply
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map((r) => (r.id === activeComment.id ? { ...r, text: editText } : r)),
        };
      }
      return c;
    });
    setComments(updatedComments);
    setView("list");
    setActiveComment(null);
  };

  const handleDiscardClick = () => {
    if (activeComment && editText !== activeComment.text) {
      setShowDiscardConfirm(true);
    } else {
      setView("list");
      setActiveComment(null);
    }
  };

  // Delete comment flow
  const handleOpenDelete = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setShowDeleteConfirm(true);
    setActiveDropdownCommentId(null);
  };

  const handleDeleteConfirm = () => {
    if (!commentToDeleteId) return;
    const updatedComments = comments
      .filter((c) => c.id !== commentToDeleteId)
      .map((c) => {
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.filter((r) => r.id !== commentToDeleteId),
          };
        }
        return c;
      });
    setComments(updatedComments);
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    setCommentToDeleteId(null);
  };

  // Switch to replies view
  const handleOpenReplies = (comment: Comment) => {
    setActiveComment(comment);
    setView("replies");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* VIEW 1: Main Comments list */}
        {view === "list" && (
          <>
            {/* Header */}
            <div className={styles.header}>
              <h3 className={styles.headerTitle}>Comments</h3>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentAvatar}>M</div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentMetaRow}>
                      <span className={styles.commentAuthor}>{comment.author}</span>
                      <div className={styles.optionsWrapper}>
                        <button
                          className={styles.moreBtn}
                          onClick={() => setActiveDropdownCommentId(comment.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdownCommentId === comment.id && (
                          <div className={styles.dropdownPopup} ref={dropdownRef}>
                            <button
                              className={styles.dropdownOption}
                              onClick={() => handleOpenEdit(comment)}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              className={`${styles.dropdownOption} ${styles.dropdownOptionDanger}`}
                              onClick={() => handleOpenDelete(comment.id)}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                    <div className={styles.commentActions}>
                      <button className={styles.actionButton}>
                        <ThumbsUp size={12} />
                        <span>{comment.likes}</span>
                      </button>
                      <span className={styles.timeText}>{comment.time}</span>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleOpenReplies(comment)}
                      >
                        Reply
                      </button>
                    </div>

                    {/* View replies shortcut */}
                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        className={styles.viewRepliesBtn}
                        onClick={() => handleOpenReplies(comment)}
                      >
                        View {comment.replies.length} more replies
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Comment Area */}
            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder="Add comment"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className={styles.textInput}
              />
              <button className={styles.sendBtn} onClick={handleAddComment}>
                <Send size={14} />
              </button>
            </div>
          </>
        )}

        {/* VIEW 2: Nested Replies view */}
        {view === "replies" && activeComment && (
          <>
            {/* Header */}
            <div className={styles.header}>
              <button className={styles.backBtn} onClick={() => setView("list")}>
                <ArrowLeft size={16} />
                <span>Back</span>
                <span className={styles.backTitle}>Replies</span>
              </button>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Replies List Container */}
            <div className={styles.commentsList}>
              {/* Parent Comment */}
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}>M</div>
                <div className={styles.commentContent}>
                  <div className={styles.commentMetaRow}>
                    <span className={styles.commentAuthor}>{activeComment.author}</span>
                  </div>
                  <p className={styles.commentText}>{activeComment.text}</p>
                  <div className={styles.commentActions}>
                    <button className={styles.actionButton}>
                      <ThumbsUp size={12} />
                      <span>{activeComment.likes}</span>
                    </button>
                    <span className={styles.timeText}>{activeComment.time}</span>
                  </div>
                </div>
              </div>

              {/* Toggle replies divider */}
              <div className={styles.toggleRepliesDivider}>
                <span>Hide replies</span>
              </div>

              {/* Nested replies list */}
              {activeComment.replies?.map((rep) => (
                <div key={rep.id} className={`${styles.commentItem} ${styles.replyItem}`}>
                  <div className={styles.commentAvatar}>M</div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentMetaRow}>
                      <span className={styles.commentAuthor}>{rep.author}</span>
                      <div className={styles.optionsWrapper}>
                        <button
                          className={styles.moreBtn}
                          onClick={() => setActiveDropdownCommentId(rep.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdownCommentId === rep.id && (
                          <div className={styles.dropdownPopup} ref={dropdownRef}>
                            <button
                              className={styles.dropdownOption}
                              onClick={() => handleOpenEdit(rep)}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              className={`${styles.dropdownOption} ${styles.dropdownOptionDanger}`}
                              onClick={() => handleOpenDelete(rep.id)}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={styles.commentText}>{rep.text}</p>
                    <div className={styles.commentActions}>
                      <button className={styles.actionButton}>
                        <ThumbsUp size={12} />
                        <span>{rep.likes}</span>
                      </button>
                      <span className={styles.timeText}>{rep.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Reply Area */}
            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder={`Reply to ${activeComment.author}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
                className={styles.textInput}
              />
              <button className={styles.sendBtn} onClick={handleAddReply}>
                <Send size={14} />
              </button>
            </div>
          </>
        )}

        {/* VIEW 3: Edit Comment view */}
        {view === "edit" && activeComment && (
          <>
            {/* Header */}
            <div className={styles.header}>
              <h3 className={styles.headerTitle}>Comments</h3>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className={styles.commentsList}>
              {/* Target comment info */}
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}>M</div>
                <div className={styles.commentContent}>
                  <div className={styles.commentMetaRow}>
                    <span className={styles.commentAuthor}>{activeComment.author}</span>
                  </div>
                  <p className={styles.commentText}>{activeComment.text}</p>
                  <div className={styles.commentActions}>
                    <button className={styles.actionButton}>
                      <ThumbsUp size={12} />
                      <span>{activeComment.likes}</span>
                    </button>
                    <span className={styles.timeText}>{activeComment.time}</span>
                    <span className={styles.timeText}>• Editing</span>
                  </div>
                </div>
              </div>

              {/* Text Edit Block */}
              <div className={styles.editFormContainer}>
                <textarea
                  className={styles.editTextarea}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className={styles.editActions}>
                  <button className={styles.discardBtn} onClick={handleDiscardClick}>
                    Discard
                  </button>
                  <button className={styles.updateBtn} onClick={handleUpdateComment}>
                    Update comment
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CONFIRMATION POPUP: Delete Comment */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowDeleteConfirm(false)}>
              <X size={16} />
            </button>
            <div className={styles.modalBody}>
              <div className={styles.alertIconWrapperDanger}>
                <Trash2 size={24} />
              </div>
              <h4 className={styles.modalTitle}>Delete Comment?</h4>
              <p className={styles.modalText}>
                Are you sure you want to delete this comment? This action is irreversible!
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.modalCancelBtn}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className={styles.modalConfirmBtnDanger} onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP: Success Deleted */}
      {showDeleteSuccess && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteSuccess(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowDeleteSuccess(false)}>
              <X size={16} />
            </button>
            <div className={styles.modalBody}>
              <div className={styles.alertIconWrapperSuccess}>
                <CheckCircle size={24} />
              </div>
              <h4 className={styles.modalTitle}>Comment is Deleted!</h4>
              <p className={styles.modalText}>
                Congratulations, comment is deleted successfully.
              </p>
              <button className={styles.modalSuccessActionBtn} onClick={() => setShowDeleteSuccess(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP: Discard Changes */}
      {showDiscardConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowDiscardConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowDiscardConfirm(false)}>
              <X size={16} />
            </button>
            <div className={styles.modalBody}>
              <div className={styles.alertIconWrapperWarning}>
                <AlertTriangle size={24} />
              </div>
              <h4 className={styles.modalTitle}>Discard Changes?</h4>
              <p className={styles.modalText}>
                Are you sure you want to discard the changes you made to this comment?
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.modalCancelBtn}
                  onClick={() => setShowDiscardConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.modalConfirmBtnDanger}
                  onClick={() => {
                    setShowDiscardConfirm(false);
                    setView("list");
                    setActiveComment(null);
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
