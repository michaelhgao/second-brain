import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMain } from "../controllers/main.controller";

const router = Router();

router.get("/", authMiddleware, getMain);

export default router;
