"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronsUp,
  ChevronUp,
  Minus,
  ChevronDown,
  ChevronsDown,
  Calendar,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from "lucide-react";
import styles from "./FilterSortModal.module.css";

export interface FilterState {
  listName: string;
  assignedTo: string;
  priority: "Highest" | "High" | "Medium" | "Low" | "Lowest" | "";
  dueDate: string;
}

export interface SortState {
  sortBy: "name" | "created" | "due";
  sortType: "asc" | "desc";
}

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "filter" | "sort";
  onApplyFilters: (filters: FilterState) => void;
  onApplySort: (sort: SortState) => void;
  currentFilters: FilterState;
  currentSort: SortState;
}

export const FilterSortModal: React.FC<FilterSortModalProps> = ({
  isOpen,
  onClose,
  initialTab,
  onApplyFilters,
  onApplySort,
  currentFilters,
  currentSort,
}) => {
  const [activeTab, setActiveTab] = useState<"filter" | "sort">(initialTab);

  // Filter local state
  const [listName, setListName] = useState(currentFilters.listName);
  const [assignedTo, setAssignedTo] = useState(currentFilters.assignedTo);
  const [priority, setPriority] = useState(currentFilters.priority);
  const [dueDate, setDueDate] = useState(currentFilters.dueDate);

  // Sort local state
  const [sortBy, setSortBy] = useState(currentSort.sortBy);
  const [sortType, setSortType] = useState(currentSort.sortType);

  // Keep local states in sync when initialTab or props change
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setListName(currentFilters.listName);
    setAssignedTo(currentFilters.assignedTo);
    setPriority(currentFilters.priority);
    setDueDate(currentFilters.dueDate);
  }, [currentFilters]);

  useEffect(() => {
    setSortBy(currentSort.sortBy);
    setSortType(currentSort.sortType);
  }, [currentSort]);

  if (!isOpen) return null;

  const handleClearFilters = () => {
    setListName("");
    setAssignedTo("");
    setPriority("");
    setDueDate("");
  };

  const handleClearSort = () => {
    setSortBy("due");
    setSortType("desc");
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      listName,
      assignedTo,
      priority,
      dueDate,
    });
    onClose();
  };

  const handleApplySort = () => {
    onApplySort({
      sortBy,
      sortType,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Top Toggle Switcher Header */}
        <div className={styles.header}>
          <div className={styles.switcher}>
            <button
              className={`${styles.switchBtn} ${activeTab === "filter" ? styles.switchBtnActive : ""}`}
              onClick={() => setActiveTab("filter")}
            >
              Filter
            </button>
            <button
              className={`${styles.switchBtn} ${activeTab === "sort" ? styles.switchBtnActive : ""}`}
              onClick={() => setActiveTab("sort")}
            >
              Sort
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className={styles.body}>
          {activeTab === "filter" ? (
            /* Filter Form */
            <div className={styles.formGroupList}>
              <div className={styles.formItem}>
                <label className={styles.label}>List Name</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  >
                    <option value="">Select list team</option>
                    <option value="Backend bugs team">Backend bugs team</option>
                    <option value="Frontend design team">Frontend design team</option>
                    <option value="QA automation team">QA automation team</option>
                  </select>
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label}>Assigned To</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Select assignee</option>
                    <option value="Mohamed Ahmed">Mohamed Ahmed</option>
                    <option value="Ahmed Mohamed">Ahmed Mohamed</option>
                    <option value="Sarah Ali">Sarah Ali</option>
                  </select>
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label}>Task Priority</label>
                <div className={styles.radioList}>
                  {/* Highest */}
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ChevronsUp size={16} className={styles.priorityIconRed} />
                      <span className={styles.radioText}>Highest</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === "Highest"}
                      onChange={() => setPriority("Highest")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  {/* High */}
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ChevronUp size={16} className={styles.priorityIconOrange} />
                      <span className={styles.radioText}>High</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === "High"}
                      onChange={() => setPriority("High")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  {/* Medium */}
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <Minus size={16} className={styles.priorityIconBlue} />
                      <span className={styles.radioText}>Medium</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === "Medium"}
                      onChange={() => setPriority("Medium")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  {/* Low */}
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ChevronDown size={16} className={styles.priorityIconGreen} />
                      <span className={styles.radioText}>Low</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === "Low"}
                      onChange={() => setPriority("Low")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  {/* Lowest */}
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ChevronsDown size={16} className={styles.priorityIconGray} />
                      <span className={styles.radioText}>Lowest</span>
                    </div>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === "Lowest"}
                      onChange={() => setPriority("Lowest")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label}>Due date</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    placeholder="Select Date"
                    value={dueDate}
                    readOnly
                    className={styles.dateInput}
                  />
                  <Calendar size={16} className={styles.calendarIcon} />
                </div>
              </div>
            </div>
          ) : (
            /* Sort Form */
            <div className={styles.formGroupList}>
              <div className={styles.formItem}>
                <label className={styles.label}>Sort options</label>
                <div className={styles.radioList}>
                  <label className={styles.radioItem}>
                    <span className={styles.radioText}>Task name</span>
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === "name"}
                      onChange={() => setSortBy("name")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  <label className={styles.radioItem}>
                    <span className={styles.radioText}>Creation date</span>
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === "created"}
                      onChange={() => setSortBy("created")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  <label className={styles.radioItem}>
                    <span className={styles.radioText}>Due date</span>
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === "due"}
                      onChange={() => setSortBy("due")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label}>Sort type</label>
                <div className={styles.radioList}>
                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ArrowUpNarrowWide size={16} className={styles.sortTypeIcon} />
                      <span className={styles.radioText}>Ascending</span>
                    </div>
                    <input
                      type="radio"
                      name="sortType"
                      checked={sortType === "asc"}
                      onChange={() => setSortType("asc")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>

                  <label className={styles.radioItem}>
                    <div className={styles.radioLabelLeft}>
                      <ArrowDownNarrowWide size={16} className={styles.sortTypeIcon} />
                      <span className={styles.radioText}>Descending</span>
                    </div>
                    <input
                      type="radio"
                      name="sortType"
                      checked={sortType === "desc"}
                      onChange={() => setSortType("desc")}
                      className={styles.radioInput}
                    />
                    <div className={styles.customRadio} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Actions Footer */}
        <div className={styles.footer}>
          {activeTab === "filter" ? (
            <>
              <button className={styles.clearBtn} onClick={handleClearFilters}>
                Clear
              </button>
              <button className={styles.applyBtn} onClick={handleApplyFilters}>
                Apply Filters
              </button>
            </>
          ) : (
            <>
              <button className={styles.clearBtn} onClick={handleClearSort}>
                Clear
              </button>
              <button className={styles.applyBtn} onClick={handleApplySort}>
                Apply
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
