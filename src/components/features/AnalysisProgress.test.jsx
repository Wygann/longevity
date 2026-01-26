/**
 * AnalysisProgress Component Tests
 * 
 * Comprehensive tests for the AnalysisProgress component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnalysisProgress from './AnalysisProgress'

describe('AnalysisProgress', () => {
  /**
   * Test: Renders default message
   */
  it('renders default message', () => {
    render(<AnalysisProgress />)

    expect(screen.getByText('Analyzing your blood test results...')).toBeInTheDocument()
    expect(screen.getByText(/This usually takes less than 60 seconds/i)).toBeInTheDocument()
  })

  /**
   * Test: Renders custom message
   */
  it('renders custom message when provided', () => {
    const customMessage = 'Processing your files...'
    render(<AnalysisProgress message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
    expect(screen.queryByText('Analyzing your blood test results...')).not.toBeInTheDocument()
  })

  /**
   * Test: Displays time estimate
   */
  it('displays time estimate', () => {
    render(<AnalysisProgress />)

    expect(screen.getByText(/This usually takes less than 60 seconds/i)).toBeInTheDocument()
  })

  /**
   * Test: Displays progress steps
   */
  it('displays progress steps', () => {
    render(<AnalysisProgress />)

    expect(screen.getByText('Extracting biomarker data...')).toBeInTheDocument()
    expect(screen.getByText('Analyzing health patterns...')).toBeInTheDocument()
    expect(screen.getByText('Generating recommendations...')).toBeInTheDocument()
  })

  /**
   * Test: Has spinner element
   */
  it('has spinner element', () => {
    const { container } = render(<AnalysisProgress />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  /**
   * Test: Is centered
   */
  it('is centered on the page', () => {
    const { container } = render(<AnalysisProgress />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})
