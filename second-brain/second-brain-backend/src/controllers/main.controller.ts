import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getMain(req: AuthRequest, res: Response) {
    const userId = req.userId!;

    const [notesCount, linksCount, tasksCount] = await Promise.all([
        prisma.note.count({ where: { userId } }),
        prisma.link.count({ where: { userId } }),
        prisma.task.count({ where: { userId } }),
    ]);

    const [latestNotes, latestLinks, latestTasks] = await Promise.all([
        prisma.note.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            take: 3
        }),
        prisma.link.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3
        }),
        prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 3
        })
    ]);

    res.json({
        counts: {
            notes: notesCount,
            links: linksCount,
            tasks: tasksCount
        },
        latest: {
            notes: latestNotes,
            links: latestLinks,
            tasks: latestTasks
        }
    });
}
