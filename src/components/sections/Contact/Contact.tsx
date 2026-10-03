import { StyledContact, StyledContactHeader, StyledContactHeadline, StyledContactIntro, StyledContactMethods, StyledContactMethod } from './Contact.styles';
import { useContact } from './useContact';
import { ContactMethod } from '@/components/sections/ContactMethod';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import type { ContactMethod as ContactMethodType } from '@/types/contact';

export interface ContactProps {
  methods?: ContactMethodType[];
  introText?: string;
}

export const Contact = ({
  methods = [],
  introText,
}: ContactProps) => {
  const { methodsRef } = useContact();

  return (
    <Section
      id="contact"
      ariaLabel="Contact"
      size="xl"
      background="default"
      fullViewport={true}
      composition="centered"
      verticalAlign="center"
    >
      <Container size="lg" padding="lg">
        <StyledContact ref={methodsRef}>
          <StyledContactHeader>
            <StyledContactHeadline as="h2">Contacto</StyledContactHeadline>
            {introText && <StyledContactIntro as="p">{introText}</StyledContactIntro>}
          </StyledContactHeader>

          <StyledContactMethods role="list" aria-label="Contact methods">
            {methods.map((method, index) => (
              <StyledContactMethod key={method.id} role="listitem">
                <ContactMethod method={method} index={index} />
              </StyledContactMethod>
            ))}
          </StyledContactMethods>
        </StyledContact>
      </Container>
    </Section>
  );
};