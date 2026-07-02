/**
 * notes.js — Flute Hero master note data
 *
 * Finger key legend:
 *   thumb  — left thumb (octave/register key)
 *   L1     — left index finger
 *   L2     — left middle finger
 *   L3     — left ring finger
 *   Lp     — left pinky (G# key)
 *   R1     — right index finger
 *   R2     — right middle finger
 *   R3     — right ring finger
 *   Rp     — right pinky (Eb key)
 *
 * true = closed/pressed, false = open
 */

export const NOTES = {

  // ─── LEVEL 1 — B, A, G ─────────────────────────
  B4: {
    id: 'B4', label: 'B', octave: 4, midi: 71, freq: 493.88, level: 1,
    fingers: { thumb: true, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Left thumb, left index finger, and right pinky key. Rest the others lightly above their keys.',
  },
  A4: {
    id: 'A4', label: 'A', octave: 4, midi: 69, freq: 440.00, level: 1,
    fingers: { thumb: true, L1: true, L2: true, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: "Same as B, add your left middle finger and keep the right pinky key down. Don't squeeze — a gentle, flat finger pad.",
  },
  G4: {
    id: 'G4', label: 'G', octave: 4, midi: 67, freq: 392.00, level: 1,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'All three left fingers down plus right pinky key.',
  },

  // ─── LEVEL 2 — adds C5, D5 ──────────────────────
  C5: {
    id: 'C5', label: 'C', octave: 5, midi: 72, freq: 523.25, level: 2,
    fingers: { thumb: false, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Left index finger plus right pinky key — an unusual pair but that\'s C!',
  },
  D5: {
    id: 'D5', label: 'D', octave: 5, midi: 74, freq: 587.33, level: 2,
    fingers: { thumb: true, L1: false, L2: true, L3: true, Lp: false, R1: true, R2: true, R3: true, Rp: false },
    tip: 'Left thumb, skip L1, then L2 + L3, and all three right hand fingers down.',
  },

  // ─── LEVEL 3 — adds Bb4, E5, F5, F#5 ───────────
  Bb4: {
    id: 'Bb4', label: 'B♭', octave: 4, midi: 70, freq: 466.16, level: 3,
    variantLabel: 'Option 1 — "1 and 1"',
    fingers: { thumb: true, thumbBb: false, L1: true, L2: false, L3: false, Lp: false, R1: true, R2: false, R3: false, Rp: true },
    tip: '"One and one" B♭ — left thumb on the main hole, left index finger, right index finger, and right pinky key.',
  },
  Bb4_alt: {
    id: 'Bb4_alt', label: 'B♭', octave: 4, midi: 70, freq: 466.16, level: 3,
    variantLabel: 'Option 2 — Thumb B♭ key',
    fingers: { thumb: false, thumbBb: true, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: false },
    tip: 'Press the small B♭ lever key with your thumb (the little circle to the upper-left) plus just your left index finger.',
  },
  E5: {
    id: 'E5', label: 'E', octave: 5, midi: 76, freq: 659.25, level: 3,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: true, R2: true, R3: false, Rp: true },
    tip: 'Left thumb plus left hand fingers 1, 2, and 3, then right hand fingers 1, 2, and the pinky key.',
  },
  F5: {
    id: 'F5', label: 'F', octave: 5, midi: 77, freq: 698.46, level: 3,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: true, R2: false, R3: false, Rp: true },
    tip: 'Left thumb plus left hand fingers 1, 2, and 3, then your right index finger and the pinky key.',
  },
  Fs5: {
    id: 'Fs5', label: 'F♯', octave: 5, midi: 78, freq: 739.99, level: 3,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: false, R2: false, R3: true, Rp: true },
    tip: 'Left thumb plus left hand fingers 1, 2, and 3, then your right ring finger and the pinky key.',
  },

  // ─── LEVEL 4 — adds Bb5, G5, A5, B5, C6 ────────
  Bb5: {
    id: 'Bb5', label: 'B♭', octave: 5, midi: 82, freq: 932.33, level: 4,
    variantLabel: 'Option 1 — "1 and 1"',
    fingers: { thumb: true, thumbBb: false, L1: true, L2: false, L3: false, Lp: false, R1: true, R2: false, R3: false, Rp: true },
    tip: 'Same "one and one" shape as low B♭ — main thumb hole, left index, right index, and right pinky key. Blow faster and aim higher for the upper octave.',
  },
  Bb5_alt: {
    id: 'Bb5_alt', label: 'B♭', octave: 5, midi: 82, freq: 932.33, level: 4,
    variantLabel: 'Option 2 — Thumb B♭ key',
    fingers: { thumb: false, thumbBb: true, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: false },
    tip: 'Press the small B♭ lever key with your thumb plus left index finger. Blow faster to reach the upper octave.',
  },
  G5: {
    id: 'G5', label: 'G', octave: 5, midi: 79, freq: 784.00, level: 4,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same fingering as G4 — all three left fingers plus right pinky. Blow faster for the upper octave.',
  },
  A5: {
    id: 'A5', label: 'A', octave: 5, midi: 81, freq: 880.00, level: 4,
    fingers: { thumb: true, L1: true, L2: true, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same fingering as A4 plus right pinky key — thumb, L1, L2, and RH4. Blow a little faster to reach the upper octave.',
  },
  B5: {
    id: 'B5', label: 'B', octave: 5, midi: 83, freq: 987.77, level: 4,
    fingers: { thumb: true, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same fingering as B4 plus right pinky key — thumb, L1, and RH4. Blow faster to reach the upper octave.',
  },
  C6: {
    id: 'C6', label: 'C', octave: 6, midi: 84, freq: 1046.50, level: 4,
    fingers: { thumb: false, L1: true, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same fingering as C5 — L1 and right pinky. Blow faster for the upper octave.',
  },

  // ─── LEVEL 5 — adds low E4, F4, F#4 ────────────
  E4: {
    id: 'E4', label: 'E', octave: 4, midi: 64, freq: 329.63, level: 5,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: true, R2: true, R3: false, Rp: true },
    tip: 'Blow slower and aim the stream of air lower towards the ground near your feet as you are standing up.',
  },
  F4: {
    id: 'F4', label: 'F', octave: 4, midi: 65, freq: 349.23, level: 5,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: true, R2: false, R3: false, Rp: true },
    tip: 'Blow slower and aim the stream of air lower towards the ground near your feet as you are standing up.',
  },
  Fs4: {
    id: 'Fs4', label: 'F♯', octave: 4, midi: 66, freq: 369.99, level: 5,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: false, R1: false, R2: false, R3: true, Rp: true },
    tip: 'Blow slower and aim the stream of air lower towards the ground near your feet as you are standing up.',
  },

  // ─── LEVEL 6 — adds C#5, Eb5 ───────────────────
  Cs5: {
    id: 'Cs5', label: 'C♯', octave: 5, midi: 73, freq: 554.37, level: 6,
    fingers: { thumb: false, L1: false, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Almost everything lifts up — just keep the right pinky key down. That open feeling is C♯ (the same note as D♭).',
  },
  Eb5: {
    id: 'Eb5', label: 'E♭', octave: 5, midi: 75, freq: 622.25, level: 6,
    fingers: { thumb: true, L1: false, L2: true, L3: true, Lp: false, R1: true, R2: true, R3: true, Rp: true },
    tip: 'Exactly like D, then add the right pinky E♭ key. E♭ is the same note as D♯.',
  },

  // ─── LEVEL 7 — adds G#4, G#5 ───────────────────
  Gs4: {
    id: 'Gs4', label: 'G♯', octave: 4, midi: 68, freq: 415.30, level: 7,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: true, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Hold a G, then press the little G♯ key with your left pinky. G♯ is the same note as A♭.',
  },
  Gs5: {
    id: 'Gs5', label: 'G♯', octave: 5, midi: 80, freq: 830.61, level: 7,
    fingers: { thumb: true, L1: true, L2: true, L3: true, Lp: true, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same shape as low G♯ — a G plus the left pinky G♯ key. Blow faster for the upper octave.',
  },

  // ─── LEVEL 8 — adds C#6, D6 ────────────────────
  Cs6: {
    id: 'Cs6', label: 'C♯', octave: 6, midi: 85, freq: 1108.73, level: 8,
    fingers: { thumb: false, L1: false, L2: false, L3: false, Lp: false, R1: false, R2: false, R3: false, Rp: true },
    tip: 'Same open shape as the lower C♯ — just the right pinky key. Blow faster and aim higher for the top octave.',
  },
  D6: {
    id: 'D6', label: 'D', octave: 6, midi: 86, freq: 1174.66, level: 8,
    fingers: { thumb: true, L1: false, L2: true, L3: true, Lp: false, R1: true, R2: true, R3: true, Rp: false },
    tip: 'Same fingering as middle D — your left index stays up. Fast, focused air brings out the high D.',
  },
};

// Maps a note ID to its alternate fingering note ID
export const ALTERNATE_FINGERINGS = {
  Bb4: 'Bb4_alt',
  Bb5: 'Bb5_alt',
};

export const NOTES_BY_LEVEL = {
  1: ['B4', 'A4', 'G4'],
  2: ['C5', 'D5'],
  3: ['Bb4', 'E5', 'F5', 'Fs5'],
  4: ['Bb5', 'G5', 'A5', 'B5', 'C6'],
  5: ['E4', 'F4', 'Fs4'],
  6: ['Cs5', 'Eb5'],
  7: ['Gs4', 'Gs5'],
  8: ['Cs6', 'D6'],
};

export const NOTE_ORDER = [
  'B4', 'A4', 'G4',
  'C5', 'D5',
  'Bb4', 'E5', 'F5', 'Fs5',
  'Bb5', 'G5', 'A5', 'B5', 'C6',
  'E4', 'F4', 'Fs4',
  'Cs5', 'Eb5',
  'Gs4', 'Gs5',
  'Cs6', 'D6',
];

export function computeLevel(masteredNotes = []) {
  const has = (n) => masteredNotes.includes(n);
  const allOf = (arr) => arr.every(has);
  // Walk up the levels: each level unlocks once every note of all prior
  // levels is mastered. Capped at 8 (the highest level).
  let level = 1;
  for (let L = 1; L <= 7; L++) {
    if (allOf(NOTES_BY_LEVEL[L])) level = L + 1;
    else break;
  }
  return level;
}

export function isNoteUnlocked(noteId, masteredNotes = []) {
  const idx = NOTE_ORDER.indexOf(noteId);
  if (idx === -1) return false;
  if (idx === 0) return true;
  return NOTE_ORDER.slice(0, idx).every(n => masteredNotes.includes(n));
}
