import {
  StyledContactMethodWrapper,
  StyledContactMethodLink,
  StyledContactMethodIcon,
  StyledContactMethodLabel,
  StyledContactMethodValue,
  StyledContactMethodArrow,
} from './ContactMethod.styles';
import { useContactMethod } from './useContactMethod';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { VisuallyHidden } from '@/components/common/VisuallyHidden';
import { getContactDomain, type ContactMethod as ContactMethodType } from '@/types/contact';

export interface ContactMethodProps {
  method: ContactMethodType;
  index?: number;
}

export const ContactMethod = ({
  method,
  index = 0,
}: ContactMethodProps) => {
  const { methodRef } = useContactMethod();

  const isEmail = method.type === 'email';
  const href = isEmail ? `mailto:${method.value}` : method.value;
  const isExternal = !isEmail;
  const iconName = method.iconName as IconName;

  // The card names the destination, so the accessible name has to carry the full address, not
  // only the label. A name of just "Email" left a screen reader announcing a link whose
  // destination it could not read.
  const accessibleName = `${method.label}: ${method.value}`;

  return (
    // No role here on purpose: the list item wrapper lives in the parent section, and
    // declaring it here nested a listitem inside a listitem, which breaks role="list".
    <StyledContactMethodWrapper ref={methodRef} $index={index}>
      <StyledContactMethodLink
        as="a"
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={accessibleName}
        $type={method.type}
      >
        <StyledContactMethodIcon aria-hidden="true">
          <Icon name={iconName} size={56} />
        </StyledContactMethodIcon>

        <StyledContactMethodArrow aria-hidden="true">
          <Icon name="arrowRight" size={28} />
        </StyledContactMethodArrow>

        <StyledContactMethodLabel>{method.label}</StyledContactMethodLabel>

        {/* Only the domain is shown. The full address stays in the accessible name above, so
            the account and profile path are one keystroke away for anyone who needs them. */}
        <StyledContactMethodValue>{getContactDomain(method.value)}</StyledContactMethodValue>

        <VisuallyHidden>{method.value}</VisuallyHidden>
      </StyledContactMethodLink>
    </StyledContactMethodWrapper>
  );
};
