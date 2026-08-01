import { useState } from 'react'

// For each scenario we build a mini roleplay with 3 response choices (one best, one okay, one poor)
const practiceData = [
  {
    scenarioId: 1,
    title: "Claim Denied",
    icon: "❌",
    exchanges: [
      {
        customerLine: "I cannot believe you denied my claim! I've been paying premiums for 10 YEARS and this is how you treat me?",
        choices: [
          { text: "I understand your frustration. Per our policy terms, your claim didn't meet the criteria in section 4.2 of your—", quality: 'poor', feedback: "Leading with policy language while they're still venting is dismissive. They haven't finished expressing their frustration." },
          { text: "Ten years — I hear you, and you deserve a clear explanation. Can I pull up your claim so I can walk you through exactly what happened?", quality: 'best', feedback: "Perfect. You acknowledged the relationship, validated them, and moved toward action without getting defensive." },
          { text: "I'm sorry to hear that. Let me see what I can do.", quality: 'okay', feedback: "Better than the policy-first approach, but vague. 'Let me see what I can do' sets low expectations. Be more specific about the next step." },
        ]
      },
      {
        customerLine: "I don't want excuses. I want my money. What are you going to DO about this?",
        choices: [
          { text: "There's nothing I can do to override the denial decision.", quality: 'poor', feedback: "'Nothing I can do' is almost never true and always sounds like a brush-off. It ends the conversation." },
          { text: "Here's what I can do right now: walk you through the specific denial reason, and then, if you disagree, explain your right to appeal — and I'll help you start that process.", quality: 'best', feedback: "Gives them two concrete things. The appeal path is key — it shows you're actually on their side." },
          { text: "I understand. Let me escalate this to my supervisor.", quality: 'okay', feedback: "Escalation isn't wrong, but offering it before you've tried to solve it yourself can come across as passing the buck." },
        ]
      }
    ]
  },
  {
    scenarioId: 3,
    title: "Slow Claims Processing",
    icon: "⏳",
    exchanges: [
      {
        customerLine: "It's been SIX WEEKS. My car is still at the shop and I've been calling every day getting different answers!",
        choices: [
          { text: "I apologize for the delay. Claims can take time due to the volume we're processing.", quality: 'poor', feedback: "Blaming 'volume' is a non-apology. It explains nothing and helps no one. They don't care about your volume." },
          { text: "Six weeks and still calling every day — that's not okay and I'm sorry. I'm going to stay on this call with you until I have a real answer, not another runaround.", quality: 'best', feedback: "The commitment to stay on the call is the key differentiator. It directly addresses their 'getting different answers' frustration." },
          { text: "I'm so sorry about that. Let me look into your claim.", quality: 'okay', feedback: "Acceptable start, but 'let me look into it' is the same thing every agent says. Add a commitment that's different from what they've already heard." },
        ]
      },
      {
        customerLine: "I've heard 'we're looking into it' five times already. When is this actually getting resolved?",
        choices: [
          { text: "It should be resolved within 5-7 business days.", quality: 'poor', feedback: "Giving a new timeline you can't guarantee is the worst move here. If it misses, you've destroyed the last bit of trust." },
          { text: "I won't give you another estimate I can't back up. What I will do is flag this as a priority, document that you've been waiting since [date], and call you personally by [specific time] with a real update — not a runaround.", quality: 'best', feedback: "Honest about limits. The specific personal callback at a named time is what separates this from every other call they've had." },
          { text: "Let me get a supervisor on the line who can give you a more definitive answer.", quality: 'okay', feedback: "Not bad, but make sure the transfer is warm — brief the supervisor so the customer doesn't have to start over." },
        ]
      }
    ]
  },
  {
    scenarioId: 6,
    title: "Threatening to Cancel",
    icon: "🚪",
    exchanges: [
      {
        customerLine: "I'm done. I'm calling a competitor tomorrow and canceling everything. 12 years and this is how you treat people.",
        choices: [
          { text: "I completely understand. Would you like me to process your cancellation?", quality: 'poor', feedback: "Never lead with processing the cancellation. You haven't tried to retain them at all." },
          { text: "Twelve years — you've earned the right to feel that way if we've let you down. I'd like to understand what happened, because if there's something we got wrong, I want to know if it's fixable.", quality: 'best', feedback: "Leading with the relationship, not a sales pitch. You're asking to understand, not arguing or offering discounts immediately." },
          { text: "I'm sorry to hear that. Can I offer you a discount to stay?", quality: 'okay', feedback: "Jumping to a discount before understanding the issue is a mistake. It signals you're not actually listening, and it rewards anger instead of resolving it." },
        ]
      },
      {
        customerLine: "You can't fix it. You denied my claim and now I'm out thousands of dollars. No discount fixes that.",
        choices: [
          { text: "I understand. Let me process your cancellation then.", quality: 'poor', feedback: "Giving up too easily. You should at minimum explain the appeal process before processing a cancellation." },
          { text: "You're right, a discount doesn't fix a denied claim. What I can do before you make this final: explain the appeal process, which you have every right to, and connect you with someone who reviews these decisions. Would you be willing to let me do that first?", quality: 'best', feedback: "Acknowledges their point directly ('you're right'), then offers something meaningful and tied to their actual problem." },
          { text: "I'll flag your concerns in the system and a manager will call you back.", quality: 'okay', feedback: "Doesn't ask them to stay, doesn't offer a resolution path. The manager callback is too passive at this stage." },
        ]
      }
    ]
  }
]

