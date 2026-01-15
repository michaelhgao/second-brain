import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/note.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
