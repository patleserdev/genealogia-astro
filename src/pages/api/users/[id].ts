import type { APIRoute } from "astro";
import {
  users,
  user_persons,
  invitations,
  changeRequests,
} from "../../../lib/mongo";
import { verifyToken } from "../../../lib/auth";
import { ObjectId } from "mongodb";

function requireOwner(token: string) {
  const payload = verifyToken(token);
  if (payload.role !== "OWNER") throw new Error("forbidden");
  return payload;
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const token = cookies.get("token")?.value;
    if (!token) return new Response("unauthorized", { status: 401 });

    requireOwner(token);

    const id = params.id;
    if (!id) return new Response("missing id", { status: 400 });

    const userId = new ObjectId(id);

    // 🔒 1. récupérer le user cible
    const targetUser = await users.findOne({ _id: userId });

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "User introuvable" }),
        { status: 404 }
      );
    }

    // 🚫 2. INTERDICTION DE SUPPRIMER UN OWNER
    if (targetUser.role === "OWNER") {
      return new Response(
        JSON.stringify({
          error: "Impossible de supprimer un OWNER",
        }),
        { status: 403 }
      );
    }

    // 🧹 3. cleanup user_persons
    await user_persons.deleteMany({ userId });

    // 🧹 4. cleanup invitations
    await invitations.deleteMany({
      $or: [
        { fromUserId: userId },
        { acceptedByUserId: userId },
      ],
    });

    // 🧹 5. cleanup change requests (moderations)
    await changeRequests.deleteMany({
      $or: [
        { ownerId: userId },
        { requestedByUserId: userId },
      ],
    });

    // 🧼 6. soft delete user
    await users.deleteOne({ _id: userId })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message ?? "server error" }),
      {
        status: e.message === "forbidden" ? 403 : 500,
      }
    );
  }
};