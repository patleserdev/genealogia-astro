import type { ObjectId } from "mongodb";

export interface Invitation {
    _id?: ObjectId;
    fromUserId: ObjectId;      // Owner A
    toEmail: string;           // email du destinataire
    token: string;             // token unique pour le lien d'invitation
    status: "PENDING" | "ACCEPTED" | "EXPIRED";
    createdAt: Date;
    expiresAt: Date;
    acceptedByUserId?: ObjectId; // rempli quand B accepte
    sharedPersonIds?: ObjectId[]
}