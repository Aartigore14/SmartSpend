import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/categories.css";

function Categories() {
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [typeFilter, setTypeFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        type: "EXPENSE",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch categories
    useEffect(() => {
        if (!user?.userId) {
            setError("User not found. Please login again.");
            setLoading(false);
            return;
        }

        fetchCategories();
    }, [user]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/categories/user/${user.userId}`
            );

            setCategories(response.data);
        } catch (err) {
            console.error("Failed to load categories:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load categories"
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Open add form
    const handleAddClick = () => {
        setEditingCategory(null);

        setFormData({
            name: "",
            type: "EXPENSE",
        });

        setError("");
        setShowForm(true);
    };

    // Open edit form
    const handleEditClick = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name,
            type: category.type?.toUpperCase() || "EXPENSE",
        });

        setError("");
        setShowForm(true);
    };

    // Add / update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryName = formData.name.trim();

        if (!categoryName) {
            setError("Please enter a category name.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const categoryData = {
                userId: user.userId,
                name: categoryName,
                type: formData.type.toUpperCase(),
            };

            if (editingCategory) {
                await api.put(
                    `/categories/${editingCategory.id}`,
                    categoryData
                );
            } else {
                await api.post(
                    "/categories",
                    categoryData
                );
            }

            setShowForm(false);
            setEditingCategory(null);

            await fetchCategories();
        } catch (err) {
            console.error("Failed to save category:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save category"
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/categories/${id}`);

            setCategories((previous) =>
                previous.filter(
                    (category) => category.id !== id
                )
            );
        } catch (err) {
            console.error("Failed to delete category:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };

    // Filter categories
    const filteredCategories = categories.filter(
        (category) => {
            const categoryType =
                category.type?.toUpperCase();

            const matchesType =
                typeFilter === "ALL" ||
                categoryType === typeFilter;

            const matchesSearch =
                category.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesType && matchesSearch;
        }
    );

    if (loading) {
        return (
            <div className="categories-page">
                <h2>Loading categories...</h2>
            </div>
        );
    }

    return (
        <div className="categories-page">

            {/* Header */}
            <div className="categories-header">

                <div>
                    <h1>Categories</h1>
                    <p>
                        Organize your income and expenses
                    </p>
                </div>

                <button
                    className="add-category-button"
                    onClick={handleAddClick}
                >
                    + Add Category
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="category-error">
                    {error}
                </div>
            )}

            {/* Toolbar */}
            <div className="category-toolbar">

                <div className="category-filters">

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
                    className="category-search"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

            </div>

            {/* Categories */}
            <div className="categories-card">

                {filteredCategories.length === 0 ? (

                    <div className="empty-categories">

                        <div className="empty-category-icon">
                            📂
                        </div>

                        <h3>
                            No categories found
                        </h3>

                        <p>
                            Create a category to organize
                            your transactions.
                        </p>

                        <button
                            onClick={handleAddClick}
                        >
                            + Add Category
                        </button>

                    </div>

                ) : (

                    <div className="categories-grid">

                        {filteredCategories.map(
                            (category) => {

                                const isIncome =
                                    category.type?.toUpperCase() ===
                                    "INCOME";

                                return (
                                    <div
                                        className="category-item"
                                        key={category.id}
                                    >

                                        <div className="category-info">

                                            <div
                                                className={
                                                    isIncome
                                                        ? "category-icon income"
                                                        : "category-icon expense"
                                                }
                                            >
                                                {isIncome
                                                    ? "↗"
                                                    : "↘"}
                                            </div>

                                            <div>

                                                <h3>
                                                    {
                                                        category.name
                                                    }
                                                </h3>

                                                <span
                                                    className={
                                                        isIncome
                                                            ? "category-type income"
                                                            : "category-type expense"
                                                    }
                                                >
                                                    {isIncome
                                                        ? "INCOME"
                                                        : "EXPENSE"}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="category-actions">

                                            <button
                                                onClick={() =>
                                                    handleEditClick(
                                                        category
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

            {/* Add/Edit Modal */}
            {showForm && (

                <div className="category-modal-overlay">

                    <div className="category-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p>
                                    Create a category for
                                    your finances
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

                            <div className="form-group">

                                <label>
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Food"
                                    required
                                />

                            </div>

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
                                        : editingCategory
                                        ? "Update Category"
                                        : "Add Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Categories;