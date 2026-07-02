// ── Data for the Read Music module ────────────────────────────────────────────

// Frequencies defined locally — avoids modifying the shared playTone utility
export const READ_MUSIC_FREQUENCIES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
}

// Lines of the staff, bottom to top — "Every Good Boy Deserves Fruit"
export const LINES_NOTES = [
  { id: 'E4', letter: 'E', mnemonic: 'Every' },
  { id: 'G4', letter: 'G', mnemonic: 'Good' },
  { id: 'B4', letter: 'B', mnemonic: 'Boy' },
  { id: 'D5', letter: 'D', mnemonic: 'Deserves' },
  { id: 'F5', letter: 'F', mnemonic: 'Fruit' },
]

// Spaces of the staff, bottom to top — FACE
export const SPACES_NOTES = [
  { id: 'F4', letter: 'F', color: '#FFF3E0' },  // Amber tint
  { id: 'A4', letter: 'A', color: '#FCE4EC' },  // Coral tint
  { id: 'C5', letter: 'C', color: '#E8F5E9' },  // Green tint
  { id: 'E5', letter: 'E', color: '#F3E8FF' },  // Purple tint
]

// Notes tested in the quiz (all 9 within-staff notes, no ledger lines)
export const QUIZ_NOTE_POOL = ['E4', 'G4', 'B4', 'D5', 'F5', 'F4', 'A4', 'C5', 'E5']

// Notes required to unlock the Read Music section
export const UNLOCK_REQUIRED = ['B4', 'A4', 'G4', 'C5', 'D5']

// ── Staff SVG geometry ─────────────────────────────────────────────────────────
// viewBox "0 0 320 200"
// Staff lines y (top → bottom): F5=92, D5=104, B4=116, G4=128, E4=140
// Note y-positions:
//   A5=80(ledger above), G5=86, F5=92, E5=98, D5=104, C5=110, B4=116,
//   A4=122, G4=128, F4=134, E4=140, D4=146, C4=152(ledger below)
//
// This data is exported so components can reference the same constants.

export const STAFF_LINES_Y = [92, 104, 116, 128, 140]  // F5, D5, B4, G4, E4

export const NOTE_Y = {
  A5: 80,  G5: 86,  F5: 92,  E5: 98,  D5: 104,
  C5: 110, B4: 116, A4: 122, G4: 128, F4: 134,
  E4: 140, D4: 146, C4: 152,
}

// x positions for 5 notes (Lines) and 4 notes (Spaces)
export const LINES_X  = [76, 128, 180, 232, 284]
export const SPACES_X = [90, 148, 206, 264]
