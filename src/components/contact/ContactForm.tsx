import type { ChangeEvent, FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { CircleCheck, AlertCircle, Loader2 } from 'lucide-react';
import { contactInfo } from '../../data/social';
import { Button } from '../ui/Button';
import { TextAreaField, TextField } from '../ui/FormField';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues | 'form', string>>;
type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

const emptyForm: FormValues = { name: '', email: '', subject: '', message: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'That email address does not look right.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please write a message.';
  } else if (values.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters.';
  }

  return errors;
}

/**
 * Direct delivery contact form. Submits directly to the server-side
 * API endpoint (/api/contact) which delivers the message to Joshua's inbox
 * via transactional email (Resend) with Reply-To set to the visitor's email.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  
  // Track mount time for bot submission speed detection
  const startTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const update =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: undefined }));
      }
      if (status === 'error') {
        setStatus('idle');
        setErrorMessage('');
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (status === 'sending') return;

    // Client-side validation
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          website: honeypot, // Spam honeypot
          _startTime: startTimeRef.current,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setStatus('success');
        setValues(emptyForm);
        setErrors({});
        setErrorMessage('');
      } else {
        setStatus('error');
        if (data?.errors) {
          setErrors(data.errors);
        }
        setErrorMessage(
          data?.error || 'Unable to deliver message at this time. Please try again or reach out directly.'
        );
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        'A network connection error occurred while submitting. Please check your connection and try again.'
      );
    }
  };

  const handleSendAnother = () => {
    setStatus('idle');
    setValues(emptyForm);
    setErrors({});
    setErrorMessage('');
    startTimeRef.current = Date.now();
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Send a message" className="space-y-5">
      {/* Hidden honeypot field for spam bots */}
      <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="contact-company-hp">Company (leave blank)</label>
        <input
          id="contact-company-hp"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          name="name"
          label="Name"
          autoComplete="name"
          required
          disabled={status === 'sending'}
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
          disabled={status === 'sending'}
          value={values.email}
          error={errors.email}
          onChange={update('email')}
        />
      </div>

      <TextField
        id="contact-subject"
        name="subject"
        label="Subject"
        disabled={status === 'sending'}
        value={values.subject}
        error={errors.subject}
        onChange={update('subject')}
      />

      <TextAreaField
        id="contact-message"
        name="message"
        label="Message"
        required
        disabled={status === 'sending'}
        value={values.message}
        error={errors.message}
        onChange={update('message')}
      />

      <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:gap-6">
        <Button
          type="submit"
          size="lg"
          icon={status === 'sending' ? 'none' : 'arrow'}
          disabled={status === 'sending'}
          leading={
            status === 'sending' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" aria-hidden="true" />
            ) : undefined
          }
          className="w-full shrink-0 sm:w-auto"
        >
          {status === 'sending' ? 'Sending Message...' : 'Send Message'}
        </Button>

        {status !== 'success' && (
          <p className="text-small text-ink-muted">
            Delivered directly to my inbox. No external mail application needed.
          </p>
        )}
      </div>

      {/* Success Notification */}
      {status === 'success' && (
        <div
          className="rounded-xl border border-accent/25 bg-accent/5 p-4 sm:p-5 transition-all"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <CircleCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-semibold text-small text-ink">
                Message sent successfully. Thank you for reaching out. I'll get back to you soon.
              </p>
              <p className="text-caption text-ink-muted">
                Your message has been delivered directly to{' '}
                <span className="font-mono text-ink-soft">{contactInfo.email}</span>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendAnother}
                  className="font-mono text-xs font-semibold text-accent underline underline-offset-4 hover:text-ink transition-colors"
                >
                  Send another message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {status === 'error' && (
        <div
          className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 sm:p-5 text-red-700 dark:text-red-400 transition-all"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              strokeWidth={2}
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-semibold text-small">
                {errorMessage}
              </p>
              <p className="text-caption text-ink-muted">
                Your entered message has been preserved above. You can also contact Joshua directly at{' '}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="font-semibold text-accent underline underline-offset-2 hover:text-ink"
                >
                  {contactInfo.email}
                </a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
