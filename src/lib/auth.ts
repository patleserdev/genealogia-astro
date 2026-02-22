// src/lib/auth.ts
import jwt from 'jsonwebtoken'

const SECRET = import.meta.env.AUTH_SECRET

export const createToken = (payload: { id: string; email: string; name: string }) =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as { id: string; email: string; name: string }