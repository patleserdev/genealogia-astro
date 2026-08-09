// tests/helpers/mailhog.ts

const MAILHOG_URL = 'http://localhost:8025'

interface MailHogMessage {
  ID: string
  From: { Mailbox: string; Domain: string }
  To: { Mailbox: string; Domain: string }[]
  Content: {
    Headers: {
      Subject: string[]
      To: string[]
    }
    Body: string
  }
  MIME?: {
    Parts: Array<{
      Headers: { 'Content-Type': string[] }
      Body: string
    }>
  }
}

export async function clearMailbox() {
  await fetch(`${MAILHOG_URL}/api/v1/messages`, { method: 'DELETE' })
}

export async function getMessages() {
  const res = await fetch(`${MAILHOG_URL}/api/v2/messages`)
  const data = await res.json()
  return data.items as MailHogMessage[]
}

function decodeQuotedPrintable(str: string): string {
  const withoutSoftBreaks = str.replace(/=\r?\n/g, '')
  const bytes = withoutSoftBreaks.replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  return Buffer.from(bytes, 'latin1').toString('utf8')
}

function decodeMimeWord(str: string): string {
  return str.replace(
    /=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g,
    (_, charset: string, encoding: string, text: string) => {
      const normalizedCharset = normalizeCharset(charset)

      if (encoding.toUpperCase() === 'B') {
        return Buffer.from(text, 'base64').toString(normalizedCharset)
      } else {
        const cleaned = text.replace(/_/g, ' ')
        const bytes = cleaned.replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        )
        return Buffer.from(bytes, 'latin1').toString(normalizedCharset)
      }
    }
  )
}

function normalizeCharset(charset: string): BufferEncoding {
  const c = charset.toLowerCase()
  if (c === 'utf-8' || c === 'utf8') return 'utf8'
  if (c === 'ascii' || c === 'us-ascii') return 'ascii'
  if (c === 'latin1' || c === 'iso-8859-1') return 'latin1'
  // fallback raisonnable pour tes tests, tu contrôles les mails envoyés
  return 'utf8'
}

function extractHtmlBody(message: MailHogMessage): string {
  if (message.MIME?.Parts?.length) {
    const htmlPart = message.MIME.Parts.find(p =>
      p.Headers['Content-Type']?.[0]?.includes('text/html')
    )
    if (htmlPart) return decodeQuotedPrintable(htmlPart.Body)
  }
  return decodeQuotedPrintable(message.Content.Body)
}

function getRecipientEmail(message: MailHogMessage): string[] {
  return message.To.map(t => `${t.Mailbox}@${t.Domain}`.toLowerCase())
}


export function extractTokenFromLink(html: string, paramName = 'token'): string {
  const regex = new RegExp(`${paramName}=([a-f0-9]+)`, 'i')
  const match = html.match(regex)
  if (!match) throw new Error(`Impossible d'extraire le paramètre "${paramName}" du lien`)
  return match[1]
}

/**
 * Attend qu'un mail correspondant au destinataire (et éventuellement au sujet)
 * apparaisse dans MailHog, avec polling (l'envoi étant async côté serveur).
 */
export async function waitForEmail(
  toEmail: string,
  subjectContains?: string,
  timeoutMs = 5000
) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    const messages = await getMessages()

    const found = messages.find(m => {
      const recipients = getRecipientEmail(m)
      const subject = decodeMimeWord(m.Content.Headers.Subject?.[0] ?? '')
      return (
        recipients.includes(toEmail.toLowerCase()) &&
        (!subjectContains || subject.includes(subjectContains))
      )
    })
    
    if (found) {
      return {
        subject: decodeMimeWord(found.Content.Headers.Subject?.[0] ?? ''),
        html: extractHtmlBody(found),
        to: getRecipientEmail(found),
      }
    }

    await new Promise(r => setTimeout(r, 200))
  }

  throw new Error(
    `Aucun email reçu pour ${toEmail}${subjectContains ? ` (sujet: "${subjectContains}")` : ''} après ${timeoutMs}ms`
  )
}