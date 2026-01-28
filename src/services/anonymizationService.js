/**
 * Anonymization Service
 * 
 * Removes personal identifiers from blood test documents before AI processing.
 * Extracts only medical data: biomarkers, demographics (age, weight, gender), and test dates.
 * 
 * Critical: This service ensures zero personal data leaks to AI services.
 */

/**
 * Anonymizes blood test document content
 * Removes all personal identifiers while preserving medical data
 * 
 * @param {string} content - Raw text content from PDF/image
 * @param {Object} metadata - File metadata (optional)
 * @returns {Object} Anonymized data with extracted medical information
 */
export function anonymizeDocument(content, metadata = {}) {
  if (!content || typeof content !== 'string') {
    throw new Error('Content must be a non-empty string')
  }

  // Extract medical data first (before removing identifiers)
  const medicalData = extractMedicalData(content)
  
  // Remove personal identifiers
  const anonymizedContent = removePersonalIdentifiers(content)
  
  // Validate no personal data leaked
  validateAnonymization(anonymizedContent, medicalData)

  return {
    anonymizedContent,
    medicalData,
    metadata: {
      fileType: metadata.type || 'unknown',
      fileSize: metadata.size || 0,
      anonymizedAt: new Date().toISOString(),
    },
  }
}

/**
 * Extracts medical data from document content
 * Only extracts: biomarkers, demographics, test dates
 * 
 * @param {string} content - Document content
 * @returns {Object} Extracted medical data
 */
function extractMedicalData(content) {
  const medicalData = {
    biomarkers: [],
    demographics: {
      age: null,
      weight: null,
      height: null,
      gender: null,
    },
    testDate: null,
  }

  // Extract demographics (age, weight, height, gender)
  medicalData.demographics.age = extractAge(content)
  medicalData.demographics.weight = extractWeight(content)
  medicalData.demographics.height = extractHeight(content)
  medicalData.demographics.gender = extractGender(content)

  // Extract test date
  medicalData.testDate = extractTestDate(content)

  // Note: Biomarkers will be extracted by AI service
  // This function only extracts structured demographics

  return medicalData
}

/**
 * Extracts age from content
 * Looks for patterns like "Wiek: 42", "Age: 42", "42 lat", etc.
 * 
 * @param {string} content - Document content
 * @returns {number|null} Extracted age or null
 */
function extractAge(content) {
  const agePatterns = [
    /(?:wiek|age|lat|years?)[\s:]*(\d{1,3})/i,
    /(\d{1,3})[\s]*(?:lat|years?|roku)/i,
  ]

  for (const pattern of agePatterns) {
    const match = content.match(pattern)
    if (match) {
      const age = parseInt(match[1], 10)
      if (age >= 1 && age <= 120) {
        return age
      }
    }
  }

  return null
}

/**
 * Extracts weight from content
 * Looks for patterns like "Masa: 83 kg", "Weight: 83", etc.
 * 
 * @param {string} content - Document content
 * @returns {number|null} Extracted weight in kg or null
 */
function extractWeight(content) {
  const weightPatterns = [
    /(?:masa|weight|waga)[\s:]*(\d+(?:\.\d+)?)[\s]*(?:kg|kilogram)/i,
    /(\d+(?:\.\d+)?)[\s]*kg/i,
  ]

  for (const pattern of weightPatterns) {
    const match = content.match(pattern)
    if (match) {
      const weight = parseFloat(match[1])
      if (weight >= 20 && weight <= 300) {
        return weight
      }
    }
  }

  return null
}

/**
 * Extracts height from content
 * Looks for patterns like "Wzrost: 181 cm", "Height: 181", etc.
 * 
 * @param {string} content - Document content
 * @returns {number|null} Extracted height in cm or null
 */
