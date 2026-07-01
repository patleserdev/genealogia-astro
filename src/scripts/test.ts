import { emailService } from "../services/email/email.service";

async function main() {
  const email = "test@example.com";

  console.log("📧 Envoi email de bienvenue...");
  await emailService.sendWelcome(
    email,
    "Pierre"
  );

  console.log("📧 Envoi vérification email...");
  await emailService.sendEmailVerification(
    email,
    "http://localhost:4321/verify?token=test-token"
  );

  console.log("📧 Envoi réinitialisation mot de passe...");
  await emailService.sendPasswordReset(
    email,
    "http://localhost:4321/reset?token=test-token"
  );

  console.log("📧 Envoi invitation...");
  await emailService.sendInvitation(
    email,
    "Jean Dupont",
    "http://localhost:4321/register?invite=test-token"
  );

  console.log("📧 Envoi confirmation changement mot de passe...");
  await emailService.sendPasswordChanged(
    email
  );

  console.log("📧 Envoi validation de compte...");
  await emailService.sendAccountApproved(
    email
  );

  console.log("📧 Envoi notification de modération...");
  await emailService.sendModerationNotification(
    email,
    "Une nouvelle demande de création de relation nécessite une validation.",
    "http://localhost:4321/moderation"
  );

  console.log("✅ Tous les emails ont été envoyés");
}

main().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exit(1);
});