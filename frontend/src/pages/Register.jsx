import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name,
                    email: email,
                    password: password,
                    role: "USER"
                }
            );

            setMessage("Registration successful! Please login.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div>
            <h1>SmartSpend</h1>
            <h2>Register</h2>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Name</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>
            </form>

            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            <br />

            <button onClick={() => navigate("/login")}>
                Already have an account? Login
            </button>
        </div>
    );
}

export default Register;