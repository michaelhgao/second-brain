import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/search`;

export async function searchAll(token: string, query: string) {
    const res = await axios.get(`${API_URL}?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}