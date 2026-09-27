import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/dashboard.css";

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
                    `/dashboard/user/${user.userId}`
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
        return (
            <div className="dashboard-loading">
                <h2>Loading SmartSpend...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>{error}</h2>

                <button onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1>SmartSpend</h1>
                    <p>Personal Finance Dashboard</p>
                </div>

                <div className="user-section">
                    <span>
                        Welcome, {user?.name || "User"}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-content">

                <div className="dashboard-title">
                    <h2>Dashboard</h2>
                    <p>Here's your financial overview</p>
                </div>

                {/* Summary Cards */}
                <div className="summary-grid">

                    <div className="summary-card income-card">
                        <div className="card-icon">💰</div>

                        <div>
                            <h3>Total Income</h3>
                            <p>
                                ₹{dashboard.totalIncome?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    </div>

                    <div className="summary-card expense-card">
                        <div className="card-icon">💸</div>

                        <div>
                            <h3>Total Expense</h3>
                            <p>
                                ₹{dashboard.totalExpense?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    </div>

                    <div className="summary-card balance-card">
                        <div className="card-icon">💵</div>

                        <div>
                            <h3>Balance</h3>
                            <p>
                                ₹{dashboard.balance?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    </div>

                    <div className="summary-card savings-card">
                        <div className="card-icon">📈</div>

                        <div>
                            <h3>Savings Rate</h3>
                            <p>
                                {dashboard.savingsRate?.toFixed(2) || "0.00"}%
                            </p>
                        </div>
                    </div>

                </div>

                {/* Additional Information */}
                <div className="dashboard-grid">

                    <div className="dashboard-panel">
                        <h3>📊 Spending Overview</h3>

                        <div className="info-row">
                            <span>Total Transactions</span>
                            <strong>
                                {dashboard.totalTransactions}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Top Spending Category</span>
                            <strong>
                                {dashboard.topSpendingCategory || "None"}
                            </strong>
                        </div>
                    </div>

                    <div className="dashboard-panel">
                        <h3>💰 Financial Summary</h3>

                        <div className="info-row">
                            <span>Active Budgets</span>
                            <strong>
                                {dashboard.activeBudgets}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Budgets Exceeded</span>
                            <strong>
                                {dashboard.budgetsExceeded}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Active Savings Goals</span>
                            <strong>
                                {dashboard.activeSavingsGoals}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Unread Notifications</span>
                            <strong>
                                {dashboard.unreadNotifications}
                            </strong>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default Dashboard;