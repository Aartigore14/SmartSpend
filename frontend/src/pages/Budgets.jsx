import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/budgets.css";

function Budgets() {
    const { user } = useAuth();

    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [analyses, setAnalyses] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const [formData, setFormData] = useState({
        categoryId: "",
        amount: "",
        period: "MONTHLY",
        startDate: "",
        endDate: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.userId) {
            setError("User not found. Please login again.");
            setLoading(false);
            return;
        }

        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                budgetsResponse,
                categoriesResponse,
                analysisResponse,
            ] = await Promise.all([
                api.get(`/budgets/user/${user.userId}`),
                api.get(`/categories/user/${user.userId}`),
                api.get(`/budgets/user/${user.userId}/analysis`),
            ]);

            setBudgets(budgetsResponse.data);
            setCategories(categoriesResponse.data);
            setAnalyses(analysisResponse.data);
        } catch (err) {
            console.error("Failed to load budgets:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load budgets"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddClick = () => {
        setEditingBudget(null);

        setFormData({
            categoryId: "",
            amount: "",
            period: "MONTHLY",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
        });

        setError("");
        setShowForm(true);
    };

    const handleEditClick = (budget) => {
        setEditingBudget(budget);

        setFormData({
            categoryId: budget.categoryId,
            amount: budget.amount,
            period: budget.period,
            startDate: budget.startDate,
            endDate: budget.endDate,
        });

        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId) {
            setError("Please select a category.");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Please enter a valid budget amount.");
            return;
        }

        if (!formData.startDate || !formData.endDate) {
            setError("Please select the budget date range.");
            return;
        }

        if (formData.endDate < formData.startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const budgetData = {
                userId: user.userId,
                categoryId: Number(formData.categoryId),
                amount: Number(formData.amount),
                period: formData.period,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            if (editingBudget) {
                await api.put(
                    `/budgets/${editingBudget.id}`,
                    budgetData
                );
            } else {
                await api.post(
                    "/budgets",
                    budgetData
                );
            }

            setShowForm(false);
            setEditingBudget(null);

            await fetchData();
        } catch (err) {
            console.error("Failed to save budget:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save budget"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/budgets/${id}`);

            setBudgets((previous) =>
                previous.filter(
                    (budget) => budget.id !== id
                )
            );

            await fetchData();
        } catch (err) {
            console.error("Failed to delete budget:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete budget"
            );
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (item) =>
                Number(item.id) === Number(categoryId)
        );

        return category
            ? category.name
            : "Unknown";
    };

    const getAnalysis = (budget) => {
        return analyses.find(
            (analysis) =>
                analysis.category?.toLowerCase() ===
                getCategoryName(budget.categoryId).toLowerCase()
        );
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case "EXCEEDED":
                return "budget-status exceeded";

            case "WARNING":
                return "budget-status warning";

            default:
                return "budget-status on-track";
        }
    };

    if (loading) {
        return (
            <><Navbar/>
            <div className="budgets-page">
                <h2>Loading budgets...</h2>
            </div>
            </>
        );
    
    }

    return (
        <><Navbar/>
        <div className="budgets-page">

            {/* Header */}
            <div className="budgets-header">

                <div>
                    <h1>Budgets</h1>
                    <p>
                        Plan and monitor your spending
                    </p>
                </div>

                <button
                    className="add-budget-button"
                    onClick={handleAddClick}
                >
                    + Add Budget
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="budget-error">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className="budget-summary">

                <div className="budget-summary-card">
                    <span>Total Budgets</span>
                    <strong>{budgets.length}</strong>
                </div>

                <div className="budget-summary-card">
                    <span>On Track</span>
                    <strong>
                        {
                            analyses.filter(
                                (item) =>
                                    item.status?.toUpperCase() ===
                                    "ON_TRACK"
                            ).length
                        }
                    </strong>
                </div>

                <div className="budget-summary-card">
                    <span>Warnings</span>
                    <strong>
                        {
                            analyses.filter(
                                (item) =>
                                    item.status?.toUpperCase() ===
                                    "WARNING"
                            ).length
                        }
                    </strong>
                </div>

                <div className="budget-summary-card">
                    <span>Exceeded</span>
                    <strong>
                        {
                            analyses.filter(
                                (item) =>
                                    item.status?.toUpperCase() ===
                                    "EXCEEDED"
                            ).length
                        }
                    </strong>
                </div>

            </div>

            {/* Budget Cards */}
            <div className="budgets-grid">

                {budgets.length === 0 ? (

                    <div className="empty-budgets">

                        <div className="empty-budget-icon">
                            💰
                        </div>

                        <h3>
                            No budgets found
                        </h3>

                        <p>
                            Create a budget to start
                            monitoring your spending.
                        </p>

                        <button
                            onClick={handleAddClick}
                        >
                            + Add Budget
                        </button>

                    </div>

                ) : (

                    budgets.map((budget) => {

                        const analysis =
                            getAnalysis(budget);

                        const percentage =
                            Math.min(
                                analysis?.percentageUsed || 0,
                                100
                            );

                        const status =
                            analysis?.status ||
                            "ON_TRACK";

                        return (
                            <div
                                className="budget-card"
                                key={budget.id}
                            >

                                <div className="budget-card-header">

                                    <div>
                                        <h3>
                                            {getCategoryName(
                                                budget.categoryId
                                            )}
                                        </h3>

                                        <span className="budget-period">
                                            {budget.period}
                                        </span>
                                    </div>

                                    <span
                                        className={getStatusClass(
                                            status
                                        )}
                                    >
                                        {status.replace(
                                            "_",
                                            " "
                                        )}
                                    </span>

                                </div>

                                <div className="budget-amount-row">

                                    <div>
                                        <span>
                                            Budget
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                analysis?.budgetAmount ??
                                                budget.amount
                                            ).toFixed(2)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Spent
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                analysis?.spendAmount ||
                                                0
                                            ).toFixed(2)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Remaining
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                analysis?.remainingAmount ??
                                                budget.amount
                                            ).toFixed(2)}
                                        </strong>
                                    </div>

                                </div>

                                <div className="budget-progress-section">

                                    <div className="budget-progress-info">

                                        <span>
                                            Budget used
                                        </span>

                                        <strong>
                                            {Number(
                                                analysis?.percentageUsed ||
                                                0
                                            ).toFixed(1)}
                                            %
                                        </strong>

                                    </div>

                                    <div className="budget-progress">

                                        <div
                                            className={
                                                status.toUpperCase() ===
                                                "EXCEEDED"
                                                    ? "budget-progress-bar exceeded"
                                                    : status.toUpperCase() ===
                                                      "WARNING"
                                                    ? "budget-progress-bar warning"
                                                    : "budget-progress-bar"
                                            }
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                                <div className="budget-dates">

                                    <span>
                                        {budget.startDate}
                                    </span>

                                    <span>
                                        →
                                    </span>

                                    <span>
                                        {budget.endDate}
                                    </span>

                                </div>

                                <div className="budget-actions">

                                    <button
                                        onClick={() =>
                                            handleEditClick(
                                                budget
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                budget.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>

            {/* Add/Edit Modal */}
            {showForm && (

                <div className="budget-modal-overlay">

                    <div className="budget-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingBudget
                                        ? "Edit Budget"
                                        : "Add Budget"}
                                </h2>

                                <p>
                                    Set a spending limit
                                    for a category
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Category */}
                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="categoryId"
                                    value={
                                        formData.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories
                                        .filter(
                                            (category) =>
                                                category.type
                                                    ?.toUpperCase() ===
                                                "EXPENSE"
                                        )
                                        .map(
                                            (category) => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}

                                </select>

                            </div>

                            {/* Amount */}
                            <div className="form-group">

                                <label>
                                    Budget Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={
                                        formData.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter budget amount"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />

                            </div>

                            {/* Period */}
                            <div className="form-group">

                                <label>
                                    Period
                                </label>

                                <select
                                    name="period"
                                    value={
                                        formData.period
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="MONTHLY">
                                        Monthly
                                    </option>

                                    <option value="WEEKLY">
                                        Weekly
                                    </option>

                                    <option value="YEARLY">
                                        Yearly
                                    </option>

                                    <option value="CUSTOM">
                                        Custom
                                    </option>

                                </select>

                            </div>

                            {/* Start Date */}
                            <div className="form-group">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={
                                        formData.startDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* End Date */}
                            <div className="form-group">

                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={
                                        formData.endDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* Actions */}
                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBudget
                                        ? "Update Budget"
                                        : "Add Budget"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
        </>
    );
}

export default Budgets;