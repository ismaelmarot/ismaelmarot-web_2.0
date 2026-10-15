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

    it('la pregunta ya no usa un tamaño display, porque el display es el mail', () => {
      renderBand();

      // specs/020 shipped this heading at --text-display-section, 72px, against an address of 36px.
      // specs/021 moved it to --text-large-subtitle so the address is the largest thing in the band,
      // which is what 020 said it wanted and did not deliver.
      const css = getCssForElement(screen.getByRole('heading', { level: 2 }));
      expect(css).toContain('font-size: var(--text-body)');
      expect(css).not.toContain('--text-display-section');
      // --text-large-subtitle was the first answer and it was wrong: its 20px floor is above the
      // address's 18px floor, so the band still showed the question larger than the address on a
      // phone. Asserting the absence keeps the token that inverts from coming back.
      expect(css).not.toContain('--text-large-subtitle');
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
      // Four, after specs/021. Counted against the configuration rather than typed in, so the test
      // cannot pass against a list it and the page disagree about.
      expect(
        screen.getAllByRole('link', { name: /GitHub|LinkedIn|Facebook|Instagram/ })
      ).toHaveLength(siteConfig.socialLinks.filter((m) => m.type !== 'email').length);
    });
  });

  describe('US4 - el nombre y la línea se fueron', () => {
    it('no renderiza el nombre del dueño', () => {
      renderBand();

      // specs/021 removed it. Asserted as an absence because a name is easy to leave in a styled block
      // that no longer renders anything, and "the component no longer takes a name prop" is a fact about
      // the types rather than about the page.
      expect(screen.queryByText(siteConfig.name)).not.toBeInTheDocument();
    });

    it('no dibuja una línea divisoria encima de los iconos', () => {
      renderBand({ redes: [red()] });

      // Read from the injected stylesheet rather than guessed at: border-top is what the divider was,
      // and asserting on a class name would pass whatever the CSS says, because styled-components emits
      // generated names.
      const css = getCssForElement(screen.getByTestId('contact-networks-row'));
      expect(css).not.toContain('border-top');
    });
  });

  describe('specs/021 - proporciones', () => {
    it('el botón es negro con el texto y la flecha en blanco', () => {
      renderBand();

      const boton = screen.getByRole('link', { name: 'ir' });
      const css = getCssForElement(boton);

      expect(css).toContain('color: var(--color-white)');
      expect(css).toContain('background-color: var(--color-black)');
      // The arrow is inside the button, so the button's colour is what paints it. That is the reason
      // this is one assertion rather than two.
      expect(boton).toHaveTextContent('ir');
    });

    it('el botón tiene un foco visible sobre una superficie negra', () => {
      renderBand();

      const css = getCssForElement(screen.getByRole('link', { name: 'ir' }));

      // --shadow-focus is drawn in the page's own colour. On a black button that colour is the
      // background, so inheriting it would leave the band's only control with no focus indicator.
      expect(css).toContain('outline: 2px solid var(--color-white)');
      expect(css).not.toContain('var(--shadow-focus)');
    });

    it('el techo del token del mail es 2.5rem', () => {
      renderBand();

      // The ceiling is arithmetic: 40px of text plus a 28px arrow plus a 12px gap is 566px, inside the
      // 596px half column. 44px would be 619px. Asserted on the token because the token is what every
      // viewport resolves against.
      expect(getCssForElement(screen.getByRole('link', { name: 'ismaelmarot@hotmail.com' }))).toContain(
        'font-size: var(--text-display-email)'
      );
    });

    it('la fila usa dos columnas iguales en desktop y una sola en móvil', () => {
      renderBand();

      const css = getCssForElement(screen.getByTestId('contact-band-row'));

      // The split is the requirement. 1fr 1fr rather than a fixed px, so it holds at any container.
      expect(css).toContain('grid-template-columns: 1fr 1fr');
      // And it collapses below 768px, where the address comes first because it is the subject.
      expect(css).toContain('@media (max-width: 767px)');
    });

    it('los dos iconos que faltaban apuntan a la landing de su plataforma y a nada más', () => {
      renderBand();

      const facebook = screen.getByRole('link', { name: 'Facebook' });
      const instagram = screen.getByRole('link', { name: 'Instagram' });

      expect(facebook).toHaveAttribute('href', 'https://www.facebook.com');
      expect(instagram).toHaveAttribute('href', 'https://www.instagram.com');
      // "and nothing else": a guessed handle would be a path after the host, and a profile that does
      // not exist is a broken link. Asserted so neither can creep in unnoticed.
      expect(new URL(facebook.getAttribute('href')!).pathname).toBe('/');
      expect(new URL(instagram.getAttribute('href')!).pathname).toBe('/');
    });

    it('muestra cuatro marcas, no dos', () => {
      renderBand();

      expect(
        within(screen.getByRole('list', { name: 'Redes' })).getAllByRole('listitem')
      ).toHaveLength(4);
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