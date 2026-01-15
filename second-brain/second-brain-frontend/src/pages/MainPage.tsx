import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api/main";

interface DashboardData {
  counts: { notes: number; links: number; tasks: number };
  latest: {
    notes: any[];
    links: any[];
    tasks: any[];
  };
}

const MainPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) navigate("/"); // fallback

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
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Your Second Brain</h1>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div
          onClick={() => navigate("/notes")}
          style={{ cursor: "pointer", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}
        >
          <h2>Notes</h2>
          <p>{data?.counts.notes} total</p>
        </div>

        <div
          onClick={() => navigate("/links")}
          style={{ cursor: "pointer", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}
        >
          <h2>Links</h2>
          <p>{data?.counts.links} total</p>
        </div>

        <div
          onClick={() => navigate("/tasks")}
          style={{ cursor: "pointer", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}
        >
          <h2>Tasks</h2>
          <p>{data?.counts.tasks} total</p>
        </div>
      </div>

      <h3 style={{ marginTop: "2rem" }}>Latest Items</h3>
      <div>
        <h4>Notes</h4>
        <ul>
          {data?.latest.notes.map((n) => (
            <li key={n.id}>{n.title}</li>
          ))}
        </ul>

        <h4>Links</h4>
        <ul>
          {data?.latest.links.map((l) => (
            <li key={l.id}>{l.title}</li>
          ))}
        </ul>

        <h4>Tasks</h4>
        <ul>
          {data?.latest.tasks.map((t) => (
            <li key={t.id}>
              {t.title} {t.completed ? "(Completed)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
