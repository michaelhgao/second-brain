import axios from "axios";

const API_URL = "http://localhost:3000/main";

export async function getDashboard(token: string) {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { counts, latest }
}
