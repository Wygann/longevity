/**
 * HealthSummary Component Tests
 * 
 * Comprehensive tests for the HealthSummary component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HealthSummary from './HealthSummary'

describe('HealthSummary', () => {
  /**
   * Test: Renders positive aspects
   */
  it('renders positive aspects when provided', () => {
    const positives = [
      'Excellent blood sugar control',
      'Good HDL cholesterol levels',
      'Healthy testosterone levels',
    ]

    render(<HealthSummary positives={positives} />)

    expect(screen.getByText('Top Positive Aspects')).toBeInTheDocument()
    expect(screen.getByText('Excellent blood sugar control')).toBeInTheDocument()
    expect(screen.getByText('Good HDL cholesterol levels')).toBeInTheDocument()
    expect(screen.getByText('Healthy testosterone levels')).toBeInTheDocument()
  })

  /**
   * Test: Renders priorities
   */
  it('renders priorities when provided', () => {
    const priorities = [
      'Elevated inflammation markers',
      'Vitamin D deficiency',
      'LDL cholesterol above optimal',
    ]

    render(<HealthSummary priorities={priorities} />)

    expect(screen.getByText('Top Priorities to Address')).toBeInTheDocument()
    expect(screen.getByText('Elevated inflammation markers')).toBeInTheDocument()
    expect(screen.getByText('Vitamin D deficiency')).toBeInTheDocument()
    expect(screen.getByText('LDL cholesterol above optimal')).toBeInTheDocument()
  })

  /**
   * Test: Renders both positives and priorities
   */
  it('renders both positives and priorities when provided', () => {
    const positives = ['Positive 1', 'Positive 2', 'Positive 3']
    const priorities = ['Priority 1', 'Priority 2', 'Priority 3']

    render(<HealthSummary positives={positives} priorities={priorities} />)

    expect(screen.getByText('Top Positive Aspects')).toBeInTheDocument()
    expect(screen.getByText('Top Priorities to Address')).toBeInTheDocument()
    expect(screen.getByText('Positive 1')).toBeInTheDocument()
    expect(screen.getByText('Priority 1')).toBeInTheDocument()
  })

  /**
   * Test: Does not render positives section when empty
   */
  it('does not render positives section when empty array', () => {
    render(<HealthSummary positives={[]} priorities={['Priority 1']} />)

    expect(screen.queryByText('Top Positive Aspects')).not.toBeInTheDocument()
    expect(screen.getByText('Top Priorities to Address')).toBeInTheDocument()
  })

  /**
   * Test: Does not render priorities section when empty
   */
  it('does not render priorities section when empty array', () => {
    render(<HealthSummary positives={['Positive 1']} priorities={[]} />)

    expect(screen.getByText('Top Positive Aspects')).toBeInTheDocument()
    expect(screen.queryByText('Top Priorities to Address')).not.toBeInTheDocument()
  })

  /**
   * Test: Handles missing props gracefully
   */
  it('handles missing props gracefully', () => {
    render(<HealthSummary />)

    expect(screen.queryByText('Top Positive Aspects')).not.toBeInTheDocument()
    expect(screen.queryByText('Top Priorities to Address')).not.toBeInTheDocument()
  })

  /**
   * Test: Displays correct number of items
   */
  it('displays exactly 3 positives when 3 provided', () => {
    const positives = ['Positive 1', 'Positive 2', 'Positive 3']

    render(<HealthSummary positives={positives} />)

    const positiveItems = screen.getAllByText(/Positive \d/)
    expect(positiveItems).toHaveLength(3)
  })

  /**
   * Test: Displays correct number of priorities
   */
  it('displays exactly 3 priorities when 3 provided', () => {
    const priorities = ['Priority 1', 'Priority 2', 'Priority 3']

    render(<HealthSummary priorities={priorities} />)

    const priorityItems = screen.getAllByText(/Priority \d/)
    expect(priorityItems).toHaveLength(3)
  })

  /**
   * Test: Priorities are numbered correctly
   */
  it('numbers priorities correctly (1, 2, 3)', () => {
    const priorities = ['First priority', 'Second priority', 'Third priority']

    render(<HealthSummary priorities={priorities} />)

    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
    expect(screen.getByText('3.')).toBeInTheDocument()
  })
})
