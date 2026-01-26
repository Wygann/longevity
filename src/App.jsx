import { useState } from 'react'
import './App.css'
import FileUpload from './components/common/FileUpload'
import AnalysisProgress from './components/features/AnalysisProgress'
import HealthSummary from './components/features/HealthSummary'
import BiologicalAge from './components/features/BiologicalAge'
import Recommendations from './components/features/Recommendations'
import { analyzeBloodTest } from './services/analysisService'

/**
 * Main Application Component - Longevity AI MVP
 * 
 * Implements the complete user journey:
 * 1. Upload blood test results (PDF or photo)
 * 2. AI analysis of results
 * 3. Health summary (3 positives + 3 priorities)
 * 4. Biological age display
 * 5. 3 recommended actions
 * 
 * @component
 * @returns {JSX.Element} The main app component
 */
function App() {
  const [analysisState, setAnalysisState] = useState('idle') // 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'
  const [analysisResults, setAnalysisResults] = useState(null)
  const [error, setError] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [chronologicalAge, setChronologicalAge] = useState('')

  /**
   * Handles file selection from upload component
   * 
   * @param {File} file - The first uploaded file (for backward compatibility)
   * @param {File[]|undefined} allFiles - All uploaded files (if multiple)
   */
  const handleFileSelect = async (file, allFiles) => {
    setError(null)
    
    // Handle single file or multiple files
    const filesToAnalyze = allFiles && Array.isArray(allFiles) ? allFiles : [file]
    setUploadedFiles(filesToAnalyze)
    setAnalysisState('analyzing')

    try {
      // Parse chronological age if provided
      const age = chronologicalAge.trim()
        ? parseInt(chronologicalAge.trim(), 10)
        : null

      // Validate age if provided
      if (age !== null && (isNaN(age) || age < 1 || age > 120)) {
        setError('Please enter a valid age between 1 and 120, or leave it empty.')
        setAnalysisState('error')
        return
      }

      // Analyze the blood test files (combines multiple files into one analysis)
      const results = await analyzeBloodTest(filesToAnalyze, age)
      setAnalysisResults(results)
      setAnalysisState('complete')
    } catch (err) {
      console.error('Analysis error:', err)
      setError(
        err.message ||
          'An error occurred while analyzing your results. Please try again.'
      )
      setAnalysisState('error')
    }
  }

  /**
   * Resets the application to initial state
   */
  const handleReset = () => {
    setAnalysisState('idle')
    setAnalysisResults(null)
    setError(null)
    setUploadedFiles([])
    setChronologicalAge('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile-first container with responsive padding */}
      <div className="container-mobile py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Main content area */}
        <main className="max-w-4xl mx-auto">
          {/* Header section */}
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Longevity AI
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your blood test results and get AI-powered health insights,
              biological age estimation, and personalized recommendations
            </p>
          </header>

          {/* Privacy Notice & Medical Disclaimer */}
          {analysisState === 'idle' && (
            <div className="space-y-4 mb-6">
              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1">
                      Zero-Retention Privacy Model
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Your medical data is analyzed using a Zero-Retention model.
                      No permanent storage of your sensitive health information.
                      Your privacy is our priority.
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0"
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
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-amber-900 mb-1">
                      Medical Disclaimer
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-800">
                      This analysis is for informational purposes only and is not
                      intended as medical advice. Please consult with a healthcare
                      professional for medical decisions and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {analysisState === 'idle' && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 space-y-6">
              {/* Optional Chronological Age Input */}
              <div>
                <label
                  htmlFor="chronological-age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Age (Optional)
                </label>
                <input
                  id="chronological-age"
                  type="number"
                  min="1"
                  max="120"
                  value={chronologicalAge}
                  onChange={(e) => setChronologicalAge(e.target.value)}
                  placeholder="Enter your age for comparison"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Provide your chronological age to compare with your
                  biological age
                </p>
              </div>

              {/* File Upload */}
              <FileUpload
                onFileSelect={handleFileSelect}
                disabled={analysisState === 'analyzing'}
              />
            </div>
          )}

          {/* Analysis Progress */}
          {analysisState === 'analyzing' && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
              {uploadedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    {uploadedFiles.length === 1
                      ? 'Uploaded file:'
                      : `Uploaded ${uploadedFiles.length} files:`}
                  </p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <p
                        key={index}
                        className="text-base font-medium text-gray-900 text-center"
                      >
                        {file.name}
                      </p>
                    ))}
                  </div>
                  {uploadedFiles.length > 1 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Files will be combined into one analysis
                    </p>
                  )}
                </div>
              )}
              <AnalysisProgress />
            </div>
          )}

          {/* Error State */}
          {analysisState === 'error' && (
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Analysis Failed
                </h2>
                <p className="text-base text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus-visible-ring transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {analysisState === 'complete' && analysisResults && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3"
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
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-900">
                      Analysis Complete
                    </h3>
                    <p className="text-sm text-green-800">
                      Your health insights are ready
                    </p>
                  </div>
                </div>
              </div>

              {/* Biological Age - Prominent Display */}
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <BiologicalAge
                  biologicalAge={analysisResults.biologicalAge}
                  chronologicalAge={analysisResults.chronologicalAge}
                />
              </div>

              {/* Health Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <HealthSummary
                  positives={analysisResults.healthSummary.positives}
                  priorities={analysisResults.healthSummary.priorities}
                />
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <Recommendations
                  recommendations={analysisResults.recommendations}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus-visible-ring transition-colors duration-200 font-medium"
                >
                  Analyze Another Test
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600 space-y-2">
          <p>
            Longevity AI MVP - Powered by AI analysis of your blood test results
          </p>
          <p>
            Need help?{' '}
            <a
              href="mailto:support@longevity.ai?subject=Support%20Request"
              className="text-blue-600 hover:text-blue-800 underline focus-visible-ring"
            >
              Contact Support
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
