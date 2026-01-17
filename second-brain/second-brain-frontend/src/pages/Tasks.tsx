import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";

interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New task state
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");

    // Editing task state
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [editingCompleted, setEditingCompleted] = useState(false);
    const [editingDueDate, setEditingDueDate] = useState<string | undefined>("");

    const token = localStorage.getItem("token")!;

    // Load tasks from backend
    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await fetchTasks(token);
            setTasks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // Add new task
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle) return;
        try {
            const task = await createTask(token, newTitle, newDescription, newDueDate || undefined);
            setTasks([task, ...tasks]);
            setNewTitle("");
            setNewDescription("");
            setNewDueDate("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Delete task
    const handleDelete = async (id: string) => {
        try {
            await deleteTask(token, id);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Start editing
    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingTitle(task.title);
        setEditingDescription(task.description || "");
        setEditingCompleted(task.completed);
        setEditingDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingTitle("");
        setEditingDescription("");
        setEditingCompleted(false);
        setEditingDueDate("");
    };

    // Update task
    const handleUpdate = async (id: string) => {
        try {
            await updateTask(token, id, editingTitle, editingDescription, editingCompleted, editingDueDate || undefined);
            setTasks(
                tasks.map((t) =>
                    t.id === id
                        ? {
                            ...t,
                            title: editingTitle,
                            description: editingDescription,
                            completed: editingCompleted,
                            dueDate: editingDueDate,
                            updatedAt: new Date().toISOString(),
                        }
                        : t
                )
            );
            cancelEditing();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Your Tasks</h1>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} style={{ marginBottom: "2rem" }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                />
                <label>
                    Deadline:
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                    />
                </label>
                <button type="submit">Add Task</button>
            </form>

            {/* Tasks List */}
            {tasks.length === 0 ? (
                <p>No tasks yet. Add one!</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}
                        >
                            {editingTaskId === task.id ? (
                                <>
                                    <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
                                    <input type="text" value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
                                    <label>
                                        Deadline:
                                        <input type="date" value={editingDueDate || ""} onChange={(e) => setEditingDueDate(e.target.value)} style={{ display: "block", marginBottom: "0.5rem", width: "100%" }} />
                                    </label>
                                    <label>
                                        Completed:
                                        <input type="checkbox" checked={editingCompleted} onChange={(e) => setEditingCompleted(e.target.checked)} />
                                    </label>
                                    <div>
                                        <button onClick={() => handleUpdate(task.id)}>Save</button>
                                        <button onClick={cancelEditing} style={{ marginLeft: "0.5rem" }}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>
                                        {task.title} {task.completed ? "(Completed)" : ""}
                                    </h2>
                                    {task.description && <p>{task.description}</p>}
                                    {task.dueDate && (
                                        <p style={{ color: new Date(task.dueDate) < new Date() ? "red" : "black" }}>
                                            Deadline: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    <small>Last updated: {new Date(task.updatedAt).toLocaleString()}</small>
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <button onClick={() => startEditing(task)}>Edit</button>
                                        <button onClick={() => handleDelete(task.id)} style={{ marginLeft: "0.5rem" }}>Delete</button>
                                    </div>
                                </>
                            )}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Tasks;
