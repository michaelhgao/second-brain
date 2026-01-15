import { AuthRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { getId } from "../utils/getId";

export async function createNote(req: AuthRequest, res: Response) {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content required" });
    }

    const note = await prisma.note.create({
        data: {
            title,
            content,
            userId: req.userId!
        }
    });

    res.status(201).json(note);
}

export async function getNotes(req: AuthRequest, res: Response) {
    const notes = await prisma.note.findMany({
        where: { userId: req.userId! },
        orderBy: { updatedAt: "desc" }
    });

    res.json(notes);
}

export async function updateNote(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);
    const { title, content } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const note = await prisma.note.updateMany({
        where: { id, userId: req.userId! },
        data: { title, content }
    });

    if (note.count === 0) {
        return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note updated" });
}

export async function deleteNote(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const note = await prisma.note.deleteMany({
        where: { id, userId: req.userId! }
    });

    if (note.count === 0) {
        return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
}