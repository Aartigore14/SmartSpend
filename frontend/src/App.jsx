import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/dashboard"
                    element={<h1>Dashboard Coming Soon</h1>}
                />

                <Route
                    path="/register"
                    element={<h1>Register Coming Soon</h1>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;