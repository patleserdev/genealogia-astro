import type { APIRoute } from "astro";
import { users } from "../../lib/mongo";
import { verifyToken } from "../../lib/auth";
import { ObjectId } from "mongodb";

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("token")?.value;
  if (!token) return new Response("unauthorized", { status: 401 });

  const payload = verifyToken(token);

  if (payload.role !== "OWNER") {
    return new Response("forbidden", { status: 403 });
  }

  const data = await users
    .find({})
    .project({
      password: 0, // jamais exposer
    })
    .toArray();

  return new Response(JSON.stringify(data), { status: 200 });
};