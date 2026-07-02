import { useEffect, useRef, useState } from 'react'

const MAX_RMS = 0.25        // RMS value that fills the bar 100%
const THRESHOLD = 0.018     // minimum RMS to count as "sound detected"

export default function MicActivityBar({ onLevel }) {
  const [levelPct, setLevelPct] = useState(0)   // 0–100 for bar width
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState(null)

  // Keep onLevel reference fresh without restarting the audio loop
  const onLevelRef = useRef(onLevel)
  useEffect(() => { onLevelRef.current = onLevel }, [onLevel])

  useEffect(() => {
    let cancelled = false
    let raf = null
    let ctx = null
    let source = null
    let stream = null

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }

        ctx = new (window.AudioContext || window.webkitAudioContext)()
        await ctx.resume()

        const analyser = ctx.createAnalyser()
        analyser.fftSize = 1024
        analyser.smoothingTimeConstant = 0.4

        source = ctx.createMediaStreamSource(stream)
        source.connect(analyser)

        const buf = new Uint8Array(analyser.frequencyBinCount)

        const loop = () => {
          if (cancelled) return
          analyser.getByteTimeDomainData(buf)

          let sum = 0
          for (let i = 0; i < buf.length; i++) {
            const x = (buf[i] - 128) / 128
            sum += x * x
          }
          const rms = Math.sqrt(sum / buf.length)
          const normalized = Math.min(rms / MAX_RMS, 1)

          setLevelPct(normalized * 100)
          setIsDetecting(rms > THRESHOLD)
          if (onLevelRef.current) onLevelRef.current(rms)

          raf = requestAnimationFrame(loop)
        }
        loop()
      } catch (err) {
        if (!cancelled) setError('Microphone not available — check your browser permissions.')
      }
    }

    init()

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      if (source) { try { source.disconnect() } catch (_) {} }
      if (ctx) { try { ctx.close() } catch (_) {} }
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, []) // Audio loop starts once; uses ref for fresh callback

  if (error) {
    return (
      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '16px',
          color: '#999999',
          textAlign: 'center',
        }}
      >
        {error}
      </p>
    )
  }

  return (
    <div>
      {/* Bar container */}
      <div
        style={{
          width: '100%',
          height: '56px',
          borderRadius: '28px',
          background: '#EEEEEE',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${levelPct}%`,
            background: isDetecting
              ? 'linear-gradient(to right, #4CAF50, #66BB6A)'
              : '#CCCCCC',
            borderRadius: '28px',
            transition: 'width 100ms linear',
          }}
        />
      </div>

      {/* Label */}
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: isDetecting ? 600 : 500,
          fontSize: '16px',
          color: isDetecting ? '#4CAF50' : '#999999',
          marginTop: '8px',
          marginBottom: 0,
        }}
      >
        {isDetecting ? 'Sound detected! 🎶' : 'Listening… 🎵'}
      </p>
    </div>
  )
}
