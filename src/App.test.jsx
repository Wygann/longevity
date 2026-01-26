/**
 * App Component Tests
 * 
 * Tests for the main Longevity AI application component
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

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test: App renders with upload interface
   */
  it('renders the upload interface initially', () => {
    render(<App />)
    expect(screen.getByText('Longevity AI')).toBeInTheDocument()
    expect(screen.getByText('Upload Blood Test Results')).toBeInTheDocument()
  })

  /**
   * Test: Privacy notice is displayed
   */
  it('displays privacy notice on initial load', () => {
    render(<App />)
    expect(screen.getByText(/Zero-Retention Privacy Model/i)).toBeInTheDocument()
  })

  /**
   * Test: File upload triggers analysis
   */
  it('triggers analysis when file is uploaded', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: {
        positives: ['Test positive'],
        priorities: ['Test priority'],
      },
      biologicalAge: 45,
      recommendations: [
        {
          title: 'Test Recommendation',
          description: 'Test description',
          actionType: 'lifestyle',
          impact: 'high',
          priority: 1,
        },
      ],
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')

    await user.upload(input, file)

    expect(analyzeBloodTest).toHaveBeenCalledWith(expect.arrayContaining([file]), null)
  })

  /**
   * Test: Shows loading state during analysis
   */
  it('shows loading state during analysis', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: { positives: [], priorities: [] },
      biologicalAge: 45,
      recommendations: [],
    }

    // Delay the promise resolution
    analyzeBloodTest.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockResults), 100))
    )

    const user = userEvent.setup()
    render(<App />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText(/Analyzing your blood test results/i)).toBeInTheDocument()
    })
  })

  /**
   * Test: Displays results after successful analysis
   */
  it('displays results after successful analysis', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: {
        positives: ['Positive 1', 'Positive 2', 'Positive 3'],
        priorities: ['Priority 1', 'Priority 2', 'Priority 3'],
      },
      biologicalAge: 45,
      recommendations: [
        {
          title: 'Recommendation 1',
          description: 'Description 1',
          actionType: 'lifestyle',
          impact: 'high',
          priority: 1,
        },
      ],
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('45')).toBeInTheDocument()
      expect(screen.getByText('Positive 1')).toBeInTheDocument()
      expect(screen.getByText('Priority 1')).toBeInTheDocument()
      expect(screen.getByText('Recommendation 1')).toBeInTheDocument()
    })
  })

  /**
   * Test: Handles analysis errors
   */
  it('displays error message when analysis fails', async () => {
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
   * Test: Reset button works
   */
  it('resets to initial state when reset button is clicked', async () => {
    const mockResults = {
      biomarkers: [],
      healthSummary: { positives: [], priorities: [] },
      biologicalAge: 45,
      recommendations: [],
    }

    analyzeBloodTest.mockResolvedValue(mockResults)

    const user = userEvent.setup()
    render(<App />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText('File input')

    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('Analyze Another Test')).toBeInTheDocument()
    })

    const resetButton = screen.getByText('Analyze Another Test')
    await user.click(resetButton)

    expect(screen.getByText('Upload Blood Test Results')).toBeInTheDocument()
  })
})
