import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { StyledIcon } from './Icon.styles';
import { getIcon, type IconName } from './useIcon';
import type { IconSize } from './Icon.styles';

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: IconName;
  size?: IconSize;
  'aria-label'?: string;
  decorative?: boolean;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = 'md',
      'aria-label': ariaLabel,
      decorative = true,
      className,
      ...props
    },
    ref
  ) => {
    const IconComponent = getIcon(name);

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    return (
      <StyledIcon
        ref={ref}
        $size={size}
        className={className}
        aria-hidden={decorative}
        aria-label={decorative ? undefined : ariaLabel}
        {...props}
      >
        {IconComponent}
      </StyledIcon>
    );
  }
);

Icon.displayName = 'Icon';