// src/services/email/email.service.ts

import nodemailer from "nodemailer";

import { passwordResetTemplate } from "./templates/password-reset";
import { welcomeTemplate } from "./templates/welcome";
import { emailVerificationTemplate } from "./templates/email-verification";
import { invitationTemplate } from "./templates/invitation";
import { passwordChangedTemplate } from "./templates/password-changed";
import { accountApprovedTemplate } from "./templates/account-approved";
import { moderationNotificationTemplate } from "./templates/moderation-notification";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export class EmailService {
  private readonly from =
  process.env.SMTP_FROM ?? "noreply@genealogia.local";

  private async send(
    to: string,
    subject: string,
    html: string
  ) {
    await transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }

  /**
   * Réinitialisation du mot de passe
   */
  async sendPasswordReset(
    email: string,
    resetLink: string
  ) {
    return this.send(
      email,
      "Réinitialisation du mot de passe",
      passwordResetTemplate(resetLink)
    );
  }

  /**
   * Vérification d'email
   */
  async sendEmailVerification(
    email: string,
    verificationLink: string
  ) {
    return this.send(
      email,
      "Vérification de votre adresse email",
      emailVerificationTemplate(verificationLink)
    );
  }

  /**
   * Bienvenue
   */
  async sendWelcome(
    email: string,
    firstName: string
  ) {
    return this.send(
      email,
      "Bienvenue sur Genealogia",
      welcomeTemplate(firstName)
    );
  }

  /**
   * Invitation familiale
   */
  async sendInvitation(
    email: string,
    inviterName: string,
    invitationLink: string
  ) {
    return this.send(
      email,
      "Invitation Genealogia",
      invitationTemplate(
        inviterName,
        invitationLink
      )
    );
  }

  /**
   * Confirmation de changement de mot de passe
   */
  async sendPasswordChanged(
    email: string
  ) {
    return this.send(
      email,
      "Mot de passe modifié",
      passwordChangedTemplate()
    );
  }

  /**
   * Compte validé par un administrateur
   */
  async sendAccountApproved(
    email: string
  ) {
    return this.send(
      email,
      "Compte validé",
      accountApprovedTemplate()
    );
  }

  /**
   * Notification de modération
   */
  async sendModerationNotification(
    email: string,
    actionDescription: string,
    moderationLink: string
  ) {
    return this.send(
      email,
      "Nouvelle demande de modération",
      moderationNotificationTemplate(
        actionDescription,
        moderationLink
      )
    );
  }
}

export const emailService = new EmailService();