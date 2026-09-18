import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("smartspend_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            null,
            {
                params: {
                    email: email,
                    password: password
                }
            }
        );

        const loggedInUser = response.data;

        setUser(loggedInUser);
        localStorage.setItem(
            "smartspend_user",
            JSON.stringify(loggedInUser)
        );

        return loggedInUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("smartspend_user");
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