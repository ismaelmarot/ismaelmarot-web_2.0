import { describe, it, expect } from 'vitest';
import { validateContactForm } from '@/components/sections/ContactForm/validateContactForm';
import { CONTACT_FORM_LIMITS } from '@/types/contact';
import type { ContactFormValues } from '@/types/contact';

const valid: ContactFormValues = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hola, quiero colaborar contigo.',
  consent: true,
};

describe('validateContactForm', () => {
  it('accepts a complete form', () => {
    expect(validateContactForm(valid)).toEqual({});
  });

  it('reports every missing required field at once', () => {
    const errors = validateContactForm({ name: '', email: '', message: '', consent: false });

    expect(Object.keys(errors).sort()).toEqual(['consent', 'email', 'message', 'name']);
  });

  describe('name', () => {
    it('treats whitespace as empty', () => {
      expect(validateContactForm({ ...valid, name: '   ' }).name).toBeDefined();
    });

    it('rejects a name past the limit', () => {
      const tooLong = 'a'.repeat(CONTACT_FORM_LIMITS.name + 1);
      expect(validateContactForm({ ...valid, name: tooLong }).name).toBeDefined();
    });

    it('accepts a name exactly at the limit', () => {
      const exact = 'a'.repeat(CONTACT_FORM_LIMITS.name);
      expect(validateContactForm({ ...valid, name: exact }).name).toBeUndefined();
    });
  });

  describe('email', () => {
    it('rejects malformed addresses', () => {
      [
        'nombre@',
        '@example.com',
        'nombre',
        'nombre@ejemplo',
        'nombre con espacio@example.com',
        'nombre@ example.com',
        'nombre@@example.com',
      ].forEach((email) => {
        expect(validateContactForm({ ...valid, email }).email, email).toBeDefined();
      });
    });

    it('accepts the shapes people actually type', () => {
      [
        'ada@example.com',
        'ada.lovelace@example.co.uk',
        'ada+portfolio@example.com',
        'ada_99@sub.domain.example.org',
      ].forEach((email) => {
        expect(validateContactForm({ ...valid, email }).email, email).toBeUndefined();
      });
    });

    it('accepts surrounding whitespace and capitalisation', () => {
      // FR-005: these are common and legitimate, so rejecting them would push the visitor
      // to retype a correct address.
      expect(validateContactForm({ ...valid, email: '  Ada@Example.COM  ' }).email).toBeUndefined();
    });

    it('rejects an address past the limit', () => {
      const long = `${'a'.repeat(250)}@example.com`;
      expect(validateContactForm({ ...valid, email: long }).email).toBeDefined();
    });
  });

  describe('message', () => {
    it('treats whitespace as empty', () => {
      expect(validateContactForm({ ...valid, message: ' \n ' }).message).toBeDefined();
    });

    it('rejects a message past the limit', () => {
      const tooLong = 'a'.repeat(CONTACT_FORM_LIMITS.message + 1);
      expect(validateContactForm({ ...valid, message: tooLong }).message).toBeDefined();
    });
  });

  describe('consent', () => {
    it('is required', () => {
      expect(validateContactForm({ ...valid, consent: false }).consent).toBeDefined();
    });

    it('is reported on its own, not merged with the fields', () => {
      const errors = validateContactForm({ ...valid, consent: false });
      expect(errors.consent).toBeDefined();
      expect(errors.name).toBeUndefined();
    });
  });

  it('gives every problem its own message', () => {
    const errors = validateContactForm({ name: '', email: 'x', message: '', consent: false });

    // Four problems and four identical strings would point the visitor nowhere, which is the
    // failure this guards against.
    const messages = Object.values(errors);
    messages.forEach((message) => expect(message).toBeTruthy());
    expect(new Set(messages).size).toBe(messages.length);
  });

  it('does not mutate the values it receives', () => {
    const values = { ...valid, email: '  ada@example.com  ' };
    const snapshot = JSON.stringify(values);
    validateContactForm(values);
    expect(JSON.stringify(values)).toBe(snapshot);
  });
});