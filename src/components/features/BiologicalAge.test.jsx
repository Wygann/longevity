/**
 * BiologicalAge Component Tests
 * 
 * Comprehensive tests for the BiologicalAge component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BiologicalAge from './BiologicalAge'

describe('BiologicalAge', () => {
  /**
   * Test: Renders biological age
   */
  it('renders biological age prominently', () => {
    render(<BiologicalAge biologicalAge={45} />)

    expect(screen.getByText('Your Biological Age')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('years')).toBeInTheDocument()
  })

  /**
   * Test: Displays comparison when chronological age provided
   */
  it('displays comparison when chronological age is provided', () => {
    render(<BiologicalAge biologicalAge={45} chronologicalAge={50} />)

    expect(screen.getByText(/Chronological Age:/)).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  /**
   * Test: Shows "younger" message when biological age is lower
   */
  it('shows younger message when biological age is lower than chronological', () => {
    render(<BiologicalAge biologicalAge={40} chronologicalAge={50} />)

    expect(screen.getByText(/years younger than your age/i)).toBeInTheDocument()
    expect(screen.getByText(/10 years younger/i)).toBeInTheDocument()
  })

  /**
   * Test: Shows "older" message when biological age is higher
   */
  it('shows older message when biological age is higher than chronological', () => {
    render(<BiologicalAge biologicalAge={55} chronologicalAge={50} />)

    expect(screen.getByText(/years older than your age/i)).toBeInTheDocument()
    expect(screen.getByText(/5 years older/i)).toBeInTheDocument()
  })

  /**
   * Test: Shows "matches" message when ages are equal
   */
  it('shows matches message when biological age equals chronological age', () => {
    render(<BiologicalAge biologicalAge={50} chronologicalAge={50} />)

    expect(screen.getByText(/Matches your chronological age/i)).toBeInTheDocument()
  })

  /**
   * Test: Does not show comparison when chronological age not provided
   */
  it('does not show comparison when chronological age is not provided', () => {
    render(<BiologicalAge biologicalAge={45} />)

    expect(screen.queryByText(/Chronological Age:/)).not.toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })

  /**
   * Test: Handles null chronological age
   */
  it('handles null chronological age', () => {
    render(<BiologicalAge biologicalAge={45} chronologicalAge={null} />)

    expect(screen.queryByText(/Chronological Age:/)).not.toBeInTheDocument()
  })

  /**
   * Test: Displays explanation text
   */
  it('displays explanation text about biological age', () => {
    render(<BiologicalAge biologicalAge={45} />)

    expect(
      screen.getByText(/Biological age reflects how your body is aging/i)
    ).toBeInTheDocument()
  })

  /**
   * Test: Handles different age values
   */
  it('handles different biological age values correctly', () => {
    const { rerender } = render(<BiologicalAge biologicalAge={30} />)
    expect(screen.getByText('30')).toBeInTheDocument()

    rerender(<BiologicalAge biologicalAge={80} />)
    expect(screen.getByText('80')).toBeInTheDocument()
  })
})
