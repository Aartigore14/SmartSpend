import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">

            <div className="navbar-brand">
                <h2>SmartSpend</h2>
            </div>

            <div className="navbar-right">
                <span className="welcome-text">
                    Welcome, {user?.name || "User"}
                </span>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

        </header>
    );
}

export default Navbar;