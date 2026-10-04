import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/transactions.css";

function Transactions() {
    const { user } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [typeFilter, setTypeFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        type: "EXPENSE",
        categoryId: "",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch transactions and categories
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

            const [transactionsResponse, categoriesResponse] =
                await Promise.all([
                    api.get(`/transactions/user/${user.userId}`),
                    api.get(`/categories/user/${user.userId}`),
                ]);

            setTransactions(transactionsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (err) {
            console.error("Failed to load transactions:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    // Form input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,

            // Clear category when transaction type changes
            ...(name === "type" ? { categoryId: "" } : {}),
        }));
    };

    // Open add form
    const handleAddClick = () => {
        setEditingTransaction(null);

        setFormData({
            type: "EXPENSE",
            categoryId: "",
            amount: "",
            description: "",
            transactionDate: new Date().toISOString().split("T")[0],
        });

        setError("");
        setShowForm(true);
    };

    // Open edit form
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);

        setFormData({
            type: transaction.type?.toUpperCase() || "EXPENSE",
            categoryId: transaction.categoryId,
            amount: transaction.amount,
            description: transaction.description || "",
            transactionDate: transaction.transactionDate,
        });

        setError("");
        setShowForm(true);
    };

    // Submit add/update
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId) {
            setError("Please select a category.");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const transactionData = {
                userId: user.userId,
                categoryId: Number(formData.categoryId),
                type: formData.type.toUpperCase(),
                amount: Number(formData.amount),
                description: formData.description,
                transactionDate: formData.transactionDate,
            };

            if (editingTransaction) {
                await api.put(
                    `/transactions/${editingTransaction.id}`,
                    transactionData
                );
            } else {
                await api.post(
                    "/transactions",
                    transactionData
                );
            }

            setShowForm(false);
            setEditingTransaction(null);

            await fetchData();
        } catch (err) {
            console.error("Failed to save transaction:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save transaction"
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete transaction
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/transactions/${id}`);

            setTransactions((previous) =>
                previous.filter(
                    (transaction) => transaction.id !== id
                )
            );
        } catch (err) {
            console.error("Failed to delete transaction:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete transaction"
            );
        }
    };

    // Get category name
    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (item) => Number(item.id) === Number(categoryId)
        );

        return category ? category.name : "Unknown";
    };

    // Filter transactions
    const filteredTransactions = transactions.filter(
        (transaction) => {
            const transactionType =
                transaction.type?.toUpperCase();

            const matchesType =
                typeFilter === "ALL" ||
                transactionType === typeFilter;

            const categoryName = getCategoryName(
                transaction.categoryId
            );

            const searchText = (
                `${categoryName} ${
                    transaction.description || ""
                }`
            ).toLowerCase();

            const matchesSearch =
                searchText.includes(
                    searchTerm.toLowerCase()
                );

            return matchesType && matchesSearch;
        }
    );

    if (loading) {
        return (
            <><Navbar/>
            <div className="transactions-page">
                <h2>Loading transactions...</h2>
            </div>
            </>
        );
    }

    return (
        <><Navbar/>
        <div className="transactions-page">

            {/* Header */}
            <div className="transactions-header">
                <div>
                    <h1>Transactions</h1>
                    <p>
                        Manage your income and expenses
                    </p>
                </div>

                <button
                    className="add-transaction-button"
                    onClick={handleAddClick}
                >
                    + Add Transaction
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="transaction-error">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="transaction-toolbar">

                <div className="transaction-filters">

                    <button
                        className={
                            typeFilter === "ALL"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setTypeFilter("ALL")
                        }
                    >
                        All
                    </button>

                    <button
                        className={
                            typeFilter === "INCOME"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setTypeFilter("INCOME")
                        }
                    >
                        Income
                    </button>

                    <button
                        className={
                            typeFilter === "EXPENSE"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setTypeFilter("EXPENSE")
                        }
                    >
                        Expense
                    </button>

                </div>

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="transaction-search"
                />

            </div>

            {/* Transactions Table */}
            <div className="transactions-card">

                {filteredTransactions.length === 0 ? (

                    <div className="empty-transactions">

                        <h3>
                            No transactions found
                        </h3>

                        <p>
                            Add your first transaction
                            to start tracking your finances.
                        </p>

                        <button
                            onClick={handleAddClick}
                        >
                            + Add Transaction
                        </button>

                    </div>

                ) : (

                    <div className="transactions-table-wrapper">

                        <table className="transactions-table">

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => {

                                        const transactionType =
                                            transaction.type?.toUpperCase();

                                        const isIncome =
                                            transactionType ===
                                            "INCOME";

                                        return (
                                            <tr
                                                key={
                                                    transaction.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        transaction.transactionDate
                                                    }
                                                </td>

                                                <td>
                                                    {getCategoryName(
                                                        transaction.categoryId
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        transaction.description ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            isIncome
                                                                ? "transaction-type income"
                                                                : "transaction-type expense"
                                                        }
                                                    >
                                                        {transactionType}
                                                    </span>

                                                </td>

                                                <td
                                                    className={
                                                        isIncome
                                                            ? "amount income"
                                                            : "amount expense"
                                                    }
                                                >
                                                    {isIncome
                                                        ? "+"
                                                        : "-"}

                                                    ₹
                                                    {Number(
                                                        transaction.amount
                                                    ).toFixed(2)}
                                                </td>

                                                <td>

                                                    <div className="transaction-actions">

                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    transaction
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    transaction.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Add/Edit Modal */}
            {showForm && (

                <div className="transaction-modal-overlay">

                    <div className="transaction-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingTransaction
                                        ? "Edit Transaction"
                                        : "Add Transaction"}
                                </h2>

                                <p>
                                    Enter your transaction
                                    details
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

                            {/* Type */}
                            <div className="form-group">

                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >

                                    <option value="EXPENSE">
                                        Expense
                                    </option>

                                    <option value="INCOME">
                                        Income
                                    </option>

                                </select>

                            </div>

                            {/* Category */}
                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
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
                                                formData.type.toUpperCase()
                                        )
                                        .map((category) => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {category.name}
                                            </option>

                                        ))}

                                </select>

                            </div>

                            {/* Amount */}
                            <div className="form-group">

                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label>Description</label>

                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Grocery shopping"
                                />
                            </div>

                            {/* Date */}
                            <div className="form-group">
                                <label>Date</label>

                                <input
                                    type="date"
                                    name="transactionDate"
                                    value={formData.transactionDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Buttons */}
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
                                        : editingTransaction
                                        ? "Update Transaction"
                                        : "Add Transaction"}
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

export default Transactions;