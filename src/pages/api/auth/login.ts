// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { db, loginLogs } from '../../../lib/mongo'
import { createToken } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies,clientAddress  }) => {
  const { email, password } = await request.json()
  const user = await db.collection('users').findOne({ email })

  if (!user || !await bcrypt.compare(password, user.password))
    return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), { status: 401 })


  // src/pages/api/auth/login.ts — mettre à jour l'appel
  const token = createToken({ userId: user._id.toString(), email: user.email, nom: user.nom, prenom: user.prenom })
  cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })

  // Enregistrement de la connexion
  await loginLogs.insertOne({
    userId:    user._id,
    email:     user.email,
    ip:        clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    createdAt: new Date(),
    success:   true,
  })

  return new Response(JSON.stringify({ ok: true }))
}