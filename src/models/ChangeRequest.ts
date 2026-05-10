import type { ObjectId } from "mongodb";
import type { Person } from "./Person.ts";
import type { Relation } from "./Relation.ts";

export type ChangeRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type ChangeRequestType =
"CREATE_PERSON"
| "UPDATE_PERSON"
| "DELETE_PERSON"
| "CREATE_RELATION"
| "UPDATE_RELATION"
| "DELETE_RELATION";

export interface ChangeRequest {
    _id?: ObjectId;
    requestedByUserId: ObjectId;  // User B
    ownerId: ObjectId;            // Owner A qui modère
    type: ChangeRequestType;
    personId?: ObjectId;          // si EDIT, la personne ciblée
    currentData?: Partial<Person>; // snapshot de l'existant (pour EDIT)
    proposedData: Partial<Person>; // ce que B propose
    relationsData?: Omit<Relation, "_id">[];
    status: ChangeRequestStatus;
    createdAt: Date;
    reviewedAt?: Date;
    reviewNote?: string;
}