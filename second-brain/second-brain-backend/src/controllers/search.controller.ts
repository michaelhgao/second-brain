import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export async function searchAll(req: AuthRequest, res: Response) {
    const { q } = req.query;
    const userId = req.userId!;

    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const query = q.toLowerCase();

    try {
        const [notes, links, tasks] = await Promise.all([
            prisma.note.findMany({
                where: {
                    userId,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { content: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
            }),
            prisma.link.findMany({
                where: {
                    userId,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { url: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
            }),
            prisma.task.findMany({
                where: {
                    userId,
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                orderBy: { updatedAt: "desc" },
            }),
        ]);

        res.json({ notes, links, tasks });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search" });
    }
}