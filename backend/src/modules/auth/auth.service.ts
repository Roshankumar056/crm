import prisma from "../../db/prisma"; // ✅ import singleton (NOT { prisma })
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { Role } from "@prisma/client";

// ✅ Validate email + password
export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return user;
}

// ✅ Generate Access & Refresh tokens
function signAccess(userId: string, role: Role) {
  return jwt.sign(
    { sub: userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as SignOptions
  );
}

function signRefresh(userId: string, role: Role) {
  return jwt.sign(
    { sub: userId, role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
  );
}

// ✅ Issue new tokens + store refresh in DB
export async function issueTokens(userId: string, role: Role) {
  const accessToken = signAccess(userId, role);
  const refreshToken = signRefresh(userId, role);

  const decoded: any = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  // ✅ delete expired old refresh tokens
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      expiresAt: { lt: new Date() },
    },
  });

  // ✅ store fresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

// ✅ Rotation — delete old token, issue new token
export async function rotateRefresh(oldToken: string) {
  const saved = await prisma.refreshToken.findFirst({
    where: { token: oldToken, isRevoked: false },
  });

  if (!saved || saved.expiresAt < new Date()) {
    throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
  }

  let payload: any;
  try {
    payload = jwt.verify(oldToken, env.JWT_REFRESH_SECRET);
  } catch (e) {
    throw Object.assign(new Error("Token expired or invalid"), { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  // ✅ revoke the old token
  await prisma.refreshToken.update({
    where: { id: saved.id },
    data: { isRevoked: true },
  });

  // ✅ generate and return new tokens
  return issueTokens(user.id, user.role);
}
