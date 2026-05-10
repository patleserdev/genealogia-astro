import type { APIRoute } from 'astro'
import crypto from 'crypto'
import { db } from '../../../lib/mongo'

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json()
  console.log('🔥 forgot-password HIT')
  if (!email?.trim()) {
    return new Response(JSON.stringify({ error: 'Email requis' }), { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  const user = await db.collection('users').findOne({ email: normalizedEmail })
  //console.log('2 - user', user)

  // ⚠️ sécurité: ne pas révéler si user existe ou non
  if (!user) {
    return new Response(JSON.stringify({ ok: true }))
  }

  // ── Génération token reset ──
  const resetToken = crypto.randomBytes(32).toString('hex')
  //console.log('3 - token generated',resetToken)

  const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 min

  await db.collection('password_resets').insertOne({
    userId: user._id,
    email: normalizedEmail,
    token: resetToken,
    expiresAt,
    used: false,
    createdAt: new Date(),
  })
  //console.log('4 - inserted')

  // ── TODO: envoyer email ──
  // ex: /reset-password?token=xxx
  const resetLink = `${import.meta.env.PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  console.log('5 - link', resetLink)
  return new Response(JSON.stringify({ ok: true }))
}