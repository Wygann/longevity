/**
 * Button Component Tests
 * 
 * Comprehensive tests for the Button component covering:
 * - Rendering with different variants and sizes
 * - User interactions
 * - Accessibility
 * - Disabled state
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  /**
   * Test: Button renders with children
   */
  it('renders with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  /**
   * Test: Button calls onClick handler when clicked
   */
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByText('Click me')
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  /**
   * Test: Button does not call onClick when disabled
   */
  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    )
    
    const button = screen.getByText('Click me')
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  /**
   * Test: Button renders with correct variant classes
   */
  it('applies primary variant classes', () => {
    const { container } = render(<Button variant="primary">Button</Button>)
    const button = container.firstChild
    
    expect(button.className).toContain('bg-blue-500')
    expect(button.className).toContain('text-white')
  })

  /**
   * Test: Button renders with correct size classes
   */
  it('applies size classes correctly', () => {
    const { container } = render(<Button size="lg">Button</Button>)
    const button = container.firstChild
    
    expect(button.className).toContain('px-6')
    expect(button.className).toContain('py-3')
  })

  /**
   * Test: Button has accessible label when provided
   */
  it('has accessible label when ariaLabel is provided', () => {
    render(<Button ariaLabel="Close dialog">×</Button>)
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
  })

  /**
   * Test: Button has correct type attribute
   */
  it('renders with correct type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>)
    const button = container.firstChild
    
    expect(button.type).toBe('submit')
  })

  /**
   * Test: Button is disabled when disabled prop is true
   */
  it('is disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Button</Button>)
    const button = container.firstChild
    
    expect(button.disabled).toBe(true)
  })
})
