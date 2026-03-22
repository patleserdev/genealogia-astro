// src/pages/api/auth/register.ts
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { db } from '../../../lib/mongo'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const POST: APIRoute = async ({ request }) => {
  const { prenom, nom, email, dateNaissance, password, personId } = await request.json()

  // ── Validation des champs ──
  if (!prenom?.trim() || !nom?.trim() || !email?.trim() || !password) {
    return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), { status: 400 })
  }

  if (!PASSWORD_REGEX.test(password)) {
    return new Response(JSON.stringify({
      error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
    }), { status: 400 })
  }

  // ── Email déjà utilisé ──
  const exists = await db.collection('users').findOne({ email: email.toLowerCase().trim() })
  if (exists) {
    return new Response(JSON.stringify({ error: 'Email déjà utilisé' }), { status: 400 })
  }

  // ── Lien Person ──
let linkedPersonId: ObjectId | undefined

if (personId) {
  linkedPersonId = new ObjectId(personId)

  // Vérification que la Person correspond bien aux infos saisies
  const person = await db.collection('persons').findOne({ _id: linkedPersonId })

  if (!person) {
    return new Response(JSON.stringify({ error: 'Profil introuvable' }), { status: 404 })
  }

  const normalize = (s: string) => s?.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const prenomMatch = normalize(person.prenom) === normalize(prenom)
  const nomMatch    = normalize(person.nom)    === normalize(nom)
  const emailMatch  = !person.email || normalize(person.email) === normalize(email)
  const dateMatch   = !person.dateNaissance || person.dateNaissance === dateNaissance

  if (!prenomMatch || !nomMatch) {
    return new Response(JSON.stringify({
      error: 'Le prénom ou le nom ne correspond pas au profil sélectionné'
    }), { status: 400 })
  }

  if (!emailMatch) {
    return new Response(JSON.stringify({
      error: 'L\'email ne correspond pas au profil sélectionné'
    }), { status: 400 })
  }

  if (!dateMatch) {
    return new Response(JSON.stringify({
      error: 'La date de naissance ne correspond pas au profil sélectionné'
    }), { status: 400 })
  }

  // Vérifier que le profil n'est pas déjà pris
  const alreadyLinked = await db.collection('users').findOne({ personId: linkedPersonId })
  if (alreadyLinked) {
    return new Response(JSON.stringify({ error: 'Ce profil est déjà associé à un compte' }), { status: 400 })
  }

} else {
  // Pas de Person sélectionnée → on en crée une nouvelle
  const result = await db.collection('persons').insertOne({
    active:        true,
    prenom:        prenom.trim(),
    nom:           nom.trim(),
    email:         email.toLowerCase().trim(),
    dateNaissance: dateNaissance ?? null,
  })
  linkedPersonId = result.insertedId
}

  // ── Création du user ──
  const hashed = await bcrypt.hash(password, 12)
  await db.collection('users').insertOne({
    email:         email.toLowerCase().trim(),
    prenom:        prenom.trim(),
    nom:           nom.trim(),
    password:      hashed,
    personId:      linkedPersonId,
    createdAt:     new Date(),
  })

  return new Response(JSON.stringify({ ok: true }), { status: 201 })
}