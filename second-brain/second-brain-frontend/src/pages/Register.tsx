import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/login.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const data = await register(email, password);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Create Account</h1>

                {error && <div className="login-error">{error}</div>}

                <label className="login-label">
                    Email
                    <input
                        type="email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </label>

                <label className="login-label">
                    Password
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </label>

                <label className="login-label">
                    Confirm Password
                    <input
                        type="password"
                        className="login-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </label>

                <button className="login-button" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                <div className="login-footer">
                    Already have an account? <Link to="/">Log in</Link>
                </div>
            </form>
        </div>
    );
}
