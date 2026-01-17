import React, { useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/notes";

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
                    n.id === id ? { ...n, title: editingTitle, content: editingContent, updatedAt: new Date().toISOString() } : n
                )
            );
            cancelEditing();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Your Notes</h1>

            <form onSubmit={handleAddNote} style={{ marginBottom: "2rem" }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                />
                <textarea
                    placeholder="Content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                />
                <button type="submit">Add Note</button>
            </form>

            {notes.length === 0 ? (
                <p>No notes yet. Add one!</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {notes.map((note) => (
                        <li
                            key={note.id}
                            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}
                        >
                            {editingNoteId === note.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                                    />
                                    <textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                                    />
                                    <button onClick={() => handleUpdate(note.id)}>Save</button>
                                    <button onClick={cancelEditing} style={{ marginLeft: "0.5rem" }}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2>{note.title}</h2>
                                    <p>{note.content}</p>
                                    <small>Last updated: {new Date(note.updatedAt).toLocaleString()}</small>
                                    <div style={{ marginTop: "0.5rem" }}>
                                        <button onClick={() => startEditing(note)}>Edit</button>
                                        <button onClick={() => handleDelete(note.id)} style={{ marginLeft: "0.5rem" }}>
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
