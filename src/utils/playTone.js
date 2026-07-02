// playTone is async so it can await ctx.resume() before scheduling the
// oscillator — on iOS Safari the context starts suspended and calling
// osc.start() before resume() resolves produces silence.
export async function playTone(frequency, duration = 0.8) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return
  try {
    // Reuse existing AudioContext — avoid creating one per tap
    if (!window._fluteAudio) window._fluteAudio = {}
    let ctx = window._fluteAudio.context
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContextClass()
      window._fluteAudio.context = ctx
    }
    // Must await resume() so the context is running before we schedule audio
    if (ctx.state === 'suspended') await ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (err) {
    console.warn('[playTone] AudioContext error:', err)
  }
}

export const NOTE_FREQUENCIES = {
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  Cs5: 554.37,
  Eb5: 622.25,
  Gs4: 415.30,
  Gs5: 830.61,
  Cs6: 1108.73,
  D6: 1174.66,
}
