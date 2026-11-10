import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { contactInfo } from '../../data/social';
import { Button } from '../ui/Button';
import { TextAreaField, TextField } from '../ui/FormField';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = { name: '', email: '', subject: '', message: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(values.email.trim())) errors.email = 'That email address does not look right.';
  if (!values.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

/**
 * One plain contact form: four labelled fields and the signature button.
 *
 * The site has no backend, so submitting hands the message to the visitor's
 * own email app as a pre-filled draft addressed to Joshua. Nothing is sent
 * to or stored by this site.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [handedOff, setHandedOff] = useState(false);

  const update =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
      if (handedOff) setHandedOff(false);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setHandedOff(false);
      return;
    }

    const subject = values.subject.trim() || `Portfolio enquiry from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Send a message" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          name="name"
          label="Name"
          autoComplete="name"
          required
          value={values.name}
          error={errors.name}
          onChange={update('name')}
        />
        <TextField
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
          value={values.email}
          error={errors.email}
          onChange={update('email')}
        />
      </div>
      <TextField
        id="contact-subject"
        name="subject"
        label="Subject"
        value={values.subject}
        error={errors.subject}
        onChange={update('subject')}
      />
      <TextAreaField
        id="contact-message"
        name="message"
        label="Message"
        required
        value={values.message}
        error={errors.message}
        onChange={update('message')}
      />

      <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:gap-6">
        <Button type="submit" size="lg" icon="arrow" className="w-full shrink-0 sm:w-auto">
          Send Message
        </Button>
        {!handedOff && (
          <p className="text-small text-ink-muted">
            Opens a ready-to-send draft in your email app. Nothing is stored on this site.
          </p>
        )}
      </div>

      {handedOff && (
        <p className="notice" role="status">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
          <span>
            Your email app should now be open with the message ready to send. If nothing happened, write to{' '}
            <a href={`mailto:${contactInfo.email}`} className="font-semibold text-accent">
              {contactInfo.email}
            </a>
            .
          </span>
        </p>
      )}
    </form>
  );
}
