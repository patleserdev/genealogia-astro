// src/services/email/templates/layout.ts

export function emailLayout(
    title: string,
    content: string
  ): string {
    return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  </head>
  
  <body style="
    margin:0;
    padding:0;
    background:#fafaf9;
    font-family:Arial, Helvetica, sans-serif;
  ">
  
  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    style="background:#fafaf9;padding:32px 16px;"
  >
  <tr>
  <td align="center">
  
  <table
    role="presentation"
    width="600"
    cellspacing="0"
    cellpadding="0"
    style="
      background:#ffffff;
      border:1px solid #e7e5e4;
      border-radius:12px;
      overflow:hidden;
    "
  >
  
    <!-- Header -->
    <tr>
      <td
        style="
          background:#d97706;
          padding:24px;
          text-align:center;
        "
      >
        <h1
          style="
            margin:0;
            color:white;
            font-size:28px;
          "
        >
          Genealogia
        </h1>
  
        <p
          style="
            margin:8px 0 0;
            color:#fffbeb;
            font-style:italic;
          "
        >
          Site familial d'informations généalogiques
        </p>
      </td>
    </tr>
  
    <!-- Content -->
    <tr>
      <td style="padding:32px;">
        ${content}
      </td>
    </tr>
  
    <!-- Footer -->
    <tr>
      <td
        style="
          padding:24px;
          text-align:center;
          border-top:1px solid #e7e5e4;
          color:#78716c;
          font-size:12px;
        "
      >
        © 2026 — Genealogia
      </td>
    </tr>
  
  </table>
  
  </td>
  </tr>
  </table>
  
  </body>
  </html>
  `;
  }