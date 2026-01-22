# Services Directory

This directory contains service modules for API calls and external integrations.

## Structure

- **API calls**: All API interactions should be in service files
- **Error handling**: Services should handle errors consistently
- **Environment variables**: Use environment variables for API endpoints
- **Well documented**: All services should have JSDoc comments

## Example Service

```javascript
/**
 * API Service for user operations
 * 
 * This service handles all API calls related to user management.
 * Uses environment variables for the base URL.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Fetches user data by ID
 * 
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User data
 * @throws {Error} If the API call fails
 */
export async function getUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }
  
  return response.json()
}
```
