import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import NotesPage from "./pages/NotesPage";
import LinksPage from "./pages/LinksPage";
import TasksPage from "./pages/TasksPage";
import { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <MainPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <PrivateRoute>
                            <NotesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/links"
                    element={
                        <PrivateRoute>
                            <LinksPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
