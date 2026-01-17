import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import "../styles/pages/tasks.css";

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

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [editingCompleted, setEditingCompleted] = useState(false);
    const [editingDueDate, setEditingDueDate] = useState<string | undefined>("");

    const token = localStorage.getItem("token")!;

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

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(token, id);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingTitle(task.title);
        setEditingDescription(task.description || "");
        setEditingCompleted(task.completed);
        setEditingDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingTitle("");
        setEditingDescription("");
        setEditingCompleted(false);
        setEditingDueDate("");
    };

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

    const toggleCompleted = async (task: Task) => {
        try {
            await updateTask(token, task.id, task.title, task.description, !task.completed, task.dueDate);
            setTasks(
                tasks.map((t) =>
                    t.id === task.id
                        ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
                        : t
                )
            );
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div className="page tasks-page">
            <h1 className="page-title">Your Tasks</h1>

            {/* Add Task Form */}
            <form className="form" onSubmit={handleAddTask}>
                <label className="form-label">Title</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input"
                    required
                />

                <label className="form-label">Description</label>
                <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="textarea"
                />

                <label className="form-label">Deadline</label>
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="input"
                />

                <button type="submit" className="button">
                    Add Task
                </button>
            </form>

            {/* Tasks List */}
            {tasks.length === 0 ? (
                <p>No tasks yet. Add one!</p>
            ) : (
                <ul className="tasks-list">
                    {tasks.map((task) => {
                        const overdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
                        const isEditing = editingTaskId === task.id;

                        return (
                            <li key={task.id} className="card task-card">
                                {isEditing ? (
                                    <>
                                        <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="input" />
                                        <textarea value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} className="textarea" />
                                        <label className="form-label">Deadline</label>
                                        <input type="date" value={editingDueDate || ""} onChange={(e) => setEditingDueDate(e.target.value)} className="input" />
                                        <label>
                                            <input type="checkbox" checked={editingCompleted} onChange={(e) => setEditingCompleted(e.target.checked)} /> Completed
                                        </label>
                                        <div className="task-actions">
                                            <button className="button" onClick={() => handleUpdate(task.id)}>Save</button>
                                            <button className="button secondary" onClick={cancelEditing}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="task-header">
                                            <h2 className={`task-title ${task.completed ? "completed-text" : ""}`}>{task.title}</h2>
                                            <button
                                                className={`complete-btn ${task.completed ? "completed" : ""}`}
                                                onClick={() => toggleCompleted(task)}
                                                title={task.completed ? "Mark as not done" : "Mark as done"}
                                            >
                                                {task.completed ? "Done!" : "In progress..."}
                                            </button>
                                        </div>
                                        {task.description && (
                                            <p className={`task-desc ${task.completed ? "completed-text" : ""}`}>{task.description}</p>
                                        )}
                                        {task.dueDate && (
                                            <p className={`task-deadline ${overdue ? "overdue" : ""}`}>
                                                Deadline: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                        <small className="task-updated">
                                            Last updated: {new Date(task.updatedAt).toLocaleString()}
                                        </small>
                                        <div className="task-actions">
                                            <button className="button secondary" onClick={() => startEditing(task)}>Edit</button>
                                            <button className="button secondary" onClick={() => handleDelete(task.id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                            </li>

                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Tasks;
