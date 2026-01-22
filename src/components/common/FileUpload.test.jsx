/**
 * FileUpload Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

    expect(handleFileSelect).toHaveBeenCalledWith(file)
  })

  it('shows error for file too large', () => {
    const handleFileSelect = vi.fn()
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    })

    render(<FileUpload onFileSelect={handleFileSelect} />)

    const input = screen.getByLabelText('File input')
    fireEvent.change(input, { target: { files: [largeFile] } })

    expect(handleFileSelect).not.toHaveBeenCalled()
    expect(screen.getByText(/File size must be less than 10MB/i)).toBeInTheDocument()
  })

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
