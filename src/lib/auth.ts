// src/lib/auth.ts
import jwt from 'jsonwebtoken'

const SECRET = import.meta.env.AUTH_SECRET

export interface TokenPayload {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: "OWNER" | "GUEST";
  invitedBy?: string;        // ObjectId en string
}

export const createToken = (payload: TokenPayload) =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as TokenPayload