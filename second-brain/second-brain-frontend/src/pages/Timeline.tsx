import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotes } from "../api/notes";
import { fetchLinks } from "../api/links";
import { fetchTasks } from "../api/tasks";
import "../styles/pages/timeline.css";
import { Link, Note, Task } from "../types";

type TimelineItem = {
    id: string;
    type: "note" | "link" | "task";
    title: string;
    content?: string;
    url?: string;
    description?: string;
    completed?: boolean;
    createdAt: string;
    updatedAt: string;
};

const Timeline: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const token = localStorage.getItem("token")!;

    const loadAllItems = async () => {
        try {
            setLoading(true);
            const [notes, links, tasks] = await Promise.all([
                fetchNotes(token),
                fetchLinks(token),
                fetchTasks(token),
            ]);

            const timelineItems: TimelineItem[] = [
                ...notes.map((note: Note) => ({
                    id: note.id,
                    type: "note" as const,
                    title: note.title,
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                })),
                ...links.map((link: Link) => ({
                    id: link.id,
                    type: "link" as const,
                    title: link.title,
                    url: link.url,
                    createdAt: link.createdAt,
                    updatedAt: link.updatedAt,
                })),
                ...tasks.map((task: Task) => ({
                    id: task.id,
                    type: "task" as const,
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                })),
            ];

            setItems(timelineItems);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllItems();
    }, []);

    const sortedItems = [...items].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    const getItemIcon = (type: string) => {
        switch (type) {
            case "note":
                return "📝";
            case "link":
                return "🔗";
            case "task":
                return "❌";
            default:
                return "";
        }
    };

    if (loading) return <p>Loading timeline...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;


    return (
        <div className="page timeline-page">
            <button className="button secondary" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <h1 className="page-title">Timeline</h1>

            <div className="timeline-controls">
                <label>
                    Sort by:
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="input"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </label>
            </div>

            {sortedItems.length === 0 ? (
                <p>No items yet. Create some notes, links, or tasks!</p>
            ) : (
                <ul className="timeline-list">
                    {sortedItems.map((item) => (
                        <li key={`${item.type}-${item.id}`} className={`card timeline-item ${item.type}-item`}>
                            <div className="timeline-item-header">
                                <span className="timeline-item-icon">{getItemIcon(item.type)}</span>
                                <span className="timeline-item-type">{item.type}</span>
                            </div>
                            <h2 className="timeline-item-title">{item.title}</h2>

                            {item.type === "note" && item.content && (
                                <p className="timeline-item-content">{item.content}</p>
                            )}

                            {item.type === "link" && item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="timeline-item-link">
                                    {item.url}
                                </a>
                            )}

                            {item.type === "task" && (
                                <>
                                    {item.description && <p className="timeline-item-content">{item.description}</p>}
                                    <span className={`task-status ${item.completed ? "completed" : "pending"}`}>
                                        {item.completed ? "Completed" : "Pending"}
                                    </span>
                                </>
                            )}

                            <small className="timeline-item-date">
                                Updated: {new Date(item.updatedAt).toLocaleString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Timeline;