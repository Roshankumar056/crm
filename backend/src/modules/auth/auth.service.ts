import { prisma } from "../../db/prisma";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { Role } from "@prisma/client";

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return user;
}

function signAccess(userId: string, role: Role) {
  // ✅ Explicit type casting to fix TS overload errors
  return jwt.sign(
    { sub: userId, role },
    env.JWT_ACCESS_SECRET as string,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as SignOptions
  );
}

function signRefresh(userId: string, role: Role) {
  // ✅ Same fix here for refresh token
  return jwt.sign(
    { sub: userId, role },
    env.JWT_REFRESH_SECRET as string,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
  );
}

export async function issueTokens(userId: string, role: Role) {
  const accessToken = signAccess(userId, role);
  const refreshToken = signRefresh(userId, role);

  const decoded: any = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefresh(token: string) {
  const saved = await prisma.refreshToken.findUnique({ where: { token } });
  if (!saved || saved.isRevoked || saved.expiresAt < new Date()) {
    throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
  }

  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET as string) as any;
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  await prisma.refreshToken.update({
    where: { token },
    data: { isRevoked: true },
  });

  return issueTokens(user.id, user.role);
}
