import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import RecurringTransactions from "./pages/RecurringTransactions";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/transactions" element={<Transactions />} />

                <Route path="/categories" element={<Categories />} />

                <Route path="/budgets" element={<Budgets />} />

                <Route
                    path="/savings-goals"
                    element={<SavingsGoals />}
                />

                <Route
                    path="/recurring-transactions"
                    element={<RecurringTransactions />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />

                <Route
                    path="/ai-insights"
                    element={<AIInsights />}
                />

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;