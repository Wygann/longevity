/**
 * Integration Tests for App Component
 * 
 * Tests the complete user flow from upload to results
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { analyzeBloodTest } from './services/analysisService'

// Mock the analysis service
vi.mock('./services/analysisService', () => ({
  analyzeBloodTest: vi.fn(),
}))

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test: Complete user flow - upload to results
   */
  it('completes full user flow from upload to results display', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: {
        positives: [
          'Excellent blood sugar control',
          'Good HDL cholesterol levels',
          'Healthy testosterone levels',
        ],
        priorities: [
          'Elevated inflammation',
          'Vitamin D deficiency',
          'LDL cholesterol above optimal',
        ],
      },
      biologicalAge: 45,
      chronologicalAge: null,
      recommendations: [
        {
          title: 'Reduce Inflammation',
          description: 'Focus on anti-inflammatory foods.',
          actionType: 'lifestyle',
          impact: 'high',
          priority: 1,
        },
        {
          title: 'Optimize Vitamin D',
          description: 'Take 2000-4000 IU daily.',
          actionType: 'supplementation',
          impact: 'high',
          priority: 2,
        },
        {
          title: 'Improve Cholesterol',
          description: 'Reduce saturated fats.',
          actionType: 'lifestyle',
          impact: 'high',
          priority: 3,
        },
      ],
      analysisDate: new Date().toISOString(),
      filesAnalyzed: 1,
    }

    // Delay the promise resolution to allow "analyzing" state to be visible
    analyzeBloodTest.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResults), 100))
    )

    const user = userEvent.setup()
    render(<App />)

    // Step 1: Upload file
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')
    await user.upload(input, file)

    // Step 2: Wait for analysis
    await waitFor(() => {
      expect(screen.getByText(/Analyzing your blood test results/i)).toBeInTheDocument()
    }, { timeout: 2000 })

    // Step 3: Wait for results
    await waitFor(() => {
      expect(screen.getByText('Analysis Complete')).toBeInTheDocument()
    })

    // Step 4: Verify results displayed
    expect(screen.getByText('45')).toBeInTheDocument() // Biological age
    expect(screen.getByText('Excellent blood sugar control')).toBeInTheDocument()
    expect(screen.getByText('Elevated inflammation')).toBeInTheDocument()
    expect(screen.getByText('Reduce Inflammation')).toBeInTheDocument()
  })

  /**
   * Test: Multiple file upload flow
   */
  it('handles multiple file upload correctly', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: { positives: [], priorities: [] },
      biologicalAge: 45,
      recommendations: [],
      filesAnalyzed: 2,
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    const file1 = new File(['test1'], 'test1.pdf', { type: 'application/pdf' })
    const file2 = new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')

    // Upload multiple files
    await user.upload(input, [file1, file2])

    await waitFor(() => {
      expect(analyzeBloodTest).toHaveBeenCalledWith(
        expect.arrayContaining([file1, file2]),
        null
      )
    })
  })

  /**
   * Test: Chronological age input and usage
   */
  it('uses chronological age when provided', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: { positives: [], priorities: [] },
      biologicalAge: 45,
      chronologicalAge: 50,
      recommendations: [],
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    // Enter chronological age
    const ageInput = screen.getByLabelText(/Your Age/i)
    await user.type(ageInput, '50')

    // Upload file
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')
    await user.upload(input, file)

    await waitFor(() => {
      expect(analyzeBloodTest).toHaveBeenCalledWith(
        expect.any(Array),
        50
      )
    })
  })

  /**
   * Test: Error handling flow
   */
  it('handles analysis errors gracefully', async () => {
    analyzeBloodTest.mockRejectedValue(new Error('Analysis failed'))

    const user = userEvent.setup()
    render(<App />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')
    await user.upload(input, file)

    await waitFor(() => {
      const errorElements = screen.getAllByText(/Analysis Failed/i)
      expect(errorElements.length).toBeGreaterThan(0)
      expect(screen.getByText(/Try Again/i)).toBeInTheDocument()
    })
  })

  /**
   * Test: Reset functionality
   */
  it('resets to initial state when reset button clicked', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: { positives: [], priorities: [] },
      biologicalAge: 45,
      recommendations: [],
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    // Upload and get results
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('Analyze Another Test')).toBeInTheDocument()
    })

    // Reset
    const resetButton = screen.getByText('Analyze Another Test')
    await user.click(resetButton)

    // Should be back to upload state
    expect(screen.getByText('Upload Blood Test Results')).toBeInTheDocument()
  })

  /**
   * Test: Age validation
   */
  it('validates chronological age input', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Enter invalid age
    const ageInput = screen.getByLabelText(/Your Age/i)
    await user.type(ageInput, '150') // Invalid

    // Upload file
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText(/valid age between 1 and 120/i)).toBeInTheDocument()
    })

    expect(analyzeBloodTest).not.toHaveBeenCalled()
  })
})
