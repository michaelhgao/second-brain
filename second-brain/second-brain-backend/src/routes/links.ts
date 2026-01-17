import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createLink, getLinks, deleteLink, updateLink } from "../controllers/link.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createLink);
router.get("/", getLinks);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);

export default router;
