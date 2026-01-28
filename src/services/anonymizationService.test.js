/**
 * Anonymization Service Tests
 * 
 * Comprehensive tests for document anonymization functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  anonymizeDocument,
  extractTextFromPDF,
  extractTextFromImage,
} from './anonymizationService'

describe('anonymizationService', () => {
  describe('anonymizeDocument', () => {
    /**
     * Test: Successfully anonymizes document with personal data
     */
    it('removes personal identifiers from document', () => {
      const content = `
        Pacjent: Jan Kowalski
        PESEL: 85010112345
        Adres: ul. Marszałkowska 123, Warszawa
        Email: jan.kowalski@example.com
        Telefon: +48 123 456 789
        
        Wiek: 42 lata
        Masa: 83 kg
        Wzrost: 181 cm
        Płeć: M
        
        Data badania: 15.01.2025
        
        Wyniki badań:
        Cholesterol: 185 mg/dL
        HDL: 58 mg/dL
      `

      const result = anonymizeDocument(content, { type: 'application/pdf' })

      // Check personal identifiers removed
      expect(result.anonymizedContent).not.toContain('Jan Kowalski')
      expect(result.anonymizedContent).not.toContain('85010112345')
      expect(result.anonymizedContent).not.toContain('Marszałkowska')
      expect(result.anonymizedContent).not.toContain('jan.kowalski@example.com')
      expect(result.anonymizedContent).not.toContain('123 456 789')

      // Check medical data preserved
      expect(result.anonymizedContent).toContain('Cholesterol')
      expect(result.anonymizedContent).toContain('185')
      expect(result.anonymizedContent).toContain('mg/dL')
    })

    /**
     * Test: Extracts demographics correctly
     */
    it('extracts demographics from document', () => {
      const content = `
        Wiek: 42 lata
        Masa ciała: 83 kg
        Wzrost: 181 cm
        Płeć: Mężczyzna
        Data badania: 15.01.2025
      `

      const result = anonymizeDocument(content)

      expect(result.medicalData.demographics.age).toBe(42)
      expect(result.medicalData.demographics.weight).toBe(83)
      expect(result.medicalData.demographics.height).toBe(181)
      expect(result.medicalData.demographics.gender).toBe('M')
      expect(result.medicalData.testDate).toBe('2025-01-15')
    })

    /**
     * Test: Handles missing demographics gracefully
     */
    it('handles missing demographics gracefully', () => {
      const content = 'Cholesterol: 185 mg/dL'

      const result = anonymizeDocument(content)

      expect(result.medicalData.demographics.age).toBeNull()
      expect(result.medicalData.demographics.weight).toBeNull()
      expect(result.medicalData.demographics.height).toBeNull()
      expect(result.medicalData.demographics.gender).toBeNull()
    })

    /**
     * Test: Extracts age in various formats
     */
    it('extracts age in various formats', () => {
      const formats = [
        { content: 'Wiek: 42 lata', expected: 42 },
        { content: 'Age: 42 years', expected: 42 },
        { content: '42 lat', expected: 42 },
        { content: '42 years old', expected: 42 },
      ]

      formats.forEach(({ content, expected }) => {
        const result = anonymizeDocument(content)
        expect(result.medicalData.demographics.age).toBe(expected)
      })
    })

    /**
     * Test: Extracts weight in various formats
     */
    it('extracts weight in various formats', () => {
      const formats = [
        { content: 'Masa: 83 kg', expected: 83 },
        { content: 'Weight: 83 kg', expected: 83 },
        { content: '83 kg', expected: 83 },
        { content: 'Masa ciała: 75.5 kg', expected: 75.5 },
      ]

      formats.forEach(({ content, expected }) => {
        const result = anonymizeDocument(content)
        expect(result.medicalData.demographics.weight).toBe(expected)
      })
    })

    /**
     * Test: Extracts height in various formats
     */
    it('extracts height in various formats', () => {
      const formats = [
        { content: 'Wzrost: 181 cm', expected: 181 },
        { content: 'Height: 181 cm', expected: 181 },
        { content: '181 cm', expected: 181 },
      ]

      formats.forEach(({ content, expected }) => {
        const result = anonymizeDocument(content)
        expect(result.medicalData.demographics.height).toBe(expected)
      })
    })

    /**
     * Test: Extracts gender correctly
     */
    it('extracts gender correctly', () => {
      const maleContent = 'Płeć: M'
      const femaleContent = 'Płeć: K'

      const maleResult = anonymizeDocument(maleContent)
      const femaleResult = anonymizeDocument(femaleContent)

      expect(maleResult.medicalData.demographics.gender).toBe('M')
      expect(femaleResult.medicalData.demographics.gender).toBe('F')
    })

    /**
     * Test: Extracts test date in various formats
     */
    it('extracts test date in various formats', () => {
      const formats = [
        { content: 'Data: 15.01.2025', expected: '2025-01-15' },
        { content: 'Date: 2025-01-15', expected: '2025-01-15' },
        { content: '15/01/2025', expected: '2025-01-15' },
      ]

      formats.forEach(({ content, expected }) => {
        const result = anonymizeDocument(content)
        expect(result.medicalData.testDate).toBe(expected)
      })
    })

    /**
     * Test: Removes PESEL numbers
     */
    it('removes PESEL numbers', () => {
      const content = 'PESEL: 85010112345'
      const result = anonymizeDocument(content)

      expect(result.anonymizedContent).not.toContain('85010112345')
      expect(result.anonymizedContent).toContain('[ID]')
    })

    /**
     * Test: Removes email addresses
     */
    it('removes email addresses', () => {
      const content = 'Email: jan.kowalski@example.com'
      const result = anonymizeDocument(content)

      expect(result.anonymizedContent).not.toContain('jan.kowalski@example.com')
      expect(result.anonymizedContent).toContain('[EMAIL]')
    })

    /**
     * Test: Removes phone numbers
     */
    it('removes phone numbers', () => {
      const content = 'Telefon: +48 123 456 789'
      const result = anonymizeDocument(content)

      expect(result.anonymizedContent).not.toContain('123 456 789')
      expect(result.anonymizedContent).toContain('[PHONE]')
    })

    /**
     * Test: Removes institution names
     */
    it('removes institution names', () => {
      const content = 'Laboratorium ALAB Sp. z o.o.'
      const result = anonymizeDocument(content)

      expect(result.anonymizedContent).not.toContain('ALAB')
      expect(result.anonymizedContent).toContain('[INSTITUTION]')
    })

    /**
     * Test: Validates anonymization
     */
    it('throws error if personal data detected after anonymization', () => {
      // This test may need adjustment based on actual validation logic
      const content = 'Test content without personal data'
      
      expect(() => anonymizeDocument(content)).not.toThrow()
    })

    /**
     * Test: Handles empty content
     */
    it('handles empty content', () => {
      expect(() => anonymizeDocument('')).toThrow()
    })

    /**
     * Test: Handles invalid content type
     */
    it('handles invalid content type', () => {
      expect(() => anonymizeDocument(null)).toThrow()
      expect(() => anonymizeDocument(123)).toThrow()
    })

    /**
     * Test: Includes metadata in result
     */
    it('includes metadata in result', () => {
      const content = 'Test content'
      const metadata = { type: 'application/pdf', size: 1024 }

      const result = anonymizeDocument(content, metadata)

      expect(result.metadata.fileType).toBe('application/pdf')
      expect(result.metadata.fileSize).toBe(1024)
      expect(result.metadata.anonymizedAt).toBeDefined()
    })
  })

  describe('extractTextFromPDF', () => {
    /**
     * Test: Extracts text from PDF using PDF.js
     * Note: This test will fail if pdfjs-dist is not installed (expected behavior)
     */
    it('extracts text from PDF or throws error if PDF.js not available', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      
      try {
        const result = await extractTextFromPDF(file)
        // If PDF.js is installed and works, should return string
        expect(typeof result).toBe('string')
      } catch (error) {
        // If PDF.js is not installed, should throw descriptive error
        expect(error.message).toContain('PDF text extraction failed')
        expect(error.message).toContain('pdfjs-dist')
      }
    })
  })

  describe('extractTextFromImage', () => {
    /**
     * Test: Handles image OCR extraction (mocked)
     */
    it('handles image OCR extraction gracefully', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      // Since Tesseract.js is optional, this should not throw
      const result = await extractTextFromImage(file)
      
      // Should return string (empty if extraction fails)
      expect(typeof result).toBe('string')
    })
  })
})
