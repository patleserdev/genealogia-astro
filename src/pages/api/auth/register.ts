// src/pages/api/register.ts
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { db } from '../../../lib/mongo'

export const POST: APIRoute = async ({ request }) => {
  const { email, password, name } = await request.json()

  const exists = await db.collection('users').findOne({ email })
  if (exists) {
    return new Response(JSON.stringify({ error: 'Email déjà utilisé' }), { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await db.collection('users').insertOne({
    email,
    name,
    password: hashed,
    createdAt: new Date(),
  })

  return new Response(JSON.stringify({ ok: true }), { status: 201 })
}