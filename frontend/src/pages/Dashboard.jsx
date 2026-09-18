import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("User not found. Please login again.");
          return;
        }

        const response = await api.get(`/dashboard/user/${userId}`);

        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>SmartSpend Dashboard</h1>

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
        <p>{dashboard.savingsRate.toFixed(2)}%</p>
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