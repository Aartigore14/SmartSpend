import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ai-insights.css";

function AIInsights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const savedUser = JSON.parse(localStorage.getItem("smartspend_user"));
    const userId = savedUser?.userId;

    const fetchInsights = async () => {
        if (!userId) {
            setError("User information not found. Please login again.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/ai-insights/user/${userId}`);
            setInsights(response.data);
        } catch (err) {
            console.error("Failed to fetch AI insights:", err);
            setError("Unable to load AI insights.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const generateInsight = async () => {
        if (!userId) {
            setError("User information not found. Please login again.");
            return;
        }

        try {
            setGenerating(true);
            setError("");

            await api.post(`/ai-insights/generate/${userId}`);

            await fetchInsights();
        } catch (err) {
            console.error("Failed to generate insight:", err);

            const message =
                err.response?.data?.message ||
                "Unable to generate insight.";

            setError(message);
        } finally {
            setGenerating(false);
        }
    };

    const deleteInsight = async (id) => {
        try {
            await api.delete(`/ai-insights/${id}`);

            setInsights((previous) =>
                previous.filter((insight) => insight.id !== id)
            );
        } catch (err) {
            console.error("Failed to delete insight:", err);
            setError("Unable to delete insight.");
        }
    };

    const formatDate = (date) => {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <><Navbar/>
        <div className="ai-insights-page">

            {/* Header */}
            <div className="ai-insights-header">
                <div>
                    <h1>✨ AI Insights</h1>
                    <p>
                        Understand your spending patterns and get
                        personalized suggestions.
                    </p>
                </div>

                <button
                    className="generate-insight-btn"
                    onClick={generateInsight}
                    disabled={generating}
                >
                    {generating ? "Generating..." : "✨ Generate Insight"}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="ai-error">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="ai-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your insights...</p>
                </div>
            ) : insights.length === 0 ? (

                /* Empty State */
                <div className="ai-empty-state">
                    <div className="empty-icon">💡</div>

                    <h2>No insights yet</h2>

                    <p>
                        Generate your first spending insight to understand
                        where most of your money is going.
                    </p>

                    <button
                        className="generate-insight-btn"
                        onClick={generateInsight}
                        disabled={generating}
                    >
                        {generating
                            ? "Generating..."
                            : "Generate Your First Insight"}
                    </button>
                </div>

            ) : (

                /* Insights */
                <div className="insights-container">

                    {/* Latest Insight */}
                    <section className="latest-insight-section">

                        <div className="section-title">
                            <span>💡</span>
                            <h2>Latest Insight</h2>
                        </div>

                        {insights[insights.length - 1] && (
                            <div className="latest-insight-card">

                                <div className="insight-card-top">
                                    <span className="insight-type">
                                        {insights[insights.length - 1].insightType
                                            ?.replaceAll("_", " ")}
                                    </span>

                                    <span className="insight-date">
                                        {formatDate(
                                            insights[insights.length - 1]
                                                .generatedAt
                                        )}
                                    </span>
                                </div>

                                <div className="latest-insight-content">
                                    <div className="insight-icon">
                                        💡
                                    </div>

                                    <p>
                                        {
                                            insights[insights.length - 1]
                                                .content
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Previous Insights */}
                    <section className="previous-insights-section">

                        <div className="section-title">
                            <span>📚</span>
                            <h2>Previous Insights</h2>
                        </div>

                        <div className="insights-list">

                            {[...insights]
                                .reverse()
                                .slice(1)
                                .map((insight) => (
                                    <div
                                        className="insight-history-card"
                                        key={insight.id}
                                    >
                                        <div className="history-content">

                                            <div className="history-icon">
                                                💡
                                            </div>

                                            <div className="history-details">

                                                <div className="history-header">
                                                    <span className="insight-type">
                                                        {insight.insightType
                                                            ?.replaceAll(
                                                                "_",
                                                                " "
                                                            )}
                                                    </span>

                                                    <span className="insight-date">
                                                        {formatDate(
                                                            insight.generatedAt
                                                        )}
                                                    </span>
                                                </div>

                                                <p>
                                                    {insight.content}
                                                </p>

                                            </div>
                                        </div>

                                        <button
                                            className="delete-insight-btn"
                                            onClick={() =>
                                                deleteInsight(insight.id)
                                            }
                                            title="Delete insight"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}

                        </div>
                    </section>
                </div>
            )}
        </div>
        </>
    );
}

export default AIInsights;