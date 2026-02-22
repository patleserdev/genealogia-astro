// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { db } from '../../../lib/mongo'
import { createToken } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json()
  const user = await db.collection('users').findOne({ email })

  if (!user || !await bcrypt.compare(password, user.password))
    return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), { status: 401 })

  const token = createToken({ id: user._id.toString(), email: user.email, name: user.name })
  cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })

  return new Response(JSON.stringify({ ok: true }))
}