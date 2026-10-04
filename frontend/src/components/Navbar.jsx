import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">

            <div className="navbar-brand">
                <NavLink to="/dashboard" onClick={closeMenu}>
                    SmartSpend
                </NavLink>
            </div>

            <button
                className="mobile-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
            >
                ☰
            </button>

            <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>

                <NavLink to="/dashboard" onClick={closeMenu}>
                    Dashboard
                </NavLink>

                <NavLink to="/transactions" onClick={closeMenu}>
                    Transactions
                </NavLink>

                <NavLink to="/categories" onClick={closeMenu}>
                    Categories
                </NavLink>

                <NavLink to="/budgets" onClick={closeMenu}>
                    Budgets
                </NavLink>

                <NavLink to="/savings-goals" onClick={closeMenu}>
                    Savings Goals
                </NavLink>

                <NavLink
                    to="/recurring-transactions"
                    onClick={closeMenu}
                >
                    Recurring
                </NavLink>

                <NavLink to="/notifications" onClick={closeMenu}>
                    Notifications
                </NavLink>

                <NavLink to="/analytics" onClick={closeMenu}>
                    Analytics
                </NavLink>

                <NavLink to="/ai-insights" onClick={closeMenu}>
                    AI Insights
                </NavLink>

                <div className="navbar-user-mobile">
                    <span>
                        Welcome, {user?.name || "User"}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>
                </div>

            </nav>

            <div className="navbar-user-desktop">
                <span>
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