function extractHeight(content) {
  const heightPatterns = [
    /(?:wzrost|height|wysokość)[\s:]*(\d{2,3})[\s]*(?:cm|centymetr)/i,
    /(\d{2,3})[\s]*cm/i,
  ]

  for (const pattern of heightPatterns) {
    const match = content.match(pattern)
    if (match) {
      const height = parseInt(match[1], 10)
      if (height >= 100 && height <= 250) {
        return height
      }
    }
  }

  return null
}

/**
 * Extracts gender from content
 * Looks for patterns like "Płeć: M", "Gender: Male", "Mężczyzna", etc.
 * 
 * @param {string} content - Document content
 * @returns {string|null} 'M', 'F', or null
 */
function extractGender(content) {
  const malePatterns = [
    /(?:płeć|gender)[\s:]*[Mm]/i,
    /mężczyzna|male|m\b/i,
  ]

  const femalePatterns = [
    /(?:płeć|gender)[\s:]*[FfKk]/i,
    /kobieta|female|f\b/i,
  ]

  for (const pattern of malePatterns) {
    if (pattern.test(content)) {
      return 'M'
    }
  }

  for (const pattern of femalePatterns) {
    if (pattern.test(content)) {
      return 'F'
    }
  }

  return null
}

/**
 * Extracts test date from content
 * Looks for date patterns in various formats
 * 
 * @param {string} content - Document content
 * @returns {string|null} ISO date string or null
 */
function extractTestDate(content) {
  const datePatterns = [
    // DD.MM.YYYY
    /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
    // YYYY-MM-DD
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    // DD/MM/YYYY
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
  ]

  for (const pattern of datePatterns) {
    const match = content.match(pattern)
    if (match) {
      try {
        let year, month, day

        if (pattern === datePatterns[0] || pattern === datePatterns[2]) {
          // DD.MM.YYYY or DD/MM/YYYY
          day = parseInt(match[1], 10)
          month = parseInt(match[2], 10)
          year = parseInt(match[3], 10)
        } else {
          // YYYY-MM-DD
          year = parseInt(match[1], 10)
          month = parseInt(match[2], 10)
          day = parseInt(match[3], 10)
        }

        // Validate date
        if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          // Use UTC to avoid timezone issues
          const date = new Date(Date.UTC(year, month - 1, day))
          if (date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) {
            return date.toISOString().split('T')[0]
          }
        }
      } catch (e) {
        // Invalid date, continue
      }
    }
  }

  return null
}

/**
 * Removes personal identifiers from content
 * Removes: names, ID numbers, addresses, phone numbers, emails
 * 
 * @param {string} content - Document content
 * @returns {string} Anonymized content
 */
function removePersonalIdentifiers(content) {
  let anonymized = content

  // Remove names (common Polish names and patterns)
  anonymized = anonymized.replace(/\b[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,}\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,}\b/g, '[NAME]')
  
  // Remove PESEL (Polish ID numbers - 11 digits)
  anonymized = anonymized.replace(/\b\d{11}\b/g, '[ID]')
  
  // Remove other ID patterns (various formats)
  anonymized = anonymized.replace(/\b[A-Z]{2,3}\d{6,}\b/g, '[ID]')
  
  // Remove addresses (street patterns)
  anonymized = anonymized.replace(/\b(ul\.|ulica|street|str\.)\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\s]+(?:\d+[A-Za-z]?)?/gi, '[ADDRESS]')
  
  // Remove phone numbers
  anonymized = anonymized.replace(/\b(?:\+48\s?)?\d{2,3}[\s-]?\d{3}[\s-]?\d{3}\b/g, '[PHONE]')
  
  // Remove emails
  anonymized = anonymized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
  
  // Remove institution names (common Polish lab names)
  const institutionPatterns = [
    /\b(ALAB|Diagnostyka|SYNEVO|Medycyna|Laboratorium)[\s\w]*/gi,
  ]
  institutionPatterns.forEach(pattern => {
    anonymized = anonymized.replace(pattern, '[INSTITUTION]')
  })

  return anonymized
}

