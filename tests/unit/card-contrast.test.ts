import { describe, expect, it } from 'vitest';

/**
 * Amendment 3 of specs/009-projects-carousel-dark.
 *
 * The card went from a dark gradient to white, which inverts every colour on it. Asserting the
 * colour strings would only prove the tokens were edited; the failure this amendment has to prevent
 * is a pair that does not clear AA, which is arithmetic and not a string. So the pairs are measured.
 */

const linea = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
};

const contraste = (a: string, b: string) => {
  const [x, y] = [linea(a), linea(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

describe('la tarjeta clara cumple AA en cada par', () => {
  const TARJETA = '#FFFFFF';

  it('el nombre supera 4.5:1 sobre el blanco', () => {
    expect(contraste('#1D1D1F', TARJETA)).toBeGreaterThanOrEqual(4.5);
  });

  it('la descripcion supera 4.5:1 sobre el blanco', () => {
    expect(contraste('#6E6E73', TARJETA)).toBeGreaterThanOrEqual(4.5);
  });

  it('un gris mas oscuro no solo separa menos: rompe la descripcion en un caso', () => {
    // Correccion de una afirmacion propia. #6E6E73 sobre #F2F2F7 da 4.54:1 y SI pasa AA, asi que
    // la descripcion no era lo que decidia el color. Lo que si falla es el azul de la accion
    // (4.21:1 sobre #F2F2F7) y, en un gris mas oscuro todavia, la propia descripcion.
    expect(contraste('#6E6E73', '#F2F2F7')).toBeGreaterThanOrEqual(4.5);
    expect(contraste('#6E6E73', '#E8E8ED')).toBeLessThan(4.5);
    expect(contraste('#F2F2F7', '#F5F5F7')).toBeLessThan(1.05);
  });

  it('el azul de la accion supera 4.5:1 sobre el blanco y sobre el chip', () => {
    // La razon de que el boton siga siendo azul y no se vuelva negro con el resto de la tarjeta.
    expect(contraste('#0071E3', TARJETA)).toBeGreaterThanOrEqual(4.5);
    expect(contraste('#0071E3', '#F2F2F7')).toBeLessThan(4.5);
  });

  it('el texto del chip supera 4.5:1 sobre su propio relleno', () => {
    expect(contraste('#48484A', '#F2F2F7')).toBeGreaterThanOrEqual(4.5);
  });

  it('el marco del icono se distingue del blanco, a diferencia del blanco translucido', () => {
    // rgba(255,255,255,0.09) sobre blanco compone a #FFFFFF: la tarjeta no tendria marco.
    const translucido = linea('#FFFFFF') * 0.91 + linea('#FFFFFF') * 0.09;
    expect(contraste('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(translucido).toBeCloseTo(linea('#FFFFFF'), 5);
    expect(contraste('#E8E8ED', TARJETA)).toBeGreaterThan(1.05);
  });

  it('un borde #D2D2D7 no serviria como separador, por eso el borde es transparente', () => {
    // WCAG pide 3:1 para un limite no textual; esto es la razon medida de no anadirlo.
    expect(contraste('#D2D2D7', TARJETA)).toBeLessThan(3);
  });

  it('la tarjeta sigue siendo el elemento mas claro de la seccion', () => {
    // Jerarquia: sobre un fondo #F5F5F7, solo el blanco convierte la tarjeta en el foco.
    expect(contraste(TARJETA, '#F5F5F7')).toBeGreaterThan(contraste('#F2F2F7', '#F5F5F7'));
  });
});
