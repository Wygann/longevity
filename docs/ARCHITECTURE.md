# Architecture Guide

This document describes the architecture and design decisions for the Longevity project.

## Overview

The project follows a modular, component-based architecture designed for:
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to extend with new features
- **Readability**: Junior developers can easily understand and contribute
- **Testability**: All components and utilities are testable

## Technology Stack

- **React 18**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Testing utilities for React components
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting

## Folder Structure

### `/src/components`

React components organized by purpose:

- **`common/`**: Reusable UI components (Button, Input, Card, etc.)
- **`layout/`**: Layout components (Header, Footer, Sidebar, etc.)
- **`features/`**: Feature-specific components grouped by domain

**Guidelines:**
- Each component should be in its own file
- Components should be self-contained and reusable
- Include JSDoc comments for all components
- Create corresponding test files (`.test.jsx`)

### `/src/hooks`

Custom React hooks for reusable stateful logic.

**Guidelines:**
- Hooks must start with "use" prefix
- Hooks should be pure and testable
- Include JSDoc comments explaining usage
- Create corresponding test files

### `/src/services`

API services and external integrations.

**Guidelines:**
- One service file per API domain
- Use environment variables for endpoints
- Implement consistent error handling
- Return promises for async operations

### `/src/utils`

Pure utility functions and helpers.

**Guidelines:**
- Functions should be pure (no side effects)
- Well-documented with JSDoc
- Comprehensive test coverage
- Single responsibility principle

## Component Architecture

### Component Structure

```jsx
/**
 * Component Name
 * 
 * Brief description of what this component does.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.example - Example prop description
 * @returns {JSX.Element} Component JSX
 */
function ComponentName({ example }) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // 4. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

### Props and State

- Use functional components with hooks
- Prefer props over state when possible
- Keep state as local as possible
- Lift state up only when necessary

## Styling Architecture

### Tailwind CSS Approach

- Use utility classes for styling
- Mobile-first responsive design
- Custom utilities in `src/index.css` using `@layer utilities`
- Component-specific styles in component CSS files only when necessary

### Responsive Design

```jsx
// Mobile-first: base styles are for mobile
<div className="text-sm md:text-base lg:text-lg">
  {/* Styles apply from mobile up */}
</div>
```

## State Management

For simple applications, React's built-in state management is sufficient:
- `useState` for local component state
- `useContext` for shared state
- Custom hooks for complex state logic

For larger applications, consider:
- Zustand for global state
- React Query for server state

## Performance Optimizations

1. **Code Splitting**: Automatic with Vite's dynamic imports
2. **Lazy Loading**: Use `React.lazy()` for route-based code splitting
3. **Memoization**: Use `React.memo()` and `useMemo()` when appropriate
4. **Image Optimization**: Optimize images and use modern formats (WebP)
5. **Bundle Size**: Monitor bundle size and split vendor chunks

## Testing Strategy

### Unit Tests
- Test utility functions in isolation
- Test custom hooks with `@testing-library/react-hooks`
- Aim for high coverage of business logic

### Component Tests
- Test user interactions, not implementation details
- Use React Testing Library's queries
- Test accessibility where applicable

### Integration Tests
- Test component interactions
- Test API integration with mocks

## Environment Variables

All environment variables must:
- Be prefixed with `VITE_` to be accessible in client code
- Be documented in `env.example`
- Be accessed through `src/utils/env.js` utility functions
- Never contain sensitive secrets (use server-side for secrets)

## Code Quality Standards

### ESLint Rules
- Enforce React best practices
- Prevent common bugs
- Maintain consistent code style

### Prettier
- Automatic code formatting
- Consistent indentation and spacing
- Configured to work with ESLint

### Code Reviews
- All code must be reviewed before merging
- Tests must pass
- Linting must pass
- Documentation must be updated

## Mobile-First Design

All designs start with mobile and scale up:
1. Design for mobile (320px+) first
2. Add breakpoints for tablet (768px+)
3. Enhance for desktop (1024px+)
4. Optimize for large screens (1280px+)

## Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Maintain proper ARIA attributes
- Test with screen readers

## Security

- Never commit `.env` files
- Validate all user input
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper authentication

## Future Considerations

As the project grows, consider:
- TypeScript migration for type safety
- State management library (Zustand, Redux)
- API client library (Axios, React Query)
- Component library documentation (Storybook)
- E2E testing (Playwright, Cypress)
