/**
 * SMTP and Email API Service for Portfolio Contact Form
 * Supports EmailJS, Web3Forms, Custom SMTP endpoints, and instant AJAX SMTP gateway.
 */

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SmtpSendResult {
  success: boolean;
  provider: 'emailjs' | 'web3forms' | 'custom-smtp' | 'shipmyform' | 'formsubmit';
  message: string;
  activationNeeded?: boolean;
}

const RECIPIENT_EMAIL = 'sivodayan18@gmail.com';

export function getMailtoFallbackUrl(payload: ContactMessagePayload): string {
  const { name, email, subject, message } = payload;
  const subjectLine = subject?.trim() || `Portfolio Contact from ${name.trim()}`;
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(
    `Hi Sivodayan,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
  )}`;
}

/**
 * Dispatches contact message through the best available SMTP / email API.
 */
export async function sendContactMessage(payload: ContactMessagePayload): Promise<SmtpSendResult> {
  const { name, email, subject, message } = payload;
  const subjectLine = subject?.trim() || `Portfolio Contact from ${name.trim()}`;

  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '603b1bde-ad42-4b56-91c0-3f8d5f1d2b00';
  const customSmtpEndpoint = import.meta.env.VITE_SMTP_API_ENDPOINT;

  // 1. Try Vercel Serverless Function (/api/contact) - delivers via Web3Forms without domain TLD blocks
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        name,
        email,
        subject: subjectLine,
        message,
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data && data.success) {
        return {
          success: true,
          provider: 'web3forms',
          message: 'Message delivered directly to your inbox!',
        };
      }
    }
  } catch (err) {
    console.warn('/api/contact endpoint unavailable, attempting direct providers:', err);
  }

  // 2. Try EmailJS (SMTP Server / Gmail Integration) if configured
  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            from_name: name,
            from_email: email,
            reply_to: email,
            subject: subjectLine,
            message: message,
            to_email: RECIPIENT_EMAIL,
          },
        }),
      });

      if (response.ok) {
        return {
          success: true,
          provider: 'emailjs',
          message: 'Message delivered via EmailJS SMTP service.',
        };
      }
    } catch (err) {
      console.warn('EmailJS SMTP dispatch failed, attempting next provider:', err);
    }
  }

  // 2. Try Web3Forms SMTP Gateway if access key is provided
  if (web3FormsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          access_key: web3FormsKey,
          name,
          email,
          replyto: email,
          subject: subjectLine,
          message,
          from_name: `${name} (via Sivodayan Portfolio)`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        return {
          success: true,
          provider: 'web3forms',
          message: 'Message delivered via Web3Forms SMTP gateway.',
        };
      }
    } catch (err) {
      console.warn('Web3Forms dispatch failed, attempting next provider:', err);
    }
  }

  // 3. Try Custom SMTP Endpoint if provided
  if (customSmtpEndpoint) {
    try {
      const response = await fetch(customSmtpEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({
          name,
          email,
          subject: subjectLine,
          message,
          to: RECIPIENT_EMAIL,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          provider: 'custom-smtp',
          message: 'Message delivered via Custom SMTP API.',
        };
      }
    } catch (err) {
      console.warn('Custom SMTP endpoint failed, attempting next provider:', err);
    }
  }

  // 4. Try ShipMyForm Instant SMTP Gateway (Fast sub-2s direct delivery)
  try {
    const response = await fetch(`https://shipmyform.com/to/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        name,
        email,
        subject: subjectLine,
        message,
      }),
    });

    const data = await response.json().catch(() => null);
    if (response.ok && data && (data.ok === true || data.success === true)) {
      return {
        success: true,
        provider: 'shipmyform',
        message: 'Message delivered directly to your inbox!',
      };
    }
  } catch (err) {
    console.warn('ShipMyForm instant gateway failed, attempting FormSubmit fallback:', err);
  }

  // 5. Direct AJAX SMTP Gateway (FormSubmit direct submission to recipient)
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        name,
        email,
        _subject: subjectLine,
        message,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = await response.json().catch(() => null);

    if (data && (data.success === 'true' || data.success === true)) {
      return {
        success: true,
        provider: 'formsubmit',
        message: 'Message delivered directly to your inbox!',
        activationNeeded: false,
      };
    }

    if (
      data &&
      typeof data.message === 'string' &&
      data.message.toLowerCase().includes('activation')
    ) {
      return {
        success: true,
        provider: 'formsubmit',
        message:
          "Activation email sent to sivodayan18@gmail.com. Please click the 'Activate Form' link in your inbox once to complete setup.",
        activationNeeded: true,
      };
    }

    if (data && data.message) {
      throw new Error(data.message);
    }
  } catch (err: any) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError' || (typeof err?.message === 'string' && err.message.toLowerCase().includes('timeout'))) {
      throw new Error('Connection timed out. Please check your network and try again.');
    }
    if (err?.message && !err.message.includes('fetch')) {
      throw err;
    }
    console.warn('FormSubmit direct gateway failed:', err);
  }

  throw new Error('Unable to transmit directly over the network. Please verify your connection or try again.');
}
