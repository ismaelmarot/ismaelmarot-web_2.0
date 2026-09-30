import styled, { css } from 'styled-components';

export const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
} as const;

export type IconSize = keyof typeof iconSizes | number | string;

export const StyledIcon = styled.span<{ $size: IconSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  ${({ $size }) => {
    const sizeValue = typeof $size === 'number' ? `${$size}px` : $size;
    const isNamedSize = typeof $size === 'string' && $size in iconSizes;

    if (isNamedSize) {
      return css`
        width: ${iconSizes[$size as keyof typeof iconSizes]};
        height: ${iconSizes[$size as keyof typeof iconSizes]};
      `;
    }

    return css`
      width: ${sizeValue};
      height: ${sizeValue};
    `;
  }}
`;