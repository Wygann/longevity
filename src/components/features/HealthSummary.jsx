/**
 * HealthSummary Component
 * 
 * Displays a health summary with 3 top positive aspects and 3 top priorities.
 * Designed to be easily understandable for non-medical users.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<string>} props.positives - Array of 3 positive health aspects
 * @param {Array<string>} props.priorities - Array of 3 health priorities/concerns
 * @returns {JSX.Element} HealthSummary component
 */
function HealthSummary({ positives = [], priorities = [] }) {
  return (
    <div className="space-y-6">
      {/* Positive Aspects Section */}
      {positives.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Top Positive Aspects
            </h2>
          </div>
          <ul className="space-y-3">
            {positives.map((positive, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-base sm:text-lg text-gray-700">
                  {positive}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Priorities Section */}
      {priorities.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Top Priorities to Address
            </h2>
          </div>
          <ul className="space-y-3">
            {priorities.map((priority, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 mr-3 mt-1 font-bold">
                  {index + 1}.
                </span>
                <span className="text-base sm:text-lg text-gray-700">
                  {priority}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default HealthSummary
