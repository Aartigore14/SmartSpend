import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
    const { user, logout } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!user?.userId) {
                setError("User not found. Please login again.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `/dashboard/users/${user.userId}`
                );

                setDashboard(response.data);
            } catch (err) {
                console.error("Dashboard error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [user]);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>{error}</h2>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>SmartSpend Dashboard</h1>

            <p>Welcome, {user?.name}</p>

            <button onClick={logout}>
                Logout
            </button>

            <div>
                <h3>Total Income</h3>
                <p>₹{dashboard.totalIncome}</p>
            </div>

            <div>
                <h3>Total Expense</h3>
                <p>₹{dashboard.totalExpense}</p>
            </div>

            <div>
                <h3>Balance</h3>
                <p>₹{dashboard.balance}</p>
            </div>

            <div>
                <h3>Savings Rate</h3>
                <p>
                    {dashboard.savingsRate?.toFixed(2)}%
                </p>
            </div>

            <div>
                <h3>Total Transactions</h3>
                <p>{dashboard.totalTransactions}</p>
            </div>

            <div>
                <h3>Top Spending Category</h3>
                <p>{dashboard.topSpendingCategory}</p>
            </div>

            <div>
                <h3>Active Budgets</h3>
                <p>{dashboard.activeBudgets}</p>
            </div>

            <div>
                <h3>Budgets Exceeded</h3>
                <p>{dashboard.budgetsExceeded}</p>
            </div>

            <div>
                <h3>Active Savings Goals</h3>
                <p>{dashboard.activeSavingsGoals}</p>
            </div>

            <div>
                <h3>Unread Notifications</h3>
                <p>{dashboard.unreadNotifications}</p>
            </div>
        </div>
    );
}

export default Dashboard;