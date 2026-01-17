import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/auth`;

export async function login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // { token }
}

export async function register(email: string, password: string) {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data; // { token }
}