/**
 * FileUpload Component
 * 
 * A component for uploading blood test results (PDF or images).
 * Supports drag-and-drop and click-to-upload functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {boolean} props.disabled - Whether upload is disabled
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} FileUpload component
 */
import { useState, useRef } from 'react'

function FileUpload({ onFileSelect, disabled = false, className = '' }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  /**
   * Handles file selection from input
   */
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  /**
   * Handles file drop
   */
  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(event.dataTransfer.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  /**
   * Handles drag over event
   */
  const handleDragOver = (event) => {
    event.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  /**
   * Processes and validates multiple files
   */
  const handleFiles = (files) => {
    setError(null)

    // Validate file type and size
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]

    const validFiles = []
    const errors = []

    files.forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size must be less than 10MB`)
        return
      }

      if (!allowedTypes.includes(file.type)) {
        errors.push(
          `${file.name}: Invalid file type. Please upload a PDF or image (JPG, PNG, WebP)`
        )
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join('; '))
    }

    // Call the callback with valid files (can be single or multiple)
    if (onFileSelect && validFiles.length > 0) {
      // If callback expects array, pass array; otherwise pass single file for backward compatibility
      if (validFiles.length === 1) {
        onFileSelect(validFiles[0], validFiles)
      } else {
        onFileSelect(validFiles[0], validFiles) // Pass first file and all files
      }
    }
  }

  /**
   * Opens file picker dialog
   */
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 sm:p-12
          transition-colors duration-200 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-50'}
          focus-visible-ring
        `.trim().replace(/\s+/g, ' ')}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload blood test results"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label="File input"
        />

        <div className="text-center">
          {/* Upload Icon */}
          <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 text-gray-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Instructions */}
          <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
            {isDragging ? 'Drop your files here' : 'Upload Blood Test Results'}
          </p>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Supported formats: PDF, JPG, PNG, WebP (max 10MB per file)
            <br />
            You can upload multiple files - they will be combined into one analysis
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}

export default FileUpload
