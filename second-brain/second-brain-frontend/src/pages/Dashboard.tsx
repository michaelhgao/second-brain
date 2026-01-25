import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import "../styles/pages/dashboard.css";
import { updateTaskCompletion } from "../api/tasks";
import { useTheme } from "../hooks/useTheme";

interface DashboardData {
    counts: { notes: number; links: number; tasks: number };
    latest: {
        notes: any[];
        links: any[];
        tasks: any[];
    };
}

const Dashboard: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard(token!);
                setData(res);
            } catch (err: any) {
                setError(err.message || "Failed to fetch dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="dashboard-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Welcome to Your Second Brain</h1>

                <button className="button secondary" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            <div className="dashboard-cards">
                <div
                    className="dashboard-card"
                    onClick={() => navigate("/notes")}
                >
                    <h2>Notes</h2>
                    <p>{data?.counts.notes} total</p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/links")}
                >
                    <h2>Links</h2>
                    <p>{data?.counts.links} total</p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/tasks")}
                >
                    <h2>Tasks</h2>
                    <p>{data?.counts.tasks} total</p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/timeline")}
                >
                    <h2>Timeline</h2>
                    <p>View all activity</p>
                </div>
                <div
                    className="dashboard-card"
                    onClick={() => navigate("/search")}
                >
                    <h2>Search</h2>
                    <p>Find anything</p>
                </div>
            </div>

            <div className="dashboard-latest">
                <h3>Latest Items</h3>

                <div className="latest-category">
                    <h4>Notes</h4>
                    <ul>
                        {data?.latest.notes.map((n) => (
                            <li key={n.id}>{n.title}</li>
                        ))}
                    </ul>
                </div>

                <div className="latest-category">
                    <h4>Links</h4>
                    <ul>
                        {data?.latest.links.map((l) => (
                            <li key={l.id}>
                                <a href={l.url} target="_blank" rel="noreferrer" className="latest-link">
                                    {l.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="latest-category">
                    <h4>Tasks</h4>
                    <ul>
                        {data?.latest.tasks.map((t) => (
                            <li key={t.id} className="task-card">
                                <div className="task-header">
                                    <span className={`task-title ${t.completed ? "completed-text" : ""}`}>
                                        {t.title}
                                    </span>
                                    <button
                                        className={`complete-btn ${t.completed ? "completed" : ""}`}
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem("token")!;
                                                await updateTaskCompletion(token, t.id, !t.completed);

                                                // Update local dashboard state
                                                setData((prev) =>
                                                    prev
                                                        ? {
                                                            ...prev,
                                                            latest: {
                                                                ...prev.latest,
                                                                tasks: prev.latest.tasks.map((task) =>
                                                                    task.id === t.id ? { ...task, completed: !task.completed } : task
                                                                ),
                                                            },
                                                        }
                                                        : prev
                                                );
                                            } catch (err) {
                                                console.error("Failed to toggle task completion", err);
                                            }
                                        }}
                                    >
                                        {t.completed ? "Done!" : "In progress..."}
                                    </button>
                                </div>
                                {t.dueDate && (
                                    <p className={`task-deadline ${new Date(t.dueDate) < new Date() ? "overdue" : ""}`}>
                                        Deadline: {new Date(t.dueDate).toLocaleDateString()}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>


            </div>
        </div>
    );
};

export default Dashboard;
