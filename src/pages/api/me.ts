// src/pages/api/me.ts
import type { APIRoute } from 'astro'
import { ObjectId } from 'mongodb'
import { db } from '../../lib/mongo'
import { verifyToken } from '../../lib/auth'  // ← utiliser verifyToken du lib

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401 })

  let payload: { userId: string; email: string; nom: string ,prenom:string}
  try {
    payload = verifyToken(token)  // ← plus de jwt.verify manuel avec la mauvaise clé
  } catch {
    return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 })
  }

  const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) })
  if (!user) return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), { status: 404 })

  const person = user.personId
    ? await db.collection('persons').findOne({ _id: user.personId })
    : null

  return new Response(JSON.stringify({
    user:   { email: user.email, prenom: user.prenom, nom: user.nom },
    person: person ?? null,
  }))
}