/**
 * Analysis Service
 * 
 * Mock AI analysis service for processing blood test results.
 * In production, this would connect to an actual AI backend.
 * 
 * This service simulates:
 * - PDF/image parsing
 * - Biomarker extraction
 * - Health analysis
 * - Biological age calculation
 * - Recommendation generation
 */

/**
 * Simulates analysis of uploaded blood test file(s)
 * 
 * @param {File|File[]} files - The uploaded file(s) (PDF or image)
 * @param {number|null} chronologicalAge - Optional chronological age for comparison
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeBloodTest(files, chronologicalAge = null) {
  // Normalize to array
  const filesArray = Array.isArray(files) ? files : [files]

  // Simulate processing time (1-3 seconds per file, with max cap)
  const processingTime = Math.min(
    1000 + Math.random() * 2000 * filesArray.length,
    5000
  ) // Cap at 5 seconds
  await new Promise((resolve) => setTimeout(resolve, processingTime))

  // For multiple files, combine biomarkers from all files
  // In production, this would extract from each file and merge
  const allBiomarkers = []

  // Simulate extracting biomarkers from each file
  // In real implementation, each file would be parsed separately
  filesArray.forEach((file, index) => {
    // Generate mock biomarkers for each file (with slight variations)
    const fileBiomarkers = generateMockBiomarkers(index)
    allBiomarkers.push(...fileBiomarkers)
  })

  // Merge biomarkers by name (take the most recent/latest value if duplicates)
  // In production, this would intelligently merge based on test dates
  const mergedBiomarkers = mergeBiomarkers(allBiomarkers)

  // Generate health summary from merged biomarkers
  const healthSummary = generateHealthSummary(mergedBiomarkers)

  // Calculate biological age from merged biomarkers
  const biologicalAge = calculateBiologicalAge(mergedBiomarkers)

  // Generate recommendations based on merged analysis
  const recommendations = generateRecommendations(
    mergedBiomarkers,
    biologicalAge
  )

  return {
    biomarkers: mergedBiomarkers,
    healthSummary,
    biologicalAge,
    chronologicalAge: chronologicalAge || null, // User-provided chronological age
    recommendations,
    analysisDate: new Date().toISOString(),
    filesAnalyzed: filesArray.length,
  }
}

/**
 * Merges biomarkers from multiple files
 * If duplicate biomarker names exist, keeps the one with the most concerning status
 * or the most recent value
 * 
 * @param {Array<Object>} biomarkers - Array of all biomarkers from all files
 * @returns {Array<Object>} Merged biomarkers array
 */
function mergeBiomarkers(biomarkers) {
  const biomarkerMap = new Map()

  biomarkers.forEach((marker) => {
    const existing = biomarkerMap.get(marker.name)

    if (!existing) {
      biomarkerMap.set(marker.name, marker)
    } else {
      // Priority: concerning > suboptimal > optimal
      const statusPriority = { concerning: 3, suboptimal: 2, optimal: 1 }
      if (
        statusPriority[marker.status] >
        statusPriority[existing.status]
      ) {
        biomarkerMap.set(marker.name, marker)
      } else if (marker.status === existing.status) {
        // If same status, keep the one further from optimal range
        const existingDistance = Math.abs(
          existing.value -
            (existing.optimalRange.min + existing.optimalRange.max) / 2
        )
        const newDistance = Math.abs(
          marker.value - (marker.optimalRange.min + marker.optimalRange.max) / 2
        )
        if (newDistance > existingDistance) {
          biomarkerMap.set(marker.name, marker)
        }
      }
    }
  })

  return Array.from(biomarkerMap.values())
}

/**
 * Generates mock biomarker data
 * In production, this would be extracted from the uploaded file
 * 
 * @param {number} variation - Variation index for generating different values
 * @returns {Array<Object>} Array of biomarker objects
 */
function generateMockBiomarkers(variation = 0) {
  // Add slight variation based on file index to simulate different test results
  const variationFactor = 1 + variation * 0.05 // Small variation (5% per file)
  
  return [
    {
      name: 'Total Cholesterol',
      value: Math.round(220 * variationFactor),
      unit: 'mg/dL',
      optimalRange: { min: 0, max: 200 },
      status: 'suboptimal',
      description: 'Slightly elevated cholesterol levels',
    },
    {
      name: 'HDL Cholesterol',
      value: 55,
      unit: 'mg/dL',
      optimalRange: { min: 40, max: 100 },
      status: 'optimal',
      description: 'Good HDL levels',
    },
    {
      name: 'LDL Cholesterol',
      value: 140,
      unit: 'mg/dL',
      optimalRange: { min: 0, max: 100 },
      status: 'suboptimal',
      description: 'LDL levels above optimal range',
    },
    {
      name: 'Triglycerides',
      value: 150,
      unit: 'mg/dL',
      optimalRange: { min: 0, max: 150 },
      status: 'optimal',
      description: 'Triglycerides within normal range',
    },
    {
      name: 'HbA1c',
      value: 5.4,
      unit: '%',
      optimalRange: { min: 4.0, max: 5.6 },
      status: 'optimal',
      description: 'Excellent blood sugar control',
    },
    {
      name: 'Vitamin D',
      value: 28,
      unit: 'ng/mL',
      optimalRange: { min: 30, max: 100 },
      status: 'suboptimal',
      description: 'Vitamin D levels below optimal',
    },
    {
      name: 'C-Reactive Protein (CRP)',
      value: 2.1,
      unit: 'mg/L',
      optimalRange: { min: 0, max: 1.0 },
      status: 'concerning',
      description: 'Elevated inflammation markers',
    },
    {
      name: 'Testosterone',
      value: 450,
      unit: 'ng/dL',
      optimalRange: { min: 300, max: 1000 },
      status: 'optimal',
      description: 'Testosterone within healthy range',
    },
  ]
}

