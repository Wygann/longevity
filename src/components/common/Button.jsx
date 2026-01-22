/**
 * Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * Designed for accessibility and consistent styling across the application.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant ('primary' | 'secondary' | 'outline' | 'ghost')
 * @param {string} props.size - Button size ('sm' | 'md' | 'lg')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onClick - Click event handler
 * @param {string} props.type - Button type ('button' | 'submit' | 'reset')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessible label for the button
 * @returns {JSX.Element} Button component
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...props
}) {
  /**
   * Base button classes
   * Mobile-first: Base styles work on mobile, enhanced for larger screens
   */
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-200
    focus-visible-ring
    disabled:opacity-50 disabled:cursor-not-allowed
    gpu-accelerated
  `.trim().replace(/\s+/g, ' ')

  /**
   * Variant-specific classes
   * Each variant has distinct styling for better UX
   */
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700',
    outline:
      'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  }

  /**
   * Size-specific classes
   * Mobile-first: Smaller on mobile, larger on desktop
   */
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base sm:px-6 sm:py-2.5',
    lg: 'px-6 py-3 text-lg sm:px-8 sm:py-4',
  }

  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
