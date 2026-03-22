// src/lib/auth.ts
import jwt from 'jsonwebtoken'

const SECRET = import.meta.env.AUTH_SECRET

export const createToken = (payload: { userId: string; email: string; nom: string,prenom:string }) =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as { userId: string; email: string; nom: string,prenom:string  }
  // ↑ virgule supprimée ici