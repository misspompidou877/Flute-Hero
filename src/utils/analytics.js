/*
 * analytics.js — tiny, dependency-free, client-side event logger.
 *
 * Flute Hero has no backend and no accounts (see CLAUDE.md), so "analytics"
 * here means: append small event records to localStorage that the GTM /
 * product-analytics workstream can inspect on-device or export later. Nothing
 * ever leaves the device. Every read/write is wrapped in try/catch so it is
 * safe in private-browsing mode where localStorage can throw.
 *
 * Public API:
 *   logEvent(name, props?)  — append { name, props, ts } to `analytics.events`
 *                             (capped to the last MAX_EVENTS records).
 *   markTiming(key)         — record the first timestamp seen for `key` in
 *                             `analytics.marks` (idempotent). Returns it.
 *   elapsedSince(key)       — ms since a previously-marked timestamp, or null.
 *   getEvents()             — the current array of logged events.
 *
 * Named onboarding events (fired by the onboarding flow):
 *   onboarding_started, onboarding_step_viewed, onboarding_step_completed,
 *   name_captured, age_selected, flute_status, first_sound_success,
 *   first_song_started, journey_revealed, onboarding_completed,
 *   save_prompt_shown, save_accepted, plus the timing events
 *   time_to_first_sound and time_to_first_song (ms from onboarding_started).
 */

const EVENTS_KEY = 'analytics.events';
const MARKS_KEY = 'analytics.marks';

/** Keep only the most recent N events so localStorage never grows unbounded. */
const MAX_EVENTS = 500;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore — private mode / quota. Analytics is best-effort only.
  }
}

/**
 * Append an event. `name` is required; `props` is an optional plain object.
 * Returns the stored record, or null if it could not be recorded.
 */
export function logEvent(name, props = {}) {
  if (typeof name !== 'string' || !name) return null;

  const existing = readJSON(EVENTS_KEY, []);
  const list = Array.isArray(existing) ? existing : [];

  const record = {
    name,
    props: props && typeof props === 'object' ? props : {},
    ts: Date.now(),
  };
  list.push(record);

  const capped = list.length > MAX_EVENTS ? list.slice(list.length - MAX_EVENTS) : list;
  writeJSON(EVENTS_KEY, capped);
  return record;
}

/**
 * Record "now" for `key` the first time it is seen (idempotent) and return the
 * stored timestamp. Later calls with the same key return the original value so
 * timing baselines (e.g. `onboarding_started`) stay stable across a session.
 */
export function markTiming(key) {
  if (typeof key !== 'string' || !key) return null;

  const existing = readJSON(MARKS_KEY, {});
  const marks = existing && typeof existing === 'object' ? existing : {};

  if (typeof marks[key] === 'number') return marks[key];

  const now = Date.now();
  marks[key] = now;
  writeJSON(MARKS_KEY, marks);
  return now;
}

/**
 * Milliseconds elapsed since a previously-marked timestamp, or null if the key
 * was never marked. Used to derive time_to_first_sound / time_to_first_song.
 */
export function elapsedSince(key) {
  if (typeof key !== 'string' || !key) return null;

  const marks = readJSON(MARKS_KEY, {});
  const start = marks && typeof marks[key] === 'number' ? marks[key] : null;
  if (start == null) return null;

  return Date.now() - start;
}

/** The current list of logged events (always an array). */
export function getEvents() {
  const events = readJSON(EVENTS_KEY, []);
  return Array.isArray(events) ? events : [];
}
