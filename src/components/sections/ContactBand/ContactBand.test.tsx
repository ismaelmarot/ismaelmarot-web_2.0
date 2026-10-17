import { readFileSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactBand } from './ContactBand';
import { siteConfig } from '@/data/site-config';
import { getCssForElement } from '@/test-utils/css';
import { tokens } from '@/styles/tokens';
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
    it('la frase lee con su acento, y lo lleva la configuración', () => {
      renderBand();

      // specs/028: "pongámonos manos a la obra" es la forma reflexiva con su acento. El valor vive en
      // la configuración — specs/025 lo decidió y el componente no tiene frase propia — así que leer
      // `siteConfig.contactTagline` y el texto renderizado son la misma afirmación por dos bocas.
      expect(screen.getByTestId('contact-tagline')).toHaveTextContent(
        'Hablemos y pongámonos manos a la obra'
      );
      expect(siteConfig.contactTagline).toBe('Hablemos y pongámonos manos a la obra');
    });

    it('muestra la dirección visible como un único enlace mailto', () => {
      renderBand();

      // specs/027: the visible text and the destination are two values. The link's accessible name is
      // the address the band shows, and the href is the address it writes to.
      const enlace = screen.getByRole('link', { name: 'ismaelmarot@contacto.com' });
      expect(enlace).toHaveAttribute('href', 'mailto:ismaelmarot@hotmail.com');
    });

    it('no abre el cliente de correo en otra pestaña', () => {
      renderBand();

      // A new tab that never fills is the worst outcome this band could produce. Asserted because it
      // is a one-attribute decision that a later "make all links open in a tab" sweep would reverse.
      expect(screen.getByRole('link', { name: 'ismaelmarot@contacto.com' })).not.toHaveAttribute(
        'target'
      );
    });

    it('el texto visible y el destino son dos valores independientes', () => {
      renderBand();

      // The split is the feature: the band shows one address and writes to another. Overriding the
      // display address changes only the text, and the href stays the configured destination.
      expect(screen.getByRole('link', { name: 'ismaelmarot@contacto.com' })).toHaveTextContent(
        'ismaelmarot@contacto.com'
      );

      renderBand({ displayEmail: 'otra@contacto.com' });
      expect(screen.getByRole('link', { name: 'otra@contacto.com' })).toHaveAttribute(
        'href',
        'mailto:ismaelmarot@hotmail.com'
      );
    });

    it('es el texto más grande de la banda, y su tamaño viene de un token', () => {
      renderBand();

      const direccion = screen.getByRole('link', { name: 'ismaelmarot@contacto.com' });

      // Read from the injected stylesheet rather than from the class name: styled-components emits
      // generated names, so anything asserted on a class would pass no matter what the CSS says. The
      // token is the assertion, because a literal would look identical at one viewport and not at the
      // other — which is the reason the token exists.
      //
      // specs/025 raised what that token resolves to and left this assertion untouched, which is the
      // point of asserting a reference instead of a value. The token now reads
      // `var(--text-display-project)` — the Hero's — with a step down below 768px. A test that had
      // asserted `40px` would have needed rewriting; one that asserted the reference did not.
      expect(getCssForElement(direccion)).toContain('font-size: var(--text-display-email)');
    });

    it('la pregunta usa el tamaño de título de sección, porque es el display', () => {
      renderBand();

      // specs/027 inverts the band's hierarchy: the question is the subject and the address is one
      // display step below it. specs/025 had moved the question down to --text-body because the
      // address was the display; that argument no longer holds now that the question is.
      const css = getCssForElement(screen.getByRole('heading', { level: 2 }));
      expect(css).toContain('font-size: var(--text-display-section)');
      expect(css).not.toContain('var(--text-body)');
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
      expect(screen.getByRole('link', { name: 'ismaelmarot@contacto.com' })).toHaveTextContent(
        'ismaelmarot@contacto.com'
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
      //
      // specs/025 took these marks out of a row of their own and into the top row beside the address,
      // so the container they used to have is gone. The list is read directly: a divider could equally
      // be drawn on it, and the assertion is about the absence of one rather than about a wrapper.
      const css = getCssForElement(screen.getByRole('list', { name: 'Redes' }));
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

    it('el mail usa su propio token, cuyo techo es un escalón menos que la pregunta', () => {
      renderBand();

      // specs/027 keeps the address on `--text-display-email`, whose ceiling is `--text-display-project`,
      // so the address is one display step below the question and can never outgrow it. The assertion is
      // on the reference rather than the value, so retuning the token does not rewrite this test.
      expect(getCssForElement(screen.getByRole('link', { name: 'ismaelmarot@contacto.com' }))).toContain(
        'font-size: var(--text-display-email)'
      );
    });

    it('la fila usa `auto 1fr` en desktop y una sola columna en móvil', () => {
      renderBand();

      const css = getCssForElement(screen.getByTestId('contact-band-row'));

      // `auto 1fr`, and specs/025 changed this from `1fr 1fr` deliberately rather than for looks.
      //
      // Splitting the row in half gave the address 596px at 1440, which is the number specs/021 measured
      // a 44px address against and found 3px too wide. Letting the networks take only what they need
      // — four 44px marks and three gaps, about 230px — leaves the address roughly 960, and 56px needs
      // 711. **The arrangement is what made the size possible**, so this assertion is load-bearing: a
      // `1fr 1fr` here would pass every other test and put the address back over the edge.
      expect(css).toContain('grid-template-columns: auto 1fr');
      expect(css).not.toContain('grid-template-columns: 1fr 1fr');
      // And it collapses below 768px, where the address takes the full width and steps its size down.
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

  describe('specs/025 - composicion', () => {
    it('la frase sale de la configuracion y no del componente', () => {
      renderBand();

      expect(screen.getByTestId('contact-tagline')).toHaveTextContent(siteConfig.contactTagline);
      // Y la props la puede pisar, igual que el mail, para montar la banda desde un fixture.
      renderBand({ tagline: 'otra frase' });
      expect(screen.getAllByTestId('contact-tagline')[1]).toHaveTextContent('otra frase');
    });

    it('la frase es un parrafo y no un encabezado', () => {
      renderBand();

      // La banda tiene una sola voz: si la frase fuera un h2 más, el esquema de la página ganaría una
      // segunda pregunta y el contorno dejaría de decir qué es cada sección.
      expect(screen.getByTestId('contact-tagline').tagName).toBe('P');
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    });

    it('la frase tiene el tamaño del texto de "Sobre mí" y el gap del bloque respira un escalón', () => {
      renderBand();

      // specs/028 brought three claims: the accent (asserted above), this scale and this gap.
      // The token reference is the assertion, the same way the question's test holds
      // `--text-display-section`: a literal would agree at one viewport and lie at another.
      const frase = getCssForElement(screen.getByTestId('contact-tagline'));
      expect(frase).toContain('font-size: var(--text-large-subtitle)');
      expect(frase).not.toContain('--text-body');

      // El testid del contenedor existe porque `no-node-access` prohíbe alcanzar un padre a través de
      // un hijo, y la fila ya lo practica: un nodo estructural sin rol se nombra para la prueba, no
      // para el lector de pantalla.
      expect(getCssForElement(screen.getByTestId('contact-band-inner'))).toContain(
        `gap: ${tokens.space[12]}`
      );
    });

    it('las redes van antes que el mail en el DOM', () => {
      renderBand({ redes: [red()] });

      // Por el orden en que getAllByRole los devuelve, que es el orden del documento. Es la forma que
      // este repositorio usa para lo mismo en ProjectIconStrip, y la razón de no alcanzar el nodo:
      // el orden que importa es el que ve un lector de pantalla, y Testing Library ya lo entrega.
      //
      // El nombre se lee de aria-label y no del texto porque las marcas son iconos: el texto está
      // vacío y el nombre vive en el atributo, que es justo lo que un lector de pantalla anuncia.
      const enlaces = screen.getAllByRole('link');
      const indiceDe = (nombre: RegExp) =>
        enlaces.findIndex((a) => nombre.test(a.getAttribute('aria-label') ?? a.textContent ?? ''));

      const github = indiceDe(/GitHub/i);
      const mail = indiceDe(/ismaelmarot@contacto/);

      expect(github, 'el fixture trae una red llamada GitHub').toBeGreaterThanOrEqual(0);
      expect(mail, 'el mail está después de las redes en el DOM').toBeGreaterThan(github);
    });

    /* La afirmación completa — que el encabezado es el PRIMER elemento de la banda, antes que la fila
       de arriba que `order` sube visualmente — vive en tests/e2e/contact-band-layout.spec.ts. Ahí se
       mide sobre la página real, y acá la cuenta de encabezados de la banda ya sostiene lo que de
       verdad importa para el contorno: que hay una sola voz y que pregunta. Reach for the node
       directamente para leer siblings sería la forma de decirlo acá, y no compra nada que el E2E no
       mida mejor. */

    it('el boton esta alineado a la izquierda, en escritorio y en movil', () => {
      renderBand();

      // align-self y no margin-left:auto, para que la regla se lea como una alineación y revertirla
      // sea una declaración. specs/027 left-aligns it beneath the sentence, so there is no media query
      // that moves it: a left column of question, sentence and button is the arrangement.
      const boton = screen.getByRole('link', { name: 'ir' });
      expect(getCssForElement(boton)).toContain('align-self: flex-start');
      expect(getCssForElement(boton)).not.toContain('@media (max-width: 767px)');
    });

    it('el mail esta alineado a la derecha en escritorio y a la izquierda en movil', () => {
      renderBand();

      const css = getCssForElement(screen.getByRole('link', { name: 'ismaelmarot@contacto.com' }));

      // justify-self es la única declaración que lo pone en el borde derecho de la columna que la fila
      // le deja, y la media query lo devuelve al inicio cuando la fila se apila en una columna.
      expect(css).toContain('justify-self: end');
      expect(css).toContain('justify-self: start');
    });

    it('el token del mail encadena al del Hero, que es lo que lo hace del mismo tamaño', () => {
      // La cadena entera, leída del archivo de tokens y no del componente: el componente sólo dice
      // `var(--text-display-email)` y no puede saber a qué apunta. Es el archivo el que dice que ese
      // token es el del Hero, y esa es la mitad de la promesa que no se ve desde el componente.
      const tokens = readFileSync(`${process.cwd()}/src/styles/tokens.css`, 'utf-8');
      const declaracion = tokens.match(/--text-display-email:\s*([^;]+);/);
      expect(declaracion, 'el token existe').not.toBeNull();
      expect(declaracion![1].trim()).toBe('clamp(1.125rem, 5.6vw, var(--text-display-project))');

      /* El techo es el token del Hero y no un número, y eso es lo que hace que los dos no puedan
         separarse. El argumento es estructural y no depende de que el fallo que lo motivaba llegara
         a ocurrir: un breakpoint que tiene que coincidir con el token de otro componente es una
         segunda regla sobre el tamaño. 767 y 768 son el mismo ancho escrito dos veces, y nada los
         mantiene juntos cuando uno de los dos se edite.

         Y el fallo sí ocurría, medido. A viewport 768, Chromium da clientWidth 768 y
         `(max-width: 767px)` no matchea: el mail se queda en los 32px del Hero. En WebKit la barra de
         desplazamiento se come 8px y clientWidth da 760, así que la regla SÍ matchea, el mail cae a
         24px y el Hero sigue en 32. Los dos se separan justo en el ancho donde la promesa del
         proyecto es que son iguales. Chromium lo esconde, WebKit no, y CI corre WebKit.

         Y el piso y la rampa viven en la misma declaración. Un tamaño repartido entre una regla y una
         media query es un tamaño que la próxima vez queda cambiado por la mitad, y además aquí no hace
         falta: el techo se cruza solo alrededor de los 540px. */
      expect(declaracion![1]).toContain('5.6vw');
      expect(declaracion![1]).toContain('1.125rem');
      /* El E2E sí distingue las dos versiones, pero sólo en un motor: en WebKit a 768 el caso tablet
         mide 24px contra 32px y revienta. Ésta sigue siendo la aserción que ata el mecanismo, porque
         funciona en cualquier motor y sin lanzar un navegador. */
      const reglasDelMail = [...tokens.matchAll(/--text-display-email:\s*([^;]+);/g)];
      expect(reglasDelMail).toHaveLength(1);
    });
  });
});
