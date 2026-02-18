import { ObjectId } from "mongodb";

export interface Person {
    _id?: ObjectId;
    active: boolean;
    prenom: string;
    nom: string;
    email?: string
    dateNaissance?: string;
    dateDeces?: string;
    sexe?: "M" | "F" | "Autre";
    notes?: string;
}