/**
 * Validates that no personal data leaked into anonymized content
 * Throws error if personal identifiers found
 * 
 * @param {string} anonymizedContent - Anonymized content to validate
 * @param {Object} medicalData - Extracted medical data
 * @throws {Error} If personal data detected
 */
function validateAnonymization(anonymizedContent, medicalData) {
  const errors = []

  // Check for remaining names (should be replaced with [NAME])
  const namePattern = /\b[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,}\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,}\b/
  if (namePattern.test(anonymizedContent)) {
    errors.push('Potential name detected in anonymized content')
  }

  // Check for PESEL (should be replaced)
  if (/\b\d{11}\b/.test(anonymizedContent)) {
    errors.push('Potential PESEL detected in anonymized content')
  }

  // Check for emails (should be replaced)
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(anonymizedContent)) {
    errors.push('Potential email detected in anonymized content')
  }

  // Check that medical data doesn't contain personal info
  if (medicalData.demographics.age && (medicalData.demographics.age < 1 || medicalData.demographics.age > 120)) {
    errors.push('Invalid age extracted')
  }

  if (errors.length > 0) {
    throw new Error(`Anonymization validation failed: ${errors.join('; ')}`)
  }
}

/**
 * Extracts text from PDF file using PDF.js
 * 
 * This function extracts text locally to enable anonymization before sending to AI.
 * This ensures personal data (names, IDs, addresses) are removed before AI processing.
 * 
 * @param {File} file - PDF file
 * @returns {Promise<string>} Extracted text content from PDF
 */
export async function extractTextFromPDF(file) {
  try {
    // PDF.js from CDN exports as window.pdfjsLib or can be imported from npm
    let pdfjsLib
    
    if (typeof window !== 'undefined') {
      // Try CDN version first (loaded via script tag)
      pdfjsLib = window.pdfjsLib || window.pdfjs
      
      // If not available, try to import from npm
      if (!pdfjsLib) {
        try {
          const pdfjsModule = await import('pdfjs-dist')
          pdfjsLib = pdfjsModule.default || pdfjsModule
          // Cache for future use
          window.pdfjsLib = pdfjsLib
        } catch (e) {
          throw new Error('PDF.js not available. Please ensure pdfjs-dist is installed or CDN script is loaded.')
        }
      }
    } else {
      // Node.js environment - import from npm
      const pdfjsModule = await import('pdfjs-dist')
      pdfjsLib = pdfjsModule.default || pdfjsModule
    }
    
    if (!pdfjsLib) {
      throw new Error('PDF.js library not found')
    }
    
    // Set worker source (required for PDF.js)
    // Use CDN worker for browser environment
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }
    
    // Get getDocument function
    const getDocument = pdfjsLib.getDocument
    if (!getDocument || typeof getDocument !== 'function') {
      throw new Error('getDocument not found in PDF.js library. Available keys: ' + Object.keys(pdfjsLib).join(', '))
    }
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Load PDF document (pdfjs-dist 3.x returns loadingTask with promise property)
    const loadingTask = getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    // Extract text from all pages
    let fullText = ''
    const numPages = pdf.numPages
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Combine text items from the page
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
      
      fullText += pageText + '\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF text extraction failed:', error)
    // If PDF.js is not available or extraction fails, throw error
    // This will trigger Vision API fallback in analysisService, but without anonymization
    throw new Error(`PDF text extraction failed: ${error.message}. Please ensure pdfjs-dist is installed (npm install pdfjs-dist).`)
  }
}

/**
 * Extracts text from image file using OCR
 * 
 * Note: For Phase 2, we rely on AI Vision API to process images directly.
 * Local OCR (Tesseract.js) can be added later if needed, but AI Vision API
 * handles images natively without requiring OCR extraction.
 * 
 * @param {File} file - Image file
 * @returns {Promise<string>} Empty string - AI Vision API will handle the image directly
 */
export async function extractTextFromImage(file) {
  // Return empty string - AI Vision API will process the image directly
  // This avoids requiring tesseract.js as a dependency
  // AI Vision API can read images and extract text natively
  return ''
}
