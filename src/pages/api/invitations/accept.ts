// src/pages/api/invitations/accept.ts
import type { APIRoute } from "astro";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { db, invitations, user_persons, users } from "../../../lib/mongo";
import { createToken } from "../../../lib/auth";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { token, prenom, nom, email, password, personId } =
      await request.json();

    if (!token)
      return new Response(JSON.stringify({ error: "Token manquant" }), {
        status: 400,
      });

    const inv = await invitations.findOne({
      token,
      status: "PENDING",
    });

    if (!inv)
      return new Response(JSON.stringify({ error: "Invitation invalide" }), {
        status: 404,
      });

    if (inv.expiresAt < new Date()) {
      await invitations.updateOne(
        { _id: inv._id },
        { $set: { status: "EXPIRED" } }
      );
      return new Response(JSON.stringify({ error: "Invitation expirée" }), {
        status: 400,
      });
    }

    if (!prenom?.trim() || !nom?.trim() || !password)
      return new Response(JSON.stringify({ error: "Champs requis" }), {
        status: 400,
      });

    if (!PASSWORD_REGEX.test(password))
      return new Response(
        JSON.stringify({ error: "Mot de passe trop faible" }),
        { status: 400 }
      );

    const exists = await users.findOne({ email: inv.toEmail });
    if (exists)
      return new Response(
        JSON.stringify({ error: "Compte déjà existant" }),
        { status: 400 }
      );

    let finalPersonId: ObjectId;

    // ✅ CAS 1 : user a sélectionné une personne existante
    if (personId) {
      const existingPerson = await db
        .collection("persons")
        .findOne({ _id: new ObjectId(personId) });

      if (!existingPerson) {
        return new Response(
          JSON.stringify({ error: "Personne invalide" }),
          { status: 400 }
        );
      }

      finalPersonId = existingPerson._id!;
    }

    // ✅ CAS 2 : création nouvelle personne
    else {
      const personResult = await db.collection("persons").insertOne({
        active: true,
        prenom: prenom.trim(),
        nom: nom.trim(),
        email: inv.toEmail,
        createdAt: new Date(),
      });

      finalPersonId = personResult.insertedId;
    }

    // 👤 CREATE USER
    const hashed = await bcrypt.hash(password, 12);

    const userResult = await users.insertOne({
      active: true,
      email: inv.toEmail,
      prenom: prenom.trim(),
      nom: nom.trim(),
      password: hashed,
      role: "GUEST",
      invitedBy: inv.fromUserId,
      personId: finalPersonId,
      createdAt: new Date(),
    });

    // 🔗 CREATE LINKS (user_persons)
    for (const pid of inv.sharedPersonIds ?? []) {
      await user_persons.updateOne(
        {
          userId: userResult.insertedId,
          personId: new ObjectId(pid),
        },
        {
          $set: {
            role: "viewer",
            source: "invited",
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    await invitations.updateOne(
      { _id: inv._id },
      {
        $set: {
          status: "ACCEPTED",
          acceptedByUserId: userResult.insertedId,
        },
      }
    );

    const jwtToken = createToken({
      userId: userResult.insertedId.toString(),
      email: inv.toEmail,
      nom: nom.trim(),
      prenom: prenom.trim(),
      role: "GUEST",
      invitedBy: inv.fromUserId.toString(),
    });

    cookies.set("token", jwtToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (e) {
    console.error(e);

    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Erreur serveur",
      }),
      { status: 500 }
    );
  }
};