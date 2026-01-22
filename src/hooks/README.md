# Hooks Directory

This directory contains custom React hooks.

## Structure

- **Reusable logic**: Hooks should extract reusable stateful logic
- **Well documented**: All hooks should have JSDoc comments
- **Tested**: All hooks should have comprehensive tests
- **Naming convention**: Start with "use" (e.g., `useLocalStorage`, `useApi`)

## Example Custom Hook

```javascript
/**
 * Custom hook for managing local storage
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function]} Tuple of [value, setValue]
 * @example
 * const [count, setCount] = useLocalStorage('count', 0)
 */
export function useLocalStorage(key, initialValue) {
  // Implementation
}
```
