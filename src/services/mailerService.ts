import nodemailer from "nodemailer";
import { Readable } from "stream";
import { APP_CONFIG } from "../config/appConfig";

export interface Attachment {
  filename?: string;
  path?: string; // path to file
  content?: string | Buffer | Readable; // direct content
  encoding?: "base64" | "utf-8"; // if content is string
  contentType?: string; // MIME type
  cid?: string; // for inline images
}

export interface MailOptions {
  from: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export const transporter = nodemailer.createTransport({
  host: APP_CONFIG.mailer.host, // e.g. "smtp.gmail.com"
  port: APP_CONFIG.mailer.port,
  secure: APP_CONFIG.mailer.port === 465, // true for 465, false for 587
  auth: {
    user: APP_CONFIG.mailer.username,
    pass: APP_CONFIG.mailer.password,
  },
});
