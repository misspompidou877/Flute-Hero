/**
 * trial.js — single client-side source of truth for the free-trial window.
 *
 * Trill has no backend and no accounts (see CLAUDE.md). Per
 * flute-hero-redesign-brief.md §3, every install gets a 10-day free
 * full-access trial that starts silently on first open. Once the trial
 * ends, Level 1 remains free forever and Levels 2–8 require a one-time
 * purchase (tracked elsewhere via the `progress.isPremium` flag).
 *
 * This module owns all trial-day math so every screen agrees on what day
 * of the trial it is and whether full access is currently granted. It
 * reads/writes exactly one localStorage key: `trial.startedAt`.
 *
 * This file intentionally does NOT wire into ProgressContext or gating —
 * that integration is a separate task. It only exports pure helpers.
 */

const STORAGE_KEY = 'trial.startedAt';

/** Length of the free full-access trial, in calendar days. */
export const TRIAL_DAYS = 10;

/** Format a Date as a local-timezone YYYY-MM-DD string (date-only, no time). */
function toISODateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse a YYYY-MM-DD string into a local-midnight Date. Returns null if invalid. */
function parseISODateString(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const parsed = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

/**
 * Ensure the trial start date is recorded in localStorage, writing today's
 * date (as YYYY-MM-DD) if it is absent. Idempotent — safe to call as often
 * as needed. Returns the start date string.
 *
 * Degrades gracefully: if localStorage is unavailable (e.g. private
 * browsing), returns today's date string without persisting it.
 */
export function startTrialIfNeeded() {
  const todayStr = toISODateString(new Date());

  let existing = null;
  try {
    existing = localStorage.getItem(STORAGE_KEY);
  } catch {
    existing = null;
  }

  if (existing && parseISODateString(existing)) {
    return existing;
  }

  try {
    localStorage.setItem(STORAGE_KEY, todayStr);
  } catch {
    // Ignore — treat this session as starting "today" without persisting.
  }

  return todayStr;
}

/**
 * Returns the 1-based calendar-day number of the trial: 1 on the start
 * day, 2 the next calendar day, and so on. Comparison is date-only (time
 * of day is stripped). Never returns less than 1.
 *
 * Degrades gracefully: if localStorage is unavailable or the stored value
 * is unusable, treats this as day 1.
 */
export function getTrialDay() {
  const startStr = startTrialIfNeeded();

  const startDate = parseISODateString(startStr);
  if (!startDate) return 1;

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((todayMidnight.getTime() - startDate.getTime()) / msPerDay);

  const day = diffDays + 1;
  return day < 1 ? 1 : day;
}

/**
 * Number of full-access trial days left, including today. 0 once the
 * trial has ended.
 */
export function daysRemaining() {
  return Math.max(0, TRIAL_DAYS - getTrialDay() + 1);
}

/** True while the student is still within the free full-access trial window. */
export function isTrialActive() {
  return getTrialDay() <= TRIAL_DAYS;
}

/** True once the free full-access trial window has ended. */
export function isTrialExpired() {
  return !isTrialActive();
}

/**
 * Combined entitlement check: does the student currently have full access
 * to every level? True if they've purchased premium, or if they're still
 * inside the free trial window.
 */
export function hasFullAccess(isPremium) {
  return isPremium === true || isTrialActive();
}
