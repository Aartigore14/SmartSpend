import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/recurring-transactions.css";

const initialForm = {
  categoryId: "",
  type: "EXPENSE",
  amount: "",
  frequency: "MONTHLY",
  startDate: "",
  endDate: "",
  description: "",
  active: true,
  status: "ACTIVE",
};

function RecurringTransactions() {
  const { user } = useAuth();

  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [recurringResponse, categoriesResponse] =
        await Promise.all([
          api.get(
            `/recurring-transactions/user/${user.userId}`
          ),
          api.get(`/categories/user/${user.userId}`),
        ]);

      setRecurringTransactions(recurringResponse.data);
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load recurring transactions.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;

    setFormData((prev) => ({
      ...prev,
      type: newType,
      categoryId: "",
    }));
  };

  const openAddForm = () => {
    setEditingTransaction(null);
    setFormData(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      categoryId: transaction.categoryId || "",
      type: transaction.type?.toUpperCase() || "EXPENSE",
      amount: transaction.amount || "",
      frequency:
        transaction.frequency?.toUpperCase() || "MONTHLY",
      startDate: transaction.startDate || "",
      endDate: transaction.endDate || "",
      description: transaction.description || "",
      active: transaction.active ?? true,
      status: transaction.status || "ACTIVE",
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(formData.amount);

    if (!formData.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.startDate) {
      setError("Please select a start date.");
      return;
    }

    if (
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        userId: user.userId,
        categoryId: Number(formData.categoryId),
        type: formData.type.toUpperCase(),
        amount,
        frequency: formData.frequency.toUpperCase(),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        description: formData.description.trim() || null,
        active: formData.active,
        status: formData.status,
      };

      if (editingTransaction) {
        await api.put(
          `/recurring-transactions/${editingTransaction.id}`,
          payload
        );
      } else {
        await api.post(
          "/recurring-transactions",
          payload
        );
      }

      closeForm();
      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save recurring transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recurring transaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/recurring-transactions/${id}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete recurring transaction.");
    }
  };

  const toggleActive = async (transaction) => {
    try {
      const payload = {
        userId: user.userId,
        categoryId: transaction.categoryId,
        type: transaction.type?.toUpperCase(),
        amount: transaction.amount,
        frequency: transaction.frequency?.toUpperCase(),
        startDate: transaction.startDate,
        endDate: transaction.endDate || null,
        description: transaction.description || null,
        active: !transaction.active,
        status: !transaction.active
          ? "ACTIVE"
          : "PAUSED",
      };

      await api.put(
        `/recurring-transactions/${transaction.id}`,
        payload
      );

      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to update recurring transaction.");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId)
    );

    return category?.name || "Unknown Category";
  };

  const getFilteredCategories = () => {
    return categories.filter(
      (category) =>
        category.type?.toUpperCase() ===
        formData.type.toUpperCase()
    );
  };

  const activeCount = recurringTransactions.filter(
    (item) => item.active
  ).length;

  const pausedCount = recurringTransactions.filter(
    (item) => !item.active
  ).length;

  const expenseCount = recurringTransactions.filter(
    (item) =>
      item.type?.toUpperCase() === "EXPENSE"
  ).length;

  const incomeCount = recurringTransactions.filter(
    (item) =>
      item.type?.toUpperCase() === "INCOME"
  ).length;

  if (loading) {
    return (
      <div className="recurring-page">
        <div className="recurring-loading">
          Loading recurring transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="recurring-page">

      {/* Header */}
      <div className="recurring-header">
        <div>
          <p className="page-eyebrow">
            AUTOMATED TRANSACTIONS
          </p>

          <h1>Recurring Transactions</h1>

          <p>
            Automatically manage regular income and expenses
            such as subscriptions, rent, and salary.
          </p>
        </div>

        <button
          className="add-recurring-btn"
          onClick={openAddForm}
        >
          + Add Recurring
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="recurring-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="recurring-summary">

        <div className="summary-card">
          <span>Total</span>
          <strong>
            {recurringTransactions.length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="summary-card">
          <span>Paused</span>
          <strong>{pausedCount}</strong>
        </div>

        <div className="summary-card">
          <span>Expenses / Income</span>
          <strong>
            {expenseCount} / {incomeCount}
          </strong>
        </div>

      </div>

      {/* Empty State */}
      {recurringTransactions.length === 0 ? (
        <div className="recurring-empty">

          <div className="empty-icon">🔄</div>

          <h2>No recurring transactions</h2>

          <p>
            Add recurring expenses or income to automate
            regular transactions.
          </p>

          <button
            className="empty-add-btn"
            onClick={openAddForm}
          >
            Add Your First Recurring Transaction
          </button>

        </div>
      ) : (
        <div className="recurring-grid">

          {recurringTransactions.map((transaction) => {

            const type =
              transaction.type?.toUpperCase();

            const frequency =
              transaction.frequency?.toUpperCase();

            return (
              <div
                className="recurring-card"
                key={transaction.id}
              >

                {/* Card Header */}
                <div className="recurring-card-header">

                  <div>
                    <h2>
                      {transaction.description ||
                        getCategoryName(
                          transaction.categoryId
                        )}
                    </h2>

                    <p>
                      {getCategoryName(
                        transaction.categoryId
                      )}
                    </p>
                  </div>

                  <span
                    className={`recurring-status ${
                      transaction.active
                        ? "active"
                        : "paused"
                    }`}
                  >
                    {transaction.active
                      ? "ACTIVE"
                      : "PAUSED"}
                  </span>

                </div>

                {/* Amount */}
                <div className="recurring-amount-row">

                  <div>
                    <span>Amount</span>

                    <strong
                      className={
                        type === "INCOME"
                          ? "income"
                          : "expense"
                      }
                    >
                      {type === "INCOME"
                        ? "+"
                        : "-"}
                      ₹
                      {Number(
                        transaction.amount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Frequency</span>

                    <strong>
                      {frequency}
                    </strong>
                  </div>

                </div>

                {/* Dates */}
                <div className="recurring-details">

                  <div>
                    <span>Next Due</span>
                    <strong>
                      {transaction.nextDueDate ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Start Date</span>
                    <strong>
                      {transaction.startDate ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>End Date</span>
                    <strong>
                      {transaction.endDate ||
                        "No end date"}
                    </strong>
                  </div>

                </div>

                {/* Footer */}
                <div className="recurring-card-footer">

                  <button
                    className={`toggle-btn ${
                      transaction.active
                        ? "pause"
                        : "resume"
                    }`}
                    onClick={() =>
                      toggleActive(transaction)
                    }
                  >
                    {transaction.active
                      ? "Pause"
                      : "Resume"}
                  </button>

                  <div className="recurring-actions">

                    <button
                      className="edit-recurring-btn"
                      onClick={() =>
                        openEditForm(transaction)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-recurring-btn"
                      onClick={() =>
                        handleDelete(transaction.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >
          <div
            className="recurring-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <p className="page-eyebrow">
                  {editingTransaction
                    ? "UPDATE AUTOMATION"
                    : "NEW AUTOMATION"}
                </p>

                <h2>
                  {editingTransaction
                    ? "Edit Recurring Transaction"
                    : "Add Recurring Transaction"}
                </h2>
              </div>

              <button
                className="close-modal"
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Type */}
              <div className="form-group">
                <label>Transaction Type</label>

                <div className="type-selector">

                  <button
                    type="button"
                    className={
                      formData.type === "EXPENSE"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      handleTypeChange({
                        target: {
                          value: "EXPENSE",
                        },
                      })
                    }
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    className={
                      formData.type === "INCOME"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      handleTypeChange({
                        target: {
                          value: "INCOME",
                        },
                      })
                    }
                  >
                    Income
                  </button>

                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {getFilteredCategories().map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  placeholder="5000"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Frequency */}
              <div className="form-group">
                <label>Frequency</label>

                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="DAILY">
                    Daily
                  </option>

                  <option value="WEEKLY">
                    Weekly
                  </option>

                  <option value="MONTHLY">
                    Monthly
                  </option>

                  <option value="YEARLY">
                    Yearly
                  </option>
                </select>
              </div>

              {/* Dates */}
              <div className="form-row">

                <div className="form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="e.g. Netflix subscription"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              {/* Actions */}
              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-recurring-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTransaction
                    ? "Update"
                    : "Create"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default RecurringTransactions;