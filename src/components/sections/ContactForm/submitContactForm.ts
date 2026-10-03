import type { ContactFormValues } from '@/types/contact';

/**
 * The one place that knows a delivery provider exists.
 *
 * Everything above this line works in terms of a result, so swapping provider, or moving
 * to a different static-site relay, is a change to this file alone.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 10_000;

export interface SubmitContactInput {
  values: ContactFormValues;
  accessKey: string;
  signal: AbortSignal;
}

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; reason: 'network' | 'timeout' | 'rejected' | 'provider'; message: string };

/**
 * Visitor-facing copy. Written here rather than at the call site so a failure can never
 * leak a status code, an endpoint, or a field name the provider chose.
 *
 * The network message deliberately does not tell the visitor to check their connection.
 * A rejected fetch cannot tell us whether the visitor is offline, the provider is down, or
 * the provider is refusing us at the network layer, because all three arrive as the same
 * TypeError. Blaming their connection would send someone to reboot a router that is fine,
 * while the form is the thing actually broken.
 */
const MESSAGES = {
  network: 'No pudimos conectar con el servicio de correo. Inténtalo de nuevo en unos minutos.',
  timeout: 'El servicio tardó demasiado en responder. Inténtalo de nuevo en un momento.',
  rejected: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
  provider: 'No se pudo enviar el mensaje. Inténtalo más tarde o escríbeme directamente por correo.',
} as const;

/**
 * Submits one message. Never rejects: a throw during teardown is how a form gets stuck
 * showing progress forever, so every outcome, including a thrown abort, becomes a result.
 */
export async function submitContactForm({
  values,
  accessKey,
  signal,
}: SubmitContactInput): Promise<SubmitContactResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort('timeout'), TIMEOUT_MS);
  const onExternalAbort = () => controller.abort('cancelled');
  signal.addEventListener('abort', onExternalAbort, { once: true });

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: values.name,
        email: values.email,
        message: values.message,
        // The provider's own honeypot. A bot that fills a field nobody can see is a bot.
        botcheck: '',
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // The provider's reason is deliberately not forwarded: it is written for site
      // owners, not for visitors.
      return {
        ok: false,
        reason: response.status === 400 ? 'rejected' : 'provider',
        message: response.status === 400 ? MESSAGES.rejected : MESSAGES.provider,
      };
    }

    return { ok: true };
  } catch {
    // An abort reaches here too, and the reason depends on which controller fired.
    const timedOut = controller.signal.aborted && controller.signal.reason === 'timeout';
    if (signal.aborted) {
      // The caller cancelled, for instance because the form unmounted. Not a failure worth
      // showing, but the contract has no third option, so it reports as a network failure.
      return { ok: false, reason: 'network', message: MESSAGES.network };
    }
    return {
      ok: false,
      reason: timedOut ? 'timeout' : 'network',
      message: timedOut ? MESSAGES.timeout : MESSAGES.network,
    };
  } finally {
    clearTimeout(timeoutId);
    signal.removeEventListener('abort', onExternalAbort);
  }
}