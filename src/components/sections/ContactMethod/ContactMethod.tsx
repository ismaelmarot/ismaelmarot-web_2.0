import { StyledContactMethodWrapper, StyledContactMethodLink, StyledContactMethodIcon, StyledContactMethodLabel, StyledContactMethodValue } from './ContactMethod.styles';
import { useContactMethod } from './useContactMethod';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import type { ContactMethod as ContactMethodType } from '@/types/contact';

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

  return (
    // No role here on purpose: the list item wrapper lives in the parent section, and
    // declaring it here nested a listitem inside a listitem, which breaks role="list".
    <StyledContactMethodWrapper ref={methodRef} $index={index}>
      <StyledContactMethodLink
        as="a"
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={method.label}
      >
        <StyledContactMethodIcon aria-hidden="true">
          <Icon name={iconName} size={24} />
        </StyledContactMethodIcon>
        <StyledContactMethodLabel>{method.label}</StyledContactMethodLabel>
        <StyledContactMethodValue>{isEmail ? method.value : method.value.replace(/^https?:\/\//, '')}</StyledContactMethodValue>
      </StyledContactMethodLink>
    </StyledContactMethodWrapper>
  );
};