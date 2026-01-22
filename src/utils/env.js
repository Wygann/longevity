/**
 * Environment Variable Utilities
 * 
 * This module provides utilities for accessing and validating
 * environment variables in a type-safe manner.
 * 
 * All environment variables should be accessed through this module
 * to ensure consistent handling and validation.
 */

/**
 * Gets an environment variable with optional default value
 * 
 * @param {string} key - The environment variable key (without VITE_ prefix)
 * @param {string} defaultValue - Default value if variable is not set
 * @returns {string} The environment variable value or default
 * @example
 * const apiUrl = getEnv('API_BASE_URL', 'http://localhost:3000')
 */
export function getEnv(key, defaultValue = '') {
  const fullKey = `VITE_${key}`
  const value = import.meta.env[fullKey]
  
  if (value === undefined || value === '') {
    if (defaultValue) {
      console.warn(
        `Environment variable ${fullKey} is not set, using default: ${defaultValue}`
      )
      return defaultValue
    }
    console.warn(`Environment variable ${fullKey} is not set`)
    return ''
  }
  
  return value
}

/**
 * Gets a boolean environment variable
 * 
 * @param {string} key - The environment variable key (without VITE_ prefix)
 * @param {boolean} defaultValue - Default value if variable is not set
 * @returns {boolean} The boolean value
 * @example
 * const isDebug = getEnvBoolean('ENABLE_DEBUG_MODE', false)
 */
export function getEnvBoolean(key, defaultValue = false) {
  const value = getEnv(key, String(defaultValue))
  return value === 'true' || value === '1'
}

/**
 * Gets a number environment variable
 * 
 * @param {string} key - The environment variable key (without VITE_ prefix)
 * @param {number} defaultValue - Default value if variable is not set
 * @returns {number} The number value
 * @example
 * const timeout = getEnvNumber('API_TIMEOUT', 5000)
 */
export function getEnvNumber(key, defaultValue = 0) {
  const value = getEnv(key, String(defaultValue))
  const numValue = Number(value)
  
  if (isNaN(numValue)) {
    console.warn(
      `Environment variable VITE_${key} is not a valid number, using default: ${defaultValue}`
    )
    return defaultValue
  }
  
  return numValue
}

// Export commonly used environment variables as constants
export const API_BASE_URL = getEnv('API_BASE_URL', 'http://localhost:3000/api')
export const API_TIMEOUT = getEnvNumber('API_TIMEOUT', 5000)
export const ENABLE_DEBUG_MODE = getEnvBoolean('ENABLE_DEBUG_MODE', false)
export const ENABLE_ANALYTICS = getEnvBoolean('ENABLE_ANALYTICS', false)
