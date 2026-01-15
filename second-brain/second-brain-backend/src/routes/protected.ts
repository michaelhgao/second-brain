import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    res.json({ message: `Hello user ${req.userId}` });
});

export default router;
