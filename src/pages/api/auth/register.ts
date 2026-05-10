import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { db } from '../../../lib/mongo'

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const normalize = (s?: string) => s?.trim().toLowerCase()

const normalizeText = (s?: string) =>
  s
    ?.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()

  const prenom = body.prenom?.trim()
  const nom = body.nom?.trim()
  const email = normalize(body.email)
  const password = body.password
  const dateNaissance = body.dateNaissance
  const personId = body.personId

  // ─────────────────────────────
  // VALIDATION
  // ─────────────────────────────
  if (!prenom || !nom || !email || !password) {
    return new Response(
      JSON.stringify({ error: 'Tous les champs sont requis' }),
      { status: 400 }
    )
  }

  if (!PASSWORD_REGEX.test(password)) {
    return new Response(
      JSON.stringify({
        error:
          'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
      }),
      { status: 400 }
    )
  }

  const usersCol = db.collection('users')
  const personsCol = db.collection('persons')

  // ─────────────────────────────
  // EMAIL UNIQUE
  // ─────────────────────────────
  const exists = await usersCol.findOne({ email })

  if (exists) {
    return new Response(
      JSON.stringify({ error: 'Email déjà utilisé' }),
      { status: 400 }
    )
  }

  // ─────────────────────────────
  // PERSON LINK OU CRÉATION
  // ─────────────────────────────
  let linkedPersonId: ObjectId

  if (personId) {
    const pid = new ObjectId(personId)

    const person = await personsCol.findOne({ _id: pid })

    if (!person) {
      return new Response(
        JSON.stringify({ error: 'Profil introuvable' }),
        { status: 404 }
      )
    }

    const prenomMatch =
      normalizeText(person.prenom) === normalizeText(prenom)
    const nomMatch =
      normalizeText(person.nom) === normalizeText(nom)
    const emailMatch =
      !person.email || normalizeText(person.email) === normalize(email)
    const dateMatch =
      !person.dateNaissance || person.dateNaissance === dateNaissance

    if (!prenomMatch || !nomMatch) {
      return new Response(
        JSON.stringify({
          error:
            'Le prénom ou le nom ne correspond pas au profil sélectionné',
        }),
        { status: 400 }
      )
    }

    if (!emailMatch) {
      return new Response(
        JSON.stringify({
          error: "L'email ne correspond pas au profil sélectionné",
        }),
        { status: 400 }
      )
    }

    if (!dateMatch) {
      return new Response(
        JSON.stringify({
          error:
            'La date de naissance ne correspond pas au profil sélectionné',
        }),
        { status: 400 }
      )
    }

    const alreadyLinked = await usersCol.findOne({ personId: pid })

    if (alreadyLinked) {
      return new Response(
        JSON.stringify({
          error: 'Ce profil est déjà associé à un compte',
        }),
        { status: 400 }
      )
    }

    linkedPersonId = pid
  } else {
    const result = await personsCol.insertOne({
      active: true,
      prenom,
      nom,
      email,
      dateNaissance: dateNaissance ?? null,
    })

    linkedPersonId = result.insertedId
  }

  // ─────────────────────────────
  // CREATION USER
  // ─────────────────────────────
  const hashed = await bcrypt.hash(password, 12)

  await usersCol.insertOne({
    email,
    prenom,
    nom,
    password: hashed,
    personId: linkedPersonId,
    createdAt: new Date(),
  })

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
  })
}