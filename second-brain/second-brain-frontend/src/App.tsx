import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NotesPage from "./pages/NotesPage";
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
                            <NotesPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
