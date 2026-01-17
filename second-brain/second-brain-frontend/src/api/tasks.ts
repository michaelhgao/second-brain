import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/tasks`;

export async function fetchTasks(token: string) {
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function createTask(token: string, title: string, description?: string, dueDate?: string) {
    const res = await axios.post(
        API_URL,
        { title, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function updateTask(
    token: string,
    id: string,
    title?: string,
    description?: string,
    completed?: boolean,
    dueDate?: string
) {
    const res = await axios.put(
        `${API_URL}/${id}`,
        { title, description, completed, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

// api/tasks.ts
export async function updateTaskCompletion(token: string, id: string, completed: boolean) {
    const res = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        { completed }, // only send completed
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}


export async function deleteTask(token: string, id: string) {
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
