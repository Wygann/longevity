/**
 * AI Service Tests
 * 
 * Tests for AI service integration with Google Gemini API
 * Uses mocks to avoid actual API calls during testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock environment variables - create mock function inside factory
vi.mock('../utils/env', () => {
  const mockGetEnvFn = vi.fn()
  return {
    getEnv: mockGetEnvFn,
    getEnvBoolean: vi.fn(),
  }
})

// Import AFTER mocking
import {
  isAIAvailable,
  extractBiomarkers,
  generateHealthSummary,
  calculateBiologicalAge,
  generateRecommendations,
} from './aiService'

// Import mocked module to access the mock function
import { getEnv } from '../utils/env'
const mockGetEnv = vi.mocked(getEnv)

// Mock fetch globally
global.fetch = vi.fn()

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: AI available with proper mock implementation for different keys
    mockGetEnv.mockImplementation((key, defaultValue) => {
      const envVars = {
        'GEMINI_API_KEY': 'sk-test-key',
        'GEMINI_API_URL': 'https://generativelanguage.googleapis.com/v1beta/models',
        'GEMINI_MODEL': 'gemini-3-flash-preview',
      }
      return envVars[key] || defaultValue || ''
    })
  })

  describe('isAIAvailable', () => {
    /**
     * Test: Returns true when API key is set
     */
    it('returns true when API key is configured', () => {
      mockGetEnv.mockImplementation((key) => {
        if (key === 'GEMINI_API_KEY') return 'sk-test-key'
        return 'https://generativelanguage.googleapis.com/v1beta/models'
      })
      expect(isAIAvailable()).toBe(true)
    })

    /**
     * Test: Returns false when API key is not set
     */
    it('returns false when API key is not set', () => {
      mockGetEnv.mockImplementation((key) => {
        if (key === 'GEMINI_API_KEY') return ''
        return 'https://generativelanguage.googleapis.com/v1beta/models'
      })
      expect(isAIAvailable()).toBe(false)
    })

    /**
     * Test: Returns false when API key is placeholder
     */
    it('returns false when API key is placeholder', () => {
      mockGetEnv.mockImplementation((key) => {
        if (key === 'GEMINI_API_KEY') return 'your_gemini_api_key_here'
        return 'https://generativelanguage.googleapis.com/v1beta/models'
      })
      expect(isAIAvailable()).toBe(false)
    })
  })

  describe('extractBiomarkers', () => {
    /**
     * Test: Extracts biomarkers from text successfully
     */
    it('extracts biomarkers from text successfully', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    biomarkers: [
                      {
                        name: 'Total Cholesterol',
                        value: 185,
                        unit: 'mg/dL',
                        optimalRange: { min: 0, max: 200 },
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Provide sufficient text (>50 chars)
      const testContent = 'Cholesterol: 185 mg/dL\nHDL: 58 mg/dL\nLDL: 108 mg/dL\nGlucose: 92 mg/dL\nHbA1c: 5.2%'
      const biomarkers = await extractBiomarkers(testContent, 'text/plain')

      expect(biomarkers).toHaveLength(1)
      expect(biomarkers[0].name).toBe('Total Cholesterol')
      expect(biomarkers[0].value).toBe(185)
      expect(biomarkers[0].status).toBeDefined()
    })

    /**
     * Test: Handles API errors gracefully
     */
    it('throws error when API call fails', async () => {
      // Using default mock implementation from beforeEach
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
        json: async () => ({ error: { message: 'Invalid API key' } }),
      })

      // Provide sufficient text
      const testContent = 'Cholesterol: 185 mg/dL\nHDL: 58 mg/dL\nLDL: 108 mg/dL\nGlucose: 92 mg/dL\nHbA1c: 5.2%'
      await expect(
        extractBiomarkers(testContent, 'text/plain')
      ).rejects.toThrow()
    })

    /**
     * Test: Handles empty response
     */
    it('throws error when response is empty', async () => {
      // Using default mock implementation from beforeEach
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ candidates: [] }),
      })

      // Provide sufficient text
      const testContent = 'Cholesterol: 185 mg/dL\nHDL: 58 mg/dL\nLDL: 108 mg/dL\nGlucose: 92 mg/dL\nHbA1c: 5.2%'
      await expect(
        extractBiomarkers(testContent, 'text/plain')
      ).rejects.toThrow('No response from AI')
    })

    /**
     * Test: Validates biomarker structure
     */
    it('validates and normalizes biomarker structure', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    biomarkers: [
                      {
                        name: 'Cholesterol',
                        value: '185', // String instead of number
                        unit: 'mg/dL',
                        optimalRange: { min: 0, max: 200 },
                      },
                      {
                        name: 'HDL',
                        value: 58,
                        unit: 'mg/dL',
                        optimalRange: { min: 40, max: 100 },
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // Provide sufficient text
      const testContent = 'Cholesterol: 185 mg/dL\nHDL: 58 mg/dL\nLDL: 108 mg/dL\nGlucose: 92 mg/dL\nHbA1c: 5.2%'
      const biomarkers = await extractBiomarkers(testContent, 'text/plain')

      // Should normalize string to number
      // Find Cholesterol biomarker (may not be first if validation filters)
      const cholesterol = biomarkers.find(b => b.name.toLowerCase().includes('cholesterol'))
      expect(cholesterol).toBeDefined()
      expect(cholesterol.value).toBe(185)
      expect(typeof cholesterol.value).toBe('number')
      
      // Verify all biomarkers have numeric values
      biomarkers.forEach(b => {
        expect(typeof b.value).toBe('number')
      })
    })

    /**
     * Test: Returns empty array when no content provided
     */
    it('returns empty array when no content provided', async () => {
      // Using default mock implementation from beforeEach
      
      const biomarkers = await extractBiomarkers('', 'text/plain', null)
      
      expect(biomarkers).toEqual([])
    })
  })

  describe('generateHealthSummary', () => {
    /**
     * Test: Generates health summary successfully
     */
    it('generates health summary with 3 positives and 3 priorities', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    positives: [
                      'Excellent cholesterol levels',
                      'Good HDL levels',
                      'Normal blood sugar',
                    ],
                    priorities: [
                      'Vitamin D deficiency',
                      'Elevated inflammation',
                      'LDL above optimal',
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      const summary = await generateHealthSummary(biomarkers)

      expect(summary.positives).toHaveLength(3)
      expect(summary.priorities).toHaveLength(3)
    })

    /**
     * Test: Validates summary structure
     */
    it('validates and normalizes summary structure', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    positives: [
                      'Positive 1',
                      'Positive 2',
                      'Positive 3',
                      'Positive 4', // Extra one
                    ],
                    priorities: ['Priority 1'], // Only one
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      const summary = await generateHealthSummary(biomarkers)

      // Should limit to 3 positives
      expect(summary.positives).toHaveLength(3)
      // Should return only what AI provided (1 priority, not filled with defaults)
      expect(summary.priorities).toHaveLength(1)
    })
  })

  describe('calculateBiologicalAge', () => {
    /**
     * Test: Calculates biological age successfully
     */
    it('calculates biological age successfully', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    biologicalAge: 45,
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      const age = await calculateBiologicalAge(biomarkers)

      expect(age).toBe(45)
      expect(typeof age).toBe('number')
    })

    /**
     * Test: Validates age range
     */
    it('throws error for invalid age', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    biologicalAge: 150, // Invalid
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      await expect(calculateBiologicalAge(biomarkers)).rejects.toThrow()
    })
  })

  describe('generateRecommendations', () => {
    /**
     * Test: Generates recommendations successfully
     */
    it('generates 3 recommendations successfully', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    recommendations: [
                      {
                        title: 'Reduce Inflammation',
                        description: 'Take omega-3 supplements',
                        actionType: 'supplementation',
                        impact: 'high',
                        priority: 1,
                      },
                      {
                        title: 'Optimize Vitamin D',
                        description: 'Take 2000-4000 IU daily',
                        actionType: 'supplementation',
                        impact: 'high',
                        priority: 2,
                      },
                      {
                        title: 'Improve Cholesterol',
                        description: 'Reduce saturated fats',
                        actionType: 'lifestyle',
                        impact: 'high',
                        priority: 3,
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'CRP', value: 2.1, unit: 'mg/L', optimalRange: { min: 0, max: 1.0 }, status: 'concerning' },
      ]
      const recommendations = await generateRecommendations(biomarkers, 45)

      expect(recommendations).toHaveLength(3)
      expect(recommendations[0].title).toBe('Reduce Inflammation')
      expect(recommendations[0].actionType).toBe('supplementation')
    })

    /**
     * Test: Validates recommendation structure
     */
    it('validates and normalizes recommendation structure', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    recommendations: [
                      {
                        title: 'Test',
                        description: 'Test description',
                        actionType: 'invalid', // Invalid type
                        impact: 'high',
                        priority: 1,
                      },
                      {
                        title: 'Valid',
                        description: 'Valid description',
                        actionType: 'supplementation',
                        impact: 'high',
                        priority: 2,
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      const recommendations = await generateRecommendations(biomarkers, 45)

      // Should filter out invalid recommendations
      expect(recommendations.length).toBeLessThanOrEqual(2)
      expect(recommendations.every(r => 
        ['supplementation', 'habit', 'lifestyle'].includes(r.actionType)
      )).toBe(true)
    })

    /**
     * Test: Normalizes priorities
     */
    it('normalizes recommendation priorities', async () => {
      // Using default mock implementation from beforeEach
      
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    recommendations: [
                      {
                        title: 'First',
                        description: 'First',
                        actionType: 'supplementation',
                        impact: 'high',
                        priority: 5, // Wrong priority
                      },
                      {
                        title: 'Second',
                        description: 'Second',
                        actionType: 'lifestyle',
                        impact: 'high',
                        priority: 10, // Wrong priority
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const biomarkers = [
        { name: 'Cholesterol', value: 185, unit: 'mg/dL', optimalRange: { min: 0, max: 200 }, status: 'optimal' },
      ]
      const recommendations = await generateRecommendations(biomarkers, 45)

      // Should normalize priorities to 1, 2, 3
      expect(recommendations.length).toBeGreaterThan(0)
      if (recommendations.length >= 2) {
        expect(recommendations[0].priority).toBe(1)
        expect(recommendations[1].priority).toBe(2)
      }
    })
  })
})
