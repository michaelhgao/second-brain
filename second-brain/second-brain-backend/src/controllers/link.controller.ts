import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { getId } from "../utils/getId";

export async function createLink(req: AuthRequest, res: Response) {
    const { title, url } = req.body;

    if (!title || !url) return res.status(400).json({ error: "Title and URL required" });

    const link = await prisma.link.create({
        data: {
            title,
            url,
            userId: req.userId!
        }
    });

    res.status(201).json(link);
}

export async function getLinks(req: AuthRequest, res: Response) {
    const links = await prisma.link.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: "desc" }
    });

    res.json(links);
}

export async function deleteLink(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const link = await prisma.link.deleteMany({
        where: { id, userId: req.userId! }
    });

    if (link.count === 0) return res.status(404).json({ error: "Link not found" });

    res.json({ message: "Link deleted" });
}

export async function updateLink(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);
    const { title, url } = req.body;

    if (!id) return res.status(400).json({ error: "ID is required" });
    if (!title || !url) return res.status(400).json({ error: "Title and URL required" });

    try {
        const updated = await prisma.link.updateMany({
            where: { id, userId: req.userId! },
            data: { title, url }
        });

        if (updated.count === 0) return res.status(404).json({ error: "Link not found" });

        const link = await prisma.link.findUnique({ where: { id } });

        res.json(link);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to update link" });
    }
}
