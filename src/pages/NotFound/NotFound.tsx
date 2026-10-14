import { Link } from 'react-router-dom';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import {
  StyledNotFound,
  StyledNotFoundTitle,
  StyledNotFoundText,
  StyledNotFoundCta,
} from './NotFound.styles';

export const NotFoundPage = () => {
  return (
    <Section
      id="not-found"
      ariaLabel="Page not found"
      size="xl"
      background="default"
      fullViewport={true}
      composition="centered"
      verticalAlign="center"
    >
      <Container size="lg" padding="lg">
        <StyledNotFound>
          <StyledNotFoundTitle as="h1">404</StyledNotFoundTitle>
          <StyledNotFoundText as="p">
            La página que buscas no existe o fue movida.
          </StyledNotFoundText>
          <StyledNotFoundCta as={Link} to="/">
            Volver al inicio
          </StyledNotFoundCta>
        </StyledNotFound>
      </Container>
    </Section>
  );
};
