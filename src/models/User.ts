import { ObjectId } from "mongodb";

export interface Person {
    _id?: ObjectId;
    active: boolean;
    prenom: string;
    nom: string;
    email?: string
    password: string,
    dateNaissance?: string;
    createdAt: Date,
    personId?: ObjectId

}
