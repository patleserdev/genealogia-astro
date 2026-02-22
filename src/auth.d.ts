// src/env.d.ts  (ou auth.d.ts)
declare module '@auth/core/types' {
    interface Session {
      user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
      }
    }
  }