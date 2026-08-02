import { useState } from 'react'
import CoraRobot from './CoraRobot'

const PILLARS = [
  { key: 'understand',  label: 'Understanding customers',    icon: '🎧', color: '#7B3FF2' },
  { key: 'deescalate', label: 'De-escalating anger',         icon: '🛡️', color: '#ec4899' },
  { key: 'respond',    label: 'Responding under pressure',   icon: '👥', color: '#f59e0b' },
  { key: 'resolve',    label: 'Closing & resolving calls',   icon: '🏆', color: '#10b981' },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState(null)

  function finish(navigateToTraining) {
    localStorage.setItem('carecoach_onboarded', '1')
    onDone(navigateToTraining ? chosen : null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="rounded-3xl shadow-2xl max-w-sm w-full p-8"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>

        {step === 0 && (
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <CoraRobot size={120} pose="thumbs" shadow={false} />
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Welcome to CARE Coach!</h1>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
              I'm Cora — your AI call coach for insurance sales. I'll help you handle difficult customers with confidence.
              Let's get you set up in 30 seconds.
            </p>
            <button onClick={() => setStep(1)}
              className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)' }}>
              Let's go →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-black mb-1 text-center" style={{ color: 'var(--text)' }}>
              Where do you want to improve most?
            </h2>
            <p className="text-sm text-center mb-5" style={{ color: 'var(--text-2)' }}>
              Pick your biggest challenge right now
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PILLARS.map(p => (
                <button key={p.key} onClick={() => setChosen(p.key)}
                  className="rounded-2xl p-4 text-left transition-all hover:scale-[1.03]"
                  style={{
                    background: chosen === p.key ? `${p.color}18` : 'var(--bg)',
                    border: `2px solid ${chosen === p.key ? p.color : 'var(--border)'}`,
                  }}>
                  <span className="text-2xl block mb-1">{p.icon}</span>
                  <span className="text-xs font-black leading-snug"
                    style={{ color: chosen === p.key ? p.color : 'var(--text)' }}>{p.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!chosen}
              className="w-full py-3 rounded-2xl font-black text-white text-sm disabled:opacity-40 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)' }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>You're all set!</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
              Start with a quick Training scenario to earn your first XP. It only takes 2 minutes.
            </p>
            <div className="space-y-2">
              <button onClick={() => finish(true)}
                className="w-full py-3 rounded-2xl font-black text-white text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)' }}>
                Start Training →
              </button>
              <button onClick={() => finish(false)}
                className="w-full py-2 text-sm font-semibold transition-opacity hover:opacity-60"
                style={{ color: 'var(--text-3)' }}>
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-full transition-all"
              style={{ width: i === step ? 20 : 6, height: 6, background: i === step ? '#7B3FF2' : 'var(--border)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
