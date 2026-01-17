import React, { useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/notes";
import "../styles/pages/notes.css";

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingContent, setEditingContent] = useState("");

    const token = localStorage.getItem("token")!;

    const loadNotes = async () => {
        try {
            setLoading(true);
            const data = await fetchNotes(token);
            setNotes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newContent) return;
        try {
            const note = await createNote(token, newTitle, newContent);
            setNotes([note, ...notes]);
            setNewTitle("");
            setNewContent("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNote(token, id);
            setNotes(notes.filter((n) => n.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const startEditing = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingTitle(note.title);
        setEditingContent(note.content);
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
        setEditingTitle("");
        setEditingContent("");
    };

    const handleUpdate = async (id: string) => {
        try {
            await updateNote(token, id, editingTitle, editingContent);
            setNotes(
                notes.map((n) =>
                    n.id === id
                        ? { ...n, title: editingTitle, content: editingContent, updatedAt: new Date().toISOString() }
                        : n
                )
            );
            cancelEditing();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="text-danger">Error: {error}</p>;

    return (
        <div className="page notes-page">
            <h1 className="page-title">Your Notes</h1>

            <form className="form" onSubmit={handleAddNote}>
                <label className="form-label">Title</label>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input"
                    required
                />
                <label className="form-label">Content</label>
                <textarea
                    placeholder="Content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="textarea"
                    required
                />
                <button type="submit" className="button">
                    Add Note
                </button>
            </form>

            {notes.length === 0 ? (
                <p>No notes yet. Add one!</p>
            ) : (
                <ul className="notes-list">
                    {notes.map((note) => (
                        <li key={note.id} className="card note-card">
                            {editingNoteId === note.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="input"
                                    />
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="textarea"
                                    />
                                    <div className="note-actions">
                                        <button className="button" onClick={() => handleUpdate(note.id)}>
                                            Save
                                        </button>
                                        <button className="button secondary" onClick={cancelEditing}>
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="note-title">{note.title}</h2>
                                    <p className="note-content">{note.content}</p>
                                    <small className="note-updated">
                                        Last updated: {new Date(note.updatedAt).toLocaleString()}
                                    </small>
                                    <div className="note-actions">
                                        <button className="button secondary" onClick={() => startEditing(note)}>
                                            Edit
                                        </button>
                                        <button className="button secondary" onClick={() => handleDelete(note.id)}>
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

export default Notes;
