import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { searchAll } from "../controllers/search.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", searchAll);

export default router;