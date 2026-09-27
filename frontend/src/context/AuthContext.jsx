import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("smartspend_user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        const response = await api.post(
            "/auth/login",
            null,
            {
                params: {
                    email,
                    password,
                },
            }
        );

        const loggedInUser = response.data;

        setUser(loggedInUser);

        localStorage.setItem(
            "smartspend_user",
            JSON.stringify(loggedInUser)
        );

        localStorage.setItem(
            "token",
            loggedInUser.token
        );

        return loggedInUser;
    };

    const logout = () => {
        setUser(null);

        localStorage.removeItem("smartspend_user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}