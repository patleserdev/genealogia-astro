import { emailLayout } from "./layout";

export function emailVerificationTemplate(
  verificationLink: string
): string {
  return emailLayout(
    "Vérification de votre adresse email",
    `
      <h2 style="margin-top:0;">Bienvenue sur Genealogia</h2>

      <p>
        Merci pour votre inscription.
      </p>

      <p>
        Veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
      </p>

      <p style="text-align:center;margin:32px 0;">
        <a
          href="${verificationLink}"
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
          Vérifier mon adresse email
        </a>
      </p>
    `
  );
}