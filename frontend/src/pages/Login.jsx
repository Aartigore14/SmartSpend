import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", null, {
                params: {
                    email,
                    password,
                },
            });

            const { token, userId, name, role } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId,
                    name,
                    email,
                    role,
                })
            );

            navigate("/dashboard");

        } catch (err) {
    console.log("Login error:", err);
    console.log("Response:", err.response);

    setError(
        err.response?.data?.message ||
        err.response?.data ||
        `Login failed (${err.response?.status || "unknown error"})`
    );
} finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>SmartSpend</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate("/register")}>
                    Register
                </button>
            </p>
        </div>
    );
}

export default Login;