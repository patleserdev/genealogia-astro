import bcrypt from 'bcryptjs';
import { d as db, l as loginLogs } from '../../../chunks/mongo_pJhMhjwv.mjs';
import { c as createToken } from '../../../chunks/auth_C0Ch4QAz.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, clientAddress }) => {
  const { email, password } = await request.json();
  const user = await db.collection("users").findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password))
    return new Response(JSON.stringify({ error: "Identifiants incorrects" }), { status: 401 });
  const token = createToken({ userId: user._id.toString(), email: user.email, nom: user.nom, prenom: user.prenom });
  cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  await loginLogs.insertOne({
    userId: user._id,
    email: user.email,
    ip: clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    createdAt: /* @__PURE__ */ new Date(),
    success: true
  });
  return new Response(JSON.stringify({ ok: true }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
