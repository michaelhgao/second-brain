import axios from "axios";

const API_URL = "http://localhost:3000/links";

export async function fetchLinks(token: string) {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function createLink(token: string, title: string, url: string) {
    const res = await axios.post(
        API_URL,
        { title, url },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function updateLink(token: string, id: string, title: string, url: string) {
    const res = await axios.put(
        `${API_URL}/${id}`,
        { title, url },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function deleteLink(token: string, id: string) {
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
