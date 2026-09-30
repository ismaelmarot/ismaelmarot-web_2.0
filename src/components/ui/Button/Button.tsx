import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import {
  StyledButton,
  StyledContent,
  StyledIconWrapper,
  StyledSpinner,
} from './Button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth: fullWidthProp = false,
      disabled,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidthProp}
        className={className}
        {...props}
      >
        {isLoading && (
          <StyledSpinner aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </StyledSpinner>
        )}
        {!isLoading && leftIcon && <StyledIconWrapper aria-hidden="true">{leftIcon}</StyledIconWrapper>}
        <StyledContent>{children}</StyledContent>
        {!isLoading && rightIcon && <StyledIconWrapper aria-hidden="true">{rightIcon}</StyledIconWrapper>}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';