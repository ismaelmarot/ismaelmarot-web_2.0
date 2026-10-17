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
  /** specs/027: the visible address, overridable alongside the destination for the same reason. */
  displayEmail?: string;
  redes?: ReturnType<typeof useContactBand>['redes'];
  /** specs/025: overridable alongside the address, for the same reason. */
  tagline?: string;
}

/**
 * The landing page's closing band, which is the only place a visitor is asked to get in touch.
 *
 * The question is the subject. It is the largest thing in the band, it sits at the top-left, and it is
 * the section's only heading, so the band opens the way the other bands do. specs/027 inverts the
 * hierarchy specs/025 settled, where the address was the subject and the question a caption beneath it.
 *
 * Its arrangement follows from that: the question, the sentence and the call to action form a left
 * column, and the networks and the address sit on a row beneath them, the networks at the left and the
 * address flush right. The drawing and the DOM order agree, so no `order` is needed and one copy of the
 * markup serves the desktop and the mobile arrangements.
 *
 * The address is a link rather than a heading, and its visible text and its destination are two
 * independent values: the band shows `contactDisplayEmail` and writes to `email`. The route to the
 * contact page is there because a visitor with no mail client needs somewhere else to go.
 *
 * The heading asks the question and the section keeps the name "Contacto" as its accessible name, so a
 * band reads as what it is while the page's outline keeps one heading per section.
 */
export const ContactBand = ({ email, displayEmail, redes, tagline }: ContactBandProps) => {
  const derived = useContactBand();

  const destino = email ?? derived.email;
  const direccion = displayEmail ?? derived.displayEmail;
  const redesFinales = redes ?? derived.redes;
  const frase = tagline ?? derived.tagline;

  return (
    <StyledContactBand id="contact-summary" aria-label="Contacto">
      <StyledContactBandInner data-testid="contact-band-inner">
        <StyledContactBandCopy>
          <StyledContactBandTitle>¿Tienes un proyecto?</StyledContactBandTitle>
          {/* specs/025: the sentence is copy, so it comes from siteConfig rather than from here.
              A paragraph and not a second heading, because the band keeps exactly one voice. */}
          <StyledContactBandDescription data-testid="contact-tagline">
            {frase}
          </StyledContactBandDescription>

          {/* The band's own route to the contact page, and the one thing in the band shaped like a
              control. Black with white text and a white arrow, which is a request rather than a
              palette choice: on a white band a white button disappears and a grey one reads as
              disabled. Left-aligned beneath the sentence, inside the copy. */}
          <StyledContactBandCta as={Link} to="/contact">
            ir
            <Icon name="arrowRight" size={20} aria-hidden="true" />
          </StyledContactBandCta>
        </StyledContactBandCopy>

        {/* `auto 1fr`, and that is specs/025's central decision rather than a look. `1fr 1fr` split the
            row in half and gave the address 596px at 1440 — the number specs/021 measured a 44px
            address against and found 3px too wide. Letting the networks take only what they need
            leaves the address roughly 960, and the 56px the token asks for needs 711. The arrangement
            is what made the size possible, not the other way round. */}
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
              because those are documents.

              The visible text and the destination are separate: `direccion` is what the visitor reads and
              `destino` is where the link writes to. specs/027 split them because the band shows a
              contact alias and the mail client opens the real inbox. */}
          <StyledContactEmail href={`mailto:${destino}`}>
            {direccion}
            <StyledContactEmailArrow aria-hidden="true" data-testid="contact-email-arrow">
              <Icon name="arrowUpRight" size={28} />
            </StyledContactEmailArrow>
          </StyledContactEmail>
        </StyledContactBandRow>
      </StyledContactBandInner>
    </StyledContactBand>
  );
};
