import { useState } from 'react'

export default function TechniquePanel({ techniques }) {
  const [activeCard, setActiveCard] = useState(0)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">De-escalation Techniques</h2>
        <p className="text-gray-500 mt-1">Core frameworks and principles for defusing angry customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniques.map((tech, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={() => setActiveCard(activeCard === idx ? null : idx)}
            >
              <span className="text-2xl">{tech.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                <p className="text-sm text-gray-500">{tech.description}</p>
              </div>
              <span className="text-gray-400 text-sm">{activeCard === idx ? '▲' : '▼'}</span>
            </button>

            {activeCard === idx && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="space-y-3">
                  {tech.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {step.letter}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{step.word}</p>
                        <p className="text-sm text-gray-600">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick-reference cheat sheet */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 text-lg mb-4">🗂 Quick-Reference Cheat Sheet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-800 mb-2">Open every angry call with:</p>
            <ol className="space-y-1 text-blue-700 list-decimal list-inside">
              <li>Say their name</li>
              <li>Acknowledge the issue</li>
              <li>Let them finish</li>
              <li>Empathize before explaining</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-2">Powerful phrases:</p>
            <ul className="space-y-1 text-blue-700">
              <li>"I completely understand..."</li>
              <li>"That's not acceptable and I'm sorry."</li>
              <li>"Here's what I CAN do..."</li>
              <li>"I'm personally going to make sure..."</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-2">Always end with:</p>
            <ul className="space-y-1 text-blue-700">
              <li>A specific next step</li>
              <li>A specific time/date</li>
              <li>Your name and callback option</li>
              <li>"Is there anything else I can do?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
