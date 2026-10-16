import { Link } from 'react-router-dom';
import {
  StyledContactBand,
  StyledContactBandInner,
  StyledContactBandTitle,
  StyledContactBandDescription,
  StyledContactBandRow,
  StyledContactBandCopy,
  StyledContactBandCta,
  StyledContactEmail,
  StyledContactEmailArrow,
  StyledContactNetworks,
  StyledContactNetworkItem,
  StyledContactNetwork,
} from './ContactBand.styles';
import { useContactBand } from './useContactBand';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getContactHref, getContactTypeIcon } from '@/types/contact';

export interface ContactBandProps {
  /** Overridable so the component can be driven from a test fixture. */
  email?: string;
  redes?: ReturnType<typeof useContactBand>['redes'];
  /** specs/025: overridable alongside the address, for the same reason. */
  tagline?: string;
}

/**
 * The landing page's closing band, which is the only place a visitor is asked to get in touch.
 *
 * The address is the subject. It is the largest thing in the band, it carries a diagonal arrow, and it
 * is a single link to `mailto:`, so the whole thing can be pressed rather than only the underlined
 * word. specs/025 set its size to the same token the Hero's "Web Developer" phase uses, so the band
 * ends the page at the scale the page starts.
 *
 * Its arrangement follows from that: the networks sit beside the address on one row, which is what
 * gives the address a column wide enough to grow into, and the question and its sentence sit beneath.
 * The route to the contact page is there because a visitor with no mail client needs somewhere else to
 * go, and that is the reason it is a P1 story rather than a nicety.
 *
 * The heading asks the question and the section keeps the name "Contacto" as its accessible name, so a
 * band reads as what it is while the page's outline keeps one heading per section.
 */
export const ContactBand = ({ email, redes, tagline }: ContactBandProps) => {
  const derived = useContactBand();

  const direccion = email ?? derived.email;
  const redesFinales = redes ?? derived.redes;
  const frase = tagline ?? derived.tagline;

  return (
    <StyledContactBand id="contact-summary" aria-label="Contacto">
      <StyledContactBandInner>
        {/* The question first, then the row above it, and `order` puts the row on top.
          That is the whole resolution of specs/025's conflict: the drawing wants the networks and the
          address across the top, and a screen reader should still hear what the section is before it
          hears four social platforms. `order` gives the drawing its arrangement without touching the
          reading order, and one copy of the markup means the desktop and mobile arrangements cannot
          drift apart. Reordering the markup to match the drawing would be one line shorter and would
          leave the page's outline starting with a list of platforms. */}
      <StyledContactBandCopy>
        <StyledContactBandTitle>¿Tienes un proyecto?</StyledContactBandTitle>
        {/* specs/025: the sentence is copy, so it comes from siteConfig rather than from here.
            A paragraph and not a second heading, because the band keeps exactly one voice. */}
        <StyledContactBandDescription data-testid="contact-tagline">
          {frase}
        </StyledContactBandDescription>
      </StyledContactBandCopy>

      {/* `auto 1fr`, and that is specs/025's central decision rather than a look. `1fr 1fr` split the
          row in half and gave the address 596px at 1440 — the number specs/021 measured a 44px address
          against and found 3px too wide. Letting the networks take only what they need leaves the
          address roughly 960, and the 56px the Hero's token asks for needs 711. The arrangement is
          what made the size possible, not the other way round. */}
      <StyledContactBandRow data-testid="contact-band-row">
        {/* The list carries the name rather than a div with a role, because this repository has twice
            nested a listitem inside another and twice been caught by axe. A ul with li children
            cannot be got wrong. */}
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
                  {/* The cast is the one `ContactMethod` already uses: `getContactTypeIcon` returns
                      a string because `ContactMethod.iconName` is a string in the data. Every type it
                      can return is in the icon table, which is what specs/020 had to keep true when
                      it added two. */}
                  <Icon name={getContactTypeIcon(red.type) as IconName} size={22} aria-hidden="true" />
                </StyledContactNetwork>
              </StyledContactNetworkItem>
            ))}
          </StyledContactNetworks>
        )}

        {/* No target: a mail client is not something to open in a new tab, and a blank tab that never
            fills is the worst outcome this band could produce. The networks beside it do open in one,
            because those are documents. */}
        <StyledContactEmail href={`mailto:${direccion}`}>
          {direccion}
          <StyledContactEmailArrow aria-hidden="true" data-testid="contact-email-arrow">
            <Icon name="arrowUpRight" size={28} />
          </StyledContactEmailArrow>
        </StyledContactEmail>
      </StyledContactBandRow>

      {/* The arrow is its own element so it can be hidden, leaving the accessible name as the text
          rather than the text plus "flecha". Every other arrow in this repository follows the same
          rule. Aligned right because the drawing indents it; one declaration to change. */}
      <StyledContactBandCta as={Link} to="/contact">
        ir
        <Icon name="arrowRight" size={20} aria-hidden="true" />
      </StyledContactBandCta>

      </StyledContactBandInner>
    </StyledContactBand>
  );
};