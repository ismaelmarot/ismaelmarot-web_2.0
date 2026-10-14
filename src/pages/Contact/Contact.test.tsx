import { render, screen } from '@testing-library/react';
import { ContactPage } from './Contact';

/**
 * The contact page's one authored decision is the intro sentence it passes to the Contact section.
 * Everything else on this route comes from `siteConfig`, so the test covers the sentence and the fact
 * that the section's configured methods reach the page.
 */
describe('ContactPage', () => {
  it('renders the contact heading', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument();
  });

  it('renders the intro sentence the page passes', () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/estoy a un mensaje de distancia/i)
    ).toBeInTheDocument();
  });

  it('renders the configured contact methods', () => {
    render(<ContactPage />);

    // At least one method survived configuration, which is what proves siteConfig reached the section
    // rather than the section falling back to its own empty default.
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('renders no form, because the contact form was withdrawn', () => {
    render(<ContactPage />);

    // specs/007 was implemented and then withdrawn: no free relay delivers from a *.github.io origin,
    // and a form that always fails is worse than direct methods. This asserts the withdrawal holds, so
    // that nobody reintroduces the form without reading that specification first.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /enviar|send/i })).not.toBeInTheDocument();
  });
});