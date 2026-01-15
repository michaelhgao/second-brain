import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import protectedRoutes from "./routes/protected";
import notesRoutes from "./routes/notes";
import linksRoutes from "./routes/links";
import tasksRoutes from "./routes/tasks";
import mainRoutes from "./routes/main";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.use("/main", mainRoutes);

app.use("/notes", notesRoutes);
app.use("/links", linksRoutes);
app.use("/tasks", tasksRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
