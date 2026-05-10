import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { db } from '../../../lib/mongo'

export const POST: APIRoute = async ({ request }) => {
  const { token, password } = await request.json()
  console.log('TOKEN RECEIVED:', token)
  if (!token || !password) {
    return new Response(JSON.stringify({ error: 'Données invalides' }), { status: 400 })
  }

  const reset = await db.collection('password_resets').findOne({
    token,
    used: false,
  })
  console.log('RESET FOUND:', reset)
  if (!reset) {
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 400 })
  }

  if (new Date(reset.expiresAt) < new Date()) {
    return new Response(JSON.stringify({ error: 'Token expiré' }), { status: 400 })
  }

  const user = await db.collection('users').findOne({ _id: reset.userId })

  if (!user) {
    return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), { status: 404 })
  }

  // comparer le nouveau mot de passe avec l'ancien
  const isSamePassword = await bcrypt.compare(password, user.password)

  if (isSamePassword) {
    return new Response(JSON.stringify({ error: 'Vous ne pouvez pas réutiliser votre ancien mot de passe' }), { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 12)

  await db.collection('users').updateOne(
    { _id: reset.userId },
    { $set: { password: hashed } }
  )

  await db.collection('passwordResets').updateOne(
    { _id: reset._id },
    { $set: { used: true } }
  )

  return new Response(JSON.stringify({ ok: true }))
}