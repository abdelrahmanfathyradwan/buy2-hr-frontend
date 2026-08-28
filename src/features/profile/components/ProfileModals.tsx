"use client";

import React, { useState, useRef } from "react";
import { X, Pencil, User, Phone, Mail, Cake, MapPin, Info, Check } from "lucide-react";
import styles from "./ProfileModals.module.css";

export type ModalType = "none" | "more-details" | "edit-picture" | "success" | "failed";

interface ProfileModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenModal: (modal: ModalType) => void;
  currentPhoto: string | null;
  onUpdatePhoto: (newPhoto: string) => void;
}

export const ProfileModals: React.FC<ProfileModalsProps> = ({
  activeModal,
  onClose,
  onOpenModal,
  currentPhoto,
  onUpdatePhoto,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeModal === "none") return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePicture = () => {
    const photoToSave = selectedImage || currentPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
    onUpdatePhoto(photoToSave);
    onOpenModal("success");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 1. MORE DETAILS MODAL */}
        {activeModal === "more-details" && (
          <>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>More details</h3>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.fullInfoContent}>
              <div className={styles.profileHeaderCard}>
                <div className={styles.avatarWrapper}>
                  {currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt="User Avatar"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <User size={24} />
                  )}
                  <button
                    className={styles.editAvatarBtn}
                    onClick={() => onOpenModal("edit-picture")}
                    title="Edit profile picture"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
                <div className={styles.profileHeaderInfo}>
                  <span className={styles.profileName}>Mohamed Ahmed</span>
                  <span className={styles.profileJoinDate}>Joined : 20-03-2020</span>
                </div>
              </div>

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <User size={16} className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>Role</span>
                    <span className={styles.detailValue}>Flutter developer</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <Phone size={16} className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>Phone number</span>
                    <span className={styles.detailValue}>(+989) 099943232555</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <Mail size={16} className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>Email address</span>
                    <span className={styles.detailValue}>mohamedahmed@grandtech.io</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <Cake size={16} className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>Birthdate</span>
                    <span className={styles.detailValue}>October 1, 1990</span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <MapPin size={16} className={styles.detailIcon} />
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>Registered Address</span>
                    <span className={styles.detailValue}>55 Boulevard, Dubai</span>
                  </div>
                </div>
              </div>

              <div className={styles.noticeBox}>
                <Info size={16} className={styles.noticeIcon} />
                <span className={styles.noticeText}>
                  <strong>Important notice</strong>
                  <br />
                  If any of the presented details is incorrect, please contact HR to adjust.
                </span>
              </div>
            </div>
          </>
        )}

        {/* 2. EDIT PROFILE PICTURE MODAL */}
        {activeModal === "edit-picture" && (
          <>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit profile picture</h3>
              <button className={styles.closeButton} onClick={() => onOpenModal("more-details")}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.editPictureContent}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                className={styles.imagePreviewBox}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
                title="Click to select image"
              >
                <img
                  src={
                    selectedImage ||
                    currentPhoto ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                  }
                  alt="Profile Preview"
                  className={styles.previewImage}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.btnCancel}
                  onClick={() => onOpenModal("more-details")}
                >
                  Cancel
                </button>
                <button className={styles.btnSave} onClick={handleSavePicture}>
                  Save
                </button>
              </div>
            </div>
          </>
        )}

        {/* 3. SUCCESS MESSAGE MODAL */}
        {activeModal === "success" && (
          <div className={styles.statusContent}>
            <div className={`${styles.statusIconCircle} ${styles.successCircle}`}>
              <Check size={32} />
            </div>
            <h3 className={styles.statusTitle}>Updated successfully !</h3>
            <p className={styles.statusDesc}>
              Congratulations, profile picture is updated successfully.
            </p>
            <button className={styles.btnFull} onClick={onClose}>
              Got it
            </button>
          </div>
        )}

        {/* 4. FAILED MESSAGE MODAL */}
        {activeModal === "failed" && (
          <div className={styles.statusContent}>
            <div className={`${styles.statusIconCircle} ${styles.errorCircle}`}>
              <X size={32} />
            </div>
            <h3 className={styles.statusTitle}>Update failed!</h3>
            <p className={styles.statusDesc}>
              There was an error while saving your profile picture, please try again.
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.btnSave}
                onClick={() => onOpenModal("edit-picture")}
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
