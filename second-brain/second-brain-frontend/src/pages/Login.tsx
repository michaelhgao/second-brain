import "../styles/pages/login.css"

import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token); // store JWT
            navigate("/dashboard"); // redirect after login
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form
                onSubmit={handleSubmit}
                className="login-card"
            >
                <h1 className="login-title">Login</h1>

                {error && <p className="login-error">{error}</p>}

                <label className="login-label">
                    Email
                    <input
                        type="email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label className="login-label">
                    Password
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <button className="login-button" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="login-footer">
                    Your second brain awaits 🧠
                </div>
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </div>

            </form>
        </div>
    );
}
