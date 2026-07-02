const C = {
  thumb:      '#7c3aed',
  left:       '#2563eb',
  right:      '#16a34a',
  aux:        '#94a3b8',
  tube:       '#e2e8f0',
  tubeStroke: '#94a3b8',
}

const TUBE_TOP = 98
const TUBE_BOT = 150
const TUBE_MID = 124
const MAIN_R   = 18    // main finger-key radius
const AUX_R    = 9     // small aux key radius

export function FluteKeyMap() {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-md">
      <h2 className="mb-1 text-xl font-bold text-[#2D2D2D]" style={{ fontFamily: "'Nunito', sans-serif" }}>
        Flute Key Reference
      </h2>
      <p className="mb-4 text-sm text-[#666666]" style={{ fontFamily: "'Nunito', sans-serif" }}>
        How the numbered keys in the fingering charts map to the actual keys on a concert flute.
        Coloured keys are used in these exercises — grey keys are extras on a real flute.
      </p>

      <div className="overflow-x-auto rounded-xl bg-[#FAF4EE] p-4">
        <svg
          viewBox="0 0 755 210"
          className="h-auto w-full min-w-[580px]"
          role="img"
          aria-label="Concert flute key reference diagram"
        >
          <title>Concert flute key reference diagram</title>

          {/* ── GROUP LABELS ────────────────────────── */}
          <text x="268" y="14" textAnchor="middle" fontSize="11" fill="#1d4ed8" fontWeight="800">LEFT HAND</text>
          <rect x="163" y="18" width="212" height="1.5" fill="#bfdbfe" rx="1" />
          <text x="530" y="14" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="800">RIGHT HAND</text>
          <rect x="378" y="18" width="262" height="1.5" fill="#bbf7d0" rx="1" />

          {/* ── TUBE BODY ────────────────────────────── */}

          {/* Head joint — wider rounded cap */}
          <rect x="28" y="90" width="122" height="68" rx="34"
            fill={C.tube} stroke={C.tubeStroke} strokeWidth="2" />

          {/* Body tube */}
          <rect x="143" y={TUBE_TOP} width="506" height={TUBE_BOT - TUBE_TOP}
            fill={C.tube} stroke={C.tubeStroke} strokeWidth="2" />
          {/* Cover seam between head and body */}
          <rect x="142" y={TUBE_TOP + 3} width="8" height={TUBE_BOT - TUBE_TOP - 6} fill={C.tube} />

          {/* Foot joint — short section */}
          <rect x="646" y={TUBE_TOP + 6} width="88" height={TUBE_BOT - TUBE_TOP - 12} rx="6"
            fill={C.tube} stroke={C.tubeStroke} strokeWidth="2" />
          {/* Cover seam between body and foot */}
          <rect x="645" y={TUBE_TOP + 9} width="8" height={TUBE_BOT - TUBE_TOP - 18} fill={C.tube} />

          {/* Embouchure hole */}
          <ellipse cx="89" cy={TUBE_MID} rx="16" ry="12"
            fill="white" stroke={C.tubeStroke} strokeWidth="2" />

          {/* ── SMALL AUX KEYS ─────────────────────────────────────── */}
          {/* Sequence: grey · L1 · grey(big) · L2 · L3 · G# · grey · R1 · R2 · R3 */}

          {/* 1. Before LH1 */}
          <circle cx={175} cy={TUBE_MID} r={AUX_R} fill="#f8fafc" stroke={C.aux} strokeWidth="2" />

          {/* 2. Between LH1 and LH2 — same size as main keys */}
          <circle cx={250} cy={TUBE_MID} r={MAIN_R} fill="#f8fafc" stroke={C.aux} strokeWidth="2.5" />

          {/* 3. G# key — sitting on top of the tube (above it) */}
          <circle cx={388} cy={TUBE_TOP - 10} r={AUX_R} fill="#f8fafc" stroke={C.aux} strokeWidth="2" />
          <text x={388} y={TUBE_TOP - 21} textAnchor="middle" fontSize="7" fill={C.aux}>G#</text>

          {/* 4 & 5. Two full-size grey circles before RH1 */}
          <circle cx={400} cy={TUBE_MID} r={MAIN_R} fill="#f8fafc" stroke={C.aux} strokeWidth="2.5" />
          <circle cx={442} cy={TUBE_MID} r={MAIN_R} fill="#f8fafc" stroke={C.aux} strokeWidth="2.5" />

          {/* Foot joint keys */}
          <circle cx={694} cy={TUBE_MID} r={10} fill="#f8fafc" stroke={C.aux} strokeWidth="2" />
          <circle cx={717} cy={TUBE_MID} r={9}  fill="#f8fafc" stroke={C.aux} strokeWidth="2" />

          {/* ── MAIN FINGER KEYS ──────────────────────── */}

          {/* LH1 — left index finger */}
          <circle cx={210} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.left} strokeWidth="3" />
          <text x={210} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.left} fontWeight="800">L1</text>

          {/* LH2 — left middle finger */}
          <circle cx={294} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.left} strokeWidth="3" />
          <text x={294} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.left} fontWeight="800">L2</text>

          {/* LH3 — left ring finger */}
          <circle cx={354} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.left} strokeWidth="3" />
          <text x={354} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.left} fontWeight="800">L3</text>

          {/* RH1 — right index finger */}
          <circle cx={484} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.right} strokeWidth="3" />
          <text x={484} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.right} fontWeight="800">R1</text>

          {/* RH2 — right middle finger */}
          <circle cx={544} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.right} strokeWidth="3" />
          <text x={544} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.right} fontWeight="800">R2</text>

          {/* RH3 — right ring finger */}
          <circle cx={604} cy={TUBE_MID} r={MAIN_R} fill="white" stroke={C.right} strokeWidth="3" />
          <text x={604} y={TUBE_MID + 5} textAnchor="middle" fontSize="12" fill={C.right} fontWeight="800">R3</text>

          {/* ── LH THUMB — half-circles on BOTTOM edge of tube ─ */}

          {/* Bb lever — small half-circle (drawn first, underneath) */}
          <path
            d={`M ${148},${TUBE_BOT} A 11,11 0 0,0 ${170},${TUBE_BOT} Z`}
            fill="white" stroke={C.thumb} strokeWidth="2.5"
          />
          <text x={159} y={TUBE_BOT + 14} textAnchor="middle" fontSize="9" fill={C.thumb} fontWeight="700">♭</text>

          {/* B key (main thumb hole) — larger half-circle */}
          <path
            d={`M ${164},${TUBE_BOT} A 20,20 0 0,0 ${204},${TUBE_BOT} Z`}
            fill="white" stroke={C.thumb} strokeWidth="3"
          />
          <text x={184} y={TUBE_BOT + 18} textAnchor="middle" fontSize="11" fill={C.thumb} fontWeight="800">T</text>

          {/* ── RH4 — half-circle on foot joint bottom edge */}
          <path
            d={`M ${654},${TUBE_BOT - 6} A 16,16 0 0,0 ${686},${TUBE_BOT - 6} Z`}
            fill="white" stroke={C.right} strokeWidth="2.5"
          />
          <text x={670} y={TUBE_BOT + 10} textAnchor="middle" fontSize="10" fill={C.right} fontWeight="800">R4</text>
          <text x={670} y={TUBE_BOT + 22} textAnchor="middle" fontSize="7.5" fill={C.right}>Eb key</text>

          {/* ── SECTION LABELS ────────────────────────── */}

          {/* Head joint bracket */}
          <line x1="30"  y1="168" x2="143" y2="168" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="30"  y1="164" x2="30"  y2="172" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="143" y1="164" x2="143" y2="172" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="87"  y="182" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="700">Head Joint</text>

          {/* Foot joint bracket */}
          <line x1="648" y1="168" x2="737" y2="168" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="648" y1="164" x2="648" y2="172" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="737" y1="164" x2="737" y2="172" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="693" y="182" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="700">Foot Joint</text>

          {/* Embouchure label */}
          <text x="89" y="152" textAnchor="middle" fontSize="7.5" fill="#64748b">lip plate</text>

          {/* LH/RH divider */}
          <line x1="378" y1="26" x2="378" y2="155"
            stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="5 4" />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:flex sm:flex-wrap sm:gap-3">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">
          LH Thumb — T (B key) · ♭ (Bb lever)
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
          Left hand — L1 · L2 · L3
        </span>
        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
          Right hand — R1 · R2 · R3 · R4 (Eb/pinky)
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
          Grey — G# key and other extra keys on a real flute
        </span>
      </div>
    </article>
  )
}
