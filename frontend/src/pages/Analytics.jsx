import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/analytics.css";

function Analytics() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [categoryExpenses, setCategoryExpenses] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, categoryResponse] =
        await Promise.all([
          api.get(`/analytics/user/${user.userId}`),
          api.get(
            `/analytics/user/${user.userId}/category-wise`
          ),
        ]);

      setAnalytics(analyticsResponse.data);
      setCategoryExpenses(categoryResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const categoryData = useMemo(() => {
    return Object.entries(categoryExpenses)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount || 0),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [categoryExpenses]);

  const totalCategoryExpense = useMemo(() => {
    return categoryData.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }, [categoryData]);

  const topCategory = categoryData[0];

  const getCategoryPercentage = (amount) => {
    if (totalCategoryExpense <= 0) return 0;

    return (amount / totalCategoryExpense) * 100;
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-page">
        <div className="analytics-empty">
          <h2>No analytics available</h2>
          <p>
            Add some income or expense transactions to see
            your financial analytics.
          </p>
        </div>
      </div>
    );
  }

  const savingsRate = Number(
    analytics.savingsRate || 0
  );

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <div>
          <p className="page-eyebrow">
            FINANCIAL OVERVIEW
          </p>

          <h1>Analytics</h1>

          <p>
            Understand your income, expenses and spending
            patterns.
          </p>
        </div>

        <button
          className="refresh-analytics-btn"
          onClick={fetchAnalytics}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      {/* Main Metrics */}
      <div className="analytics-metrics">

        <div className="analytics-card income-card">
          <span>Total Income</span>
          <strong>
            {formatCurrency(analytics.totalIncome)}
          </strong>
          <small>
            Money received
          </small>
        </div>

        <div className="analytics-card expense-card">
          <span>Total Expense</span>
          <strong>
            {formatCurrency(analytics.totalExpense)}
          </strong>
          <small>
            Money spent
          </small>
        </div>

        <div className="analytics-card balance-card">
          <span>Balance</span>
          <strong
            className={
              Number(analytics.balance) >= 0
                ? "positive"
                : "negative"
            }
          >
            {formatCurrency(analytics.balance)}
          </strong>
          <small>
            Income − expenses
          </small>
        </div>

        <div className="analytics-card savings-card">
          <span>Savings Rate</span>
          <strong>
            {savingsRate.toFixed(1)}%
          </strong>
          <small>
            Based on total income
          </small>
        </div>

      </div>

      {/* Secondary Metrics */}
      <div className="analytics-secondary">

        <div className="secondary-card">
          <span>Total Transactions</span>
          <strong>
            {analytics.totalTransactions || 0}
          </strong>
        </div>

        <div className="secondary-card">
          <span>Spending Categories</span>
          <strong>
            {categoryData.length}
          </strong>
        </div>

        <div className="secondary-card">
          <span>Top Spending Category</span>
          <strong>
            {topCategory
              ? topCategory.category
              : "—"}
          </strong>
        </div>

      </div>

      {/* Financial Position */}
      <div className="analytics-section">

        <div className="section-heading">
          <div>
            <p className="page-eyebrow">
              FINANCIAL POSITION
            </p>

            <h2>Income vs Expense</h2>
          </div>
        </div>

        <div className="financial-comparison">

          <div className="comparison-item">

            <div className="comparison-label">
              <span>Income</span>

              <strong>
                {formatCurrency(
                  analytics.totalIncome
                )}
              </strong>
            </div>

            <div className="comparison-bar">
              <div
                className="income-bar"
                style={{
                  width: `${
                    Number(analytics.totalIncome) > 0
                      ? 100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

          <div className="comparison-item">

            <div className="comparison-label">
              <span>Expense</span>

              <strong>
                {formatCurrency(
                  analytics.totalExpense
                )}
              </strong>
            </div>

            <div className="comparison-bar">
              <div
                className="expense-bar"
                style={{
                  width: `${
                    Number(analytics.totalIncome) > 0
                      ? Math.min(
                          (Number(
                            analytics.totalExpense
                          ) /
                            Number(
                              analytics.totalIncome
                            )) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

        </div>

      </div>

      {/* Category-wise Expenses */}
      <div className="analytics-section">

        <div className="section-heading">
          <div>
            <p className="page-eyebrow">
              SPENDING BREAKDOWN
            </p>

            <h2>Category-wise Expenses</h2>
          </div>

          <span className="section-total">
            {formatCurrency(totalCategoryExpense)}
          </span>
        </div>

        {categoryData.length === 0 ? (
          <div className="category-empty">
            <p>
              No expense categories available yet.
            </p>
          </div>
        ) : (
          <div className="category-list">

            {categoryData.map((item) => {
              const percentage =
                getCategoryPercentage(
                  item.amount
                );

              return (
                <div
                  className="category-row"
                  key={item.category}
                >

                  <div className="category-info">

                    <div>
                      <strong>
                        {item.category}
                      </strong>

                      <span>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(item.amount)}
                    </strong>

                  </div>

                  <div className="category-progress">
                    <div
                      className="category-progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Savings Overview */}
      <div className="analytics-section">

        <div className="section-heading">
          <div>
            <p className="page-eyebrow">
              SAVINGS OVERVIEW
            </p>

            <h2>Savings Performance</h2>
          </div>
        </div>

        <div className="savings-overview">

          <div className="savings-circle-wrapper">

            <div
              className="savings-circle"
              style={{
                background: `conic-gradient(
                  #171a23 ${
                    Math.max(
                      Math.min(savingsRate, 100),
                      0
                    ) * 3.6
                  }deg,
                  #eceef3 0deg
                )`,
              }}
            >
              <div className="savings-circle-inner">
                <strong>
                  {savingsRate.toFixed(1)}%
                </strong>

                <span>
                  Savings Rate
                </span>
              </div>
            </div>

          </div>

          <div className="savings-details">

            <div>
              <span>Income</span>
              <strong>
                {formatCurrency(
                  analytics.totalIncome
                )}
              </strong>
            </div>

            <div>
              <span>Expenses</span>
              <strong>
                {formatCurrency(
                  analytics.totalExpense
                )}
              </strong>
            </div>

            <div>
              <span>Amount Saved</span>
              <strong>
                {formatCurrency(
                  analytics.balance
                )}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;