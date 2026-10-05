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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

                <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/transactions"
    element={
        <ProtectedRoute>
            <Transactions />
        </ProtectedRoute>
    }
/>

<Route
    path="/categories"
    element={
        <ProtectedRoute>
            <Categories />
        </ProtectedRoute>
    }
/>

<Route
    path="/budgets"
    element={
        <ProtectedRoute>
            <Budgets />
        </ProtectedRoute>
    }
/>

<Route
    path="/savings-goals"
    element={
        <ProtectedRoute>
            <SavingsGoals />
        </ProtectedRoute>
    }
/>

<Route
    path="/recurring-transactions"
    element={
        <ProtectedRoute>
            <RecurringTransactions />
        </ProtectedRoute>
    }
/>

<Route
    path="/notifications"
    element={
        <ProtectedRoute>
            <Notifications />
        </ProtectedRoute>
    }
/>

<Route
    path="/analytics"
    element={
        <ProtectedRoute>
            <Analytics />
        </ProtectedRoute>
    }
/>

<Route
    path="/ai-insights"
    element={
        <ProtectedRoute>
            <AIInsights />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;