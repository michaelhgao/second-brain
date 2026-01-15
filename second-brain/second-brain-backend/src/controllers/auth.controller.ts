import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hashPassword, comparePasswords } from "../utils/hash";
import { signToken } from "../utils/jwt";

export async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    const token = signToken(user.id);

    res.status(201).json({ token });

}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);

    res.json({ token });
}