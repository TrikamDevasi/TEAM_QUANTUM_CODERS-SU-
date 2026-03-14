import { Resend } from 'resend';
import logger from '../utils/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@skillsense.ai';
const DEMO_RECIPIENT = process.env.DEMO_RECIPIENT_EMAIL || 'demo@skillsense.ai';

export const sendDemoRequest = async (to: string, name: string, org: string): Promise<void> => {
  try {
    // Confirmation email to requester
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Demo Request Received — SkillSense AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1a73e8, #0d47a1); padding: 40px 32px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; }
            .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
            .body { padding: 36px 32px; color: #333333; line-height: 1.7; }
            .body h2 { color: #1a73e8; font-size: 20px; margin-top: 0; }
            .highlight { background: #f0f7ff; border-left: 4px solid #1a73e8; padding: 12px 16px;
              border-radius: 0 8px 8px 0; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px 32px; text-align: center;
              font-size: 12px; color: #888; border-top: 1px solid #eee; }
            .btn { display: inline-block; background: #1a73e8; color: #fff; text-decoration: none;
              padding: 12px 28px; border-radius: 6px; font-weight: 600; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SkillSense AI</h1>
              <p>Empowering India's Workforce Through Intelligence</p>
            </div>
            <div class="body">
              <h2>Hi ${name}, your demo request is confirmed!</h2>
              <p>Thank you for your interest in <strong>SkillSense AI</strong>. We've received your demo request
                on behalf of <strong>${org}</strong> and our team will reach out within 1-2 business days.</p>
              <div class="highlight">
                <strong>What to expect:</strong><br/>
                A personalised walkthrough of our platform, tailored to your institution's or organisation's goals —
                including live skill gap analysis, placement intelligence, and NSQF-aligned assessments.
              </div>
              <p>In the meantime, feel free to explore our capabilities or reach out to
                <a href="mailto:${DEMO_RECIPIENT}">${DEMO_RECIPIENT}</a> with any questions.</p>
              <a href="https://skillsense.ai" class="btn">Visit SkillSense AI</a>
            </div>
            <div class="footer">
              © 2025 SkillSense AI · All rights reserved<br/>
              You received this email because you submitted a demo request at skillsense.ai.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Internal notification to demo team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: DEMO_RECIPIENT,
      subject: `[New Demo Request] ${name} from ${org}`,
      html: `
        <p><strong>New demo request received:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${to}</li>
          <li><strong>Organisation:</strong> ${org}</li>
        </ul>
        <p>Please follow up within 1-2 business days.</p>
      `,
    });

    logger.info(`Demo request emails sent for ${name} <${to}> from ${org}`);
  } catch (err) {
    logger.error('Failed to send demo request email:', err);
    throw err;
  }
};
