import type { APIRoute } from 'astro'
import crypto from 'crypto'
import { db } from '../../../lib/mongo'
import { emailService } from '../../../services/email/email.service'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json()

  if (!email?.trim()) {
    return new Response(JSON.stringify({ error: 'Email requis' }), { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  const user = await db.collection('users').findOne({ email: normalizedEmail })

  // ⚠️ sécurité: ne pas révéler si user existe ou non
  if (!user) {
    return new Response(JSON.stringify({ ok: true }))
  }

  // ── Génération token reset ──
  const resetToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 min

  await db.collection('password_resets').insertOne({
    userId: user._id,
    email: normalizedEmail,
    token: resetToken,
    expiresAt,
    used: false,
    createdAt: new Date(),
  })

  const resetLink = `${import.meta.env.PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  try {
    await emailService.sendPasswordReset(normalizedEmail, resetLink)
  } catch (err) {
    console.error('Échec envoi mail reset password:', err)
    // On ne révèle rien au client, l'erreur est juste loggée côté serveur
  }

  return new Response(JSON.stringify({ ok: true }))
}