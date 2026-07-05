import { useEffect, useState } from 'react'

export default function BadgeToast({ badge, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!badge) return

    const showTimer = setTimeout(() => setVisible(true), 10)

    const dismissTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [badge])

  if (!badge) return null

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="flex min-w-[280px] items-center gap-4 rounded-2xl border-2 border-[#26CCC2] bg-white px-5 py-4 shadow-2xl" style={{ boxShadow: '0 0 20px rgba(255,245,126,0.5), 0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <span className="text-5xl leading-none">{badge.icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#26CCC2]">
            Badge Unlocked!
          </p>
          <p className="mt-0.5 text-base font-bold text-[#0B3D3A]">{badge.name}</p>
          <p className="text-xs text-[#666666]">{badge.description}</p>
        </div>
      </div>
    </div>
  )
}
