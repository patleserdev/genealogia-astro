import jwt from 'jsonwebtoken';

const SECRET = "une_chaine_aleatoire_longue";
const createToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: "7d" });
const verifyToken = (token) => jwt.verify(token, SECRET);

export { createToken as c, verifyToken as v };
