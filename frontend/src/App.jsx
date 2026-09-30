import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<Dashboard />} /> 

                <Route path="/transactions" element={<Transactions/>}/>
                 <Route path="/categories" element={<Categories/>}/>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
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