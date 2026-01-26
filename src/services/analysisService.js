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
    // CBC (Morfologia) - Common Polish markers
    {
      name: 'RBC (Erythrocytes)',
      value: Math.round(4.5 * variationFactor * 1000000),
      unit: '/µl',
      optimalRange: { min: 4200000, max: 5700000 },
      status: 'optimal',
      description: 'Red blood cell count within normal range',
    },
    {
      name: 'Hemoglobin (Hb)',
      value: Math.round(15 * variationFactor),
      unit: 'g/dL',
      optimalRange: { min: 14, max: 18 },
      status: 'optimal',
      description: 'Hemoglobin levels normal',
    },
    {
      name: 'Hematocrit (HCT)',
      value: Math.round(45 * variationFactor),
      unit: '%',
      optimalRange: { min: 40, max: 54 },
      status: 'optimal',
      description: 'Hematocrit within normal range',
    },
    {
      name: 'WBC (White Blood Cells)',
      value: Math.round(7 * variationFactor * 1000),
      unit: '/µl',
      optimalRange: { min: 4000, max: 10000 },
      status: 'optimal',
      description: 'White blood cell count normal',
    },
    {
      name: 'Platelets (PLT)',
      value: Math.round(250 * variationFactor * 1000),
      unit: '/µl',
      optimalRange: { min: 150000, max: 400000 },
      status: 'optimal',
      description: 'Platelet count within normal range',
    },
    {
      name: 'MCV',
      value: Math.round(88 * variationFactor),
      unit: 'fL',
      optimalRange: { min: 82, max: 96 },
      status: 'optimal',
      description: 'Mean corpuscular volume normal',
    },
    
    // Lipid Profile
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
    
    // Metabolic
    {
      name: 'Glucose',
      value: Math.round(95 * variationFactor),
      unit: 'mg/dL',
      optimalRange: { min: 70, max: 100 },
      status: 'optimal',
      description: 'Blood glucose within normal range',
    },
    {
      name: 'HbA1c',
      value: 5.4,
      unit: '%',
      optimalRange: { min: 4.0, max: 5.6 },
      status: 'optimal',
      description: 'Excellent blood sugar control',
    },
    
    // Inflammation
    {
      name: 'C-Reactive Protein (CRP)',
      value: 2.1,
      unit: 'mg/L',
      optimalRange: { min: 0, max: 1.0 },
      status: 'concerning',
      description: 'Elevated inflammation markers',
    },
    {
      name: 'ESR',
      value: Math.round(15 * variationFactor),
      unit: 'mm/h',
      optimalRange: { min: 0, max: 20 },
      status: 'optimal',
      description: 'Erythrocyte sedimentation rate normal',
    },
    
    // Liver Function
    {
      name: 'ALT',
      value: Math.round(25 * variationFactor),
      unit: 'U/L',
      optimalRange: { min: 0, max: 40 },
      status: 'optimal',
      description: 'ALT levels normal',
    },
    {
      name: 'AST',
      value: Math.round(28 * variationFactor),
      unit: 'U/L',
      optimalRange: { min: 0, max: 40 },
      status: 'optimal',
      description: 'AST levels normal',
    },
    {
      name: 'ALP',
      value: Math.round(85 * variationFactor),
      unit: 'U/L',
      optimalRange: { min: 44, max: 147 },
      status: 'optimal',
      description: 'Alkaline phosphatase normal',
    },
    {
      name: 'Bilirubin',
      value: Math.round(0.8 * variationFactor * 10) / 10,
      unit: 'mg/dL',
      optimalRange: { min: 0.1, max: 1.2 },
      status: 'optimal',
      description: 'Bilirubin levels normal',
    },
    {
      name: 'GGT',
      value: Math.round(30 * variationFactor),
      unit: 'U/L',
      optimalRange: { min: 0, max: 60 },
      status: 'optimal',
      description: 'GGT levels normal',
    },
    
    // Kidney Function
    {
      name: 'Creatinine',
      value: Math.round(0.9 * variationFactor * 10) / 10,
      unit: 'mg/dL',
      optimalRange: { min: 0.6, max: 1.2 },
      status: 'optimal',
      description: 'Creatinine levels normal',
    },
    {
      name: 'BUN',
      value: Math.round(15 * variationFactor),
      unit: 'mg/dL',
      optimalRange: { min: 7, max: 20 },
      status: 'optimal',
      description: 'Blood urea nitrogen normal',
    },
    {
      name: 'eGFR',
      value: Math.round(90 * variationFactor),
      unit: 'mL/min/1.73m²',
      optimalRange: { min: 90, max: 120 },
      status: 'optimal',
      description: 'Estimated glomerular filtration rate normal',
    },
    
    // Thyroid
    {
      name: 'TSH',
      value: Math.round(2.0 * variationFactor * 10) / 10,
      unit: 'mIU/L',
      optimalRange: { min: 0.4, max: 4.0 },
      status: 'optimal',
      description: 'Thyroid-stimulating hormone normal',
    },
    {
      name: 'Free T4',
      value: Math.round(1.2 * variationFactor * 10) / 10,
      unit: 'ng/dL',
      optimalRange: { min: 0.8, max: 1.8 },
      status: 'optimal',
      description: 'Free T4 levels normal',
    },
    {
      name: 'Free T3',
      value: Math.round(3.2 * variationFactor * 10) / 10,
      unit: 'pg/mL',
      optimalRange: { min: 2.3, max: 4.2 },
      status: 'optimal',
      description: 'Free T3 levels normal',
    },
    
    // Vitamins/Minerals
    {
      name: 'Vitamin D',
      value: 28,
      unit: 'ng/mL',
      optimalRange: { min: 30, max: 100 },
      status: 'suboptimal',
      description: 'Vitamin D levels below optimal',
    },
    {
      name: 'Calcium',
      value: Math.round(9.5 * variationFactor * 10) / 10,
      unit: 'mg/dL',
      optimalRange: { min: 8.5, max: 10.5 },
      status: 'optimal',
      description: 'Calcium levels normal',
    },
    {
      name: 'Phosphorus',
      value: Math.round(3.5 * variationFactor * 10) / 10,
      unit: 'mg/dL',
      optimalRange: { min: 2.5, max: 4.5 },
      status: 'optimal',
      description: 'Phosphorus levels normal',
    },
    {
      name: 'Magnesium',
      value: Math.round(2.0 * variationFactor * 10) / 10,
      unit: 'mg/dL',
      optimalRange: { min: 1.7, max: 2.2 },
      status: 'optimal',
      description: 'Magnesium levels normal',
    },
    
    // Hormones
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

  // Select top 3 positive aspects from optimal biomarkers
  // Prioritize biomarkers with high health impact
  const positiveBiomarkers = optimal
    .filter((b) => {
      // Prioritize important markers
      const importantMarkers = [
        'HbA1c',
        'HDL',
        'Testosterone',
        'Hemoglobin',
        'eGFR',
        'TSH',
      ]
      return importantMarkers.some((marker) =>
        b.name.toLowerCase().includes(marker.toLowerCase())
      )
    })
    .slice(0, 3)

  const positives = positiveBiomarkers.map((marker) => {
    if (marker.name.includes('HbA1c')) {
      return `Excellent blood sugar control (HbA1c: ${marker.value}${marker.unit}) - reducing diabetes risk`
    }
    if (marker.name.includes('HDL')) {
      return `Good HDL cholesterol levels (${marker.value} ${marker.unit}) - supporting cardiovascular health`
    }
    if (marker.name.includes('Testosterone')) {
      return `Healthy testosterone levels (${marker.value} ${marker.unit}) - maintaining energy and vitality`
    }
    if (marker.name.includes('Hemoglobin')) {
      return `Healthy hemoglobin levels (${marker.value} ${marker.unit}) - good oxygen transport`
    }
    if (marker.name.includes('eGFR')) {
      return `Good kidney function (eGFR: ${marker.value} ${marker.unit}) - supporting overall health`
    }
    if (marker.name.includes('TSH')) {
      return `Normal thyroid function (TSH: ${marker.value} ${marker.unit}) - supporting metabolism`
    }
    return `${marker.name} within optimal range - ${marker.description}`
  })

  // Fill remaining slots if needed
  while (positives.length < 3 && optimal.length > positives.length) {
    const remaining = optimal.filter(
      (b) => !positiveBiomarkers.includes(b)
    )
    if (remaining.length > 0) {
      const marker = remaining[0]
      positives.push(
        `${marker.name} within optimal range - ${marker.description}`
      )
    } else {
      break
    }
  }

  // Select top 3 priorities from suboptimal and concerning biomarkers
  // Prioritize concerning > suboptimal, and by health impact
  const priorityBiomarkers = [...concerning, ...suboptimal]
    .filter((b) => {
      // Prioritize high-impact markers
      const highImpactMarkers = [
        'CRP',
        'C-Reactive Protein',
        'Vitamin D',
        'LDL',
        'Total Cholesterol',
        'Glucose',
        'Creatinine',
      ]
      return highImpactMarkers.some((marker) =>
        b.name.toLowerCase().includes(marker.toLowerCase())
      )
    })
    .slice(0, 3)

  const priorities = priorityBiomarkers.map((marker, index) => {
    if (marker.name.includes('CRP') || marker.name.includes('C-Reactive Protein')) {
      return `Elevated inflammation (CRP: ${marker.value} ${marker.unit}) - focus on anti-inflammatory diet and stress management`
    }
    if (marker.name.includes('Vitamin D')) {
      return `Vitamin D deficiency (${marker.value} ${marker.unit}) - consider supplementation to reach optimal levels (${marker.optimalRange.min}-${marker.optimalRange.max} ${marker.unit})`
    }
    if (marker.name.includes('LDL')) {
      return `LDL cholesterol above optimal (${marker.value} ${marker.unit}) - implement dietary changes and regular exercise`
    }
    if (marker.name.includes('Total Cholesterol')) {
      return `Total cholesterol elevated (${marker.value} ${marker.unit}) - focus on heart-healthy diet and lifestyle`
    }
    if (marker.name.includes('Glucose')) {
      return `Blood glucose needs attention (${marker.value} ${marker.unit}) - consider dietary modifications and regular monitoring`
    }
    return `${marker.name} needs attention (${marker.value} ${marker.unit}) - ${marker.description}`
  })

  // Fill remaining slots if needed
  while (priorities.length < 3 && priorityBiomarkers.length < biomarkers.length) {
    const remaining = [...concerning, ...suboptimal].filter(
      (b) => !priorityBiomarkers.includes(b)
    )
    if (remaining.length > 0) {
      const marker = remaining[0]
      priorities.push(
        `${marker.name} needs attention (${marker.value} ${marker.unit}) - ${marker.description}`
      )
    } else {
      break
    }
  }

  // Ensure exactly 3 of each
  return {
    positives: positives.slice(0, 3),
    priorities: priorities.slice(0, 3),
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
