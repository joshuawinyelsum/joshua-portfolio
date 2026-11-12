import type { ChangeEventHandler } from 'react';

interface FieldBaseProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

interface TextFieldProps extends FieldBaseProps {
  type?: 'text' | 'email';
  autoComplete?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

/** Single-line input. Label above, rounded-rectangle control, inline error. */
export function TextField({
  id,
  name,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  type = 'text',
  autoComplete,
  onChange,
}: TextFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        onChange={onChange}
        className="field__control"
      />
      {error && (
        <p id={messageId} className="field__message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps extends FieldBaseProps {
  rows?: number;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

/** Multi-line input sharing the same control styling as TextField. */
export function TextAreaField({
  id,
  name,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 5,
  onChange,
}: TextAreaFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        onChange={onChange}
        className="field__control"
      />
      {error && (
        <p id={messageId} className="field__message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
