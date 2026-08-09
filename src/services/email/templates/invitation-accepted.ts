// src/services/email/templates/invitation-accepted.ts

import { emailLayout } from "./layout.ts";

export function invitationAcceptedTemplate(guestName: string): string {
  return emailLayout( 
    "Invitation Genealogia acceptée",`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Invitation acceptée 🎉</h2>
        <p>Bonne nouvelle !</p>
        <p><strong>${guestName}</strong> a accepté votre invitation et a maintenant accès à votre arbre généalogique.</p>
        <p>Vous pouvez dès à présent partager du contenu et collaborer ensemble.</p>
      </div>
    `)
  }