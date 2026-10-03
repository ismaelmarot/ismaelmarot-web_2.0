import styled, { css } from 'styled-components';
import { tokens } from '@/styles/tokens';

const gapValues = {
  none: '0',
  sm: tokens.space[3],
  md: tokens.space[6],
  lg: tokens.space[8],
  xl: tokens.space[12],
} as const;

// `between` and `around` are not valid CSS keywords; they must be expanded
// to `space-between` / `space-around` or the declaration is dropped entirely.
const justifyContentValues = {
  start: 'start',
  center: 'center',
  end: 'end',
  between: 'space-between',
  around: 'space-around',
} as const;

export const StyledGrid = styled.div<{
  $columns: 1 | 2 | 3 | 4 | { base: number; md: number; lg: number; xl: number };
  $gap: keyof typeof gapValues;
  $alignItems: 'start' | 'center' | 'end' | 'stretch';
  $justifyContent: 'start' | 'center' | 'end' | 'between' | 'around';
}>`
  display: grid;
  width: 100%;
  gap: ${({ $gap }) => gapValues[$gap]};
  align-items: ${({ $alignItems }) => $alignItems};
  justify-content: ${({ $justifyContent }) => justifyContentValues[$justifyContent]};

  ${({ $columns }) => {
    if (typeof $columns === 'number') {
      return css`grid-template-columns: repeat(${$columns}, 1fr);`;
    }
    return css`
      grid-template-columns: repeat(${$columns.base}, 1fr);

      @media (min-width: 768px) {
        grid-template-columns: repeat(${$columns.md}, 1fr);
      }
      @media (min-width: 1024px) {
        grid-template-columns: repeat(${$columns.lg}, 1fr);
      }
      @media (min-width: 1440px) {
        grid-template-columns: repeat(${$columns.xl}, 1fr);
      }
    `;
  }}
`;