import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { CONTACT_FORM_LIMITS } from '@/types/contact';
import { useContactForm } from './useContactForm';
import {
  StyledForm,
  StyledFields,
  StyledControl,
  StyledTextarea,
  StyledConsentRow,
  StyledCheckbox,
  StyledConsentText,
  StyledNote,
  StyledActions,
  StyledStatus,
  StyledUnavailable,
  StyledHoneypot,
  StyledConsentError,
} from './ContactForm.styles';

export interface ContactFormProps {
  /** Overridable so the copy can be reviewed in one place. Spanish, matching the section. */
  unavailableMessage?: string;
}

export const ContactForm = ({
  unavailableMessage = 'El formulario de contacto no está disponible en este momento. Puedes escribirme directamente por correo.',
}: ContactFormProps) => {
  const { values, status, errors, errorMessage, isConfigured, setField, handleSubmit } =
    useContactForm();

  const isSending = status === 'sending';

  if (!isConfigured) {
    return <StyledUnavailable role="status">{unavailableMessage}</StyledUnavailable>;
  }

  return (
    <StyledForm onSubmit={handleSubmit} noValidate aria-label="Formulario de contacto">
      <StyledFields>
        <FormField
          id="contact-name"
          label="Nombre"
          required
          error={errors.name}
          hint={`Máximo ${CONTACT_FORM_LIMITS.name} caracteres`}
        >
          {(control) => (
            <StyledControl
              {...control}
              type="text"
              name="name"
              $invalid={Boolean(errors.name)}
              autoComplete="name"
              maxLength={CONTACT_FORM_LIMITS.name}
              placeholder="Ada Lovelace"
              value={values.name}
              disabled={isSending}
              onChange={(event) => setField('name', event.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="contact-email"
          label="Email"
          required
          error={errors.email}
          hint={`Máximo ${CONTACT_FORM_LIMITS.email} caracteres`}
        >
          {(control) => (
            <StyledControl
              {...control}
              type="email"
              name="email"
              $invalid={Boolean(errors.email)}
              inputMode="email"
              autoComplete="email"
              maxLength={CONTACT_FORM_LIMITS.email}
              placeholder="ada@example.com"
              value={values.email}
              disabled={isSending}
              onChange={(event) => setField('email', event.target.value)}
            />
          )}
        </FormField>

        <FormField
          id="contact-message"
          label="Mensaje"
          required
          error={errors.message}
          hint={`Máximo ${CONTACT_FORM_LIMITS.message} caracteres`}
        >
          {(control) => (
            <StyledTextarea
              {...control}
              name="message"
              $invalid={Boolean(errors.message)}
              rows={5}
              maxLength={CONTACT_FORM_LIMITS.message}
              placeholder="Cuéntame en qué puedo ayudarte."
              value={values.message}
              disabled={isSending}
              onChange={(event) => setField('message', event.target.value)}
            />
          )}
        </FormField>
      </StyledFields>

      <StyledHoneypot aria-hidden="true">
        <label htmlFor="contact-botcheck">No completes este campo</label>
        <input
          id="contact-botcheck"
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          // On the input itself as well as on the wrapper: inheritance of aria-hidden into
          // the subtree is handled inconsistently across screen readers.
          aria-hidden="true"
          defaultValue=""
        />
      </StyledHoneypot>

      <StyledConsentRow>
        <StyledCheckbox
          id="contact-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          disabled={isSending}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
          onChange={(event) => setField('consent', event.target.checked)}
        />
        <StyledConsentText htmlFor="contact-consent">
          Acepto que mis datos se usen únicamente para responder a este mensaje.
        </StyledConsentText>
      </StyledConsentRow>

      {errors.consent && (
        <StyledConsentError id="contact-consent-error">{errors.consent}</StyledConsentError>
      )}

      <StyledNote>
        Este formulario envía el mensaje a través de un servicio externo de correo y no
        guarda tus datos en este sitio.
      </StyledNote>

      <StyledActions>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSending}
          disabled={!isConfigured}
        >
          {isSending ? 'Enviando…' : 'Enviar mensaje'}
        </Button>

        {status === 'sent' && (
          <StyledStatus role="status" $tone="success">
            <Icon name="check" size={16} aria-hidden="true" />
            Mensaje enviado. Gracias, responderé pronto.
          </StyledStatus>
        )}

        {status === 'failed' && errorMessage && (
          <StyledStatus role="alert" $tone="danger">
            {errorMessage}
          </StyledStatus>
        )}
      </StyledActions>
    </StyledForm>
  );
};