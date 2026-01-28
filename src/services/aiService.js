/**
 * AI Service
 * 
 * Handles integration with Google Gemini API for biomarker extraction and analysis.
 * Includes fallback to mock service if AI is unavailable.
 * 
 * Features:
 * - Biomarker extraction from documents
 * - Health summary generation
 * - Biological age calculation
 * - Recommendation generation
 */

import { getEnv } from '../utils/env'

const GEMINI_API_URL = getEnv('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta/models')
// Models are configurable via .env file (VITE_GEMINI_MODEL)
// Available models (v2.5 and v3):
// - gemini-2.5-flash (limit: 20 RPD)
// - gemini-2.5-flash-lite (limit: 20 RPD)
// - gemini-2.5-pro (limit: varies)
// - gemini-3-flash-preview (limit: 20 RPD)
// - gemini-3-pro-preview (limit: varies)
// - gemini-2.0-flash (limit: varies, older model)
// - gemini-flash-latest (alias to latest flash)
// - gemini-pro-latest (alias to latest pro)
// Note: getEnv automatically adds VITE_ prefix, so use 'GEMINI_MODEL' not 'VITE_GEMINI_MODEL'
const DEFAULT_MODEL = getEnv('GEMINI_MODEL', 'gemini-3-flash-preview') // Text model (configurable via .env)
const VISION_MODEL = getEnv('GEMINI_MODEL', 'gemini-3-flash-preview') // Vision model (same as DEFAULT_MODEL, supports both text and vision)

/**
 * Checks if AI service is available
 * 
 * @returns {boolean} True if API key is configured
 */
export function isAIAvailable() {
  try {
    const apiKey = getEnv('GEMINI_API_KEY')
    return !!apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10
  } catch {
    return false
  }
}

/**
 * Lists available Gemini models
 * 
 * @returns {Promise<Array>} List of available models
 */
async function listAvailableModels() {
  const apiKey = getEnv('GEMINI_API_KEY')
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured')
  }

  const baseUrl = GEMINI_API_URL.replace('/models', '')
  const url = `${baseUrl}/models?key=${apiKey}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`)
    }
    const data = await response.json()
    return data.models || []
  } catch (error) {
    console.error('[AI Service] Failed to list models:', error)
    return []
  }
}

/**
 * Makes a request to Gemini API
 * 
 * @param {string} model - Model name (e.g., 'gemini-1.5-pro')
 * @param {Array<Object>} contents - Content parts (text or images)
 * @param {Object} options - Additional options (temperature, etc.)
 * @returns {Promise<Object>} API response
 */
