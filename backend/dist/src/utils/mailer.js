import nodemailer from 'nodemailer';
import { env } from "../config/env";
export const mailer = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});
export async function sendMail(to, subject, html) {
    try {
        await mailer.sendMail({ from: env.EMAIL_FROM, to, subject, html });
    }
    catch (err) {
        console.error("Mail send failed:", err);
    }
}
