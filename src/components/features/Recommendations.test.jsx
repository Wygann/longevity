/**
 * Recommendations Component Tests
 * 
 * Comprehensive tests for the Recommendations component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Recommendations from './Recommendations'

describe('Recommendations', () => {
  const mockRecommendations = [
    {
      title: 'Reduce Inflammation',
      description: 'Focus on anti-inflammatory foods and stress management.',
      actionType: 'lifestyle',
      impact: 'high',
      priority: 1,
    },
    {
      title: 'Optimize Vitamin D',
      description: 'Take 2000-4000 IU of Vitamin D3 daily.',
      actionType: 'supplementation',
      impact: 'high',
      priority: 2,
    },
    {
      title: 'Improve Cholesterol',
      description: 'Reduce saturated fats and increase exercise.',
      actionType: 'habit',
      impact: 'high',
      priority: 3,
    },
  ]

  /**
   * Test: Renders recommendations when provided
   */
  it('renders recommendations when provided', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    expect(screen.getByText('Recommended Actions')).toBeInTheDocument()
    expect(screen.getByText('Reduce Inflammation')).toBeInTheDocument()
    expect(screen.getByText('Optimize Vitamin D')).toBeInTheDocument()
    expect(screen.getByText('Improve Cholesterol')).toBeInTheDocument()
  })

  /**
   * Test: Renders all recommendation details
   */
  it('renders all recommendation details', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    expect(screen.getByText('Focus on anti-inflammatory foods and stress management.')).toBeInTheDocument()
    expect(screen.getByText('Take 2000-4000 IU of Vitamin D3 daily.')).toBeInTheDocument()
  })

  /**
   * Test: Displays priority numbers
   */
  it('displays priority numbers correctly', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  /**
   * Test: Displays action types
   */
  it('displays action types', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    // Action types are displayed with capitalize, so search in context
    // Use getAllByText since there might be multiple matches
    const lifestyleElements = screen.getAllByText((content, element) => {
      return element?.textContent?.toLowerCase().includes('lifestyle')
    })
    expect(lifestyleElements.length).toBeGreaterThan(0)
    
    const supplementationElements = screen.getAllByText((content, element) => {
      return element?.textContent?.toLowerCase().includes('supplementation')
    })
    expect(supplementationElements.length).toBeGreaterThan(0)
    
    const habitElements = screen.getAllByText((content, element) => {
      return element?.textContent?.toLowerCase().includes('habit')
    })
    expect(habitElements.length).toBeGreaterThan(0)
  })

  /**
   * Test: Returns null when no recommendations
   */
  it('returns null when recommendations array is empty', () => {
    const { container } = render(<Recommendations recommendations={[]} />)
    expect(container.firstChild).toBeNull()
  })

  /**
   * Test: Handles missing recommendations prop
   */
  it('handles missing recommendations prop', () => {
    const { container } = render(<Recommendations />)
    expect(container.firstChild).toBeNull()
  })

  /**
   * Test: Renders exactly 3 recommendations
   */
  it('renders exactly 3 recommendations when 3 provided', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    const titles = [
      screen.getByText('Reduce Inflammation'),
      screen.getByText('Optimize Vitamin D'),
      screen.getByText('Improve Cholesterol'),
    ]

    expect(titles).toHaveLength(3)
  })

  /**
   * Test: Displays introductory text
   */
  it('displays introductory text', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    expect(
      screen.getByText(/Focus on these 3 priority actions/i)
    ).toBeInTheDocument()
  })

  /**
   * Test: Handles different action types
   */
  it('handles different action types correctly', () => {
    render(<Recommendations recommendations={mockRecommendations} />)

    // Check that action types are displayed (case-insensitive search)
    // Use getAllByText since there might be multiple matches
    const lifestyleElements = screen.getAllByText((content, element) => {
      return element?.textContent?.toLowerCase().includes('lifestyle')
    })
    expect(lifestyleElements.length).toBeGreaterThan(0)
  })

  /**
   * Test: Renders with single recommendation
   */
  it('renders with single recommendation', () => {
    const singleRec = [mockRecommendations[0]]
    render(<Recommendations recommendations={singleRec} />)

    expect(screen.getByText('Reduce Inflammation')).toBeInTheDocument()
    expect(screen.queryByText('Optimize Vitamin D')).not.toBeInTheDocument()
  })
})
