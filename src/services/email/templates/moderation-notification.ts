import { emailLayout } from "./layout";

export function moderationNotificationTemplate(
  actionDescription: string,
  link: string
): string {
  return emailLayout(
    "Nouvelle demande de modération",
    `
      <h2 style="margin-top:0;">
        Action nécessitant une validation
      </h2>

      <p>
        ${actionDescription}
      </p>

      <p style="text-align:center;margin:32px 0;">
        <a
          href="${link}"
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
          Consulter la demande
        </a>
      </p>
    `
  );
}