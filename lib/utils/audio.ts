/**
 * Audio Notification Manager using Web Audio API.
 * Synthesizes a crisp, elegant dual-bell chime that works across all modern browsers.
 */

let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx()
    }
  }
  return sharedAudioCtx
}

// Auto-unlock audio context on user interaction
if (typeof window !== 'undefined') {
  const unlock = () => {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    window.removeEventListener('click', unlock)
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('touchstart', unlock)
  }
  window.addEventListener('click', unlock, { passive: true })
  window.addEventListener('keydown', unlock, { passive: true })
  window.addEventListener('touchstart', unlock, { passive: true })
}

/**
 * Plays an audible, pleasant, modern notification chime.
 */
export async function playNotificationSound() {
  if (typeof window === 'undefined') return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const now = ctx.currentTime

    // Master volume
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.3, now)
    masterGain.connect(ctx.destination)

    // Tone 1 - G5 (783.99 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(783.99, now)

    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.8, now + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start(now)
    osc1.stop(now + 0.36)

    // Tone 2 - C6 (1046.50 Hz) - higher pitch confirmation
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1046.50, now + 0.1)

    gain2.gain.setValueAtTime(0, now + 0.1)
    gain2.gain.linearRampToValueAtTime(1.0, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.61)

    // Harmonizer - E6 (1318.51 Hz) - gives a shimmer resonance
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(1318.51, now + 0.1)

    gain3.gain.setValueAtTime(0, now + 0.1)
    gain3.gain.linearRampToValueAtTime(0.25, now + 0.13)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc3.connect(gain3)
    gain3.connect(masterGain)
    osc3.start(now + 0.1)
    osc3.stop(now + 0.51)
  } catch (err) {
    console.warn('[Audio] Could not play notification sound:', err)
  }
}
