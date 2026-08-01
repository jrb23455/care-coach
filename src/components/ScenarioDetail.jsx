import { useState } from 'react'

export default function ScenarioDetail({ scenario, onBack }) {
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [expandedResponse, setExpandedResponse] = useState(0)

  function copyScript(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-5 transition-colors"
      >
        ← Back to Scenarios
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{scenario.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{scenario.title}</h2>
            <span className="text-sm text-gray-500">{scenario.category}</span>
          </div>
        </div>

        {/* Customer script */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Customer says:</p>
          <p className="text-gray-800 italic">"{scenario.customerScript}"</p>
        </div>

        {/* Quick tip */}
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <span className="text-lg">💡</span>
          <p className="text-sm text-amber-800"><strong>Quick tip:</strong> {scenario.quickTip}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response scripts — takes 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Response Scripts</h3>
          {scenario.responses.map((resp, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl border transition-all ${
                expandedResponse === idx ? 'border-blue-400 shadow-sm' : 'border-gray-200'
              }`}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between"
                onClick={() => setExpandedResponse(expandedResponse === idx ? null : idx)}
              >
                <span className="font-medium text-gray-900 text-sm">{resp.label}</span>
                <span className="text-gray-400 text-xs">{expandedResponse === idx ? '▲' : '▼'}</span>
              </button>
              {expandedResponse === idx && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 relative">
                    <p className="text-gray-800 text-sm leading-relaxed">{resp.script}</p>
                    <button
                      onClick={() => copyScript(resp.script, idx)}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      {copiedIdx === idx ? '✓ Copied!' : '📋 Copy script'}
                    </button>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base">🧠</span>
                    <p className="text-xs text-gray-600"><strong>Why this works:</strong> {resp.why}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Don'ts */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">🚫 Don'ts</h3>
            <ul className="space-y-2">
              {scenario.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Trigger phrases */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">🔍 Trigger Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {scenario.triggerPhrases.map((p, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  "{p}"
                </span>
              ))}
            </div>
          </div>

          {/* Escalation path */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">📞 Escalation Path</h3>
            <p className="text-sm text-gray-600">{scenario.escalationPath}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
