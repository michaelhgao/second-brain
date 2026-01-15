import React, { useEffect, useState } from "react";
import { fetchLinks, createLink, updateLink, deleteLink } from "../api/links";

interface Link {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

const LinksPage: React.FC = () => {
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
          l.id === id ? { ...l, title: editingTitle, url: editingUrl } : l
        )
      );
      cancelEditing();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading links...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Links</h1>

      <form onSubmit={handleAddLink} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />
        <input
          type="url"
          placeholder="URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          required
          style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
        />
        <button type="submit">Add Link</button>
      </form>

      {links.length === 0 ? (
        <p>No links yet. Add one!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((link) => (
            <li
              key={link.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              {editingLinkId === link.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                  />
                  <input
                    type="url"
                    value={editingUrl}
                    onChange={(e) => setEditingUrl(e.target.value)}
                    style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
                  />
                  <button onClick={() => handleUpdate(link.id)}>Save</button>
                  <button onClick={cancelEditing} style={{ marginLeft: "0.5rem" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title}
                    </a>
                  </h2>
                  <div style={{ marginTop: "0.5rem" }}>
                    <button onClick={() => startEditing(link)}>Edit</button>
                    <button onClick={() => handleDelete(link.id)} style={{ marginLeft: "0.5rem" }}>
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

export default LinksPage;
