# Utils Directory

This directory contains utility functions and helpers.

## Structure

- **Pure functions only**: Utils should be pure functions with no side effects
- **Well documented**: All functions should have JSDoc comments
- **Tested**: All utility functions should have comprehensive tests
- **Single responsibility**: Each utility should do one thing well

## Example Utility Function

```javascript
/**
 * Formats a date string to a readable format
 * 
 * @param {string|Date} date - The date to format
 * @param {string} format - The format string (default: 'YYYY-MM-DD')
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // Returns "2024-01-15"
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  // Implementation
}
```
