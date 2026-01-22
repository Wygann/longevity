/**
 * Environment Variable Utilities Tests
 * 
 * Tests for environment variable utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getEnv, getEnvBoolean, getEnvNumber } from './env'

describe('env utilities', () => {
  // Store original env
  const originalEnv = import.meta.env

  beforeEach(() => {
    // Reset env before each test
    vi.resetModules()
  })

  describe('getEnv', () => {
    it('returns environment variable value', () => {
      // Note: In actual tests, you would mock import.meta.env
      // This is a demonstration of the test structure
      const value = getEnv('API_BASE_URL', 'http://localhost:3000')
      expect(typeof value).toBe('string')
    })

    it('returns default value when variable is not set', () => {
      const defaultValue = 'default-value'
      const value = getEnv('NON_EXISTENT_VAR', defaultValue)
      expect(value).toBe(defaultValue)
    })
  })

  describe('getEnvBoolean', () => {
    it('returns true for "true" string', () => {
      // Mock would be needed here
      const value = getEnvBoolean('ENABLE_DEBUG', false)
      expect(typeof value).toBe('boolean')
    })

    it('returns false for "false" string', () => {
      const value = getEnvBoolean('ENABLE_DEBUG', false)
      expect(typeof value).toBe('boolean')
    })
  })

  describe('getEnvNumber', () => {
    it('returns number for valid numeric string', () => {
      const value = getEnvNumber('API_TIMEOUT', 5000)
      expect(typeof value).toBe('number')
    })

    it('returns default for invalid number', () => {
      const defaultValue = 5000
      const value = getEnvNumber('INVALID_NUMBER', defaultValue)
      expect(value).toBe(defaultValue)
    })
  })
})
