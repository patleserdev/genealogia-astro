import { emailLayout } from "./layout";

export function accountApprovedTemplate(): string {
  return emailLayout(
    "Compte validé",
    `
      <h2 style="margin-top:0;">
        Votre compte a été validé
      </h2>

      <p>
        Votre demande d'inscription a été approuvée.
      </p>

      <p>
        Vous pouvez désormais accéder à l'ensemble des fonctionnalités de Genealogia.
      </p>
    `
  );
}