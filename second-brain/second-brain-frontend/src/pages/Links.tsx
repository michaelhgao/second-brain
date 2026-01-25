import React, { useEffect, useState } from "react";
import { fetchLinks, createLink, updateLink, deleteLink } from "../api/links";
import "../styles/pages/links.css";
import { useNavigate } from "react-router-dom";
import { Link } from "../types";


const Links: React.FC = () => {
    const navigate = useNavigate();
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingUrl, setEditingUrl] = useState("");

    const token = localStorage.getItem("token")!;

    const loadLinks = async () => {
        try {
            setLoading(true);
            const data = await fetchLinks(token);
            setLinks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newUrl) return;
        try {
            const link = await createLink(token, newTitle, newUrl);
            setLinks([link, ...links]);
            setNewTitle("");
            setNewUrl("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteLink(token, id);
            setLinks(links.filter((l) => l.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startEditing = (link: Link) => {
        setEditingLinkId(link.id);
        setEditingTitle(link.title);
        setEditingUrl(link.url);
    };

    const cancelEditing = () => {
        setEditingLinkId(null);
        setEditingTitle("");
        setEditingUrl("");
    };

    const handleUpdate = async (id: string) => {
        try {
            await updateLink(token, id, editingTitle, editingUrl);
            setLinks(
                links.map((l) =>
                    l.id === id ? { ...l, title: editingTitle, url: editingUrl, updatedAt: new Date().toISOString() } : l
                )
            );
            cancelEditing();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading links...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div className="page links-page">
            <button className="button secondary" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1 className="page-title">Your Links</h1>

            <form className="form" onSubmit={handleAddLink}>
                <label className="form-label">Title</label>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input"
                    required
                />
                <label className="form-label">URL</label>
                <input
                    type="url"
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="input"
                    required
                />
                <button type="submit" className="button">
                    Add Link
                </button>
            </form>

            {links.length === 0 ? (
                <p>No links yet. Add one!</p>
            ) : (
                <ul className="links-list">
                    {links.map((link) => (
                        <li key={link.id} className="card link-card">
                            {editingLinkId === link.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="input"
                                    />
                                    <input
                                        type="url"
                                        value={editingUrl}
                                        onChange={(e) => setEditingUrl(e.target.value)}
                                        className="input"
                                    />
                                    <div className="link-actions">
                                        <button
                                            className="button"
                                            onClick={() => handleUpdate(link.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="button secondary"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="link-title"
                                        >
                                            {link.title}
                                        </a>
                                    </h2>
                                    <div className="link-actions">
                                        <button
                                            className="button secondary"
                                            onClick={() => startEditing(link)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button secondary"
                                            onClick={() => handleDelete(link.id)}
                                        >
                                            Delete
                                        </button>
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

export default Links;
