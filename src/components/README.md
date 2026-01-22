# Components Directory

This directory contains all React components for the application.

## Structure

Components should be organized by feature or domain. Each component should:
- Be self-contained and reusable
- Have clear prop types (use PropTypes or TypeScript)
- Include JSDoc comments explaining its purpose
- Have corresponding test files
- Follow the naming convention: PascalCase

## Example Structure

```
components/
  ├── common/          # Shared/common components (Button, Input, etc.)
  ├── layout/          # Layout components (Header, Footer, Sidebar, etc.)
  ├── features/        # Feature-specific components
  └── README.md        # This file
```

## Component Template

When creating a new component, use this structure:

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
  // Component logic here
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```
