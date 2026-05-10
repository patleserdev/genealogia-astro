// src/pages/api/invitations/accept.ts
// Appelé quand B soumet le formulaire d'inscription via le lien
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { db, invitations, user_persons, users } from '../../../lib/mongo'
import { createToken } from '../../../lib/auth'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
  const { token, prenom, nom,email, password,personId } = await request.json()

  if (!token)
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 400 })

  // Vérifie le token
  const inv = await invitations.findOne({ token, status: 'PENDING' })
  const sharedPersonIds = inv?.sharedPersonIds ?? []
  if (!inv)
    return new Response(JSON.stringify({ error: 'Invitation invalide' }), { status: 404 })

  if (inv.expiresAt < new Date()) {
    await invitations.updateOne({ _id: inv._id }, { $set: { status: 'EXPIRED' } })
    return new Response(JSON.stringify({ error: 'Invitation expirée' }), { status: 400 })
  }

  if (!prenom?.trim() || !nom?.trim() || !password)
    return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), { status: 400 })

  if (!PASSWORD_REGEX.test(password))
    return new Response(JSON.stringify({ error: 'Mot de passe trop faible' }), { status: 400 })

  // Email déjà utilisé ?
  const exists = await users.findOne({ email: inv.toEmail })
  if (exists)
    return new Response(JSON.stringify({ error: 'Un compte existe déjà pour cet email' }), { status: 400 })

  // Crée une Person liée au GUEST
  const personResult = await db.collection('persons').insertOne({
    active:    true,
    prenom:    prenom.trim(),
    nom:       nom.trim(),
    email:     inv.toEmail,
    createdAt: new Date(),
  })

  // Crée le user GUEST
  const hashed = await bcrypt.hash(password, 12)
  const userResult = await users.insertOne({
    active: true,
    email:      inv.toEmail,
    prenom:     prenom.trim(),
    nom:        nom.trim(),
    password:   hashed,
    role:       'GUEST',
    invitedBy:  inv.fromUserId,         
    personId:   personResult.insertedId,
    createdAt:  new Date(),
  })
  
  for (const personId of sharedPersonIds) {
    await user_persons.updateOne(
      {
        userId: userResult.insertedId,
        personId,
      },
      {
        $set: {
          role: 'viewer',
          source: 'invited',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
  }
  // Marque l'invitation comme acceptée
  await invitations.updateOne({ _id: inv._id }, {
    $set: { status: 'ACCEPTED', acceptedByUserId: userResult.insertedId }
  })

  // Connecte directement le GUEST
  const jwtToken = createToken({
    userId:    userResult.insertedId.toString(),
    email:     inv.toEmail,
    nom:       nom.trim(),
    prenom:    prenom.trim(),
    role:      'GUEST',
    invitedBy: inv.fromUserId.toString(),
  })
  cookies.set('token', jwtToken, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })

  return new Response(JSON.stringify({ ok: true }), { status: 201 })
} catch (e) {
  console.error(e)

  return new Response(
    JSON.stringify({
      error: e instanceof Error ? e.message : 'Erreur serveur'
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
}