async function callGemini(model, contents, options = {}) {
  const apiKey = getEnv('GEMINI_API_KEY')
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured')
  }

  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`
  console.log('[AI Service] Calling Gemini API:', {
    apiUrl: GEMINI_API_URL,
    model: model,
    fullUrl: url.replace(apiKey, '***HIDDEN***')
  })
  
  const requestBody = {
    contents: contents,
    generationConfig: {
      temperature: options.temperature || 0.1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: options.maxOutputTokens || 8192,
    },
  }
  
  // Note: responseMimeType is not supported in Gemini API v1
  // We'll parse JSON from text response instead

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    const errorMessage = error.error?.message || response.statusText
    
    // If model not found, try to list available models
    if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
      console.warn('[AI Service] Model not found, fetching available models...')
      const availableModels = await listAvailableModels()
      if (availableModels.length > 0) {
        const modelNames = availableModels.map(m => m.name).join(', ')
        console.error('[AI Service] Available models:', modelNames)
        throw new Error(`Model ${model} not available. Available models: ${modelNames}`)
      }
    }
    
    throw new Error(`Gemini API error: ${errorMessage}`)
  }

  return response.json()
}

/**
 * Extracts text from Gemini response
 * 
 * @param {Object} response - Gemini API response
 * @returns {string} Extracted text content
 */
function extractTextFromGeminiResponse(response) {
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('No response from AI')
  }
  return text
}

/**
 * Cleans JSON string from markdown code blocks
 * Removes ```json and ``` markers if present
 * 
 * @param {string} jsonString - JSON string potentially wrapped in markdown
 * @returns {string} Clean JSON string
 */
function cleanJsonString(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return jsonString
  }
  
  // Remove markdown code block markers
  let cleaned = jsonString.trim()
  
  // Remove ```json or ``` at the start
  cleaned = cleaned.replace(/^```json\s*/i, '')
  cleaned = cleaned.replace(/^```\s*/, '')
  
  // Remove ``` at the end
  cleaned = cleaned.replace(/\s*```$/, '')
  
  return cleaned.trim()
}

/**
 * Extracts biomarkers from document (text or file)
 * 
 * Priority: Use anonymized text if available (secure - personal data removed).
 * Fallback: Use Vision API only if text extraction failed (less secure - sends full file).
 * 
 * @param {string} anonymizedContent - Anonymized document text (preferred - already anonymized)
 * @param {string} fileType - File MIME type
 * @param {File|null} file - Original file (fallback for Vision API if text extraction failed)
 * @returns {Promise<Array<Object>>} Extracted biomarkers
 */
export async function extractBiomarkers(anonymizedContent, fileType, file = null) {
  if (!isAIAvailable()) {
    throw new Error('AI service not available - use mock service')
  }

  console.log('[AI Service] extractBiomarkers called with:', {
    hasAnonymizedContent: !!anonymizedContent,
    anonymizedContentLength: anonymizedContent ? anonymizedContent.length : 0,
    anonymizedContentPreview: anonymizedContent ? anonymizedContent.substring(0, 100) : 'none',
    fileType,
    hasFile: !!file,
    fileName: file ? file.name : 'none'
  })

  // Priority: Use anonymized text if available (secure - personal data already removed)
  if (anonymizedContent && anonymizedContent.trim().length > 50) {
    console.log('[AI Service] Using text extraction (anonymized content)')
    try {
      const result = await extractBiomarkersFromText(anonymizedContent)
      console.log('[AI Service] Text extraction result:', {
        biomarkersCount: result.length,
        biomarkers: result.slice(0, 3).map(b => ({ name: b.name, value: b.value }))
      })
      return result
    } catch (error) {
      console.error('[AI Service] Text extraction failed:', error)
      throw error
    }
  }

  // Fallback: Use Vision API only if text extraction failed
  if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
    console.log('[AI Service] Using Vision API fallback (file-based extraction)')
    console.warn('[AI Service] Using Vision API fallback - file will be sent without anonymization. Ensure PDF.js is installed for secure processing.')
    try {
      const result = await extractBiomarkersFromFile(file)
      console.log('[AI Service] Vision API extraction result:', {
        biomarkersCount: result.length,
        biomarkers: result.slice(0, 3).map(b => ({ name: b.name, value: b.value }))
      })
      return result
    } catch (error) {
      console.error('[AI Service] Vision API extraction failed:', error)
      throw error
    }
  }

  // If no content and no file, return empty array
  if (!anonymizedContent || anonymizedContent.trim().length === 0) {
    console.warn('[AI Service] No content and no file - returning empty array')
    return []
  }

  throw new Error('No content or file provided for extraction')
}

/**
 * Extracts biomarkers from text content
 * 
 * @param {string} text - Document text
 * @returns {Promise<Array<Object>>} Extracted biomarkers
 */
async function extractBiomarkersFromText(text) {
  console.log('[AI Service] extractBiomarkersFromText called, text length:', text.length)
  const prompt = createBiomarkerExtractionPrompt(text)

  try {
    const contents = [
      {
        parts: [
          {
            text: `You are a medical data extraction assistant. Extract biomarker values from blood test results and return them as structured JSON. Only extract values that are clearly present in the document.

${prompt}`,
          },
        ],
      },
    ]

    const response = await callGemini(DEFAULT_MODEL, contents, {
      temperature: 0.1,
      maxOutputTokens: 16384, // Increased for long biomarker lists
    })

    const content = extractTextFromGeminiResponse(response)
    console.log('[AI Service] Raw AI response length:', content.length)
    console.log('[AI Service] Raw AI response:', content.substring(0, 1000))
    const cleanedContent = cleanJsonString(content)
    console.log('[AI Service] Cleaned JSON length:', cleanedContent.length)
    console.log('[AI Service] Cleaned JSON:', cleanedContent.substring(0, 1000))
    
    let parsed
    try {
      parsed = JSON.parse(cleanedContent)
    } catch (parseError) {
      // Try to fix incomplete JSON by finding the last complete biomarker
      console.warn('[AI Service] JSON parse failed, attempting to fix incomplete JSON...')
      console.error('[AI Service] Parse error:', parseError.message)
      console.error('[AI Service] JSON ends with:', cleanedContent.substring(Math.max(0, cleanedContent.length - 500)))
      
      // Try to extract valid biomarkers from partial JSON using a more robust approach
      const biomarkerMatches = cleanedContent.match(/"biomarkers"\s*:\s*\[([\s\S]*)/)
      if (biomarkerMatches) {
        const biomarkersText = biomarkerMatches[1]
        
        // Find all complete biomarker objects by counting braces
        const biomarkers = []
        let currentBiomarker = ''
        let braceCount = 0
        let inString = false
        let escapeNext = false
        
        for (let i = 0; i < biomarkersText.length; i++) {
          const char = biomarkersText[i]
          
          if (escapeNext) {
            currentBiomarker += char
            escapeNext = false
            continue
          }
          
          if (char === '\\') {
            currentBiomarker += char
            escapeNext = true
            continue
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString
          }
          
          if (!inString) {
            if (char === '{') {
              braceCount++
            } else if (char === '}') {
              braceCount--
            }
          }
          
          currentBiomarker += char
          
          // If we've closed all braces, we have a complete biomarker
          if (!inString && braceCount === 0 && currentBiomarker.trim().length > 0) {
            const trimmed = currentBiomarker.trim()
            // Remove trailing comma if present
            const cleaned = trimmed.replace(/,\s*$/, '')
            if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
              try {
                // Validate it's valid JSON
                JSON.parse(cleaned)
                biomarkers.push(cleaned)
              } catch (e) {
                // Skip invalid biomarker
                console.warn('[AI Service] Skipping invalid biomarker:', cleaned.substring(0, 100))
              }
            }
            currentBiomarker = ''
          }
        }
        
        if (biomarkers.length > 0) {
          try {
            const fixedJson = `{"biomarkers": [${biomarkers.join(',')}]}`
            parsed = JSON.parse(fixedJson)
            console.log('[AI Service] Successfully fixed incomplete JSON, extracted', biomarkers.length, 'biomarkers')
          } catch (fixError) {
            console.error('[AI Service] Failed to fix JSON:', fixError)
            const fixedJsonPreview = `{"biomarkers": [${biomarkers.join(',')}]}`
            console.error('[AI Service] Fixed JSON preview:', fixedJsonPreview.substring(0, 500))
            throw new Error(`Failed to parse biomarker JSON. The AI response may be incomplete. Error: ${parseError.message}`)
          }
        } else {
          throw new Error(`Failed to parse biomarker JSON. Could not extract any complete biomarkers. Error: ${parseError.message}`)
        }
      } else {
        throw new Error(`Failed to parse biomarker JSON. No biomarkers array found. Error: ${parseError.message}`)
      }
    }
    
    console.log('[AI Service] Parsed JSON:', JSON.stringify(parsed, null, 2))
    const normalized = validateAndNormalizeBiomarkers(parsed.biomarkers || [])
    console.log('[AI Service] Normalized biomarkers:', normalized.length)
    
    if (normalized.length === 0) {
      throw new Error('No valid biomarkers could be extracted from the AI response')
    }
    
    return normalized
  } catch (error) {
    console.error('[AI Service] AI biomarker extraction from text failed:', error)
    throw error
  }
}

/**
 * Extracts biomarkers from file using Vision API
 * 
 * @param {File} file - Image or PDF file
 * @returns {Promise<Array<Object>>} Extracted biomarkers
 */
async function extractBiomarkersFromFile(file) {
  console.log('[AI Service] extractBiomarkersFromFile called:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  })
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file)
    console.log('[AI Service] File converted to base64, length:', base64.length)

    // Determine MIME type
    const mimeType = file.type || 'image/jpeg'

    const prompt = createBiomarkerExtractionPrompt('')

    const contents = [
      {
        parts: [
          {
            text: `You are a medical data extraction assistant. Extract biomarker values from blood test results shown in images or PDFs. The document may be in Polish or English, and may be in table format.

IMPORTANT for Polish documents:
- Handle Polish decimal separator (comma): "184,0" = 184.0
- Handle Polish units: "mln/μl" = million per microliter, "tys./μl" = thousand per microliter
- Parse table format: Name | Result | Unit | Normal Range | Status
- Handle different range formats: "4,50 – 5,90" (range), "< 190,0" (maximum), "> 40,0" (minimum)

Return them as structured JSON. Only extract values that are clearly visible in the document.

${prompt}`,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64,
            },
          },
        ],
      },
    ]

    console.log('[AI Service] Calling Gemini Vision API...')
    const response = await callGemini(VISION_MODEL, contents, {
      temperature: 0.1,
      maxOutputTokens: 16384, // Increased for long biomarker lists
    })

    const content = extractTextFromGeminiResponse(response)
    console.log('[AI Service] Raw AI response from Vision API length:', content.length)
    console.log('[AI Service] Raw AI response from Vision API:', content.substring(0, 1000))
    const cleanedContent = cleanJsonString(content)
    console.log('[AI Service] Cleaned JSON from Vision API length:', cleanedContent.length)
    console.log('[AI Service] Cleaned JSON from Vision API:', cleanedContent.substring(0, 1000))
    
    let parsed
    try {
      parsed = JSON.parse(cleanedContent)
    } catch (parseError) {
      // Try to fix incomplete JSON by finding the last complete biomarker
      console.warn('[AI Service] JSON parse failed for Vision API, attempting to fix incomplete JSON...')
      console.error('[AI Service] Parse error:', parseError.message)
      console.error('[AI Service] JSON ends with:', cleanedContent.substring(Math.max(0, cleanedContent.length - 500)))
      
      // Try to extract valid biomarkers from partial JSON using a more robust approach
      const biomarkerMatches = cleanedContent.match(/"biomarkers"\s*:\s*\[([\s\S]*)/)
      if (biomarkerMatches) {
        const biomarkersText = biomarkerMatches[1]
        
        // Find all complete biomarker objects by counting braces
        const biomarkers = []
        let currentBiomarker = ''
        let braceCount = 0
        let inString = false
        let escapeNext = false
        
        for (let i = 0; i < biomarkersText.length; i++) {
          const char = biomarkersText[i]
          
          if (escapeNext) {
            currentBiomarker += char
            escapeNext = false
            continue
          }
          
          if (char === '\\') {
            currentBiomarker += char
            escapeNext = true
            continue
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString
          }
          
          if (!inString) {
            if (char === '{') {
              braceCount++
            } else if (char === '}') {
              braceCount--
            }
          }
          
          currentBiomarker += char
          
          // If we've closed all braces, we have a complete biomarker
          if (!inString && braceCount === 0 && currentBiomarker.trim().length > 0) {
            const trimmed = currentBiomarker.trim()
            // Remove trailing comma if present
            const cleaned = trimmed.replace(/,\s*$/, '')
            if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
              try {
                // Validate it's valid JSON
                JSON.parse(cleaned)
                biomarkers.push(cleaned)
              } catch (e) {
                // Skip invalid biomarker
                console.warn('[AI Service] Skipping invalid biomarker from Vision API:', cleaned.substring(0, 100))
              }
            }
            currentBiomarker = ''
          }
        }
        
        if (biomarkers.length > 0) {
          try {
            const fixedJson = `{"biomarkers": [${biomarkers.join(',')}]}`
            parsed = JSON.parse(fixedJson)
            console.log('[AI Service] Successfully fixed incomplete JSON from Vision API, extracted', biomarkers.length, 'biomarkers')
          } catch (fixError) {
            console.error('[AI Service] Failed to fix JSON from Vision API:', fixError)
            const fixedJsonPreview = `{"biomarkers": [${biomarkers.join(',')}]}`
            console.error('[AI Service] Fixed JSON preview from Vision API:', fixedJsonPreview.substring(0, 500))
            throw new Error(`Failed to parse biomarker JSON from Vision API. The AI response may be incomplete. Error: ${parseError.message}`)
          }
        } else {
          throw new Error(`Failed to parse biomarker JSON from Vision API. Could not extract any complete biomarkers. Error: ${parseError.message}`)
        }
      } else {
        throw new Error(`Failed to parse biomarker JSON from Vision API. No biomarkers array found. Error: ${parseError.message}`)
      }
    }
    
    console.log('[AI Service] Parsed JSON from Vision API:', JSON.stringify(parsed, null, 2))
    const normalized = validateAndNormalizeBiomarkers(parsed.biomarkers || [])
    console.log('[AI Service] Normalized biomarkers from Vision API:', normalized.length)
    
    if (normalized.length === 0) {
      throw new Error('No valid biomarkers could be extracted from the Vision API response')
    }
    
    return normalized
  } catch (error) {
    console.error('[AI Service] AI biomarker extraction from file failed:', error)
    console.error('[AI Service] Error details:', {
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}

/**
 * Converts File to base64 string
 * 
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data URL prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Generates health summary using AI
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @returns {Promise<Object>} Health summary with 3 positives and 3 priorities
 */
export async function generateHealthSummary(biomarkers) {
  if (!isAIAvailable()) {
    throw new Error('AI service not available - use mock service')
  }

  const prompt = createHealthSummaryPrompt(biomarkers)

  try {
    const contents = [
      {
        parts: [
          {
            text: `You are a health analysis assistant. Analyze biomarkers and provide a clear, understandable health summary in plain language for non-medical users. Always provide exactly 3 positive aspects and exactly 3 priorities.

${prompt}`,
          },
        ],
      },
    ]

    const response = await callGemini(DEFAULT_MODEL, contents, {
      temperature: 0.3,
    })

    const content = extractTextFromGeminiResponse(response)
    const cleanedContent = cleanJsonString(content)
    const parsed = JSON.parse(cleanedContent)
    return validateHealthSummary(parsed)
  } catch (error) {
    console.error('AI health summary generation failed:', error)
    throw error
  }
}

/**
 * Calculates biological age using AI
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @returns {Promise<number>} Calculated biological age
 */
export async function calculateBiologicalAge(biomarkers) {
  if (!isAIAvailable()) {
    throw new Error('AI service not available - use mock service')
  }

  const prompt = createBiologicalAgePrompt(biomarkers)

  try {
    const contents = [
      {
        parts: [
          {
            text: `You are a biological age calculation assistant. Calculate biological age based on biomarkers using validated algorithms (PhenoAge, DunedinPACE).

${prompt}`,
          },
        ],
      },
    ]

    const response = await callGemini(DEFAULT_MODEL, contents, {
      temperature: 0.1,
    })

    console.log('[AI Service] Full API response for biological age:', JSON.stringify(response, null, 2))
    
    const content = extractTextFromGeminiResponse(response)
    console.log('[AI Service] Raw biological age response:', content)
    console.log('[AI Service] Raw biological age response length:', content.length)
    console.log('[AI Service] Raw biological age response first 200 chars:', content.substring(0, 200))
    
    // Check if response contains only zeros or is suspiciously long
    if (content.trim().match(/^0+$/) || content.length > 1000) {
      console.error('[AI Service] Suspicious response detected - only zeros or too long:', content.substring(0, 200))
      throw new Error(`Invalid AI response for biological age calculation. The AI returned an invalid response. Please try again.`)
    }
    
    const cleanedContent = cleanJsonString(content)
    console.log('[AI Service] Cleaned biological age response:', cleanedContent)
    
    let age = null
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(cleanedContent)
      age = parsed.biologicalAge || parsed.age || parsed.biological_age
    } catch (jsonError) {
      // If JSON parsing fails, try to extract number from text
      console.log('[AI Service] JSON parse failed, trying to extract number from text')
      
      // Look for numbers between 20-100 (reasonable biological age range)
      const numberMatches = cleanedContent.match(/\b([2-9][0-9]|100)\b/g)
      if (numberMatches && numberMatches.length > 0) {
        // Take the first reasonable number
        age = parseInt(numberMatches[0], 10)
        console.log('[AI Service] Extracted age from text:', age)
      } else {
        // Try to find any number
        const anyNumberMatch = cleanedContent.match(/\d+/)
        if (anyNumberMatch) {
          const extracted = parseInt(anyNumberMatch[0], 10)
          // Only use if it's in reasonable range
          if (extracted >= 20 && extracted <= 100) {
            age = extracted
            console.log('[AI Service] Extracted age from text (any number):', age)
          }
        }
        
        // Last resort: try parsing the whole cleaned content as a number
        if (age === null) {
          const numValue = parseFloat(cleanedContent.trim())
          if (!isNaN(numValue) && numValue >= 20 && numValue <= 100) {
            age = numValue
            console.log('[AI Service] Parsed entire content as number:', age)
          }
        }
      }
    }

    if (age === null || typeof age !== 'number' || isNaN(age)) {
      console.error('[AI Service] Could not extract biological age from response:', cleanedContent)
      throw new Error(`Invalid biological age calculated. AI response: ${cleanedContent.substring(0, 200)}`)
    }

    if (age < 20 || age > 100) {
      throw new Error(`Invalid biological age calculated: ${age} (must be between 20-100)`)
    }

    return Math.round(age)
  } catch (error) {
    console.error('AI biological age calculation failed:', error)
    throw error
  }
}

/**
 * Generates recommendations using AI
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @param {number} biologicalAge - Calculated biological age
 * @returns {Promise<Array<Object>>} Array of 3 recommendations
 */
export async function generateRecommendations(biomarkers, biologicalAge) {
  if (!isAIAvailable()) {
    throw new Error('AI service not available - use mock service')
  }

  const prompt = createRecommendationsPrompt(biomarkers, biologicalAge)

  try {
    const contents = [
      {
        parts: [
          {
            text: `You are a health recommendation assistant. Provide actionable, specific recommendations to improve biomarkers and decrease biological age. Use active substance names (not brand names). Provide exactly 3 prioritized recommendations.

${prompt}`,
          },
        ],
      },
    ]

    const response = await callGemini(DEFAULT_MODEL, contents, {
      temperature: 0.4,
    })

    const content = extractTextFromGeminiResponse(response)
    const cleanedContent = cleanJsonString(content)
    const parsed = JSON.parse(cleanedContent)
    return validateRecommendations(parsed.recommendations || [])
  } catch (error) {
    console.error('AI recommendation generation failed:', error)
    throw error
  }
}

/**
 * Creates prompt for biomarker extraction
 * 
 * @param {string} content - Anonymized document content
 * @returns {string} Formatted prompt
 */
function createBiomarkerExtractionPrompt(content) {
  return `Extract all biomarker values from this blood test result document. The document may be in Polish or English, and may be in table format.

Return as JSON with this structure:

{
  "biomarkers": [
    {
      "name": "Biomarker name (use English name, e.g., 'Total Cholesterol' or 'RBC')",
      "value": numeric_value,
      "unit": "unit (e.g., 'mg/dL', 'g/dL', 'mln/μl', 'tys./μl')",
      "optimalRange": {"min": min_value, "max": max_value}
    }
  ]
}

IMPORTANT: Parse optimal ranges correctly:
- Range format "4,50 – 5,90" → min: 4.50, max: 5.90
- Maximum format "< 190,0" → min: 0, max: 190.0
- Minimum format "> 40,0" → min: 40.0, max: 999999 (or very high number)
- Single value "30,0 – 50,0" → min: 30.0, max: 50.0

Common biomarkers to look for (Polish and English names):
- MORFOLOGIA (CBC): 
  * Erytrocyty / RBC / Red Blood Cells
  * Hemoglobina / HGB / Hemoglobin
  * Hematokryt / HCT / Hematocrit
  * Leukocyty / WBC / White Blood Cells
  * Płytki krwi / PLT / Platelets
  * MCV, MCH, MCHC
- BIOCHEMIA (Biochemistry):
  * Glukoza na czczo / Glucose / Fasting Glucose
  * Cholesterol całkowity / Total Cholesterol / Cholesterol całk.
  * Cholesterol LDL / LDL Cholesterol / LDL
  * Cholesterol HDL / HDL Cholesterol / HDL
  * Trójglicerydy / Triglycerides
  * ALT, AST, ALP, Bilirubina / Bilirubin, GGT
  * Kreatynina / Creatinine
  * Mocznik / BUN / Urea
  * eGFR
- HORMONY (Hormones):
  * TSH
  * Free T4, Free T3
  * Testosteron / Testosterone
  * PSA całkowity / Total PSA
- WITAMINY (Vitamins):
  * Witamina D / Vitamin D / 25(OH)D3
  * Wapń / Calcium
  * Fosfor / Phosphorus
  * Magnez / Magnesium
- INNE (Other):
  * CRP / C-Reactive Protein
  * OB / ESR

Handle Polish decimal separator (comma): "184,0" = 184.0
Handle Polish units: "mln/μl" = million per microliter, "tys./μl" = thousand per microliter

Document content:
${content.substring(0, 8000)} // Limit to avoid token limits
`
}

/**
 * Creates prompt for health summary generation
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @returns {string} Formatted prompt
 */
function createHealthSummaryPrompt(biomarkers) {
  const biomarkersJson = JSON.stringify(biomarkers, null, 2)

  return `Analyze these biomarkers and provide a health summary in plain language for a non-medical user. The biomarkers may have Polish or English names - use English names in your response.

Biomarkers:
${biomarkersJson}

Return JSON with this structure:
{
  "positives": [
    "First positive aspect in plain language",
    "Second positive aspect in plain language",
    "Third positive aspect in plain language"
  ],
  "priorities": [
    "First priority concern in plain language",
    "Second priority concern in plain language",
    "Third priority concern in plain language"
  ]
}

Requirements:
- Exactly 3 positives (focus on optimal biomarkers)
- Exactly 3 priorities (focus on suboptimal or concerning biomarkers)
- Use plain language, avoid medical jargon
- Be specific but understandable
- Use English biomarker names in your response (e.g., "Total Cholesterol" not "Cholesterol całkowity")
`
}

/**
 * Creates prompt for biological age calculation
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @returns {string} Formatted prompt
 */
function createBiologicalAgePrompt(biomarkers) {
  const biomarkersJson = JSON.stringify(biomarkers, null, 2)

  return `Calculate biological age based on these biomarkers using validated algorithms (PhenoAge, DunedinPACE, or similar).

Biomarkers:
${biomarkersJson}

IMPORTANT: You must return a valid JSON object with the biological age as a number between 20 and 100.

Return ONLY valid JSON in this exact format:
{
  "biologicalAge": 42
}

Requirements:
- Use validated biological age calculation methods (PhenoAge, DunedinPACE, or similar)
- Consider all available biomarkers and their values relative to optimal ranges
- Return a realistic biological age as a number between 20-100 years
- Do NOT return zeros, empty strings, or invalid values
- Return ONLY the JSON object, nothing else
`
}

/**
 * Creates prompt for recommendations generation
 * 
 * @param {Array<Object>} biomarkers - Extracted biomarkers
 * @param {number} biologicalAge - Calculated biological age
 * @returns {string} Formatted prompt
 */
function createRecommendationsPrompt(biomarkers, biologicalAge) {
  const biomarkersJson = JSON.stringify(biomarkers, null, 2)

  return `Based on these biomarkers and biological age, provide 3 prioritized actionable recommendations. The biomarkers may have Polish or English names - analyze them correctly regardless of language.

Biomarkers:
${biomarkersJson}

Biological Age: ${biologicalAge}

Return JSON:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description with specific guidance (e.g., 'Take 2000-4000 IU Vitamin D3 daily')",
      "actionType": "supplementation" | "habit" | "lifestyle",
      "impact": "high" | "medium" | "low",
      "priority": 1
    },
    {
      "title": "Second recommendation",
      "description": "Detailed description",
      "actionType": "supplementation" | "habit" | "lifestyle",
      "impact": "high" | "medium" | "low",
      "priority": 2
    },
    {
      "title": "Third recommendation",
      "description": "Detailed description",
      "actionType": "supplementation" | "habit" | "lifestyle",
      "impact": "high" | "medium" | "low",
      "priority": 3
    }
  ]
}

