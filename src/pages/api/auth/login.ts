// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { db, loginLogs } from '../../../lib/mongo'
import { createToken } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const { email, password } = await request.json()

  const normalizedEmail = email?.toLowerCase().trim()

  // -------------------------
  // VALIDATION INPUT
  // -------------------------
  if (!normalizedEmail) {
    return new Response(
      JSON.stringify({ error: 'Adresse mail manquante' }),
      { status: 400 }
    )
  }

  if (!password) {
    return new Response(
      JSON.stringify({ error: 'Mot de passe manquant' }),
      { status: 400 }
    )
  }

  // -------------------------
  // FIND USER
  // -------------------------
  const user = await db.collection('users').findOne({
    email: normalizedEmail
  })

  // ⚠️ même réponse pour éviter user enumeration
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Identifiants incorrects' }),
      { status: 401 }
    )
  }

  // -------------------------
  // CHECK PASSWORD
  // -------------------------
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Identifiants incorrects' }),
      { status: 401 }
    )
  }

  // -------------------------
  // CREATE TOKEN
  // -------------------------
  const token = createToken({
    userId: user._id.toString(),
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role ?? "OWNER",
    invitedBy: user.invitedBy?.toString(),
  })

  cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  // -------------------------
  // LOG LOGIN
  // -------------------------
  await loginLogs.insertOne({
    userId: user._id,
    email: user.email,
    ip: clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    createdAt: new Date(),
    success: true,
  })

  return new Response(JSON.stringify({ ok: true }))
}