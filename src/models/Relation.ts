import { ObjectId } from "mongodb";

export type RelationType = "PARENT" | "CONJOINT";

export interface Relation {
  _id?: ObjectId;
  from: ObjectId;
  to: ObjectId;
  dateDebut?: string;
  dateFin?: string;
  type: RelationType;
  status?: "ACTIVE" | "DIVORCED";
  since?: Date;
  until?: Date;
  coupleRelationId?: ObjectId; // ← NOUVEAU : sur une relation PARENT, référence la relation CONJOINT
}
