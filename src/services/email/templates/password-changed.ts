import { emailLayout } from "./layout";

export function passwordChangedTemplate(): string {
  return emailLayout(
    "Mot de passe modifié",
    `
      <h2 style="margin-top:0;">
        Votre mot de passe a été modifié
      </h2>

      <p>
        Cette confirmation vous informe que le mot de passe de votre compte
        vient d'être modifié.
      </p>

      <p>
        Si vous n'êtes pas à l'origine de cette action,
        contactez immédiatement un administrateur.
      </p>
    `
  );
}