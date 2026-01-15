import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createLink, getLinks, deleteLink } from "../controllers/link.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createLink);
router.get("/", getLinks);
router.delete("/:id", deleteLink);

export default router;
