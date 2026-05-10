import type { ObjectId } from "mongodb";

export interface UserPersons {
    _id?: ObjectId;
    userId: ObjectId;      // Owner A
    personId: ObjectId;           // email du destinataire
    role: "owner" | "editor" | "viewer";
    source: "created" | "invited" | "linked";
    createdAt: Date;
    updatedAt: Date;
}
