// ─── helpers ──────────────────────────────────────────
const q = (key) => ({ key, duration: 'q' })
const h = (key) => ({ key, duration: 'h' })
const e = (key) => ({ key, duration: '8' })
const w  = (key) => ({ key, duration: 'w' })
const hd = (key) => ({ key, duration: 'hd' })
const qd = (key) => ({ key, duration: 'qd' })

export const SONGS = [

  // ════════════════════════════════════════════════════
  // LEVEL 1 — B4, A4, G4
  // ════════════════════════════════════════════════════

  {
    id: 'hot-cross-buns',
    title: 'Hot Cross Buns',
    level: 1,
    description: 'Your very first song — just three notes!',
    notes: [
      q('b/4'), q('a/4'), h('g/4'),
      q('b/4'), q('a/4'), h('g/4'),
      e('g/4'), e('g/4'), e('g/4'), e('g/4'), e('a/4'), e('a/4'), e('a/4'), e('a/4'),
      q('b/4'), q('a/4'), h('g/4'),
    ],
  },

  {
    id: 'mary-had-a-little-lamb',
    title: 'Mary Had a Little Lamb',
    level: 1,
    description: 'A classic tune with steps up and down.',
    notes: [
      q('b/4'), q('a/4'), q('g/4'), q('a/4'), q('b/4'), q('b/4'), h('b/4'),
      q('a/4'), q('a/4'), h('a/4'), q('b/4'), q('b/4'), h('b/4'),
      q('b/4'), q('a/4'), q('g/4'), q('a/4'), q('b/4'), q('b/4'), q('b/4'), q('b/4'),
      q('a/4'), q('a/4'), q('b/4'), q('a/4'), h('g/4'),
    ],
  },

  {
    id: 'au-clair-de-la-lune',
    title: 'Au clair de la lune',
    level: 1,
    description: 'A gentle French lullaby using your three starter notes.',
    notes: [
      q('g/4'), q('g/4'), q('g/4'), q('a/4'), h('b/4'), h('a/4'),
      q('g/4'), q('b/4'), q('a/4'), q('a/4'), w('g/4'),
      q('g/4'), q('g/4'), q('g/4'), q('a/4'), h('b/4'), h('a/4'),
      q('g/4'), q('b/4'), q('a/4'), q('a/4'), w('g/4'),
    ],
  },

  {
    id: 'suo-gan',
    title: 'Suo-gân',
    level: 1,
    description: 'A beautiful Welsh lullaby — smooth and flowing.',
    notes: [
      q('b/4'), q('a/4'), q('g/4'), q('a/4'),
      h('b/4'), h('g/4'),
      q('a/4'), q('g/4'), q('a/4'), q('b/4'),
      w('g/4'),
    ],
  },

  // ── Level 1 stubs ──────────────────────────
  {
    id: 'bags',
    title: 'BAGs',
    level: 1,
    description: 'A simple warm-up exercise stepping through B, A and G.',
    notes: [
      // Measure 1: step up B A G A
      q('b/4'), q('a/4'), q('g/4'), q('a/4'),
      // Measure 2: step B A G hold
      q('b/4'), q('a/4'), h('g/4'),
      // Measure 3: step down and up with halves
      h('b/4'), h('g/4'),
      // Measure 4: A A B B
      q('a/4'), q('a/4'), q('b/4'), q('b/4'),
      // Measure 5: step G A B A
      q('g/4'), q('a/4'), q('b/4'), q('a/4'),
      // Measure 6: long G
      h('g/4'), h('g/4'),
    ],
  },

  {
    id: 'one-note-blues',
    title: 'One Note Blues',
    level: 1,
    description: 'All about rhythm — one note, lots of groove.',
    notes: [
      // Measure 1: e e q e e q  (0.5+0.5+1+0.5+0.5+1 = 4)
      e('b/4'), e('b/4'), q('b/4'), e('b/4'), e('b/4'), q('b/4'),
      // Measure 2: e e e e h    (0.5+0.5+0.5+0.5+2 = 4)
      e('b/4'), e('b/4'), e('b/4'), e('b/4'), h('b/4'),
      // Measure 3: e e q e e q
      e('b/4'), e('b/4'), q('b/4'), e('b/4'), e('b/4'), q('b/4'),
      // Measure 4: q q h
      q('b/4'), q('b/4'), h('b/4'),
    ],
  },

  {
    id: 'a-note-blues',
    title: 'A Note Blues',
    level: 1,
    description: 'Build confidence on A with a blues beat.',
    notes: [
      // Measure 1: e e q e e q
      e('a/4'), e('a/4'), q('a/4'), e('a/4'), e('a/4'), q('a/4'),
      // Measure 2: e e e e h
      e('a/4'), e('a/4'), e('a/4'), e('a/4'), h('a/4'),
      // Measure 3: e e q e e q
      e('a/4'), e('a/4'), q('a/4'), e('a/4'), e('a/4'), q('a/4'),
      // Measure 4: q q h
      q('a/4'), q('a/4'), h('a/4'),
    ],
  },

  {
    id: 'g-note-blues',
    title: 'G Note Blues',
    level: 1,
    description: 'Low and mellow — practice G with style.',
    notes: [
      // Measure 1: e e q e e q
      e('g/4'), e('g/4'), q('g/4'), e('g/4'), e('g/4'), q('g/4'),
      // Measure 2: e e e e h
      e('g/4'), e('g/4'), e('g/4'), e('g/4'), h('g/4'),
      // Measure 3: e e q e e q
      e('g/4'), e('g/4'), q('g/4'), e('g/4'), e('g/4'), q('g/4'),
      // Measure 4: q q h
      q('g/4'), q('g/4'), h('g/4'),
    ],
  },

  {
    id: 'the-old-shepherd',
    title: 'The Old Shepherd',
    level: 1,
    description: 'A lilting folk melody using your three starter notes.',
    notes: [
      // Measure 1
      q('g/4'), q('a/4'), q('b/4'), q('a/4'),
      // Measure 2
      h('g/4'), h('b/4'),
      // Measure 3
      q('a/4'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 4
      h('a/4'), h('g/4'),
      // Measure 5
      q('b/4'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 6
      q('a/4'), q('g/4'), q('a/4'), q('b/4'),
      // Measure 7
      q('b/4'), q('a/4'), q('g/4'), q('a/4'),
      // Measure 8
      h('g/4'), h('g/4'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 2 — adds C5, D5
  // ════════════════════════════════════════════════════

  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    level: 2,
    description: 'Beethoven\'s famous theme — great for practising C and D.',
    notes: [
      q('b/4'), q('b/4'), q('c/5'), q('d/5'), q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      q('g/4'), q('g/4'), q('a/4'), q('b/4'), q('b/4'), q('a/4'), h('a/4'),
      q('b/4'), q('b/4'), q('c/5'), q('d/5'), q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      q('g/4'), q('g/4'), q('a/4'), q('b/4'), q('a/4'), q('g/4'), h('g/4'),
    ],
  },

  {
    id: 'lightly-row',
    title: 'Lightly Row',
    level: 2,
    description: 'A gentle classic that uses all five notes — B, A, G, C and D.',
    notes: [
      // Measure 1: Light-ly row (sol mi mi)
      q('d/5'), q('b/4'), h('b/4'),
      // Measure 2: light-ly row (fa re re)
      q('c/5'), q('a/4'), h('a/4'),
      // Measure 3: o'er the rip-pling (do re mi fa)
      q('g/4'), q('a/4'), q('b/4'), q('c/5'),
      // Measure 4: waves we go (sol sol)
      h('d/5'), h('d/5'),
      // Measure 5: smooth-ly glide (mi mi mi mi)
      q('b/4'), q('b/4'), q('b/4'), q('b/4'),
      // Measure 6: smooth-ly glide (re re re)
      q('a/4'), q('a/4'), h('a/4'),
      // Measure 7: on the sil-ver tide (do mi sol mi)
      q('g/4'), q('b/4'), q('d/5'), q('b/4'),
      // Measure 8: we flow (do)
      h('g/4'), h('g/4'),
    ],
  },

  {
    id: 'merrily-we-roll-along',
    title: 'Merrily We Roll Along',
    level: 2,
    description: 'A bright and bouncy tune with a satisfying D at the top.',
    notes: [
      q('b/4'), q('a/4'), q('g/4'), q('a/4'), q('b/4'), q('b/4'), h('b/4'),
      q('a/4'), q('a/4'), h('a/4'), q('b/4'), q('d/5'), h('d/5'),
      q('b/4'), q('a/4'), q('g/4'), q('a/4'), q('b/4'), q('b/4'), q('b/4'), q('b/4'),
      q('a/4'), q('a/4'), q('b/4'), q('a/4'), h('g/4'),
    ],
  },

  {
    id: 'rigadoon',
    title: 'Rigadoon (Purcell)',
    level: 2,
    description: 'A sprightly baroque dance by Henry Purcell.',
    notes: [
      q('d/5'), q('c/5'), q('b/4'), q('c/5'),
      q('d/5'), q('g/4'), h('g/4'),
      q('d/5'), q('c/5'), q('b/4'), q('c/5'),
      h('d/5'), h('g/4'),
      q('c/5'), q('b/4'), q('a/4'), q('b/4'),
      q('c/5'), q('g/4'), h('g/4'),
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      hd('g/4'),
    ],
  },

  // ── Level 2 stubs ──────────────────────────
  {
    id: 'cabs',
    title: 'CABs',
    level: 2,
    description: 'An exercise introducing C alongside your A and B.',
    notes: [
      // Measure 1: C D C B
      q('c/5'), q('d/5'), q('c/5'), q('b/4'),
      // Measure 2: A B A hold
      q('a/4'), q('b/4'), h('a/4'),
      // Measure 3: C B A G
      q('c/5'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 4: A hold
      h('a/4'), h('a/4'),
      // Measure 5: D C B A
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 6: G A B C
      q('g/4'), q('a/4'), q('b/4'), q('c/5'),
      // Measure 7: D C B A
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 8: long G
      h('g/4'), h('g/4'),
    ],
  },

  {
    id: 'clown-dance',
    title: 'Clown Dance',
    level: 2,
    description: 'A fun, bouncy piece using C, B, A and G.',
    notes: [
      // Measure 1
      q('c/5'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 2
      q('a/4'), q('b/4'), h('c/5'),
      // Measure 3
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 4
      h('g/4'), h('g/4'),
      // Measure 5
      e('c/5'), e('c/5'), q('b/4'), e('a/4'), e('a/4'), q('g/4'),
      // Measure 6
      q('a/4'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 7
      q('d/5'), q('b/4'), q('c/5'), q('a/4'),
      // Measure 8
      h('g/4'), h('g/4'),
    ],
  },

  {
    id: 'andrew-mine-jasper-mine',
    title: 'Andrew Mine, Jasper Mine',
    level: 2,
    description: 'A medieval round that\'s great for ensemble playing.',
    notes: [
      // Measure 1: G A B C
      q('g/4'), q('a/4'), q('b/4'), q('c/5'),
      // Measure 2: D C B hold
      q('d/5'), q('c/5'), h('b/4'),
      // Measure 3: C D C B
      q('c/5'), q('d/5'), q('c/5'), q('b/4'),
      // Measure 4: A hold
      h('a/4'), h('a/4'),
      // Measure 5: B C D B
      q('b/4'), q('c/5'), q('d/5'), q('b/4'),
      // Measure 6: C B A G
      q('c/5'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 7: A B A G
      q('a/4'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 8: long G
      h('g/4'), h('g/4'),
    ],
  },

  {
    id: 'fais-do-do',
    title: 'Fais do-do',
    level: 2,
    description: 'A French Creole lullaby — warm and gentle.',
    notes: [
      // Measure 1: "Fais do-do, 'Cola mon p'tit frère"
      q('g/4'), q('a/4'), h('b/4'),
      // Measure 2
      q('c/5'), q('b/4'), h('a/4'),
      // Measure 3
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 4
      h('g/4'), h('g/4'),
      // Measure 5
      q('b/4'), q('c/5'), q('d/5'), q('c/5'),
      // Measure 6
      q('b/4'), q('a/4'), h('b/4'),
      // Measure 7
      q('a/4'), q('g/4'), q('a/4'), q('b/4'),
      // Measure 8
      h('g/4'), h('g/4'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 3 — adds E5, F5, F#5
  // ════════════════════════════════════════════════════

  {
    id: 'twinkle-twinkle',
    title: 'Twinkle Twinkle Little Star',
    level: 3,
    description: 'A favourite that stretches up to your new high E.',
    notes: [
      q('g/4'), q('g/4'), q('d/5'), q('d/5'), q('e/5'), q('e/5'), h('d/5'),
      q('c/5'), q('c/5'), q('b/4'), q('b/4'), q('a/4'), q('a/4'), h('g/4'),
      q('d/5'), q('d/5'), q('c/5'), q('c/5'), q('b/4'), q('b/4'), h('a/4'),
      q('d/5'), q('d/5'), q('c/5'), q('c/5'), q('b/4'), q('b/4'), h('a/4'),
      q('g/4'), q('g/4'), q('d/5'), q('d/5'), q('e/5'), q('e/5'), h('d/5'),
      q('c/5'), q('c/5'), q('b/4'), q('b/4'), q('a/4'), q('a/4'), h('g/4'),
    ],
  },

  {
    id: 'greensleeves',
    title: 'Greensleeves',
    level: 3,
    beatsPerMeasure: 3,
    description: 'A haunting English folk song in waltz time.',
    notes: [
      q('a/4'), q('c/5'), q('d/5'), hd('e/5'),
      q('f/5'), q('e/5'), q('d/5'), hd('b/4'),
      q('g/4'), q('b/4'), q('c/5'), hd('d/5'),
      q('e/5'), q('c/5'), q('a/4'), hd('a/4'),
      q('a/4'), q('c/5'), q('d/5'), hd('e/5'),
      q('f/5'), q('e/5'), q('d/5'), hd('b/4'),
      q('g/4'), q('e/5'), q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      hd('a/4'),
    ],
  },

  {
    id: 'minuet-in-g',
    title: 'Minuet in G',
    level: 3,
    beatsPerMeasure: 3,
    description: 'A graceful baroque minuet — perfect for smooth tone.',
    notes: [
      q('d/5'), q('g/4'), q('a/4'), q('b/4'), q('c/5'), q('d/5'),
      hd('g/4'),
      q('e/5'), q('c/5'), q('d/5'), q('e/5'), q('f/5'), q('d/5'),
      hd('c/5'),
      q('b/4'), q('c/5'), q('d/5'), hd('g/4'),
      hd('d/5'),
      q('g/4'), q('a/4'), q('b/4'), q('c/5'), q('d/5'), q('b/4'),
      hd('g/4'),
    ],
  },

  {
    id: 'pop-goes-the-weasel',
    title: 'Pop! Goes the Weasel',
    level: 3,
    description: 'A quick and playful tune with a fun surprise ending!',
    notes: [
      q('g/4'), q('c/5'), q('c/5'), q('d/5'), h('e/5'), q('c/5'),
      q('d/5'), q('d/5'), q('e/5'), q('d/5'), q('c/5'), h('b/4'),
      q('g/4'), q('c/5'), q('c/5'), q('d/5'), h('e/5'), q('c/5'),
      q('d/5'), q('b/4'), hd('g/4'),
    ],
  },

  {
    id: 'skip-to-my-lou',
    title: 'Skip to My Lou',
    level: 3,
    description: 'A lively American folk dance song.',
    notes: [
      q('f/5'), q('f/5'), q('f/5'), q('d/5'), q('f/5'), q('f/5'), q('f/5'), q('d/5'),
      q('e/5'), q('e/5'), q('e/5'), q('c/5'), q('e/5'), q('e/5'), q('e/5'), q('c/5'),
      q('f/5'), q('f/5'), q('f/5'), q('d/5'), q('e/5'), q('e/5'), q('e/5'), q('c/5'),
      q('d/5'), q('d/5'), q('e/5'), q('d/5'), hd('f/5'),
    ],
  },

  // ── Level 3 stubs ──────────────────────────
  {
    id: 'waves',
    title: 'Waves',
    level: 3,
    description: 'A flowing piece introducing Bb.',
    notes: [
      // Descending wave: E5 D5 C5 Bb4
      q('e/5'), q('d/5'), q('c/5'), q('bb/4'),
      // Ascend back
      q('c/5'), q('d/5'), h('e/5'),
      // Second wave higher
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Settle
      q('bb/4'), q('c/5'), h('d/5'),
      // Third wave
      q('e/5'), q('f/5'), q('e/5'), q('d/5'),
      // Descend
      q('c/5'), q('bb/4'), q('c/5'), q('d/5'),
      // Gentle close
      q('e/5'), q('d/5'), q('c/5'), q('bb/4'),
      // Final rest on G
      h('a/4'), h('g/4'),
    ],
  },

  {
    id: 'caves',
    title: 'Caves',
    level: 3,
    description: 'A dark, mysterious tune using F, G and A.',
    notes: [
      // Measure 1: descend F5 E5 D5 C5
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 2: B4 hold
      h('b/4'), h('b/4'),
      // Measure 3: dark low figures
      q('d/5'), q('c/5'), q('b/4'), q('a/4'),
      // Measure 4
      h('g/4'), h('g/4'),
      // Measure 5: ascend with mystery
      q('a/4'), q('b/4'), q('c/5'), q('d/5'),
      // Measure 6: reach F5
      q('e/5'), q('f/5'), h('e/5'),
      // Measure 7: descend again
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 8: deep close
      h('b/4'), h('g/4'),
    ],
  },

  {
    id: 'folk-song-german',
    title: 'Folk Song (German)',
    level: 3,
    description: 'A traditional German tune with a gentle feel.',
    notes: [
      // "Alle Vögel sind schon da" style, stepwise C D E F
      // Measure 1
      q('c/5'), q('d/5'), q('e/5'), q('f/5'),
      // Measure 2
      q('e/5'), q('d/5'), h('c/5'),
      // Measure 3
      q('d/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 4
      h('d/5'), h('d/5'),
      // Measure 5
      q('e/5'), q('f/5'), q('e/5'), q('d/5'),
      // Measure 6
      q('c/5'), q('d/5'), h('e/5'),
      // Measure 7
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 8
      h('c/5'), h('c/5'),
    ],
  },

  {
    id: 'apples-and-pears',
    title: 'Apples and Pears',
    level: 3,
    description: 'A catchy English folk tune.',
    notes: [
      // Measure 1
      q('e/5'), q('f/5'), q('e/5'), q('d/5'),
      // Measure 2
      q('c/5'), q('d/5'), h('e/5'),
      // Measure 3
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 4
      h('bb/4'), h('bb/4'),
      // Measure 5
      q('c/5'), q('d/5'), q('e/5'), q('f/5'),
      // Measure 6
      q('e/5'), q('d/5'), h('c/5'),
      // Measure 7
      q('d/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 8
      h('bb/4'), h('c/5'),
    ],
  },

  {
    id: 'the-nightingale',
    title: 'The Nightingale',
    level: 3,
    description: 'A lyrical piece inspired by birdsong.',
    notes: [
      // Measure 1: flowing eighth-note run upward
      e('d/5'), e('e/5'), e('f/5'), e('e/5'), q('d/5'), q('c/5'),
      // Measure 2: held F5
      h('f/5'), h('e/5'),
      // Measure 3: descending trill figure
      e('f/5'), e('e/5'), e('d/5'), e('e/5'), q('f/5'), q('d/5'),
      // Measure 4
      h('c/5'), h('bb/4'),
      // Measure 5: ornamental ascent
      e('c/5'), e('d/5'), e('e/5'), e('f/5'), q('e/5'), q('d/5'),
      // Measure 6
      q('f/5'), q('e/5'), q('d/5'), q('c/5'),
      // Measure 7: songbird call
      e('e/5'), e('f/5'), e('e/5'), e('d/5'), h('c/5'),
      // Measure 8
      h('d/5'), h('c/5'),
    ],
  },

  {
    id: 'pease-pudding-hot',
    title: 'Pease Pudding Hot',
    level: 3,
    description: 'A classic nursery rhyme with a snappy rhythm.',
    notes: [
      // "Pease pudding hot" — B4 A4 G4 feel, extended with C5 D5 E5
      // Measure 1: "Pease pud-ding hot"
      q('b/4'), q('a/4'), q('g/4'), q('a/4'),
      // Measure 2: "pease pud-ding cold"
      q('b/4'), q('a/4'), h('g/4'),
      // Measure 3: "pease pud-ding in the pot"
      e('g/4'), e('a/4'), e('b/4'), e('c/5'), q('d/5'), q('c/5'),
      // Measure 4: "nine days old"
      q('b/4'), q('a/4'), h('g/4'),
      // Measure 5: "Some like it hot"
      q('c/5'), q('d/5'), q('e/5'), q('d/5'),
      // Measure 6: "some like it cold"
      q('c/5'), q('bb/4'), h('a/4'),
      // Measure 7: "some like it in the pot"
      e('bb/4'), e('c/5'), e('d/5'), e('e/5'), q('d/5'), q('c/5'),
      // Measure 8: "nine days old"
      q('bb/4'), q('a/4'), h('g/4'),
    ],
  },

  {
    id: 'down-at-the-station',
    title: 'Down at the Station',
    level: 3,
    description: 'A fun song for practising mid-range notes.',
    notes: [
      // "Down at the station early in the morning"
      // Measure 1
      q('g/4'), q('a/4'), q('b/4'), q('c/5'),
      // Measure 2
      q('d/5'), q('c/5'), h('b/4'),
      // "see the little puffer billies all in a row"
      // Measure 3
      q('e/5'), q('d/5'), q('c/5'), q('b/4'),
      // Measure 4
      q('a/4'), q('g/4'), h('g/4'),
      // "see the engine driver pull the little handle"
      // Measure 5
      q('g/4'), q('b/4'), q('d/5'), q('e/5'),
      // Measure 6
      q('d/5'), q('c/5'), h('b/4'),
      // "puff puff, peep peep, off we go"
      // Measure 7
      e('e/5'), e('e/5'), e('d/5'), e('d/5'), e('c/5'), e('c/5'), q('b/4'),
      // Measure 8
      h('a/4'), h('g/4'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 4 — adds G5, A5, B5, C6
  // ════════════════════════════════════════════════════

  {
    id: 'scarborough-fair',
    title: 'Scarborough Fair',
    level: 4,
    beatsPerMeasure: 3,
    description: 'A timeless English ballad in waltz time.',
    notes: [
      q('a/4'), h('d/5'), q('f/5'), h('e/5'), q('d/5'),
      h('f/5'), q('a/5'), h('g/5'), q('f/5'),
      h('e/5'), q('g/5'), q('f/5'), q('e/5'),
      hd('d/5'),
      q('a/4'), h('d/5'), q('e/5'), q('f/5'), q('g/5'),
      hd('a/5'),
      q('g/5'), h('f/5'), q('e/5'), h('d/5'),
      hd('a/4'),
    ],
  },

  {
    id: 'simple-gifts',
    title: 'Simple Gifts',
    level: 4,
    description: 'A Shaker hymn — pure, flowing and joyful.',
    notes: [
      q('d/5'), q('d/5'), q('g/5'), q('g/5'), q('a/5'), q('g/5'),
      q('f/5'), q('e/5'), h('d/5'),
      q('d/5'), q('d/5'), q('g/5'), q('g/5'), q('a/5'), q('b/5'),
      q('c/6'), q('b/5'), h('a/5'),
      q('g/5'), q('a/5'), q('b/5'), q('c/6'), q('b/5'), q('a/5'),
      q('g/5'), q('e/5'), h('d/5'),
      q('d/5'), q('g/5'), q('g/5'), q('a/5'), q('g/5'), q('f/5'),
      q('e/5'), q('d/5'), h('g/5'),
    ],
  },

  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    level: 4,
    beatsPerMeasure: 3,
    description: 'One of the most beloved hymns — focus on tone and expression.',
    notes: [
      q('d/5'), h('g/5'), q('b/5'), h('g/5'), q('b/5'),
      hd('a/5'), q('f/5'),
      h('g/5'), q('e/5'), h('c/5'), q('e/5'),
      hd('d/5'),
      q('d/5'), h('g/5'), q('b/5'), h('g/5'), q('b/5'),
      hd('a/5'),
      h('g/5'), q('e/5'), h('c/5'), q('a/4'),
      hd('g/5'),
    ],
  },

  {
    id: 'god-save-the-king',
    title: 'God Save the King',
    level: 4,
    beatsPerMeasure: 3,
    description: 'The British national anthem — stately and ceremonial.',
    notes: [
      q('g/4'), q('g/4'), q('a/4'), h('f/5'), q('e/5'),
      h('d/5'), q('c/5'), h('b/4'), q('a/4'),
      hd('g/4'),
      q('a/4'), q('a/4'), q('b/4'), h('g/5'), q('f/5'),
      h('e/5'), q('d/5'), hd('c/5'),
      q('g/5'), q('g/5'), q('f/5'), h('e/5'), q('f/5'),
      h('g/5'), q('c/5'), h('b/4'), q('a/4'),
      hd('g/5'),
    ],
  },

  // ── Level 4 stubs ──────────────────────────
  {
    id: 'a-tisket-a-tasket',
    title: 'A-tisket, A-tasket',
    level: 4,
    description: 'A peppy American nursery rhyme.',
    notes: [
      // "A-tisket a-tasket a green and yellow basket"
      // Measure 1
      e('b/5'), e('a/5'), q('g/5'), e('a/5'), e('b/5'), q('a/5'),
      // Measure 2
      q('g/5'), q('g/5'), h('g/5'),
      // Measure 3: "I sent a letter to my love"
      e('b/5'), e('a/5'), q('g/5'), e('g/5'), e('a/5'), q('b/5'),
      // Measure 4
      h('a/5'), h('g/5'),
      // Measure 5: "and on the way I dropped it"
      e('g/5'), e('g/5'), e('a/5'), e('a/5'), e('b/5'), e('b/5'), q('a/5'),
      // Measure 6
      q('g/5'), q('a/5'), h('g/5'),
      // Measure 7
      e('b/5'), e('a/5'), q('g/5'), e('a/5'), e('g/5'), q('a/5'),
      // Measure 8
      h('g/5'), h('g/5'),
    ],
  },

  {
    id: 'southwell',
    title: 'Southwell',
    level: 4,
    description: 'A dignified psalm tune from Damon\'s Psalter.',
    notes: [
      // Dignified stepwise psalm tune D5 up to B5
      // Measure 1
      q('d/5'), q('e/5'), q('f/5'), q('g/5'),
      // Measure 2
      h('a/5'), h('g/5'),
      // Measure 3
      q('f/5'), q('g/5'), q('a/5'), q('b/5'),
      // Measure 4
      h('a/5'), h('a/5'),
      // Measure 5
      q('b/5'), q('a/5'), q('g/5'), q('f/5'),
      // Measure 6
      q('e/5'), q('f/5'), h('g/5'),
      // Measure 7
      q('a/5'), q('g/5'), q('f/5'), q('e/5'),
      // Measure 8
      h('d/5'), h('d/5'),
    ],
  },

  {
    id: 'hatikvah',
    title: 'Hatikvah',
    level: 4,
    description: 'The Israeli national anthem — a moving minor melody.',
    notes: [
      // Minor feel: D E F G A, using B natural instead of Bb
      // Measure 1: "Kol od balevav"
      q('d/5'), q('e/5'), q('f/5'), q('g/5'),
      // Measure 2
      h('a/5'), h('a/5'),
      // Measure 3: "pnima"
      q('a/5'), q('g/5'), q('f/5'), q('e/5'),
      // Measure 4
      h('d/5'), h('d/5'),
      // Measure 5: "nefesh yehudi"
      q('d/5'), q('f/5'), q('e/5'), q('d/5'),
      // Measure 6
      q('e/5'), q('f/5'), h('g/5'),
      // Measure 7: "homiya"
      q('a/5'), q('g/5'), q('f/5'), q('e/5'),
      // Measure 8
      h('d/5'), h('d/5'),
    ],
  },

  {
    id: 'the-mocking-bird-song',
    title: 'The Mocking Bird Song',
    level: 4,
    description: 'A cheerful American folk song.',
    notes: [
      // Listen to the mocking bird style, E5 F5 G5 A5
      // Measure 1
      q('e/5'), q('f/5'), q('g/5'), q('a/5'),
      // Measure 2
      h('g/5'), h('f/5'),
      // Measure 3
      q('e/5'), q('g/5'), q('f/5'), q('e/5'),
      // Measure 4
      h('d/5'), h('d/5'),
      // Measure 5
      e('a/5'), e('g/5'), e('a/5'), e('g/5'), q('f/5'), q('e/5'),
      // Measure 6
      q('g/5'), q('a/5'), h('g/5'),
      // Measure 7
      q('f/5'), q('e/5'), q('d/5'), q('e/5'),
      // Measure 8
      h('f/5'), h('e/5'),
    ],
  },

  {
    id: 'turn-the-glasses-over',
    title: 'Turn the Glasses Over',
    level: 4,
    description: 'A lively English singing game.',
    notes: [
      // "I've been to Haarlem, I've been to Dover" D5 E5 G5 A5 B5 C6
      // Measure 1
      q('d/5'), q('e/5'), q('g/5'), q('a/5'),
      // Measure 2
      q('b/5'), q('a/5'), h('g/5'),
      // Measure 3
      q('a/5'), q('b/5'), q('c/6'), q('b/5'),
      // Measure 4
      h('a/5'), h('g/5'),
      // Measure 5
      q('g/5'), q('a/5'), q('b/5'), q('a/5'),
      // Measure 6
      q('g/5'), q('e/5'), h('d/5'),
      // Measure 7
      e('d/5'), e('e/5'), e('g/5'), e('a/5'), q('b/5'), q('a/5'),
      // Measure 8
      h('g/5'), h('g/5'),
    ],
  },

  {
    id: 'annies-song',
    title: "Annie's Song",
    level: 4,
    beatsPerMeasure: 3,
    description: 'John Denver\'s beautiful nature tribute.',
    notes: [
      // "You fill up my senses" waltz — G5 A5 B5 C6 with f#/5
      // Measure 1: "You fill up my"
      q('d/5'), q('f#/5'), q('a/5'),
      // Measure 2: "sen-ses"
      h('b/5'), q('a/5'),
      // Measure 3: "like a night in a"
      q('g/5'), q('f#/5'), q('g/5'),
      // Measure 4: "for-est"
      hd('a/5'),
      // Measure 5: "like the mountains in"
      q('a/5'), q('b/5'), q('c/6'),
      // Measure 6: "spring-time"
      h('b/5'), q('a/5'),
      // Measure 7: "like a walk in the"
      q('g/5'), q('f#/5'), q('g/5'),
      // Measure 8: "rain"
      hd('a/5'),
      // Measure 9: "like a storm in the"
      q('g/5'), q('a/5'), q('b/5'),
      // Measure 10: "des-ert"
      h('a/5'), q('g/5'),
      // Measure 11: "like a sleepy blue"
      q('f#/5'), q('g/5'), q('a/5'),
      // Measure 12: "o-cean"
      hd('g/5'),
    ],
  },

  {
    id: 'mr-frogs-wedding',
    title: "Mr. Frog's Wedding",
    level: 4,
    description: 'A quirky and fun folk tale song.',
    notes: [
      // "Frog Went a-Courtin'" D5 E5 G5 A5 B5
      // Measure 1: "Frog went a-courtin' and he did ride"
      q('d/5'), q('e/5'), q('g/5'), q('g/5'),
      // Measure 2
      q('a/5'), q('g/5'), h('e/5'),
      // Measure 3: "a-hm a-hm"
      q('g/5'), q('a/5'), q('b/5'), q('a/5'),
      // Measure 4
      h('g/5'), h('g/5'),
      // Measure 5: "Frog went a-courtin' and he did ride"
      q('d/5'), q('e/5'), q('g/5'), q('g/5'),
      // Measure 6
      q('a/5'), q('b/5'), h('a/5'),
      // Measure 7: "sword and pistol by his side"
      e('b/5'), e('a/5'), q('g/5'), q('e/5'), q('d/5'),
      // Measure 8: "a-hm"
      h('d/5'), h('d/5'),
    ],
  },

  {
    id: 'away-in-a-manger',
    title: 'Away in a Manger',
    level: 4,
    beatsPerMeasure: 3,
    description: 'A gentle Christmas carol.',
    notes: [
      // "Away in a manger, no crib for a bed"
      // Measure 1: "A-way in a"
      q('g/4'), q('c/5'), q('e/5'),
      // Measure 2: "man-ger, no"
      h('d/5'), q('d/5'),
      // Measure 3: "crib for a"
      q('e/5'), q('c/5'), q('d/5'),
      // Measure 4: "bed"
      hd('b/4'),
      // Measure 5: "the lit-tle Lord"
      q('g/4'), q('b/4'), q('d/5'),
      // Measure 6: "Je-sus laid"
      h('c/5'), q('c/5'),
      // Measure 7: "down his sweet"
      q('e/5'), q('d/5'), q('c/5'),
      // Measure 8: "head"
      hd('b/4'),
      // Measure 9: "the stars in the"
      q('b/4'), q('c/5'), q('d/5'),
      // Measure 10: "bright sky looked"
      h('e/5'), q('e/5'),
      // Measure 11: "down where he"
      q('d/5'), q('e/5'), q('d/5'),
      // Measure 12: "lay"
      hd('c/5'),
    ],
  },

  {
    id: 'johnny-todd',
    title: 'Johnny Todd',
    level: 4,
    description: 'A melancholy English sea shanty.',
    notes: [
      // Minor feel D5 E5 f#/5 G5 A5
      // Measure 1
      q('d/5'), q('e/5'), q('f#/5'), q('g/5'),
      // Measure 2
      h('a/5'), h('g/5'),
      // Measure 3
      q('f#/5'), q('e/5'), q('d/5'), q('e/5'),
      // Measure 4
      h('d/5'), h('d/5'),
      // Measure 5
      q('g/5'), q('a/5'), q('g/5'), q('f#/5'),
      // Measure 6
      q('e/5'), q('d/5'), h('e/5'),
      // Measure 7
      q('d/5'), q('f#/5'), q('e/5'), q('d/5'),
      // Measure 8
      h('d/5'), h('d/5'),
    ],
  },

  {
    id: 'morning-has-broken',
    title: 'Morning Has Broken',
    level: 4,
    beatsPerMeasure: 3,
    description: 'Cat Stevens\' famous hymn, originally in 9/8.',
    notes: [
      // "Morning has broken like the first morning" D5 E5 f#/5 G5 A5
      // Measure 1: "Mor-ning has"
      q('d/5'), q('e/5'), q('f#/5'),
      // Measure 2: "bro-ken"
      h('g/5'), q('f#/5'),
      // Measure 3: "like the first"
      q('e/5'), q('d/5'), q('e/5'),
      // Measure 4: "mor-ning"
      hd('d/5'),
      // Measure 5: "black-bird has"
      q('d/5'), q('f#/5'), q('a/5'),
      // Measure 6: "spo-ken"
      h('g/5'), q('e/5'),
      // Measure 7: "like the first"
      q('f#/5'), q('e/5'), q('d/5'),
      // Measure 8: "bird"
      hd('d/5'),
      // Measure 9: "praise for the"
      q('g/5'), q('a/5'), q('g/5'),
      // Measure 10: "sing-ing"
      h('f#/5'), q('e/5'),
      // Measure 11: "praise for the"
      q('d/5'), q('e/5'), q('f#/5'),
      // Measure 12: "morn-ing"
      hd('g/5'),
    ],
  },

  {
    id: 'surprise-symphony-theme',
    title: 'Theme from Surprise Symphony',
    level: 4,
    description: 'Haydn\'s gentle theme with a sudden surprise.',
    notes: [
      // Haydn Symphony No.94 "Surprise" — gentle G5 A5 B5 C6 theme
      // Measure 1
      q('g/5'), q('g/5'), q('g/5'), q('g/5'),
      // Measure 2
      h('c/6'), h('b/5'),
      // Measure 3
      q('a/5'), q('a/5'), q('a/5'), q('a/5'),
      // Measure 4
      h('d/5'), h('d/5'),
      // Measure 5 (repeated, "surprise" — same theme!)
      q('g/5'), q('g/5'), q('g/5'), q('g/5'),
      // Measure 6
      h('c/6'), h('b/5'),
      // Measure 7: development
      q('b/5'), q('a/5'), q('b/5'), q('c/6'),
      // Measure 8
      h('b/5'), h('g/5'),
    ],
  },

  {
    id: 'o-mio-babbino-caro',
    title: 'O mio babbino caro',
    level: 4,
    beatsPerMeasure: 3,
    description: 'Puccini\'s soaring operatic melody.',
    notes: [
      // Puccini — soaring G5 A5 B5 C6, with f#/5, E5, D5
      // Measure 1: "O mio bab-"
      q('g/5'), q('a/5'), q('b/5'),
      // Measure 2: "-bi-no ca-ro"
      h('c/6'), q('b/5'),
      // Measure 3: "mi pia-ce è"
      q('a/5'), q('b/5'), q('a/5'),
      // Measure 4: "bel-lo bel-lo"
      hd('g/5'),
      // Measure 5: "vò an-da-re"
      q('g/5'), q('f#/5'), q('g/5'),
      // Measure 6: "a Por-ta"
      h('a/5'), q('g/5'),
      // Measure 7: "Ros-sa"
      q('f#/5'), q('e/5'), q('d/5'),
      // Measure 8: held
      hd('e/5'),
      // Measure 9: "a com-pe-rar"
      q('g/5'), q('a/5'), q('b/5'),
      // Measure 10: "l'a-nel-lo"
      h('c/6'), q('a/5'),
      // Measure 11: resolution
      q('g/5'), q('f#/5'), q('e/5'),
      // Measure 12
      hd('g/5'),
    ],
  },

  {
    id: 'plaisir-damour',
    title: "Plaisir d'amour",
    level: 4,
    description: 'A romantic French melody by Martini.',
    notes: [
      // "Plaisir d'amour" G5 f#/5 E5 D5 A5 B5
      // Measure 1
      q('g/5'), q('f#/5'), q('e/5'), q('d/5'),
      // Measure 2
      h('e/5'), h('d/5'),
      // Measure 3
      q('d/5'), q('e/5'), q('f#/5'), q('g/5'),
      // Measure 4
      h('a/5'), h('a/5'),
      // Measure 5
      q('b/5'), q('a/5'), q('g/5'), q('f#/5'),
      // Measure 6
      q('e/5'), q('d/5'), h('e/5'),
      // Measure 7
      q('g/5'), q('f#/5'), q('e/5'), q('d/5'),
      // Measure 8
      h('d/5'), h('d/5'),
    ],
  },

  {
    id: 'listen-to-the-mocking-bird',
    title: 'Listen to the Mocking Bird',
    level: 4,
    description: 'A lively 19th-century American song.',
    notes: [
      // Eighth-note runs E5 F5 G5 A5
      // Measure 1: "Lis-ten to the mock-ing bird"
      e('e/5'), e('g/5'), e('f/5'), e('g/5'), e('e/5'), e('g/5'), q('a/5'),
      // Measure 2
      h('g/5'), h('g/5'),
      // Measure 3: "lis-ten to the mock-ing bird"
      e('e/5'), e('g/5'), e('f/5'), e('g/5'), e('e/5'), e('g/5'), q('a/5'),
      // Measure 4
      h('g/5'), h('f/5'),
      // Measure 5: "the mock-ing bird is sing-ing o'er her grave"
      e('e/5'), e('f/5'), e('g/5'), e('a/5'), q('g/5'), q('f/5'),
      // Measure 6
      q('e/5'), q('g/5'), h('a/5'),
      // Measure 7
      e('g/5'), e('f/5'), e('e/5'), e('f/5'), q('g/5'), q('e/5'),
      // Measure 8
      h('f/5'), h('e/5'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 5 — adds low E4, F4, F#4
  // ════════════════════════════════════════════════════

  {
    id: 'low-note-ladder',
    title: 'Low Note Ladder',
    level: 5,
    description: 'A warm-up that climbs through your three new low notes — E, F and F#.',
    notes: [
      // Measure 1: chromatic climb E F F# G
      q('e/4'), q('f/4'), q('f#/4'), q('g/4'),
      // Measure 2: step back down
      q('f#/4'), q('f/4'), q('e/4'), q('f/4'),
      // Measure 3: wiggle around F# and F
      q('f#/4'), q('g/4'), q('f#/4'), q('f/4'),
      // Measure 4: rest on low E
      h('e/4'), h('e/4'),
      // Measure 5: climb again
      q('e/4'), q('f/4'), q('f#/4'), q('g/4'),
      // Measure 6: descend from A
      q('a/4'), q('g/4'), q('f#/4'), q('f/4'),
      // Measure 7: final climb
      q('e/4'), q('f/4'), q('f#/4'), q('g/4'),
      // Measure 8: settle low
      h('f#/4'), h('e/4'),
    ],
  },

  {
    id: 'camptown-races',
    title: 'Camptown Races',
    level: 5,
    description: 'A bouncy American tune — every "doo-dah" lands on low E.',
    notes: [
      // Measure 1: Camp-town la-dies
      q('g/4'), q('g/4'), q('e/4'), q('g/4'),
      // Measure 2: sing this song, doo-dah
      q('a/4'), q('g/4'), h('e/4'),
      // Measure 3: Camp-town race-track
      q('g/4'), q('g/4'), q('e/4'), q('g/4'),
      // Measure 4: five miles long, doo-dah
      q('a/4'), q('g/4'), h('e/4'),
      // Measure 5: Goin' to run all night
      q('d/5'), q('d/5'), q('b/4'), q('d/5'),
      // Measure 6: Goin' to run all day
      q('d/5'), q('b/4'), q('g/4'), q('a/4'),
      // Measure 7: bet my money on the bob-tail nag
      q('g/4'), q('g/4'), q('e/4'), q('g/4'),
      // Measure 8: somebody bet on the bay
      q('a/4'), q('g/4'), h('e/4'),
    ],
  },

  {
    id: 'au-clair-de-la-lune-low',
    title: 'Au clair de la lune (Low)',
    level: 5,
    description: 'The French lullaby moved down to the low octave — home base is low F.',
    notes: [
      // Measure 1: Au clair de la
      q('f/4'), q('f/4'), q('f/4'), q('g/4'),
      // Measure 2: lu-ne
      h('a/4'), h('g/4'),
      // Measure 3: mon a-mi Pier-
      q('f/4'), q('a/4'), q('g/4'), q('g/4'),
      // Measure 4: rot
      w('f/4'),
      // Measure 5: Prête-moi ta plume
      q('g/4'), q('g/4'), q('g/4'), q('g/4'),
      // Measure 6: pour é-
      h('d/5'), h('d/5'),
      // Measure 7: cri-re un mot
      q('c/5'), q('a/4'), q('f/4'), q('a/4'),
      // Measure 8: close on low F
      q('g/4'), q('g/4'), h('f/4'),
    ],
  },

  {
    id: 'go-tell-aunt-rhody',
    title: 'Go Tell Aunt Rhody',
    level: 5,
    description: 'A gentle folk song that keeps falling to low F# before resolving home.',
    notes: [
      // Measure 1: Go tell Aunt Rho-dy
      q('b/4'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 2: the old grey goose is dead (F# leading home)
      q('a/4'), q('f#/4'), h('g/4'),
      // Measure 3: the one she's been sav-ing
      q('d/5'), q('d/5'), q('c/5'), q('b/4'),
      // Measure 4: to make a feath-er bed (F# again)
      q('a/4'), q('f#/4'), h('g/4'),
      // Measure 5: Go tell Aunt Rho-dy
      q('b/4'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 6: the old grey goose is dead
      q('a/4'), q('f#/4'), h('g/4'),
    ],
  },

  {
    id: 'little-brown-jug',
    title: 'Little Brown Jug',
    level: 5,
    description: 'A fun American folk song that walks across your full low range.',
    notes: [
      q('e/4'), q('f/4'), q('g/4'), q('e/4'), q('g/4'), q('a/4'), q('b/4'), q('g/4'),
      q('c/5'), q('c/5'), q('d/5'), q('d/5'), q('e/5'), q('e/5'), h('d/5'),
      q('e/4'), q('f/4'), q('g/4'), q('e/4'), q('g/4'), q('a/4'), q('b/4'), q('g/4'),
      q('c/5'), q('c/5'), q('b/4'), q('a/4'), hd('g/4'),
    ],
  },

  {
    id: 'over-the-hills',
    title: 'Over the Hills and Far Away',
    level: 5,
    description: 'A rousing Irish march that climbs from low E up through F# and beyond.',
    notes: [
      // Measure 1
      q('e/4'), q('f#/4'), q('g/4'), q('a/4'),
      // Measure 2
      q('b/4'), q('c/5'), h('d/5'),
      // Measure 3
      q('e/5'), q('d/5'), q('c/5'), q('b/4'),
      // Measure 4
      h('a/4'), h('g/4'),
      // Measure 5: driving eighth notes
      e('g/4'), e('a/4'), e('b/4'), e('c/5'), e('d/5'), e('e/5'), q('d/5'),
      // Measure 6
      q('c/5'), q('b/4'), q('a/4'), q('g/4'),
      // Measure 7: back down to low E
      q('e/4'), q('f#/4'), q('g/4'), q('a/4'),
      // Measure 8: close low
      h('f#/4'), h('e/4'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 6 — adds C#5, Eb5
  // ════════════════════════════════════════════════════

  {
    id: 'happy-birthday',
    title: 'Happy Birthday',
    level: 6,
    beatsPerMeasure: 3,
    description: 'The world\'s most-sung tune, in D major — each "to you" lands on the new C♯.',
    notes: [
      // "Happy birthday to you" — ends on C#
      e('a/4'), e('a/4'), q('b/4'), q('a/4'),
      q('d/5'), h('c#/5'),
      // "Happy birthday to you"
      e('a/4'), e('a/4'), q('b/4'), q('a/4'),
      q('e/5'), h('d/5'),
      // "Happy birthday dear friend" — C# again
      e('a/4'), e('a/4'), q('a/5'), q('f#/5'),
      q('d/5'), q('c#/5'), q('b/4'),
      // "Happy birthday to you"
      e('g/5'), e('g/5'), q('f#/5'), q('d/5'),
      q('e/5'), h('d/5'),
    ],
  },

  {
    id: 'when-the-saints',
    title: 'When the Saints Go Marching In',
    level: 6,
    description: 'A joyful gospel march in B♭ major — built around the new E♭.',
    notes: [
      // "Oh when the saints go marching in"
      q('bb/4'), q('d/5'), q('eb/5'), q('f/5'),
      h('f/5'), h('d/5'),
      q('eb/5'), q('f/5'), h('d/5'),
      // "Oh when the saints go marching in"
      q('bb/4'), q('d/5'), q('eb/5'), q('f/5'),
      h('f/5'), h('d/5'),
      // "I want to be in that number"
      q('eb/5'), q('d/5'), q('c/5'), q('bb/4'),
      q('d/5'), q('d/5'), h('c/5'),
      q('d/5'), q('c/5'), h('bb/4'),
    ],
  },

  {
    id: 'silent-night',
    title: 'Silent Night',
    level: 6,
    beatsPerMeasure: 3,
    description: 'The beloved Christmas carol in D major — "all is calm" lands on the new C♯.',
    notes: [
      // Si-lent night
      qd('a/4'), e('b/4'), q('a/4'),
      hd('f#/4'),
      // Ho-ly night
      qd('a/4'), e('b/4'), q('a/4'),
      hd('f#/4'),
      // All is calm (C# = "calm")
      qd('e/5'), e('e/5'), q('c#/5'),
      // all is bright
      qd('d/5'), e('d/5'), q('a/4'),
    ],
  },

  {
    id: 'beethoven-fifth',
    title: "Beethoven's 5th (Fate Motif)",
    level: 6,
    description: 'The most famous four notes in classical music — the falling note is the new E♭.',
    notes: [
      q('g/5'), q('g/5'), q('g/5'), q('eb/5'),
      q('f/5'), q('f/5'), q('f/5'), q('d/5'),
      q('g/5'), q('g/5'), q('g/5'), q('eb/5'),
      q('f/5'), q('f/5'), q('f/5'), q('d/5'),
    ],
  },

  {
    id: 'mountain-king',
    title: 'In the Hall of the Mountain King',
    level: 6,
    description: "Grieg's creeping theme that builds and builds — climbs through the new C♯.",
    notes: [
      e('b/4'), e('c#/5'), e('d/5'), e('e/5'), e('f#/5'), e('d/5'), q('f#/5'),
      e('f#/5'), e('e/5'), e('d/5'), e('e/5'), e('d/5'), e('c#/5'), q('b/4'),
      e('b/4'), e('c#/5'), e('d/5'), e('e/5'), e('f#/5'), e('d/5'), q('f#/5'),
      e('f#/5'), e('e/5'), e('d/5'), e('e/5'), e('d/5'), e('c#/5'), q('b/4'),
    ],
  },

  {
    id: 'yankee-doodle',
    title: 'Yankee Doodle',
    level: 6,
    description: 'A bouncy American favourite in D major — "macaroni" turns on the new C♯.',
    notes: [
      q('d/5'), q('d/5'), q('e/5'), q('f#/5'),
      q('d/5'), q('f#/5'), h('e/5'),
      q('d/5'), q('d/5'), q('e/5'), q('f#/5'),
      q('d/5'), q('c#/5'), h('d/5'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 7 — adds G#4, G#5
  // ════════════════════════════════════════════════════

  {
    id: 'my-country-tis-of-thee',
    title: "My Country 'Tis of Thee",
    level: 7,
    beatsPerMeasure: 3,
    description: 'Also known as "God Save the Queen" — in A major, the new G♯ is the note that pulls home.',
    notes: [
      // "My coun-try"
      q('a/4'), q('a/4'), q('b/4'),
      // "'tis of thee" — G# leading to A
      q('g#/4'), q('a/4'), q('b/4'),
      // "sweet land of"
      q('c#/5'), q('c#/5'), q('d/5'),
      // "li-ber-ty"
      q('c#/5'), q('b/4'), q('a/4'),
      // "of thee I" — G# again
      q('b/4'), q('a/4'), q('g#/4'),
      // "sing"
      hd('a/4'),
    ],
  },

  {
    id: 'joy-to-the-world',
    title: 'Joy to the World',
    level: 7,
    description: 'A descending A-major scale — the new G♯ sits right below the top note.',
    notes: [
      // "Joy to the world" — G# is the 2nd note
      q('a/5'), q('g#/5'), q('f#/5'), q('e/5'),
      // "the Lord is come"
      q('d/5'), q('c#/5'), q('b/4'), q('a/4'),
      // "Let earth re-ceive"
      q('e/5'), q('e/5'), q('f#/5'), q('f#/5'),
      // "her King" — G# again
      q('g#/5'), q('g#/5'), h('a/5'),
      // "and heaven and na-ture"
      q('a/5'), q('f#/5'), q('e/5'), q('d/5'),
      // "...sing"
      q('c#/5'), q('b/4'), h('a/4'),
    ],
  },

  {
    id: 'fur-elise',
    title: 'Für Elise',
    level: 7,
    description: "Beethoven's famous piano tune — uses both your new notes, G♯ and E♭ (written here as D♯).",
    notes: [
      e('e/5'), e('eb/5'), e('e/5'), e('eb/5'), e('e/5'), e('b/4'), e('d/5'), e('c/5'),
      q('a/4'), q('c/5'), q('e/5'), q('a/4'),
      q('b/4'), q('e/4'), q('g#/4'), q('b/4'),
      q('c/5'), q('b/4'), q('eb/5'), q('e/5'),
    ],
  },

  {
    id: 'frere-jacques',
    title: 'Frère Jacques',
    level: 7,
    description: 'The classic round, here in E major so the new G♯ rings out as the third note.',
    notes: [
      q('e/4'), q('f#/4'), q('g#/4'), q('e/4'),
      q('e/4'), q('f#/4'), q('g#/4'), q('e/4'),
      q('g#/4'), q('a/4'), h('b/4'),
      q('g#/4'), q('a/4'), h('b/4'),
      e('b/4'), e('c#/5'), e('b/4'), e('a/4'), q('g#/4'), q('e/4'),
      e('b/4'), e('c#/5'), e('b/4'), e('a/4'), q('g#/4'), q('e/4'),
      q('e/4'), q('b/4'), h('e/4'),
      q('e/4'), q('b/4'), h('e/4'),
    ],
  },

  {
    id: 'morning-mood',
    title: 'Morning Mood (Grieg)',
    level: 7,
    description: 'The peaceful sunrise melody from "Peer Gynt" — a gentle E-major tune built around G♯.',
    notes: [
      q('g#/5'), q('f#/5'), q('e/5'), q('c#/5'),
      q('b/4'), q('c#/5'), q('e/5'), q('f#/5'),
      q('g#/5'), q('f#/5'), q('e/5'), q('c#/5'),
      q('e/5'), q('f#/5'), h('g#/5'),
    ],
  },

  {
    id: 'vivaldi-spring',
    title: 'Spring (Vivaldi)',
    level: 7,
    description: 'The sunny opening of "The Four Seasons" — an E-major theme that sparkles on G♯.',
    notes: [
      q('e/5'), q('g#/5'), q('g#/5'), q('g#/5'),
      q('f#/5'), q('g#/5'), q('a/5'), q('g#/5'),
      q('f#/5'), q('e/5'), q('e/5'), q('e/5'),
      q('b/4'), q('e/5'), h('g#/5'),
    ],
  },

  // ════════════════════════════════════════════════════
  // LEVEL 8 — adds C#6, D6
  // ════════════════════════════════════════════════════

  {
    id: 'joy-to-the-world-high',
    title: 'Joy to the World — Top Octave',
    level: 8,
    description: 'The same joyful scale you learned in Level 7, lifted to the very top — high C♯ and D.',
    notes: [
      // "Joy to the world" — starts on high D, then C#
      q('d/6'), q('c#/6'), q('b/5'), q('a/5'),
      // "the Lord is come"
      q('g/5'), q('f#/5'), q('e/5'), q('d/5'),
      // "Let earth re-ceive"
      q('a/5'), q('a/5'), q('b/5'), q('b/5'),
      // "her King" — high C# and D
      q('c#/6'), q('c#/6'), h('d/6'),
      // "and heaven and na-ture"
      q('d/6'), q('b/5'), q('a/5'), q('g/5'),
      // "...sing"
      q('f#/5'), q('e/5'), h('d/5'),
    ],
  },

  {
    id: 'sky-high-ladder',
    title: 'Sky-High Ladder',
    level: 8,
    description: 'A top-of-the-range warm-up that drills the two highest notes — C♯ and D.',
    notes: [
      // Climb to high D
      q('a/5'), q('b/5'), q('c#/6'), q('d/6'),
      // Step around the top
      q('c#/6'), q('b/5'), q('a/5'), q('b/5'),
      // Wiggle at the very top
      q('c#/6'), q('d/6'), q('c#/6'), q('b/5'),
      // Rest high
      h('a/5'), h('a/5'),
      // Climb again
      q('a/5'), q('b/5'), q('c#/6'), q('d/6'),
      // Down
      q('d/6'), q('c#/6'), q('b/5'), q('a/5'),
      // Final climb
      q('b/5'), q('c#/6'), q('d/6'), q('c#/6'),
      // Settle on high D
      q('b/5'), q('c#/6'), h('d/6'),
    ],
  },

  {
    id: 'eine-kleine',
    title: 'Eine kleine Nachtmusik',
    level: 8,
    description: "Mozart's sparkling serenade — the rocketing theme leaps up to the new high D.",
    notes: [
      q('g/5'), q('d/5'), q('g/5'), q('d/5'),
      q('g/5'), q('b/5'), q('d/6'), q('g/5'),
      q('d/5'), q('a/5'), q('d/5'), q('a/5'),
      q('d/5'), q('f#/5'), h('a/5'),
    ],
  },

  {
    id: 'william-tell',
    title: 'William Tell Overture',
    level: 8,
    description: 'Rossini\'s galloping finale (the "Lone Ranger" theme) — charges up to high C♯ and D.',
    notes: [
      e('a/5'), e('a/5'), q('a/5'), e('a/5'), e('a/5'), q('a/5'),
      e('a/5'), e('a/5'), q('a/5'), q('d/6'), q('a/5'),
      e('b/5'), e('b/5'), q('b/5'), e('b/5'), e('b/5'), q('b/5'),
      e('c#/6'), e('c#/6'), q('c#/6'), h('d/6'),
    ],
  },

  {
    id: 'handel-hornpipe',
    title: 'Hornpipe (Water Music)',
    level: 8,
    description: "Handel's grand baroque dance — a stately D-major tune touching high C♯ and D.",
    notes: [
      q('d/6'), q('a/5'), q('b/5'), q('c#/6'),
      q('d/6'), q('d/6'), h('a/5'),
      q('b/5'), q('c#/6'), q('d/6'), q('a/5'),
      q('f#/5'), q('a/5'), h('d/6'),
    ],
  },

  {
    id: 'turkey-in-the-straw',
    title: 'Turkey in the Straw',
    level: 8,
    description: 'A lively American hoedown lifted to the top octave — skips across high C♯ and D.',
    notes: [
      q('d/6'), q('c#/6'), q('b/5'), q('a/5'),
      q('b/5'), q('a/5'), q('g/5'), q('f#/5'),
      q('g/5'), q('a/5'), q('b/5'), q('c#/6'),
      q('d/6'), q('a/5'), h('d/6'),
    ],
  },
]