const QUALITY_STYLES = {
  best: { border: 'border-green-400 bg-green-50', badge: 'bg-green-100 text-green-700', label: 'Best response' },
  okay: { border: 'border-yellow-400 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', label: 'Acceptable' },
  poor: { border: 'border-red-400 bg-red-50', badge: 'bg-red-100 text-red-700', label: 'Avoid this' },
}

export default function PracticeMode() {
  const [selectedPractice, setSelectedPractice] = useState(null)
  const [exchangeIdx, setExchangeIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState({ best: 0, okay: 0, poor: 0 })
  const [finished, setFinished] = useState(false)

  function startPractice(p) {
    setSelectedPractice(p)
    setExchangeIdx(0)
    setChosen(null)
    setScore({ best: 0, okay: 0, poor: 0 })
    setFinished(false)
  }

  function pickChoice(choice) {
    setChosen(choice)
    setScore(s => ({ ...s, [choice.quality]: s[choice.quality] + 1 }))
  }

  function next() {
    const exchange = selectedPractice.exchanges
    if (exchangeIdx + 1 < exchange.length) {
      setExchangeIdx(i => i + 1)
      setChosen(null)
    } else {
      setFinished(true)
    }
  }

  if (!selectedPractice) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Practice Mode</h2>
          <p className="text-gray-500 mt-1">Choose a scenario and practice picking the right response. Get instant feedback.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {practiceData.map(p => (
            <button
              key={p.scenarioId}
              onClick={() => startPractice(p)}
              className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-3 block">{p.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.exchanges.length} exchanges</p>
              <div className="mt-4 text-sm text-blue-600 font-medium">Start practice →</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (finished) {
    const total = score.best + score.okay + score.poor
    const pct = Math.round((score.best / total) * 100)
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <span className="text-5xl block mb-4">
            {pct === 100 ? '🏆' : pct >= 50 ? '👍' : '📚'}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session complete</h2>
          <p className="text-gray-500 mb-6">{selectedPractice.title}</p>
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{score.best}</div>
              <div className="text-xs text-gray-500">Best</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{score.okay}</div>
              <div className="text-xs text-gray-500">Okay</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{score.poor}</div>
              <div className="text-xs text-gray-500">Avoid</div>
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            {pct === 100
              ? 'Perfect score — you picked the best response every time.'
              : pct >= 50
              ? `You got ${score.best}/${total} best responses. Review the scenarios you missed to sharpen your instincts.`
              : 'This one is tricky. Review the coaching notes and try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startPractice(selectedPractice)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => setSelectedPractice(null)}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Choose another
            </button>
          </div>
        </div>
      </div>
    )
  }

  const exchange = selectedPractice.exchanges[exchangeIdx]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setSelectedPractice(null)} className="text-sm text-gray-500 hover:text-blue-600">
          ← All scenarios
        </button>
        <span className="text-sm text-gray-500">
          Exchange {exchangeIdx + 1} of {selectedPractice.exchanges.length}
        </span>
      </div>

      {/* Customer line */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-5">
        <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">😠 Customer says:</p>
        <p className="text-gray-800 italic text-base">"{exchange.customerLine}"</p>
      </div>

      {/* Choices */}
      <p className="text-sm font-semibold text-gray-600 mb-3">How do you respond?</p>
      <div className="space-y-3">
        {exchange.choices.map((choice, i) => {
          const isChosen = chosen === choice
          const style = isChosen ? QUALITY_STYLES[choice.quality] : {}
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all ${
                chosen
                  ? isChosen
                    ? `${QUALITY_STYLES[choice.quality].border} border-2`
                    : 'border-gray-100 opacity-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 cursor-pointer'
              }`}
              onClick={() => !chosen && pickChoice(choice)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-800">{choice.text}</p>
                  {isChosen && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${QUALITY_STYLES[choice.quality].badge}`}>
                      {QUALITY_STYLES[choice.quality].label}
                    </span>
                  )}
                </div>
                {isChosen && (
                  <div className="mt-3 flex items-start gap-2 pt-3 border-t border-gray-200">
                    <span>🧠</span>
                    <p className="text-sm text-gray-700">{choice.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {chosen && (
        <button
          onClick={next}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {exchangeIdx + 1 < selectedPractice.exchanges.length ? 'Next exchange →' : 'See results →'}
        </button>
      )}
    </div>
  )
}
