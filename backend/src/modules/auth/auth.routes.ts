import { Router } from "express";
import { login, register, refresh, me } from "./auth.controller";
import { registerAdmin } from "./auth.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.post("/register", authenticate, authorize(Role.ADMIN), register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);
router.post("/register-admin", registerAdmin);

export default router;
