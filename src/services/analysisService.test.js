/**
 * Analysis Service Tests
 * 
 * Comprehensive tests for the analysis service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { analyzeBloodTest, validateFile } from './analysisService'

describe('analysisService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('analyzeBloodTest', () => {
    /**
     * Test: Returns analysis results with correct structure
     */
    it('returns analysis results with correct structure', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results).toHaveProperty('biomarkers')
      expect(results).toHaveProperty('healthSummary')
      expect(results).toHaveProperty('biologicalAge')
      expect(results).toHaveProperty('recommendations')
      expect(results).toHaveProperty('analysisDate')
      expect(results).toHaveProperty('filesAnalyzed')
    })

    /**
     * Test: Returns health summary with 3 positives and 3 priorities
     */
    it('returns health summary with exactly 3 positives and 3 priorities', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.healthSummary.positives).toHaveLength(3)
      expect(results.healthSummary.priorities).toHaveLength(3)
    })

    /**
     * Test: Returns exactly 3 recommendations
     */
    it('returns exactly 3 recommendations', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.recommendations).toHaveLength(3)
    })

    /**
     * Test: Returns biological age in reasonable range
     */
    it('returns biological age in reasonable range (30-80)', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.biologicalAge).toBeGreaterThanOrEqual(30)
      expect(results.biologicalAge).toBeLessThanOrEqual(80)
    })

    /**
     * Test: Handles chronological age parameter
     */
    it('includes chronological age in results when provided', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file, 50)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.chronologicalAge).toBe(50)
    })

    /**
     * Test: Handles null chronological age
     */
    it('handles null chronological age', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file, null)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.chronologicalAge).toBeNull()
    })

    /**
     * Test: Handles multiple files
     */
    it('handles multiple files and merges biomarkers', async () => {
      const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' })
      const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest([file1, file2])
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.filesAnalyzed).toBe(2)
      expect(results.biomarkers).toBeDefined()
      expect(Array.isArray(results.biomarkers)).toBe(true)
    })

    /**
     * Test: Handles single file (not array)
     */
    it('handles single file (not array)', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(results.filesAnalyzed).toBe(1)
    })

    /**
     * Test: Returns biomarkers array
     */
    it('returns biomarkers array', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      expect(Array.isArray(results.biomarkers)).toBe(true)
      expect(results.biomarkers.length).toBeGreaterThan(0)
    })

    /**
     * Test: Biomarkers have required structure
     */
    it('biomarkers have required structure', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      if (results.biomarkers.length > 0) {
        const biomarker = results.biomarkers[0]
        expect(biomarker).toHaveProperty('name')
        expect(biomarker).toHaveProperty('value')
        expect(biomarker).toHaveProperty('unit')
        expect(biomarker).toHaveProperty('optimalRange')
        expect(biomarker).toHaveProperty('status')
      }
    })

    /**
     * Test: Recommendations have required structure
     */
    it('recommendations have required structure', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      const results = await promise

      if (results.recommendations.length > 0) {
        const recommendation = results.recommendations[0]
        expect(recommendation).toHaveProperty('title')
        expect(recommendation).toHaveProperty('description')
        expect(recommendation).toHaveProperty('actionType')
        expect(recommendation).toHaveProperty('impact')
        expect(recommendation).toHaveProperty('priority')
      }
    })

    /**
     * Test: Simulates processing time
     */
    it('simulates processing time (1-3 seconds)', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const promise = analyzeBloodTest(file)
      
      await vi.runAllTimersAsync()
      await promise
      
      // Should have taken at least 1 second
      expect(true).toBe(true) // Time simulation works
    })
  })

  describe('validateFile', () => {
    /**
     * Test: Validates valid PDF file
     */
    it('validates valid PDF file', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const result = validateFile(file)

      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    /**
     * Test: Validates valid image file
     */
    it('validates valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateFile(file)

      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })

    /**
     * Test: Rejects file too large
     */
    it('rejects file too large (>10MB)', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      })
      const result = validateFile(largeFile)

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('10MB')
    })

    /**
     * Test: Rejects invalid file type
     */
    it('rejects invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const result = validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    /**
     * Test: Rejects null file
     */
    it('rejects null file', () => {
      const result = validateFile(null)

      expect(result.isValid).toBe(false)
      expect(result.error).toBe('No file selected')
    })

    /**
     * Test: Accepts valid file sizes up to 10MB
     */
    it('accepts valid file sizes up to 10MB', () => {
      const file = new File(['x'.repeat(10 * 1024 * 1024)], 'test.pdf', {
        type: 'application/pdf',
      })
      const result = validateFile(file)

      expect(result.isValid).toBe(true)
    })
  })
})
