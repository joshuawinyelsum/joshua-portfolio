import type { IncomingMessage, ServerResponse } from 'http';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
  _startTime?: number; // bot submission speed detection
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

// In-memory rate limiting map: ip -> { count, resetTime }
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000).unref?.();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetInSec: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetInSec = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetInSec };
  }

  record.count += 1;
  const resetInSec = Math.ceil((record.resetTime - now) / 1000);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetInSec };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateContactPayload(payload: any): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: { form: 'Invalid submission data.' },
      sanitized: { name: '', email: '', subject: '', message: '' },
    };
  }

  const rawName = typeof payload.name === 'string' ? payload.name.trim() : '';
  const rawEmail = typeof payload.email === 'string' ? payload.email.trim() : '';
  const rawSubject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  const rawMessage = typeof payload.message === 'string' ? payload.message.trim() : '';

  // Name validation
  if (!rawName) {
    errors.name = 'Please enter your name.';
  } else if (rawName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (rawName.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  // Email validation
  if (!rawEmail) {
    errors.email = 'Please enter your email address.';
  } else if (rawEmail.length > 254) {
    errors.email = 'Email address is too long.';
  } else if (!EMAIL_REGEX.test(rawEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Subject validation (optional, default will be assigned if empty)
  if (rawSubject.length > 200) {
    errors.subject = 'Subject must be 200 characters or fewer.';
  }

  // Message validation
  if (!rawMessage) {
    errors.message = 'Please enter a message.';
  } else if (rawMessage.length < 5) {
    errors.message = 'Message must be at least 5 characters.';
  } else if (rawMessage.length > 5000) {
    errors.message = 'Message must be 5000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name: rawName,
      email: rawEmail,
      subject: rawSubject || `Portfolio enquiry from ${rawName}`,
      message: rawMessage,
    },
  };
}

/**
 * Sends transactional email via Resend REST API.
 */
async function sendViaResend(options: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from,
        to: [options.to],
        reply_to: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || data?.error?.message || `Resend API returned status ${res.status}`;
      return { ok: false, error: errorMsg };
    }

    return { ok: true, id: data?.id };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error communicating with email provider.' };
  }
}

/**
 * Universal request body parser for Node HTTP and Vercel environments.
 */
async function parseRequestBody(req: IncomingMessage & { body?: any }): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100 * 1024) { // 100 KB limit
        req.destroy();
        resolve(null);
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function sendJson(res: ServerResponse & { status?: (code: number) => any; json?: (data: any) => any }, statusCode: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(data);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

/**
 * Primary HTTP handler for contact form submissions.
 */
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse & { status?: any; json?: any }) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  // 2. Extract Client IP for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim() 
    : (req.socket?.remoteAddress || '127.0.0.1');

  // 3. Check Rate Limit
  const rateLimit = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.resetInSec.toString());
    return sendJson(res, 429, {
      success: false,
      error: `Too many submissions. Please wait ${Math.ceil(rateLimit.resetInSec / 60)} minutes before trying again.`,
    });
  }

  // 4. Parse JSON body
  const body = await parseRequestBody(req);
  if (!body) {
    return sendJson(res, 400, { success: false, error: 'Invalid or missing JSON payload in request.' });
  }

  // 5. Spam Bot Honeypot Check
  // Hidden website field should remain empty
  if (body.website && String(body.website).trim().length > 0) {
    // Silently reject bot submission without notifying bot
    return sendJson(res, 400, { success: false, error: 'Automated submission rejected.' });
  }

  // Timing check: if form was submitted unnaturally fast (< 1.2s), flag as bot
  if (body._startTime && typeof body._startTime === 'number') {
    const elapsedMs = Date.now() - body._startTime;
    if (elapsedMs > 0 && elapsedMs < 1200) {
      return sendJson(res, 400, { success: false, error: 'Form submitted too rapidly.' });
    }
  }

  // 6. Validate fields
  const validation = validateContactPayload(body);
  if (!validation.isValid) {
    return sendJson(res, 400, {
      success: false,
      error: 'Please correct the errors in the form.',
      errors: validation.errors,
    });
  }

  const { name, email, subject, message } = validation.sanitized;

  // 7. Verify email provider configuration
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const recipientEmail = process.env.CONTACT_TO_EMAIL?.trim() || 'akumjoshuawin@gmail.com';
  // Resend requires a verified sender or onboarding@resend.dev for testing
  const senderEmail = process.env.CONTACT_FROM_EMAIL?.trim() || 'Portfolio Contact <onboarding@resend.dev>';

  if (!resendApiKey) {
    console.error('[Contact API] Missing RESEND_API_KEY in environment variables.');
    return sendJson(res, 503, {
      success: false,
      error: 'Email delivery service is not configured. Server administrator must set RESEND_API_KEY.',
      code: 'MISSING_API_KEY',
    });
  }

  // 8. Construct safe, branded email content
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSubject = escapeHtml(subject);
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const timestamp = new Date().toUTCString();

  const textBody = [
    `New portfolio contact inquiry:`,
    `----------------------------------------`,
    `From:    ${name} <${email}>`,
    `Subject: ${subject}`,
    `Date:    ${timestamp}`,
    `----------------------------------------`,
    ``,
    message,
    ``,
    `----------------------------------------`,
    `Reply directly to this email to respond to ${name} (${email}).`,
  ].join('\n');

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapedSubject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; color: #050507; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid rgba(5,5,7,0.08); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <div style="background-color: #050507; color: #FFFFFF; padding: 20px 24px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Joshua Winyelsum Portfolio</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #9B7BF7; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace;">New Contact Submission</p>
    </div>
    
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #646468; width: 80px; font-weight: 600;">From:</td>
          <td style="padding: 6px 0; color: #050507; font-weight: 600;">${escapedName} &lt;<a href="mailto:${escapedEmail}" style="color: #9B7BF7; text-decoration: none;">${escapedEmail}</a>&gt;</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #646468; font-weight: 600;">Subject:</td>
          <td style="padding: 6px 0; color: #050507;">${escapedSubject}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #646468; font-weight: 600;">Date:</td>
          <td style="padding: 6px 0; color: #646468; font-family: monospace; font-size: 11px;">${timestamp}</td>
        </tr>
      </table>

      <div style="background-color: #FAF9F5; border-left: 3px solid #9B7BF7; padding: 16px 20px; border-radius: 4px; margin: 20px 0; line-height: 1.6; font-size: 14px; color: #050507;">
        ${escapedMessage}
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(5,5,7,0.08); font-size: 12px; color: #646468;">
        <p style="margin: 0;">Hit <strong>Reply</strong> in your mail client to answer ${escapedName} directly at <code>${escapedEmail}</code>.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // 9. Dispatch to Resend
  const deliveryResult = await sendViaResend({
    apiKey: resendApiKey,
    from: senderEmail,
    to: recipientEmail,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    text: textBody,
    html: htmlBody,
  });

  if (!deliveryResult.ok) {
    console.error('[Contact API] Resend email delivery failed:', deliveryResult.error);
    return sendJson(res, 502, {
      success: false,
      error: `Failed to deliver message via email provider: ${deliveryResult.error}`,
      code: 'DELIVERY_FAILED',
    });
  }

  // 10. Success Response
  return sendJson(res, 200, {
    success: true,
    message: "Message sent successfully. Thank you for reaching out. I'll get back to you soon.",
    deliveryId: deliveryResult.id,
  });
}
