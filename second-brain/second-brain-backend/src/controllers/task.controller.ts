import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { getId } from "../utils/getId";

export async function createTask(req: AuthRequest, res: Response) {
    const { title, description, dueDate } = req.body;

    if (!title) return res.status(400).json({ error: "Title required" });

    const task = await prisma.task.create({
        data: {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: req.userId!
        }
    });

    res.status(201).json(task);
}

export async function getTasks(req: AuthRequest, res: Response) {
    const tasks = await prisma.task.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: "desc" }
    });

    res.json(tasks);
}

export async function updateTask(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);
    const { title, description, completed, dueDate } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const task = await prisma.task.updateMany({
        where: { id, userId: req.userId! },
        data: {
            title,
            description,
            completed,
            dueDate: dueDate ? new Date(dueDate) : null
        }
    });

    if (task.count === 0) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task updated" });
}

export async function deleteTask(req: AuthRequest, res: Response) {
    const id = getId(req.params.id);

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    const task = await prisma.task.deleteMany({
        where: { id, userId: req.userId! }
    });

    if (task.count === 0) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted" });
}
