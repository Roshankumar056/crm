import { prisma } from "../../db/prisma";
import { validateUser, issueTokens, rotateRefresh } from "./auth.service";
import bcrypt from "bcryptjs";
import { env } from "../../config/env";
export async function register(req, res) {
    const { email, password, name, role } = req.body;
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({ data: { email, passwordHash, name, role: role ?? "SALES" } });
    const tokens = await issueTokens(user.id, user.role);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens });
}
export async function login(req, res) {
    const { email, password } = req.body;
    const user = await validateUser(email, password);
    if (!user)
        return res.status(401).json({ error: { message: "Invalid credentials" } });
    const tokens = await issueTokens(user.id, user.role);
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens });
}
export async function refresh(req, res) {
    const { refreshToken } = req.body;
    const tokens = await rotateRefresh(refreshToken);
    res.json(tokens);
}
export async function me(req, res) {
    const u = await prisma.user.findUnique({
        where: { id: req.user.sub },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json({ user: u });
}
