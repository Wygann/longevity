/**
 * AnalysisProgress Component
 * 
 * Displays loading state during blood test analysis.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - Optional custom loading message
 * @returns {JSX.Element} AnalysisProgress component
 */
function AnalysisProgress({ message = 'Analyzing your blood test results...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      {/* Spinner */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>

      {/* Message */}
      <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2 text-center">
        {message}
      </p>
      <p className="text-sm sm:text-base text-gray-500 text-center">
        This usually takes less than 60 seconds
      </p>

      {/* Progress Steps */}
      <div className="mt-8 space-y-3 text-sm sm:text-base text-gray-600">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
          <span>Extracting biomarker data...</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-300 rounded-full mr-3 animate-pulse"></div>
          <span>Analyzing health patterns...</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
          <span>Generating recommendations...</span>
        </div>
      </div>
    </div>
  )
}

export default AnalysisProgress
