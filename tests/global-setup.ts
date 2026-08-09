import type { FullConfig } from '@playwright/test'
import path from 'path'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../src/lib/mongo'
import type { TokenPayload } from '../src/lib/auth'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default async function globalSetup(config: FullConfig) {
  const SECRET = process.env.AUTH_SECRET
  if (!SECRET) {
    throw new Error('AUTH_SECRET manquant dans .env pour les tests')
  }

  const usersCol = db.collection('users')
  const hashed = await bcrypt.hash('Test1234!', 12)

  // ── OWNER de test ──────────────────────────────
  const ownerEmail = 'owner-test@example.com'
  await usersCol.deleteOne({ email: ownerEmail })

  const ownerResult = await usersCol.insertOne({
    email: ownerEmail,
    prenom: 'Owner',
    nom: 'Test',
    password: hashed,
    role: 'OWNER',
    createdAt: new Date(),
  })

  const ownerPayload: TokenPayload = {
    userId: ownerResult.insertedId.toString(),
    email: ownerEmail,
    nom: 'Test',
    prenom: 'Owner',
    role: 'OWNER',
  }

  process.env.TEST_OWNER_TOKEN = jwt.sign(ownerPayload, SECRET, { expiresIn: '7d' })
  process.env.TEST_OWNER_EMAIL = ownerEmail

  // ── GUEST de test, rattaché au OWNER ci-dessus ──
  const guestEmail = 'guest-test@example.com'
  await usersCol.deleteOne({ email: guestEmail })

  const guestResult = await usersCol.insertOne({
    email: guestEmail,
    prenom: 'Marie',
    nom: 'Curie',
    password: hashed,
    role: 'GUEST',
    invitedBy: ownerResult.insertedId,
    createdAt: new Date(),
  })

  const guestPayload: TokenPayload = {
    userId: guestResult.insertedId.toString(),
    email: guestEmail,
    nom: 'Curie',
    prenom: 'Marie',
    role: 'GUEST',
    invitedBy: ownerResult.insertedId.toString(),
  }

  process.env.TEST_GUEST_TOKEN = jwt.sign(guestPayload, SECRET, { expiresIn: '7d' })
}