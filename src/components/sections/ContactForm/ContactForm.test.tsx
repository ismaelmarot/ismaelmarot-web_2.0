import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from './ContactForm';

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada Lovelace' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText(/^mensaje/i), { target: { value: 'Hola, curious about your work.' } });
  fireEvent.click(screen.getByRole('checkbox'));
};

describe('ContactForm', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  afterEach(() => {
    // Without this, a test that fails while running on fake timers leaves them installed
    // and every later test in the file hangs.
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', 'w3f_test_key');
    fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('fields', () => {
    it('renders the three fields and the consent box', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^mensaje/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    });

    it('states the maximum length of each field before they are typed into', () => {
      render(<ContactForm />);

      expect(screen.getByText(/100 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/2000 caracteres/i)).toBeInTheDocument();
    });

    it('tells the visitor the message is relayed through a third party', () => {
      render(<ContactForm />);
      expect(screen.getByText(/servicio externo/i)).toBeInTheDocument();
    });

    it('hides the honeypot from people and from assistive technology', () => {
      render(<ContactForm />);

      // Found through its label rather than its accessible name: aria-hidden removes the
      // subtree from name computation, which is exactly the point being asserted here.
      // No hidden option is needed because jsdom does not evaluate the CSS clip, so the
      // element is simply present to any query.
      const honeypot = screen.getByLabelText(/no completes este campo/i, { selector: 'input' });
      expect(honeypot).toHaveAttribute('name', 'botcheck');
      // The visual hiding is a CSS clip, which jsdom does not evaluate, so what is asserted
      // here is the part assistive technology and the tab order actually depend on. The
      // clip itself is checked in the browser during the polish pass.
      // A hidden field that stays in the tab order, or is announced, becomes an
      // unexplained empty input for anyone using a keyboard or a screen reader.
      expect(honeypot).toHaveAttribute('aria-hidden', 'true');
      expect(honeypot).toHaveAttribute('tabindex', '-1');
      expect(honeypot).toHaveAttribute('autocomplete', 'off');
      expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('sending', () => {
    it('shows progress and a confirmation when the message is accepted', async () => {
      render(<ContactForm />);
      fillValidForm();

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    });

    it('clears the fields after a successful send', async () => {
      render(<ContactForm />);
      fillValidForm();

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      await screen.findByText(/mensaje enviado/i);
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/^mensaje/i)).toHaveValue('');
    });

    it('disables the send control and shows a spinner while sending', async () => {
      let release!: (value: unknown) => void;
      fetchMock.mockImplementation(
        () => new Promise((resolve) => { release = resolve; })
      );
      render(<ContactForm />);
      fillValidForm();

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      const button = await screen.findByRole('button', { name: /enviando/i });
      expect(button).toBeDisabled();

      release({ ok: true });
      await screen.findByText(/mensaje enviado/i);
    });

    it('sends one message even if the control is activated repeatedly', async () => {
      let release!: (value: unknown) => void;
      fetchMock.mockImplementation(
        () => new Promise((resolve) => { release = resolve; })
      );
      render(<ContactForm />);
      fillValidForm();

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
      const sending = await screen.findByRole('button', { name: /enviando/i });

      // The button is disabled, so this is the assertion that proves the guard lives in the
      // handler and not only in the control's appearance.
      fireEvent.click(sending);
      fireEvent.submit(screen.getByRole('form', { name: /formulario de contacto/i }));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      release({ ok: true });
      await screen.findByText(/mensaje enviado/i);
    });

    it('sends when Enter is pressed inside a field', async () => {
      render(<ContactForm />);
      fillValidForm();

      fireEvent.submit(screen.getByRole('form', { name: /formulario de contacto/i }));

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    });

    it('sends the values the visitor typed', async () => {
      render(<ContactForm />);
      fillValidForm();

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
      expect(body).toMatchObject({
        access_key: 'w3f_test_key',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'Hola, curious about your work.',
      });
    });
  });

  describe('validation', () => {
    const submit = () => fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    it('flags every empty field at once and sends nothing', () => {
      render(<ContactForm />);

      submit();

      expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El email es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('marks the offending field as invalid and links it to its message', () => {
      render(<ContactForm />);

      submit();

      const name = screen.getByLabelText(/nombre/i);
      expect(name).toHaveAttribute('aria-invalid', 'true');
      expect(name).toHaveAttribute('aria-describedby', 'contact-name-error');
    });

    it('moves focus to the first field that needs fixing', () => {
      render(<ContactForm />);

      submit();

      // Without this, an error that appears away from the focus position goes unnoticed by a
      // screen reader, which then reads out a field carrying an error nobody announced.
      expect(screen.getByLabelText(/nombre/i)).toHaveFocus();
    });

    it('rejects a malformed email address', () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada Lovelace' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@' } });
      fireEvent.change(screen.getByLabelText(/^mensaje/i), { target: { value: 'Hola' } });
      fireEvent.click(screen.getByRole('checkbox'));

      submit();

      expect(screen.getByText(/email válido/i)).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('blocks the send when the consent box is not accepted', () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada Lovelace' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@example.com' } });
      fireEvent.change(screen.getByLabelText(/^mensaje/i), { target: { value: 'Hola' } });

      submit();

      expect(screen.getByText(/necesito tu consentimiento/i)).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('stops reporting a field as soon as it is corrected', () => {
      render(<ContactForm />);
      submit();
      expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada' } });

      expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).not.toHaveAttribute('aria-invalid');
      // The hint comes back, because the error had taken its place.
      expect(screen.getByText(/100 caracteres/i)).toBeInTheDocument();
    });

    it('does not re-check a field that was never flagged', () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada' } });

      // Typing in a field before ever submitting must not raise an error on its own.
      expect(screen.getByLabelText(/nombre/i)).not.toHaveAttribute('aria-invalid');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('sends once the flagged problems are fixed, without retyping', async () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada Lovelace' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@example.com' } });
      fireEvent.change(screen.getByLabelText(/^mensaje/i), { target: { value: 'Hola' } });

      submit();
      expect(screen.getByText(/necesito tu consentimiento/i)).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();

      // Fixing the checkbox clears its own error but does not send on its own: the visitor
      // still presses send, which is what stops a stray click from delivering a message.
      fireEvent.click(screen.getByRole('checkbox'));
      expect(screen.queryByText(/necesito tu consentimiento/i)).not.toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();

      submit();

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

      // What arrived proves nothing had to be retyped.
      const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
      expect(body).toMatchObject({ name: 'Ada Lovelace', message: 'Hola' });

      // And afterwards the form is empty again, ready for a second message.
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/^mensaje/i)).toHaveValue('');
    });
  });

  describe('when delivery fails', () => {
    const submitFilled = async () => {
      fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    };

    it('explains the failure in language a visitor understands', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });
      render(<ContactForm />);

      await submitFilled();

      expect(await screen.findByText(/no se pudo enviar el mensaje/i)).toBeInTheDocument();
    });

    it('never leaks provider wording or a status code', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ success: false, message: 'web3forms: upstream unavailable' }),
      });
      render(<ContactForm />);

      await submitFilled();

      const alert = await screen.findByRole('alert');
      expect(alert.textContent).not.toMatch(/web3forms/i);
      expect(alert.textContent).not.toMatch(/503|upstream/i);
    });

    it('keeps everything the visitor typed', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });
      render(<ContactForm />);

      await submitFilled();
      await screen.findByRole('alert');

      expect(screen.getByLabelText(/nombre/i)).toHaveValue('Ada Lovelace');
      expect(screen.getByLabelText(/email/i)).toHaveValue('ada@example.com');
      expect(screen.getByLabelText(/^mensaje/i)).toHaveValue(
        'Hola, curious about your work.'
      );
    });

    it('lets the visitor retry without retyping anything', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      render(<ContactForm />);

      await submitFilled();
      await screen.findByRole('alert');

      fetchMock.mockResolvedValueOnce({ ok: true });
      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const retryBody = JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string);
      expect(retryBody).toMatchObject({ name: 'Ada Lovelace' });
    });

    it('reports a rejected submission differently from a broken service', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 400 });
      render(<ContactForm />);

      await submitFilled();

      // 400 means the submission itself was refused; 500 means the service is unwell. They
      // read differently to the visitor, so they are different messages.
      expect(await screen.findByText(/no se pudo enviar el mensaje. inténtalo de nuevo\.$/i)).toBeInTheDocument();
    });

    it('reports a network failure', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
      render(<ContactForm />);

      await submitFilled();

      expect(await screen.findByText(/no pudimos conectar/i)).toBeInTheDocument();
    });

    it('gives up on a request that never answers instead of sending forever', async () => {
      vi.useFakeTimers();
      try {
        // A request that never answers is the failure mode that strands a visitor in the
        // in-progress state, which is the one state they cannot get out of. The mock has to
        // honour the abort signal the way a real fetch does, otherwise the timeout can never
        // fire and this test would prove nothing.
        fetchMock.mockImplementation(
          (_url: string, init: RequestInit) =>
            new Promise((_resolve, reject) => {
              init.signal?.addEventListener('abort', () =>
                reject(new DOMException('The operation was aborted.', 'AbortError'))
              );
            })
        );
        render(<ContactForm />);

        await submitFilled();

        expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();

        await vi.advanceTimersByTimeAsync(10_000);

        // vi.waitFor rather than findBy: findBy schedules its own polling on the faked
        // timers, which never advance on their own.
        await vi.waitFor(() => {
          expect(screen.getByText(/tardó demasiado en responder/i)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /enviar/i })).toBeEnabled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('announces progress politely and failure assertively', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 });
      render(<ContactForm />);

      await submitFilled();

      // The success message is role=status, the failure role=alert. A single polite region
      // would let an error arrive while focus was elsewhere and go unheard.
      await screen.findByRole('alert');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('when the form is not configured', () => {
    it('replaces the form with an explanation instead of showing dead controls', () => {
      vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '');
      render(<ContactForm />);

      expect(screen.getByText(/no está disponible/i)).toBeInTheDocument();
      // A form the visitor can see but cannot use is worse than a short explanation: the
      // section above still offers the email address, GitHub and LinkedIn directly.
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /enviar/i })).not.toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('treats a blank key as absent rather than sending one', () => {
      vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '   ');
      render(<ContactForm />);

      expect(screen.getByText(/no está disponible/i)).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});