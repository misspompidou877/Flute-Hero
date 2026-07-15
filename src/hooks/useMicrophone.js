import { useState, useRef } from 'react'
import { PitchDetector } from 'pitchy'
import { useBadges } from './useBadges'

const FIRST_NOTE_SET = new Set(['B4', 'A4', 'G4'])

// A real flute note is sustained; a tap, a bump, or a spoken syllable is not.
// Only report a pitch once the SAME note has held for this long — transients
// never stay on one semitone long enough to qualify.
const SUSTAIN_MS = 120
// Volume floor (RMS of the time-domain buffer). Below this we treat the frame
// as silence so faint background noise can't trip the detector. 0.012 was too
// strict on iPhone/iPad mics: low notes like G4 (all left-hand fingers down)
// come out quieter and breathier than B4/A4 and were gated out entirely.
const RMS_GATE = 0.008

export function useMicrophone() {
  const [isActive, setIsActive] = useState(false)
  const [note, setNote] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [cents, setCents] = useState(null)
  const rafRef = useRef(null)
  const { earnBadge, earnedBadge, clearEarnedBadge } = useBadges()

  const startListening = async () => {
    try {
      // Disable the browser's voice-oriented processing. noiseSuppression in
      // particular treats a sustained flute tone as "noise" and gates it to
      // near-silence, which is the classic reason pitch detection reads nothing.
      // autoGainControl and echoCancellation also distort a steady instrument
      // tone, so we turn all three off and ask for a raw mic signal.
      const stream = await navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        })

      const context = new AudioContext()
      await context.resume()

      const analyser = context.createAnalyser()
      analyser.fftSize = 2048
      analyser.minDecibels = -100
      analyser.maxDecibels = -10
      analyser.smoothingTimeConstant = 0.85

      const source = context.createMediaStreamSource(stream)
      source.connect(analyser)

      // Keep on window to prevent garbage collection. Use the `context` key
      // (not `ctx`) so playTone.js — which reuses window._fluteAudio.context —
      // shares this live AudioContext instead of silently creating its own.
      window._fluteAudio = { context, analyser, source, stream }

      const detector = PitchDetector.forFloat32Array(2048)
      window._fluteAudio.detector = detector

      setIsActive(true)

      // Candidate tracking for the sustain gate. `candidateNote` is the note we
      // have most recently started seeing; `candidateSince` is when it first
      // appeared. A note is only reported once it has held for SUSTAIN_MS.
      let candidateNote = null
      let candidateSince = 0

      const loop = () => {
        // Audio may have been torn down (stopListening / unmount) while this
        // frame was already queued — bail without rescheduling so we never
        // dereference a null window._fluteAudio.
        const audio = window._fluteAudio
        if (!audio || !audio.analyser) return

        const buf = new Float32Array(2048)
        audio.analyser.getFloatTimeDomainData(buf)

        // RMS = loudness of this frame. Reject quiet frames outright so faint
        // room noise never reaches the pitch detector.
        let sumSquares = 0
        for (let i = 0; i < buf.length; i++) sumSquares += buf[i] * buf[i]
        const rms = Math.sqrt(sumSquares / buf.length)

        const [pitch, clarity] =
          audio.detector.findPitch(
            buf,
            audio.context.sampleRate
          )

        // 0.6 clarity gate: a beginner child's tone is breathy and rarely hits
        // the 0.9+ clarity of a pure sine. 0.7 still rejected the lowest notes
        // (G4 and below) whose flute timbre is harmonic-rich and scores lower
        // clarity than B4/A4 — the sustain gate below handles false positives.
        if (rms >= RMS_GATE && clarity > 0.6 && pitch > 60 && pitch < 1500) {
          const noteNames = [
            'C','C#','D','D#','E','F',
            'F#','G','G#','A','A#','B'
          ]
          const midiNum = 12 *
            (Math.log2(pitch / 440)) + 69
          const roundedMidi = Math.round(midiNum)
          const noteName = noteNames[roundedMidi % 12]
          const octave = Math.floor(roundedMidi / 12) - 1
          const centsOff = Math.round(
            (midiNum - roundedMidi) * 100
          )

          const detectedNote = `${noteName}${octave}`

          // Sustain gate: a transient noise jumps around the pitch scale, so the
          // note it maps to keeps changing and the timer keeps resetting. Only a
          // steadily-held tone stays on one note long enough to be reported.
          const now = performance.now()
          if (detectedNote !== candidateNote) {
            candidateNote = detectedNote
            candidateSince = now
          }

          if (now - candidateSince >= SUSTAIN_MS) {
            setNote(detectedNote)
            // Deliberately NOT rounded: pages time their "held in tune" checks
            // in effects keyed on this value. A steadily-held note rounds to
            // the same integer every frame, so the state never changed, the
            // effect never re-ran, and the hold timer was never re-checked —
            // notes took far too long to register. The raw float wobbles
            // every frame, so dependent effects re-fire continuously. Round
            // at the display site if it's ever shown.
            setFrequency(pitch)
            setCents(centsOff)

            if (FIRST_NOTE_SET.has(detectedNote)) {
              earnBadge('first_notes')
            }
          }
        } else {
          // No clear pitch — reset the candidate and clear stale values so a
          // released note stops registering immediately.
          candidateNote = null
          setNote(null)
          setFrequency(null)
          setCents(null)
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      loop()

    } catch (err) {
      console.error('Mic error:', err)
    }
  }

  const stopListening = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (window._fluteAudio) {
      try { window._fluteAudio.stream?.getTracks().forEach(t => t.stop()) } catch (_) {}
      try { window._fluteAudio.context?.close() } catch (_) {}
      window._fluteAudio = null
    }
    setIsActive(false)
    setNote(null)
    setFrequency(null)
    setCents(null)
  }

  return { note, frequency, cents, isActive, startListening, stopListening, earnedBadge, clearEarnedBadge }
}
