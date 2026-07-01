// src/services/email/templates/password-reset.ts

import { emailLayout } from "./layout";

export function passwordResetTemplate(
  resetLink: string
): string {
  return emailLayout(
    "Réinitialisation du mot de passe",
    `
      <h2 style="margin-top:0;color:#292524;">
        Réinitialisation du mot de passe
      </h2>

      <p style="color:#57534e;line-height:1.6;">
        Vous avez demandé la réinitialisation de votre mot de passe.
      </p>

      <p style="text-align:center;margin:32px 0;">
        <a
          href="${resetLink}"
          style="
            background:#d97706;
            color:white;
            text-decoration:none;
            padding:12px 24px;
            border-radius:8px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Réinitialiser mon mot de passe
        </a>
      </p>

      <p style="color:#78716c;font-size:14px;">
        Si vous n'êtes pas à l'origine de cette demande,
        vous pouvez ignorer cet email.
      </p>
    `
  );
}