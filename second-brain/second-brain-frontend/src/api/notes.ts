import axios from "axios";

const API_URL = "http://localhost:3000/notes";

export async function fetchNotes(token: string) {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function createNote(token: string, title: string, content: string) {
    const res = await axios.post(
        API_URL,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function updateNote(token: string, id: string, title: string, content: string) {
    const res = await axios.put(
        `${API_URL}/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function deleteNote(token: string, id: string) {
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
