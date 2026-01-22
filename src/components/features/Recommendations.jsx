/**
 * Recommendations Component
 * 
 * Displays 3 prioritized actionable recommendations for improving biomarkers
 * and decreasing biological age.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.recommendations - Array of recommendation objects
 * @returns {JSX.Element} Recommendations component
 */
function Recommendations({ recommendations = [] }) {
  if (recommendations.length === 0) {
    return null
  }

  /**
   * Gets icon based on action type
   */
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'supplementation':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        )
      case 'habit':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'lifestyle':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  /**
   * Gets color scheme based on priority
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'bg-red-50 border-red-200 text-red-800'
      case 2:
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 3:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
        Recommended Actions
      </h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6">
        Focus on these 3 priority actions to improve your biomarkers and lower
        your biological age:
      </p>

      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className={`
              border-2 rounded-lg p-6 transition-shadow duration-200
              hover:shadow-lg
              ${getPriorityColor(recommendation.priority)}
            `.trim().replace(/\s+/g, ' ')}
          >
            <div className="flex items-start">
              {/* Priority Badge */}
              <div className="flex-shrink-0 mr-4">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-bold text-lg
                    ${getPriorityColor(recommendation.priority)}
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {recommendation.priority}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="mr-3 text-gray-700">
                    {getActionIcon(recommendation.actionType)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {recommendation.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {recommendation.description}
                </p>
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <span className="capitalize">{recommendation.actionType}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">High Impact</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations
