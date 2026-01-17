import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Links from "./pages/Links";
import Tasks from "./pages/Tasks";
import { JSX } from "react";
import Register from "./pages/Register";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/notes"
                    element={
                        <PrivateRoute>
                            <Notes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/links"
                    element={
                        <PrivateRoute>
                            <Links />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <Tasks />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
