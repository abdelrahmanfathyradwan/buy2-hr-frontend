"use client";

import React, { useState, useMemo } from "react";
import { Check, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import styles from "./SettingsPage.module.css";

type TabType = "password" | "language" | "about" | "terms" | "privacy";
type StepType = 1 | 2;

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("password");

  // Password Reset Flow States
  const [passwordStep, setPasswordStep] = useState<StepType>(1);
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Language Selection States
  const [selectedLanguage, setSelectedLanguage] = useState<"ar" | "en">("en");

  // Dynamic Validation rules for new password
  const newPasswordRules = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      digit: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]/.test(newPassword),
    };
  }, [newPassword]);

  const isNewPasswordStrong = useMemo(() => {
    return (
      newPasswordRules.length &&
      newPasswordRules.uppercase &&
      newPasswordRules.lowercase &&
      newPasswordRules.digit &&
      newPasswordRules.special
    );
  }, [newPasswordRules]);

  // Actions
  const handleConfirmOldPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate old password check. Accept "123456" or any dummy password. If incorrect, show standard error
    if (oldPassword !== "123456") {
      setOldPasswordError("Password is incorrect, please try again.");
    } else {
      setOldPasswordError("");
      setPasswordStep(2);
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewPasswordStrong) return;

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    // Success
    setShowSuccessModal(true);
  };

  const handleDiscardPassword = () => {
    setOldPassword("");
    setOldPasswordError("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStep(1);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    handleDiscardPassword();
  };

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.title}>Settings</h1>

      {/* Tabs list */}
      <div className={styles.tabsList}>
        <button
          className={`${styles.tabButton} ${activeTab === "password" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Password
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "language" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("language")}
        >
          Language
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "about" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About Buy2
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "terms" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("terms")}
        >
          Terms of Use
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "privacy" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy policy
        </button>
      </div>

      {/* Main card */}
      <div className={styles.card}>
        {activeTab === "password" && (
          <div>
            {/* Stepper progress */}
            <div className={styles.stepperContainer}>
              <div
                className={`${styles.step} ${passwordStep === 1 ? styles.stepActive : ""} ${
                  passwordStep > 1 ? styles.stepCompleted : ""
                }`}
              >
                <div className={styles.stepCircle}>1</div>
                <span className={styles.stepLabel}>Confirm Old Password</span>
              </div>
              <div className={styles.stepLine} />
              <div className={`${styles.step} ${passwordStep === 2 ? styles.stepActive : ""}`}>
                <div className={styles.stepCircle}>2</div>
                <span className={styles.stepLabel}>Create New Password</span>
              </div>
            </div>

            {/* Step 1: Confirm Old Password */}
            {passwordStep === 1 && (
              <form onSubmit={handleConfirmOldPassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="old-password-input" className={styles.inputLabel}>Old Password</label>
                  <input
                    id="old-password-input"
                    type="password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      if (oldPasswordError) setOldPasswordError("");
                    }}
                    className={`${styles.textInput} ${oldPasswordError ? styles.textInputError : ""}`}
                    required
                  />
                  {oldPasswordError && <span className={styles.errorText}>{oldPasswordError}</span>}
                </div>
                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryButton}>
                    Next
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Create New Password */}
            {passwordStep === 2 && (
              <form onSubmit={handleSaveNewPassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="new-password-input" className={styles.inputLabel}>New Password</label>
                  <input
                    id="new-password-input"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirm-password-input" className={styles.inputLabel}>Confirm New Password</label>
                  <input
                    id="confirm-password-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                {/* Password strength checklist */}
                <div className={styles.checklistContainer}>
                  <div className={styles.checklistTitle}>
                    Your password is not strong enough. New password must:
                  </div>
                  <div
                    className={`${styles.checklistItem} ${
                      newPasswordRules.length ? styles.checklistItemValid : ""
                    }`}
                  >
                    <span
                      className={`${styles.checklistIcon} ${
                        newPasswordRules.length ? styles.iconValid : styles.iconInvalid
                      }`}
                    >
                      {newPasswordRules.length ? <Check size={8} /> : <X size={8} />}
                    </span>
                    <span>Be at least 8 characters long.</span>
                  </div>
                  <div
                    className={`${styles.checklistItem} ${
                      newPasswordRules.uppercase ? styles.checklistItemValid : ""
                    }`}
                  >
                    <span
                      className={`${styles.checklistIcon} ${
                        newPasswordRules.uppercase ? styles.iconValid : styles.iconInvalid
                      }`}
                    >
                      {newPasswordRules.uppercase ? <Check size={8} /> : <X size={8} />}
                    </span>
                    <span>Contain at least one uppercase letter.</span>
                  </div>
                  <div
                    className={`${styles.checklistItem} ${
                      newPasswordRules.lowercase ? styles.checklistItemValid : ""
                    }`}
                  >
                    <span
                      className={`${styles.checklistIcon} ${
                        newPasswordRules.lowercase ? styles.iconValid : styles.iconInvalid
                      }`}
                    >
                      {newPasswordRules.lowercase ? <Check size={8} /> : <X size={8} />}
                    </span>
                    <span>Contain at least one lowercase letter.</span>
                  </div>
                  <div
                    className={`${styles.checklistItem} ${
                      newPasswordRules.digit ? styles.checklistItemValid : ""
                    }`}
                  >
                    <span
                      className={`${styles.checklistIcon} ${
                        newPasswordRules.digit ? styles.iconValid : styles.iconInvalid
                      }`}
                    >
                      {newPasswordRules.digit ? <Check size={8} /> : <X size={8} />}
                    </span>
                    <span>Contain at least one numeric character (0-9).</span>
                  </div>
                  <div
                    className={`${styles.checklistItem} ${
                      newPasswordRules.special ? styles.checklistItemValid : ""
                    }`}
                  >
                    <span
                      className={`${styles.checklistIcon} ${
                        newPasswordRules.special ? styles.iconValid : styles.iconInvalid
                      }`}
                    >
                      {newPasswordRules.special ? <Check size={8} /> : <X size={8} />}
                    </span>
                    <span>Contain at least one special character (eg. , !, @, #, $).</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={!isNewPasswordStrong}
                  >
                    Save new password
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscardPassword}
                    className={styles.discardLink}
                  >
                    Discard
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Language Change */}
        {activeTab === "language" && (
          <div>
            <h3 className={styles.languageTitle}>Change Language</h3>
            <div className={styles.radioGroup}>
              <div
                className={`${styles.radioLabel} ${
                  selectedLanguage === "ar" ? styles.radioActive : ""
                }`}
                onClick={() => setSelectedLanguage("ar")}
              >
                <div className={styles.customRadio}>
                  <div className={styles.customRadioInner} />
                </div>
                <span className={styles.flagIcon}>🇸🇦</span>
                <span>Arabic</span>
              </div>
              <div
                className={`${styles.radioLabel} ${
                  selectedLanguage === "en" ? styles.radioActive : ""
                }`}
                onClick={() => setSelectedLanguage("en")}
              >
                <div className={styles.customRadio}>
                  <div className={styles.customRadioInner} />
                </div>
                <span className={styles.flagIcon}>🇬🇧</span>
                <span>English</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => alert(`Language changed to: ${selectedLanguage === "ar" ? "Arabic" : "English"}`)}
              >
                Apply changes
              </button>
              <button
                type="button"
                className={styles.discardLink}
                onClick={() => setSelectedLanguage("en")}
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: About Buy2 */}
        {activeTab === "about" && (
          <div className={styles.staticInfo}>
            <h3 className={styles.staticHeader}>About Buy2</h3>
            <p>
              Buy2 is a modern Human Resource management system designed to streamline your daily workplace activities, track attendance, manage shifts, assign tasks, and redeem rewards.
            </p>
            <p>Version: 1.0.0 (Release)</p>
          </div>
        )}

        {/* Tab 4: Terms of Use */}
        {activeTab === "terms" && (
          <div className={styles.staticInfo}>
            <h3 className={styles.staticHeader}>Terms of Use</h3>
            <p>
              By accessing and using this application, you agree to comply with our corporate policies, respect security protocols, and protect company resources and data confidentiality.
            </p>
          </div>
        )}

        {/* Tab 5: Privacy policy */}
        {activeTab === "privacy" && (
          <div className={styles.staticInfo}>
            <h3 className={styles.staticHeader}>Privacy Policy</h3>
            <p>
              We prioritize your personal privacy. Your data, attendance histories, performance scores, and task metrics are kept confidential and are visible only to you and authorized company administrators.
            </p>
          </div>
        )}
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <X size={20} />
            </button>
            <div className={styles.modalIconWrapper}>
              <CheckCircle2 size={40} className={styles.modalCheckIcon} />
            </div>
            <h2 className={styles.modalTitle}>Updated successfully!</h2>
            <p className={styles.modalSubtitle}>
              Congratulations, your password is updated successfully.
            </p>
            <button className={styles.primaryButton} onClick={handleCloseModal}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
