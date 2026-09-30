import { forwardRef } from 'react';
import { StyledSkipLink } from './SkipLink.styles';
import { useSkipLink } from './useSkipLink';

export interface SkipLinkProps {
  targets: string[];
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ targets, ...props }, ref) => {
    const { scrollToSection } = useSkipLink();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      scrollToSection(targetId);
    };

    return (
      <>
        {targets.map((target) => (
          <StyledSkipLink
            key={target}
            ref={target === targets[0] ? ref : undefined}
            href={`#${target}`}
            onClick={(e) => handleClick(e, target)}
            {...(target === targets[0] ? props : {})}
          >
            Skip to {target.charAt(0).toUpperCase() + target.slice(1)}
          </StyledSkipLink>
        ))}
      </>
    );
  }
);

SkipLink.displayName = 'SkipLink';