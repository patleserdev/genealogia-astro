// src/pages/api/me/update.ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { db } from '../../../lib/mongo'
import { verifyToken } from '../../../lib/auth'

export const PATCH: APIRoute = async ({ cookies, request }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  let payload: { userId: string; email: string; nom: string ,prenom:string}
  try {
    payload = verifyToken(token)
  } catch {
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 })
  }

  const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) })
  if (!user) return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), { status: 404 })

  const { prenom, nom, dateNaissance, sexe, notes } = await request.json()

  if (user.personId) {
    await db.collection('persons').updateOne(
      { _id: user.personId },
      { $set: {
        ...(prenom             && { prenom }),
        ...(nom                && { nom }),
        ...(dateNaissance      && { dateNaissance }),
        ...(sexe               && { sexe }),
        ...(notes !== undefined && { notes }),
      }}
    )
  }

  await db.collection('users').updateOne(
    { _id: new ObjectId(payload.userId) },
    { $set: { prenom, nom } }
  )

  return new Response(JSON.stringify({ ok: true }))
}