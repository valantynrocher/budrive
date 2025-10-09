import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;

  async onModuleInit(): Promise<void> {
    try {
      if (process.env.NODE_ENV === "production") {
        this.transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT) || 587,
          secure: Number(process.env.MAIL_PORT) === 465,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
        this.logger.debug("Mail transporter configured for production");
      } else {
        const account: nodemailer.TestAccount =
          await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
        this.logger.debug(
          "Mail transporter configured with Ethereal test account",
        );
      }
    } catch (err: unknown) {
      this.logger.error(
        "Failed to initialize MailService",
        err instanceof Error ? err.stack : String(err),
      );
      // selon ton choix : tu peux rethrow pour faire échouer le bootstrap
      // throw err;
    }
  }

  async sendEmailConfirmation(
    email: string,
    token: string,
  ): Promise<nodemailer.SentMessageInfo> {
    if (!this.transporter) {
      throw new Error("Mail transporter is not initialized");
    }

    const frontendUrl = process.env.FRONTEND_URL ?? "https://localhost:3000";
    const link = `${frontendUrl}/auth/confirm?token=${encodeURIComponent(token)}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: "'Budrive' <valentinrocher+budrive@gmail.com>",
      to: email,
      subject: "[Budrive] Confirmez votre compte",
      html: `<p>Merci de vous inscrire sur Budrive !</p>
             <p>Cliquez sur ce lien pour activer votre compte :</p>
             <a href="${link}">${link}</a>`,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await this.transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.debug(`Preview URL: ${previewUrl}`);
      }
    }

    return info;
  }

  async sendPasswordReset(email: string, token: string) {
    if (!this.transporter) {
      throw new Error("Mail transporter is not initialized");
    }

    const frontendUrl = process.env.FRONTEND_URL ?? "https://localhost:3000";
    const link = `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: "'Budrive' <valentinrocher+budrive@gmail.com>",
      to: email,
      subject: "[Budrive] Réinitialisez votre mot de passe",
      html: `<p>Vous avez demandé à réinitialiser votre mot de passe Budrive !</p>
             <p>Cliquez sur ce lien pour activer votre compte :</p>
             <a href="${link}">${link}</a>
             <p>Si vous n'êtes pas à l'origine de cette demande, merci d'ignorer cet e-mail.</p>`,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await this.transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.debug(`Preview URL: ${previewUrl}`);
      }
    }

    return info;
  }
}
