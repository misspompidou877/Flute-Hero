export const FOUNDATIONS_CONTENT = {
  modules: [
    {
      key: 'noteReading',
      title: 'Read the Notes',
      subtitle: 'Learn your first 5 notes on the staff.',
      emoji: '🎵',
      estimatedMinutes: 5,
      route: '/foundations/noteReading',
    },
    {
      key: 'embouchure',
      title: 'Shape Your Lips',
      subtitle: 'Get a clear, steady sound going.',
      emoji: '💨',
      estimatedMinutes: 5,
      route: '/foundations/embouchure',
    },
    {
      key: 'tonguing',
      title: 'Use Your Tongue',
      subtitle: 'Start and stop notes cleanly.',
      emoji: '👅',
      estimatedMinutes: 5,
      route: '/foundations/tonguing',
    },
    {
      key: 'firstNotes',
      title: 'Play Your First Notes',
      subtitle: 'B, A and G — hear yourself play!',
      emoji: '🎶',
      estimatedMinutes: 10,
      route: '/foundations/firstNotes',
    },
  ],

  noteReading: {
    steps: [
      {
        id: 'staff-intro',
        heading: 'Music lives on 5 lines',
        body: 'These lines are called the **staff**.',
        body2: 'The curly symbol is a **treble clef** — it shows these are the notes for flute.',
        nextLabel: 'Got it →',
      },
      {
        id: 'lines-spaces',
        heading: 'Lines and spaces',
        body: 'Notes sit ON lines or IN spaces between them.',
        body2: 'Tap a line, then tap a space to explore!',
        nextLabel: 'Next →',
        requiresInteraction: true,
      },
      {
        id: 'first-notes',
        heading: 'Your first 5 notes',
        body: 'These are the first notes you will learn to play.',
        body2: 'Tap each one to hear it.',
        nextLabel: 'Next →',
        requiresAllTapped: true,
      },
      {
        id: 'name-game',
        heading: 'Name that note!',
        body: 'Can you remember which is which?',
        body2: 'Tap the right letter for each note.',
        nextLabel: null,
      },
      {
        id: 'crotchet',
        heading: 'The filled-in note',
        body: 'A filled-in note is called a **crotchet**. It lasts for **1 beat**.',
        body2: 'Press play to hear how long it lasts.',
        nextLabel: 'Next →',
      },
      {
        id: 'minim',
        heading: 'The open note',
        body: 'An open note is called a **minim**. It lasts for **2 beats** — twice as long.',
        body2: 'Press play to hear the difference.',
        nextLabel: 'Next →',
      },
      {
        id: 'note-values-quaver',
        heading: 'The quaver',
        body: 'A quaver has a little flag on its stem. It lasts for **half a beat** — quick!',
        body2: 'Two quavers fit into the space of one crotchet.',
        nextLabel: 'I can read music →',
      },
    ],

    timeSignature44: {
      promptLabel: '4/4 — what does that mean? 👆',
      heading: 'The time signature 🎼',
      body: 'The two numbers at the start tell you how the music is counted.\n\nThe **top number** tells you how many beats are in each bar. The **bottom number** tells you what kind of beat — 4 means crotchet beats.\n\nSo **4/4** means: 4 crotchet beats in every bar. Most music uses this!',
      close: 'Got it! ✓',
    },

    timeSignature24: {
      promptLabel: 'Why 2/4 this time? 🤔',
      heading: 'Why 2/4 this time? 🤔',
      body: 'Remember — the top number says how many beats fit in a bar.\n\nTwo quavers together make **one crotchet beat**. So two pairs of quavers only fill **2 beats** — that\'s **2/4** time.\n\nYou\'ll see 2/4 in lots of folk songs and marches!',
      close: 'Got it! ✓',
    },

    quaverStaffCLabel: 'Still 2/4 — four quick quavers still only add up to 2 beats',
  },
}
