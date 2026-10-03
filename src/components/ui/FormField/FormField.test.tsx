import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getCssForElement } from '@/test-utils/css';
import { FormField } from './FormField';

const renderField = (props: Partial<React.ComponentProps<typeof FormField>> = {}) => {
  const label = props.label ?? 'Nombre';
  const id = props.id ?? 'field';
  return render(
    <FormField label={label} id={id} {...props}>
      {(control) => <input type="text" data-testid="control" {...control} />}
    </FormField>
  );
};

describe('FormField', () => {
  it('associates the label with the control', () => {
    renderField({ label: 'Nombre', id: 'nombre' });
    expect(screen.getByLabelText('Nombre')).toBe(screen.getByTestId('control'));
  });

  it('marks the control as invalid and points it at the message when it has an error', () => {
    renderField({ id: 'email', label: 'Email', error: 'Introduce un email válido' });

    const control = screen.getByTestId('control');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByText('Introduce un email válido')).toHaveAttribute('id', 'email-error');
  });

  it('leaves aria-invalid unset when there is no error', () => {
    renderField();
    // Setting it to false would make assistive technology announce a field as invalid when
    // it is perfectly valid.
    expect(screen.getByTestId('control')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByTestId('control')).not.toHaveAttribute('aria-describedby');
  });

  it('points at the hint while there is no error', () => {
    renderField({ id: 'nombre', hint: 'Máximo 100 caracteres' });
    expect(screen.getByTestId('control')).toHaveAttribute('aria-describedby', 'nombre-hint');
  });

  it('replaces the hint with the error rather than showing both', () => {
    renderField({ id: 'nombre', hint: 'Máximo 100 caracteres', error: 'El nombre es obligatorio' });

    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(screen.queryByText('Máximo 100 caracteres')).not.toBeInTheDocument();
    expect(screen.getByTestId('control')).toHaveAttribute('aria-describedby', 'nombre-error');
  });

  it('marks a required field visually', () => {
    renderField({ required: true });
    // The asterisk is decoration: the control is already announced as required through the
    // label text the caller supplies, so it must not be announced twice.
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('colours the error with the token that clears AA on both backgrounds', () => {
    renderField({ error: 'Error' });
    // Asserted on the emitted rule text: jsdom cannot compute a colour that comes from a
    // custom property, and this is the assertion that keeps the contrast work honest.
    expect(getCssForElement(screen.getByText('Error'))).toContain(
      'color: var(--color-text-danger)'
    );
  });
});