import { useState, useRef } from 'react'
import { PitchDetector } from 'pitchy'
import { useBadges } from './useBadges'

const FIRST_NOTE_SET = new Set(['B4', 'A4', 'G4'])

export function useMicrophone() {
  const [isActive, setIsActive] = useState(false)
  const [note, setNote] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [cents, setCents] = useState(null)
  const rafRef = useRef(null)
  const { earnBadge, earnedBadge, clearEarnedBadge } = useBadges()

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })

      const ctx = new AudioContext()
      await ctx.resume()

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyser.minDecibels = -100
      analyser.maxDecibels = -10
      analyser.smoothingTimeConstant = 0.85

      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      // Keep on window to prevent garbage collection
      window._fluteAudio = { ctx, analyser, source, stream }

      const detector = PitchDetector.forFloat32Array(2048)
      window._fluteAudio.detector = detector

      setIsActive(true)

      const loop = () => {
        // Audio may have been torn down (stopListening / unmount) while this
        // frame was already queued — bail without rescheduling so we never
        // dereference a null window._fluteAudio.
        const audio = window._fluteAudio
        if (!audio || !audio.analyser) return

        const buf = new Float32Array(2048)
        audio.analyser.getFloatTimeDomainData(buf)

        const [pitch, clarity] =
          audio.detector.findPitch(
            buf,
            audio.ctx.sampleRate
          )

        if (clarity > 0.8 && pitch > 60 && pitch < 1500) {
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
          setNote(detectedNote)
          setFrequency(Math.round(pitch))
          setCents(centsOff)

          if (FIRST_NOTE_SET.has(detectedNote)) {
            earnBadge('first_notes')
          }
        } else {
          // No clear pitch — reset so stale values don't mislead consumers
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
      try { window._fluteAudio.ctx?.close() } catch (_) {}
      window._fluteAudio = null
    }
    setIsActive(false)
    setNote(null)
    setFrequency(null)
    setCents(null)
  }

  return { note, frequency, cents, isActive, startListening, stopListening, earnedBadge, clearEarnedBadge }
}
