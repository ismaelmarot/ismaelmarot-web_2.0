import { Link } from 'react-router-dom';
import {
  StyledContactBand,
  StyledContactBandInner,
  StyledContactBandTitle,
  StyledContactBandRow,
  StyledContactBandCta,
  StyledContactEmail,
  StyledContactEmailArrow,
  StyledContactBandFooter,
  StyledContactNetworks,
  StyledContactNetworkItem,
  StyledContactNetwork,
  StyledContactBandName,
} from './ContactBand.styles';
import { useContactBand } from './useContactBand';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getContactHref, getContactTypeIcon } from '@/types/contact';

export interface ContactBandProps {
  /** Overridable so the component can be driven from a test fixture. */
  email?: string;
  redes?: ReturnType<typeof useContactBand>['redes'];
  nombre?: string;
}

/**
 * The landing page's closing band, which is the only place a visitor is asked to get in touch.
 *
 * The address is the subject. It is the largest thing in the band, it carries a diagonal arrow, and it
 * is a single link to `mailto:`, so the whole thing can be pressed rather than only the underlined
 * word. The route to the contact page sits beside it because a visitor with no mail client needs
 * somewhere else to go, and that is the reason it is a P1 story rather than a nicety.
 *
 * The heading asks the question and the section keeps the name "Contacto" as its accessible name, so a
 * band reads as what it is while the page's outline keeps one heading per section.
 */
export const ContactBand = ({ email, redes, nombre }: ContactBandProps) => {
  const derived = useContactBand();

  const direccion = email ?? derived.email;
  const redesFinales = redes ?? derived.redes;
  const nombreFinal = nombre ?? derived.nombre;

  return (
    <StyledContactBand id="contact-summary" aria-label="Contacto">
      <StyledContactBandInner>
        <StyledContactBandTitle>¿Tienes un proyecto?</StyledContactBandTitle>

        <StyledContactBandRow>
          {/* The arrow is its own element so it can be hidden, leaving the accessible name as the
              text rather than the text plus "flecha". Every other arrow in this repository follows
              the same rule. */}
          <StyledContactBandCta as={Link} to="/contact">
            ir
            <Icon name="arrowRight" size={20} aria-hidden="true" />
          </StyledContactBandCta>

          {/* No target: a mail client is not something to open in a new tab, and a blank tab that
              never fills is the worst outcome this band could produce. The networks below do open
              in one, because those are documents. */}
          <StyledContactEmail href={`mailto:${direccion}`}>
            {direccion}
            <StyledContactEmailArrow aria-hidden="true" data-testid="contact-email-arrow">
              <Icon name="arrowUpRight" size={28} />
            </StyledContactEmailArrow>
          </StyledContactEmail>
        </StyledContactBandRow>

        <StyledContactBandFooter>
          {/* The list carries the name rather than a div with a role, because this repository has
              twice nested a listitem inside another and twice been caught by axe. A ul with li
              children cannot be got wrong. */}
          {redesFinales.length > 0 && (
            <StyledContactNetworks aria-label="Redes">
              {redesFinales.map((red) => (
                <StyledContactNetworkItem key={red.id}>
                  <StyledContactNetwork
                    href={getContactHref(red)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={red.label}
                  >
                    {/* The cast is the one `ContactMethod` already uses: `getContactTypeIcon`
                        returns a string because `ContactMethod.iconName` is a string in the data.
                        Every type it can return is in the icon table, which is what specs/020 had
                        to keep true when it added two. */}
                    <Icon
                      name={getContactTypeIcon(red.type) as IconName}
                      size={22}
                      aria-hidden="true"
                    />
                  </StyledContactNetwork>
                </StyledContactNetworkItem>
              ))}
            </StyledContactNetworks>
          )}

          <StyledContactBandName>{nombreFinal}</StyledContactBandName>
        </StyledContactBandFooter>
      </StyledContactBandInner>
    </StyledContactBand>
  );
};