# Testing Guide

This document outlines testing standards and best practices for the Longevity project.

## Testing Philosophy

- **Test behavior, not implementation**: Focus on what the component does, not how it does it
- **User-centric testing**: Test from the user's perspective
- **Maintainable tests**: Write tests that are easy to read and maintain
- **High coverage**: Aim for comprehensive test coverage, especially for business logic

## Testing Stack

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation

## Running Tests

```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## Test File Organization

- Test files should be co-located with source files
- Naming convention: `ComponentName.test.jsx` or `functionName.test.js`
- Group related tests using `describe` blocks

## Writing Component Tests

### Basic Component Test

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

describe('Counter', () => {
  it('increments when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const button = screen.getByRole('button', { name: /increment/i })
    await user.click(button)
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
```

### Testing Accessibility

```jsx
it('has accessible label', () => {
  render(<Button aria-label="Close dialog">×</Button>)
  expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
})
```

## Testing Hooks

### Custom Hook Test

```jsx
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

## Testing Utilities

### Utility Function Test

```jsx
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('2024-01-15')
  })
  
  it('handles invalid dates', () => {
    expect(() => formatDate('invalid')).toThrow()
  })
})
```

## Testing Best Practices

### 1. Use Semantic Queries

Prefer queries that reflect how users interact with the UI:

```jsx
// ✅ Good: Query by role and accessible name
screen.getByRole('button', { name: /submit/i })

// ❌ Bad: Query by test ID (unless necessary)
screen.getByTestId('submit-button')
```

### 2. Test User Flows

Test complete user interactions:

```jsx
it('allows user to submit form', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/message/i), 'Hello')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument()
})
```

### 3. Test Edge Cases

```jsx
it('handles empty input', () => {
  render(<SearchInput />)
  const input = screen.getByRole('textbox')
  
  expect(input.value).toBe('')
  expect(screen.queryByText(/results/i)).not.toBeInTheDocument()
})
```

### 4. Avoid Testing Implementation Details

```jsx
// ❌ Bad: Testing implementation
expect(component.state.count).toBe(1)

// ✅ Good: Testing behavior
expect(screen.getByText('1')).toBeInTheDocument()
```

### 5. Use Descriptive Test Names

```jsx
// ✅ Good: Clear what is being tested
it('displays error message when API call fails', () => {})

// ❌ Bad: Vague test name
it('works correctly', () => {})
```

## Mocking

### Mocking API Calls

```jsx
import { describe, it, expect, vi } from 'vitest'

describe('UserProfile', () => {
  it('displays user data', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'John Doe' }),
    })
    
    render(<UserProfile userId="1" />)
    
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
  })
})
```

### Mocking Modules

```jsx
import { vi } from 'vitest'

vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ name: 'John' })),
}))
```

## Test Coverage

Aim for:
- **80%+ coverage** overall
- **100% coverage** for critical business logic
- **High coverage** for utility functions
- **Reasonable coverage** for UI components (focus on behavior)

## Common Testing Patterns

### Setup and Teardown

```jsx
describe('Component', () => {
  beforeEach(() => {
    // Setup before each test
  })
  
  afterEach(() => {
    // Cleanup after each test
  })
})
```

### Testing Async Operations

```jsx
it('loads data asynchronously', async () => {
  render(<DataComponent />)
  
  // Wait for async operation
  expect(await screen.findByText('Loaded')).toBeInTheDocument()
})
```

### Testing Error States

```jsx
it('displays error when fetch fails', async () => {
  vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed'))
  
  render(<DataComponent />)
  
  expect(await screen.findByText(/error/i)).toBeInTheDocument()
})
```

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Vitest Docs](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
