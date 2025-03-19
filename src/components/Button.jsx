import React, { useState } from 'react';
import { useTheme } from "../layouts/ThemePage";

/**
 * Premium Button component with smooth transitions and interactive effects
 * @param {Object} props - Component props
 * @param {string} props.variant - 'primary' or 'secondary'
 * @param {string} props.size - 'sm', 'md', or 'lg'
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @returns {JSX.Element}
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  className = '',
  ...props
}) {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  // Base classes
  const baseClasses = `
    rounded-xl
    font-semibold
    transition-all
    duration-300
    ease-in-out
    flex
    items-center
    justify-center
    shadow-lg
    hover:shadow-xl
    active:scale-95
    transform
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Variant classes
  const variantClasses = {
    primary: baseClasses,
    secondary: baseClasses,
    outline: `border-2 hover:bg-background-secondary ${baseClasses}`,
    text: `hover:bg-background-secondary ${baseClasses}`,
  };

  // Dynamic styles based on variant and state
  const dynamicStyles = () => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: isHovered ? colors.secondary : colors.primary,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: isHovered ? colors.primary : colors.secondary,
          color: '#FFFFFF',
        };
      case 'outline':
        return { 
          borderColor: colors.primary, 
          color: colors.primary,
          background: 'transparent',
        };
      case 'text':
        return { 
          color: colors.primary,
          background: 'transparent',
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  return (
    <button
      className={variantClasses[variant]}
      onClick={onClick}
      style={dynamicStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}