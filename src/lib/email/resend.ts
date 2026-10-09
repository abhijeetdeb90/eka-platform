import { Resend } from "resend";

// ==============================================================================
// EKA TRANSACTIONAL EMAIL SERVICE — RESEND INTEGRATION
// ==============================================================================
// Provides transactional email delivery for:
// 1. Welcome and onboarding emails
// 2. Email verification & authentication
// 3. Creator subscription receipts & financial invoices
// 4. Cultural reflection & community notifications
// 5. Security & suspicious session alerts
//
// Delivery tracking and bounce handling via Resend webhooks.
// ==============================================================================

const RESEND_API_KEY = process.env["RESEND_API_KEY"] || "";
const RESEND_FROM_EMAIL =
  process.env["RESEND_FROM_EMAIL"] || "EKA Cultural Commons <no-reply@eka.earth>";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) return resendClient;
  if (!RESEND_API_KEY) {
    return null;
  }
  resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devMode?: boolean;
}

/**
 * Editorial HTML Email Shell with EKA Calm Editorial Aesthetic
 */
function wrapEkaEmailTemplate(contentHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D2825;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 40px auto;
      background-color: #FFFFFF;
      border: 1px solid #EAE3DA;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #2D2825;
      padding: 32px 36px;
      text-align: center;
    }
    .logo-mark {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #FAF8F5;
      margin: 0;
      text-transform: uppercase;
    }
    .sub-brand {
      color: #D4A373;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-top: 6px;
    }
    .body {
      padding: 40px 36px;
      line-height: 1.65;
      font-size: 15px;
    }
    h1, h2 {
      font-family: Georgia, serif;
      color: #1A1615;
      font-weight: 600;
    }
    .btn {
      display: inline-block;
      background-color: #A34828;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.02em;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .receipt-box {
      background-color: #F8F5F0;
      border: 1px solid #EAE3DA;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      border-bottom: 1px dashed #DDD4C8;
    }
    .receipt-row:last-child {
      border-bottom: none;
      font-weight: bold;
    }
    .footer {
      background-color: #FAF8F5;
      border-top: 1px solid #EAE3DA;
      padding: 24px 36px;
      text-align: center;
      font-size: 12px;
      color: #7A726C;
      line-height: 1.5;
    }
    .footer a {
      color: #A34828;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="logo-mark">EKA</h1>
      <div class="sub-brand">Cultural Commons & Sacred Wisdom</div>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>EKA — A trusted digital ecosystem preserving and celebrating civilizational wisdom.</p>
      <p>India DPDP Act (2023) Compliant · <a href="https://eka.earth/privacy">Privacy Policy</a> · <a href="https://eka.earth/terms">Terms of Service</a></p>
      <p>Bengaluru, Karnataka, India</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Send Welcome Email
 */
export async function sendWelcomeEmail(params: {
  email: string;
  name?: string;
}): Promise<SendEmailResult> {
  const client = getResendClient();
  const userName = params.name || "Explorer";

  const html = wrapEkaEmailTemplate(
    `
    <h2>Welcome to EKA, ${userName}</h2>
    <p>We are delighted to welcome you to the EKA cultural sanctuary — a living archive and digital commons dedicated to civilizational memory, sacred heritage, and cross-cultural understanding.</p>
    <p>Here is what you can discover:</p>
    <ul>
      <li><strong>Sacred Knowledge Objects:</strong> Verified, non-doctrinal explorations of living cultural traditions.</li>
      <li><strong>Ask EKA:</strong> An AI companion grounded in canonical primary scriptures, zero miracles, and deep citations.</li>
      <li><strong>Stories & Visual Reels:</strong> Rich cultural narratives produced by authentic traditional custodians and scholars.</li>
    </ul>
    <div style="text-align: center;">
      <a href="https://eka.earth/discover" class="btn">Explore Cultural Knowledge</a>
    </div>
    <p style="color: #7A726C; font-size: 13px; margin-top: 30px;">May your journey across our shared human heritage bring wisdom, calm, and clarity.</p>
    `,
    "Welcome to EKA",
  );

  if (!client) {
    console.info(`[Resend DEV] Welcome email simulated for ${params.email}`);
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.email,
      subject: "Welcome to EKA — The Cultural Commons",
      html,
    });

    if (error) {
      console.error("[Resend Error] sendWelcomeEmail failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("[Resend Exception] sendWelcomeEmail:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * 2. Send Verification / Magic Link Email
 */
export async function sendVerificationEmail(params: {
  email: string;
  name?: string;
  verificationUrl: string;
}): Promise<SendEmailResult> {
  const client = getResendClient();
  const userName = params.name || "Traveler";

  const html = wrapEkaEmailTemplate(
    `
    <h2>Confirm your EKA account</h2>
    <p>Greetings ${userName},</p>
    <p>Please click the button below to verify your email address and secure your access to EKA.</p>
    <div style="text-align: center;">
      <a href="${params.verificationUrl}" class="btn">Verify Email Address</a>
    </div>
    <p style="font-size: 13px; color: #7A726C;">This link will expire in 24 hours. If you did not request this verification, you can safely disregard this email.</p>
    <p style="font-size: 11px; word-break: break-all; color: #9E968F;">Or copy and paste this link into your browser: <br>${params.verificationUrl}</p>
    `,
    "Verify your EKA Account",
  );

  if (!client) {
    console.info(`[Resend DEV] Verification email simulated for ${params.email}: ${params.verificationUrl}`);
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.email,
      subject: "Verify your EKA account",
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * 3. Send Creator Subscription Receipt / Invoice Email
 */
export async function sendSubscriptionReceiptEmail(params: {
  email: string;
  name?: string;
  creatorName: string;
  planName: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  date: string;
}): Promise<SendEmailResult> {
  const client = getResendClient();
  const userName = params.name || "Patron";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: params.currency || "INR",
  }).format(params.amount);

  const html = wrapEkaEmailTemplate(
    `
    <h2>Subscription Receipt: ${params.creatorName}</h2>
    <p>Thank you, ${userName}. Your contribution directly supports the preservation and celebration of verified cultural traditions.</p>
    
    <div class="receipt-box">
      <div style="font-size: 13px; color: #7A726C; margin-bottom: 12px; font-weight: bold;">INVOICE #${params.invoiceNumber}</div>
      <div class="receipt-row">
        <span>Cultural Creator</span>
        <span>${params.creatorName}</span>
      </div>
      <div class="receipt-row">
        <span>Tier / Plan</span>
        <span>${params.planName}</span>
      </div>
      <div class="receipt-row">
        <span>Date</span>
        <span>${params.date}</span>
      </div>
      <div class="receipt-row">
        <span>Total Paid</span>
        <span>${formattedAmount}</span>
      </div>
    </div>

    <p style="font-size: 13px; color: #7A726C;">85% of this subscription goes directly to the verified cultural creator and lineage keeper.</p>
    <div style="text-align: center;">
      <a href="https://eka.earth/creator-hub" class="btn">View Subscriptions</a>
    </div>
    `,
    `EKA Receipt - ${params.invoiceNumber}`,
  );

  if (!client) {
    console.info(`[Resend DEV] Subscription receipt simulated for ${params.email} (${params.invoiceNumber})`);
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.email,
      subject: `EKA Payment Receipt: Supporting ${params.creatorName}`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * 4. Send Security / Session Alert Email
 */
export async function sendSecurityAlertEmail(params: {
  email: string;
  name?: string;
  eventType: string;
  ipAddress?: string;
  location?: string;
  timestamp: string;
}): Promise<SendEmailResult> {
  const client = getResendClient();
  const userName = params.name || "Member";

  const html = wrapEkaEmailTemplate(
    `
    <h2>Security Notification: ${params.eventType}</h2>
    <p>Hello ${userName},</p>
    <p>We noticed a security event on your EKA account:</p>
    <div class="receipt-box">
      <div class="receipt-row">
        <span>Event</span>
        <span>${params.eventType}</span>
      </div>
      <div class="receipt-row">
        <span>Time</span>
        <span>${params.timestamp}</span>
      </div>
      ${params.ipAddress ? `<div class="receipt-row"><span>IP Address</span><span>${params.ipAddress}</span></div>` : ""}
      ${params.location ? `<div class="receipt-row"><span>Estimated Location</span><span>${params.location}</span></div>` : ""}
    </div>
    <p>If you authorized this activity, no further action is necessary.</p>
    <p style="color: #A34828; font-weight: bold;">If you did not initiate this, please secure your account immediately by resetting your password.</p>
    <div style="text-align: center;">
      <a href="https://eka.earth/auth?mode=reset" class="btn">Review Account Security</a>
    </div>
    `,
    "Security Alert — EKA",
  );

  if (!client) {
    console.info(`[Resend DEV] Security alert simulated for ${params.email}: ${params.eventType}`);
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.email,
      subject: `[Security Notice] ${params.eventType} detected on your EKA account`,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
