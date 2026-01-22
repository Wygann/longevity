/**
 * Test Setup File
 * 
 * This file configures the testing environment before tests run.
 * It sets up necessary mocks, global test utilities, and test helpers.
 */

import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Cleanup after each test to prevent test pollution
afterEach(() => {
  cleanup()
})

// Extend Vitest's expect with jest-dom matchers
// This allows us to use matchers like toBeInTheDocument()
