import type { ObjectId } from "mongodb";

export interface PasswordResets {
    _id: ObjectId,
    userId: ObjectId,
    token: string,          // hash du token (IMPORTANT)
    expiresAt: Date,
    usedAt: Date | null,
    createdAt: Date,
    ip?: string
}