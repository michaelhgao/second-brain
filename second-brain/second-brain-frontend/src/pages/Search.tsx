import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAll } from "../api/search";
import { Note, Link, Task } from "../types";
import "../styles/pages/search.css";

interface SearchResults {
    notes: Note[];
    links: Link[];
    tasks: Task[];
}

const Search: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token")!;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const data = await searchAll(token, query);
            setResults(data);
        } catch (err: any) {
            setError(err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    const totalResults = results
        ? results.notes.length + results.links.length + results.tasks.length
        : 0;

    return (
        <div className="page search-page">
            <button className="button secondary" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1 className="page-title">Search</h1>

            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search notes, links, and tasks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input search-input"
                    autoFocus
                />
                <button type="submit" className="button" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            {error && <p className="text-danger">Error: {error}</p>}

            {results && (
                <>
                    <p className="search-results-count">
                        Found {totalResults} result{totalResults !== 1 ? "s" : ""}
                    </p>

                    {results.notes.length > 0 && (
                        <div className="search-category">
                            <h2 className="category-title">Notes ({results.notes.length})</h2>
                            <ul className="results-list">
                                {results.notes.map((note) => (
                                    <li key={note.id} className="card result-item">
                                        <span className="result-icon">📝</span>
                                        <div className="result-content">
                                            <h3 className="result-title">{note.title}</h3>
                                            <p className="result-preview">{note.content}</p>
                                            <small className="result-date">
                                                Updated: {new Date(note.updatedAt).toLocaleString()}
                                            </small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results.links.length > 0 && (
                        <div className="search-category">
                            <h2 className="category-title">Links ({results.links.length})</h2>
                            <ul className="results-list">
                                {results.links.map((link) => (
                                    <li key={link.id} className="card result-item">
                                        <span className="result-icon">🔗</span>
                                        <div className="result-content">
                                            <h3 className="result-title">{link.title}</h3>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="result-link"
                                            >
                                                {link.url}
                                            </a>
                                            <small className="result-date">
                                                Updated: {new Date(link.updatedAt).toLocaleString()}
                                            </small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results.tasks.length > 0 && (
                        <div className="search-category">
                            <h2 className="category-title">Tasks ({results.tasks.length})</h2>
                            <ul className="results-list">
                                {results.tasks.map((task) => (
                                    <li key={task.id} className="card result-item">
                                        <span className="result-icon">❌</span>
                                        <div className="result-content">
                                            <h3 className="result-title">{task.title}</h3>
                                            {task.description && (
                                                <p className="result-preview">{task.description}</p>
                                            )}
                                            <span className={`task-status ${task.completed ? "completed" : "pending"}`}>
                                                {task.completed ? "Completed" : "Pending"}
                                            </span>
                                            <small className="result-date">
                                                Updated: {new Date(task.updatedAt).toLocaleString()}
                                            </small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {totalResults === 0 && (
                        <p className="no-results">No results found for "{query}"</p>
                    )}
                </>
            )}
        </div >
    );
};

export default Search;