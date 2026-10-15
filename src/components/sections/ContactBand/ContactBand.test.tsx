import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactBand } from './ContactBand';
import { siteConfig } from '@/data/site-config';
import { getCssForElement } from '@/test-utils/css';
import type { ContactMethod } from '@/types/contact';

const red = (over: Partial<ContactMethod> = {}): ContactMethod => ({
  id: 'github',
  type: 'github',
  label: 'GitHub',
  value: 'https://github.com/ismaelmarot',
  iconName: 'github',
  displayOrder: 1,
  ...over,
});

/**
 * One test per user story in specs/020, and one per deferral the specification records.
 *
 * The band's subject is a link, so most of what matters is what that link is and what it says. The
 * three things this file exists to hold are the ones a redesign can silently lose: that the address is
 * a `mailto:` with no `target`, that the band keeps the id and the accessible name two other files
 * assert, and that the network row is a list rather than a div with a role.
 */
describe('ContactBand', () => {
  const renderBand = (props = {}) =>
    render(
      <MemoryRouter>
        <ContactBand {...props} />
      </MemoryRouter>
    );

  describe('US1 - escribir desde la landing', () => {
    it('muestra la dirección como un único enlace mailto', () => {
      renderBand();

      const enlace = screen.getByRole('link', { name: 'ismaelmarot@hotmail.com' });
      expect(enlace).toHaveAttribute('href', 'mailto:ismaelmarot@hotmail.com');
    });

    it('no abre el cliente de correo en otra pestaña', () => {
      renderBand();

      // A new tab that never fills is the worst outcome this band could produce. Asserted because it
      // is a one-attribute decision that a later "make all links open in a tab" sweep would reverse.
      expect(screen.getByRole('link', { name: 'ismaelmarot@hotmail.com' })).not.toHaveAttribute(
        'target'
      );
    });

    it('es el texto más grande de la banda, y su tamaño viene de un token', () => {
      renderBand();

      const direccion = screen.getByRole('link', { name: 'ismaelmarot@hotmail.com' });

      // Read from the injected stylesheet rather than from the class name: styled-components emits
      // generated names, so anything asserted on a class would pass no matter what the CSS says. The
      // token is the assertion, because a literal would look identical at one viewport and not at the
      // other — which is the reason the token exists.
      expect(getCssForElement(direccion)).toContain('font-size: var(--text-display-email)');
    });

    it('la pregunta usa el token de título de sección, no el de la dirección', () => {
      renderBand();

      const css = getCssForElement(screen.getByRole('heading', { level: 2 }));
      expect(css).toContain('font-size: var(--text-display-section)');
      expect(css).not.toContain('--text-display-email');
    });

    it('lleva una flecha diagonal hacia arriba a la derecha', () => {
      renderBand();

      // The arrow is decoration and carries no name of its own: the link's accessible name is still
      // the address alone, which is the assertion above. That it is *there* is a separate question and
      // a test id is how this repository asks it — the same way ProjectIconStrip and
      // ProjectGalleryViewer address decorative nodes.
      const flecha = screen.getByTestId('contact-email-arrow');
      expect(flecha).toHaveAttribute('aria-hidden', 'true');
      expect(flecha).toBeInTheDocument();
    });

    it('lee como la dirección y no como una etiqueta', () => {
      renderBand();

      // The visible text is the accessible name. A band that announced "Email: ismaelmarot@..." on a
      // link that already reads the address is a band that says the same thing twice.
      expect(screen.getByRole('link', { name: 'ismaelmarot@hotmail.com' })).toHaveTextContent(
        'ismaelmarot@hotmail.com'
      );
    });
  });

  describe('US2 - llegar a la página de contacto', () => {
    it('lleva a /contact', () => {
      renderBand();

      expect(screen.getByRole('link', { name: /^ir/ })).toHaveAttribute('href', '/contact');
    });

    it('escribe "ir" y esconde la flecha', () => {
      renderBand();

      // The accessible name is exactly "ir", which is what proves the arrow beside it is hidden: an
      // arrow with a name would make it "ir flecha".
      expect(screen.getByRole('link', { name: 'ir' })).toHaveTextContent('ir');
    });
  });

  describe('US3 - reconocer las redes', () => {
    it('es una lista y cada marca es un elemento', () => {
      renderBand({ redes: [red(), red({ id: 'linkedin', type: 'linkedin', label: 'LinkedIn', displayOrder: 3 })] });

      // Asserted as list plus listitem rather than as two roles on two elements, because this
      // repository has nested a listitem inside a listitem twice and axe caught it twice.
      const lista = screen.getByRole('list', { name: 'Redes' });
      expect(within(lista).getAllByRole('listitem')).toHaveLength(2);
    });

    it('nombra cada red en español y esconde el glifo', () => {
      renderBand({ redes: [red(), red({ id: 'linkedin', type: 'linkedin', label: 'LinkedIn', displayOrder: 3 })] });

      // The names are exactly the network's, which is the assertion that the glyph is not named: a
      // glyph with its own name would make this "GitHub icono" and fail the query.
      expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    });

    it('abre cada red en otra pestaña con rel de seguridad', () => {
      renderBand({ redes: [red()] });

      const enlace = screen.getByRole('link', { name: 'GitHub' });
      expect(enlace).toHaveAttribute('target', '_blank');
      expect(enlace).toHaveAttribute('rel', 'noopener noreferrer');
      expect(enlace).toHaveAttribute('href', 'https://github.com/ismaelmarot');
    });

    it('no dibuja una lista vacía cuando no hay redes', () => {
      renderBand({ redes: [] });

      // An empty role="list" is a landmark with nothing in it: axe reports it and it tells a reader
      // nothing. Absent is better than empty.
      expect(screen.queryByRole('list', { name: 'Redes' })).not.toBeInTheDocument();
    });

    it('toma las redes de la configuración y descarta el correo', () => {
      renderBand();

      // One list feeds this band, the footer and the contact page. The email is filtered out here
      // because the band renders it as its subject, at display size, with an arrow.
      expect(screen.queryByRole('link', { name: 'Email' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /GitHub|LinkedIn/ })).toHaveLength(
        siteConfig.socialLinks.filter((m) => m.type !== 'email').length
      );
    });
  });

  describe('US4 - saber quién lo escribió', () => {
    it('cierra con el nombre configurado', () => {
      renderBand();

      expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    });

    it('acepta un nombre propio para poderlo probar', () => {
      renderBand({ nombre: 'Ismael Marot' });

      expect(screen.getAllByText('Ismael Marot')).toHaveLength(1);
    });
  });

  describe('Lo que ya no puede cambiar', () => {
    it('conserva el id que afirma el navegador', () => {
      renderBand();

      // tests/e2e/homepage.spec.ts asserts #contact-summary is visible on /. An id that changes here
      // fails there, four files away, with nothing pointing back at this one. The region is the
      // element, so the id is read off it rather than reached for through the container.
      expect(screen.getByRole('region', { name: 'Contacto' })).toHaveAttribute(
        'id',
        'contact-summary'
      );
    });

    it('conserva el nombre accesible "Contacto"', () => {
      renderBand();

      expect(screen.getByRole('region', { name: 'Contacto' })).toBeInTheDocument();
    });

    it('pregunta, y la pregunta es su único encabezado', () => {
      renderBand();

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('¿Tienes un proyecto?');
      expect(screen.getAllByRole('heading')).toHaveLength(1);
    });
  });
});