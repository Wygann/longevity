/**
 * FileUpload Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileUpload from './FileUpload'

describe('FileUpload', () => {
  it('renders upload interface', () => {
    render(<FileUpload />)
    expect(screen.getByText('Upload Blood Test Results')).toBeInTheDocument()
  })

  it('calls onFileSelect when valid file is selected', () => {
    const handleFileSelect = vi.fn()
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

    render(<FileUpload onFileSelect={handleFileSelect} />)

    const input = screen.getByLabelText('File input')
    fireEvent.change(input, { target: { files: [file] } })

    expect(handleFileSelect).toHaveBeenCalledWith(file, expect.arrayContaining([file]))
  })

  it('shows error for file too large', async () => {
    const handleFileSelect = vi.fn()
    // Create a file larger than 10MB (use smaller size for faster test execution)
    // Just over 10MB: 10MB + 1 byte
    const largeFile = new File(['x'.repeat(10 * 1024 * 1024 + 1)], 'large.pdf', {
      type: 'application/pdf',
    })

    render(<FileUpload onFileSelect={handleFileSelect} />)

    const input = screen.getByLabelText('File input')
    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(handleFileSelect).not.toHaveBeenCalled()
    
    // Wait for error message to appear (React state update)
    await waitFor(() => {
      expect(screen.getByText(/File size must be less than 10MB/i)).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 15000) // Increase test timeout to 15 seconds for large file creation

  it('shows error for invalid file type', () => {
    const handleFileSelect = vi.fn()
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })

    render(<FileUpload onFileSelect={handleFileSelect} />)

    const input = screen.getByLabelText('File input')
    fireEvent.change(input, { target: { files: [invalidFile] } })

    expect(handleFileSelect).not.toHaveBeenCalled()
    expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<FileUpload disabled />)
    const input = screen.getByLabelText('File input')
    expect(input).toBeDisabled()
  })
})
