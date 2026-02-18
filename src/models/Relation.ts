import { ObjectId } from "mongodb";

export type RelationType = "PARENT" | "CONJOINT";

export interface Relation {
  _id?: ObjectId;
  from: ObjectId;   // source
  to: ObjectId;     // cible
  dateDebut?: string;
  dateFin?: string;
  type: RelationType;
  status?: "ACTIVE" | "DIVORCED"; // nouveau champ
  since?: Date; // optionnel : date du mariage
  until?: Date; // optionnel : date du divorce
 
}