/**
 * Generates health summary with 3 positives and 3 priorities
 * 
 * @param {Array<Object>} biomarkers - Array of biomarker data
 * @returns {Object} Health summary object
 */
function generateHealthSummary(biomarkers) {
  const optimal = biomarkers.filter((b) => b.status === 'optimal')
  const suboptimal = biomarkers.filter((b) => b.status === 'suboptimal')
  const concerning = biomarkers.filter((b) => b.status === 'concerning')

  // Select top 3 positive aspects
  const positives = [
    'Excellent blood sugar control (HbA1c: 5.4%) - reducing diabetes risk',
    'Good HDL cholesterol levels - supporting cardiovascular health',
    'Healthy testosterone levels - maintaining energy and vitality',
  ]

  // Select top 3 priorities
  const priorities = [
    'Elevated inflammation (CRP: 2.1) - focus on anti-inflammatory diet and stress management',
    'Vitamin D deficiency (28 ng/mL) - consider supplementation to reach optimal levels (30-100 ng/mL)',
    'LDL cholesterol above optimal (140 mg/dL) - implement dietary changes and regular exercise',
  ]

  return {
    positives,
    priorities,
  }
}

/**
 * Calculates biological age based on biomarkers
 * 
 * @param {Array<Object>} biomarkers - Array of biomarker data
 * @returns {number} Estimated biological age
 */
function calculateBiologicalAge(biomarkers) {
  // Simplified calculation - in production, this would use validated algorithms
  let ageScore = 45 // Base age

  biomarkers.forEach((marker) => {
    if (marker.status === 'optimal') {
      ageScore -= 0.5
    } else if (marker.status === 'suboptimal') {
      ageScore += 1
    } else if (marker.status === 'concerning') {
      ageScore += 2
    }
  })

  // Ensure reasonable range (30-80)
  return Math.max(30, Math.min(80, Math.round(ageScore)))
}

/**
 * Generates 3 prioritized recommendations
 * 
 * @param {Array<Object>} biomarkers - Array of biomarker data
 * @param {number} biologicalAge - Calculated biological age
 * @returns {Array<Object>} Array of recommendation objects
 */
function generateRecommendations(biomarkers, biologicalAge) {
  const recommendations = []

  // Check for inflammation
  const crp = biomarkers.find((b) => b.name.includes('C-Reactive Protein'))
  if (crp && crp.status === 'concerning') {
    recommendations.push({
      title: 'Reduce Inflammation',
      description:
        'Focus on anti-inflammatory foods: increase omega-3 intake (fatty fish, walnuts), add turmeric and ginger to your diet, and practice stress-reduction techniques like meditation.',
      actionType: 'lifestyle',
      impact: 'high',
      priority: 1,
    })
  }

  // Check for Vitamin D
  const vitaminD = biomarkers.find((b) => b.name.includes('Vitamin D'))
  if (vitaminD && vitaminD.status === 'suboptimal') {
    recommendations.push({
      title: 'Optimize Vitamin D Levels',
      description:
        'Take 2000-4000 IU of Vitamin D3 daily with a meal containing fat. Get 15-20 minutes of sun exposure daily when possible. Re-test in 3 months.',
      actionType: 'supplementation',
      impact: 'high',
      priority: 2,
    })
  }

  // Check for cholesterol
  const ldl = biomarkers.find((b) => b.name.includes('LDL'))
  if (ldl && ldl.status === 'suboptimal') {
    recommendations.push({
      title: 'Improve Cholesterol Profile',
      description:
        'Reduce saturated fats, increase soluble fiber (oats, beans, apples), add plant sterols, and engage in 150 minutes of moderate exercise weekly.',
      actionType: 'lifestyle',
      impact: 'high',
      priority: 3,
    })
  }

  // Fill remaining slots with general recommendations if needed
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Maintain Regular Exercise',
      description:
        'Continue your current exercise routine. Aim for a mix of strength training (2-3x/week) and cardiovascular exercise (150 minutes/week) to support overall longevity.',
      actionType: 'habit',
      impact: 'medium',
      priority: recommendations.length + 1,
    })
  }

  return recommendations.slice(0, 3) // Ensure exactly 3 recommendations
}

/**
 * Validates uploaded file
 * 
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateFile(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ]

  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 10MB',
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        'Invalid file type. Please upload a PDF or image (JPG, PNG, WebP)',
    }
  }

  return { isValid: true, error: null }
}
