import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/savings-goals.css";

const initialForm = {
  name: "",
  targetAmount: "",
  currentAmount: "",
  targetDate: "",
  status: "ACTIVE",
};

function SavingsGoals() {
  const { user } = useAuth();

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/savings-goals/user/${user.userId}`
      );

      setGoals(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load savings goals.");
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

  const openAddForm = () => {
    setEditingGoal(null);
    setFormData(initialForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (goal) => {
    setEditingGoal(goal);

    setFormData({
      name: goal.name || "",
      targetAmount: goal.targetAmount || "",
      currentAmount: goal.currentAmount || "",
      targetDate: goal.targetDate || "",
      status: goal.status || "ACTIVE",
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGoal(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const target = Number(formData.targetAmount);
    const current = Number(formData.currentAmount || 0);

    if (!formData.name.trim()) {
      setError("Please enter a goal name.");
      return;
    }

    if (!target || target <= 0) {
      setError("Target amount must be greater than 0.");
      return;
    }

    if (current < 0) {
      setError("Current amount cannot be negative.");
      return;
    }

    if (current > target) {
      setError("Current amount cannot be greater than target amount.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        userId: user.userId,
        name: formData.name.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: formData.targetDate || null,
        status: formData.status,
      };

      if (editingGoal) {
        await api.put(
          `/savings-goals/${editingGoal.id}`,
          payload
        );
      } else {
        await api.post("/savings-goals", payload);
      }

      closeForm();
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to save savings goal."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/savings-goals/${id}`);
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setError("Failed to delete savings goal.");
    }
  };

  const calculateProgress = (goal) => {
    const target = Number(goal.targetAmount || 0);
    const current = Number(goal.currentAmount || 0);

    if (target <= 0) return 0;

    return Math.min((current / target) * 100, 100);
  };

  const activeGoals = goals.filter(
    (goal) => goal.status?.toUpperCase() === "ACTIVE"
  );

  const completedGoals = goals.filter(
    (goal) => goal.status?.toUpperCase() === "COMPLETED"
  );

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount || 0),
    0
  );

  if (loading) {
    return (
      <div className="savings-page">
        <div className="savings-loading">
          Loading savings goals...
        </div>
      </div>
    );
  }

  return (
    <div className="savings-page">

      {/* Header */}
      <div className="savings-header">
        <div>
          <p className="page-eyebrow">FINANCIAL GOALS</p>
          <h1>Savings Goals</h1>
          <p>
            Set targets, track your progress, and stay consistent
            with your savings.
          </p>
        </div>

        <button
          className="add-goal-btn"
          onClick={openAddForm}
        >
          + Add Goal
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="savings-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="savings-summary">

        <div className="summary-card">
          <span>Total Goals</span>
          <strong>{goals.length}</strong>
        </div>

        <div className="summary-card">
          <span>Active Goals</span>
          <strong>{activeGoals.length}</strong>
        </div>

        <div className="summary-card">
          <span>Total Target</span>
          <strong>
            ₹{totalTarget.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="summary-card">
          <span>Total Saved</span>
          <strong>
            ₹{totalSaved.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      {/* Goals */}
      {goals.length === 0 ? (
        <div className="savings-empty">
          <div className="empty-icon">🎯</div>
          <h2>No savings goals yet</h2>
          <p>
            Create your first goal and start tracking your
            savings journey.
          </p>

          <button
            className="empty-add-btn"
            onClick={openAddForm}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">

          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const status = goal.status?.toUpperCase();

            return (
              <div className="goal-card" key={goal.id}>

                <div className="goal-card-header">
                  <div>
                    <h2>{goal.name}</h2>

                    {goal.targetDate && (
                      <p className="goal-date">
                        Target: {goal.targetDate}
                      </p>
                    )}
                  </div>

                  <span
                    className={`goal-status ${
                      status === "COMPLETED"
                        ? "completed"
                        : "active"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="goal-amounts">

                  <div>
                    <span>Saved</span>
                    <strong>
                      ₹
                      {Number(
                        goal.currentAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Target</span>
                    <strong>
                      ₹
                      {Number(
                        goal.targetAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>

                <div className="goal-progress-section">

                  <div className="progress-info">
                    <span>Progress</span>
                    <strong>
                      {progress.toFixed(0)}%
                    </strong>
                  </div>

                  <div className="goal-progress-bar">
                    <div
                      className={`goal-progress-fill ${
                        status === "COMPLETED"
                          ? "completed"
                          : ""
                      }`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="goal-card-footer">

                  <div className="remaining-amount">
                    <span>Remaining</span>
                    <strong>
                      ₹
                      {Math.max(
                        Number(goal.targetAmount || 0) -
                          Number(goal.currentAmount || 0),
                        0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="goal-actions">
                    <button
                      className="edit-goal-btn"
                      onClick={() => openEditForm(goal)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-goal-btn"
                      onClick={() => handleDelete(goal.id)}
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

      {/* Completed summary */}
      {completedGoals.length > 0 && (
        <div className="completed-summary">
          🎉 {completedGoals.length} goal
          {completedGoals.length > 1 ? "s" : ""} completed!
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >
          <div
            className="goal-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <p className="page-eyebrow">
                  {editingGoal
                    ? "UPDATE GOAL"
                    : "NEW GOAL"}
                </p>

                <h2>
                  {editingGoal
                    ? "Edit Savings Goal"
                    : "Create Savings Goal"}
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

              <div className="form-group">
                <label>Goal Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. New Laptop"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Target Amount</label>

                  <input
                    type="number"
                    name="targetAmount"
                    placeholder="50000"
                    min="1"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Current Savings</label>

                  <input
                    type="number"
                    name="currentAmount"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Target Date</label>

                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>
                </div>

              </div>

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
                  className="save-goal-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingGoal
                    ? "Update Goal"
                    : "Create Goal"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default SavingsGoals;