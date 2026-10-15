import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { getCssForElement } from '@/test-utils/css';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Hero } from '@/components/sections/Hero';
import { SectionSummary } from '@/components/sections/SectionSummary';
import { ContactBand } from '@/components/sections/ContactBand';

/**
 * specs/023-home-scroll-snap.
 *
 * `proximity` cannot be checked from the browser. Chromium's computed value drops it because it is the
 * default strictness, and its CSSOM serialization drops it too, so `scroll-snap-type: y proximity` and
 * `scroll-snap-type: y mandatory` are indistinguishable from `getComputedStyle`. The two differ in
 * behaviour, not in what either API reports — the browser test proves the behaviour by flicking, and
 * these assertions check that the stylesheet still says what it is supposed to say.
 */

/**
 * Comments are stripped before any assertion below. Both files discuss the properties being checked
 * *in prose* — the comment above the snap rule explains why it is `proximity` and not `mandatory`, and
 * the one on each band explains why there is no `scroll-margin-top` — so an assertion run against the
 * raw text would match its own explanation and pass for the wrong reason.
 */
const sinComentarios = (texto: string) =>
  texto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const globals = () => sinComentarios(readFileSync(`${process.cwd()}/src/styles/globals.css`, 'utf-8'));

describe('la regla que activa el snap', () => {
  it('está detrás del atributo, no en todas las páginas', () => {
    // El contenedor de scroll es <html>. Ponerlo sin atributo lo aplicaría a /projects y a su carousel.
    expect(globals()).toMatch(/html\[data-scroll-snap=['"]y['"]\]\s*\{\s*scroll-snap-type:\s*y\s+proximity/);
  });

  it('no dice mandatory en ninguna parte', () => {
    expect(globals()).not.toContain('mandatory');
  });

  it('conserva el scroll-padding-top que ya separaba al header', () => {
    // Si esto se fuera, cada banda quedaría detrás del header fijo de 52px al acomodarse.
    expect(globals()).toMatch(/scroll-padding-top:\s*64px/);
  });

  it('desactiva el snap con prefers-reduced-motion', () => {
    // Amendment 1: no pedido, decidido a propósito y anotado para poder revertirlo.
    const bloque = globals().slice(globals().indexOf('prefers-reduced-motion'));
    expect(bloque).toMatch(/html\[data-scroll-snap=['"]y['"]\]\s*\{\s*scroll-snap-type:\s*none/);
  });

  it('no duplica el offset del header con scroll-margin-top', () => {
    // FR-010. scroll-padding-top y scroll-margin-top sobre el mismo punto aplican el desplazamiento dos
    // veces: cada banda quedaría a 128px en vez de 64px.
    for (const archivo of [
      'src/components/sections/Hero/Hero.styles.ts',
      'src/components/sections/SectionSummary/SectionSummary.styles.ts',
      'src/components/sections/ContactBand/ContactBand.styles.ts',
    ]) {
      expect(sinComentarios(readFileSync(`${process.cwd()}/${archivo}`, 'utf-8')), archivo).not.toContain(
        'scroll-margin-top'
      );
    }
  });
});

describe('las cinco bandas son puntos de snap', () => {
  it('el hero, sobre la sección y no sobre la banda negra', () => {
    render(
      <MemoryRouter>
        <Hero
          name="n"
          title="t"
          tagline="g"
          cta={{ label: 'a', href: '/projects' }}
          secondaryCta={{ label: 'b', href: '/contact' }}
        />
      </MemoryRouter>
    );
    const seccion = screen.getByTestId('hero-section');
    // #hero es la Section; el StyledHeroBand de 55dvh es hermano suyo y no lleva el id. Un punto de
    // snap que no es la cosa a la que apunta un link ancla se acomodaría en el lugar equivocado.
    expect(seccion).toHaveAttribute('id', 'hero');
    expect(getCssForElement(seccion)).toContain('scroll-snap-align: start');
  });

  it.each(['projects-summary', 'technologies-summary', 'about-summary'])(
    'la banda %s',
    (id) => {
      render(
        <MemoryRouter>
          <SectionSummary id={id} title="t" description="d" ctaLabel="Ir" ctaHref="/projects" />
        </MemoryRouter>
      );
      expect(getCssForElement(screen.getByRole('region', { name: 't' }))).toContain('scroll-snap-align: start');
    }
  );

  it('la banda de contacto', () => {
    render(
      <MemoryRouter>
        <ContactBand email="a@b.c" />
      </MemoryRouter>
    );
    const banda = screen.getByRole('region', { name: 'Contacto' });
    expect(banda).toHaveAttribute('id', 'contact-summary');
    expect(getCssForElement(banda)).toContain('scroll-snap-align: start');
  });
});