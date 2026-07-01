import { emailLayout } from "./layout";

export function invitationTemplate(
  inviterName: string,
  invitationLink: string
): string {
  return emailLayout(
    "Invitation Genealogia",
    `
      <h2 style="margin-top:0;">
        Vous avez reçu une invitation
      </h2>

      <p>
        ${inviterName} vous invite à rejoindre Genealogia.
      </p>

      <p>
        Cliquez sur le bouton ci-dessous pour créer votre compte.
      </p>

      <p style="text-align:center;margin:32px 0;">
        <a
          href="${invitationLink}"
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
          Accepter l'invitation
        </a>
      </p>
    `
  );
}