import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/main";
import "../styles/pages/dashboard.css";

interface DashboardData {
    counts: { notes: number; links: number; tasks: number };
    latest: {
        notes: any[];
        links: any[];
        tasks: any[];
    };
}

const Dashboard: React.FC = () => {
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
            <h1>Welcome to Your Second Brain</h1>

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
                            <li key={l.id}>{l.title}</li>
                        ))}
                    </ul>
                </div>

                <div className="latest-category">
                    <h4>Tasks</h4>
                    <ul>
                        {data?.latest.tasks.map((t) => (
                            <li key={t.id} className={t.completed ? "completed" : ""}>
                                {t.title} {t.completed ? "(Completed)" : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
