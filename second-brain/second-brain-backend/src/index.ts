import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import protectedRoutes from "./routes/protected";
import notesRoutes from "./routes/notes";
import linksRoutes from "./routes/links";
import tasksRoutes from "./routes/tasks";
import mainRoutes from "./routes/main";
import searchRoutes from "./routes/search";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.use("/main", mainRoutes);

app.use("/notes", notesRoutes);
app.use("/links", linksRoutes);
app.use("/tasks", tasksRoutes);
app.use("/search", searchRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
