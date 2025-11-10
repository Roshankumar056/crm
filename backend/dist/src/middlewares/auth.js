import jwt from "jsonwebtoken";
import { env } from "../config/env";
export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: { message: "Missing token" } });
    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: { message: "Invalid token" } });
    }
}
export function authorize(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: { message: "Unauthorized" } });
        if (roles.length && !roles.includes(user.role))
            return res.status(403).json({ error: { message: "Forbidden" } });
        next();
    };
}
