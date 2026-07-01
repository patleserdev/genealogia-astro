import { emailLayout } from "./layout";

export function welcomeTemplate(
  firstName: string
): string {
  return emailLayout(
    "Bienvenue sur Genealogia",
    `
      <h2 style="margin-top:0;">
        Bienvenue ${firstName}
      </h2>

      <p>
        Votre compte est maintenant actif.
      </p>

      <p>
        Vous pouvez commencer à explorer votre arbre généalogique,
        consulter les membres de votre famille et participer à son enrichissement.
      </p>
    `
  );
}