const CATEGORY_COLORS = {
  Claims: 'bg-red-100 text-red-700',
  Billing: 'bg-yellow-100 text-yellow-700',
  Coverage: 'bg-purple-100 text-purple-700',
  Escalation: 'bg-orange-100 text-orange-700',
  Retention: 'bg-blue-100 text-blue-700',
}

const SEVERITY_LABEL = {
  high: { label: 'High tension', color: 'text-red-600' },
  medium: { label: 'Moderate tension', color: 'text-yellow-600' },
  low: { label: 'Low tension', color: 'text-green-600' },
}

export default function ScenarioLibrary({ scenarios, onSelect }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scenario Library</h2>
        <p className="text-gray-500 mt-1">Common angry customer situations. Tap a card to see scripts and coaching.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map(scenario => {
          const sev = SEVERITY_LABEL[scenario.severity]
          const catColor = CATEGORY_COLORS[scenario.category] || 'bg-gray-100 text-gray-700'
          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{scenario.icon}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${catColor}`}>
                  {scenario.category}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                {scenario.title}
              </h3>
              <p className={`text-xs font-medium mb-3 ${sev.color}`}>{sev.label}</p>
              <p className="text-sm text-gray-500 line-clamp-2 italic">
                "{scenario.customerScript.slice(0, 90)}..."
              </p>
              <div className="mt-4 text-xs text-blue-600 font-medium group-hover:underline">
                View scripts & coaching →
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