Requirements:
- Exactly 3 recommendations, prioritized by impact
- Use active substance names (e.g., 'Vitamin D3', 'Omega-3'), NOT brand names
- Provide specific dosages/ranges when applicable
- Focus on improving biomarkers and decreasing biological age
- Be actionable and clear
- Use English names in your response (e.g., "Vitamin D" not "Witamina D")
`
}

/**
 * Validates and normalizes extracted biomarkers
 * 
 * @param {Array<Object>} biomarkers - Raw biomarkers from AI
 * @returns {Array<Object>} Validated biomarkers
 */
/**
 * Converts Polish number format (comma as decimal separator) to number
 * @param {string|number} value - Value to convert
 * @returns {number} Converted number
 */
function parsePolishNumber(value) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value !== 'string') {
    return NaN
  }
  // Replace comma with dot for decimal separator
  const normalized = value.replace(',', '.')
  return parseFloat(normalized)
}

function validateAndNormalizeBiomarkers(biomarkers) {
  if (!Array.isArray(biomarkers)) {
    return []
  }

  return biomarkers
    .map(b => {
      // Normalize value to number - handle Polish format (comma as decimal separator)
      const numValue = parsePolishNumber(b.value)
      
      // Check if value is valid number
      if (isNaN(numValue)) {
        return null // Will be filtered out
      }
      
      // Normalize optimal range - handle Polish format and different range formats
      let min = 0
      let max = 0
      
      if (b.optimalRange) {
        min = parsePolishNumber(b.optimalRange.min) || 0
        max = parsePolishNumber(b.optimalRange.max) || 0
        
        // If max is 0 or very high, it might be a "greater than" format
        // If min is 0 and max is reasonable, it might be a "less than" format
        // These are handled by the AI prompt, but we validate here
        if (max > 999999) {
          max = 999999 // Cap very high values
        }
      }
      
      return {
        name: String(b.name || '').trim(),
        value: numValue,
        unit: String(b.unit || '').trim(),
        optimalRange: {
          min: min,
          max: max,
        },
        status: determineStatus(numValue, {
          min: min,
          max: max,
        }),
        description: b.description || '',
      }
    })
    .filter(b => {
      // Filter out invalid biomarkers
      // Allow biomarkers even if optimalRange is not perfect (AI might not always provide it)
      return (
        b !== null &&
        b.name &&
        b.name.length > 0 &&
        !isNaN(b.value) &&
        b.unit &&
        b.unit.length > 0
      )
    })
}

/**
 * Determines biomarker status based on value and optimal range
 * 
 * @param {number} value - Biomarker value
 * @param {Object} optimalRange - Optimal range {min, max}
 * @returns {string} Status: 'optimal', 'suboptimal', or 'concerning'
 */
function determineStatus(value, optimalRange) {
  const { min, max } = optimalRange
  const range = max - min
  const margin = range * 0.1 // 10% margin

  if (value >= min - margin && value <= max + margin) {
    return 'optimal'
  } else if (value >= min - margin * 2 && value <= max + margin * 2) {
    return 'suboptimal'
  } else {
    return 'concerning'
  }
}

/**
 * Validates health summary structure
 * 
 * @param {Object} summary - Health summary from AI
 * @returns {Object} Validated health summary
 */
function validateHealthSummary(summary) {
  const positives = Array.isArray(summary.positives) ? summary.positives : []
  const priorities = Array.isArray(summary.priorities) ? summary.priorities : []

  // Filter valid strings - return only what AI provided (no defaults)
  const validPositives = positives.filter(p => typeof p === 'string' && p.trim().length > 0)
  const validPriorities = priorities.filter(p => typeof p === 'string' && p.trim().length > 0)

  // Return exactly what AI provided (up to 3 of each, but can be less)
  // No filling with defaults - show incomplete data if AI didn't provide enough
  return {
    positives: validPositives.slice(0, 3),
    priorities: validPriorities.slice(0, 3),
  }
}

/**
 * Validates recommendations structure
 * 
 * @param {Array<Object>} recommendations - Recommendations from AI
 * @returns {Array<Object>} Validated recommendations
 */
function validateRecommendations(recommendations) {
  if (!Array.isArray(recommendations)) {
    return []
  }

  return recommendations
    .filter(r => {
      return (
        r.title &&
        r.description &&
        ['supplementation', 'habit', 'lifestyle'].includes(r.actionType) &&
        ['high', 'medium', 'low'].includes(r.impact) &&
        typeof r.priority === 'number'
      )
    })
    .slice(0, 3) // Ensure max 3
    .map((r, index) => ({
      title: String(r.title).trim(),
      description: String(r.description).trim(),
      actionType: r.actionType,
      impact: r.impact,
      priority: index + 1, // Normalize priorities
    }))
}
