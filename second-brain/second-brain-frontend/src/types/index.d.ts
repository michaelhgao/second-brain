export interface Link {
    id: string;
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}