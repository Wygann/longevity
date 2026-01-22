/**
 * BiologicalAge Component
 * 
 * Displays the calculated biological age with comparison to chronological age.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.biologicalAge - Calculated biological age
 * @param {number|null} props.chronologicalAge - User's chronological age (optional)
 * @returns {JSX.Element} BiologicalAge component
 */
function BiologicalAge({ biologicalAge, chronologicalAge = null }) {
  // Calculate age difference if chronological age is provided
  const ageDifference =
    chronologicalAge !== null ? biologicalAge - chronologicalAge : null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Your Biological Age
        </h2>

        {/* Main Age Display */}
        <div className="mb-6">
          <div className="inline-block">
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-blue-600 mb-2">
              {biologicalAge}
            </div>
            <div className="text-xl sm:text-2xl text-gray-600 font-medium">
              years
            </div>
          </div>
        </div>

        {/* Comparison with Chronological Age */}
        {chronologicalAge !== null && ageDifference !== null && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Chronological Age: <span className="font-semibold">{chronologicalAge}</span>
            </p>
            <div className="flex items-center justify-center">
              {ageDifference < 0 ? (
                <div className="flex items-center text-green-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="font-semibold">
                    {Math.abs(ageDifference)} years younger than your age
                  </span>
                </div>
              ) : ageDifference > 0 ? (
                <div className="flex items-center text-amber-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                  <span className="font-semibold">
                    {ageDifference} years older than your age
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-blue-600">
                  <span className="font-semibold">Matches your chronological age</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explanation */}
        <p className="mt-6 text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          Biological age reflects how your body is aging based on your biomarkers.
          Lower is better - work on the recommendations below to improve your score.
        </p>
      </div>
    </div>
  )
}

export default BiologicalAge
