import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/main`;

export async function getDashboard(token: string) {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { counts, latest }
}
